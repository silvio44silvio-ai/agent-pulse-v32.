
import React, { useState } from 'react';
import { NavSection, UserProfile, AppLanguage } from '../types';
import { getNavItems, LANG_OPTIONS } from '../constants';
import { LogOut, Globe, ChevronDown, ShieldAlert, Zap, Megaphone, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';

// SVGs de Ultra Fidelidade - App Icons Oficiais
const WhatsAppIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" rx="220" fill="#25D366"/>
    <path d="M512.1 185C331.5 185 185 331.5 185 512.1C185 574.9 202.6 633.6 233 683.5L186.5 839L347.5 793.5C395.7 819.8 452 839.2 512.1 839.2C692.7 839.2 839.2 692.7 839.2 512.1C839.2 331.5 692.7 185 512.1 185ZM512.1 239.9C662.6 239.9 784.4 361.7 784.4 512.1C784.4 662.6 662.6 784.4 512.1 784.4C462.2 784.4 415.1 770.9 374.6 748.7L362.8 742.3L267.8 769.1L294.5 674.1L287.1 662.4C261.5 622.3 246.6 569.7 246.6 512.1C246.6 361.7 368.5 239.9 512.1 239.9ZM401.7 380C393 380 379.5 383.4 370.7 392.3C361.8 401.2 336.2 425.5 336.2 474.8C336.2 524 371.8 571.6 376.5 578.4C381.3 585.2 446.5 684.7 545.7 727.6C569 737.7 587.4 744.2 601.5 748.7C624.8 756.1 645.7 755 662.2 752.6C680.7 749.8 719 729.4 726.8 707.3C734.5 685.2 734.5 666.4 732.2 662.6C729.8 658.7 722.9 656.3 713.2 651.4C703.5 646.6 655.4 622.9 646.6 619.6C637.9 616.2 631.6 614.4 625.3 624.1C619.1 633.8 601.1 654.7 595.7 661C590.3 667.3 584.6 668.5 574.8 663.6C565.1 658.7 533.5 648.3 496.1 615C467 589 447.5 557 441.7 547.3C435.9 537.6 441 532.4 445.9 527.6C450.2 523.2 455.6 516.2 460.5 511.1C465.3 505.9 467 501.7 470.2 495.2C473.4 488.7 471.8 483 469.4 478.1C467 473.2 449 428.7 440.7 410.1C433.4 391.9 426.1 394.3 420.3 394.3C415 394.3 408.5 393.8 401.7 393.8V380Z" fill="white"/>
  </svg>
);

const TelegramIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" rx="220" fill="#229ED9"/>
    <path d="M784.4 316.6C789 313.3 792 312 795.3 313.3C798.6 314.6 798.6 319.9 798.6 319.9L713.2 732.2C713.2 732.2 710.6 744.1 700 746.8C689.4 749.5 678.8 741.5 678.8 741.5L478.1 593.2L382.1 688.5L387.4 606.5L347.5 738.8C347.5 738.8 344.8 748.1 334.2 748.1C323.6 748.1 318.3 738.8 318.3 738.8L209.7 618.3C209.7 618.3 203 610.4 213.6 605.1C224.2 599.8 784.4 316.6 784.4 316.6Z" fill="white" opacity="0.2"/>
    <path d="M800 300L220 540C205 545 205 555 215 560L360 610L695 380C710 370 725 375 710 390L425 645L410 755C410 770 420 770 430 760L495 695L620 790C640 805 655 800 660 775L755 325C760 305 750 295 735 300L800 300Z" fill="white"/>
  </svg>
);

const InternalChatIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" rx="220" fill="#E65100"/>
    <path d="M512 250C334.2 250 190 367.3 190 512C190 585.6 227.1 651.2 287.5 698.5L245 800L365.2 765.4C410.5 784.2 460.1 794 512 794C689.8 794 834 676.7 834 532C834 387.3 689.8 270 512 270V250Z" fill="white" fillOpacity="0.2"/>
    <path d="M512 270C334.2 270 190 387.3 190 532C190 585.6 227.1 631.2 287.5 678.5L245 780L365.2 745.4C410.5 764.2 460.1 774 512 774C689.8 774 834 656.7 834 512C834 367.3 689.8 250 512 250V270Z" fill="white"/>
    <circle cx="380" cy="512" r="40" fill="#E65100"/>
    <circle cx="512" cy="512" r="40" fill="#E65100"/>
    <circle cx="644" cy="512" r="40" fill="#E65100"/>
  </svg>
);

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
  onToggleTheme
}: SidebarProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const currentLang = profile?.language || 'pt';
  const navItems = getNavItems(currentLang);

  const selectedLang = LANG_OPTIONS.find(l => l.code === currentLang);
  const hasTelegram = !!(profile?.telegramBotToken && profile?.telegramChatId);

  const handleWhatsAppProfile = () => {
    if (!profile?.phone) {
      onNavigate(NavSection.Settings);
      return;
    }
    let cleaned = profile.phone.replace(/\D/g, '');
    if (cleaned.length === 11 || cleaned.length === 10) cleaned = '55' + cleaned;
    window.open(`https://wa.me/${cleaned}`, '_blank');
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-72 glass z-[150] flex flex-col border-r border-white/5 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 pb-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer active:scale-95 transition-transform group"
            onClick={onLogoClick}
          >
            <Logo size={48} theme={theme} />
          </div>
          
          <button 
            onClick={onToggleTheme}
            className={`p-2 rounded-xl transition-all border ${theme === 'dark' ? 'bg-slate-800 border-white/10 text-amber-400' : 'bg-slate-100 border-black/5 text-indigo-600'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Canais Operacionais */}
        <div className="space-y-4">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Canais Operacionais</p>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={handleWhatsAppProfile}
              className="flex flex-col items-center gap-1.5 group transition-all"
            >
              <div className="group-hover:scale-110 group-active:scale-95 transition-transform shadow-lg shadow-[#25D366]/20 rounded-[12px] overflow-hidden">
                <WhatsAppIcon size={44} />
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase">Zap</span>
            </button>

            <button 
              onClick={() => hasTelegram ? window.open(`https://t.me/${profile?.telegramBotToken?.split(':')[0]}`, '_blank') : onNavigate(NavSection.Settings)}
              className="flex flex-col items-center gap-1.5 group transition-all"
            >
              <div className={`group-hover:scale-110 group-active:scale-95 transition-transform shadow-lg shadow-[#229ED9]/20 rounded-[12px] overflow-hidden ${hasTelegram ? '' : 'opacity-40 grayscale'}`}>
                <TelegramIcon size={44} />
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase">Tele</span>
            </button>

            <button 
              onClick={() => onNavigate(NavSection.Messenger)}
              className="flex flex-col items-center gap-1.5 group transition-all"
            >
              <div className="group-hover:scale-110 group-active:scale-95 transition-transform shadow-lg shadow-orange-600/20 rounded-[12px] overflow-hidden">
                <InternalChatIcon size={44} />
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase">Chat</span>
            </button>
          </div>
        </div>

        <button 
          onClick={() => onNavigate(NavSection.Messenger)}
          className={`w-full flex items-center gap-4 p-3.5 border rounded-2xl transition-all duration-500 group shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-orange-600/20 to-amber-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
             <Megaphone size={20} fill="currentColor" />
          </div>
          <div className="text-left">
             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Chamado Squad</p>
             <p className="text-[8px] font-bold text-slate-500 uppercase">Orientar & Criar Grupos</p>
          </div>
        </button>
      </div>

      <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar pt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as NavSection)}
            className={`w-full flex items-center justify-between px-6 py-3.5 rounded-[20px] transition-all duration-300 ${
              activeSection === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 border border-indigo-500/30' 
                : theme === 'dark' ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={activeSection === item.id ? 'text-white' : 'text-indigo-400'}>{item.icon}</span>
              <span className="font-bold text-[13px]">{item.label}</span>
            </div>
          </button>
        ))}

        {isAdminUnlocked && (
          <button
            onClick={() => onNavigate(NavSection.Admin)}
            className="w-full flex items-center gap-4 px-6 py-3.5 rounded-[20px] mt-4 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-black text-[10px] uppercase tracking-widest"
          >
            <ShieldAlert size={18} /> Admin Master
          </button>
        )}
      </nav>

      <div className="px-6 py-8 mt-auto border-t border-white/5 space-y-4">
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all group ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-black/5'}`}
          >
            <div className="flex items-center gap-3">
              <Globe size={14} className="text-indigo-400" />
              <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{selectedLang?.label}</span>
            </div>
            <ChevronDown size={12} className={`text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          {isLangOpen && (
            <div className={`absolute bottom-full left-0 w-full mb-2 border rounded-2xl overflow-hidden z-[100] shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-black/10'}`}>
              {LANG_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { onLanguageChange(lang.code); setIsLangOpen(false); }}
                  className={`w-full text-left px-5 py-3 text-[9px] font-black tracking-widest transition-all ${currentLang === lang.code ? 'text-indigo-400 bg-indigo-600/5' : 'text-slate-500 hover:bg-indigo-50'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-3 text-slate-500 hover:text-rose-400 font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};
