
import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, CheckSquare, Square, Key, Loader2, Terminal, Cpu, Zap } from 'lucide-react';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: (phone: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (val: string) => {
    let cleaned = val.replace(/\D/g, '');
    if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);
    return cleaned;
  };

  const handleLogin = (e?: React.FormEvent, customPhone?: string) => {
    if (e) e.preventDefault();
    const finalPhone = customPhone || phone;
    if (finalPhone.length < 10) return alert("Telefone inválido para o protocolo.");
    setIsLoading(true);
    
    // Simulação de autenticação local ultra-rápida
    setTimeout(() => {
      setIsLoading(false);
      onLogin(finalPhone);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full"></div>
      
      <div className="max-w-md w-full glass p-10 rounded-[48px] border border-white/10 relative z-10 shadow-2xl space-y-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center">
          <Logo size={72} showText={true} className="mb-2" />
          <div className="mt-4 p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
             <span className="text-indigo-300 text-[10px] font-black tracking-[0.25em] uppercase">Local Protocol v2.5</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ID de Operador (Telefone)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                className="w-full bg-slate-950 border border-white/20 rounded-2xl py-4 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm font-bold text-white placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-3">
             <button 
               type="button"
               onClick={() => setAcceptedTerms(!acceptedTerms)}
               className="flex items-start gap-3 text-left group transition-all"
             >
                <div className={`mt-0.5 shrink-0 transition-colors ${acceptedTerms ? 'text-indigo-400' : 'text-slate-600'}`}>
                  {acceptedTerms ? <CheckSquare size={16} /> : <Square size={16} />}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold group-hover:text-slate-200">
                  Operar em modo <span className="text-indigo-300">Local Stealth</span> com criptografia de ponta.
                </p>
             </button>
          </div>

          <div className="space-y-3">
            <button 
              type="submit"
              disabled={isLoading || phone.length < 10}
              className="w-full btn-premium text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-[11px] uppercase tracking-[0.15em] disabled:opacity-30 shadow-2xl shadow-indigo-600/20"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Sincronizar Protocolo
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={() => handleLogin(undefined, '11999999999')}
              className="w-full bg-white/5 border border-white/10 text-slate-400 hover:text-indigo-400 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <Zap size={12} className="text-indigo-500" />
              Acesso Rápido Master
            </button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em]">Local Storage E2E</span>
          </div>
        </div>
      </div>
    </div>
  );
};
