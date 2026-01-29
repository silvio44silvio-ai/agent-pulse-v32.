
import React from 'react';
import { Book, Shield, Zap, Instagram, Globe, CheckCircle2, ShieldAlert, MessageSquare } from 'lucide-react';

export const HelpCenter = () => {
  const steps = [
    {
      title: 'Configurar API Key',
      description: 'O AgentPulse utiliza o Google Gemini. Certifique-se de que a variável API_KEY está configurada no seu ambiente.',
      icon: <Shield className="text-indigo-400" />
    },
    {
      title: 'Social Radar',
      description: 'Use o radar para buscar intenções reais. Digite seu nicho e cidade para que a IA faça a varredura em tempo real.',
      icon: <Zap className="text-orange-400" />
    },
    {
      title: 'Link na Bio',
      description: 'Utilize o Chat IA como seu assistente de recepção no Instagram. Envie o link para os leads qualificarem-se.',
      icon: <Instagram className="text-pink-400" />
    },
    {
      title: 'Abordagem Segura',
      description: 'Sempre use as variações de script (Botão Zap). A IA altera a estrutura da mensagem para proteger seu chip.',
      icon: <Globe className="text-emerald-400" />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Central de Sucesso do Corretor</h2>
        <p className="text-slate-400">Aprenda a extrair o máximo de performance e segurança.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" size={20} />
            Início Rápido (Quick Start)
          </h3>
          <ol className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="font-bold text-indigo-400">01.</span>
              <span>Acesse <strong>Configurações</strong> e defina o nome da sua imobiliária.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-400">02.</span>
              <span>Vá até o <strong>Social Radar</strong> e realize sua primeira busca.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-indigo-400">03.</span>
              <span>Em <strong>Meus Leads</strong>, utilize a IA para gerar scripts variados.</span>
            </li>
          </ol>
        </div>

        <div className="glass p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-400">
            <ShieldAlert size={20} />
            Protocolo Anti-Ban WhatsApp
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0"></div>
              <span><strong>Nunca envie a mesma mensagem:</strong> Use sempre o botão "Outra Versão" para cada novo lead.</span>
            </li>
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0"></div>
              <span><strong>Limite de Segurança:</strong> Não ultrapasse 40 novos contatos por dia em chips novos.</span>
            </li>
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0"></div>
              <span><strong>Interação é Chave:</strong> Se o lead responder, o risco de ban cai 90%. Foque em fazer perguntas.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="glass p-8 rounded-3xl border border-white/10 hover:bg-white/5 transition-all">
            <div className="mb-6 h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center">
              {step.icon}
            </div>
            <h3 className="text-lg font-bold mb-3">{step.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageSquare size={120} />
        </div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Book className="text-indigo-400" size={24} />
          Estratégia de Aquecimento
        </h3>
        <div className="prose prose-invert max-w-none text-slate-300 text-sm space-y-4">
          <p>
            Chips novos precisam de "aquecimento". Comece enviando 5 mensagens no primeiro dia, 10 no segundo, e assim por diante. 
            O segredo da alta conversão no WhatsApp não é o volume, mas a <strong>relevância do primeiro contato</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Polimorfismo:</strong> Nossa IA usa algoritmos para trocar sinônimos e estruturas gramaticais.</li>
            <li><strong>Links:</strong> Evite enviar links na primeira mensagem se o lead nunca falou com você antes. Peça permissão primeiro.</li>
            <li><strong>Horários:</strong> Evite envios em massa fora do horário comercial (percebido como spam pela Meta).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
