
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavSection, UserProfile, Lead } from './types';
import { MOCK_LEADS } from './constants';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SeniorCommand } from './components/SeniorCommand';
import { SocialRadar } from './components/SocialRadar';
import { LeadList } from './components/LeadList';
import { IAAssistant } from './components/IAAssistant';
import { Settings } from './components/Settings';
import { HelpCenter } from './components/HelpCenter';
import { MarketAnalysis } from './components/MarketAnalysis';
import { AppraisalCalculator } from './components/AppraisalCalculator';
import { OpportunityBoard } from './components/OpportunityBoard';
import { Messenger } from './components/Messenger';
import { AdminPanel } from './components/AdminPanel';
import { LaunchCenter } from './components/LaunchCenter';
import { EmailMarketing } from './components/EmailMarketing';
import { TeamPerformance } from './components/TeamPerformance';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { Logo } from './components/Logo';
import { ShieldCheck, Activity, Lock, ArrowRight, Clock, AlertTriangle, Crown } from 'lucide-react';

const TRIAL_DAYS = 7;

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.Dashboard);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [profile, setProfile] = useState<UserProfile>({
    brokerName: 'Corretor Alpha',
    agencyName: 'AgentPulse Command',
    welcomeMessage: 'Protocolo de Operação Ativo.',
    phone: '',
    proToken: '',
    language: 'pt',
    trialStartDate: undefined
  });

  useEffect(() => {
    const initApp = () => {
      const savedProfile = localStorage.getItem('agentPulseProfile');
      const savedLeads = localStorage.getItem('agentPulseLeads');
      const savedTheme = localStorage.getItem('agentPulseTheme') as 'dark' | 'light';
      
      // Rodney Alpha: Detecção de Link de Convite
      const params = new URLSearchParams(window.location.search);
      const isTrialLink = params.get('ref') === '7days';

      if (savedTheme) {
        setTheme(savedTheme);
        document.body.className = savedTheme;
      }

      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setIsAuthenticated(true);
          setHasStarted(true);
        } catch (e) {
          console.error("Rodney: Erro ao restaurar perfil.");
        }
      } else if (isTrialLink) {
        // Inicializa trial se vier do link
        const initialTrialDate = new Date().toISOString();
        setProfile(prev => ({ ...prev, trialStartDate: initialTrialDate }));
        console.log("Rodney Protocol: Link de Convite detectado. Relógio iniciado.");
      }

      if (savedLeads) {
        try {
          setLeads(JSON.parse(savedLeads));
        } catch (e) {
          setLeads(MOCK_LEADS);
        }
      } else {
        setLeads(MOCK_LEADS);
      }
      
      setIsReady(true);
    };

    initApp();
  }, []);

  const subscriptionStatus = useMemo(() => {
    const token = profile.proToken || '';
    const activationDate = profile.activationDate ? new Date(profile.activationDate).getTime() : Date.now();
    const now = Date.now();

    // Lógica Pro
    if (token.startsWith('AGENT-PRO-L-')) return { type: 'PRO', planName: 'Vitalício', expired: false, daysLeft: 9999 };
    if (token.startsWith('AGENT-PRO-A-')) {
      const daysPassed = Math.floor((now - activationDate) / (1000 * 60 * 60 * 24));
      const remaining = 365 - daysPassed;
      return { type: 'PRO', planName: 'Anual', expired: remaining <= 0, daysLeft: remaining };
    }
    if (token.startsWith('AGENT-PRO-M-')) {
      const daysPassed = Math.floor((now - activationDate) / (1000 * 60 * 60 * 24));
      const remaining = 30 - daysPassed;
      return { type: 'PRO', planName: 'Mensal', expired: remaining <= 0, daysLeft: remaining };
    }

    // Lógica Trial Rodney
    if (!profile.trialStartDate) return { type: 'TRIAL', planName: 'Experimental', expired: false, daysLeft: TRIAL_DAYS };
    const start = new Date(profile.trialStartDate).getTime();
    const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, TRIAL_DAYS - daysPassed);
    return { type: 'TRIAL', planName: 'Experimental', expired: remaining <= 0, daysLeft: remaining };
  }, [profile.trialStartDate, profile.proToken, profile.activationDate]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('agentPulseTheme', newTheme);
    document.body.className = newTheme;
  };

  const handleUpdateStatus = useCallback((id: string, status: Lead['status']) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, status, lastInteraction: new Date().toISOString() } : l);
      localStorage.setItem('agentPulseLeads', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleLogin = (phone: string) => {
    const now = new Date().toISOString();
    setProfile(prev => ({ 
      ...prev, 
      phone, 
      trialStartDate: prev.trialStartDate || now 
    }));
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const finalProfile = { ...newProfile };
    setProfile(finalProfile);
    localStorage.setItem('agentPulseProfile', JSON.stringify(finalProfile));
    setShowOnboarding(false);
    setIsAuthenticated(true);
  };

  const renderContent = () => {
    // Rodney Alpha: Bloqueio Tático
    if (subscriptionStatus.expired && activeSection !== NavSection.Settings && activeSection !== NavSection.Dashboard) {
      setActiveSection(NavSection.Dashboard);
    }

    switch (activeSection) {
      case NavSection.Dashboard: return <Dashboard leads={leads} subscription={subscriptionStatus} onNavigateToSquads={() => setActiveSection(NavSection.Messenger)} onNavigateToBilling={() => setActiveSection(NavSection.Settings)} />;
      case NavSection.SeniorCommand: return <SeniorCommand leads={leads} profile={profile} />;
      case NavSection.SocialRadar: return <SocialRadar onLeadsFound={(newLeads) => setLeads(prev => [...newLeads, ...prev])} profile={profile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.Leads: return <LeadList leads={leads} profile={profile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.AIChat: return <IAAssistant profile={profile} />;
      case NavSection.Settings: return <Settings profile={profile} onSave={(p) => { setProfile(p); localStorage.setItem('agentPulseProfile', JSON.stringify(p)); }} />;
      case NavSection.Help: return <HelpCenter />;
      case NavSection.MarketAnalysis: return <MarketAnalysis currentLang={profile.language || 'pt'} />;
      case NavSection.AppraisalCalc: return <AppraisalCalculator />;
      case NavSection.JobBoard: return <OpportunityBoard />;
      case NavSection.Messenger: return <Messenger />;
      case NavSection.Admin: return <AdminPanel />;
      case NavSection.Launches: return <LaunchCenter />;
      case NavSection.EmailMarketing: return <EmailMarketing />;
      case NavSection.Performance: return <TeamPerformance />;
      default: return <Dashboard leads={leads} subscription={subscriptionStatus} onNavigateToSquads={() => setActiveSection(NavSection.Messenger)} onNavigateToBilling={() => setActiveSection(NavSection.Settings)} />;
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasStarted) return <LandingPage onStart={() => setHasStarted(true)} />;
  
  if (showOnboarding) return <Onboarding initialPhone={profile.phone} onComplete={handleOnboardingComplete} />;

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row overflow-hidden ${theme === 'dark' ? 'bg-[#020617] text-slate-200' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Sidebar 
        activeSection={activeSection} 
        subscription={subscriptionStatus}
        isAdminUnlocked={true}
        isOpen={isMobileMenuOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogoClick={() => setActiveSection(NavSection.Dashboard)}
        onNavigate={(s) => { setActiveSection(s); setIsMobileMenuOpen(false); }} 
        onLogout={() => { 
          localStorage.clear(); 
          window.location.reload(); 
        }} 
        profile={profile}
        onLanguageChange={(lang) => setProfile(p => ({...p, language: lang}))}
      />

      <main className="flex-1 lg:ml-64 p-4 lg:p-6 pt-20 lg:pt-6 min-h-screen overflow-y-auto no-scrollbar relative">
        <header className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700 overflow-visible">
            <Logo size={32} theme={theme} showText={true} />
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/10">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Op: <span className="text-indigo-400">{profile.brokerName}</span></p>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${subscriptionStatus.expired ? 'bg-rose-500/10 border-rose-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                {subscriptionStatus.expired ? <AlertTriangle size={10} className="text-rose-500" /> : <ShieldCheck size={10} className="text-indigo-400" />}
                <span className={`text-[8px] font-black uppercase tracking-tighter ${subscriptionStatus.expired ? 'text-rose-400' : 'text-indigo-400'}`}>
                   {subscriptionStatus.expired ? 'EXPIRADO' : `NODE: ${profile.agencyName}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-5 glass px-6 py-3 rounded-2xl border border-white/5">
            <div className="text-right">
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Licença Rodney</div>
              <div className={`text-xs font-black flex items-center justify-end gap-1.5 ${subscriptionStatus.expired ? 'text-rose-500' : 'text-indigo-400'}`}>
                {subscriptionStatus.expired ? 'EXPIRADA' : <><Clock size={12} /> {subscriptionStatus.daysLeft} Dias</>}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
              {profile.brokerName.charAt(0)}
            </div>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden fixed top-4 right-4 z-[200] p-3 glass rounded-xl border border-white/15 text-indigo-400 shadow-2xl"
          >
            <Activity size={20} />
          </button>
        </header>

        <div className="max-w-[1400px] mx-auto pb-12">
          {renderContent()}
        </div>

        {/* Rodney Lockdown Overlay */}
        {subscriptionStatus.expired && (
          <div className="fixed inset-0 lg:left-64 bg-slate-950/90 backdrop-blur-xl z-[450] flex items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="max-w-md w-full glass p-10 lg:p-14 rounded-[56px] border border-indigo-500/30 text-center space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[60px] rounded-full"></div>
              <div className="relative">
                <div className="inline-flex h-24 w-24 rounded-[36px] bg-indigo-600/20 text-indigo-400 items-center justify-center border border-indigo-500/20 mb-8">
                  <Lock size={44} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-4 text-white uppercase italic">Acesso Expirado</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
                  Comandante, seu ciclo experimental de 7 dias chegou ao fim. Para continuar dominando o VGV com o Rodney, ative seu plano profissional.
                </p>
              </div>
              <button 
                onClick={() => setActiveSection(NavSection.Settings)}
                className="w-full btn-premium text-white font-black py-5 rounded-[28px] flex items-center justify-center gap-3 transition-all text-sm uppercase tracking-widest italic"
              >
                Liberar Acesso Pró <ArrowRight size={20} />
              </button>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-[0.2em]">Seus leads e dados permanecem salvos localmente.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
