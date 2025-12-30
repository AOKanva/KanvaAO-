
import React, { useState, useEffect } from 'react';
import { Activity, Users, ShieldCheck, Key, ToggleLeft, ToggleRight, Trash2, ShieldAlert, Plus, Copy, Check, Mail, Send, Loader2, RefreshCw, AlertTriangle, ClipboardCheck, Rocket, Zap, Shield, HelpCircle, Target, Share2, Instagram, MessageCircle, ExternalLink, Award } from 'lucide-react';
import { AccessKey, KanvaDesign } from '../types';
import { getAllAccessKeys, updateAccessKeyStatus, deleteAccessKey, createNewAccessKey, resetUsage } from '../services/authService';
import { sendAccessEmail } from '../services/emailService';

const AdminDashboard: React.FC = () => {
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
  const [designs, setDesigns] = useState<KanvaDesign[]>([]);
  const [activeTab, setActiveTab] = useState<'management' | 'checklist' | 'growth'>('management');
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [newKeyEmail, setNewKeyEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAccessKeys(getAllAccessKeys());
    const savedDesigns = localStorage.getItem('kanva_designs');
    if (savedDesigns) setDesigns(JSON.parse(savedDesigns));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel) return;
    const newKey = createNewAccessKey(newKeyLabel, 'USER', newKeyEmail);
    if (newKeyEmail) {
      setIsSendingEmail(true);
      await sendAccessEmail(newKeyEmail, newKey.password, newKeyLabel);
      setIsSendingEmail(false);
    }
    setNewKeyLabel('');
    setNewKeyEmail('');
    setIsCreating(false);
    loadData();
  };

  const handleReset = (id: string) => {
    resetUsage(id);
    loadData();
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    updateAccessKeyStatus(id, !currentStatus);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (id === 'default') return;
    if (window.confirm('Excluir esta chave permanentemente?')) {
      deleteAccessKey(id);
      loadData();
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-32 md:pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-orange-600" size={32} /> Console Admin
          </h2>
          <p className="text-slate-500 font-medium">Controle de segurança e motores de crescimento</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
           <TabButton active={activeTab === 'management'} onClick={() => setActiveTab('management')} label="Usuários" />
           <TabButton active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} label="Prontidão MVP" />
           <TabButton active={activeTab === 'growth'} onClick={() => setActiveTab('growth')} label="Growth Studio" />
        </div>
      </header>

      {activeTab === 'management' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users size={24}/>} label="Usuários Ativos" value={accessKeys.filter(k => k.isActive).length.toString()} color="text-blue-600" />
            <StatCard icon={<ShieldAlert size={24}/>} label="Suspeitas de Abuso" value={accessKeys.filter(k => k.usageCount >= k.usageLimit).length.toString()} color="text-red-600" />
            <StatCard icon={<Activity size={24}/>} label="Cota Total Usada" value={accessKeys.reduce((acc, k) => acc + k.usageCount, 0).toString()} color="text-orange-600" />
            <StatCard icon={<Key size={24}/>} label="Chaves Geradas" value={accessKeys.length.toString()} color="text-emerald-600" />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h3 className="font-bold text-slate-800 text-lg">Acessos Ativos</h3>
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Nova Chave
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4">Usuário</th>
                    <th className="px-8 py-4">Uso / Cota</th>
                    <th className="px-8 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 divide-y divide-slate-50">
                  {accessKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900">{key.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{key.password}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${(key.usageCount/key.usageLimit)*100}%` }} />
                          </div>
                          <span className="text-xs font-bold">{key.usageCount}/{key.usageLimit}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleReset(key.id)} className="p-2 text-slate-400 hover:text-emerald-500"><RefreshCw size={18} /></button>
                          <button onClick={() => handleToggle(key.id, key.isActive)} className="p-2 text-slate-400 hover:text-orange-500">{key.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}</button>
                          <button onClick={() => handleDelete(key.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <ChecklistSection 
            title="1. Testes de Fluxo Crítico" 
            icon={<ClipboardCheck className="text-blue-500" />}
            items={[
              "Realizar login com chave USER e ADMIN com sucesso.",
              "Gerar imagem no Studio e verificar se salva no Board.",
              "Testar remoção de fundo (Hugging Face API Check).",
              "Verificar se o 'Logout' limpa o localStorage corretamente."
            ]}
          />
          <ChecklistSection 
            title="2. Limites e Financeiro" 
            icon={<Zap className="text-orange-500" />}
            items={[
              "Configurar quotas baixas (ex: 20 créditos) para novos usuários.",
              "Verificar se o saldo da API Gemini/HF está carregado.",
              "Validar se o app bloqueia geração após limite atingido.",
              "Conferir se a senha ADMIN está em variável de ambiente (Vercel)."
            ]}
          />
          <ChecklistSection 
            title="3. Plano de Contingência" 
            icon={<Shield className="text-emerald-500" />}
            items={[
              "Link de suporte (WhatsApp/Email) visível no Login.",
              "Mensagem de erro amigável caso as APIs caiam.",
              "Backup manual: Botão 'Exportar JSON' funcionando.",
              "Chave Mestra de reserva impressa/salva fora do app."
            ]}
          />
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center items-center text-center">
            <Rocket size={48} className="text-orange-500 mb-6 animate-float" />
            <h3 className="text-2xl font-black mb-2 tracking-tight">Pronto para o Lançamento?</h3>
            <p className="text-slate-400 font-medium mb-8">Após marcar todos os itens, seu MVP está seguro para os primeiros clientes.</p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
              Declarar Prontidão
            </button>
          </div>
        </div>
      )}

      {activeTab === 'growth' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
          {/* Seção 1: Prova Visual */}
          <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
             <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-600"><Award size={32} /></div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Seleção de Prova Visual</h3>
                   <p className="text-slate-500 text-sm font-medium">Use seus melhores resultados para atrair clientes no Instagram/WhatsApp.</p>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {designs.slice(0, 6).map(d => (
                 <div key={d.id} className="aspect-square rounded-2xl overflow-hidden border-4 border-slate-50 group relative">
                    <img src={d.imageUrl} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => copyToClipboard(d.imageUrl, d.id)}
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      {copiedId === d.id ? <Check size={18} /> : "Copiar Link"}
                    </button>
                 </div>
               ))}
               <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <Plus size={24} className="mb-2" />
                  <span className="text-[10px] font-black uppercase leading-tight">Gere mais no Studio</span>
               </div>
             </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seção 2: Templates de Copy */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <MessageCircle className="text-emerald-500" /> Fábrica de Conteúdo (Copy)
                  </h3>
                  
                  <div className="space-y-6">
                    <CopyCard 
                      title="WhatsApp: Oferta Beta (Privada)"
                      copy={`Olá! Estou a testar uma nova ferramenta de IA chamada Kanva.ao para designers angolanos. Consegue gerar logos e artes de agência em segundos. Tenho apenas 3 chaves de acesso para teste. Queres uma?`}
                      onCopy={(text) => copyToClipboard(text, 'wpp1')}
                      isCopied={copiedId === 'wpp1'}
                    />
                    <CopyCard 
                      title="Instagram: O Problema e a Solução"
                      copy={`Cansado de perder 4 horas num briefing simples? ⏳ O Kanva.ao resolve isso em 30 segundos. Design profissional, privado e com alma angolana. Link na Bio para os primeiros 10 acessos (Via Kuenha).`}
                      onCopy={(text) => copyToClipboard(text, 'ig1')}
                      isCopied={copiedId === 'ig1'}
                    />
                  </div>
               </div>
            </div>

            {/* Seção 3: Guia Kuenha */}
            <div className="space-y-8">
               <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/10 rounded-xl text-orange-500"><ExternalLink size={24} /></div>
                    <h3 className="text-xl font-black tracking-tight leading-tight">Configurar Kuenha</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <StepItem number="01" text="Crie um 'Link de Pagamento' no Kuenha Pay." />
                    <StepItem number="02" text="Defina o preço (Ex: 5.000 Kz para Beta)." />
                    <StepItem number="03" text="Cole o Webhook do Kanva.ao nas settings do Kuenha." />
                    <div className="pt-6 border-t border-white/10 mt-6">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Seu Webhook URL</p>
                       <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-[10px]">
                          <span className="truncate">https://kanva.ao/api/webhook</span>
                          <button onClick={() => copyToClipboard('https://kanva.ao/api/webhook', 'hook')} className="text-orange-500 ml-auto">
                            {copiedId === 'hook' ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="bg-emerald-500 text-white p-8 rounded-[3rem] shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Target size={24} />
                    <h3 className="text-xl font-black tracking-tight">Meta do Mês</h3>
                  </div>
                  <p className="text-emerald-100 text-sm font-medium mb-6">Consiga seus primeiros 10 clientes pagantes para validar o negócio.</p>
                  <div className="h-4 bg-emerald-600 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[20%] shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                  </div>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-emerald-200">2 / 10 Clientes</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">Novo Acesso</h3>
            <form onSubmit={handleCreateKey} className="space-y-6">
              <input 
                type="text" required placeholder="Nome do Cliente"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                value={newKeyLabel} onChange={(e) => setNewKeyLabel(e.target.value)}
              />
              <input 
                type="email" placeholder="Email (Opcional)"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                value={newKeyEmail} onChange={(e) => setNewKeyEmail(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Voltar</button>
                <button type="submit" disabled={isSendingEmail} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg">
                  {isSendingEmail ? 'Enviando...' : 'Criar Chave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
  </button>
);

const CopyCard = ({ title, copy, onCopy, isCopied }: { title: string, copy: string, onCopy: (t: string) => void, isCopied: boolean }) => (
  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      <button 
        onClick={() => onCopy(copy)}
        className={`p-2 rounded-lg transition-all ${isCopied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:text-slate-900 shadow-sm'}`}
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{copy}"</p>
  </div>
);

const StepItem = ({ number, text }: { number: string, text: string }) => (
  <div className="flex gap-4 items-start">
    <span className="text-orange-500 font-black text-sm font-mono">{number}</span>
    <p className="text-slate-300 text-sm font-medium leading-snug">{text}</p>
  </div>
);

const ChecklistSection = ({ title, icon, items }: { title: string, icon: any, items: string[] }) => (
  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 group cursor-pointer">
          <div className="mt-1 w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-colors">
            <div className="w-2 h-2 bg-slate-900 rounded-full opacity-0 group-active:opacity-100" />
          </div>
          <span className="text-slate-600 font-medium text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-start gap-4">
    <div className={`p-4 rounded-2xl bg-slate-50 ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
