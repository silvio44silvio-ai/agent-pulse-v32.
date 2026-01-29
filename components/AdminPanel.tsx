
import React, { useState } from 'react';
// Fix: removed invalid 'key' import as it is not exported by lucide-react and remains unused in this component.
import { ShieldAlert, Copy, Check, Zap, Users, BarChart3, Plus } from 'lucide-react';

export const AdminPanel = () => {
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);

  const generateToken = () => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `AGENT-PRO-${random}`;
    setGeneratedToken(token);
    setCopied(false);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Painel de Administração</h2>
          <p className="text-slate-500 text-sm">Gerenciamento de licenças e controle de ecossistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/5 text-center">
          <Users className="mx-auto mb-3 text-indigo-400" size={20} />
          <div className="text-2xl font-black">1.2k</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Usuários Totais</div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 text-center">
          <Zap className="mx-auto mb-3 text-emerald-400" size={20} />
          <div className="text-2xl font-black">450</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Licenças Ativas</div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 text-center">
          <BarChart3 className="mx-auto mb-3 text-purple-400" size={20} />
          <div className="text-2xl font-black">R$ 12.4k</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">MRR Projetado</div>
        </div>
      </div>

      <div className="glass p-10 rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 opacity-5">
           <Zap size={200} />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h3 className="text-xl font-bold mb-4">Gerador de Tokens Vitalícios</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Crie chaves de acesso Pro para novos clientes interessados. Cada chave gerada é única e desbloqueia permanentemente as funções de IA.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={generateToken}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus size={20} /> Gerar Nova Chave PRO
            </button>

            {generatedToken && (
              <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-300">
                <div className="flex-1 bg-slate-950 border border-indigo-500/30 rounded-xl p-4 font-mono text-indigo-400 font-bold tracking-widest">
                  {generatedToken}
                </div>
                <button 
                  onClick={copyToken}
                  className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-all"
                >
                  {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/10">
        <h3 className="font-bold mb-6">Logs de Ativação Recentes</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Check size={14} />
                </div>
                <div>
                  <div className="font-bold">Token AGENT-PRO-K8X... Ativado</div>
                  <div className="text-slate-500">Usuário: (11) 98****-7788</div>
                </div>
              </div>
              <div className="text-slate-500 font-mono">HÁ 2H</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
