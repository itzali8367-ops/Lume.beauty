export type CategoryId = 'skincare' | 'haircare' | 'wellness';

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  skinType?: string;
  verifiedBuyer?: boolean;
}

export type Review = ProductReview;

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  concerns: string[];
  featured?: boolean;
  volume?: string;
  suitableFor?: string[];
  keyBenefits?: string[];
  ingredients?: string[];
  keyActives?: { name: string; percentage?: string; purpose: string }[];
  howToUse?: string;
  routineStep?: 'Cleanse' | 'Treat' | 'Hydrate' | 'Protect' | 'Weekly Care' | 'Daily Wellness';
  userReviews?: ProductReview[];
  aliexpressUrl?: string;
}

export interface Guide {
  id: string;
  title: string;
  category: CategoryId;
  excerpt: string;
  image: string;
  author: string;
  readTime: number;
  tags: string[];
  content: string[];
  takeaways: string[];
}

export interface RoutineStep {
  id: string;
  title: string;
  description: string;
  timeOfDay?: 'am' | 'pm' | 'weekly';
  productSuggestion?: string;
}

export interface Routine {
  id: string;
  name: string;
  time: string;
  category: CategoryId;
  accent: string;
  steps: RoutineStep[];
}

export interface UserProfile {
  name: string;
  skinType: string;
  hairType: string;
  concerns: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  skinType: string;
  hairType: string;
  concerns: string[];
  createdAt: string;
  preferences: {
    morningReminder: boolean;
    eveningReminder: boolean;
    weeklyNewsletter: boolean;
  };
}

export interface JournalEntry {
  date: string;
  rating: number;
  mood: string;
  moodIcon?: string;
  customMoodIconUrl?: string;
  note?: string;
  skinFeel?: string[];
  routineCorrelation?: {
    morningDone: boolean;
    eveningDone: boolean;
    stepsCompleted: number;
    waterGlasses: number;
    waterGoal: number;
    streakDays: number;
  };
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  tag: 'AM' | 'PM' | 'Bare Skin' | 'Progress';
  skinScore: number; // 1-10
  notes?: string;
  concernsTracked?: string[];
}

export interface QuizAnswers {
  primaryConcerns: string[];
  skinType: string;
  hydrationLevel: string;
  sensitivity: string;
  routineComplexity: string;
  primaryGoal: string;
  sunExposure: string;
}
