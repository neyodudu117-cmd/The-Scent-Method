
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(1);

  const next = () => setCurrentScreen(s => s + 1);

  const screens = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
      headline: "Find Your Signature Scent",
      subtext: "AI-powered perfume recommendations made just for you.",
      buttonText: "Get Started",
      action: next
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
      headline: "No More Blind Perfume Buying",
      bullets: [
        "Personalized matches",
        "Mood & occasion based",
        "Budget-friendly options"
      ],
      buttonText: "Continue",
      action: next
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop",
      headline: "60-Second Scent Quiz",
      subtext: "Answer a few questions and let AI do the rest.",
      buttonText: "Start Quiz",
      action: onComplete
    }
  ];

  const screen = screens[currentScreen - 1];

  return (
    <div className="flex flex-col min-h-[80vh] animate-fade-in relative">
      {/* Background Image Area */}
      <div className="h-[45vh] w-full relative overflow-hidden">
        <img 
          src={screen.image} 
          alt="Luxury Fragrance" 
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out brightness-90 dark:brightness-75"
          key={screen.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] dark:from-[#0a0a0a] to-transparent" />
      </div>

      {/* Content Area */}
      <div className="px-8 flex flex-col items-center text-center -mt-12 relative z-10">
        <div className="mb-6 flex gap-2">
          {screens.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-8 rounded-full transition-all duration-300 ${i + 1 === currentScreen ? 'bg-[#D4AF37]' : 'bg-gray-200 dark:bg-neutral-800'}`} 
            />
          ))}
        </div>

        <h2 className="font-serif text-3xl mb-4 text-[#1a1a1a] dark:text-white leading-tight tracking-tight">
          {screen.headline}
        </h2>

        {screen.subtext && (
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10 max-w-[260px]">
            {screen.subtext}
          </p>
        )}

        {screen.bullets && (
          <ul className="text-left mb-10 space-y-3">
            {screen.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        <div className="w-full mt-auto pb-12">
          <button 
            onClick={screen.action}
            className="w-full py-4 bg-[#1a1a1a] dark:bg-white dark:text-black text-white text-xs tracking-[0.3em] uppercase font-bold shadow-2xl active:scale-95 transition-all"
          >
            {screen.buttonText}
          </button>
          
          <p className="mt-6 text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em]">
            Exquisite Curation
          </p>
        </div>
      </div>
    </div>
  );
};
