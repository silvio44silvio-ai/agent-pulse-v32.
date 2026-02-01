import React, { useState } from 'react';
import { NavSection, UserProfile, AppLanguage } from '../types';
import { getNavItems, LANG_OPTIONS } from '../constants';
import { LogOut, Globe, ChevronDown, ShieldAlert, Zap, Megaphone, Sun, Moon, Crown, ArrowRight, MessageCircle, Send, MessageSquare } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  activeSection: NavSection;
  subscription: { type: string, expired: boolean, daysLeft: number };
  onNavigate: (section: NavSection) => void;
  onLogout: () => void;
  isAdminUnlocked: boolean;
  onLogoClick: () => void;
  profile?: UserProfile;
  onLanguageChange: (lang: AppLanguage) => void;
  isOpen?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar = ({ 
  activeSection, 
  onNavigate, 
  onLogout, 
  isAdminUnlocked, 
  onLogoClick, 
  profile,
  onLanguageChange,
  isOpen = false,
  theme,
  onToggleTheme,
  subscription
}: SidebarProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const currentLang = profile?.language || 'pt';
  const navItems = getNavItems(currentLang);

  const selectedLang = LANG_OPTIONS.find(l => l.code === currentLang);
  const hasTelegram = !!(profile?.telegramBotToken && profile?.telegramChatId);

  const handleWhatsAppClick = () => {
    if (!profile?.phone) {
      onNavigate(NavSection.Settings);
      return;
    }
    let cleaned = profile.phone.replace(/\D/g, '');
    if (cleaned.length === 11 || cleaned.length === 10) cleaned = '55' + cleaned;
    window.open(`https://wa.me/${cleaned}`, '_blank');
  };

  const isTrial = subscription.type === 'TRIAL';

  return (
    <aside className={`fixed left-0 top-0 h-screen max-h-screen w-64 glass z-[150] flex flex-col border-r border-white/5 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* 1. Header Fixo */}
      <div className="p-5 pb-3 flex flex-col gap-4 flex-shrink-0">
        <div className="flex items-center justify-between overflow-visible">
          <div 
            className="cursor-pointer active:scale-95 transition-transform group overflow-visible"
            onClick={onLogoClick}
          >
            <Logo size={32} theme={theme} showText={true} />
          </div>
          
          <button 
            onClick={onToggleTheme}
            className={`p-1.5 rounded-lg transition-all border shrink-0 ${theme === 'dark' ? 'bg-slate-800 border-white/10 text-amber-400' : 'bg-slate-100 border-black/5 text-indigo-600'}`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {isTrial && (
          <button 
            onClick={() => onNavigate(NavSection.Settings)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl border border-white/10 shadow-lg shadow-indigo-600/20 group animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-white/20 rounded-lg text-white">
                    <Crown size={14} className="animate-pulse" />
                 </div>
                 <div className="text-left">
                    <p className="text-[9px] font-black text-white uppercase tracking-tighter">Upgrade Pró</p>
                    <p className="text-[7px] text-white/70 font-bold uppercase">Acesso Ilimitado</p>
                 </div>
              </div>
              <ArrowRight size={12} className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}
      </div>

      {/* 2. Área de Navegação com Scrollbar Ativa */}
      <nav className="flex-grow flex-shrink min-h-0 px-3 py-4 overflow-y-auto overflow-x-hidden space-y-1 custom-scroll scroll-smooth">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Menu de Comando</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as NavSection)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group ${
              activeSection === item.id 
                ? 'bg-indigo-600 text-white shadow-lg border border-indigo-500/30' 
                : theme === 'dark' ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`transition-colors shrink-0 ${activeSection === item.id ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-500'}`}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
              </span>
              <span className="font-bold text-[11px] tracking-tight whitespace-nowrap uppercase">{item.label}</span>
            </div>
          </button>
        ))}

        {isAdminUnlocked && (
          <button
            onClick={() => onNavigate(NavSection.Admin)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mt-3 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-black text-[9px] uppercase tracking-widest whitespace-nowrap"
          >
            <ShieldAlert size={14} className="shrink-0" /> Admin
          </button>
        )}
      </nav>

      {/* 3. Alpha Communication Hub - Horizontal & Vibrante */}
      <div className="px-4 py-4 border-t border-white/5 bg-slate-950/40">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">CommHub Alpha</p>
        <div className="flex gap-3">
          {/* WhatsApp - Vibrant Green */}
          <button 
            onClick={handleWhatsAppClick}
            className="flex-1 aspect-square rounded-2xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 flex flex-col items-center justify-center gap-1 hover:bg-[#25D366] hover:text-white transition-all shadow-lg hover:shadow-[#25D366]/40 active:scale-90 group"
          >
            <MessageCircle size={20} fill="currentColor" fillOpacity={0.1} className="group-hover:fill-white" />
            <span className="text-[6px] font-black uppercase tracking-tighter">Zap</span>
          </button>
          
          {/* Telegram - Vibrant Blue */}
          <button 
            onClick={() => hasTelegram ? window.open(`https://t.me/${profile?.telegramBotToken?.split(':')[0]}`, '_blank') : onNavigate(NavSection.Settings)}
            className="flex-1 aspect-square rounded-2xl bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 flex flex-col items-center justify-center gap-1 hover:bg-[#0088cc] hover:text-white transition-all shadow-lg hover:shadow-[#0088cc]/40 active:scale-90 group"
          >
            <Send size={18} fill="currentColor" fillOpacity={0.1} className="group-hover:fill-white -rotate-12 group-hover:rotate-0 transition-transform" />
            <span className="text-[6px] font-black uppercase tracking-tighter">Tele</span>
          </button>
          
          {/* Internal Chat - Vibrant Orange */}
          <button 
            onClick={() => onNavigate(NavSection.Messenger)}
            className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-90 group ${activeSection === NavSection.Messenger ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40 border-orange-400' : 'bg-orange-600/10 text-orange-500 border border-orange-500/20 hover:bg-orange-600 hover:text-white shadow-lg'}`}
          >
            <MessageSquare size={18} fill="currentColor" fillOpacity={0.1} className="group-hover:fill-white" />
            <span className="text-[6px] font-black uppercase tracking-tighter">Chat</span>
          </button>
        </div>
      </div>

      {/* 4. Rodapé Fixo */}
      <div className="px-5 py-4 border-t border-white/5 space-y-3 flex-shrink-0 bg-slate-950/60">
        <div className="relative">
          <button 
