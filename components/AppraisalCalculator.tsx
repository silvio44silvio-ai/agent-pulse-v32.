
import React, { useState, useMemo } from 'react';
import { Calculator, Ruler, Building, TrendingUp, Download, ShieldCheck, Scale, AlertTriangle, Maximize2, MoveDiagonal2, Square } from 'lucide-react';

type FinishStandard = 'Baixo' | 'Normal' | 'Alto' | 'Luxo';
type LandType = 'Regular' | 'Irregular';

export const AppraisalCalculator = () => {
  const [landType, setLandType] = useState<LandType>('Regular');
  const [data, setData] = useState({
    landArea: 360,
    frontage: 12, // Testada
    depth: 30,    // Profundidade
    // Lados para irregular (Quadrilátero)
    sideA: 15,
    sideB: 25,
    sideC: 12,
    sideD: 26,
    diagonal: 30, // Diagonal para cálculo de área irregular (Soma de Heron)
    builtArea: 210,
    pricePerMeterLand: 1500,
    pricePerMeterBuilt: 3200,
    buildingAge: 15,
    finishStandard: 'Normal' as FinishStandard,
    conservativeState: 0.85,
    incorporationFactor: 1.15,
  });

  // Rodney Alpha Engine: Cálculo de Área Irregular via Fórmula de Heron (2 Triângulos)
  const calculateIrregularArea = (a: number, b: number, c: number, d: number, diag: number) => {
    // Triângulo 1 (Lados A, B e Diagonal)
    const s1 = (a + b + diag) / 2;
    const area1 = Math.sqrt(s1 * (s1 - a) * (s1 - b) * (s1 - diag));
    
    // Triângulo 2 (Lados C, D e Diagonal)
    const s2 = (c + d + diag) / 2;
    const area2 = Math.sqrt(s2 * (s2 - c) * (s2 - d) * (s2 - diag));
    
    return isNaN(area1 + area2) ? 0 : area1 + area2;
  };

  const calculatedArea = useMemo(() => {
    if (landType === 'Regular') {
      return data.frontage * data.depth;
    } else {
      return calculateIrregularArea(data.sideA, data.sideB, data.sideC, data.sideD, data.diagonal);
    }
  }, [landType, data.frontage, data.depth, data.sideA, data.sideB, data.sideC, data.sideD, data.diagonal]);

  const calculation = useMemo(() => {
    const area = calculatedArea || 1;
    const frontageFactor = data.frontage < 10 ? 0.9 : 1.0;
    const landValue = area * data.pricePerMeterLand * frontageFactor;
    
    const physicalDepreciation = Math.max(0.1, 1 - (data.buildingAge / 60));
    const effectiveDepreciation = physicalDepreciation * data.conservativeState;
    const buildingValue = data.builtArea * data.pricePerMeterBuilt * effectiveDepreciation;
    
    const subtotal = landValue + buildingValue;
    const total = subtotal * data.incorporationFactor;
    
    return {
      landValue,
      buildingValue,
      depreciation: (1 - effectiveDepreciation) * 100,
      total,
      m2Value: total / (data.builtArea || 1)
    };
  }, [data, calculatedArea]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass p-6 rounded-[32px] border border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 shadow-lg shadow-indigo-600/10">
            <Calculator size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Avaliação Técnica Pró</h2>
            <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Padrão NBR 14653 • Módulo de Topografia Irregular</p>
          </div>
        </div>
        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-white/5">
           <button 
             onClick={() => setLandType('Regular')}
             className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${landType === 'Regular' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
           >
             Regular
           </button>
           <button 
             onClick={() => setLandType('Irregular')}
             className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${landType === 'Irregular' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
           >
             Fora de Esquadro
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário de Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass p-5 lg:p-8 rounded-[40px] border border-white/10 space-y-6">
            <div className="space-y-4">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                <Ruler size={14} /> Topografia do Lote
              </h3>
              
              {landType === 'Regular' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Testada (Frontal m)</label>
                    <input type="number" value={data.frontage} onChange={e => setData({...data, frontage: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:border-indigo-500/50 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Profundidade (m)</label>
                    <input type="number" value={data.depth} onChange={e => setData({...data, depth: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:border-indigo-500/50 outline-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Lado A (m)</label>
                      <input type="number" value={data.sideA} onChange={e => setData({...data, sideA: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Lado B (m)</label>
                      <input type="number" value={data.sideB} onChange={e => setData({...data, sideB: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Lado C (m)</label>
                      <input type="number" value={data.sideC} onChange={e => setData({...data, sideC: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Lado D (m)</label>
                      <input type="number" value={data.sideD} onChange={e => setData({...data, sideD: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 outline-none" />
                    </div>
                  </div>
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center gap-3">
                    <MoveDiagonal2 size={16} className="text-indigo-400" />
                    <div className="flex-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase block mb-1">Diagonal de Esquadro (m)</label>
                      <input type="number" value={data.diagonal} onChange={e => setData({...data, diagonal: Number(e.target.value)})} className="w-full bg-transparent text-xs font-black text-indigo-400 outline-none" />
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-[8px] font-black text-indigo-400 uppercase">
                      Obrigatório
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Valor m² da Região (Terreno)</label>
                <input type="number" value={data.pricePerMeterLand} onChange={e => setData({...data, pricePerMeterLand: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-indigo-400 focus:border-indigo-500/50 outline-none" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                <Building size={14} /> Edificações
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Área Construída (m²)</label>
                  <input type="number" value={data.builtArea} onChange={e => setData({...data, builtArea: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:border-indigo-500/50 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Idade do Imóvel</label>
                  <input type="number" value={data.buildingAge} onChange={e => setData({...data, buildingAge: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-200 focus:border-indigo-500/50 outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Estado de Conservação</label>
                <select value={data.conservativeState} onChange={e => setData({...data, conservativeState: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 focus:border-indigo-500/50 outline-none">
                  <option value={1.0}>Novo / Impecável (A)</option>
                  <option value={0.85}>Bom / Regular (B)</option>
                  <option value={0.65}>Reparos Simples (C)</option>
                  <option value={0.45}>Reparos Importantes (D)</option>
                  <option value={0.20}>Crítico / Demolição (E)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados Alpha */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass p-6 lg:p-10 rounded-[40px] border border-indigo-500/20 bg-indigo-600/5 relative overflow-hidden shadow-2xl min-h-[400px]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <Maximize2 size={240} />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="bg-indigo-600/20 text-indigo-400 text-[9px] px-3 py-1 rounded-lg font-black tracking-widest uppercase border border-indigo-500/10">
                    Área Total do Terreno
                  </span>
                  <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter mt-2">
                    {calculatedArea.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} m²
                  </div>
                  <p className="text-[8px] text-slate-500 font-black uppercase mt-1 tracking-[0.2em]">
                    {landType === 'Regular' ? 'Formato Retangular' : 'Polígono Irregular (4 Lados)'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-3 py-1 rounded-lg font-black tracking-widest uppercase border border-emerald-500/10">
                    Valor de Mercado
                  </span>
                  <div className="text-3xl font-black text-white tracking-tighter mt-2">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculation.total)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="p-5 bg-slate-950/50 rounded-[32px] border border-white/5 space-y-2">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Valor do Solo</span>
                      <span className="text-[10px] font-black text-indigo-400">{(calculation.landValue / calculation.total * 100).toFixed(1)}%</span>
                   </div>
                   <div className="text-xl font-black text-white tracking-tight">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculation.landValue)}
                   </div>
                   <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${(calculation.landValue / (calculation.total || 1)) * 100}%` }}></div>
                   </div>
                </div>

                <div className="p-5 bg-slate-950/50 rounded-[32px] border border-white/5 space-y-2">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Valor Benfeitoria</span>
                      <span className="text-[10px] font-black text-emerald-400">{(calculation.buildingValue / calculation.total * 100).toFixed(1)}%</span>
                   </div>
                   <div className="text-xl font-black text-white tracking-tight">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculation.buildingValue)}
                   </div>
                   <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(calculation.buildingValue / (calculation.total || 1)) * 100}%` }}></div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Valor Unitário (V.U.)</div>
                    <div className="text-sm font-black text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculation.m2Value)}/m²</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Depreciação Acumulada</div>
                    <div className="text-sm font-black text-rose-500">-{calculation.depreciation.toFixed(1)}%</div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                       <AlertTriangle size={14} />
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">
                      Ajuste de Testada aplicado para lotes menores que 10m.
                    </p>
                 </div>
                 <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-2xl transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95">
                    <Download size={14} /> Gerar Laudo Alpha
                 </button>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-[32px] border border-white/5 flex items-start gap-4">
             <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl shrink-0">
                <ShieldCheck size={20} />
             </div>
             <div>
                <h4 className="font-black text-[10px] uppercase tracking-widest text-white mb-1">Orientação Rodney Alpha</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Para lotes fora de esquadro, o motor Rodney utiliza a <strong>Fórmula de Heron em regime de triangulação</strong>. A Diagonal de Ajuste é crucial para definir a deflexão dos ângulos e garantir que a área real não seja superestimada.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
