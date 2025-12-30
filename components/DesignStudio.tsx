
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, CheckCircle2, Loader2, Zap, Layout, PenTool, Type as TypeIcon, Target, FileImage, Scissors, AlertCircle } from 'lucide-react';
import { generatePremiumDesign } from '../services/geminiService';
import { removeBackground } from '../services/backgroundRemovalService';
import { KanvaDesign, DesignCategoryType } from '../types';
import { checkUsageLimit, getSessionPassword } from '../services/authService';

interface DesignStudioProps {
  onClose: () => void;
  onSave: (design: KanvaDesign) => void;
}

const CATEGORIES = [
  { id: 'branding', label: 'Identidade Visual', icon: <PenTool size={18}/> },
  { id: 'digital', label: 'Design Digital', icon: <Layout size={18}/> },
  { id: 'editorial', label: 'Design Editorial', icon: <TypeIcon size={18}/> },
];

const DesignStudio: React.FC<DesignStudioProps> = ({ onClose, onSave }) => {
  const [category, setCategory] = useState<DesignCategoryType>('branding');
  const [briefing, setBriefing] = useState({ mainIdea: '', objective: '', audience: '', colors: '' });
  const [style, setStyle] = useState('minimalist');
  const [status, setStatus] = useState<'idle' | 'generating' | 'verifying' | 'removing_bg' | 'done'>('idle');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null);
  const [isShowingTransparent, setIsShowingTransparent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<number>(0);

  useEffect(() => {
    updateCredits();
  }, []);

  const updateCredits = () => {
    const { remaining } = checkUsageLimit(getSessionPassword());
    setRemainingCredits(remaining);
  };

  const handleGenerate = async () => {
    if (!briefing.mainIdea || !briefing.objective) {
      setError("Por favor, preencha o briefing.");
      return;
    }

    setStatus('generating');
    setError(null);
    
    try {
      const imageUrl = await generatePremiumDesign({
        category, objective: briefing.objective, audience: briefing.audience,
        mainIdea: briefing.mainIdea, colors: briefing.colors, style
      });
      
      setOriginalImage(imageUrl);
      setStatus('done');
      updateCredits();
    } catch (err: any) {
      const msg = err.message?.includes('LIMITE_EXCEDIDO') 
        ? "Você atingiu o limite de gerações da sua chave. Entre em contato com o suporte." 
        : "Erro no motor criativo. Tente novamente.";
      setError(msg);
      setStatus('idle');
    }
  };

  const processRemoveBackground = async () => {
    if (!originalImage) return;
    setStatus('removing_bg');
    try {
      const result = await removeBackground(originalImage);
      setTransparentImage(result);
      setIsShowingTransparent(true);
      setStatus('done');
    } catch (err) {
      setError("Erro ao processar transparência.");
      setStatus('done');
    }
  };

  const handleSave = () => {
    const finalImage = isShowingTransparent && transparentImage ? transparentImage : originalImage;
    if (finalImage) {
      onSave({
        id: Math.random().toString(36).substr(2, 9),
        prompt: briefing.mainIdea,
        style, category, imageUrl: finalImage, createdAt: Date.now()
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-7xl h-full md:h-[90vh] md:rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        
        <div className="w-full md:w-[480px] border-r border-slate-100 p-8 md:p-10 flex flex-col bg-slate-50/50 overflow-y-auto">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-orange-500 fill-orange-500" />
              </div>
              <h2 className="font-black text-slate-900 tracking-tighter text-lg uppercase leading-none">Studio Kanva</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400"><X size={20} /></button>
          </header>

          <div className="space-y-8 flex-1">
             <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Créditos Restantes</span>
                <span className={`text-sm font-black ${remainingCredits <= 3 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
                  {remainingCredits} artes
                </span>
             </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Especialidade</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setCategory(cat.id as DesignCategoryType)} className={`p-4 rounded-2xl border-2 transition-all ${category === cat.id ? 'border-slate-900 bg-white' : 'border-transparent bg-white/50'}`}>
                    <div className={category === cat.id ? 'text-slate-900' : 'text-slate-300'}>{cat.icon}</div>
                    <span className={`text-[9px] font-black uppercase ${category === cat.id ? 'text-slate-900' : 'text-slate-400'}`}>{cat.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Ideia Central</p>
               <textarea 
                className="w-full h-24 p-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-medium"
                value={briefing.mainIdea} onChange={(e) => setBriefing({...briefing, mainIdea: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl mb-4 flex items-start gap-2 animate-in slide-in-from-bottom-2">
                <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-red-600 leading-tight uppercase">{error}</p>
              </div>
            )}
            <button 
              disabled={status !== 'idle' && status !== 'done' || remainingCredits === 0}
              onClick={handleGenerate}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 disabled:bg-slate-100"
            >
              {status === 'generating' ? <><Loader2 className="animate-spin" size={20} /> Renderizando...</> : <><Sparkles size={20} className="text-orange-400" /> Gerar Arte</>}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
          {originalImage ? (
            <div className="relative animate-in zoom-in duration-500 w-full max-w-2xl text-center z-10">
              <div className="relative overflow-hidden rounded-[3.5rem] shadow-2xl border-[14px] border-white mx-auto aspect-square bg-white mb-8">
                <img src={isShowingTransparent && transparentImage ? transparentImage : originalImage} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-4 justify-center">
                 <button onClick={processRemoveBackground} disabled={status === 'removing_bg'} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs">
                   {status === 'removing_bg' ? <Loader2 size={16} className="animate-spin" /> : <Scissors size={16} />} Remover Fundo
                 </button>
                 <button onClick={handleSave} className="flex items-center gap-2 px-6 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs border border-slate-200 shadow-sm">
                   <CheckCircle2 size={16} className="text-emerald-500" /> Salvar no Board
                 </button>
              </div>
            </div>
          ) : (
             <div className="text-center">
                <div className="w-40 h-40 bg-white rounded-[4rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                  {status !== 'idle' ? <Loader2 size={40} className="text-orange-500 animate-spin" /> : <ImageIcon size={48} className="text-slate-100" />}
                </div>
                <h3 className="text-slate-900 font-black text-2xl tracking-tighter">Estúdio Criativo</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Pronto para transformar ideias em pixels?</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;
