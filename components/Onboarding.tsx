
import React, { useState } from 'react';
import { Sparkles, Palette, LayoutGrid, Zap, ArrowRight, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { APP_NAME } from '../constants';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Bem-vindo ao seu Studio Privado",
    description: "O Kanva.ao é o seu novo braço direito criativo. Aqui, a privacidade encontra a inteligência de última geração.",
    icon: <ShieldCheck size={48} className="text-emerald-500" />,
    color: "bg-emerald-500/10"
  },
  {
    title: "Imagine com Inteligência",
    description: "No Studio, você descreve sua ideia e nossa IA gera artes de alta fidelidade em segundos. Sem complexidade.",
    icon: <Palette size={48} className="text-orange-600" />,
    color: "bg-orange-600/10"
  },
  {
    title: "Organização Estratégica",
    description: "Use o Board para guardar briefings, notas e expandir seus pensamentos com sugestões inteligentes da IA.",
    icon: <LayoutGrid size={48} className="text-blue-600" />,
    color: "bg-blue-600/10"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-[500px] rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Progresso superior */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-slate-900' : 'bg-slate-100'}`}
            />
          ))}
        </div>

        <div className="flex flex-col items-center text-center">
          <div className={`w-24 h-24 ${STEPS[currentStep].color} rounded-[2rem] flex items-center justify-center mb-8 animate-in slide-in-from-bottom-4 duration-500`}>
            {STEPS[currentStep].icon}
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
            {STEPS[currentStep].title}
          </h2>
          
          <p className="text-slate-500 font-medium text-lg mb-12 leading-relaxed">
            {STEPS[currentStep].description}
          </p>

          <button 
            onClick={next}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-orange-600 transition-all transform active:scale-95 shadow-xl shadow-slate-200"
          >
            {currentStep === STEPS.length - 1 ? (
              <>Começar agora <CheckCircle2 size={24} /></>
            ) : (
              <>Próximo <ArrowRight size={24} /></>
            )}
          </button>
          
          <button 
            onClick={onComplete}
            className="mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            Pular Introdução
          </button>
        </div>

        {/* Detalhe estético no fundo */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-50 rounded-full -z-10 blur-3xl opacity-50"></div>
      </div>
    </div>
  );
};

export default Onboarding;
