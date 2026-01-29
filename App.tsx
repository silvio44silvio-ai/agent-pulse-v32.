
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
import { Logo } from './components/Logo';
import { ShieldCheck, Activity } from 'lucide-react';

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    language: 'pt'
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
        } catch (e) {
          console.error("Erro ao restaurar perfil.");
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

  const handleUpdateStatus = useCallback((id: string, status: Lead['status']) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, status, lastInteraction: new Date().toISOString() } : l);
      localStorage.setItem('agentPulseLeads', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleLogin = (phone: string) => {
    const newProfile = { ...profile, phone, trialStartDate: new Date().toISOString() };
    setProfile(newProfile);
    localStorage.setItem('agentPulseProfile', JSON.stringify(newProfile));
    setIsAuthenticated(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case NavSection.Dashboard: return <Dashboard leads={leads} onNavigateToSquads={() => setActiveSection(NavSection.Messenger)} />;
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
        onLanguageChange={(lang) => setProfile(p => ({...p, language: lang}))}
      />

      <main className="flex-1 lg:ml-72 p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen overflow-y-auto no-scrollbar">
        <header className="mb-6 lg:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <Logo size={52} theme={theme} showText={true} />
            <div className="flex flex-wrap items-center gap-3 mt-4 ml-0 lg:ml-16">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950/50 border border-white/10">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Op: <span className="text-indigo-400">{profile.brokerName}</span></p>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <ShieldCheck size={10} className="text-indigo-400" />
                <span className="text-[7px] font-black text-indigo-400 uppercase tracking-tighter">Node: {profile.agencyName}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden fixed top-4 right-4 z-[200] p-3 glass rounded-xl border border-white/10 text-indigo-400 active:scale-90 transition-all shadow-lg"
          >
            <Activity size={20} />
          </button>
        </header>
        <div className="max-w-[1400px] mx-auto pb-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
