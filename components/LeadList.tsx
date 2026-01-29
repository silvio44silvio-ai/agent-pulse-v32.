
import React, { useState } from 'react';
import { Lead, UserProfile } from '../types';
import { generateWhatsAppScript } from '../services/geminiService';
import { 
  MessageCircle, Loader2, Search, MapPin, FileText, 
  Target, Users as UsersIcon, Clock, AlertTriangle 
} from 'lucide-react';

interface LeadListProps {
  leads: Lead[];
  profile: UserProfile;
  onUpdateStatus: (leadId: string, status: Lead['status']) => void;
  onAttachPhoto?: (leadId: string, photoBase64: string) => void;
  onUpdateLead?: (lead: Lead) => void;
}

const STATUS_OPTIONS: Lead['status'][] = ['Novo', 'Em Contato', 'Agendado', 'Negócio Fechado'];

export const LeadList = ({ leads, profile, onUpdateStatus, onUpdateLead }: LeadListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'Todos'>('Todos');
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const filteredLeads = (leads || []).filter(l => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (l.name || "").toLowerCase().includes(searchLower);
    const needMatch = (l.need || "").toLowerCase().includes(searchLower);
    const statusMatch = statusFilter === 'Todos' || l.status === statusFilter;
    return (nameMatch || needMatch) && statusMatch;
  });

  // Lógica Alpha de 7 dias
  const isStale = (lastInteraction?: string) => {
    if (!lastInteraction) return true;
    const lastDate = new Date(lastInteraction).getTime();
    const now = Date.now();
    const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);
    return diffDays >= 7;
  };

  const handleGenerateScript = async (lead: Lead) => {
    let phoneInput = lead.contact || "";
    if (!phoneInput || phoneInput.trim().length < 8) {
      phoneInput = prompt(`Digite o WhatsApp de ${lead.name}:`, "") || "";
      if (!phoneInput.trim()) return;
    }
    setGeneratingFor(lead.id);
    try {
      const script = await generateWhatsAppScript(lead, profile);
      const cleanedPhone = phoneInput.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanedPhone}?text=${encodeURIComponent(script)}`, '_blank');
      onUpdateStatus(lead.id, 'Em Contato');
    } catch (e) {
      alert("Erro ao integrar com WhatsApp.");
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="glass p-8 lg:p-10 rounded-[48px] border border-white/5 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[20px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                <Target size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Meus Leads Alpha</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Gestão de Funil de Elite</p>
              </div>
           </div>
           
           <div className="flex bg-slate-950/80 p-1.5 rounded-[24px] border border-white/10 overflow-x-auto no-scrollbar">
              <button onClick={() => setStatusFilter('Todos')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === 'Todos' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Todos</button>
              {STATUS_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setStatusFilter(opt)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === opt ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>{opt}</button>
              ))}
           </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou necessidade..." 
            className="w-full bg-slate-950 border border-white/10 rounded-[32px] pl-16 pr-8 py-6 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredLeads.map((lead) => {
          const leadIsStale = isStale(lead.lastInteraction);
          return (
            <div key={lead.id} className="glass rounded-[56px] border border-white/5 hover:border-indigo-500/30 transition-all group relative flex flex-col h-full overflow-hidden hover:shadow-2xl hover:shadow-indigo-600/10">
              
              {/* PONTO VERMELHO ALPHA (LEAD PARADO) */}
              {leadIsStale && (
                <div className="absolute top-8 right-10 flex items-center gap-3 z-10">
                  <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Estagnado</span>
                  <div className="red-pulse-core">
                    <div className="red-pulse-ring"></div>
                  </div>
                </div>
              )}

              <div className="p-10 pb-6 flex justify-between items-start">
                 <div className={`text-[9px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                 </div>
              </div>

              <div className="px-10 pb-8 flex flex-col items-center text-center space-y-5">
                 <div className="w-24 h-24 rounded-[32px] bg-slate-900 border border-white/10 flex items-center justify-center font-black text-3xl text-indigo-400 shadow-2xl">
                    {(lead.name || "A").charAt(0)}
                 </div>
                 <div>
                    <h4 className="font-black text-2xl text-white tracking-tighter uppercase leading-tight group-hover:text-indigo-400 transition-colors">{lead.name}</h4>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase italic tracking-tight">
                      <MapPin size={12} className="text-indigo-500" /> {lead.location}
                    </div>
                 </div>
              </div>

              <div className="px-10 flex-1">
                 <div className="bg-slate-950/50 p-6 rounded-[32px] border border-white/5 italic text-xs text-slate-400 leading-relaxed text-center min-h-[100px] flex items-center justify-center">
                    "{lead.need || 'Nenhuma necessidade registrada.'}"
                 </div>
              </div>

              <div className="p-10 pt-8 flex gap-4">
                <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><FileText size={20} /></button>
                <button 
                  onClick={() => handleGenerateScript(lead)} 
                  disabled={generatingFor === lead.id}
                  className="flex-1 px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all"
                >
                  {generatingFor === lead.id ? <Loader2 className="animate-spin" size={16} /> : <><MessageCircle size={18} /> Abordar</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
