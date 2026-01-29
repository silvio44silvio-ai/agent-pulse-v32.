
import React, { useState } from 'react';
import { Building, MapPin, TrendingUp, Info, CheckCircle2, ChevronRight, Share2, Sparkles, Plus } from 'lucide-react';

interface PropertyLaunch {
  id: string;
  name: string;
  developer: string;
  location: string;
  priceFrom: string;
  progress: number;
  expectedROI: string;
  features: string[];
  status: 'Breve Lançamento' | 'Obras Iniciadas' | 'Pronto para Morar';
}

const MOCK_LAUNCHES: PropertyLaunch[] = [
  {
    id: 'l1',
    name: 'Aurora Sky Residence',
    developer: 'Alpha Incorporadora',
    location: 'Jardim Aquarius, SJC',
    priceFrom: 'R$ 890.000',
    progress: 35,
    expectedROI: '12% a.a.',
    features: ['Rooftop 360', 'E-V Charging', 'Coworking Privado'],
    status: 'Obras Iniciadas'
  },
  {
    id: 'l2',
    name: 'Nexo Urbanova',
    developer: 'Prime Estates',
    location: 'Urbanova, SJC',
    priceFrom: 'R$ 1.200.000',
    progress: 5,
    expectedROI: '15.5% (Ciclo)',
    features: ['Horta Orgânica', 'Pet Spa', 'Quadra de Beach Tennis'],
    status: 'Breve Lançamento'
  }
];

export const LaunchCenter = () => {
  const [selected, setSelected] = useState<PropertyLaunch | null>(null);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Portfólio de Lançamentos</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Unidades de Alta Performance</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
          <Plus size={16} /> Cadastrar Nova Unidade
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_LAUNCHES.map((launch) => (
          <div 
            key={launch.id} 
            onClick={() => setSelected(launch)}
            className={`glass p-6 lg:p-8 rounded-[40px] border transition-all cursor-pointer group ${selected?.id === launch.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 hover:border-white/20'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <span className="bg-indigo-600/20 text-indigo-400 text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest">{launch.status}</span>
                <h3 className="text-xl lg:text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{launch.name}</h3>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                  <MapPin size={10} className="text-indigo-500" /> {launch.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ROI Previsto</div>
                <div className="text-lg font-black text-emerald-400">{launch.expectedROI}</div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
                     <span>Progresso da Obra</span>
                     <span className="text-white">{launch.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${launch.progress}%` }}></div>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-2">
                  {launch.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="bg-white/5 p-2 rounded-xl text-center">
                       <div className="text-[7px] font-black text-slate-500 uppercase tracking-tighter truncate">{f}</div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A partir de <span className="text-white text-xs">{launch.priceFrom}</span></div>
               <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white transition-transform group-hover:translate-x-1">
                  <ChevronRight size={18} />
               </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="glass p-8 lg:p-12 rounded-[56px] border border-indigo-500/20 animate-in zoom-in-95 duration-500 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Building size={300} />
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-indigo-400" />
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">IA Investor Analysis</h4>
                 </div>
                 <h3 className="text-3xl font-black text-white leading-tight">Por que investir no {selected.name}?</h3>
                 <p className="text-slate-400 text-sm leading-relaxed font-medium">
                   O micro-mercado de {selected.location} apresenta uma vacância menor que 4% para unidades deste padrão. Com o custo do m² em ascensão, a valorização projetada até a entrega das chaves é de aproximadamente 22%.
                 </p>
                 <div className="space-y-3">
                    {['Alto Liquidez na Revenda', 'Plano de Pagamento Flexível', 'Localização Vetor de Crescimento'].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-200">
                         <CheckCircle2 size={16} className="text-emerald-500" /> {text}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-slate-950/50 p-8 rounded-[40px] border border-white/5 flex flex-col justify-center items-center text-center space-y-6">
                 <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400">
                    <Share2 size={32} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">Gerar Kit de Vendas Alpha</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Apresentação IA + Tabelas + Fotos</p>
                 </div>
                 <button className="btn-premium text-white w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">
                    Enviar para Lead via WhatsApp
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
