
import React from 'react';
import { AppStep, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: AppStep;
  onNavigate: (step: AppStep) => void;
  isDark: boolean;
  toggleDark: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentStep, 
  onNavigate, 
  isDark, 
  toggleDark,
  user,
  onLogout
}) => {
  const showNav = ['results', 'details', 'favorites', 'upgrade'].includes(currentStep) && !!user;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-scent-bg dark:bg-[#0a0a0a] relative flex flex-col transition-colors duration-500 overflow-x-hidden">
      <header className="pt-12 pb-4 px-8 pt-safe flex flex-col items-center justify-center bg-scent-bg/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="w-full flex justify-between items-center">
          {user ? (
            <button 
              onClick={() => onNavigate('auth')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-scent-text/40 hover:text-scent-accent transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          ) : (
            <div className="w-10" />
          )}
          
          <h1 
            className="font-serif text-3xl tracking-[0.1em] text-scent-primary dark:text-white cursor-pointer select-none"
            onClick={() => user ? onNavigate('favorites') : onNavigate('auth')}
          >
            Scent<span className="text-scent-accent font-light">IQ</span>
          </h1>
          
          <button 
            onClick={toggleDark}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-all active:scale-90"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="mt-1 h-px w-8 bg-scent-accent/30 rounded-full" />
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      {showNav && (
        <nav className="fixed bottom-0 w-full max-w-md bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-stone-100 dark:border-white/5 px-10 pt-5 pb-5 pb-safe flex justify-between items-center z-50 scent-shadow">
          <button 
            onClick={() => onNavigate('results')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentStep === 'results' ? 'text-scent-accent scale-110' : 'text-scent-text/40 dark:text-gray-600'}`}
          >
            <span className="text-xl">✨</span>
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Discover</span>
          </button>
          <button 
            onClick={() => onNavigate('favorites')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentStep === 'favorites' ? 'text-scent-accent scale-110' : 'text-scent-text/40 dark:text-gray-600'}`}
          >
            <span className="text-xl">🖤</span>
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Vault</span>
          </button>
          <button 
            onClick={() => onNavigate('upgrade')}
            className={`flex flex-col items-center gap-1.5 transition-all ${currentStep === 'upgrade' ? 'text-scent-accent scale-110' : 'text-scent-text/40 dark:text-gray-600'}`}
          >
            <span className="text-xl">👑</span>
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Privé</span>
          </button>
        </nav>
      )}
    </div>
  );
};
