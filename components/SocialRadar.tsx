
import React, { useState, useEffect } from 'react';
import { Lead, UserProfile, SearchSchedule } from '../types';
import { searchLeads, generateWhatsAppScript } from '../services/geminiService';
import { Search, Loader2, Globe, Zap, UserCheck, Home, MapPin, ShieldCheck, Calendar, Clock, Plus, Trash2, Bell, MessageCircle, Navigation, UserSearch, Map as MapIcon } from 'lucide-react';

interface SocialRadarProps {
  onLeadsFound: (leads: Lead[]) => void;
  profile: UserProfile;
  onUpdateStatus?: (id: string, status: Lead['status']) => void;
}

const DAYS_OF_WEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

export const SocialRadar = ({ onLeadsFound, profile, onUpdateStatus }: SocialRadarProps) => {
  const [niche, setNiche] = useState('Apartamentos de Luxo');
  const [location, setLocation] = useState('São José dos Campos, SP');
  const [searchType, setSearchType] = useState<'buyer' | 'owner'>('buyer');
  const [isSearching, setIsSearching] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [results, setResults] = useState<{ leads: Lead[], sources: any[] } | null>(null);
  const [coords, setCoords] = useState<{ latitude: number, longitude: number } | undefined>();
  
  // Estados para Programação
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [schedules, setSchedules] = useState<SearchSchedule[]>(() => {
    const saved = localStorage.getItem('agentPulse_schedules');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSched, setNewSched] = useState<Partial<SearchSchedule>>({
    days: [],
    time: '09:00',
    active: true
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.warn("Geolocalização negada pelo usuário.")
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('agentPulse_schedules', JSON.stringify(schedules));
  }, [schedules]);

  const formatWhatsAppNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 || cleaned.length === 10) {
      cleaned = '55' + cleaned;
    }
    return cleaned;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setResults(null);
    try {
      const data = await searchLeads(niche, location, profile, searchType, coords);
      setResults(data);
      onLeadsFound(data.leads);
    } catch (error: any) {
      alert("Erro na conexão com o Radar. Verifique sua API Key.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDirectContact = async (lead: Lead) => {
    let phoneInput = lead.contact || "";
    if (!phoneInput || phoneInput.length < 8) {
        phoneInput = prompt(`O lead ${lead.name} não possui telefone no perfil público. Digite o WhatsApp (com DDD) para abordar com IA:`, "") || "";
        if (!phoneInput.trim()) return;
    }

    const finalPhone = formatWhatsAppNumber(phoneInput);
    setGeneratingId(lead.id);

    try {
      const script = await generateWhatsAppScript(lead, profile);
      const encodedText = encodeURIComponent(script);
      const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodedText}`;

      const stats = localStorage.getItem('agentPulse_sent_count');
      const parsed = stats ? JSON.parse(stats) : { date: new Date().toLocaleDateString(), count: 0 };
      const newCount = (parsed.date === new Date().toLocaleDateString() ? parsed.count : 0) + 1;
      localStorage.setItem('agentPulse_sent_count', JSON.stringify({ date: new Date().toLocaleDateString(), count: newCount }));

      window.open(whatsappUrl, '_blank');
      if (onUpdateStatus) onUpdateStatus(lead.id, 'Em Contato');
    } catch (error) {
      alert("Erro ao gerar script de abordagem ou abrir WhatsApp.");
    } finally {
      setGeneratingId(null);
    }
  };

  const addSchedule = () => {
    if (!newSched.days?.length) return alert("Selecione ao menos um dia.");
    const schedule: SearchSchedule = {
      id: Math.random().toString(36).substring(2, 9),
      niche,
      location,
      type: searchType,
      days: newSched.days || [],
      time: newSched.time || '09:00',
      active: true
    };
    setSchedules([...schedules, schedule]);
    setShowScheduleForm(false);
    setNewSched({ days: [], time: '09:00', active: true });
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const toggleDay = (day: string) => {
    const currentDays = newSched.days || [];
    if (currentDays.includes(day)) {
      setNewSched({ ...newSched, days: currentDays.filter(d => d !== day) });
    } else {
      setNewSched({ ...newSched, days: [...currentDays, day] });
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="glass p-8 lg:p-12 rounded-[48px] border border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-600/5 to-transparent shadow-2xl">
        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 shadow-lg shadow-indigo-600/30 p-3 rounded-2xl text-white">
                 <Globe size={24} />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight italic">Radar Social Alpha</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Interceptação OSINT & Programação de Varredura</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {coords && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                  <Navigation size={12} className="text-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">GPS Ativo</span>
                </div>
              )}
              <button 
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className={`p-3 rounded-xl border transition-all ${showScheduleForm ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}
              >
                <Calendar size={20} />
              </button>
            </div>
          </div>

          {/* Form de Programação */}
          {showScheduleForm && (
            <div className="p-8 bg-slate-950/80 rounded-[32px] border border-indigo-500/30 space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3 mb-2">
                <Bell size={18} className="text-indigo-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Programar Varredura Automática</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Dias da Semana</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map(day => (
                      <button 
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-[9px] font-black border transition-all ${newSched.days?.includes(day) ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Horário de Execução</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                    <input 
                      type="time" 
                      value={newSched.time}
                      onChange={(e) => setNewSched({...newSched, time: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-xl px-12 py-3 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={addSchedule}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95"
              >
                <Plus size={16} /> Ativar Agendamento Rodney
              </button>
            </div>
          )}

          {/* Lista de Agendamentos */}
          {schedules.length > 0 && (
            <div className="space-y-3">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Varreduras Programadas</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {schedules.map(s => (
                  <div key={s.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg">
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white uppercase">{s.time} • {s.days.join(', ')}</div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-tight truncate max-w-[120px]">{s.niche} em {s.location}</div>
                      </div>
                    </div>
                    <button onClick={() => deleteSchedule(s.id)} className="p-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-[28px] border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setSearchType('buyer')}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${searchType === 'buyer' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-400'}`}
            >
              <UserCheck size={16} /> Buscar Compradores
            </button>
            <button 
              onClick={() => setSearchType('owner')}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${searchType === 'owner' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-400'}`}
            >
              <Home size={16} /> Buscar Proprietários
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nicho/Produto</label>
              <input 
                type="text" 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-[22px] px-6 py-5 outline-none text-sm font-bold text-white shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Localização Central</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-[22px] px-6 py-5 outline-none text-sm font-bold text-white shadow-inner"
              />
            </div>
          </div>

          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full btn-premium text-white py-6 rounded-[32px] font-black flex items-center justify-center gap-4 text-sm uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-2xl shadow-indigo-600/40"
          >
            {isSearching ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
            {isSearching ? 'Sincronizando Dados Cartográficos...' : 'Iniciar Varredura Profunda (Manual)'}
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.leads.map((lead) => (
              <div key={lead.id} className="glass p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-xl ${lead.type === 'buyer' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                    {lead.foundAt.toLowerCase().includes('maps') ? <MapIcon size={20} /> : lead.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-black uppercase text-slate-600 tracking-widest mb-1">Fonte de Dados</div>
                    <span className="bg-indigo-500/10 text-indigo-400 text-[8px] px-2 py-1 rounded-md border border-indigo-500/20 font-black uppercase">
                        {lead.foundAt}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-white mb-3 truncate">{lead.name}</h4>
                <div className="bg-slate-950/50 p-4 rounded-2xl mb-6 flex-1 border border-white/5 italic text-slate-400 text-xs leading-relaxed">
                    "{lead.need}"
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-y border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                      <MapPin size={14} className="text-emerald-500" /> {lead.location}
                    </div>
                  </div>

                  {lead.publicProfileUrl && (
                    <button 
                      onClick={() => window.open(lead.publicProfileUrl, '_blank')}
                      className="w-full bg-slate-950 hover:bg-white/5 text-slate-400 hover:text-white border border-white/10 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                      {lead.foundAt.toLowerCase().includes('maps') ? <MapIcon size={16} /> : <UserSearch size={16} />}
                      {lead.foundAt.toLowerCase().includes('maps') ? 'Abrir no Google Maps' : 'Ver Perfil / Post'}
                    </button>
                  )}

                  <button 
                    onClick={() => handleDirectContact(lead)}
                    disabled={generatingId === lead.id}
                    className="w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/20 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                  >
                    {generatingId === lead.id ? <Loader2 className="animate-spin" size={16} /> : <MessageCircle size={16} />}
                    {lead.status === 'Em Contato' ? 'Reabordar Lead' : 'Abordagem WhatsApp IA'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {results.sources.length > 0 && (
            <div className="glass p-8 rounded-[40px] border border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Base de Conhecimento em Tempo Real (Grounding)</h4>
                <div className="flex flex-wrap gap-3">
                    {results.sources.map((source: any, idx: number) => (
                        source.maps || source.web ? (
                            <a 
                                key={idx}
                                href={source.maps?.uri || source.web?.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-[9px] font-black text-slate-400 hover:text-indigo-400 transition-all"
                            >
                                {source.maps ? <MapIcon size={12} /> : <Globe size={12} />}
                                {source.maps?.title || source.web?.title || 'Ver Fonte'}
                            </a>
                        ) : null
                    ))}
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
