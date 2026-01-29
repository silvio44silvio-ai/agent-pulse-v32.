
import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { generateMarketReport } from '../services/geminiService';
import { BarChart4, Search, Loader2, FileText, Share2, TrendingDown, AlertCircle, CheckCircle2, Globe } from 'lucide-react';

// Added interface for MarketAnalysis props
interface MarketAnalysisProps {
  currentLang: AppLanguage;
}

// Updated component to accept currentLang prop
export const MarketAnalysis = ({ currentLang }: MarketAnalysisProps) => {
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  // Fix: updated state to hold both text and sources for grounding display
  const [report, setReport] = useState<{ text: string, sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Fix: generateMarketReport now returns an object with text and grounding sources
      const data = await generateMarketReport(address, details, currentLang);
      setReport(data);
    } catch (error) {
      alert("Erro ao gerar análise de mercado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
          <BarChart4 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Educação de Mercado (CMA)</h2>
          <p className="text-slate-500 text-sm">Dados reais para vencer a objeção de preço do proprietário.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Dados do Imóvel</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Endereço/Condomínio</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Aquarius Resort, Urbanova..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Características</label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ex: 3 quartos, 120m², varanda gourmet, lazer completo..."
                  rows={4}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                />
              </div>

              <button 
                onClick={handleGenerateReport}
                disabled={isLoading || !address}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                Gerar Estudo de Preço
              </button>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl space-y-3">
             <div className="flex items-center gap-2 text-orange-400">
                <AlertCircle size={18} />
                <h4 className="font-bold text-xs uppercase tracking-widest">Dica de Conversão</h4>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed">
               Use este relatório para mostrar que o imóvel dele está 15% acima da média de anúncios ativos no ZAP/Viva Real. Isso acelera a captação exclusiva.
             </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!report && !isLoading ? (
            <div className="h-full min-h-[400px] glass rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-4">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                  <FileText size={32} />
               </div>
               <div>
                  <h4 className="font-bold text-slate-300">Nenhuma análise gerada</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Insira os dados à esquerda para que a IA busque comparativos em tempo real.</p>
               </div>
            </div>
          ) : isLoading ? (
            <div className="h-full min-h-[400px] glass rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-6">
               <Loader2 className="animate-spin text-indigo-400" size={48} />
               <div className="space-y-2">
                 <h4 className="font-bold text-white text-xl">Mapeando Micro-Mercado...</h4>
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-xs text-slate-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Consultando portais imobiliários ativos</span>
                    <span className="text-xs text-slate-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Calculando valor do m² regional</span>
                    <span className="text-xs text-slate-500 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Redigindo argumentos técnicos</span>
                 </div>
               </div>
            </div>
          ) : (
            <div className="glass rounded-3xl border border-indigo-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-indigo-600/10 p-6 border-b border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">IA</div>
                   <div>
                     <h3 className="font-bold text-sm">Relatório de Inteligência de Mercado</h3>
                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Grounding Ativo via Google Search</p>
                   </div>
                </div>
                <button onClick={() => navigator.clipboard.writeText(report.text || '')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-all">
                  <Share2 size={18} />
                </button>
              </div>
              <div className="p-8 prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {report.text}
              </div>
              
              {/* Fix: Display research sources as required by Google Search grounding guidelines */}
              {report.sources && report.sources.length > 0 && (
                <div className="p-6 bg-slate-900/50 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fontes Consultadas em Tempo Real</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.sources.map((source: any, idx: number) => (
                      source.web && (
                        <a 
                          key={idx} 
                          href={source.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-indigo-400 hover:text-white transition-all bg-indigo-500/5 px-2.5 py-1.5 rounded-lg border border-indigo-500/10 flex items-center gap-1.5"
                        >
                          <Globe size={10} />
                          {source.web.title || 'Ver Fonte'}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 bg-slate-950/50 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <TrendingDown size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Argumentação de Preço Pronto para Uso</span>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
