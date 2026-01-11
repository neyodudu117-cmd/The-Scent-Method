
import React, { useState, useMemo } from 'react';
import { Fragrance, RecommendationResponse } from '../types';
import { PREMIUM_SELECTORS } from '../constants';

interface ResultsProps {
  fragrances: Fragrance[];
  favorites: Fragrance[];
  personality: RecommendationResponse['personalitySummary'] | null;
  isPremium: boolean;
  onViewDetails: (f: Fragrance) => void;
  onToggleFavorite: (f: Fragrance) => void;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ 
  fragrances, 
  favorites, 
  personality,
  isPremium,
  onViewDetails, 
  onToggleFavorite, 
  onReset 
}) => {
  const [activeSelector, setActiveSelector] = useState<string | null>(null);
  
  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  const handleBuy = (f: Fragrance) => {
    const query = encodeURIComponent(`${f.brand} ${f.name} perfume luxury buy`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const getMatchScore = (f: Fragrance, selectorId: string | null): number => {
    if (!selectorId) return 0;
    const text = `${f.bestOccasion} ${f.bestSeason} ${f.matchReason} ${f.description} ${f.family}`.toLowerCase();
    switch (selectorId) {
      case 'office': return text.includes('office') || text.includes('work') ? 5 : 0;
      case 'date-night': return text.includes('date') || text.includes('night') || text.includes('romantic') ? 5 : 0;
      case 'summer-day': return text.includes('summer') || text.includes('fresh') ? 5 : 0;
      case 'winter-night': return text.includes('winter') || text.includes('warm') ? 5 : 0;
      case 'confidence-boost': return text.includes('confident') || text.includes('bold') ? 5 : 0;
      default: return 0;
    }
  };

  const sortedFragrances = useMemo(() => {
    if (!activeSelector) return fragrances;
    return [...fragrances].sort((a, b) => getMatchScore(b, activeSelector) - getMatchScore(a, activeSelector));
  }, [fragrances, activeSelector]);

  return (
    <div className="px-8 pt-12 animate-fade-in pb-32">
      {personality && (
        <div className="mb-16 text-center animate-fade-in">
          <span className="text-[9px] tracking-[0.5em] uppercase text-scent-accent font-black block mb-4">Discovery Result</span>
          <h2 className="font-serif text-4xl mb-6 text-scent-primary dark:text-white leading-tight">{personality.title}</h2>
          <p className="text-[11px] text-scent-text dark:text-gray-400 leading-relaxed italic max-w-[280px] mx-auto opacity-70">
            "{personality.description}"
          </p>
          <div className="mt-8 flex justify-center">
             <div className="h-px w-10 bg-scent-accent/40" />
          </div>
        </div>
      )}

      {isPremium && (
        <div className="mb-12">
          <p className="text-[8px] uppercase tracking-[0.4em] font-black text-scent-accent mb-6 text-center">Re-Rank by Occasion</p>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {PREMIUM_SELECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSelector(activeSelector === s.id ? null : s.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-full border text-[9px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${
                  activeSelector === s.id
                    ? 'bg-scent-primary dark:bg-white text-white dark:text-black border-scent-primary dark:border-white shadow-lg scale-105'
                    : 'border-stone-100 dark:border-neutral-800 text-scent-text dark:text-gray-400 bg-white/50 dark:bg-black/50'
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-24">
        {sortedFragrances.map((f, i) => {
          const isHighlight = activeSelector && getMatchScore(f, activeSelector) > 0;
          return (
            <div key={f.id} className={`group animate-fade-in transition-all duration-700 ${isHighlight ? 'scale-[1.02]' : 'opacity-90'}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div 
                className={`relative mb-8 overflow-hidden aspect-[4/5] rounded-[2.5rem] scent-shadow cursor-pointer border transition-all duration-500 ${isHighlight ? 'border-scent-accent' : 'border-transparent'}`} 
                onClick={() => onViewDetails(f)}
              >
                 <img src={f.imagePlaceholder} alt={f.name} className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
                 <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[8px] uppercase tracking-[0.3em] font-black text-scent-primary dark:text-white shadow-sm">
                   {f.family}
                 </div>
                 {isHighlight && (
                   <div className="absolute top-6 right-6 bg-scent-accent px-4 py-1.5 rounded-full text-[7px] tracking-widest uppercase font-black text-white shadow-xl animate-pulse">
                     Best Match
                   </div>
                 )}
              </div>

              <div className="flex flex-col items-center text-center px-4">
                  <h3 className="text-[10px] tracking-[0.5em] uppercase text-scent-accent font-black mb-3">{f.brand}</h3>
                  <h4 className="font-serif text-3xl text-scent-primary dark:text-white mb-6 leading-tight">{f.name}</h4>
                  
                  <p className="text-xs text-scent-text dark:text-gray-400 leading-relaxed mb-8 italic opacity-75 line-clamp-2">
                    {f.matchReason}
                  </p>

                  <div className="w-full flex flex-col gap-3">
                    <button 
                      onClick={() => onViewDetails(f)}
                      className="w-full py-4.5 bg-scent-primary dark:bg-white text-white dark:text-black text-[9px] tracking-[0.4em] uppercase font-bold rounded-full shadow-2xl transition-all active:scale-[0.98]"
                    >
                      Examine Details
                    </button>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => onToggleFavorite(f)}
                        className={`flex-1 py-4 border rounded-full text-[9px] tracking-[0.4em] uppercase font-bold transition-all active:scale-[0.98] ${
                          isFavorite(f.id) 
                            ? 'bg-scent-accent text-white border-scent-accent' 
                            : 'border-stone-200 dark:border-white/10 text-scent-primary dark:text-white'
                        }`}
                      >
                        {isFavorite(f.id) ? 'Saved' : 'Vault It'}
                      </button>
                      <button 
                        onClick={() => handleBuy(f)}
                        className="flex-1 py-4 border border-scent-accent text-scent-accent text-[9px] tracking-[0.4em] uppercase font-bold rounded-full transition-all active:scale-[0.98]"
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-24 pt-16 border-t border-stone-100 dark:border-white/5 text-center">
        <button 
          onClick={onReset}
          className="text-[9px] tracking-[0.4em] uppercase text-scent-text hover:text-scent-accent transition-colors font-black border-b border-scent-accent/30 pb-1"
        >
          New Sensory Session
        </button>
      </div>
    </div>
  );
};
