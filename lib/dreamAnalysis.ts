// lib/dreamAnalysis.ts
import type { BiblicalRef } from './types';

/**
 * Dream Analysis Utilities
 * 
 * Functions for processing and analyzing dream content
 */

// Extract a short title from dream content
export const extractDreamTitle = (text: string): string => {
  const words = text.split(' ').slice(0, 4);
  return words.join(' ') + (text.split(' ').length > 4 ? '...' : '');
};

// Generate themes based on dream content
export const generateThemes = (content: string): string[] => {
  const themes: string[] = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('water') || lowerContent.includes('ocean')) themes.push('Cleansing');
  if (lowerContent.includes('fly') || lowerContent.includes('soar')) themes.push('Freedom');
  if (lowerContent.includes('mountain') || lowerContent.includes('climb')) themes.push('Obstacles');
  if (lowerContent.includes('light') || lowerContent.includes('bright')) themes.push('Revelation');
  if (lowerContent.includes('dark') || lowerContent.includes('shadow')) themes.push('Unknown');
  if (lowerContent.includes('door') || lowerContent.includes('gate')) themes.push('Opportunity');
  if (lowerContent.includes('storm') || lowerContent.includes('wind')) themes.push('Trial');
  
  return themes.slice(0, 3);
};

// Extract symbolic elements from dream
export const extractSymbols = (content: string): string[] => {
  const symbols: string[] = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('water')) symbols.push('💧 Water');
  if (lowerContent.includes('fire')) symbols.push('🔥 Fire');
  if (lowerContent.includes('tree')) symbols.push('🌳 Tree');
  if (lowerContent.includes('door')) symbols.push('🚪 Door');
  if (lowerContent.includes('key')) symbols.push('🔑 Key');
  if (lowerContent.includes('light')) symbols.push('💡 Light');
  if (lowerContent.includes('crown')) symbols.push('👑 Crown');
  if (lowerContent.includes('sword')) symbols.push('⚔️ Sword');
  
  return symbols.slice(0, 5);
};

// Analyze emotional tone of dream
export const analyzeEmotionalTone = (content: string): string => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('peace') || lowerContent.includes('calm')) return 'Peaceful';
  if (lowerContent.includes('fear') || lowerContent.includes('afraid')) return 'Anxious';
  if (lowerContent.includes('joy') || lowerContent.includes('happy')) return 'Joyful';
  if (lowerContent.includes('sad') || lowerContent.includes('cry')) return 'Sorrowful';
  if (lowerContent.includes('anger') || lowerContent.includes('frustrated')) return 'Troubled';
  
  return 'Neutral';
};

// Analyze overall mood
export const analyzeMood = (content: string): string => {
  const tone = analyzeEmotionalTone(content);
  return tone === 'Peaceful' || tone === 'Joyful' ? 'Positive' : 
         tone === 'Neutral' ? 'Neutral' : 'Challenging';
};

// Categorize dream type
export const categorize = (content: string): 'prophetic' | 'warning' | 'encouragement' | 'revelation' => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('future') || lowerContent.includes('vision')) return 'prophetic';
  if (lowerContent.includes('warning') || lowerContent.includes('danger')) return 'warning';
  if (lowerContent.includes('peace') || lowerContent.includes('comfort')) return 'encouragement';
  
  return 'revelation';
};

// Generate relevant tags
export const generateTags = (content: string, themes: string[], symbols: string[]): string[] => {
  const tags = [...themes];
  
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 22 || hour <= 4) tags.push('Late Night');
  else if (hour >= 5 && hour <= 8) tags.push('Early Morning');
  else if (hour >= 9 && hour <= 17) tags.push('Daytime');
  else tags.push('Evening');
  
  return Array.from(new Set(tags));
};

// Generate AI-like interpretation
export const generateInterpretation = (content: string): string => {
  const themes = generateThemes(content);
  const tone = analyzeEmotionalTone(content);
  
  let interpretation = `This dream appears to contain spiritual significance. `;
  
  if (themes.includes('Cleansing')) {
    interpretation += `The presence of water suggests a season of spiritual cleansing or renewal. `;
  }
  if (themes.includes('Freedom')) {
    interpretation += `Elements of flight or liberation indicate breakthrough and divine release. `;
  }
  if (themes.includes('Revelation')) {
    interpretation += `Light imagery points to divine illumination and understanding. `;
  }
  if (themes.includes('Obstacles')) {
    interpretation += `Mountains or barriers represent challenges that require faith to overcome. `;
  }
  
  interpretation += `The emotional tone suggests ${tone.toLowerCase()} spiritual dynamics at work. `;
  interpretation += `Consider seeking divine wisdom for full understanding of this revelation.`;
  
  return interpretation;
};

// Generate biblical references
export const generateBiblicalRefs = (content: string): BiblicalRef[] => {
  const refs: BiblicalRef[] = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('water')) {
    refs.push({
      verse: "Psalm 42:1",
      text: "As the deer pants for streams of water, so my soul pants for you, my God",
      relevance: "Spiritual thirst and divine connection"
    });
  }
  
  if (lowerContent.includes('light') || lowerContent.includes('bright')) {
    refs.push({
      verse: "Psalm 119:105",
      text: "Your word is a lamp for my feet, a light on my path",
      relevance: "Divine guidance and revelation"
    });
  }
  
  if (lowerContent.includes('mountain')) {
    refs.push({
      verse: "Matthew 17:20",
      text: "If you have faith as small as a mustard seed, you can say to this mountain, 'Move from here to there,' and it will move",
      relevance: "Faith to overcome obstacles"
    });
  }
  
  // Always include foundational verse
  refs.push({
    verse: "Joel 2:28",
    text: "I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams",
    relevance: "God speaks through dreams and visions"
  });
  
  return refs.slice(0, 3);
};

// Process raw data (for audio transcription, etc.)
export const processData = (data: any): any => {
  if (typeof data === 'string') {
    return data
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/<[^>]*>/g, '');
  }
  return data;
};