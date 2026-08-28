import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send } from 'lucide-react';
import type { Database } from '../../types/database.types';
import { fetchChatMessages, sendChatMessage, markChatAsRead } from '../../lib/api';

type Message = Database['public']['Tables']['messages_studio']['Row'];
type ProductionJob = Database['public']['Tables']['production_jobs_studio']['Row'];

interface Props {
  jobId: string;
  currentUserId: string;
}

export default function JobChatBox({ jobId, currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [availableJobs, setAvailableJobs] = useState<ProductionJob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchAvailableJobs();

    // Rely on polling to synchronize messages with the Node.js backend
    const pollInterval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [jobId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await fetchChatMessages(jobId);
      setMessages(data as Message[]);
      
      // Mark as read in the background
      const hasUnread = data.some((m: Message) => !m.is_read && m.sender_id !== currentUserId);
      if (hasUnread) {
        await markChatAsRead(jobId, currentUserId);
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
      await sendChatMessage(jobId, currentUserId, newMessage);
      setNewMessage('');
      fetchMessages(); // instantly refresh
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(`Failed to send message: ${error.message}`);
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
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-semibold text-gray-800">
        Job Discussion
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe 
                      ? 'bg-brand-red text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{renderMessageContent(msg.content)}</p>
                  <span className={`text-[10px] block mt-1 ${isMe ? 'text-red-100' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
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
