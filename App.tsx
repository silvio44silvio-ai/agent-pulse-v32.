
import React, { useState, useEffect, useCallback } from 'react';
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
import { ShieldCheck, Activity } from 'lucide-react';

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
    proToken: 'AGENT-PRO-EXECUTIVE',
    language: 'pt',
    schedules: []
  });

  useEffect(() => {
    const initApp = () => {
      const savedProfile = localStorage.getItem('agentPulseProfile');
      const savedLeads = localStorage.getItem('agentPulseLeads');
      const savedTheme = localStorage.getItem('agentPulseTheme') as 'dark' | 'light';
      
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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('agentPulseTheme', newTheme);
    document.body.className = newTheme;
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('agentPulseProfile', JSON.stringify(newProfile));
  };

  const handleUpdateStatus = useCallback((id: string, status: Lead['status']) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, status, lastInteraction: new Date().toISOString() } : l);
      localStorage.setItem('agentPulseLeads', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleLogin = (phone: string) => {
    const saved = localStorage.getItem('agentPulseProfile');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.phone === phone && p.brokerName !== 'Corretor Alpha') {
        setIsAuthenticated(true);
        return;
      }
    }
    setProfile(prev => ({ ...prev, phone }));
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const finalProfile = { ...newProfile, trialStartDate: new Date().toISOString() };
    setProfile(finalProfile);
    localStorage.setItem('agentPulseProfile', JSON.stringify(finalProfile));
    setShowOnboarding(false);
    setIsAuthenticated(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case NavSection.Dashboard: return <Dashboard leads={leads} onNavigateToSquads={() => setActiveSection(NavSection.Messenger)} />;
      case NavSection.SeniorCommand: return <SeniorCommand leads={leads} profile={profile} />;
      case NavSection.SocialRadar: return <SocialRadar onLeadsFound={(newLeads) => setLeads(prev => [...newLeads, ...prev])} profile={profile} onUpdateProfile={handleUpdateProfile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.Leads: return <LeadList leads={leads} profile={profile} onUpdateStatus={handleUpdateStatus} />;
      case NavSection.AIChat: return <IAAssistant profile={profile} />;
      case NavSection.Settings: return <Settings profile={profile} onSave={handleUpdateProfile} />;
      case NavSection.Help: return <HelpCenter />;
      case NavSection.MarketAnalysis: return <MarketAnalysis currentLang={profile.language || 'pt'} />;
      case NavSection.AppraisalCalc: return <AppraisalCalculator />;
      case NavSection.JobBoard: return <OpportunityBoard />;
      case NavSection.Messenger: return <Messenger />;
      case NavSection.Admin: return <AdminPanel />;
      case NavSection.Launches: return <LaunchCenter />;
      case NavSection.EmailMarketing: return <EmailMarketing />;
      case NavSection.Performance: return <TeamPerformance />;
      default: return <Dashboard leads={leads} onNavigateToSquads={() => setActiveSection(NavSection.Messenger)} />;
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
        subscription={{ type: 'PRO', expired: false, daysLeft: 365 }}
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
        onLanguageChange={(lang) => handleUpdateProfile({...profile, language: lang})}
      />

      <main className="flex-1 lg:ml-64 p-4 lg:p-6 pt-20 lg:pt-6 min-h-screen overflow-y-auto no-scrollbar">
        <header className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700 overflow-visible">
            <Logo size={32} theme={theme} showText={true} />
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/10">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Op: <span className="text-indigo-400">{profile.brokerName}</span></p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <ShieldCheck size={10} className="text-indigo-400" />
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Node: {profile.agencyName}</span>
              </div>
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
      </main>
    </div>
  );
};

export default App;
