
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Details } from './components/Details';
import { Favorites } from './components/Favorites';
import { Upgrade } from './components/Upgrade';
import { Loader } from './components/Loader';
import { AppStep, UserPreferences, Fragrance, User, QuizResponse, Recommendation, RecommendationResponse, FavoriteRecord } from './types';
import { recommendFragrances } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<AppStep>('auth');
  const [results, setResults] = useState<Fragrance[]>([]);
  const [personality, setPersonality] = useState<RecommendationResponse['personalitySummary'] | null>(null);
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cameFromResults, setCameFromResults] = useState(false);

  // Persistence for user session, theme, and last results
  useEffect(() => {
    const savedUser = localStorage.getItem('scentiq_session');
    const savedResults = localStorage.getItem('scentiq_last_results');
    const savedPersonality = localStorage.getItem('scentiq_last_personality');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Hydrate previous results if they exist
      if (savedResults) setResults(JSON.parse(savedResults));
      if (savedPersonality) setPersonality(JSON.parse(savedPersonality));

      if (!parsedUser.hasCompletedOnboarding) {
        setStep('welcome');
      } else if (savedResults) {
        setStep('results');
      } else {
        setStep('favorites');
      }
    }

    const savedTheme = localStorage.getItem('scentiq_theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  // Load user-specific favorite records
  useEffect(() => {
    if (user) {
      const savedVault = localStorage.getItem(`scentiq_vault_records_${user.id}`);
      if (savedVault) setFavorites(JSON.parse(savedVault));
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('scentiq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('scentiq_theme', 'light');
    }
  }, [isDarkMode]);

  const handleAuth = (mockUser: User, isNew: boolean) => {
    setUser(mockUser);
    localStorage.setItem('scentiq_session', JSON.stringify(mockUser));
    
    if (isNew || !mockUser.hasCompletedOnboarding) {
      setStep('welcome');
    } else {
      // Check for results before deciding landing page
      const savedResults = localStorage.getItem('scentiq_last_results');
      setStep(savedResults ? 'results' : 'favorites');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('scentiq_session');
    localStorage.removeItem('scentiq_last_results');
    localStorage.removeItem('scentiq_last_personality');
    setUser(null);
    setStep('auth');
    setResults([]);
    setPersonality(null);
    setFavorites([]);
  };

  const saveFavorites = (newFavs: FavoriteRecord[]) => {
    if (!user) return;
    setFavorites(newFavs);
    localStorage.setItem(`scentiq_vault_records_${user.id}`, JSON.stringify(newFavs));
  };

  const startDiscovery = () => setStep('quiz');

  const handleQuizComplete = async (prefs: UserPreferences) => {
    if (!user) return;
    setStep('loading');
    setError(null);
    try {
      const quizResponse: QuizResponse = {
        ...prefs,
        id: `resp_${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString()
      };

      const existingResponses = JSON.parse(localStorage.getItem('scentiq_quiz_responses') || '[]');
      existingResponses.push(quizResponse);
      localStorage.setItem('scentiq_quiz_responses', JSON.stringify(existingResponses));

      const recommendationCount = user.isPremium ? 5 : 3;
      const response = await recommendFragrances(prefs, recommendationCount, user.isPremium);
      
      // Persist results locally
      setResults(response.recommendations);
      setPersonality(response.personalitySummary);
      localStorage.setItem('scentiq_last_results', JSON.stringify(response.recommendations));
      localStorage.setItem('scentiq_last_personality', JSON.stringify(response.personalitySummary));

      const createdAt = new Date().toISOString();
      const newRecommendations: Recommendation[] = response.recommendations.map(f => ({
        id: `rec_${f.id}`,
        userId: user.id,
        brand: f.brand,
        fragranceName: f.name,
        scentFamily: f.family,
        topNotes: f.notes.top,
        middleNotes: f.notes.middle,
        baseNotes: f.notes.base,
        longevity: f.longevity,
        projection: f.projection,
        bestSeason: f.bestSeason,
        bestOccasion: f.bestOccasion,
        whyMatch: f.matchReason,
        buyUrl: `https://www.google.com/search?q=${encodeURIComponent(f.brand + ' ' + f.name)}`,
        createdAt
      }));

      const existingRecs = JSON.parse(localStorage.getItem('scentiq_recommendations') || '[]');
      localStorage.setItem('scentiq_recommendations', JSON.stringify([...existingRecs, ...newRecommendations]));
      
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      localStorage.setItem('scentiq_session', JSON.stringify(updatedUser));
      localStorage.setItem(`scentiq_onboarded_${user.id}`, 'true');
      
      setStep('results');
    } catch (err) {
      console.error(err);
      setError("The sensory library is currently unavailable. Please try again.");
      setStep('welcome');
    }
  };

  const handleUpgrade = () => {
    if (!user) return;
    const upgradedUser = { ...user, isPremium: true };
    setUser(upgradedUser);
    localStorage.setItem('scentiq_session', JSON.stringify(upgradedUser));
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-scent-accent text-white px-6 py-3 text-[9px] uppercase tracking-widest font-bold z-[100] animate-fade-in shadow-2xl rounded-full';
    toast.innerText = 'Privé Membership Activated';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const toggleFavorite = (f: Fragrance) => {
    if (!user) return;
    const exists = favorites.find(rec => rec.recommendationId === f.id);
    if (exists) {
      saveFavorites(favorites.filter(rec => rec.recommendationId !== f.id));
    } else {
      const newRecord: FavoriteRecord = {
        userId: user.id,
        recommendationId: f.id,
        createdAt: new Date().toISOString(),
        fragrance: f
      };
      saveFavorites([...favorites, newRecord]);
    }
  };

  const handleViewDetails = (f: Fragrance) => {
    setCameFromResults(step === 'results');
    setSelectedFragrance(f);
    setStep('details');
  };

  const handleReset = () => {
    setResults([]);
    setPersonality(null);
    setSelectedFragrance(null);
    localStorage.removeItem('scentiq_last_results');
    localStorage.removeItem('scentiq_last_personality');
    setStep('quiz');
  };

  const handleNavigate = (newStep: AppStep) => {
    if (!user) {
      setStep('auth');
      return;
    }
    // Prevent navigating to results if empty
    if (newStep === 'results' && results.length === 0) {
        setStep('quiz');
    } else {
        setStep(newStep);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <Layout 
      currentStep={step} 
      onNavigate={handleNavigate} 
      isDark={isDarkMode} 
      toggleDark={toggleDarkMode}
      user={user}
      onLogout={handleLogout}
    >
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 text-[10px] uppercase tracking-widest border border-red-100 dark:border-red-900 flex items-center gap-3">
           <span className="text-lg">⚠️</span> {error}
        </div>
      )}
      
      {step === 'auth' && <Auth user={user} onAuth={handleAuth} onLogout={handleLogout} />}
      {step === 'welcome' && <Onboarding onComplete={startDiscovery} />}
      {step === 'quiz' && <Quiz onComplete={handleQuizComplete} isPremium={user?.isPremium || false} onUpgrade={() => setStep('upgrade')} />}
      {step === 'loading' && <Loader />}
      {step === 'results' && (
        <Results 
          fragrances={results} 
          favorites={favorites.map(f => f.fragrance)} 
          personality={personality}
          isPremium={user?.isPremium || false}
          onViewDetails={handleViewDetails}
          onToggleFavorite={toggleFavorite}
          onReset={handleReset} 
        />
      )}
      {step === 'details' && selectedFragrance && (
        <Details 
            fragrance={selectedFragrance} 
            favorites={favorites.map(f => f.fragrance)}
            showBackToResults={cameFromResults}
            isPremium={user?.isPremium || false}
            onToggleFavorite={toggleFavorite}
            onBack={() => cameFromResults ? setStep('results') : setStep('favorites')} 
            onUpgrade={() => setStep('upgrade')}
        />
      )}
      {step === 'favorites' && (
        <Favorites 
          favorites={favorites} 
          onViewDetails={handleViewDetails}
          onRemove={(f) => toggleFavorite(f)} 
        />
      )}
      {step === 'upgrade' && <Upgrade onUpgrade={handleUpgrade} isPremium={user?.isPremium} />}
      
      {['auth', 'welcome', 'results', 'upgrade', 'favorites'].includes(step) && (
        <footer className="py-10 text-center text-[8px] uppercase tracking-[0.4em] text-gray-300 dark:text-gray-600">
          &copy; 2025 ScentIQ Parfumerie • Art & Science
        </footer>
      )}
    </Layout>
  );
};

export default App;
