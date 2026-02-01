
import React, { useState } from 'react';
import { UserProfile, NavSection } from '../types';
import { ShieldCheck, Zap, Target, ArrowRight, Loader2, Cpu, User, Building2, Star, Check } from 'lucide-react';
import { Logo } from './Logo';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  initialPhone: string;
}

export const Onboarding = ({ onComplete, initialPhone }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    brokerName: '',
    agencyName: '',
    welcomeMessage: 'Olá! Sou o assistente inteligente. Vi que você busca um imóvel e estou aqui para agilizar seu atendimento. Qual seu orçamento médio?',
    phone: initialPhone,
    proToken: '',
    language: 'pt'
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      // Simulando sincronização com a rede Rodney
      setTimeout(() => {
        onComplete(formData);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#020617] flex items-center justify-center p-6 overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
      
      <div className="max-w-2xl w-full glass p-10 lg:p-16 rounded-[64px] border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
        
        {/* Progress Bar Tática */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`flex-1 transition-all duration-700 ${step >= s ? 'bg-indigo-500 shadow-[0_0_15px_#6366f1]' : 'bg-slate-900'}`}
            ></div>
          ))}
        </div>

        <div className="space-y-12">
          {/* Header do Step */}
          <div className="text-center space-y-4">
             <div className="flex justify-center mb-6">
                <Logo size={42} showText={false} />
             </div>
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <Cpu size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Protocolo de Ativação: Step 0{step}</span>
             </div>
             <h2 className="text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tighter">
                {step === 1 && "Identidade do Agente"}
                {step === 2 && "Base Operacional"}
                {step === 3 && "Sincronização Final"}
             </h2>
          </div>

          {/* Conteúdo dos Steps */}
          <div className="min-h-[200px]">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <User size={14} /> Nome Profissional (Como os leads te verão)
                  </label>
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Ex: Ricardo Silva"
                    value={formData.brokerName}
                    onChange={(e) => setFormData({...formData, brokerName: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-[28px] py-6 px-8 text-xl font-black text-white placeholder:text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 text-center italic font-medium">
                  "Sua identidade será usada nos scripts de abordagem gerados pela IA."
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Building2 size={14} /> Nome da Imobiliária ou Agência
                  </label>
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Ex: Alpha Real Estate"
                    value={formData.agencyName}
                    onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-[28px] py-6 px-8 text-xl font-black text-white placeholder:text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                      <Star size={16} className="text-amber-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nicho: Alto Padrão</span>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                      <Target size={16} className="text-indigo-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Foco: Conversão</span>
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="glass-dark p-8 rounded-[32px] border border-emerald-500/30 bg-emerald-500/5 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                         <ShieldCheck size={28} />
                      </div>
                      <div>
                         <h4 className="font-black text-white uppercase italic">Acesso Alpha Liberado</h4>
                         <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">7 Dias de Teste Grátis Ativados</p>
                      </div>
                   </div>
                   <ul className="space-y-3">
                      {["Radar Social OSINT Liberado", "IA de Scripts Ilimitada", "Dashboard de Performance"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                           <Check size={14} className="text-emerald-500" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Possui Token Pro? (Opcional)</label>
                   <input 
                    type="text" 
                    placeholder="AGENT-PRO-XXXX-XXXX"
                    value={formData.proToken}
                    onChange={(e) => setFormData({...formData, proToken: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-sm font-mono text-indigo-400 outline-none text-center"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botão de Ação */}
          <button 
            onClick={handleNext}
            disabled={isLoading || (step === 1 && !formData.brokerName) || (step === 2 && !formData.agencyName)}
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-[0_20px_50px_rgba(79,70,229,0.4)] disabled:opacity-30 group"
          >
            {isLoading ? (
               <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <span className="text-lg uppercase tracking-[0.2em]">{step === 3 ? "Ativar Sistema Rodney" : "Próximo Passo"}</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
