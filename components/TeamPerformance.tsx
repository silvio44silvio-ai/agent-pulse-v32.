
import React from 'react';
import { MOCK_PERFORMANCE } from '../constants';
import { Trophy, Star, TrendingUp, Zap, Users, Crown, Medal, ArrowUpRight } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export const TeamPerformance = () => {
  const employees = MOCK_PERFORMANCE.filter(p => !p.isTeam).sort((a, b) => b.dealsClosed - a.dealsClosed);
  const teams = MOCK_PERFORMANCE.filter(p => p.isTeam);
  
  const topEmployee = employees[0];
  const topTeam = teams.sort((a, b) => b.conversionRate - a.conversionRate)[0];

  const chartData = employees.map(e => ({ name: e.name.split(' ')[0], conversao: e.conversionRate }));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Elite Squad</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Métricas de Performance Imobiliária</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Star size={14} className="text-amber-400" /> Ciclo: Outubro 2023
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Corretor do Mês */}
        <div className="glass p-8 rounded-[48px] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Crown size={120} className="text-amber-400" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
             <div className="w-24 h-24 rounded-full border-4 border-amber-500/50 p-1">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-black text-amber-400">
                   {topEmployee.name.charAt(0)}
                </div>
             </div>
             <div className="text-center md:text-left space-y-2">
                <span className="bg-amber-500 text-white text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Funcionário do Mês</span>
                <h3 className="text-3xl font-black text-white tracking-tighter">{topEmployee.name}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <div className="text-center">
                      <div className="text-lg font-black text-white">{topEmployee.dealsClosed}</div>
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Fechamentos</div>
                   </div>
                   <div className="text-center">
                      <div className="text-lg font-black text-emerald-400">{topEmployee.conversionRate}%</div>
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Conversão</div>
                   </div>
                   <div className="text-center">
                      <div className="text-lg font-black text-indigo-400">{topEmployee.responseTime}</div>
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Resposta</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Card Equipe do Mês */}
        <div className="glass p-8 rounded-[48px] border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Users size={120} className="text-indigo-400" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
             <div className="w-24 h-24 rounded-[28px] border-4 border-indigo-500/50 p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-[20px] bg-slate-800 flex items-center justify-center">
                   <Users size={40} className="text-indigo-400" />
                </div>
             </div>
             <div className="text-center md:text-left space-y-2">
                <span className="bg-indigo-600 text-white text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Equipe do Mês</span>
                <h3 className="text-3xl font-black text-white tracking-tighter">{topTeam.name}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <div className="text-center">
                      <div className="text-lg font-black text-white">{topTeam.leadsCaptured}</div>
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Captações</div>
                   </div>
                   <div className="text-center">
                      <div className="text-lg font-black text-emerald-400">{topTeam.dealsClosed}</div>
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Vendas</div>
                   </div>
                   <div className="text-center">
                      <div className="text-lg font-black text-indigo-400">{topTeam.conversionRate}%</div>
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Efficiency</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Leaderboard Table */}
         <div className="lg:col-span-2 glass p-8 rounded-[40px] border border-white/5 space-y-6">
            <h3 className="font-black text-white uppercase text-sm flex items-center gap-2 tracking-tight">
               <Medal size={18} className="text-indigo-400" /> Ranking de Conversão (Individual)
            </h3>
            <div className="space-y-3">
               {employees.map((emp, idx) => (
                 <div key={emp.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                       <span className={`text-xs font-black ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-slate-500'}`}>#0{idx + 1}</span>
                       <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                          {emp.name.charAt(0)}
                       </div>
                       <div>
                          <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">{emp.name}</div>
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{emp.role}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-emerald-400">{emp.conversionRate}%</div>
                       <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Conversion</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Chart Section */}
         <div className="glass p-8 rounded-[40px] border border-white/5 flex flex-col">
            <h3 className="font-black text-white uppercase text-sm mb-8 tracking-tight">Produtividade IA</h3>
            <div className="flex-1 min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                     <XAxis dataKey="name" stroke="#475569" fontSize={8} axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#6366f1', fontSize: '10px', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="conversao" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#6366f1'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/10">
               <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
                 "A média de conversão da agência aumentou em <span className="text-emerald-400 font-bold">12.4%</span> desde a ativação do protocolo AgentPulse."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
