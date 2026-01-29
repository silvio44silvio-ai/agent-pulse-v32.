import React, { useState } from 'react';
import { Send, Mail, Loader2, Sparkles, Copy, Check, MousePointer2, Target, History } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const EmailMarketing = () => {
  const [goal, setGoal] = useState('cold_outreach');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ subject: string, body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Rodney: AI generation with strict adherence to @google/genai guidelines
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Fix: Direct initialization as per world-class standard
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a high-conversion real estate email in PORTUGUESE. 
      GOAL: ${goal} (cold contact, property launch, or reactivation).
      TOPIC: ${topic}.
      STRICT RULES: Short, punchy, curiosity-driven subject line. Body should focus on benefit, not features. Tone: Professional yet approachable. Max 150 words. 
      Return format: JSON { "subject": "...", "body": "..." }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("Erro ao redigir email.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Assunto: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl shadow-lg">
          <Mail size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Email Intel</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Copywriting de Alta Conversão IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 lg:p-8 rounded-[40px] border border-white/10 space-y-6">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Objetivo da Campanha</label>
              <select 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none"
              >
                <option value="cold_outreach">Abordagem Fria (Prospect)</option>
                <option value="launch_announcement">Anúncio de Lançamento</option>
                <option value="lead_reactivation">Reativação de Lead Antigo</option>
                <option value="investor_newsletter">Newsletter p/ Investidores</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Contexto ou Imóvel</label>
              <textarea 
                rows={4}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Apartamento no Jardim Aquarius com 3 suítes e preço de m² abaixo da média..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-slate-400 outline-none resize-none"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full btn-premium text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Redigir Campanha IA
            </button>
          </div>

          <div className="bg-indigo-600/5 p-6 rounded-3xl border border-indigo-500/10 space-y-4">
             <div className="flex items-center gap-2 text-indigo-400">
                <Target size={16} />
                <h4 className="text-[9px] font-black uppercase tracking-widest">Protocolo Anti-Spam</h4>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
               A IA gera textos polimórficos que variam a estrutura das frases, aumentando drasticamente a taxa de entrega em caixas de entrada Gmail/Outlook.
             </p>
          </div>
        </div>

        <div className="lg:col-span-8">
           {result ? (
             <div className="glass p-8 lg:p-10 rounded-[48px] border border-indigo-500/20 bg-indigo-500/5 animate-in zoom-in-95 duration-500 space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center">
                         <Mail size={20} />
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">Draft Gerado</h4>
                   </div>
                   <button 
                     onClick={copyToClipboard}
                     className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                   >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      {copied ? 'Copiado' : 'Copiar Tudo'}
                   </button>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Assunto (Subject)</label>
                      <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 text-sm font-bold text-indigo-400">
                        {result.subject}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Corpo do Email</label>
                      <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 text-sm font-medium text-slate-300 leading-relaxed min-h-[200px] whitespace-pre-wrap">
                        {result.body}
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-500">
                      <MousePointer2 size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Pronto para envio manual ou CRM</span>
                   </div>
                   <button className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:underline">
                      Enviar agora (Via Mailto)
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[400px] glass rounded-[48px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center text-slate-700">
                   <History size={40} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-lg font-black text-slate-300 uppercase tracking-tight">Aguardando Parâmetros</h4>
                   <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                     Configure o objetivo e o tópico à esquerda para que a IA processe a melhor copy para seus leads.
                   </p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};