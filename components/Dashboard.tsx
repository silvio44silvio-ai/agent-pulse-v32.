
import React, { useMemo } from 'react';
import { Lead } from '../types';
import { TrendingUp, Zap, Flame, Activity, ShieldCheck, ShieldAlert, HeartPulse, Users, ArrowRight, AlertTriangle, Coffee, Target, Radar } from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  leads: Lead[];
  onNavigateToSquads?: () => void;
}

export const Dashboard = ({ leads, onNavigateToSquads }: DashboardProps) => {
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
    <div className="space-y-4 lg:space-y-6 animate-in fade-in duration-700">
      {/* Header Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-white tracking-tighter uppercase italic">Métricas Operacionais</h2>
            <p className="text-slate-500 text-[7px] font-black uppercase tracking-[0.3em] mt-0.5">Sistemas Ativos • Protocolo Rodney 36.5</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2.5 border px-3 py-1.5 rounded-xl ${safetyStatus.bg} ${safetyStatus.color.replace('text', 'border')}/20 shadow-lg`}>
           <ShieldCheck size={14} className={safetyStatus.color} />
           <div className="text-left">
             <div className={`text-[7px] font-black uppercase tracking-widest ${safetyStatus.color}`}>{safetyStatus.label}</div>
             <div className="text-[6px] text-slate-500 font-bold uppercase tracking-tight">{sentToday}/40 disparos hoje</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Daily Strategic Briefing - NOVO */}
        <div className="lg:col-span-8 glass p-6 lg:p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-105 transition-transform duration-1000">
             <Radar size={220} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-xl">
                  <Coffee size={18} />
               </div>
               <div>
                  <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Briefing de Combate Diário</h3>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Prioridades de Conversão</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                  <Target size={14} className="text-orange-400" />
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Leads Frios (7d+)</p>
                  <p className="text-lg font-black text-orange-400">{leads.filter(l => !l.lastInteraction || (Date.now() - new Date(l.lastInteraction).getTime()) > 7*24*60*60*1000).length}</p>
                  <p className="text-[7px] text-slate-500 font-bold uppercase">Reativar Protocolo</p>
               </div>
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                  <Radar size={14} className="text-indigo-400" />
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Varreduras Hoje</p>
                  <p className="text-lg font-black text-indigo-400">0</p>
                  <p className="text-[7px] text-slate-500 font-bold uppercase">Iniciar OSINT Diário</p>
               </div>
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Meta de Envios</p>
                  <p className="text-lg font-black text-emerald-400">0/40</p>
                  <p className="text-[7px] text-slate-500 font-bold uppercase">Reserva de Segurança</p>
               </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                Ver Detalhes Táticos <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Operacional Mini */}
        <div className="lg:col-span-4 glass p-8 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
           <div className={`w-16 h-16 rounded-[24px] border flex items-center justify-center ${safetyStatus.color.replace('text', 'border')}/30 shadow-2xl bg-slate-950/40`}>
              <ShieldAlert size={28} className={safetyStatus.color} />
           </div>
           <div>
              <h3 className="font-black text-sm text-white uppercase tracking-tight italic">Integridade Rodney</h3>
              <p className="text-slate-500 text-[8px] font-black uppercase leading-relaxed max-w-[150px] mx-auto mt-2 tracking-widest">
                Status Alpha mantido em 98.4%. Todos os módulos funcionais.
              </p>
           </div>
           <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-500 w-[98%] transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-1.5 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-slate-500 text-[6px] lg:text-[7px] font-black uppercase tracking-widest mb-0.5">{stat.label}</h3>
            <p className="text-lg lg:text-2xl font-black text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-3 glass p-6 lg:p-8 rounded-[40px] border border-white/10 h-[280px] lg:h-[320px]">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="font-black text-[8px] lg:text-[10px] flex items-center gap-2 text-white uppercase tracking-widest italic">
              <Activity size={14} className="text-indigo-400" />
              Ciclo de Conversão Semanal
            </h3>
          </div>
          <div className="h-[180px] lg:h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Seg', leads: 8 }, { name: 'Ter', leads: 14 }, { name: 'Qua', leads: 11 },
                { name: 'Qui', leads: 22 }, { name: 'Sex', leads: 18 }, { name: 'Sab', leads: 9 }, { name: 'Dom', leads: 5 }
              ]}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '9px' }} 
                />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
