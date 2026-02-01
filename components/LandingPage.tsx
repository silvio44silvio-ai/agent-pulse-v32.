
import React from 'react';
import { ArrowRight, Zap, Radar, ShieldCheck, Sparkles, Globe, Target, Cpu, Activity, Search, ShieldAlert, Wifi, Terminal, Fingerprint, Download, Star, Shield, TrendingUp, BarChart3, Layers, ZapOff, Command, Gift, DownloadCloud } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 selection:text-white overflow-x-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Background FX Operacional Rodney v46.0 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[120vw] h-[120vw] bg-indigo-600/10 blur-[250px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-15%] w-[90vw] h-[90vw] bg-purple-600/10 blur-[200px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15"></div>
      </div>
      
      {/* Floating Free Badge (Mobile & Desktop) */}
      <div className="fixed bottom-8 right-8 z-[200] animate-bounce pointer-events-auto">
         <button 
           onClick={onStart}
           className="group flex items-center gap-3 bg-white text-indigo-900 px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_20px_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-all active:scale-95"
         >
           <Gift size={16} className="animate-pulse" />
           Liberar 7 Dias Grátis
         </button>
      </div>

      {/* HUD Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 border-b border-white/5 backdrop-blur-3xl bg-slate-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size={36} showText={true} theme="dark" />
          <div className="hidden lg:flex items-center gap-8">
             <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                <ShieldCheck size={14} className="text-indigo-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/70">Secure_Node: v46.0_ALPHA</span>
             </div>
             <button onClick={onStart} className="btn-premium px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">Entrar no Radar</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 lg:pt-60 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <div className="relative mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
               <Star size={12} fill="currentColor" /> OFERTA POR TEMPO LIMITADO: 7 DIAS FREE
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-black tracking-tighter italic leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000">
              A ERA DO <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent inline-block pr-6 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">VGV ELITE.</span>
            </h1>
          </div>
          
          <p className="max-w-4xl text-center text-slate-400 text-lg lg:text-2xl font-medium leading-relaxed mb-16 px-4">
            A ferramenta tática definitiva para o corretor que não aceita perder o <span className="text-white font-black italic underline decoration-indigo-500 decoration-8 underline-offset-8">próximo negócio.</span> <br className="hidden md:block" />
            Identifique compradores reais e proprietários motivados agora.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl justify-center mb-32">
             <div className="relative group w-full md:w-auto">
                <div className="absolute inset-0 bg-indigo-600/30 blur-[40px] rounded-full scale-90 group-hover:scale-100 transition-all duration-1000 animate-pulse"></div>
                <button 
                  onClick={onStart}
                  className="relative w-full md:w-auto px-12 py-7 bg-indigo-600 text-white font-black rounded-[36px] text-xl lg:text-2xl uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl border border-indigo-400/30 flex items-center justify-center gap-6"
                >
                   <DownloadCloud size={28} className="animate-bounce" />
                   <div className="text-left leading-none">
                      <div className="text-[8px] font-black tracking-[0.4em] text-indigo-200 mb-1">DOWNLOAD_INSTANTÂNEO</div>
                      <div>TESTAR GRÁTIS</div>
                   </div>
                   <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                </button>
             </div>
             
             <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Garantia Alpha</p>
                <div className="flex items-center gap-2 text-emerald-400">
                   <ShieldCheck size={18} />
                   <span className="text-sm font-black italic">Sua vaga está garantida por 7 dias.</span>
                </div>
                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1">Nenhum cartão necessário para começar.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="relative px-6 mb-32">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 glass p-4 rounded-[48px] border border-white/5 bg-slate-900/10">
               <StatCard icon={<TrendingUp size={24} />} value="+142%" label="Aumento de VGV" color="indigo" />
               <StatCard icon={<BarChart3 size={24} />} value="4.9M" label="Leads Scaneados" color="purple" />
               <StatCard icon={<Layers size={24} />} value="100%" label="Anti-Ban" color="emerald" />
               <StatCard icon={<ZapOff size={24} />} value="ZERO" label="Desperdício" color="amber" />
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Radar size={32} />}
            color="indigo"
            title="SATELLITE RECON"
            description="Varredura orbital em tempo real por intenções de compra e perfis qualificados."
          />
          <FeatureCard 
            icon={<Shield size={32} />}
            color="purple"
            title="NEURAL PRIVACY"
            description="Blindagem de dados nível bancário. Leads criptografados em seu próprio cofre local."
          />
          <FeatureCard 
            icon={<Zap size={32} />}
            color="emerald"
            title="HYPER REACTION"
            description="Scripts de abordagem gerados por IA com variação de DNA linguístico total."
          />
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 text-center bg-slate-950/20">
        <Logo size={48} showText={true} theme="dark" className="justify-center mb-8" />
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">
          AgentPulse Alpha Center • Built by Rodney Engine v46.0
        </p>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }: { icon: any, value: string, label: string, color: string }) => {
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-400 bg-indigo-600/10 border-indigo-500/20",
    purple: "text-purple-400 bg-purple-600/10 border-purple-500/20",
    emerald: "text-emerald-400 bg-emerald-600/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-600/10 border-amber-500/20"
  };
  return (
    <div className="p-8 bg-slate-950/60 rounded-[32px] flex flex-col items-center text-center space-y-4 border border-white/5 hover:border-white/10 transition-all">
       <div className={`p-4 rounded-2xl border ${colorMap[color]}`}>{icon}</div>
       <div>
          <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
          <div className={`text-[9px] font-black uppercase tracking-widest ${colorMap[color].split(' ')[0]}`}>{label}</div>
       </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => {
  const colors: Record<string, string> = {
    indigo: "from-indigo-600/10 border-indigo-500/20 text-indigo-400",
    purple: "from-purple-600/10 border-purple-500/20 text-purple-400",
    emerald: "from-emerald-600/10 border-emerald-500/20 text-emerald-400"
  };
  return (
    <div className={`p-10 rounded-[48px] border border-white/5 bg-gradient-to-br ${colors[color]} to-transparent transition-all hover:scale-105 duration-500`}>
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-black text-white italic mb-4 uppercase">{title}</h3>
      <p className="text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  );
};
