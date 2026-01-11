
import React, { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  "Analyzing sensory landscape...",
  "Consulting the archives...",
  "Balancing top accords...",
  "Layering heart notes...",
  "Refining base sillage..."
];

export const Loader: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center animate-fade-in">
      <div className="relative w-28 h-28 mb-12">
        <div className="absolute inset-0 border border-scent-accent/10 rounded-full" />
        <div className="absolute inset-0 border-t border-scent-accent rounded-full animate-spin duration-[2s]" />
        <div className="absolute inset-4 border border-scent-accent/5 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-scent-accent rounded-full animate-pulse" />
        </div>
      </div>
      
      <p className="text-[10px] tracking-[0.4em] uppercase text-scent-accent font-black mb-10">
        {LOADING_MESSAGES[msgIdx]}
      </p>
      
      <div className="w-24 h-px bg-stone-100 dark:bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-scent-accent animate-[loading-bar_4s_infinite_ease-in-out]" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
