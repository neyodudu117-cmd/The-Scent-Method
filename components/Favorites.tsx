
import React, { useState } from 'react';
import { Fragrance, FavoriteRecord } from '../types';

interface FavoritesProps {
  favorites: FavoriteRecord[];
  onViewDetails: (f: Fragrance) => void;
  onRemove: (f: Fragrance) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ favorites, onViewDetails, onRemove }) => {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (e: React.MouseEvent, f: Fragrance) => {
    e.stopPropagation();
    setRemovingId(f.id);
    setTimeout(() => {
      onRemove(f);
      setRemovingId(null);
    }, 400);
  };

  return (
    <div className="px-8 pt-10 animate-fade-in pb-32">
      <div className="mb-12">
        <h2 className="font-serif text-4xl mb-3 text-scent-primary dark:text-white leading-tight">Your Fragrance Vault</h2>
        <p className="text-[10px] uppercase tracking-[0.4em] text-scent-accent font-bold">A Curated Private Collection</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
           <div className="w-24 h-24 bg-stone-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-8 text-3xl border border-stone-100 dark:border-white/10 shadow-inner">
             🌫️
           </div>
           <h3 className="font-serif text-2xl mb-4 text-scent-primary dark:text-white">Your collection is empty</h3>
           <p className="text-[11px] uppercase tracking-[0.2em] text-scent-text max-w-[220px] leading-relaxed mb-8 opacity-60">Begin your journey of discovery to find scents that resonate with your soul.</p>
           
           <button 
            className="px-10 py-4 bg-scent-primary dark:bg-white text-white dark:text-black text-[10px] tracking-[0.4em] uppercase font-bold rounded-full shadow-xl hover:opacity-90 active:scale-95 transition-all"
            onClick={() => window.location.reload()}
           >
             Start Discovery
           </button>
        </div>
      ) : (
        <div className="space-y-12">
          {favorites.map((rec) => (
            <div 
              key={rec.recommendationId} 
              className={`group relative flex flex-col transition-all duration-500 transform ${removingId === rec.recommendationId ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}
              onClick={() => onViewDetails(rec.fragrance)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-6 scent-shadow bg-stone-100 dark:bg-zinc-900 cursor-pointer">
                <img 
                  src={rec.fragrance.imagePlaceholder} 
                  alt={rec.fragrance.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                
                <button 
                  onClick={(e) => handleRemove(e, rec.fragrance)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-sm text-scent-text dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 transition-all shadow-lg active:scale-75"
                  title="Remove from Vault"
                >
                  ✕
                </button>

                <div className="absolute bottom-8 left-8 right-8 text-white pointer-events-none">
                  <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-80 mb-2 block">{rec.fragrance.brand}</span>
                  <h3 className="font-serif text-2xl leading-tight">{rec.fragrance.name}</h3>
                </div>
              </div>

              <div className="flex justify-between items-end px-4">
                <div className="space-y-1">
                   <p className="text-[9px] text-scent-accent uppercase tracking-[0.2em] font-bold">{rec.fragrance.family}</p>
                   <p className="text-[8px] text-scent-text/50 dark:text-gray-600 uppercase tracking-widest font-medium">Vaulted on {new Date(rec.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="text-[9px] uppercase tracking-[0.3em] font-bold text-scent-primary dark:text-white border-b border-scent-accent/50 pb-1 hover:text-scent-accent transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
          
          <div className="pt-10 flex flex-col items-center">
             <div className="w-12 h-px bg-stone-100 dark:bg-white/5 mb-8" />
             <p className="text-[9px] uppercase tracking-[0.5em] text-scent-text/40 font-bold mb-2">Artisanal Curation</p>
             <p className="text-[8px] text-scent-text/30 uppercase tracking-[0.2em]">ScentIQ Concierge Ready</p>
          </div>
        </div>
      )}
    </div>
  );
};
