
import React, { useState } from 'react';
import { Lead, UserProfile, SearchSchedule } from '../types';
import { searchLeadsDeep, generateTripleScript } from '../services/geminiService';
import { Search, Loader2, Globe, Zap, MapPin, MessageCircle, X, Check, Edit3, PhoneCall, Clock, Target, MousePointer2, Save, Mail, Send, Users } from 'lucide-react';

interface SocialRadarProps {
  onLeadsFound: (leads: Lead[]) => void;
  profile: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onUpdateStatus?: (id: string, status: Lead['status']) => void;
}

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

export const SocialRadar = ({ onLeadsFound, profile, onUpdateProfile, onUpdateStatus }: SocialRadarProps) => {
  const [niche, setNiche] = useState('apartamento 2 dormitórios');
  const [location, setLocation] = useState('Taubaté SP');
  const [searchType, setSearchType] = useState<'owner' | 'buyer'>('buyer');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ leads: any[], sources: any[] } | null>(null);
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedDays, setSchedDays] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
  const [schedTime, setSchedTime] = useState('08:00');
  const [schedStartDate, setSchedStartDate] = useState(new Date().toISOString().split('T')[0]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false);
  const [scripts, setScripts] = useState<string[]>([]);
  const [selectedScriptIdx, setSelectedScriptIdx] = useState(0);
  const [reviewData, setReviewData] = useState<{ lead: any | null, phone: string }>({
    lead: null,
    phone: ''
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setResults(null);
    setError(null);
    try {
      const data = await searchLeadsDeep(niche, location, profile, searchType);
      setResults(data);
      if (data.leads && data.leads.length > 0) onLeadsFound(data.leads);
      else setError("Nenhum lead detectado.");
    } catch (err) {
      setError("Erro OSINT.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveSchedule = () => {
    if (!onUpdateProfile) return;
    setIsScheduling(true);
    const newSchedule: SearchSchedule = {
      id: Math.random().toString(36).substring(2, 9),
      niche, location, type: searchType,
      days: schedDays, startTime: schedTime, startDate: schedStartDate,
      active: true
    };
    onUpdateProfile({ ...profile, schedules: [...(profile.schedules || []), newSchedule] });
    setTimeout(() => {
      setIsScheduling(false);
      setShowScheduleModal(false);
    }, 500);
  };

  const openReviewPanel = async (lead: any) => {
    setReviewData({ lead, phone: lead.contact?.replace(/\D/g, '') || '' });
    setSelectedScriptIdx(0);
    setScripts([]);
    setShowReviewModal(true);
    setIsGeneratingScripts(true);
    try {
      const generated = await generateTripleScript(lead, profile);
      setScripts(generated);
    } catch (e) {
      setScripts([`Olá ${lead.name}, sou o ${profile.brokerName}.`]);
    } finally {
      setIsGeneratingScripts(false);
    }
  };

  const handleFinalConnection = () => {
    const cleaned = reviewData.phone.replace(/\D/g, '');
    const finalPhone = cleaned.length <= 11 ? '55' + cleaned : cleaned;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(scripts[selectedScriptIdx])}`, '_blank');
    if (onUpdateStatus && reviewData.lead) onUpdateStatus(reviewData.lead.id, 'Em Contato');
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="glass p-8 rounded-[48px] border border-white/10 bg-slate-900/40 relative overflow-hidden">
        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-4">
             <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg"><Target size={24} /></div>
             <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Rodney Radar v51.2.3</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Extração Alpha OSINT</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 p-1 bg-slate-950 rounded-[28px] border border-white/10 gap-1">
            <button onClick={() => setSearchType('owner')} className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${searchType === 'owner' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
              <Users size={16} className="inline mr-2" /> Dono Direto
            </button>
            <button onClick={() => setShowScheduleModal(true)} className="py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-amber-500 bg-amber-500/5 hover:bg-amber-600 hover:text-white border border-amber-500/20">
              <Clock size={16} className="inline mr-2" /> Agendar Busca
            </button>
            <button onClick={() => setSearchType('buyer')} className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${searchType === 'buyer' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>
              <MousePointer2 size={16} className="inline mr-2" /> Compradores
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-3xl px-8 py-5 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" placeholder="Nicho..." />
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-3xl px-8 py-5 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" placeholder="Localização..." />
          </div>

          <button onClick={handleSearch} disabled={isSearching} className="w-full btn-premium py-7 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4">
            {isSearching ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
            {isSearching ? 'RODNEY EXTRAINDO...' : 'INICIAR VARREDURA'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results?.leads.map((lead: any) => (
          <div key={lead.id} className="glass rounded-[56px] border border-white/5 p-10 flex flex-col items-center text-center space-y-6 shadow-2xl bg-slate-900/20 group">
             <div className="w-20 h-20 rounded-[28px] bg-slate-950 border border-white/10 flex items-center justify-center font-black text-3xl text-white group-hover:scale-110 transition-transform">
                {lead.name.charAt(0)}
             </div>
             <div>
               <h4 className="font-black text-xl text-white uppercase">{lead.name}</h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lead.location}</p>
             </div>
             <p className="bg-slate-950/80 p-6 rounded-[32px] text-[11px] text-slate-400 leading-relaxed italic">"{lead.need}"</p>
             <button onClick={() => openReviewPanel(lead)} disabled={!lead.contact} className={`w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${lead.contact ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                <MessageCircle size={20} /> ABORDAR LEAD
             </button>
          </div>
        ))}
      </div>

      {/* MODAL DE AGENDAMENTO */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="max-w-xl w-full glass rounded-[56px] border border-amber-500/30 p-12 space-y-8 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between relative z-[1001]">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">AGENDAMENTO ALPHA</h3>
                <button 
                  onClick={() => setShowScheduleModal(false)} 
                  className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg active:scale-90"
                >
                  <X size={32} strokeWidth={3} />
                </button>
              </div>
              <div className="space-y-6">
                 <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map(day => (
                      <button key={day} onClick={() => setSchedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${schedDays.includes(day) ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-white/5 text-slate-600'}`}>
                         {day}
                      </button>
                    ))}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none" />
                    <input type="date" value={schedStartDate} onChange={(e) => setSchedStartDate(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none" />
                 </div>
              </div>
              <button onClick={handleSaveSchedule} disabled={isScheduling} className="w-full py-6 bg-amber-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isScheduling ? <Loader2 className="animate-spin" /> : <Save size={18} />} ATIVAR AUTOMAÇÃO
              </button>
           </div>
        </div>
      )}

      {/* MODAL MRT */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="max-w-xl w-full glass rounded-[64px] border border-indigo-500/30 p-12 space-y-8 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between relative z-[1001]">
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">MRT TRIPLE ALPHA</h3>
               <button 
                 onClick={() => setShowReviewModal(false)} 
                 className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg active:scale-90"
               >
                 <X size={32} strokeWidth={3} />
               </button>
            </div>
            <div className="space-y-6">
               <input type="tel" value={reviewData.phone} onChange={(e) => setReviewData({...reviewData, phone: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white outline-none" />
               <div className="space-y-3">
                  {isGeneratingScripts ? <div className="p-10 text-center"><Loader2 className="animate-spin text-indigo-400 mx-auto" /></div> : (
                    scripts.map((script, idx) => (
                      <button key={idx} onClick={() => setSelectedScriptIdx(idx)} className={`w-full p-5 rounded-3xl text-left text-xs transition-all border ${selectedScriptIdx === idx ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-white/5 text-slate-400'}`}>
                         {script}
                      </button>
                    ))
                  )}
               </div>
            </div>
            <button onClick={handleFinalConnection} disabled={isGeneratingScripts || scripts.length === 0} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
               <Check size={20} /> DISPARAR WHATSAPP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
