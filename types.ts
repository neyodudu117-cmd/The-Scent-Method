
export interface FragranceNote {
  top: string[];
  middle: string[];
  base: string[];
}

export interface LayeringSuggestion {
  note: string;
  reason: string;
}

export interface Fragrance {
  id: string;
  name: string;
  brand: string;
  family: string;
  notes: FragranceNote;
  description: string;
  matchReason: string;
  priceEstimate: string;
  imagePlaceholder: string;
  longevity: string;
  projection: string;
  bestSeason: string;
  bestOccasion: string;
  layeringSuggestions?: LayeringSuggestion[]; // Privé feature with explanations
}

export interface FavoriteRecord {
  userId: string;
  recommendationId: string;
  createdAt: string;
  fragrance: Fragrance;
}

export interface RecommendationResponse {
  personalitySummary: {
    title: string;
    description: string;
  };
  recommendations: Fragrance[];
}

export interface Recommendation {
  id: string;
  userId: string;
  brand: string;
  fragranceName: string;
  scentFamily: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  longevity: string;
  projection: string;
  bestSeason: string;
  bestOccasion: string;
  whyMatch: string;
  buyUrl: string;
  createdAt: string;
}

export interface UserPreferences {
  scentFamily: string[];
  occasions: string[];
  moods?: string[]; // Privé feature
  projectionPreference: string;
  seasonClimate: string[];
  budgetRange: string;
  lovedNotes: string[];
  hatedNotes: string[];
}

export interface QuizResponse extends UserPreferences {
  id: string;
  userId: string;
  createdAt: string;
}

export interface User {
  email: string;
  id: string;
  hasCompletedOnboarding: boolean;
  isPremium: boolean;
}

export type AppStep = 'auth' | 'welcome' | 'quiz' | 'loading' | 'results' | 'details' | 'favorites' | 'upgrade';
