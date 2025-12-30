
import React, { useState, useEffect } from 'react';
import { AppState, KanvaCard, KanvaDesign, UserRole } from './types';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import DesignStudio from './components/DesignStudio';
import Onboarding from './components/Onboarding';
import { CARD_COLORS } from './constants';
import { getSessionRole, setSession, clearSession } from './services/authService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('NONE');
  const [cards, setCards] = useState<KanvaCard[]>([]);
  const [designs, setDesigns] = useState<KanvaDesign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const savedRole = getSessionRole();
    const savedCards = localStorage.getItem('kanva_cards');
    const savedDesigns = localStorage.getItem('kanva_designs');
    const hasSeenOnboarding = localStorage.getItem('kanva_onboarding_seen');
    
    if (savedRole !== 'NONE') {
      setRole(savedRole);
      // Se acabou de logar e nunca viu onboarding, mostra
      if (!hasSeenOnboarding && savedRole === 'USER') {
        setShowOnboarding(true);
      }
    }
    
    if (savedCards) setCards(JSON.parse(savedCards));
    if (savedDesigns) setDesigns(JSON.parse(savedDesigns));
  }, []);

  useEffect(() => {
    localStorage.setItem('kanva_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('kanva_designs', JSON.stringify(designs));
  }, [designs]);

  const handleLoginSuccess = (newRole: UserRole) => {
    setRole(newRole);
    setSession(newRole);
    
    const hasSeenOnboarding = localStorage.getItem('kanva_onboarding_seen');
    if (!hasSeenOnboarding && newRole === 'USER') {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setRole('NONE');
    clearSession();
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('kanva_onboarding_seen', 'true');
  };

  const addCard = () => {
    const newCard: KanvaCard = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Ideia',
      content: '',
      type: 'idea',
      createdAt: Date.now(),
      color: CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)]
    };
    setCards([newCard, ...cards]);
  };

  const deleteCard = (id: string) => {
    if (window.confirm('Excluir esta nota permanentemente?')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  const updateCard = (updatedCard: KanvaCard) => {
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const saveDesign = (design: KanvaDesign) => {
    setDesigns([design, ...designs]);
  };

  const deleteDesign = (id: string) => {
    if (window.confirm('Excluir este design permanentemente?')) {
      setDesigns(designs.filter(d => d.id !== id));
    }
  };

  if (role === 'NONE') {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      <Sidebar 
        role={role} 
        onLogout={handleLogout} 
        onAddNote={role === 'USER' ? addCard : undefined} 
      />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {role === 'ADMIN' ? (
          <AdminDashboard />
        ) : (
          <UserDashboard 
            cards={cards}
            designs={designs}
            searchTerm={searchTerm}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onUpdateCard={updateCard}
            onSearchChange={setSearchTerm}
            onOpenStudio={() => setIsStudioOpen(true)}
            onDeleteDesign={deleteDesign}
          />
        )}
      </main>

      {/* Overlays */}
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
      
      {isStudioOpen && (
        <DesignStudio 
          onClose={() => setIsStudioOpen(false)} 
          onSave={saveDesign} 
        />
      )}
    </div>
  );
};

export default App;
