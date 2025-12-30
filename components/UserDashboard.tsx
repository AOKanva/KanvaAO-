
import React from 'react';
import Card from './Card';
import { KanvaCard, KanvaDesign } from '../types';
import { Sparkles, LayoutGrid, Plus, Palette, Image as ImageIcon, Wand2, Clock, Trash2, Download, Search, Filter, ArrowUpRight, Share2, Rocket } from 'lucide-react';

interface UserDashboardProps {
  cards: KanvaCard[];
  designs: KanvaDesign[];
  searchTerm: string;
  onAddCard: () => void;
  onDeleteCard: (id: string) => void;
  onUpdateCard: (card: KanvaCard) => void;
  onSearchChange: (val: string) => void;
  onOpenStudio: () => void;
  onDeleteDesign: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  cards, designs, searchTerm, onAddCard, onDeleteCard, onUpdateCard, onSearchChange, onOpenStudio, onDeleteDesign
}) => {
  const filteredCards = cards.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadDesign = (design: KanvaDesign) => {
    const link = document.createElement('a');
    link.href = design.imageUrl;
    link.download = `kanva-design-${design.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
       {/* Top Navigation - Minimalist SaaS Style */}
       <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            <div className="hidden lg:flex items-center gap-2 text-slate-400">
               <LayoutGrid size={18} />
               <span className="text-xs font-bold uppercase tracking-widest">Workspace</span>
            </div>
            
            <div className="flex-1 max-w-lg relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar projetos ou artes..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all text-sm outline-none font-medium"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors"><Share2 size={20} /></button>
             <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
             <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Status</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">Premium</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200">
                  JD
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-12 max-w-[1600px] mx-auto w-full space-y-12">
          
          {/* Welcome & Main Action Section */}
          <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.2em]">
                <Sparkles size={14} /> Bem-vindo ao Futuro
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                O que vamos criar <br/> <span className="text-slate-400">hoje?</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
               <button 
                onClick={onOpenStudio}
                className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-sm hover:bg-orange-600 transition-all transform active:scale-95 shadow-2xl shadow-slate-200"
              >
                <Palette size={20} /> Criar Novo Design
              </button>
              <button 
                onClick={onAddCard}
                className="p-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] hover:bg-slate-50 transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>
          </section>

          {/* Results Area - Designs Gallery */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <ImageIcon size={18} className="text-slate-400" /> Galeria de Resultados
              </h2>
              <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                <Filter size={14} /> Filtrar
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {designs.length > 0 ? (
                designs.map((design) => (
                  <div key={design.id} className="group relative bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                    {/* Imagem principal */}
                    <div className="aspect-square relative overflow-hidden bg-slate-100">
                      <img 
                        src={design.imageUrl} 
                        alt={design.prompt} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      
                      {/* Overlay de Ações Rápidas (Desktop Hover) */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                        <div className="flex justify-end gap-2">
                           <button 
                            onClick={() => downloadDesign(design)}
                            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                            title="Download PNG"
                          >
                            <Download size={18} />
                          </button>
                           <button 
                            onClick={() => onDeleteDesign(design.id)}
                            className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                           <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">{design.category}</p>
                           <p className="text-[11px] font-bold text-white line-clamp-1">{design.prompt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rodapé do Card (Sempre visível para Mobile) */}
                    <div className="p-5 flex items-center justify-between sm:hidden lg:flex">
                       <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Criado em</p>
                         <p className="text-[11px] font-bold text-slate-700">{new Date(design.createdAt).toLocaleDateString('pt-BR')}</p>
                       </div>
                       <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                         <ArrowUpRight size={16} />
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-[4rem] text-center shadow-inner animate-in fade-in duration-700">
                   <div className="w-24 h-24 bg-orange-500/10 rounded-[2.5rem] flex items-center justify-center text-orange-600 mb-8 animate-float">
                      <Rocket size={44} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Pronto para o lançamento?</h3>
                    <p className="text-slate-400 text-lg font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                      Seu studio está configurado. O próximo passo é transformar sua primeira ideia em uma arte profissional.
                    </p>
                    <button 
                      onClick={onOpenStudio} 
                      className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                      Criar meu primeiro Design →
                    </button>
                </div>
              )}
            </div>
          </section>

          {/* Ideas & Workspace Section */}
          <section className="pb-24 border-t border-slate-200 pt-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <Clock size={18} className="text-slate-400" /> Notas e Briefings
              </h2>
            </div>

            {filteredCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCards.map(card => (
                  <Card key={card.id} card={card} onDelete={onDeleteCard} onUpdate={onUpdateCard} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-100/30 border border-slate-200 rounded-[3rem]">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Nenhum briefing ativo</p>
              </div>
            )}
          </section>
        </div>
    </div>
  );
};

export default UserDashboard;
