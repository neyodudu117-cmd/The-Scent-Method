
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  user?: User | null;
  onAuth: (user: User, isNew: boolean) => void;
  onLogout?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ user, onAuth, onLogout }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const userId = btoa(email).slice(0, 8);
    onAuth({
      email,
      id: userId,
      hasCompletedOnboarding: !isLogin ? false : localStorage.getItem(`scentiq_onboarded_${userId}`) === 'true',
      isPremium: false
    }, !isLogin);
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    const mockEmail = `${provider.toLowerCase()}@example.com`;
    const userId = `social_${provider.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`;
    onAuth({
      email: mockEmail,
      id: userId,
      hasCompletedOnboarding: localStorage.getItem(`scentiq_onboarded_${userId}`) === 'true',
      isPremium: false
    }, false);
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-10 animate-fade-in pb-12">
        <div className="mb-16 text-center">
          <span className="text-[9px] tracking-[0.5em] uppercase text-scent-accent font-black block mb-4">Your Profile</span>
          <h2 className="font-serif text-4xl mb-3 text-scent-primary dark:text-white">Olfactory Identity</h2>
          <p className="text-[10px] tracking-[0.2em] uppercase text-scent-text/50 font-bold">
            Personalized Sensory Account
          </p>
        </div>

        <div className="w-full bg-white dark:bg-stone-900/50 rounded-[2.5rem] p-10 scent-shadow border border-stone-50 dark:border-white/5 space-y-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-scent-accent/30 to-transparent" />
          
          <div className="space-y-2">
            <label className="text-[8px] uppercase tracking-[0.4em] text-scent-accent font-black">Registered Essence</label>
            <p className="text-sm font-medium text-scent-primary dark:text-white truncate">{user.email}</p>
          </div>

          <div className="space-y-4">
            <label className="text-[8px] uppercase tracking-[0.4em] text-scent-accent font-black">Membership Tier</label>
            <div className="flex flex-col items-center gap-2">
              <span className={`px-6 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-black border ${
                user.isPremium 
                  ? 'bg-scent-accent text-white border-scent-accent shadow-lg animate-pulse' 
                  : 'bg-stone-50 dark:bg-white/5 text-scent-text dark:text-gray-400 border-stone-100 dark:border-white/10'
              }`}>
                {user.isPremium ? 'ScentIQ Privé' : 'Standard Collector'}
              </span>
              {!user.isPremium && (
                <p className="text-[8px] text-scent-text/40 uppercase tracking-widest mt-2">Elevate for exclusive alchemy features</p>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onLogout}
              className="w-full py-5 border border-scent-primary dark:border-white text-scent-primary dark:text-white text-[10px] tracking-[0.4em] uppercase font-black rounded-full hover:bg-scent-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
            >
              Secure Exit
            </button>
          </div>
        </div>

        <p className="mt-12 text-[8px] text-scent-text/30 uppercase tracking-[0.5em] font-black">ScentIQ Security Protocol Alpha</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-10 animate-fade-in pb-12">
      <div className="mb-12 text-center">
        <span className="text-[9px] tracking-[0.5em] uppercase text-scent-accent font-black block mb-4">Exclusive Access</span>
        <h2 className="font-serif text-4xl mb-3 text-scent-primary dark:text-white">
          {isLogin ? 'Welcome Back' : 'Create Vault'}
        </h2>
        <p className="text-[10px] tracking-[0.2em] uppercase text-scent-text/50 font-bold">
          Enter the sanctuary of ScentIQ
        </p>
      </div>

      <div className="w-full space-y-4 mb-8">
        <button 
          onClick={() => handleSocialAuth('Apple')}
          className="w-full py-4.5 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center gap-4 text-[9px] tracking-[0.2em] uppercase font-bold scent-shadow hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.96.95-2.04 1.43-3.23 1.43-1.16 0-2.12-.41-2.88-1.22-.8-.85-1.57-1.28-2.33-1.28-.76 0-1.53.43-2.3 1.28-.76.81-1.72 1.22-2.88 1.22-1.2 0-2.28-.48-3.23-1.43C-.7 17.39-1.2 12.57.55 9.04c.88-1.76 2.45-2.83 4.29-2.83 1.13 0 2.12.38 2.97 1.14.47.43.91.64 1.3.64.4 0 .84-.21 1.3-.64.85-.76 1.84-1.14 2.97-1.14 1.84 0 3.41 1.07 4.29 2.83 1.1 2.22 1.05 5.2-.15 7.96.2 3.28-.42 3.28-.42 3.28zM12 5.07c0-2.08 1.72-3.8 3.8-3.8.1 0 .2 0 .3 0-.1 2.08-1.82 3.8-3.8 3.8-.1 0-.2 0-.3 0z" />
          </svg>
          Continue with Apple
        </button>
        <button 
          onClick={() => handleSocialAuth('Google')}
          className="w-full py-4.5 bg-white border border-stone-100 text-black rounded-full flex items-center justify-center gap-4 text-[9px] tracking-[0.2em] uppercase font-bold scent-shadow hover:bg-stone-50 transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="w-full flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-stone-100 dark:bg-white/5" />
        <span className="text-[8px] uppercase tracking-[0.3em] text-scent-text/40 font-bold">Or Email</span>
        <div className="h-px flex-1 bg-stone-100 dark:bg-white/5" />
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <label className="text-[8px] uppercase tracking-[0.3em] text-scent-accent font-black ml-1">Email Essence</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-stone-900/50 border border-stone-100 dark:border-white/5 p-4 text-xs rounded-2xl focus:outline-none focus:border-scent-accent transition-colors dark:text-white"
            placeholder="nose@scentiq.luxury"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[8px] uppercase tracking-[0.3em] text-scent-accent font-black ml-1">Private Cipher</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white dark:bg-stone-900/50 border border-stone-100 dark:border-white/5 p-4 text-xs rounded-2xl focus:outline-none focus:border-scent-accent transition-colors dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4.5 bg-scent-primary dark:bg-white text-white dark:text-black text-[10px] tracking-[0.4em] uppercase font-bold rounded-full shadow-2xl active:scale-95 transition-all mt-4"
        >
          {isLogin ? 'Sign In' : 'Join the Elite'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[9px] tracking-[0.3em] uppercase text-scent-text hover:text-scent-accent transition-colors font-bold border-b border-scent-accent/30 pb-1"
        >
          {isLogin ? "New to ScentIQ? Register" : "Member? Return to Vault"}
        </button>
      </div>
    </div>
  );
};
