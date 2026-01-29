
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile, ChatMessage } from '../types';
import { initChatSession } from '../services/geminiService';
import { Send, User, Bot, Loader2, Sparkles, Calendar, CheckCircle2, ShieldCheck, MapPin, Cpu } from 'lucide-react';

interface IAAssistantProps {
  profile: UserProfile;
}

export const IAAssistant = ({ profile }: IAAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: `Rodney Protocol On. Olá, sou Rodney, seu Engenheiro Sênior de IA. Como posso otimizar sua performance hoje na ${profile.agencyName}?`, 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const session = initChatSession(profile);
    setChat(session);
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 2 && currentStep === 1) setCurrentStep(2);
    if (messages.length > 5 && currentStep === 2) setCurrentStep(3);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const result = await chat.sendMessage({ message: input });
      setMessages(prev => [...prev, { role: 'model', text: result.text || 'Erro técnico no Rodney Protocol.', timestamp: new Date() }]);
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-240px)] flex flex-col glass rounded-[32px] lg:rounded-[40px] border border-white/10 overflow-hidden shadow-2xl relative">
      <div className="p-4 border-b border-white/5 bg-slate-900/40 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Cpu className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-black text-sm text-white italic">RODNEY</h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Senior Engineer Online</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 flex-1 max-w-xs px-8">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`h-1 flex-1 rounded-full ${currentStep >= i ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
             ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 bg-slate-950/20 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] lg:max-w-[70%] flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-4 rounded-[22px] text-xs lg:text-sm font-medium ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl' : 'glass-dark text-slate-200 rounded-tl-none border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              </div>
              <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">Rodney is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 lg:p-6 bg-slate-900/60 border-t border-white/5 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Rodney, qual a estratégia para o lead do Aquarius?"
            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs font-medium text-white shadow-inner"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl shadow-lg disabled:opacity-30 transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
