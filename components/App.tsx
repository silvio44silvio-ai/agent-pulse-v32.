
import React, { useState, useEffect, useMemo } from 'react';
import { NavSection, UserProfile, Lead } from '../types';
import { MOCK_LEADS, getNavItems } from '../constants';
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../components/Dashboard';
import { SocialRadar } from '../components/SocialRadar';
import { LeadList } from '../components/LeadList';
import { IAAssistant } from '../components/IAAssistant';
import { Settings } from '../components/Settings';
import { HelpCenter } from '../components/HelpCenter';
import { Login } from '../components/Login';
import { Menu, X, Bell, Lock, Zap, ArrowRight, ShieldCheck, Activity, Sparkles, Crown, Clock } from 'lucide-react';

const TRIAL_DAYS = 7;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.Dashboard);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Rodney: Theme management implementation for React 19 compliance
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [profile, setProfile] = useState<UserProfile>({
    brokerName: 'Corretor Alpha',
    agencyName: 'Imobiliária Prime',
    welcomeMessage: 'Olá! Sou o assistente inteligente da Prime. Vi que você busca um imóvel e estou aqui para agilizar seu atendimento. Qual seu orçamento médio?',
    phone: '',
    trialStartDate: undefined,
    proToken: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('agentPulseProfile');
    if (saved) setProfile(JSON.parse(saved));

    // Rodney: Restore theme from local storage
    const savedTheme = localStorage.getItem('agentPulseTheme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, []);

  // Rodney: Theme toggle logic
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('agentPulseTheme', newTheme);
    document.body.className = newTheme;
  };

  const handleLogin = (phone: string) => {
    const now = new Date().toISOString();
    setProfile(prev => {
      const newProfile = { 
        ...prev, 
        phone, 
        trialStartDate: prev.trialStartDate || now 
      };
      localStorage.setItem('agentPulseProfile', JSON.stringify(newProfile));
      return newProfile;
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('agentPulseProfile', JSON.stringify(newProfile));
  };

  const addLeads = (newLeads: Lead[]) => {
    setLeads(prev => {
      const existingIds = new Set(prev.map(l => l.id));
      const uniqueNew = newLeads.filter(l => !existingIds.has(l.id));
      return [...uniqueNew, ...prev];
    });
  };

  const handleUpdateStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const subscriptionStatus = useMemo(() => {
    const isPro = profile.proToken && profile.proToken.startsWith('AGENT-PRO-');
    if (isPro) return { type: 'PRO', expired: false, daysLeft: 0 };
    if (!profile.trialStartDate) return { type: 'TRIAL', expired: false, daysLeft: TRIAL_DAYS };
    const start = new Date(profile.trialStartDate).getTime();
    const now = Date.now();
    const diff = now - start;
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, TRIAL_DAYS - daysPassed);
    return { type: 'TRIAL', expired: remaining <= 0, daysLeft: remaining };
  }, [profile.trialStartDate, profile.proToken]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (subscriptionStatus.expired && activeSection !== NavSection.Settings && activeSection !== NavSection.Dashboard) {
      setActiveSection(NavSection.Dashboard);
    }
    switch (activeSection) {
      case NavSection.Dashboard: return <Dashboard leads={leads} />;
      case NavSection.SocialRadar: return <SocialRadar onLeadsFound={addLeads} profile={profile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.Leads: return <LeadList leads={leads} profile={profile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.AIChat: return <IAAssistant profile={profile} />;
      case NavSection.Settings: return <Settings profile={profile} onSave={saveProfile} />;
      case NavSection.Help: return <HelpCenter />;
      default: return <Dashboard leads={leads} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row overflow-x-hidden ${theme === 'dark' ? 'bg-[#020617] text-slate-200' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Sidebar 
        activeSection={activeSection} 
        subscription={subscriptionStatus}
        onNavigate={(s) => { setActiveSection(s); setIsMobileMenuOpen(false); }} 
        onLogout={handleLogout}
        isAdminUnlocked={false}
        onLogoClick={() => {}}
        profile={profile}
        onLanguageChange={(lang) => saveProfile({...profile, language: lang})}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 glass z-[100] px-6 flex items-center justify-between border-b border-white/5">
        <div className="brand-text text-lg flex items-center gap-1.5">
          <Activity size={18} className="text-indigo-500" />
          <span className="text-white">Agent</span>
          <span className="pulse-gradient">Pulse</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-slate-400 active:scale-90 transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <main className="flex-1 lg:ml-64 p-6 lg:p-12 pt-28 lg:pt-14 min-h-screen relative">
        <header className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <span className="bg-indigo-600/10 text-indigo-400 text-[9px] px-2.5 py-1 rounded-full font-black tracking-widest border border-indigo-500/20 uppercase">
                  {activeSection.replace('-', ' ')}
                </span>
             </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tighter text-white">
              <span className="opacity-30 font-light mr-3">Portal</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">{profile.agencyName}</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] ${subscriptionStatus.type === 'PRO' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                <p className="text-slate-500 text-xs font-bold tracking-wide">
                  IDENTIDADE: <span className="text-slate-300 ml-1 uppercase">{profile.brokerName}</span>
                </p>
              </div>
              {subscriptionStatus.type === 'PRO' ? (
                 <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-3 py-1 rounded-lg font-black border border-indigo-500/20">AGENTPULSE PRO</span>
              ) : (
                 <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1 rounded-lg font-black border border-emerald-500/20">EXPERIMENTAL</span>
              )}
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-5 glass px-7 py-5 rounded-[32px] border border-white/5 shadow-2xl">
            <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Licença Protocol</div>
              <div className={`text-sm font-extrabold flex items-center justify-end gap-2 ${subscriptionStatus.type === 'PRO' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                {subscriptionStatus.type === 'PRO' ? (
                  <>
                    <Crown size={14} />
                    Status Vitalício
                  </>
                ) : (
                  <>
                    <Clock size={14} />
                    {subscriptionStatus.daysLeft} Dias de Teste
                  </>
                )}
              </div>
            </div>
            <div className="h-12 w-px bg-white/10"></div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-xl shadow-indigo-600/20 text-lg">
              {profile.brokerName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="max-w-[1500px] mx-auto">
          {renderContent()}
        </div>

        {subscriptionStatus.expired && (
          <div className="fixed inset-0 lg:left-64 bg-slate-950/90 backdrop-blur-xl z-[80] flex items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="max-w-md w-full glass p-12 rounded-[56px] border border-indigo-500/30 text-center space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[60px] rounded-full"></div>
              
              <div className="relative">
                <div className="inline-flex h-24 w-24 rounded-[36px] bg-indigo-600/20 text-indigo-400 items-center justify-center border border-indigo-500/20 mb-8">
                  <Lock size={44} />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4">Acesso Expirado</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
                  Seu período experimental de <span className="text-white font-bold">7 dias</span> encerrou. Libere o poder total da IA Gemini ativando sua chave Pro.
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setActiveSection(NavSection.Settings)}
                  className="w-full btn-premium text-white font-black py-5 rounded-[28px] flex items-center justify-center gap-3 transition-all text-lg"
                >
                  Inserir Token de Ativação
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-600 pt-6 border-t border-white/5">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Protocolo de Segurança AgentPulse</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
