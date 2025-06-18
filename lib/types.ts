// lib/types.ts

export interface BiblicalRef {
  verse: string;
  text: string;
  relevance: string;
}

export interface Dream {
  id: number;
  title: string;
  content: string;
  date: string;
  timestamp: Date;
  themes: string[];
  symbols: string[];
  interpretation: string;
  biblicalRefs: BiblicalRef[];
  emotionalTone: string;
  mood: string;
  confidence: number;
  isBookmarked: boolean;
  category: string;
  tags: string[];
  audioNotes?: Blob | null;
  lastViewed: Date;
  userId?: string; // For multi-user support
}

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: Date;
}

export interface UserProfile {
  id?: string;
  name: string;
  subtitle: string;
  profileImage: string;
  selectedLLM: 'GPT-4' | 'Claude 3' | 'Gemini 1.5';
  email?: string;
  createdAt?: Date;
  subscription?: 'free' | 'premium' | 'pro';
}

export type Screen = 'home' | 'journal' | 'input' | 'trends' | 'profile' | 'auth' | 'search' | 'interpretation';

export type AuthMode = 'signin' | 'signup';

export interface ThemeClasses {
  background: string;
  cardBackground: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  inputBackground: string;
  inputBorder: string;
  buttonSecondary: string;
  navBackground: string;
  navBorder: string;
}