
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { verifyPaymentTransaction } from '../services/billingService';
import { 
  Save, User, Zap, Trash2, Camera, Lock, RefreshCcw, UserCircle2, 
  Crown, CheckCircle, ExternalLink, Loader2, ChevronRight, Sparkles, Star
} from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export const Settings = ({ profile, onSave }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'ia' | 'faturamento'>('perfil');
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    aiTone: profile.aiTone || 'persuasivo',
    aiFormality: profile.aiFormality || 'neutro',
    paymentLink: profile.paymentLink || 'https://pagbank.com.br/checkout/exemplo' // Link Raiz
  });
  
  const [transactionId, setTransactionId] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{msg: string, type: 'success' | 'error' | null}>({msg: '', type: null});

  // Configuração Rodney Alpha: URLs de Checkout por Plano
  const CHECKOUT_URLS = {
    MENSAL: "https://pagbank.com.br/checkout/seu-link-mensal",
    TRIMENSAL: "https://pagbank.com.br/checkout/seu-link-trimensal",
    SEMESTRAL: "https://pagbank.com.br/checkout/seu-link-semestral",
    ANUAL: "https://pagbank.com.br/checkout/seu-link-anual",
    VITALICIO: `https://wa.me/5511999999999?text=Comandante Rodney, desejo adquirir a licença VITALÍCIA Alpha.`
  };

  const handleBuyPlan = (plan: keyof typeof CHECKOUT_URLS) => {
    window.open(CHECKOUT_URLS[plan], '_blank');
  };

  const handleSyncPayment = async () => {
    if (!transactionId) return;
    setIsSyncing(true);
    setSyncStatus({msg: '', type: null});
    try {
      const result = await verifyPaymentTransaction(transactionId);
      if (result.success && result.token) {
        setSyncStatus({msg: result.message, type: 'success'});
        const updatedProfile = { 
          ...formData, 
          proToken: result.token, 
          activationDate: new Date().toISOString() 
        };
        setFormData(updatedProfile);
        onSave(updatedProfile);
      } else {
        setSyncStatus({msg: result.message, type: 'error'});
      }
    } catch (e) {
      setSyncStatus({msg: "Erro na rede Alpha.", type: 'error'});
    } finally {
      setIsSyncing(false);
    }
  };

  const isPro = formData.proToken && formData.proToken.startsWith('AGENT-PRO-');

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Configurações Alpha</h2>
          <p className="text-slate-500 font-medium">Controle total da sua operação Rodney.</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isPro ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
          {isPro ? <Crown size={12} className="text-amber-400" /> : <Lock size={12} />}
          {isPro ? 'Licença Pro Ativa' : 'Trial 7 Dias'}
        </div>
      </div>

      <div className="flex bg-slate-950 p-1 rounded-2xl border border-white/5 shadow-inner">
        <button type="button" onClick={() => setActiveTab('perfil')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'perfil' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Identidade</button>
        <button type="button" onClick={() => setActiveTab('ia')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ia' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Cérebro IA</button>
        <button type="button" onClick={() => setActiveTab('faturamento')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'faturamento' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Faturamento</button>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        
        {activeTab === 'perfil' && (
          <div className="space-y-8 animate-in fade-in duration-300">
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
                <input type="url" placeholder="URL da Foto de Perfil" value={formData.profilePicture || ''} onChange={(e) => setFormData({...formData, profilePicture: e.target.value})} className="w-full max-w-xs bg-slate-950 border border-white/5 rounded-full px-4 py-2 text-[10px] text-center text-slate-500 outline-none focus:border-indigo-500/30" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome Profissional</label><input type="text" value={formData.brokerName} onChange={(e) => setFormData({...formData, brokerName: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Imobiliária / Agência</label><input type="text" value={formData.agencyName} onChange={(e) => setFormData({...formData, agencyName: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ia' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="glass p-8 rounded-[40px] border border-indigo-500/20 space-y-8 bg-indigo-500/[0.02] relative overflow-hidden">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl shadow-lg"><UserCircle2 size={24} /></div>
                <div><h3 className="font-black text-white uppercase text-sm tracking-tight">Personalidade Rodney</h3><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ajuste fino do atendimento</p></div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estilo de Abordagem</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {['direto', 'empatico', 'persuasivo', 'tecnico'].map((style) => (
                    <button key={style} type="button" onClick={() => setFormData({...formData, aiTone: style as any})} className={`p-3 rounded-2xl border transition-all text-left ${formData.aiTone === style ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-white/5 text-slate-500'}`}><div className="text-[9px] font-black uppercase">{style}</div></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faturamento' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Planos de Adesão Alpha</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Pagamento Seguro via PagBank</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch overflow-x-auto pb-6 no-scrollbar custom-scroll">
              
              {/* PLANO 1: MENSAL */}
              <div className="glass p-6 rounded-[32px] border border-white/5 flex flex-col justify-between hover:bg-white/5 transition-all min-w-[200px]">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Acesso Mensal</h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-xs font-black text-white">R$</span>
                    <span className="text-3xl font-black text-white tracking-tighter">147</span>
                    <span className="text-[9px] text-slate-500 font-bold">/mês</span>
                  </div>
                  <ul className="space-y-3">
                    {['Radar Social', 'Scoring IA', 'Messenger Pro'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase"><CheckCircle size={10} className="text-indigo-500" /> {f}</li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => handleBuyPlan('MENSAL')} className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Assinar Agora</button>
              </div>

              {/* PLANO 2: TRIMENSAL */}
              <div className="glass p-6 rounded-[32px] border border-white/5 flex flex-col justify-between hover:bg-white/5 transition-all min-w-[200px]">
                <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Trimensal</h4>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs font-black text-white">R$</span>
                    <span className="text-3xl font-black text-white tracking-tighter">397</span>
                  </div>
                  <p className="text-[8px] text-emerald-400 font-black uppercase mb-6 tracking-widest">Economize 10%</p>
                  <ul className="space-y-3">
                    {['Análise de Mercado', 'Radar Social', '150 Capturas'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase"><CheckCircle size={10} className="text-indigo-500" /> {f}</li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => handleBuyPlan('TRIMENSAL')} className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Garantir Plano</button>
              </div>

              {/* PLANO 3: ANUAL (DESTAQUE) */}
              <div className="glass p-6 rounded-[36px] border border-indigo-500/40 bg-indigo-600/[0.03] flex flex-col justify-between relative shadow-[0_20px_40px_rgba(79,70,229,0.15)] min-w-[220px] scale-105 z-10">
                <div className="absolute top-0 right-0 p-3 bg-indigo-600 text-white text-[7px] font-black uppercase rounded-bl-xl rounded-tr-[30px] shadow-lg animate-pulse">Melhor Valor</div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 italic">Anual Alpha</h4>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs font-black text-white">R$</span>
                    <span className="text-4xl font-black text-white tracking-tighter">997</span>
                  </div>
                  <p className="text-[8px] text-emerald-400 font-black uppercase mb-6 tracking-widest">45% OFF vs Mensal</p>
                  <ul className="space-y-3">
                    {['Ilimitado', 'OSINT Deep Scan', 'Suporte VIP'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[8px] font-black text-slate-200 uppercase italic"><Sparkles size={10} className="text-amber-400" /> {f}</li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => handleBuyPlan('ANUAL')} className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all">Assinar Pro</button>
              </div>

              {/* PLANO 4: SEMESTRAL */}
              <div className="glass p-6 rounded-[32px] border border-white/5 flex flex-col justify-between hover:bg-white/5 transition-all min-w-[200px]">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Semestral</h4>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs font-black text-white">R$</span>
                    <span className="text-3xl font-black text-white tracking-tighter">697</span>
                  </div>
                  <ul className="space-y-3">
                    {['Todos os Recursos', 'Prioridade Rodney'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase"><CheckCircle size={10} className="text-indigo-500" /> {f}</li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => handleBuyPlan('SEMESTRAL')} className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Garantir Acesso</button>
              </div>

              {/* PLANO 5: VITALÍCIO */}
              <div className="glass p-6 rounded-[32px] border border-amber-500/20 bg-amber-500/[0.02] flex flex-col justify-between hover:bg-white/5 transition-all min-w-[200px]">
                <div className="absolute top-2 right-2"><Star size={12} className="text-amber-500" /></div>
                <div>
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Vitalício</h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-lg font-black text-white tracking-tighter uppercase">Sob Consulta</span>
                  </div>
                  <ul className="space-y-3">
                    {['Acesso Perpétuo', 'Contrato VIP'].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[8px] font-black text-amber-400/70 uppercase"><Crown size={10} className="text-amber-500" /> {f}</li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => handleBuyPlan('VITALICIO')} className="w-full mt-8 py-4 bg-amber-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-all flex items-center justify-center gap-2">Consultar <ExternalLink size={10} /></button>
              </div>

            </div>

            <div className="p-8 bg-slate-950/50 rounded-[40px] border border-white/10 space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <RefreshCcw size={20} className="text-indigo-400" />
                     <div className="text-left">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Sincronização de Pagamento Alpha</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase italic">Insira o ID da transação PagBank enviado por e-mail</p>
                     </div>
                  </div>
                  <div className="flex gap-3 flex-1 md:max-w-md">
                      <input type="text" placeholder="Ex: 73E5-...] " value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-indigo-400 outline-none" />
                      <button onClick={handleSyncPayment} disabled={isSyncing || !transactionId} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 flex items-center gap-2">{isSyncing ? <Loader2 className="animate-spin" size={12} /> : 'Ativar'}</button>
                  </div>
               </div>
               {syncStatus.msg && <p className={`text-[9px] font-black uppercase text-center ${syncStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-500'}`}>{syncStatus.msg}</p>}
            </div>
          </div>
        )}

        <button type="button" onClick={() => { onSave(formData); alert('Configurações Salvas!'); }} className="w-full btn-premium text-white font-black py-5 rounded-[32px] flex items-center justify-center gap-3 shadow-2xl transition-all text-lg uppercase tracking-tighter italic">
          <Save size={24} /> Salvar Tudo
        </button>
      </form>
    </div>
  );
};
