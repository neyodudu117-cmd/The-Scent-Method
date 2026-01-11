
import React from 'react';

interface UpgradeProps {
  onUpgrade?: () => void;
  isPremium?: boolean;
}

export const Upgrade: React.FC<UpgradeProps> = ({ onUpgrade, isPremium }) => {
  const perks = [
    { title: "ScentIQ Vault+", desc: "Unlock unlimited discovery and archive your favorite masterpieces." },
    { title: "Privé Filtering", desc: "Access the Mood & Occasion selector for clinical precision." },
    { title: "Layering Alchemy", desc: "Receive custom tips on how to pair scents for a unique signature." },
    { title: "Monthly Selection", desc: "A curated list of niche house recommendations delivered every 30 days." },
    { title: "Pure Interface", desc: "Completely ad-free browsing through our sensory library." }
  ];

  const handleTrial = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-scent-primary text-white px-6 py-3 text-[9px] uppercase tracking-widest font-black z-[100] animate-fade-in shadow-2xl border border-scent-accent/30 rounded-full';
    toast.innerText = '7-Day Free Trial Activated';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
        if (onUpgrade) onUpgrade();
    }, 1500);
  };

  return (
    <div className="px-8 pt-12 animate-fade-in pb-12">
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-[0.5em] uppercase text-scent-accent font-black mb-4 block">ScentIQ Privé</span>
        <h2 className="font-serif text-4xl mb-4 text-scent-primary dark:text-white leading-tight">Elevate Your Presence</h2>
        <div className="h-px w-10 bg-scent-accent mx-auto mb-6 opacity-40" />
        <p className="text-[9px] text-scent-text/60 dark:text-gray-600 uppercase tracking-[0.3em]">Become a sensory connoisseur</p>
      </div>

      <div className="space-y-10 mb-20 px-4">
        {perks.map((p, i) => (
          <div key={i} className="flex gap-6 items-start group">
            <div className="text-scent-accent text-xl mt-1 transition-transform group-hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-black text-scent-primary dark:text-white mb-2">{p.title}</h4>
              <p className="text-xs text-scent-text dark:text-gray-400 leading-relaxed font-light">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-black p-10 text-center rounded-[2.5rem] scent-shadow relative overflow-hidden border border-stone-50 dark:border-white/5">
        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-scent-accent/5 rounded-full blur-3xl" />
        
        <h3 className="font-serif text-2xl text-scent-primary dark:text-white mb-8">Join the Inner Circle</h3>
        
        {isPremium ? (
          <div className="space-y-6">
            <div className="w-full py-5 bg-scent-accent text-white text-[10px] tracking-[0.4em] uppercase font-black rounded-full flex items-center justify-center gap-2">
              <span>✓</span> Membership Active
            </div>
            <p className="text-[8px] text-scent-text/40 uppercase tracking-widest">Valid through 2026</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button 
              onClick={onUpgrade}
              className="w-full py-5 bg-scent-primary dark:bg-white text-white dark:text-black text-[10px] tracking-[0.4em] uppercase font-black rounded-full shadow-2xl active:scale-[0.98] transition-all"
            >
              Unlock Privé Access
            </button>
            
            <button 
              onClick={handleTrial}
              className="w-full py-5 border border-stone-200 dark:border-white/10 text-scent-primary dark:text-white text-[10px] tracking-[0.4em] uppercase font-black rounded-full active:scale-[0.98] transition-all"
            >
              Start Free Trial
            </button>
            
            <p className="text-[8px] text-scent-text/30 uppercase tracking-widest mt-6">
              Cancel anytime • $12.99/mo after trial
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 text-center space-y-4">
        <p className="text-[9px] text-scent-text/30 uppercase tracking-[0.4em] font-black">Trusted by the Global Elite</p>
        <div className="flex justify-center gap-6 opacity-30 grayscale contrast-125">
           <span className="text-[10px] font-serif italic dark:text-white">Vogue</span>
           <span className="text-[10px] font-serif italic dark:text-white">GQ</span>
           <span className="text-[10px] font-serif italic dark:text-white">Harpers</span>
        </div>
      </div>
    </div>
  );
};
