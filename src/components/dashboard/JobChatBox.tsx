import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Trash2, Paperclip, Smile, Mic } from 'lucide-react';
import type { Database } from '../../types/database.types';
import { io } from 'socket.io-client';
import { fetchChatMessages, sendChatMessage, markChatAsRead, deleteChatMessage, deleteEntireChat } from '../../lib/api';

type Message = Database['public']['Tables']['messages_studio']['Row'] & { sender_role?: string };
type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'];

interface Props {
  jobId: string;
  currentUserId: string;
  chatType?: 'public' | 'internal';
}

export default function JobChatBox({ jobId, currentUserId, chatType = 'public' }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [availableJobs, setAvailableJobs] = useState<ProductionJob[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchAvailableJobs();

    // Connect to Socket.io backend
    let socket: any;

    const setupSocket = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      socket = io('http://localhost:3000', {
        auth: { token }
      });

      socket.emit('joinRoom', { jobId, chatType });

      socket.on('newMessage', (message: Message) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        
        if (message.sender_id !== currentUserId) {
          markChatAsRead(jobId, currentUserId, chatType).catch(console.error);
        }
      });

      socket.on('messageDeleted', (data: { messageId: string, jobId: string }) => {
        if (data.jobId === jobId) {
          setMessages((prev) => prev.filter(m => m.id !== data.messageId));
        }
      });

      socket.on('chatDeleted', (data: { jobId: string }) => {
        if (data.jobId === jobId) {
          setMessages([]);
        }
      });
    };
    
    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [jobId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await fetchChatMessages(jobId, chatType);
      setMessages(data as Message[]);
      
      // Mark as read in the background
      const hasUnread = data.some((m: Message) => !m.is_read && m.sender_id !== currentUserId);
      if (hasUnread) {
        await markChatAsRead(jobId, currentUserId, chatType);
      }
    } catch (error) {
      console.error('Error fetching messages from backend:', error);
    }
  };

  const fetchAvailableJobs = async () => {
    // For admins, RLS allows viewing all jobs, so they can tag any job.
    // For normal users, RLS automatically restricts this to their own jobs.
    const { data, error } = await supabase
      .from('production_jobs_studio')
      .select('*, media_assets_studio(file_name)');
      
    if (!error && data) {
      setAvailableJobs(data as any);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendChatMessage(jobId, currentUserId, newMessage, chatType);
      setNewMessage('');
      fetchMessages(); // instantly refresh
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(`Failed to send message: ${error.message}`);
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message for everyone?')) return;
    
    setIsDeleting(messageId);
    try {
      await deleteChatMessage(messageId, jobId);
      // The socket event 'messageDeleted' will remove it from the list
    } catch (error: any) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Make sure you have permission.');
    } finally {
      setIsDeleting(null);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Basic mention logic
    const lastAt = value.lastIndexOf('@');
    if (lastAt !== -1) {
      const textAfterAt = value.substring(lastAt + 1);
      if (!textAfterAt.includes(' ')) {
        setShowMentions(true);
        setMentionFilter(textAfterAt.toLowerCase());
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (job: any) => {
    const fileName = job.media_assets_studio?.file_name || job.id;
    const lastAt = newMessage.lastIndexOf('@');
    const newValue = newMessage.substring(0, lastAt) + `[@Job: ${fileName}] ` ;
    setNewMessage(newValue);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const renderMessageContent = (content: string) => {
    // Basic regex to highlight the [@Job: something] mentions
    const mentionRegex = /(\[@Job: [^\]]+\])/g;
    const parts = content.split(mentionRegex);
    
    return parts.map((part, i) => {
      if (part.match(mentionRegex)) {
        return <span key={i} className="bg-brand-primary/10 text-brand-primary px-1 py-0.5 rounded font-medium">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const filteredJobs = availableJobs.filter((job: any) => {
    const name = job.media_assets_studio?.file_name || job.id;
    return name.toLowerCase().includes(mentionFilter);
  });

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-white shadow-sm border-t border-slate-100">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-10">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            
            // Generate initials
            let initials = 'U';
            if (msg.sender_role === 'admin') initials = 'AD';
            else if (msg.sender_role === 'editor') initials = 'ED';
            else if (msg.sender_role === 'creator') initials = 'CR';
            else initials = 'US';

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-start gap-3`}>
                {!isMe && (
                  <div className="w-10 h-10 rounded-full bg-[#EEF2F6] flex-shrink-0 flex items-center justify-center text-sm font-bold text-slate-600 mt-1">
                    {initials}
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[75%] relative ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-sm font-bold text-slate-800 capitalize">
                        {msg.sender_role || 'User'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}

                  <div 
                    className={`rounded-2xl px-5 py-3 relative shadow-sm border ${
                      isMe 
                        ? 'bg-slate-900 text-white rounded-br-sm border-slate-900' 
                        : 'bg-white text-slate-700 rounded-bl-sm border-slate-200'
                    } ${isDeleting === msg.id ? 'opacity-50' : ''}`}
                  >
                    {isMe && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        disabled={isDeleting === msg.id}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{renderMessageContent(msg.content)}</p>
                  </div>
                  
                  {isMe && (
                    <div className="flex justify-end px-1 mt-1">
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative border-t border-slate-100 bg-white p-4 pb-6">
        {showMentions && filteredJobs.length > 0 && (
          <div className="absolute bottom-full mb-2 left-4 bg-white border border-slate-200 rounded-xl shadow-lg w-64 max-h-48 overflow-y-auto z-10">
            {filteredJobs.map((job: any) => (
              <button
                key={job.id}
                type="button"
                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 focus:bg-slate-50 truncate transition-colors border-b border-slate-50 last:border-0"
                onClick={() => handleMentionSelect(job)}
              >
                <div className="font-semibold text-slate-700">{job.media_assets_studio?.file_name || job.id}</div>
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-5xl mx-auto">
          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-full px-2 py-1.5 focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary transition-all shadow-sm">
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-red-700 disabled:opacity-50 transition-all shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
