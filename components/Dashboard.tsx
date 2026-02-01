
import React, { useMemo } from 'react';
import { Lead } from '../types';
import { TrendingUp, Zap, Flame, HeartPulse, ShieldCheck, ShieldAlert, ArrowRight, Target, Radar, Coffee, Clock, Crown } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
  onNavigateToSquads?: () => void;
  onNavigateToBilling?: () => void;
  subscription?: { type: string, expired: boolean, daysLeft: number };
}

export const Dashboard = ({ leads, onNavigateToSquads, onNavigateToBilling, subscription }: DashboardProps) => {
  const hotLeads = useMemo(() => leads.filter(l => l.score >= 80), [leads]);
  
  const sentToday = useMemo(() => {
    try {
      const data = localStorage.getItem('agentPulse_sent_count');
      const parsed = data ? JSON.parse(data) : { date: new Date().toLocaleDateString(), count: 0 };
      return parsed.date === new Date().toLocaleDateString() ? parsed.count : 0;
    } catch (e) { return 0; }
  }, []);

  const safetyStatus = useMemo(() => {
    if (sentToday < 15) return { label: 'Operação Segura', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (sentToday < 30) return { label: 'Atenção Tática', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { label: 'Risco de Ban', color: 'text-rose-400', bg: 'bg-rose-500/10' };
  }, [sentToday]);

  const stats = [
    { label: 'Capturas', value: leads.length, icon: <Zap size={14} className="text-indigo-400" />, color: 'bg-indigo-500/10' },
    { label: 'Hot Leads', value: hotLeads.length, icon: <Flame size={14} className="text-orange-400" />, color: 'bg-orange-500/10' },
    { label: 'Envios', value: sentToday, icon: <HeartPulse size={14} className={safetyStatus.color} />, color: safetyStatus.bg },
    { label: 'Alpha', value: '+142%', icon: <TrendingUp size={14} className="text-blue-400" />, color: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Rodney Alpha: Trial Alert Header com Redirecionamento de Venda */}
      {subscription && subscription.type === 'TRIAL' && !subscription.expired && (
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-5 rounded-[28px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-500/30 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Crown size={120} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl shadow-inner">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tight italic">Status Experimental Ativo</p>
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Seu acesso expira em <span className="text-white underline">{subscription.daysLeft} dias</span>. Não perca seus leads.</p>
            </div>
          </div>
          <button 
            onClick={onNavigateToBilling}
            className="relative z-10 bg-white text-indigo-700 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-xl active:scale-95"
          >
            Escolher Meu Plano <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Header Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <div>
            <h2 className="text-xl lg:text-3xl font-black text-white tracking-tighter uppercase italic">Métricas Operacionais</h2>
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em] mt-0.5">Sistemas Ativos • Rodney Protocol v51.2.1</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 border px-4 py-2 rounded-2xl ${safetyStatus.bg} ${safetyStatus.color.replace('text', 'border')}/20`}>
           <ShieldCheck size={16} className={safetyStatus.color} />
           <div className="text-left">
             <div className={`text-[8px] font-black uppercase tracking-widest ${safetyStatus.color}`}>{safetyStatus.label}</div>
             <div className="text-[7px] text-slate-500 font-bold uppercase">{sentToday}/40 disparos hoje</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Strategic Briefing */}
        <div className="lg:col-span-8 glass p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-105 transition-transform duration-1000">
             <Radar size={220} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                  <Coffee size={20} />
               </div>
               <div>
                  <h3 className="text-base font-black text-white uppercase italic tracking-tighter">Briefing de Combate Diário</h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Prioridades de Conversão</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-5 bg-slate-950/50 rounded-3xl border border-white/5 space-y-2">
                  <Target size={16} className="text-orange-400" />
                  <p className="text-[10px] font-black text-white uppercase">Leads Frios (7d+)</p>
                  <p className="text-2xl font-black text-orange-400">{leads.filter(l => !l.lastInteraction || (Date.now() - new Date(l.lastInteraction).getTime()) > 7*24*60*60*1000).length}</p>
                  <p className="text-[7px] text-slate-500 font-bold uppercase">Reativar Protocolo</p>
               </div>
               <div className="p-5 bg-slate-950/50 rounded-3xl border border-white/5 space-y-2">
                  <Radar size={16} className="text-indigo-400" />
                  <p className="text-2xl font-black text-indigo-400">0</p>
                  <p className="text-[10px] font-black text-white uppercase">Varreduras Hoje</p>
                  <p className="text-[7px] text-slate-500 font-bold uppercase">Iniciar OSINT Diário</p>
               </div>
               <div className="p-5 bg-slate-950/50 rounded-3xl border border-white/5 space-y-2">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <p className="text-2xl font-black text-emerald-400">{sentToday}/40</p>
                  <p className="text-[10px] font-black text-white uppercase">Meta de Envios</p>
                  <p className="text-[7px] text-slate-500 font-bold uppercase">Reserva de Segurança</p>
               </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={onNavigateToSquads}
                className="w-full py-4 bg-indigo-600 text-white border border-indigo-400/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-indigo-500 flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"
              >
                ACESSAR SQUADS <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Operacional Mini */}
        <div className="lg:col-span-4 glass p-8 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center space-y-6 shadow-xl">
           <div className={`w-20 h-20 rounded-[28px] border flex items-center justify-center ${safetyStatus.color.replace('text', 'border')}/30 shadow-2xl bg-slate-950/40`}>
              <ShieldAlert size={32} className={safetyStatus.color} />
           </div>
           <div>
              <h3 className="font-black text-base text-white uppercase tracking-tight italic">Integridade Rodney</h3>
              <p className="text-slate-500 text-[9px] font-black uppercase leading-relaxed max-w-[200px] mx-auto mt-2 tracking-widest">
                Status Alpha mantido em 98.4%. Todos os módulos operacionais.
              </p>
           </div>
           <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className={`p-2 w-fit rounded-xl ${stat.color} mb-4`}>
                {stat.icon}
            </div>
            <h3 className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
