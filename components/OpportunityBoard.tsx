
import React, { useState, useEffect, useRef } from 'react';
import { JobOpportunity, TalentProfile } from '../types';
import { 
  Briefcase, Building2, MapPin, DollarSign, Plus, Search, 
  MessageCircle, X, UserCheck, User, Loader2, Globe, ShieldCheck,
  Star, Trophy, ArrowUpRight, Camera, Image as ImageIcon, Trash2
} from 'lucide-react';

const INITIAL_JOBS: JobOpportunity[] = [
  {
    id: 'seed-1',
    type: 'agency_seeking',
    title: 'Corretor Especialista - Jardim Aquarius',
    company: 'Alpha Real Estate',
    description: 'Buscamos profissionais com foco em alto padrão para atuar no vetor de crescimento de SJC. Oferecemos lead scoring avançado e suporte jurídico.',
    location: 'São José dos Campos, SP',
    remuneration: 'Comissão 2.5% + Bônus',
    postedAt: 'Hoje',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'seed-2',
    type: 'broker_seeking',
    title: 'Parceria em Lançamento Litoral',
    company: 'Rodney Invest',
    description: 'Tenho 15 leads qualificados para investimento em frente ao mar mas não atuo na região. Busco agência parceira em Ubatuba.',
    location: 'Ubatuba, SP',
    remuneration: 'Parceria 50/50',
    postedAt: 'Ontem',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'
  }
];

const INITIAL_TALENTS: TalentProfile[] = [
  {
    id: 'talent-1',
    name: 'Ana Paula Mendes',
    role: 'Corretora Senior / Captadora',
    experience: '12 anos de mercado. Especialista em regularização de imóveis rurais e grandes áreas comerciais.',
    contact: '11999998888',
    location: 'São Paulo, SP',
    type: 'professional',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'talent-2',
    name: 'Marcos Oliveira',
    role: 'Gestor de Tráfego Imobiliário',
    experience: 'Ex-gerente da Zap Imóveis. Especialista em Google Ads e Meta Ads focado em conversão de leads proprietários.',
    contact: '12988887777',
    location: 'SJC, SP',
    type: 'specialist',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
  }
];

export const OpportunityBoard = () => {
  const [viewMode, setViewMode] = useState<'jobs' | 'talents'>('jobs');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [talents, setTalents] = useState<TalentProfile[]>([]);

  const [formData, setFormData] = useState<any>({
    type: 'professional',
    name: '',
    role: '',
    experience: '',
    location: '',
    contact: '',
    remuneration: '',
    image: ''
  });

  useEffect(() => {
    const localJobs = JSON.parse(localStorage.getItem('local_db_opportunities') || '[]');
    const localTalents = JSON.parse(localStorage.getItem('local_db_talents') || '[]');
    
    if (localJobs.length === 0) {
      setJobs(INITIAL_JOBS);
      localStorage.setItem('local_db_opportunities', JSON.stringify(INITIAL_JOBS));
    } else {
      setJobs(localJobs);
    }

    if (localTalents.length === 0) {
      setTalents(INITIAL_TALENTS);
      localStorage.setItem('local_db_talents', JSON.stringify(INITIAL_TALENTS));
    } else {
      setTalents(localTalents);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newItemBase = {
      id: Math.random().toString(36).substring(2, 9),
      postedAt: 'Agora',
      image: formData.image
    };

    if (viewMode === 'jobs') {
      const newJob: JobOpportunity = {
        ...newItemBase,
        type: formData.type === 'professional' ? 'broker_seeking' : 'agency_seeking',
        title: formData.role,
        company: formData.name,
        description: formData.experience,
        location: formData.location,
        remuneration: formData.remuneration || 'A combinar',
      };
      const updated = [newJob, ...jobs];
      setJobs(updated);
      localStorage.setItem('local_db_opportunities', JSON.stringify(updated));
    } else {
      const newTalent: TalentProfile = {
        ...newItemBase,
        name: formData.name,
        role: formData.role,
        experience: formData.experience,
        contact: formData.contact,
        location: formData.location,
        type: formData.type
      };
      const updated = [newTalent, ...talents];
      setTalents(updated);
      localStorage.setItem('local_db_talents', JSON.stringify(updated));
    }

    setTimeout(() => {
      setIsLoading(false);
      setShowModal(false);
      setFormData({ type: 'professional', name: '', role: '', experience: '', location: '', contact: '', remuneration: '', image: '' });
    }, 500);
  };

  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTalents = talents.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocolo de Networking Alpha</span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Opportunities Mural</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">Conexões de Elite & Identidade Visual</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-premium text-white font-black px-10 py-5 rounded-[24px] flex items-center justify-center gap-3 text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          <Plus size={20} /> Publicar Oportunidade
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="glass p-1.5 rounded-[28px] border border-white/10 flex items-center gap-1 w-full md:w-auto shrink-0 shadow-xl">
          <button 
            onClick={() => setViewMode('jobs')} 
            className={`flex-1 md:flex-none px-10 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'jobs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Ofertas de Vagas
          </button>
          <button 
            onClick={() => setViewMode('talents')} 
            className={`flex-1 md:flex-none px-10 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'talents' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Banco de Talentos
          </button>
        </div>
        <div className="relative flex-1 group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
           <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder={`Pesquisar ${viewMode === 'jobs' ? 'vagas e parcerias' : 'profissionais e especialistas'}...`} 
              className="w-full bg-slate-950/80 border border-white/10 rounded-[32px] pl-16 pr-8 py-6 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 text-sm text-slate-200 shadow-inner" 
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {viewMode === 'jobs' ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="glass rounded-[48px] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-600/10">
              {/* Imagem de Capa para Vagas */}
              <div className="h-40 w-full relative overflow-hidden">
                {job.image ? (
                  <img src={job.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={job.title} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center">
                    <ImageIcon size={40} className="text-white/10" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[8px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest shadow-xl">
                  {job.postedAt}
                </div>
              </div>

              <div className="p-8 space-y-6 flex flex-col flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{job.company}</p>
                  </div>
                </div>
                
                <p className="text-slate-400 text-xs italic leading-relaxed flex-1">
                  "{job.description}"
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                        <MapPin size={14} className="text-indigo-400" /> {job.location}
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase">
                        <DollarSign size={14} /> {job.remuneration}
                     </div>
                  </div>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all">
                    Candidatar-se à Vaga <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredTalents.map((talent) => (
            <div key={talent.id} className="glass p-8 rounded-[48px] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-emerald-600/10">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-800 border-2 border-emerald-500/30 overflow-hidden flex items-center justify-center text-emerald-400 text-2xl font-black shadow-xl">
                    {talent.image ? (
                      <img src={talent.image} className="w-full h-full object-cover" alt={talent.name} />
                    ) : (
                      talent.name.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-lg text-white shadow-lg">
                     <ShieldCheck size={12} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{talent.name}</h3>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <Star size={10} className="text-amber-500" fill="currentColor" /> {talent.role}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-black uppercase tracking-tighter">Verificado Alpha</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-xs italic leading-relaxed mb-8 flex-1">
                "{talent.experience}"
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                      <MapPin size={14} className="text-emerald-400" /> {talent.location}
                   </div>
                   <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sócio-Membro</div>
                </div>
                <button 
                  onClick={() => window.open(`https://wa.me/${talent.contact?.replace(/\D/g, '')}`, '_blank')}
                  className="w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/20 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                >
                  <MessageCircle size={16} /> Entrar em Contato Tático
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <form onSubmit={handlePost} className="max-w-xl w-full glass rounded-[56px] border border-white/10 p-12 space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[60px] rounded-full"></div>
              
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Publicação Alpha</h3>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                {/* Seletor de Foto */}
                <div className="flex flex-col items-center gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 rounded-[32px] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all overflow-hidden group"
                  >
                    {formData.image ? (
                      <div className="relative w-full h-full">
                        <img src={formData.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                           <Trash2 className="text-white" onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ''}); }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="text-slate-500 mb-2" size={32} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adicionar Foto do Anúncio</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Nome / Empresa" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required placeholder="Título / Cargo" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                </div>
                
                <textarea required placeholder="Detalhes técnicos, experiência ou descrição da vaga..." className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-6 text-xs font-medium text-white outline-none h-32 resize-none focus:ring-1 focus:ring-indigo-500/50" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Localização" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  <input required placeholder={viewMode === 'jobs' ? "Remuneração" : "WhatsApp (DDD)"} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500/50" value={formData.contact || formData.remuneration} onChange={e => setFormData({...formData, contact: e.target.value, remuneration: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                   {isLoading && <Loader2 className="animate-spin" size={14} />}
                   Sincronizar no Mural
                </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
