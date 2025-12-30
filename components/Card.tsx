
import React, { useState } from 'react';
import { KanvaCard } from '../types';
import { Sparkles, Trash2, Save, Edit2 } from 'lucide-react';
import { generateIdeaExpansion } from '../services/geminiService';

interface CardProps {
  card: KanvaCard;
  onDelete: (id: string) => void;
  onUpdate: (card: KanvaCard) => void;
}

const Card: React.FC<CardProps> = ({ card, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedContent, setEditedContent] = useState(card.content);

  const handleSave = () => {
    onUpdate({
      ...card,
      title: editedTitle,
      content: editedContent
    });
    setIsEditing(false);
  };

  const handleMagic = async () => {
    setIsGenerating(true);
    const expansion = await generateIdeaExpansion(card.title, card.content);
    setEditedContent(prev => `${prev}\n\n✨ Sugestão da IA:\n${expansion}`);
    setIsGenerating(false);
    setIsEditing(true); 
  };

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-200 transition-all hover:shadow-2xl hover:translate-y-[-4px] bg-white flex flex-col gap-5 group relative overflow-hidden`}>
      {/* Decorative Accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${card.color.replace('bg-', 'bg-')}`}></div>

      <div className="flex justify-between items-start z-10">
        {isEditing ? (
          <input
            type="text"
            className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 mb-1"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none">{card.title}</h3>
        )}
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={handleMagic}
            disabled={isGenerating}
            className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50"
          >
            <Sparkles size={18} className={isGenerating ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => onDelete(card.id)}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="z-10 flex-1">
        {isEditing ? (
          <textarea
            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 resize-none focus:outline-none text-slate-600 font-medium min-h-[140px] text-sm leading-relaxed"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <p className="text-slate-500 font-medium text-sm whitespace-pre-wrap leading-relaxed">
            {card.content || <span className="italic text-slate-300">Descreva sua ideia ou briefing aqui...</span>}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-5 border-t border-slate-100 z-10">
        <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
          {new Date(card.createdAt).toLocaleDateString('pt-BR')}
        </span>
        
        {isEditing ? (
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Save size={14} /> Salvar
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-900 rounded-xl text-xs font-black hover:bg-slate-200 transition-all"
          >
            <Edit2 size={14} /> Editar
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
