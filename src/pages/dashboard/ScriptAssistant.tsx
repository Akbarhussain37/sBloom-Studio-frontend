import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageSquare, FiCommand, FiRefreshCw, FiCopy, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

// --- Role-Specific Configuration ---
const ROLE_CONFIG = {
  doctor: {
    greeting: "Hi Doc! Ready to share your expertise? Let's write a clear, engaging, and medically accurate script.",
    genres: ['Health Tip (60s Reel)', 'Myth Busting', 'Procedure Explainer', 'Patient FAQ'],
    systemPrompt: "You are a specialized scriptwriter for medical professionals. Keep the tone authoritative but accessible, avoid overly complex jargon, and ensure the script fits within 60 seconds. Always include a strong hook and a clear Call to Action (CTA)."
  },
  creator: {
    greeting: "Hey Creator! Let's draft your next viral hit. What are we filming today?",
    genres: ['Lifestyle Vlog', 'Tech Review', 'Comedy Skit', 'Trending Sound / Dance Hook'],
    systemPrompt: "You are a viral content scriptwriter. Focus on high-retention hooks, fast-paced dialogue, and engaging visual cues. Structure the script with timestamped sections."
  },
  kid: {
    greeting: "Hi there! Let's make an awesome video together! What fun topic are we exploring?",
    genres: ['Toy Unboxing', 'Fun Science Fact', 'Gaming Highlights', 'Storytime'],
    systemPrompt: "You are a friendly and enthusiastic scriptwriter for young creators. Use simple, energetic language. Include ideas for fun sound effects or animations. Keep it very short and safe."
  },
  admin: {
    greeting: "Admin mode active. Test the script generation pipeline.",
    genres: ['Promo Video', 'Feature Announcement', 'Studio Update'],
    systemPrompt: "You are a professional scriptwriter for sBloom Studio's internal marketing."
  }
};

export default function ScriptAssistant() {
  const { profile } = useAuth();
  
  // Default to creator if role is missing/unknown
  const roleKey = (profile?.role && profile.role in ROLE_CONFIG) 
    ? (profile.role as keyof typeof ROLE_CONFIG) 
    : 'creator';
  
  const config = ROLE_CONFIG[roleKey];

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: config.greeting }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response Delay
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse = "";
      if (text.toLowerCase().includes("health") || text.toLowerCase().includes("doctor")) {
        aiResponse = "**[HOOK - 0:00]**\n(You standing in the clinic holding an apple)\n*\"Did you know an apple a day doesn't actually keep the doctor away if you ignore your sleep?\"*\n\n**[BODY - 0:10]**\n(Cut to close up)\n*\"Sleep is the foundation of your immune system...\"*\n\n**[CTA - 0:50]**\n*\"Follow for more real medical facts!\"*";
      } else {
        aiResponse = "**[HOOK - 0:00]**\n(Fast zoom in)\n*\"Stop scrolling! If you want to level up your content in 2026, you need to hear this.\"*\n\n**[BODY - 0:10]**\n(B-roll footage playing)\n*\"This new lighting trick changes everything...\"*\n\n**[CTA - 0:50]**\n*\"Save this video for your next shoot!\"*";
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 1500);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-red to-[#F02865] flex items-center justify-center shadow-md">
            <FiCommand className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-heading tracking-tight">Script Bot</h1>
            <p className="text-sm font-medium text-slate-500 capitalize">{profile?.role} Mode</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#F7F9FC]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm
                  ${msg.role === 'user' ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}
                >
                  {msg.role === 'user' ? (
                     <div className="text-white text-xs font-bold">{profile?.full_name?.charAt(0) || 'U'}</div>
                  ) : (
                    <FiCommand className="text-brand-red text-sm" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="group relative">
                  <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm whitespace-pre-wrap'}`}
                  >
                    {msg.content}
                  </div>
                  
                  {/* Copy Button (Only for assistant) */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute -right-10 top-2 p-1.5 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-md shadow-sm border border-slate-100"
                      title="Copy script"
                    >
                      {copiedId === msg.id ? <FiCheck className="text-green-500" /> : <FiCopy />}
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
                  <FiCommand className="text-brand-red text-sm" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        
        {/* Genre Chips */}
        {messages.length < 3 && !isTyping && (
          <div className="flex flex-wrap gap-2 mb-4 px-2">
            {config.genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleSend(`Write a script for a ${genre}`)}
                className="px-4 py-1.5 rounded-full border border-slate-200 bg-[#F7F9FC] text-slate-600 text-xs font-semibold hover:border-brand-red hover:text-brand-red transition-colors whitespace-nowrap"
              >
                + {genre}
              </button>
            ))}
          </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          className="relative flex items-end gap-2"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe the video you want to make..."
            className="w-full bg-[#F7F9FC] border border-slate-200 rounded-2xl pl-5 pr-14 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-red focus:border-brand-red transition-all resize-none custom-scrollbar"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '150px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(inputValue);
              }
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2.5 bg-brand-red text-white rounded-xl hover:bg-[#F02865] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <FiSend className="text-lg" />
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-slate-400 font-medium">
            AI can make mistakes. Always review generated scripts for accuracy. (System Prompt: {roleKey})
          </p>
        </div>
      </div>
    </div>
  );
}
