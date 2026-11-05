import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';

interface AiSupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTracking: (orderId?: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: "Welcome to AURA Concierge. I am powered by Google Gemini 2.5 Flash to assist you with product specifications, real-time order tracking, warranty coverage, or personalized recommendations.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTED_QUERIES = [
  "Where is my order ORD-89210?",
  "Recommend headphones for studio audio",
  "What is your 30-day return policy?",
  "Is the Chronos Smartwatch in stock?",
];

export const AiSupportDrawer: React.FC<AiSupportDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToTracking,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "I am here to assist with any questions regarding our collection.";

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: "Our concierge server is currently processing requests. If you are inquiring about order ORD-89210, it is currently Out for Delivery with Aura Express Courier (~20 mins away).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-display text-slate-950">AURA Concierge</h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-500">24/7 Intelligent Shopping &amp; Order Support</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Support"
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-800 border border-slate-200/60'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <div
                  className={`text-[10px] font-mono mt-2 text-right ${
                    msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              </div>
              <span className="font-mono text-[11px]">Consulting Gemini 2.5 Flash...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Inquiries */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100">
          <div className="text-[11px] font-medium text-slate-500 mb-1.5">Common inquiries:</div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUERIES.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                className="text-[11px] bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about products, order tracking, returns..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
