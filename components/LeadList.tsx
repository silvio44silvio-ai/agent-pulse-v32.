
import React, { useState } from 'react';
import { Lead, UserProfile } from '../types';
import { generateWhatsAppScript } from '../services/geminiService';
import { 
  MessageCircle, Loader2, Search, MapPin, Target, X, Check, Edit3, PhoneCall, SlidersHorizontal, Zap, Fingerprint
} from 'lucide-react';

interface LeadListProps {
  leads: Lead[];
  profile: UserProfile;
  onUpdateStatus: (leadId: string, status: Lead['status']) => void;
}

export const LeadList = ({ leads, profile, onUpdateStatus }: LeadListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchId, setSearchId] = useState(''); // Rodney: Busca por ID Rodney
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'Todos'>('Todos');
  const [minScore, setMinScore] = useState(0); 
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [reviewData, setReviewData] = useState<{ lead: Lead | null, phone: string, script: string }>({
    lead: null,
    phone: '',
    script: ''
  });

  const filteredLeads = (leads || []).filter(l => {
    const searchLower = searchTerm.toLowerCase();
    const idMatch = !searchId || l.id.toLowerCase().includes(searchId.toLowerCase());
    const nameMatch = (l.name || "").toLowerCase().includes(searchLower);
    const needMatch = (l.need || "").toLowerCase().includes(searchLower);
    const statusMatch = statusFilter === 'Todos' || l.status === statusFilter;
    const scoreMatch = (l.score || 0) >= minScore;
    
    return idMatch && (nameMatch || needMatch) && statusMatch && scoreMatch;
  });

  const openReviewPanel = async (lead: Lead) => {
    setReviewData({
      lead,
      phone: lead.contact?.replace(/\D/g, '') || '',
      script: 'Gerando script tático...'
    });
    setShowReviewModal(true);
    setIsGeneratingScript(true);
    
    try {
      const generated = await generateWhatsAppScript(lead, profile);
      setReviewData(prev => ({ ...prev, script: generated }));
    } catch (e) {
      setReviewData(prev => ({ ...prev, script: `Olá ${lead.name}, gostaria de conversar.` }));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleFinalConnection = () => {
    const cleaned = reviewData.phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      alert("Comandante, o número é inválido.");
      return;
    }
    const finalPhone = cleaned.length <= 11 ? '55' + cleaned : cleaned;
    const waUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(reviewData.script)}`;
    window.open(waUrl, '_blank');
    if (onUpdateStatus && reviewData.lead) {
      onUpdateStatus(reviewData.lead.id, 'Em Contato');
    }
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Filtros e Busca HUD v38.6 - Correção de Clipping */}
      <div className="glass p-8 lg:p-10 rounded-[48px] border border-white/5 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div className="flex items-center gap-5 shrink-0">
              <div className="w-14 h-14 rounded-[20px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                <Target size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Meus Leads Alpha</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Gestão de Alvos com Score & ID Rodney</p>
              </div>
           </div>
           
           <div className="flex bg-slate-950 p-1 rounded-[24px] border border-white/10 overflow-x-auto no-scrollbar shrink-0 max-w-full">
              <button 
                onClick={() => setStatusFilter('Todos')} 
                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === 'Todos' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Todos
              </button>
              {['Novo', 'Em Contato', 'Agendado', 'Negócio Fechado'].map(opt => (
                <button 
                  key={opt} 
                  onClick={() => setStatusFilter(opt as any)} 
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === opt ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
                >
                  {opt}
                </button>
              ))}
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="Nome ou necessidade..." 
              className="w-full bg-slate-950 border border-white/10 rounded-[28px] pl-16 pr-8 py-5 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-inner" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="lg:col-span-3 relative">
            <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID Rodney..." 
              className="w-full bg-slate-950 border border-white/10 rounded-[28px] pl-16 pr-8 py-5 text-sm font-bold text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-inner" 
              value={searchId} 
              onChange={(e) => setSearchId(e.target.value)} 
            />
          </div>

          <div className="lg:col-span-5 glass-dark bg-slate-950/40 p-5 rounded-[28px] border border-white/5 space-y-4">
             <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                   <SlidersHorizontal size={14} className="text-indigo-400" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score Mínimo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={10} className="text-amber-400" />
                  <span className="text-xs font-black text-indigo-400">{minScore}%</span>
                </div>
             </div>
             <div className="relative pt-1">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="glass rounded-[56px] border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col h-full overflow-hidden shadow-xl bg-slate-900/20">
            <div className="p-10 pb-6 flex justify-between items-center">
               <div className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${getStatusStyle(lead.status)}`}>
                  {lead.status}
               </div>
               <div className="flex items-center gap-1 bg-indigo-600/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                  <Zap size={12} className="text-amber-400" />
                  <span className="text-xs font-black text-white">{lead.score}%</span>
               </div>
            </div>
            <div className="px-10 pb-8 flex flex-col items-center text-center space-y-5 flex-1">
               <div className="w-24 h-24 rounded-[32px] bg-slate-950 border border-white/10 flex items-center justify-center font-black text-3xl text-indigo-400 shadow-2xl group-hover:scale-105 transition-transform duration-500">{lead.name.charAt(0)}</div>
               <div>
                  <h4 className="font-black text-2xl text-white tracking-tighter uppercase leading-tight">{lead.name}</h4>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase"><MapPin size={12} className="text-indigo-500" /> {lead.location}</div>
                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">ID: {lead.id}</div>
                  </div>
               </div>
               <div className="bg-slate-950/60 p-6 rounded-[32px] border border-white/5 italic text-xs text-slate-400 leading-relaxed text-center w-full min-h-[100px] flex items-center justify-center">"{lead.need}"</div>
            </div>
            <div className="p-10 pt-8">
              <button 
                onClick={() => openReviewPanel(lead)} 
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <MessageCircle size={18} /> Protocolo Meta MRT
              </button>
            </div>
          </div>
        ))}
        {filteredLeads.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-[48px] border border-dashed border-white/10 space-y-4">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-700">
               <SlidersHorizontal size={32} />
            </div>
            <div>
               <h3 className="font-black text-white uppercase italic">Nenhum alvo localizado</h3>
               <p className="text-slate-500 text-xs font-medium">Tente ajustar o Score, ID ou os termos de busca.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal MRT Triplo Otimizado */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-xl w-full glass rounded-[48px] border border-indigo-500/30 p-10 space-y-8 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Briefing MRT</h3>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Protocolo de Auditoria Pré-Envio</p>
               </div>
               <button onClick={() => setShowReviewModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><PhoneCall size={12} className="text-indigo-400" /> WhatsApp do Lead</label>
                  <input type="tel" value={reviewData.phone} onChange={(e) => setReviewData({...reviewData, phone: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500/50 outline-none shadow-inner" />
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Edit3 size={12} className="text-indigo-400" /> Revisão de Copy Alpha</label>
                  <div className="relative">
                    <textarea value={reviewData.script} onChange={(e) => setReviewData({...reviewData, script: e.target.value})} rows={5} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-6 text-xs text-slate-300 outline-none resize-none leading-relaxed shadow-inner" />
                    {isGeneratingScript && <div className="absolute inset-0 bg-slate-950/60 rounded-2xl flex items-center justify-center"><Loader2 className="animate-spin text-indigo-400" /></div>}
                  </div>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setShowReviewModal(false)} className="flex-1 py-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Cancelar</button>
               <button onClick={handleFinalConnection} className="flex-2 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                 <Check size={18} /> Abrir Canal Meta
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status: Lead['status']) => {
  switch (status) {
    case 'Novo': return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5';
    case 'Em Contato': return 'text-orange-400 border-orange-500/30 bg-orange-500/5';
    case 'Agendado': return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
    case 'Negócio Fechado': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    default: return 'text-slate-400 border-white/10 bg-white/5';
  }
};
