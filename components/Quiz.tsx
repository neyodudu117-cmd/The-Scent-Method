
import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { SEASONS, OCCASIONS, PREFERRED_NOTES, SCENT_FAMILIES, BUDGET_RANGES, PROJECTION_PREFS, MOODS } from '../constants';

interface QuizProps {
  onComplete: (prefs: UserPreferences) => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete, isPremium, onUpgrade }) => {
  const [step, setStep] = useState(0);
  const [customNote, setCustomNote] = useState('');
  const [prefs, setPrefs] = useState<UserPreferences>({
    scentFamily: [],
    occasions: [],
    moods: [],
    projectionPreference: '',
    seasonClimate: [],
    budgetRange: '',
    lovedNotes: [],
    hatedNotes: [],
  });

  const nextStep = () => {
    setStep(s => s + 1);
    setCustomNote('');
  };
  
  const prevStep = () => {
    setStep(s => Math.max(0, s - 1));
    setCustomNote('');
  };

  const toggleItem = (list: string[], item: string, key: keyof UserPreferences) => {
    const currentList = list || [];
    const newList = currentList.includes(item) 
      ? currentList.filter(i => i !== item) 
      : [...currentList, item];
    setPrefs({ ...prefs, [key]: newList });
  };

  const handleAddCustomNote = (key: 'lovedNotes' | 'hatedNotes') => {
    const note = customNote.trim();
    if (note && !prefs[key].includes(note)) {
      setPrefs({ ...prefs, [key]: [...prefs[key], note] });
      setCustomNote('');
    }
  };

  const CardButton = ({ active, onClick, children, multiple = false, disabled = false }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative py-6 px-6 border text-[10px] tracking-[0.2em] uppercase text-left transition-all duration-300 rounded-2xl shadow-sm group min-h-[80px] flex items-center justify-between ${
        active 
          ? 'bg-scent-primary dark:bg-white text-white dark:text-black border-scent-primary dark:border-white' 
          : 'bg-white dark:bg-zinc-900 border-stone-100 dark:border-white/5 text-scent-text dark:text-gray-400 hover:border-scent-accent/40'
      } ${disabled ? 'opacity-50 grayscale' : ''}`}
    >
      <span className="font-bold relative z-10">{children}</span>
      {multiple && active && (
        <span className="text-[10px] animate-fade-in text-scent-accent ml-2">✓</span>
      )}
      {active && (
        <div className="absolute inset-y-4 left-0 w-1 bg-scent-accent rounded-full" />
      )}
    </button>
  );

  const PremiumLock = ({ title }: { title: string }) => (
    <div className="absolute inset-0 bg-scent-bg/60 dark:bg-black/60 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center text-center p-6 border border-scent-accent/10 rounded-2xl">
      <div className="w-14 h-14 bg-white/90 dark:bg-zinc-900/90 rounded-full flex items-center justify-center shadow-xl mb-4 text-scent-accent border border-scent-accent/20">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      </div>
      <h4 className="text-[10px] tracking-[0.4em] uppercase font-black mb-2 text-scent-primary dark:text-white">{title} is ScentIQ Privé</h4>
      <p className="text-[9px] text-scent-text/70 mb-6 uppercase tracking-widest leading-relaxed">Exclusive for the refined collector.</p>
      <button 
        onClick={onUpgrade}
        className="px-8 py-3 bg-scent-accent text-white text-[8px] tracking-[0.4em] uppercase font-bold rounded-full shadow-lg active:scale-95 transition-all"
      >
        Unlock Access
      </button>
    </div>
  );

  const NoteSelectionGrid = ({ noteKey }: { noteKey: 'lovedNotes' | 'hatedNotes' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const selectedCustomNotes = prefs[noteKey].filter(note => !PREFERRED_NOTES.includes(note));
    const filteredPreferred = PREFERRED_NOTES.filter(n => n.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredCustom = selectedCustomNotes.filter(n => n.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="relative group">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search our aroma library..."
            className="w-full bg-transparent border-b border-stone-200 dark:border-white/10 text-[10px] py-4 pr-1 focus:border-scent-accent outline-none dark:text-white transition-all font-light tracking-[0.2em] uppercase placeholder:text-scent-text/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-h-[35vh] overflow-y-auto pr-2 scrollbar-hide">
          {filteredPreferred.map((n) => (
            <CardButton 
              key={n} 
              active={prefs[noteKey].includes(n)} 
              onClick={() => toggleItem(prefs[noteKey], n, noteKey)}
              multiple={true}
            >
              {n}
            </CardButton>
          ))}
          {filteredCustom.map((n) => (
            <CardButton 
              key={n} 
              active={true} 
              onClick={() => toggleItem(prefs[noteKey], n, noteKey)}
              multiple={true}
            >
              {n}
            </CardButton>
          ))}
        </div>
        
        <div className="pt-4 border-t border-stone-100 dark:border-white/5">
          <div className="flex gap-4 items-end">
            <input 
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Or type custom note..."
              className="flex-1 bg-transparent border-b border-stone-200 dark:border-white/10 text-[10px] py-3 tracking-widest outline-none dark:text-white"
            />
            <button 
              onClick={() => handleAddCustomNote(noteKey)}
              disabled={!customNote.trim()}
              className="text-[9px] uppercase tracking-widest font-bold text-scent-accent pb-1 border-b border-transparent hover:border-scent-accent transition-all"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const steps = [
    {
      id: "families",
      title: "Olfactory Landscape",
      description: "Select the families that resonate with your identity.",
      component: (
        <div className="grid grid-cols-1 gap-3 w-full animate-fade-in">
          {SCENT_FAMILIES.map((f) => (
            <CardButton 
              key={f} 
              active={prefs.scentFamily.includes(f)} 
              onClick={() => toggleItem(prefs.scentFamily, f, 'scentFamily')}
              multiple={true}
            >
              {f}
            </CardButton>
          ))}
        </div>
      )
    },
    {
      id: "mood",
      title: "Desired Aura",
      description: "How should your presence make you feel?",
      isPremium: true,
      component: (
        <div className="relative">
          <div className="grid grid-cols-2 gap-3 w-full animate-fade-in">
            {MOODS.map((m) => (
              <CardButton 
                key={m} 
                active={prefs.moods?.includes(m)} 
                onClick={() => toggleItem(prefs.moods || [], m, 'moods')}
                multiple={true}
                disabled={!isPremium}
              >
                {m}
              </CardButton>
            ))}
          </div>
          {!isPremium && <PremiumLock title="Mood Filtering" />}
        </div>
      )
    },
    {
      id: "occasions",
      title: "Context & Place",
      description: "When do you typically envelop yourself in scent?",
      isPremium: true,
      component: (
        <div className="relative">
          <div className="grid grid-cols-2 gap-3 w-full animate-fade-in">
            {OCCASIONS.map((o) => (
              <CardButton 
                key={o} 
                active={prefs.occasions.includes(o)} 
                onClick={() => toggleItem(prefs.occasions, o, 'occasions')}
                multiple={true}
                disabled={!isPremium}
              >
                {o}
              </CardButton>
            ))}
          </div>
          {!isPremium && <PremiumLock title="Occasions" />}
        </div>
      )
    },
    {
      id: "projection",
      title: "Sillage & Projection",
      description: "How do you wish your fragrance to occupy space?",
      component: (
        <div className="grid grid-cols-1 gap-3 w-full animate-fade-in">
          {PROJECTION_PREFS.map((p) => (
            <CardButton 
              key={p} 
              active={prefs.projectionPreference === p} 
              onClick={() => { setPrefs({ ...prefs, projectionPreference: p }); setTimeout(nextStep, 300); }}
            >
              {p}
            </CardButton>
          ))}
        </div>
      )
    },
    {
      id: "climate",
      title: "Atmosphere",
      description: "Fragrances bloom uniquely in different climates.",
      component: (
        <div className="grid grid-cols-1 gap-3 w-full animate-fade-in">
          {SEASONS.map((s) => (
            <CardButton 
              key={s} 
              active={prefs.seasonClimate.includes(s)} 
              onClick={() => toggleItem(prefs.seasonClimate, s, 'seasonClimate')}
              multiple={true}
            >
              {s}
            </CardButton>
          ))}
        </div>
      )
    },
    {
      id: "budget",
      title: "Craftsmanship Tier",
      description: "Select the level of artistry you seek.",
      component: (
        <div className="grid grid-cols-1 gap-3 w-full animate-fade-in">
          {BUDGET_RANGES.map((b) => (
            <CardButton 
              key={b} 
              active={prefs.budgetRange === b} 
              onClick={() => { setPrefs({ ...prefs, budgetRange: b }); setTimeout(nextStep, 300); }}
            >
              {b}
            </CardButton>
          ))}
        </div>
      )
    },
    {
      id: "loved",
      title: "Preferred Accords",
      description: "Notes that define your signature.",
      component: <NoteSelectionGrid noteKey="lovedNotes" />
    },
    {
      id: "hated",
      title: "Exclusions",
      description: "Notes to remove from your olfactory profile.",
      component: <NoteSelectionGrid noteKey="hatedNotes" />
    }
  ];

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const isNextDisabled = () => {
    if (step === 0 && prefs.scentFamily.length === 0) return true;
    if (current.id === "mood" && !isPremium) return false;
    if (current.id === "occasions" && !isPremium) return false;
    if (current.id === "occasions" && isPremium && prefs.occasions.length === 0) return true;
    if (current.id === "projection" && !prefs.projectionPreference) return true;
    if (current.id === "climate" && prefs.seasonClimate.length === 0) return true;
    if (current.id === "budget" && !prefs.budgetRange) return true;
    return false;
  };

  return (
    <div className="px-8 pt-10 flex flex-col min-h-[75vh]">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[9px] tracking-[0.5em] uppercase text-scent-accent font-black">Phasis {step + 1}/{steps.length}</span>
          <span className="text-[9px] tracking-widest text-scent-text/40 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-[1px] w-full bg-stone-100 dark:bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full bg-scent-accent transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mb-10">
        <h2 className="font-serif text-3xl mb-4 text-scent-primary dark:text-white leading-tight">{current.title}</h2>
        <p className="text-scent-text dark:text-gray-400 text-[11px] leading-relaxed uppercase tracking-wider opacity-60">{current.description}</p>
      </div>

      <div className="flex-grow">
        {current.component}
      </div>

      <div className="mt-10 flex gap-4 pb-12">
        {step > 0 && (
          <button 
            onClick={prevStep}
            className="w-14 h-14 flex items-center justify-center border border-stone-100 dark:border-white/5 rounded-2xl text-scent-primary dark:text-white active:scale-90 transition-transform"
          >
            ←
          </button>
        )}
        <button 
          onClick={() => step === steps.length - 1 ? onComplete(prefs) : nextStep()}
          disabled={isNextDisabled()}
          className={`flex-1 py-5 bg-scent-primary dark:bg-white text-white dark:text-black text-[10px] tracking-[0.4em] uppercase font-bold rounded-full shadow-2xl transition-all ${
            isNextDisabled() ? 'opacity-20 cursor-not-allowed' : 'active:scale-[0.98]'
          }`}
        >
          {step === steps.length - 1 ? "Distill Essence" : (current.isPremium && !isPremium ? "Skip Privé Selection" : "Next")}
        </button>
      </div>
    </div>
  );
};
