
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-10 text-center animate-fade-in">
      <div className="mb-12 relative">
        <div className="w-48 h-48 rounded-[3rem] border border-scent-accent/20 flex items-center justify-center scent-shadow overflow-hidden transform rotate-3">
          <div className="w-full h-full p-2">
            <img 
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop" 
              alt="Luxury Fragrance" 
              className="w-full h-full object-cover rounded-[2.5rem] brightness-90 grayscale-[0.2]"
            />
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-scent-accent rounded-full flex items-center justify-center text-white text-lg shadow-xl">✨</div>
      </div>
      
      <span className="text-[9px] tracking-[0.6em] uppercase text-scent-accent font-black block mb-4">Olfactory Intelligence</span>
      <h2 className="font-serif text-4xl mb-6 text-scent-primary dark:text-white leading-tight">Elevate Your Essence</h2>
      <p className="text-scent-text dark:text-gray-400 text-sm leading-relaxed mb-12 max-w-[280px] opacity-70 italic font-light">
        Discover the masterpiece that resonates with your identity through the lens of pure sensory AI.
      </p>
      
      <button 
        onClick={onStart}
        className="w-full py-5 bg-scent-primary dark:bg-white text-white dark:text-black text-[10px] tracking-[0.4em] uppercase font-bold rounded-full hover:opacity-90 transition-all shadow-2xl active:scale-[0.98]"
      >
        Begin Discovery Journey
      </button>
      
      <p className="mt-8 text-[8px] text-scent-text/40 uppercase tracking-[0.5em] font-black">Maison de Parfumerie • Est. 2025</p>
    </div>
  );
};
