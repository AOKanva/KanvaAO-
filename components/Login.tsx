
import React, { useState } from 'react';
import { Lock, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { APP_NAME } from '../constants';
import { validatePassword, setSession } from '../services/authService';
import { UserRole } from '../types';

interface LoginProps {
  onSuccess: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const role = validatePassword(password);
    
    if (role !== 'NONE') {
      setStatus('success');
      setTimeout(() => {
        setSession(role, password);
        onSuccess(role);
      }, 800);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-200/40 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[440px] w-full z-10">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200 mb-6 group transition-transform hover:scale-105">
              <span className="text-white font-black text-4xl">K</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{APP_NAME}</h1>
            <p className="text-slate-500 mt-3 text-sm font-semibold flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" /> Workspace Criativo Privado
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Chave de Acesso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900">
                  <Lock size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="password" autoFocus
                  className={`block w-full pl-14 pr-5 py-5 bg-slate-50 border-2 ${
                    status === 'error' ? 'border-red-100 bg-red-50 text-red-900' : 
                    status === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-900' : 
                    'border-slate-100 focus:border-slate-900'
                  } rounded-2xl focus:outline-none transition-all font-bold text-lg placeholder:text-slate-300`}
                  placeholder="••••-••••-••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'success'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'success' || !password}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 ${
                status === 'success' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
              }`}
            >
              {status === 'success' ? <>Acesso Liberado <CheckCircle2 size={24} /></> : <>Entrar no Studio <ArrowRight size={24} /></>}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
             <a 
              href="mailto:suporte@kanva.ao" 
              className="inline-flex items-center gap-2 text-xs text-slate-400 font-bold hover:text-slate-900 transition-colors"
             >
               <HelpCircle size={14} /> Precisa de ajuda com o acesso?
             </a>
          </div>
        </div>

        <div className="mt-10 text-center flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
            Powered by Kanva Intelligence Labs
          </p>
          <div className="flex gap-4">
             <span className="text-[9px] font-bold text-slate-300 uppercase">Termos</span>
             <span className="text-[9px] font-bold text-slate-300 uppercase">Privacidade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
