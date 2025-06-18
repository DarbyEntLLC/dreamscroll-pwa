'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Moon, Sun, Star, Heart, BookOpen, Mic, MicOff, Send, Search,
  User, Settings, Home, TrendingUp, PlusCircle, ArrowLeft,
  Sparkles, Brain, Share2, HelpCircle, Mail, Download,
  Bell, Shield, Globe, FileText, LogOut, Calendar, Filter,
  Volume2, VolumeX, Copy, ChevronDown, ChevronUp, Bookmark,
  Trash2, Edit3, Play, Pause, RefreshCw, Eye, EyeOff, Camera, Save
} from 'lucide-react';
import { LoadingScreen } from '@/components/screens/LoadingScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { DreamScrollLogo } from '@/components/ui/DreamScrollLogo';
import { NotificationBar } from '@/components/ui/NotificationBar';
import { BottomNav } from '@/components/ui/BottomNav';
import type { Dream, Notification, UserProfile, BiblicalRef } from '@/lib/types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function DreamScrollApp() {
  // --- State variables ---
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Kevin Darby',
    subtitle: 'Spiritual Dream Explorer',
    profileImage: '',
    selectedLLM: 'GPT-4'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // --- Refs ---
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Sample dreams data ---
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 1,
      title: "Golden Mountain Vision",
      content: "I found myself standing at the base of a magnificent golden mountain that seemed to touch the heavens. The peak was shrouded in brilliant white clouds, and I could hear a gentle voice inviting me upward.",
      date: "Nov 15, 2024",
      timestamp: new Date("2024-11-15T06:30:00"),
      themes: ["Divine Calling", "Spiritual Ascension", "Sacred Journey"],
      symbols: ["Golden Mountain", "Divine Voice", "Ancient Trees", "Heavenly Light"],
      interpretation: "This dream represents a divine calling and spiritual awakening in your life. The golden mountain symbolizes the sacred path God is inviting you to walk, similar to Moses' encounter with God on Mount Sinai.",
      biblicalRefs: [
        {
          verse: "Matthew 17:1-2",
          text: "After six days Jesus took with him Peter, James and John the brother of James, and led them up a high mountain by themselves. There he was transfigured before them.",
          relevance: "Mountains often represent places of divine encounter and transformation in Scripture."
        },
        {
          verse: "Isaiah 55:8-9",
          text: "For my thoughts are not your thoughts, neither are your ways my ways, declares the Lord. As the heavens are higher than the earth, so are my ways higher than your ways.",
          relevance: "The height of the mountain symbolizes God's higher perspective and calling."
        }
      ],
      emotionalTone: "Positive",
      mood: "Peaceful & Inspired",
      confidence: 92,
      isBookmarked: true,
      category: "Prophetic",
      tags: ["vision", "calling", "mountain", "peace"],
      audioNotes: null,
      lastViewed: new Date("2024-11-16T10:00:00")
    },
    {
      id: 2,
      title: "The Ancient Scroll",
      content: "In my dream, I discovered an ancient scroll hidden within the walls of what appeared to be Solomon's temple. The parchment glowed with a soft, warm light, and as I unrolled it, beautiful Hebrew letters appeared.",
      date: "Nov 12, 2024",
      timestamp: new Date("2024-11-12T04:15:00"),
      themes: ["Divine Revelation", "Hidden Wisdom", "Family Heritage"],
      symbols: ["Ancient Scroll", "Hebrew Letters", "Temple", "Divine Light"],
      interpretation: "This dream signifies that God is revealing hidden truths and divine wisdom to you. The ancient scroll represents the eternal Word of God and His plans for your life that are being unveiled.",
      biblicalRefs: [
        {
          verse: "Jeremiah 1:12",
          text: "The Lord said to me, 'You have seen correctly, for I am watching to see that my word is fulfilled.'",
          relevance: "God's words appearing on the scroll represent His active involvement in revealing His will."
        },
        {
          verse: "1 Corinthians 2:10",
          text: "These are the things God has revealed to us by his Spirit. The Spirit searches all things, even the deep things of God.",
          relevance: "Your supernatural understanding represents the Spirit's revelation of divine mysteries."
        }
      ],
      emotionalTone: "Positive",
      mood: "Awe-struck & Grateful",
      confidence: 88,
      isBookmarked: false,
      category: "Revelation",
      tags: ["scroll", "wisdom", "temple", "family"],
      audioNotes: null,
      lastViewed: new Date("2024-11-13T09:30:00")
    }
  ]);

  // --- Theme classes ---
  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBackground: darkMode ? 'bg-gray-800/50' : 'bg-white/80',
    cardBorder: darkMode ? 'border-gray-700/50' : 'border-gray-200',
    textPrimary: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    inputBackground: darkMode ? 'bg-gray-800' : 'bg-white',
    inputBorder: darkMode ? 'border-gray-700' : 'border-gray-300',
    buttonSecondary: darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-200 hover:bg-gray-300',
    navBackground: darkMode ? 'bg-gray-800/90' : 'bg-white/90',
    navBorder: darkMode ? 'border-gray-700/50' : 'border-gray-200'
  };

  // --- Effects ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudioSupported('MediaRecorder' in window);
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTimer(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // --- Notification helpers ---
  const addNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Dream helpers ---
  const toggleBookmark = (dreamId: number) => {
    setDreams(prev =>
      prev.map(dream =>
        dream.id === dreamId
          ? { ...dream, isBookmarked: !dream.isBookmarked }
          : dream
      )
    );
  };
  const saveProfile = () => {
    setIsEditingProfile(false);
    addNotification('Profile updated successfully!', 'success');
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addNotification('Copied to clipboard!', 'success');
    });
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          profileImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Timer helper ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Dream analysis & AI simulation helpers ---
 // --- Dream analysis & AI simulation helpers ---
const extractDreamTitle = (text: string) => {
  const words = text.split(' ').slice(0, 4);
  return words.join(' ') + (text.split(' ').length > 4 ? '...' : '');
};

// Add these missing functions:
const generateThemes = (content: string): string[] => {
  const themes = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('water') || lowerContent.includes('ocean')) themes.push('Cleansing');
  if (lowerContent.includes('fly') || lowerContent.includes('soar')) themes.push('Freedom');
  if (lowerContent.includes('mountain') || lowerContent.includes('climb')) themes.push('Obstacles');
  if (lowerContent.includes('light') || lowerContent.includes('bright')) themes.push('Revelation');
  if (lowerContent.includes('dark') || lowerContent.includes('shadow')) themes.push('Unknown');
  
  return themes.slice(0, 3); // Return max 3 themes
};

const extractSymbols = (content: string): string[] => {
  const symbols = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('water')) symbols.push('💧 Water');
  if (lowerContent.includes('fire')) symbols.push('🔥 Fire');
  if (lowerContent.includes('tree')) symbols.push('🌳 Tree');
  if (lowerContent.includes('door')) symbols.push('🚪 Door');
  if (lowerContent.includes('key')) symbols.push('🔑 Key');
  
  return symbols;
};

const analyzeEmotionalTone = (content: string): string => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('peace') || lowerContent.includes('calm')) return 'Peaceful';
  if (lowerContent.includes('fear') || lowerContent.includes('afraid')) return 'Anxious';
  if (lowerContent.includes('joy') || lowerContent.includes('happy')) return 'Joyful';
  if (lowerContent.includes('sad') || lowerContent.includes('cry')) return 'Sorrowful';
  
  return 'Neutral';
};

const analyzeMood = (content: string): string => {
  const tone = analyzeEmotionalTone(content);
  return tone === 'Peaceful' || tone === 'Joyful' ? 'Positive' : tone === 'Neutral' ? 'Neutral' : 'Challenging';
};

const categorize = (content: string): string => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('future') || lowerContent.includes('vision')) return 'prophetic';
  if (lowerContent.includes('warning') || lowerContent.includes('danger')) return 'warning';
  if (lowerContent.includes('peace') || lowerContent.includes('comfort')) return 'encouragement';
  
  return 'revelation';
};

const generateTags = (content: string, themes: string[], symbols: string[]): string[] => {
  const tags = [...themes];
  
  // Add time-based tags
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 22 || hour <= 4) tags.push('Late Night');
  else if (hour >= 5 && hour <= 8) tags.push('Early Morning');
  
  return Array.from(new Set(tags)); // Remove duplicates
};

// If you have processData function being called somewhere, add it:
const processData = (data: any) => {
  // Simple pass-through for now
  return data;
};

  // --- Audio Recording Helpers ---
  const startRealRecording = async () => {
    if (!audioSupported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startSpeechRecognition();
    } catch (error) {
      addNotification('Error accessing microphone. Please check permissions.', 'error');
    }
  };
  const stopRealRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setIsListening(false);
  };
  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setDreamText(prev => prev + ' ' + finalTranscript);
        }
      };
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        addNotification('Speech recognition error. Please try again.', 'error');
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.start();
    }
  };
// Add this with your other helper functions
const generateInterpretation = (content: string): string => {

  // Simulate AI interpretation based on content
  const themes = generateThemes(content);
  const symbols = extractSymbols(content);
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
  
  interpretation += `The emotional tone suggests ${tone.toLowerCase()} spiritual dynamics at work. `;
  interpretation += `Consider seeking divine wisdom for full understanding of this revelation.`;
  
  return interpretation;
};

const generateBiblicalRefs = (content: string): BiblicalRef[] => {
  const refs: BiblicalRef[] = [];
  const lowerContent = content.toLowerCase();
  
  // Add relevant verses based on content
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
  
  // Always include this foundational verse
  refs.push({
    verse: "Joel 2:28",
    text: "I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams",
    relevance: "God speaks through dreams and visions"
  });
  
  return refs.slice(0, 3); // Return max 3 references
};

  // --- Generate interpretation (simulate AI, async) ---
  const generateAdvancedInterpretation = async (dreamText: string) => {
    setIsProcessing(true);
    setCurrentScreen('interpretation');
    setTimeout(() => {
      const newDream: Dream = {
        id: dreams.length + 1,
        title: extractDreamTitle(dreamText),
        content: dreamText,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        timestamp: new Date(),
        themes: generateThemes(dreamText),
        symbols: extractSymbols(dreamText),
        interpretation: generateInterpretation(dreamText) + ` (Interpreted using ${userProfile.selectedLLM})`,
        biblicalRefs: generateBiblicalRefs(dreamText),
        emotionalTone: analyzeEmotionalTone(dreamText),
        mood: analyzeMood(dreamText),
        confidence: Math.floor(Math.random() * 20) + 80,
        isBookmarked: false,
        category: categorize(dreamText),
        tags: generateTags(dreamText, generateThemes(dreamText), extractSymbols(dreamText)),
        audioNotes: null,
        lastViewed: new Date()
      };
      setDreams(prev => [newDream, ...prev]);
      setSelectedDream(newDream);
      setIsProcessing(false);
      addNotification('Dream interpretation complete!', 'success');
    }, 3500);
  };

  // --- FALLBACK ---
  return (
    <div className="w-full max-w-sm md:max-w-6xl mx-auto bg-gray-900 min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <DreamScrollLogo size={64} className="mx-auto mb-4" />
        <p>Loading DreamScroll...</p>
      </div>
    </div>
  );
}
