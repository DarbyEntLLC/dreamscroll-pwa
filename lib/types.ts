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
  audioNotes: any;
  lastViewed: Date;
}

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  subtitle: string;
  profileImage: string;
  selectedLLM: 'GPT-4' | 'Claude 3' | 'Gemini 1.5';
}