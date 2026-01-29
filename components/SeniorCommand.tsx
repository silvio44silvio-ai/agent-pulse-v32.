
import React, { useState, useMemo, useEffect } from 'react';
import { Lead, UserProfile } from '../types';
import { MOCK_PERFORMANCE } from '../constants';
import { 
  BarChart3, TrendingUp, AlertTriangle, Users, DollarSign, 
  BrainCircuit, Timer, ArrowUpRight,
  Target, Activity, CheckCircle2, Lock, ShieldCheck, Fingerprint, Trophy, Save, Star, ChevronRight, Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';

interface SeniorCommandProps {
  leads: Lead[];
  profile?: UserProfile;
}

export const SeniorCommand = ({ leads, profile }: SeniorCommandProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'audit' | 'goals'>('overview');
  
  const [brokerGoals, setBrokerGoals] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedGoals = localStorage.getItem('alpha_broker_goals');
    if (savedGoals) {
      setBrokerGoals(JSON.parse(savedGoals));
    } else {
      const initial: Record<string, number> = {};
      MOCK_PERFORMANCE.filter(p => !p.isTeam).forEach(p => initial[p.id] = 5);
      setBrokerGoals(initial);
    }
  }, []);

  const handleSaveGoals = () => {
    localStorage.setItem('alpha_broker_goals', JSON.stringify(brokerGoals));
    alert("Diretivas de Metas Individuais Sincronizadas!");
  };

  const updateGoal = (id: string, val: number) => {
    setBrokerGoals(prev => ({ ...prev, [id]: val }));
  };

  const MASTER_PIN = "2025";
  const isDevMaster = profile?.brokerName === 'Dev Alpha Master' || profile?.proToken === 'AGENT-PRO-EXECUTIVE';

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === MASTER_PIN) {
          setIsUnlocked(true);
          setIsError(false);
        } else {
          setIsError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleBiometricBypass = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsUnlocked(true);
      setIsScanning(false);
    }, 1500);
  };

  const brokers = useMemo(() => MOCK_PERFORMANCE.filter(p => !p.isTeam), []);

  const brokerPerformance = useMemo(() => {
    return brokers.map(broker => {
      const closed = leads.filter(l => l.brokerId === broker.id && l.status === 'Negócio Fechado').length;
      const goal = brokerGoals[broker.id] || 5;
      const progress = Math.min(100, (closed / goal) * 100);
      const isMet = closed >= goal;
      return { ...broker, closed, goal, progress, isMet };
    });
  }, [leads, brokerGoals, brokers]);

  const stats = useMemo(() => {
    const totalVGV = leads.reduce((acc, curr) => acc + (curr.value || 850000), 0);
    const weightedVGV = leads.reduce((acc, curr) => {
      let weight = 0.1;
      if (curr.status === 'Em Contato') weight = 0.3;
      if (curr.status === 'Agendado') weight = 0.7;
      if (curr.status === 'Negócio Fechado') weight = 1.0;
      return acc + ((curr.value || 850000) * weight);
    }, 0);

    const conversionRate = leads.length > 0 
      ? ((leads.filter(l => l.status === 'Negócio Fechado').length / leads.length) * 100).toFixed(1)
      : "0";

    return { totalVGV, weightedVGV, conversionRate, total: leads.length };
  }, [leads]);

  if (!isUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="glass max-w-sm w-full p-10 rounded-[48px] border border-indigo-500/30 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          
          <div className="space-y-4">
            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto border transition-all ${isScanning ? 'bg-indigo-600 border-indigo-400' : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'}`}>
              {isScanning ? <Loader2 className="animate-spin text-white" size={40} /> : <Lock size={40} className={isError ? "animate-bounce text-rose-500" : ""} />}
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Alpha Vault</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed">
              {isScanning ? 'Escaneando Identidade Rodney...' : 'Área Restrita: Dados Financeiros & Auditoria. Insira seu PIN Executivo.'}
            </p>
          </div>

          {!isScanning && (
            <>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`w-12 h-16 rounded-2xl border flex items-center justify-center text-xl font-black transition-all ${
                      pin.length > i 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                        : 'bg-slate-950 border-white/10 text-slate-700'
                    } ${isError ? 'border-rose-500 text-rose-500 animate-pulse' : ''}`}
                  >
                    {pin.length > i ? '•' : ''}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'X'].map((val, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (val === 'X') setPin(pin.slice(0, -1));
                      else if (val !== '') handlePinInput(val);
                    }}
                    disabled={val === ''}
                    className={`h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all active:scale-90 ${
                      val === '' ? 'opacity-0' : 
                      val === 'X' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                      'bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleBiometricBypass}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
              >
                <Fingerprint size={18} />
                Rodney Auth (Bypass)
              </button>
            </>
          )}

          <div className="pt-4 flex items-center justify-center gap-2 border-t border-white/5">
             <ShieldCheck size={14} className="text-emerald-500" />
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocolo de Criptografia Ativo</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Comando Estratégico Alpha</span>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Senior Dashboard</h2>
            <button onClick={() => setIsUnlocked(false)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all">
              <Lock size={16} />
            </button>
          </div>
        </div>

        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          {['overview', 'financial', 'audit', 'goals'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {tab === 'overview' ? 'Geral' : tab === 'financial' ? 'Financeiro' : tab === 'audit' ? 'Auditoria' : 'Metas'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 rounded-[40px] border border-white/5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Users size={18} className="text-indigo-400" /> Performance do Squad Alpha
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brokerPerformance.map(bp => (
                  <div 
                    key={bp.id} 
                    className={`p-6 rounded-[32px] border transition-all ${
                      bp.isMet 
                        ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]' 
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${bp.isMet ? 'bg-amber-500 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                          {bp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">{bp.name}</div>
                          <div className="text-[8px] font-black text-slate-500 uppercase">{bp.role}</div>
                        </div>
                      </div>
                      {bp.isMet && <Trophy size={20} className="text-amber-500 animate-bounce" />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Progresso</span>
                        <span className={bp.isMet ? 'text-amber-400' : 'text-indigo-400'}>{bp.closed} / {bp.goal}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${bp.isMet ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-indigo-500'}`} 
                          style={{ width: `${bp.progress}%` }}
                        ></div>
                      </div>
                      {bp.isMet && (
                        <div className="text-[8px] font-black text-amber-500 uppercase tracking-widest pt-1 flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> Meta Superada
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6 text-center">
              <Trophy size={48} className="text-amber-500 mx-auto animate-pulse" />
              <h4 className="text-xs font-black text-white uppercase">Status da Unidade</h4>
              <div className="text-4xl font-black text-indigo-400">{brokerPerformance.filter(b => b.isMet).length} Elite</div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">Membros que atingiram o objetivo.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
           <div className="glass p-12 rounded-[56px] border border-white/5 space-y-10">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-600/10 rounded-[28px] flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20">
                   <Target size={32} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white uppercase italic">Metas de Fechamento</h3>
                   <p className="text-slate-500 text-xs font-medium max-w-sm mx-auto">Ajuste os alvos mensais de cada corretor.</p>
                </div>
              </div>

              <div className="space-y-6">
                {brokers.map(broker => (
                  <div key={broker.id} className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-4 min-w-[180px]">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-indigo-400">
                        {broker.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{broker.name}</div>
                        <div className="text-[8px] font-black text-slate-500 uppercase">Foco: {brokerGoals[broker.id] || 5} negócios</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1" 
                        max="30" 
                        value={brokerGoals[broker.id] || 5}
                        onChange={(e) => updateGoal(broker.id, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="w-12 text-center text-xl font-black text-indigo-400">
                        {brokerGoals[broker.id] || 5}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSaveGoals}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Save size={18} /> Salvar Metas Rodney
              </button>
           </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-10 rounded-[48px] border border-indigo-500/20">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">VGV Total Projetado</p>
                 <h3 className="text-3xl font-black text-white">
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalVGV)}
                 </h3>
                 <div className="flex items-center gap-2 mt-4 text-emerald-400 text-[10px] font-black uppercase">
                    <TrendingUp size={12} /> +18.4% este mês
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
