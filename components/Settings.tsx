
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { testTelegramConnection } from '../services/telegramService';
import { 
  Save, User, Building2, MessageSquare, Phone, Globe, ShieldCheck, Zap, 
  Trash2, AlertTriangle, Table, Instagram, Camera, Key, ExternalLink, 
  BrainCircuit, Lock, Send, MessageCircle, BellRing, RefreshCcw
} from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const Settings = ({ profile, onSave }: SettingsProps) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Configurações salvas com sucesso!');
  };

  const handleTestTelegram = async () => {
    if (!formData.telegramBotToken || !formData.telegramChatId) {
      alert("Insira o Token e o Chat ID primeiro.");
      return;
    }
    setIsTestingTelegram(true);
    const success = await testTelegramConnection(formData.telegramBotToken, formData.telegramChatId);
    setIsTestingTelegram(false);
    if (success) alert("Mensagem de teste enviada!");
    else alert("Falha na conexão. Verifique as credenciais.");
  };

  const handleClearData = () => {
    if (confirm("ATENÇÃO: Isso apagará todos os leads e configurações permanentemente. Continuar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const isPro = formData.proToken && formData.proToken.startsWith('AGENT-PRO-');

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32 font-['Plus_Jakarta_Sans']">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Configurações Alpha</h2>
          <p className="text-slate-500 font-medium">Customize sua identidade e conexões de rede.</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isPro ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
          {isPro ? <Zap size={12} /> : <Lock size={12} />}
          {isPro ? 'Modo Pró Ativo' : 'Versão Trial'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Telegram Integration Card */}
        <div className="glass p-8 rounded-[40px] border border-blue-500/20 space-y-8 relative overflow-hidden bg-blue-500/[0.02]">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl shadow-lg">
                <Send size={24} />
              </div>
              <div>
                <h3 className="font-black text-white uppercase text-sm tracking-tight">Notificações Telegram</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Alertas de Leads em Tempo Real</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.enableTelegramAlerts}
                onChange={(e) => setFormData({...formData, enableTelegramAlerts: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
            </label>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bot Token (HTTP API)</label>
                <input 
                  type="password" 
                  placeholder="000000:ABC-DEF..."
                  value={formData.telegramBotToken || ''}
                  onChange={(e) => setFormData({...formData, telegramBotToken: e.target.value})}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-300 font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chat ID do Corretor</label>
                <input 
                  type="text" 
                  placeholder="Ex: 123456789"
                  value={formData.telegramChatId || ''}
                  onChange={(e) => setFormData({...formData, telegramChatId: e.target.value})}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-300 font-mono text-xs"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <BellRing size={14} className="text-blue-400" />
                Como obter? Use o <a href="https://t.me/BotFather" target="_blank" className="text-blue-400 underline">@BotFather</a> e o <a href="https://t.me/userinfobot" target="_blank" className="text-blue-400 underline">@userinfobot</a>
              </div>
              <button 
                type="button" 
                onClick={handleTestTelegram}
                disabled={isTestingTelegram}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all"
              >
                {isTestingTelegram ? <RefreshCcw size={12} className="animate-spin" /> : <MessageCircle size={12} />}
                Testar Conexão
              </button>
            </div>
          </div>
        </div>

        {/* AI Brain Settings */}
        <div className="glass p-8 rounded-[40px] border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
               <BrainCircuit size={20} />
             </div>
             <h3 className="font-black text-white uppercase text-sm">Cérebro da IA (Instruções Alpha)</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Defina o tom de voz e as regras de negócio. Ex: "Sou especialista em leilões, fale de forma técnica e objetiva".
          </p>
          <textarea 
            rows={4}
            placeholder="Ex: Foque sempre em fechar a visita. Mencione que sou o corretor número 1 da região..."
            value={formData.customInstructions || ''}
            onChange={(e) => setFormData({...formData, customInstructions: e.target.value})}
            className="w-full bg-slate-950 border border-white/5 rounded-3xl px-6 py-5 focus:ring-2 focus:ring-purple-500/50 outline-none text-slate-300 text-sm resize-none shadow-inner"
          />
        </div>

        {/* Identity Section */}
        <div className="glass p-8 rounded-[40px] border border-white/10 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-indigo-500/30 overflow-hidden flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                {formData.profilePicture ? <img src={formData.profilePicture} className="w-full h-full object-cover" /> : <User size={48} className="text-slate-700" />}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-full">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input 
              type="url" 
              placeholder="URL da Foto de Perfil"
              value={formData.profilePicture || ''}
              onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}
              className="w-full max-w-xs bg-slate-950 border border-white/5 rounded-full px-4 py-2 text-[10px] text-center text-slate-500 outline-none focus:border-indigo-500/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome Profissional</label>
              <input type="text" value={formData.brokerName} onChange={(e) => setFormData({...formData, brokerName: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Imobiliária / Agência</label>
              <input type="text" value={formData.agencyName} onChange={(e) => setFormData({...formData, agencyName: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full btn-premium text-white font-black py-5 rounded-[32px] flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 transition-all text-lg uppercase tracking-tighter"
        >
          <Save size={24} />
          Salvar Protocolo Alpha
        </button>

        <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
           <button type="button" onClick={handleClearData} className="flex items-center gap-2 text-rose-500 hover:text-white hover:bg-rose-500/10 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
             <Trash2 size={16} /> Resetar Dados Locais
           </button>
        </div>
      </form>
    </div>
  );
};
