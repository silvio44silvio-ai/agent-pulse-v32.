
import React, { useState, useEffect } from 'react';
import { MOCK_CONTACTS } from '../constants';
import { ChatContact, InternalMessage } from '../types';
import { Send, Search, MoreVertical, Phone, Video, Hash, Users, CheckCheck, Mail, ChevronLeft, Plus, ShieldCheck, Zap, Info, ShieldAlert, ArrowRight, Copy, Check, MessageSquare } from 'lucide-react';

export const Messenger = () => {
  const [activeTab, setActiveTab] = useState<'direct' | 'squads'>('direct');
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(MOCK_CONTACTS[0]);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [input, setInput] = useState('');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0); 
  const [copied, setCopied] = useState(false);
  
  const [squads, setSquads] = useState<ChatContact[]>([
    { id: 'g1', name: 'Squad Vendas Alpha', role: 'Time de Vendas', online: true, lastMessage: 'Novos leads no radar!', isGroup: true, membersCount: 12 },
    { id: 'g2', name: 'Plantão Aquarius', role: 'Lançamentos', online: true, lastMessage: 'Tabela de preços atualizada.', isGroup: true, membersCount: 5 }
  ]);

  const [messages, setMessages] = useState<InternalMessage[]>([
    { id: '1', senderId: 'c1', senderName: 'Ricardo Santos', text: 'Fala Alpha! Conseguiu falar com o lead do Aquarius?', timestamp: new Date(Date.now() - 1000 * 60 * 30), isMe: false },
    { id: '2', senderId: 'me', senderName: 'Eu', text: 'Opa Ricardo, acabei de gerar o script de abordagem aqui no AgentPulse. Vou disparar agora.', timestamp: new Date(Date.now() - 1000 * 60 * 15), isMe: true },
    { id: '3', senderId: 'c1', senderName: 'Ricardo Santos', text: 'Show! Se precisar de ajuda com a tabela de preços nova me avisa.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isMe: false },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: InternalMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Eu',
      text: input,
      timestamp: new Date(),
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const selectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    setShowChatOnMobile(true);
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (e.target as any).squadName.value;
    const newSquad: ChatContact = {
      id: `g${Date.now()}`,
      name,
      role: 'Squad Customizado',
      online: true,
      lastMessage: 'Squad criado com sucesso.',
      isGroup: true,
      membersCount: 1
    };
    setSquads([newSquad, ...squads]);
    setShowNewGroupModal(false);
    setOnboardingStep(0);
  };

  const copyMigrationScript = () => {
    const script = `🚨 COMUNICADO TÁTICO: Pessoal, para garantir a segurança dos nossos chips contra o banimento do WhatsApp, estamos migrando toda a comunicação estratégica para o AgentPulse AI. Entrem no novo Squad de Vendas por lá. Protocolo Rodney Ativado.`;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)] flex glass rounded-3xl lg:rounded-[40px] border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-500 shadow-2xl relative">
      
      {/* Sidebar de Contatos */}
      <div className={`w-full md:w-80 border-r border-white/5 bg-slate-900/40 backdrop-blur-md flex flex-col ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 lg:p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base lg:text-xl font-bold flex items-center gap-2 text-white italic">
              Messenger
              <span className="bg-indigo-600 text-[9px] px-2 py-0.5 rounded-full">Pro</span>
            </h3>
            <button 
              onClick={() => { setOnboardingStep(0); setShowNewGroupModal(true); }}
              className="p-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Botão de Chamado de Orientação Tática */}
          <button 
            onClick={() => { setOnboardingStep(0); setShowNewGroupModal(true); }}
            className="w-full group flex items-center gap-4 p-3.5 bg-gradient-to-r from-orange-600/20 to-amber-600/10 border border-orange-500/30 rounded-2xl hover:from-orange-600 hover:to-amber-500 transition-all duration-500 shadow-lg shadow-orange-600/10"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
               <MessageSquare size={20} fill="currentColor" />
            </div>
            <div className="text-left">
               <p className="text-[10px] font-black text-orange-400 group-hover:text-white uppercase tracking-widest">Chamado Squad</p>
               <p className="text-[8px] font-bold text-slate-500 group-hover:text-white/80 uppercase">Criar & Orientar Time</p>
            </div>
          </button>

          <div className="flex p-1 bg-slate-950 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'direct' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Diretas
            </button>
            <button 
              onClick={() => setActiveTab('squads')}
              className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'squads' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Squads
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {(activeTab === 'direct' ? MOCK_CONTACTS : squads).map((contact) => (
            <button
              key={contact.id}
              onClick={() => selectContact(contact)}
              className={`w-full p-4 flex items-center gap-3 transition-all border-b border-white/5 hover:bg-white/5 ${selectedContact?.id === contact.id ? 'bg-indigo-600/10' : ''}`}
            >
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border border-white/10 text-xs ${contact.isGroup ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-indigo-400'}`}>
                  {contact.isGroup ? <Users size={16} /> : contact.name.charAt(0)}
                </div>
                {!contact.isGroup && contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-xs truncate text-slate-200">{contact.name}</h4>
                  <span className="text-[8px] text-slate-500 font-bold uppercase">14:20</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate font-medium">
                  {contact.isGroup && <span className="text-emerald-500/70 mr-1 font-black">SQUAD:</span>}
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-950/40">
           <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
              <ShieldCheck size={12} className="text-indigo-500" /> Rodney Security Protocol
           </div>
        </div>
      </div>

      {/* Janela de Chat */}
      <div className={`flex-1 flex-col bg-slate-950/20 ${showChatOnMobile ? 'flex' : 'hidden md:flex'}`}>
        {selectedContact ? (
          <>
            <div className="p-4 lg:p-6 border-b border-white/5 bg-slate-900/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 lg:gap-4">
                <button 
                  onClick={() => setShowChatOnMobile(false)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center font-bold border text-xs lg:text-sm ${selectedContact.isGroup ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20' : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/20'}`}>
                  {selectedContact.isGroup ? <Users size={18} /> : selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xs lg:text-base text-white">{selectedContact.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] lg:text-[10px] text-slate-500 font-black uppercase tracking-widest">{selectedContact.isGroup ? `${selectedContact.membersCount} Operadores` : selectedContact.role}</span>
                    {selectedContact.isGroup && <span className="w-1 h-1 rounded-full bg-emerald-500"></span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 lg:gap-3">
                 <button className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all"><Phone size={16} /></button>
                 <button className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition-all"><MoreVertical size={16} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-6 no-scrollbar">
              <div className="flex justify-center mb-2">
                 <span className="text-[8px] lg:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] bg-white/5 px-4 py-1 rounded-full border border-white/5">Protocolo Contingência Ativo</span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] lg:max-w-[70%] space-y-1.5`}>
                    {!msg.isMe && selectedContact.isGroup && (
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">{msg.senderName}</span>
                    )}
                    <div className={`p-3 lg:p-4 rounded-2xl ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'glass-dark border border-white/5 text-slate-200 rounded-tl-none'}`}>
                      <p className="text-[11px] lg:text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 ${msg.isMe ? 'justify-end' : 'justify-start'} opacity-30`}>
                      <span className="text-[7px] lg:text-[9px] font-black uppercase">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.isMe && <CheckCheck size={10} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 lg:p-8 bg-slate-900/60 border-t border-white/5">
              <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2 lg:gap-4">
                 <button type="button" className="hidden lg:flex p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-all border border-white/5"><Hash size={18} /></button>
                 <div className="relative flex-1">
                   <input 
                     type="text" 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder={selectedContact.isGroup ? "Mensagem para o Squad..." : "Sua mensagem direta..."} 
                     className="w-full bg-slate-950 border border-white/10 rounded-2xl lg:rounded-[32px] px-4 lg:px-8 py-2.5 lg:py-4 focus:ring-1 focus:ring-indigo-500/50 outline-none text-[11px] lg:text-sm font-medium text-white" 
                   />
                 </div>
                 <button type="submit" className="p-2.5 lg:p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shadow-xl shadow-indigo-600/30">
                    <Send size={16} />
                 </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center bg-slate-950/20">
             <div className="space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-slate-700">
                  <Mail size={32} />
                </div>
                <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Selecione uma conversa ou Squad</h3>
             </div>
          </div>
        )}
      </div>

      {/* Modal de Novo Squad com Chamado de Orientação */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-[400] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="max-w-xl w-full glass p-10 rounded-[48px] border border-orange-500/30 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldAlert size={120} className="text-orange-500" />
              </div>
              
              {onboardingStep === 0 ? (
                // ETAPA 1: Chamado de Orientação Tática
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto">
                         <MessageSquare size={28} fill="currentColor" />
                      </div>
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Chamado Squad Alpha</h2>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Migração de Equipe em Modo Seguro</p>
                   </div>

                   <div className="space-y-6">
                      <p className="text-xs text-slate-400 text-center leading-relaxed">
                        Copie o script abaixo e cole no seu grupo antigo (WhatsApp) para convocar sua equipe para o ambiente blindado do AgentPulse.
                      </p>
                      <div className="bg-slate-950 p-6 rounded-3xl border border-orange-500/20 relative group">
                        <p className="text-[11px] text-orange-400/90 leading-relaxed font-bold italic">
                          "🚨 COMUNICADO TÁTICO: Pessoal, para garantir a segurança dos nossos chips contra o banimento do WhatsApp, estamos migrando toda a comunicação estratégica para o AgentPulse AI. Entrem no novo Squad de Vendas por lá. Protocolo Rodney Ativado."
                        </p>
                        <button 
                          onClick={copyMigrationScript}
                          className="absolute top-4 right-4 p-2 bg-orange-600/10 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg transition-all"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button 
                        onClick={() => setShowNewGroupModal(false)}
                        className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
                      >
                         Abortar
                      </button>
                      <button 
                        onClick={() => setOnboardingStep(1)}
                        className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2"
                      >
                         Prosseguir para Criação
                         <ArrowRight size={14} />
                      </button>
                   </div>
                </div>
              ) : (
                // ETAPA 2: Formulário de Criação Final
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto">
                         <Zap size={28} />
                      </div>
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Nomear Novo Squad</h2>
                   </div>

                   <form onSubmit={handleCreateSquad} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Célula Operacional</label>
                         <input 
                            name="squadName"
                            required
                            placeholder="Ex: Squad Lançamento Moema"
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-orange-500/50"
                         />
                      </div>

                      <div className="flex gap-4">
                         <button 
                            type="button" 
                            onClick={() => setOnboardingStep(0)}
                            className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
                         >
                            Voltar
                         </button>
                         <button 
                            type="submit"
                            className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20"
                         >
                            Finalizar Criação
                         </button>
                      </div>
                   </form>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
