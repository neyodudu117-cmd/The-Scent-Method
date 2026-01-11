
import React, { useEffect, useState } from 'react';
import { Fragrance } from '../types';

interface DetailsProps {
  fragrance: Fragrance;
  favorites: Fragrance[];
  showBackToResults?: boolean;
  isPremium?: boolean;
  onToggleFavorite: (f: Fragrance) => void;
  onBack: () => void;
  onUpgrade?: () => void;
}

const getNoteCategory = (name: string) => {
  const n = name.toLowerCase();
  if (n.match(/lemon|bergamot|citrus|orange|lime|grapefruit|neroli|mandarin|yuzu|verbena|petitgrain|citron/)) return 'citrus';
  if (n.match(/rose|jasmine|lavender|peony|iris|violet|lily|orchid|flower|floral|gardenia|tuberose|magnolia|freesia|heliotrope|neroli|mimosa|hyacinth/)) return 'floral';
  if (n.match(/sandalwood|cedar|oud|vetiver|patchouli|wood|pine|birch|guaiac|cypress|oakmoss|ebony/)) return 'woody';
  if (n.match(/pepper|cardamom|cinnamon|clove|ginger|spice|spicy|saffron|nutmeg|star anise|coriander|cumin/)) return 'spicy';
  if (n.match(/vanilla|honey|caramel|tonka|sweet|sugar|chocolate|marshmallow|benzoin|praline|almond/)) return 'sweet';
  if (n.match(/marine|sea|water|mint|eucalyptus|fresh|air|ozone|aquatic|salt|calone/)) return 'fresh';
  if (n.match(/leaf|green|grass|bamboo|tea|sage|thyme|basil|rosemary|herb|galbanum|artemisia|coriander/)) return 'green';
  if (n.match(/musk|leather|amber|civet|animalic|suede|castoreum|labdanum|styrax/)) return 'musk';
  if (n.match(/peach|apple|cherry|berry|pear|plum|raspberry|strawberry|blackcurrant|fig|apricot|pineapple/)) return 'fruity';
  if (n.match(/incense|smoke|smoky|myrrh|olibanum|tobacco|birch tar/)) return 'smoky';
  return 'default';
};

const NoteIcon: React.FC<{ category: string }> = ({ category }) => {
  const props = { className: "w-3 h-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" };
  switch (category) {
    case 'citrus': return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M18.36 5.64l-12.72 12.72M5.64 5.64l12.72 12.72" strokeLinecap="round" /></svg>;
    case 'floral': return <svg {...props}><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 8V4M12 16v4M8 12H4m16 0h-4M15 9l3-3M6 18l3-3M9 9L6 6m12 12l-3-3" strokeLinecap="round" /></svg>;
    case 'woody': return <svg {...props}><path d="M12 3L4 12h3v8h10v-8h3L12 3z" strokeLinecap="round" /><path d="M12 12v4" strokeLinecap="round" /></svg>;
    case 'spicy': return <svg {...props}><path d="M12 2c0 10-4 11-4 15 0 3 2 5 4 5s4-2 4-5c0-4-4-5-4-15z" strokeLinecap="round" /></svg>;
    case 'sweet': return <svg {...props}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinecap="round" /></svg>;
    case 'fresh': return <svg {...props}><path d="M3 12c3-2 6-2 9 0s6 2 9 0M3 16c3-2 6-2 9 0s6 2 9 0" strokeLinecap="round" /></svg>;
    case 'green': return <svg {...props}><path d="M12 20s-8-4-8-12a8 8 0 0 1 16 0c0 8-8 12-8 12zM12 12l3-3m-3 3l-3-3" strokeLinecap="round" /></svg>;
    case 'musk': return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" /></svg>;
    case 'fruity': return <svg {...props}><circle cx="12" cy="13" r="7" /><path d="M12 6c0-2 1-3 3-3" strokeLinecap="round" /></svg>;
    case 'smoky': return <svg {...props}><path d="M9 21c0-3 2-4 2-7s-2-4-2-7 2-4 2-7M15 21c0-3 2-4 2-7s-2-4-2-7 2-4 2-7" strokeLinecap="round" /></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="3" strokeLinecap="round" /></svg>;
  }
};

const NoteBadge: React.FC<{ name: string }> = ({ name }) => {
  const category = getNoteCategory(name);
  return (
    <div className="flex items-center gap-2.5 bg-stone-100/40 dark:bg-white/5 px-3 py-2 rounded-full border border-stone-100/50 dark:border-white/10 transition-all hover:border-scent-accent/40 group">
      <span className="text-scent-accent opacity-60 group-hover:opacity-100 transition-opacity">
        <NoteIcon category={category} />
      </span>
      <span className="text-[10px] tracking-wide text-scent-text dark:text-stone-300 font-bold">{name}</span>
    </div>
  );
};

const PriceIndicator: React.FC<{ estimate: string }> = ({ estimate }) => {
  const count = (estimate.match(/£/g) || estimate.match(/\$/g) || []).length;
  const level = count > 0 ? count : 2;
  return (
    <span className="ml-3 inline-flex items-center gap-0.5 text-[9px] tracking-normal font-black">
      {[...Array(4)].map((_, i) => (
        <span key={i} className={i < level ? "text-scent-accent" : "text-stone-100 dark:text-zinc-900"}>£</span>
      ))}
    </span>
  );
};

export const Details: React.FC<DetailsProps> = ({ 
  fragrance: f, 
  favorites, 
  showBackToResults = false,
  isPremium = false,
  onToggleFavorite, 
  onBack,
  onUpgrade
}) => {
  const isFavorite = favorites.some(fav => fav.id === f.id);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: `ScentIQ: ${f.name} by ${f.brand}`,
      text: `Discovery on ScentIQ: ${f.name}. ${f.description}`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try { await navigator.share(shareData); } catch (err) { if ((err as Error).name !== 'AbortError') console.error('Error sharing:', err); }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-scent-primary text-white px-6 py-3 text-[9px] uppercase tracking-widest font-black z-[100] animate-fade-in shadow-2xl rounded-full';
        toast.innerText = 'Cipher copied to clipboard';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
      } catch (err) { console.error('Clipboard error:', err); }
    }
  };

  const handleBuy = () => {
    const query = encodeURIComponent(`${f.brand} ${f.name} perfume luxury buy`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const defaultSuggestions = [
    { note: "Creamy Vanilla", reason: "Adds a comforting sweetness that softens the bold heart notes." },
    { note: "Smoky Oud", reason: "Enhances the mysterious depth and creates a powerful sillage." },
    { note: "White Musk", reason: "Creates a clean, sophisticated aura that extends longevity." }
  ];

  const suggestions = f.layeringSuggestions && f.layeringSuggestions.length > 0
    ? f.layeringSuggestions 
    : defaultSuggestions;

  return (
    <div className="animate-fade-in pb-32">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] px-6 pt-6 flex justify-between pointer-events-none">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-scent-primary dark:text-white border border-stone-100 dark:border-white/10 shadow-lg pointer-events-auto transition-all active:scale-90"
        >
          ←
        </button>
        
        <button 
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-scent-primary dark:text-white border border-stone-100 dark:border-white/10 shadow-lg pointer-events-auto active:scale-90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      <div className="relative h-[60vh] bg-stone-100 dark:bg-zinc-900">
        <img src={f.imagePlaceholder} alt={f.name} className="w-full h-full object-cover opacity-90 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-scent-bg dark:from-[#0a0a0a] via-transparent to-black/5" />
      </div>

      <div className="px-8 -mt-24 relative z-10">
        <div className="bg-white dark:bg-black p-10 rounded-[2.5rem] scent-shadow border border-stone-50 dark:border-white/5 text-center mb-10">
          <h3 className="text-[10px] tracking-[0.5em] uppercase text-scent-accent font-black mb-4 flex items-center justify-center">
            {f.brand}
            <PriceIndicator estimate={f.priceEstimate} />
          </h3>
          <h2 className="font-serif text-4xl text-scent-primary dark:text-white mb-8 leading-tight">{f.name}</h2>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => onToggleFavorite(f)}
                className={`flex-1 py-4.5 rounded-full border text-[9px] tracking-[0.4em] uppercase font-black transition-all active:scale-[0.98] ${
                  isFavorite ? 'bg-scent-primary text-white dark:bg-white dark:text-black' : 'border-scent-primary dark:border-white text-scent-primary dark:text-white'
                }`}
              >
                {isFavorite ? 'Vaulted' : 'Vault It'}
              </button>
              <button 
                onClick={handleBuy}
                className="flex-1 py-4.5 bg-scent-accent text-white text-[9px] tracking-[0.4em] uppercase font-black rounded-full shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>

        <div className="text-left space-y-16">
          <section className="text-center px-4">
            <p className="font-serif text-2xl text-scent-primary dark:text-white leading-relaxed italic opacity-80">
              "{f.matchReason}"
            </p>
          </section>

          <section>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-scent-text/40 font-black mb-10 border-b border-stone-100 dark:border-white/5 pb-2">Sensory Analysis</h4>
            <div className="grid grid-cols-2 gap-y-12 gap-x-8">
               <div className="space-y-2">
                 <p className="text-[8px] uppercase tracking-[0.3em] text-scent-accent font-black">Longevity</p>
                 <p className="font-serif text-lg text-scent-primary dark:text-stone-200">{f.longevity}</p>
                 <div className="h-[1px] w-full bg-stone-100 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-scent-accent w-[80%]" />
                 </div>
               </div>
               <div className="space-y-2">
                 <p className="text-[8px] uppercase tracking-[0.3em] text-scent-accent font-black">Projection</p>
                 <p className="font-serif text-lg text-scent-primary dark:text-stone-200">{f.projection}</p>
                 <div className="h-[1px] w-full bg-stone-100 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-scent-accent w-[60%]" />
                 </div>
               </div>
               <div className="space-y-2">
                 <p className="text-[8px] uppercase tracking-[0.3em] text-scent-accent font-black">Peak Bloom</p>
                 <p className="font-serif text-lg text-scent-primary dark:text-stone-200">{f.bestSeason}</p>
               </div>
               <div className="space-y-2">
                 <p className="text-[8px] uppercase tracking-[0.3em] text-scent-accent font-black">Occasion</p>
                 <p className="font-serif text-lg text-scent-primary dark:text-stone-200">{f.bestOccasion}</p>
               </div>
            </div>
          </section>

          <section className="bg-scent-accent/5 dark:bg-scent-accent/10 p-10 border border-scent-accent/10 rounded-[2rem] relative overflow-hidden">
             {!isPremium && (
                <div className="absolute inset-0 bg-scent-bg/40 dark:bg-black/40 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center text-center p-6">
                  <span className="text-xl mb-3">👑</span>
                  <h4 className="text-[9px] tracking-[0.4em] uppercase font-black text-scent-primary dark:text-white">Privé Alchemy</h4>
                  <p className="text-[8px] text-scent-text/60 mb-6 uppercase tracking-widest">Join Privé to reveal layering tips.</p>
                  <button onClick={onUpgrade} className="text-[8px] font-black text-scent-accent uppercase tracking-[0.3em] border-b border-scent-accent pb-1">Upgrade</button>
                </div>
             )}
             <h4 className="text-[10px] tracking-[0.4em] uppercase text-scent-accent font-black mb-8">Layering Alchemy</h4>
             <div className="space-y-8">
               {suggestions.map((item, idx) => (
                 <div key={idx} className="flex flex-col gap-2 group">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-scent-accent rounded-full" />
                      <span className="text-[9px] uppercase tracking-[0.3em] font-black text-scent-primary dark:text-white">
                        {item.note}
                      </span>
                    </div>
                    <p className="text-[10px] text-scent-text/70 dark:text-gray-400 font-light leading-relaxed pl-4 border-l border-scent-accent/20">
                      {item.reason}
                    </p>
                 </div>
               ))}
             </div>
          </section>

          <section>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-scent-text/40 font-black mb-8 border-b border-stone-100 dark:border-white/5 pb-2">Olfactory Pyramid</h4>
            <div className="space-y-12">
              {[
                { label: 'Top Accords', notes: f.notes.top },
                { label: 'Heart Accords', notes: f.notes.middle },
                { label: 'Base Accords', notes: f.notes.base }
              ].map((group, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-scent-accent font-black">{group.label}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {group.notes.map(note => <NoteBadge key={note} name={note} />)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {showBackToResults && (
            <section className="pt-12 text-center">
              <button 
                onClick={onBack}
                className="w-full py-5 border border-stone-200 dark:border-white/10 text-scent-primary dark:text-white text-[10px] tracking-[0.4em] uppercase font-black rounded-full active:scale-[0.98] transition-all"
              >
                ← Return to Results
              </button>
            </section>
          )}
        </div>
      </div>

      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] transition-all duration-700 transform ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <button 
          onClick={onBack}
          className="bg-scent-primary/95 dark:bg-white/95 backdrop-blur-xl text-white dark:text-black px-10 py-4.5 shadow-2xl flex items-center gap-6 active:scale-95 transition-all rounded-full"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-black">Browse Discovery</span>
        </button>
      </div>
    </div>
  );
};
