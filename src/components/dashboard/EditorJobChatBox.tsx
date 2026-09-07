import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, Trash2 } from 'lucide-react';
import type { Database } from '../../types/database.types';
import { io } from 'socket.io-client';
import { fetchChatMessages, sendChatMessage, markChatAsRead, deleteChatMessage, deleteEntireChat } from '../../lib/api';

type Message = Database['public']['Tables']['messages_studio']['Row'];
type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'];

interface Props {
  jobId: string;
  currentUserId: string;
  chatType?: 'public' | 'internal';
}

export default function EditorJobChatBox({ jobId, currentUserId, chatType = 'public' }: Props) {
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

  const handleDeleteChat = async () => {
    if (!window.confirm('Are you sure you want to delete this entire chat conversation? This cannot be undone.')) return;
    
    try {
      await deleteEntireChat(jobId);
      // The socket event 'chatDeleted' will clear the messages list
    } catch (error: any) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat.');
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
        return <span key={i} className="bg-brand-red/10 text-brand-red px-1 py-0.5 rounded font-medium">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const filteredJobs = availableJobs.filter((job: any) => {
    const name = job.media_assets_studio?.file_name || job.id;
    return name.toLowerCase().includes(mentionFilter);
  });

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white mt-8 shadow-sm">
      <div className={`border-b px-4 py-3 font-semibold flex justify-between items-center ${chatType === 'internal' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-gray-50 text-gray-800 border-gray-200'}`}>
        <span>{chatType === 'internal' ? 'Internal Notes (Private)' : 'Job Discussion'}</span>
        <button
          onClick={handleDeleteChat}
          className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
          title="Delete entire chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${chatType === 'internal' ? 'bg-amber-50/30' : 'bg-gray-50/50'}`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-center gap-2`}>
                {isMe && (
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    disabled={isDeleting === msg.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div 
                  className={`max-w-[70%] rounded-2xl px-4 py-2 relative flex items-start gap-2 ${
                    isMe 
                      ? 'bg-brand-red text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  } ${isDeleting === msg.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1">
                    
                    {!isMe && (
                      <span className={`text-[9px] font-bold uppercase mb-1 block px-1.5 py-0.5 rounded w-max tracking-widest ${
                        msg.sender_role === 'editor' ? 'bg-purple-100 text-purple-700' :
                        msg.sender_role === 'admin' ? 'bg-red-100 text-red-700' :
                        msg.sender_role === 'creator' ? 'bg-blue-100 text-blue-700' :
                        msg.sender_role === 'kid' ? 'bg-pink-100 text-pink-700' :
                        msg.sender_role === 'doctor' ? 'bg-teal-100 text-teal-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {msg.sender_role === 'kid' ? 'KID/PARENT' : msg.sender_role === 'doctor' ? 'DOCTOR/HOSPITAL' : msg.sender_role || 'USER'}
                      </span>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{renderMessageContent(msg.content)}</p>

                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-red-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative border-t border-gray-200 bg-white px-4 py-3">
        {showMentions && filteredJobs.length > 0 && (
          <div className="absolute bottom-full mb-2 left-4 bg-white border border-gray-200 rounded-lg shadow-lg w-64 max-h-48 overflow-y-auto z-10">
            {filteredJobs.map((job: any) => (
              <button
                key={job.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 focus:bg-gray-50 truncate"
                onClick={() => handleMentionSelect(job)}
              >
                {job.media_assets_studio?.file_name || job.id}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message... (Use @ to tag a job)"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-full bg-brand-red p-2 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
