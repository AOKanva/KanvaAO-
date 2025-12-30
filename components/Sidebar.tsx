
import React from 'react';
import { LayoutGrid, ShieldCheck, LogOut, PlusCircle, Settings, CreditCard, Sparkles } from 'lucide-react';
import { APP_NAME } from '../constants';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  onAddNote?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, onAddNote }) => {
  return (
    <aside className="w-full md:w-72 bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col p-6 fixed bottom-0 md:relative z-[60] md:z-auto h-auto md:h-screen md:sticky md:top-0">
      <div className="hidden md:flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="text-slate-950 font-black text-xl">K</span>
        </div>
        <div>
           <span className="font-black text-white text-xl tracking-tighter block leading-none">{APP_NAME}</span>
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Studio Pro</span>
        </div>
      </div>

      <nav className="flex md:flex-col gap-1.5 flex-1 justify-around md:justify-start">
        {role === 'USER' && (
          <>
            <NavItem icon={<LayoutGrid size={20} />} label="Meu Board" active />
            <NavItem icon={<PlusCircle size={20} />} label="Nova Nota" onClick={onAddNote} />
            <NavItem icon={<Sparkles size={20} className="text-orange-500" />} label="Assinatura" />
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <NavItem icon={<ShieldCheck size={20} />} label="Console Admin" active />
            <NavItem icon={<Settings size={20} />} label="Configurações" />
          </>
        )}

        <button 
          onClick={onLogout} 
          className="flex items-center gap-3 px-5 py-3.5 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl font-bold w-full transition-all md:mt-auto text-sm"
        >
          <LogOut size={20} /> <span className="hidden md:inline">Encerrar Sessão</span>
        </button>
      </nav>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold w-full transition-all text-sm group ${
      active ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-300'}`}>{icon}</span>
    <span className="hidden md:inline">{label}</span>
  </button>
);

export default Sidebar;
