'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Star, Heart, BookOpen, Mic, MicOff, Send, Search, 
  User, Settings, Home, TrendingUp, PlusCircle, ArrowLeft, 
  Sparkles, Brain, Share2, HelpCircle, Mail, Download, 
  Bell, Shield, Globe, FileText, LogOut, Calendar, Filter,
  Volume2, VolumeX, Copy, ChevronDown, ChevronUp, Bookmark,
  Trash2, Edit3, Play, Pause, RefreshCw, Eye, EyeOff
} from 'lucide-react';

// Type declarations for browser APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Interface definitions
interface BiblicalRef {
  verse: string;
  text: string;
  relevance: string;
}

interface Dream {
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

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: Date;
}

// Logo Component
const DreamScrollLogo = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
  <div className={`relative ${className}`} style={{ width: size, height: size }}>
    <div 
      className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full"
      style={{
        background: 'linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%)'
      }}
    />
    <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
      <Moon className="text-white" style={{ width: size * 0.4, height: size * 0.4 }} />
    </div>
  </div>
);

export default function DreamScrollApp() {
  // Core State
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [authMode, setAuthMode] = useState('signin');
  
  // Dream Input State
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  
  // Navigation State
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('date');
  
  // Enhanced UI State
  const [showBiblicalRefs, setShowBiblicalRefs] = useState<boolean>(true);
  const [showSymbols, setShowSymbols] = useState<boolean>(true);
  const [textToSpeech, setTextToSpeech] = useState<boolean>(false);
  const [readingSpeed, setReadingSpeed] = useState<number>(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced Sample Dreams Data
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 1,
      title: "Golden Mountain Vision",
      content: "I found myself standing at the base of a magnificent golden mountain that seemed to touch the heavens. The peak was shrouded in brilliant white clouds, and I could hear a gentle voice calling my name from above. As I began to climb, each step felt lighter, and my heart filled with an overwhelming sense of peace and purpose. Ancient trees lined the path, their leaves shimmering like precious gems in the divine light.",
      date: "Nov 15, 2024",
      timestamp: new Date("2024-11-15T06:30:00"),
      themes: ["Divine Calling", "Spiritual Ascension", "Sacred Journey"],
      symbols: ["Golden Mountain", "Divine Voice", "Ancient Trees", "Heavenly Light"],
      interpretation: "This dream represents a divine calling and spiritual awakening in your life. The golden mountain symbolizes the sacred path God is inviting you to walk, similar to Moses' encounter on Mount Sinai. The voice calling your name suggests God's personal invitation to deeper relationship and purpose. The lightness of your steps indicates that when we align with God's will, our burdens become light and our path becomes clear.",
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
      content: "In my dream, I discovered an ancient scroll hidden within the walls of what appeared to be Solomon's temple. The parchment glowed with a soft, warm light, and as I unrolled it, beautiful Hebrew letters began to appear, writing themselves across the surface. Though I couldn't read Hebrew in waking life, somehow I understood every word. The scroll contained prophecies about restoration and hope for my family lineage.",
      date: "Nov 12, 2024",
      timestamp: new Date("2024-11-12T04:15:00"),
      themes: ["Divine Revelation", "Hidden Wisdom", "Family Heritage"],
      symbols: ["Ancient Scroll", "Hebrew Letters", "Temple", "Divine Light"],
      interpretation: "This dream signifies that God is revealing hidden truths and divine wisdom to you. The ancient scroll represents the eternal Word of God and His plans for your life that are being unveiled. Your supernatural ability to understand Hebrew suggests the Holy Spirit giving you divine insight beyond natural understanding. The temple setting indicates this revelation comes from the holy presence of God.",
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
    },
    {
      id: 3,
      title: "Storm and Rainbow",
      content: "I was caught in a fierce storm with thunder and lightning all around me. The wind was so strong I could barely stand, and rain poured down like a waterfall. Just when I thought I couldn't endure anymore, the storm suddenly stopped, and the most beautiful rainbow I've ever seen appeared across the entire sky. A gentle dove landed on my shoulder, and I felt an incredible sense of God's faithfulness and promise.",
      date: "Nov 10, 2024",
      timestamp: new Date("2024-11-10T07:45:00"),
      themes: ["Trials & Testing", "God's Faithfulness", "Divine Promise"],
      symbols: ["Storm", "Rainbow", "Dove", "Thunder", "Rain"],
      interpretation: "This dream reflects a season of trials you're experiencing or will face, but with a powerful message of hope. The storm represents the challenges and difficulties in your life, while the rainbow symbolizes God's covenant faithfulness - His promise to see you through. The dove represents the Holy Spirit's comfort and God's peace that follows the storm.",
      biblicalRefs: [
        {
          verse: "Genesis 9:13",
          text: "I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth.",
          relevance: "The rainbow represents God's faithfulness and His promises that never fail."
        },
        {
          verse: "Isaiah 43:2",
          text: "When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you.",
          relevance: "God's promise to be with us through life's storms and difficulties."
        }
      ],
      emotionalTone: "Mixed",
      mood: "Hopeful despite trials",
      confidence: 90,
      isBookmarked: true,
      category: "Encouragement",
      tags: ["storm", "rainbow", "hope", "trials"],
      audioNotes: null,
      lastViewed: new Date("2024-11-11T14:20:00")
    },
    {
      id: 4,
      title: "Garden of Living Waters",
      content: "I walked through a beautiful garden where every plant was more vibrant than anything I'd seen in real life. There was a crystal-clear stream flowing through the center, and wherever the water touched, flowers bloomed instantly. I cupped the water in my hands and drank - it tasted like liquid light and filled me with indescribable joy and strength.",
      date: "Nov 8, 2024",
      timestamp: new Date("2024-11-08T05:20:00"),
      themes: ["Spiritual Refreshing", "Divine Life", "Restoration"],
      symbols: ["Garden", "Living Water", "Blooming Flowers", "Crystal Stream"],
      interpretation: "This dream speaks of the refreshing and life-giving presence of the Holy Spirit in your life. The garden represents your heart being cultivated by God, while the living water symbolizes the Spirit's work of bringing new life and growth. The instant blooming of flowers shows how God's presence brings immediate transformation and beauty to areas that seemed barren.",
      biblicalRefs: [
        {
          verse: "John 7:38",
          text: "Whoever believes in me, as Scripture has said, rivers of living water will flow from within them.",
          relevance: "The living water represents the Holy Spirit flowing through your life."
        },
        {
          verse: "Isaiah 55:10-11",
          text: "As the rain and the snow come down from heaven, and do not return to it without watering the earth and making it bud and flourish...",
          relevance: "God's word and presence bring forth spiritual fruit and growth."
        }
      ],
      emotionalTone: "Positive",
      mood: "Refreshed & Joyful",
      confidence: 94,
      isBookmarked: true,
      category: "Spiritual Life",
      tags: ["garden", "water", "growth", "refreshing"],
      audioNotes: null,
      lastViewed: new Date("2024-11-09T16:45:00")
    }
  ]);

  // Check for audio support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasMediaRecorder = 'MediaRecorder' in window;
      setAudioSupported(hasMediaRecorder);
    }
  }, []);

  // Timer effect for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTimer(0);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio Recording Functions
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
        console.log('Audio recorded:', audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start speech recognition if available
      startSpeechRecognition();
    } catch (error) {
      console.error('Error starting recording:', error);
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
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
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
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addNotification('Speech recognition error. Please try again.', 'error');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    }
  };

  // Enhanced dream processing function
  const generateAdvancedInterpretation = async (dreamText: string) => {
    setIsProcessing(true);
    setCurrentScreen('interpretation');
    
    // Simulate AI processing with more realistic timing
    setTimeout(() => {
      const newDream = {
        id: dreams.length + 1,
        title: extractDreamTitle(dreamText),
        content: dreamText,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        timestamp: new Date(),
        themes: generateThemes(dreamText),
        symbols: extractSymbols(dreamText),
        interpretation: generateInterpretation(dreamText),
        biblicalRefs: generateBiblicalRefs(dreamText),
        emotionalTone: analyzeEmotionalTone(dreamText),
        mood: analyzeMood(dreamText),
        confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
        isBookmarked: false,
        category: categorize(dreamText),
        tags: generateTags(dreamText),
        audioNotes: null,
        lastViewed: new Date()
      };
      
      setDreams(prev => [newDream, ...prev]);
      setSelectedDream(newDream);
      setIsProcessing(false);
      addNotification('Dream interpretation complete!', 'success');
    }, 3500);
  };

  // Helper functions for dream analysis
  const extractDreamTitle = (text: string) => {
    const words = text.split(' ').slice(0, 4);
    return words.join(' ') + (text.split(' ').length > 4 ? '...' : '');
  };

  const generateThemes = (text: string) => {
    const themes = ["Spiritual Growth", "Divine Guidance", "Personal Journey", "Faith Challenge", "Divine Promise"];
    return themes.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const extractSymbols = (text: string) => {
    const commonSymbols = ["Light", "Water", "Mountain", "Tree", "Door", "Path", "Crown", "Book"];
    return commonSymbols.slice(0, Math.floor(Math.random() * 4) + 2);
  };

  const generateInterpretation = (text: string) => {
    return "Your dream contains meaningful spiritual symbolism that suggests God is speaking to you about growth and transformation in your spiritual journey. The elements you described indicate divine guidance and encouragement for the path ahead.";
  };

  const generateBiblicalRefs = (text: string) => {
    return [
      {
        verse: "Psalm 119:105",
        text: "Your word is a lamp for my feet, a light on my path.",
        relevance: "God provides guidance and illumination for our spiritual journey."
      }
    ];
  };

  const analyzeEmotionalTone = (text: string) => {
    const positiveWords = ['joy', 'peace', 'light', 'beautiful', 'love'];
    const negativeWords = ['fear', 'dark', 'lost', 'angry', 'sad'];
    
    const hasPositive = positiveWords.some(word => text.toLowerCase().includes(word));
    const hasNegative = negativeWords.some(word => text.toLowerCase().includes(word));
    
    if (hasPositive && !hasNegative) return 'Positive';
    if (hasNegative && !hasPositive) return 'Negative';
    return 'Mixed';
  };

  const analyzeMood = (text: string) => {
    return 'Contemplative';
  };

  const categorize = (text: string) => {
    const categories = ['Prophetic', 'Encouragement', 'Warning', 'Spiritual Life', 'Revelation'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const generateTags = (text: string) => {
    return ['spiritual', 'guidance', 'growth'];
  };

  // Notification system
  const addNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = readingSpeed;
      speechSynthesis.speak(utterance);
    }
  };

  // Helper functions
  const toggleBookmark = (dreamId: number) => {
    setDreams(prev => prev.map(dream => 
      dream.id === dreamId 
        ? { ...dream, isBookmarked: !dream.isBookmarked }
        : dream
    ));
  };

  const deleteDream = (dreamId: number) => {
    setDreams(prev => prev.filter(dream => dream.id !== dreamId));
    addNotification('Dream deleted', 'info');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addNotification('Copied to clipboard!', 'success');
    });
  };

  // Enhanced filtering and sorting
  const getSortedFilteredDreams = () => {
    let filtered = dreams.filter(dream => {
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'bookmarked' && dream.isBookmarked) ||
        (selectedFilter === 'recent' && new Date(dream.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (selectedFilter === 'prophetic' && dream.category === 'Prophetic') ||
        (selectedFilter === 'encouragement' && dream.category === 'Encouragement');
      
      const matchesSearch = !searchQuery || 
        dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });

    // Sort dreams
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'confidence':
          return b.confidence - a.confidence;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    return filtered;
  };

  // Analytics functions
  const getEmotionalToneData = () => {
    const total = dreams.length || 1;
    const positive = dreams.filter(d => d.emotionalTone === 'Positive').length;
    const negative = dreams.filter(d => d.emotionalTone === 'Negative').length;
    const neutral = total - positive - negative;
    
    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100)
    };
  };

  const getCategoryData = () => {
    const categoryCount: { [key: string]: number } = {};
    dreams.forEach(dream => {
      categoryCount[dream.category] = (categoryCount[dream.category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([category, count]) => ({ category, count }));
  };

  const getRecurringSymbols = () => {
    const symbolCounts: { [key: string]: number } = {};
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
      });
    });
    
    return Object.entries(symbolCounts)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  // Notification Component
  const NotificationBar = () => (
    notifications.length > 0 && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-2 p-3 rounded-xl backdrop-blur-xl border ${
              notification.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
              'bg-blue-500/20 border-blue-500/30 text-blue-300'
            } animate-in slide-in-from-top duration-300`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    )
  );

  // Bottom Navigation Component
  const BottomNav = ({ activeScreen }: { activeScreen: string }) => (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-gray-800/90 backdrop-blur-xl border-t border-gray-700/50">
      <div className="flex items-center justify-around py-2">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'journal', icon: BookOpen, label: 'Journal' },
          { id: 'input', icon: PlusCircle, label: 'Record' },
          { id: 'trends', icon: TrendingUp, label: 'Trends' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
              activeScreen === id 
                ? 'text-blue-400 bg-blue-500/20' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // AUTH SCREEN
  if (currentScreen === 'auth') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center p-8">
            <div className="text-center mb-8">
              <DreamScrollLogo size={60} className="mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-400">
                {authMode === 'signin' 
                  ? 'Sign in to access your dream journal' 
                  : 'Start your spiritual dream journey'
                }
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {authMode === 'signup' && (
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              )}
            </div>
            
            <button
              onClick={() => {
                setIsAuthenticated(true);
                setCurrentScreen('home');
                addNotification('Welcome to DreamScroll!', 'success');
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all mb-4"
            >
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
            
            <button
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="w-full text-blue-400 hover:text-blue-300 py-2 transition-all"
            >
              {authMode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
          
          <div className="p-8">
            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full text-gray-400 hover:text-gray-300 py-2 transition-all"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // HOME SCREEN
  if (currentScreen === 'home') {
    const emotionalData = getEmotionalToneData();
    const recentDreams = dreams.slice(0, 2);
    
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DreamScrollLogo size={32} />
                <div>
                  <h1 className="text-xl font-bold text-white">DreamScroll</h1>
                  <p className="text-sm text-gray-400">Biblical Dream Interpretation</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-300" />}
                </button>
                <button className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                  <Bell className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isAuthenticated ? `Welcome back! 👋` : 'Welcome to DreamScroll! 👋'}
              </h2>
              <p className="text-gray-300 mb-4">
                Ready to discover the spiritual meaning behind your dreams?
              </p>
              <button 
                onClick={() => setCurrentScreen('input')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Record New Dream ✨
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 text-center border border-gray-700/50">
                <div className="text-2xl font-bold text-white">{dreams.length}</div>
                <div className="text-xs text-gray-400">Dreams</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 text-center border border-gray-700/50">
                <div className="text-2xl font-bold text-blue-400">{dreams.filter(d => d.isBookmarked).length}</div>
                <div className="text-xs text-gray-400">Saved</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 text-center border border-gray-700/50">
                <div className="text-2xl font-bold text-green-400">7</div>
                <div className="text-xs text-gray-400">Day Streak</div>
              </div>
            </div>
            
            {/* Emotional Tone Overview */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Dream Insights</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{emotionalData.positive}%</div>
                  <div className="text-xs text-gray-400">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{emotionalData.neutral}%</div>
                  <div className="text-xs text-gray-400">Neutral</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-400">{emotionalData.negative}%</div>
                  <div className="text-xs text-gray-400">Challenging</div>
                </div>
              </div>
            </div>
            
            {dreams.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Dreams</h3>
                  <button 
                    onClick={() => setCurrentScreen('journal')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentDreams.map((dream) => (
                    <div
                      key={dream.id}
                      onClick={() => {
                        setSelectedDream(dream);
                        setCurrentScreen('interpretation');
                      }}
                      className="bg-gray-700/30 rounded-xl p-4 cursor-pointer hover:bg-gray-600/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">{dream.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                            {dream.category}
                          </span>
                          <span className="text-xs text-gray-400">{dream.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs mb-2 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>{dream.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {dream.themes.slice(0, 2).map((theme, index) => (
                            <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                              {theme}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          {dream.isBookmarked && <Heart className="w-3 h-3 text-red-400 fill-current" />}
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-yellow-300">{dream.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentScreen('trends')}
                className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 text-left border border-gray-700/50 hover:bg-gray-700/50 transition-all"
              >
                <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">Trends</h4>
                <p className="text-gray-400 text-xs">View patterns</p>
              </button>
              <button
                onClick={() => setCurrentScreen('journal')}
                className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 text-left border border-gray-700/50 hover:bg-gray-700/50 transition-all"
              >
                <BookOpen className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">Journal</h4>
                <p className="text-gray-400 text-xs">Browse dreams</p>
              </button>
            </div>
            
            {!isAuthenticated && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-2">Unlock Premium Features</h3>
                <p className="text-gray-300 text-sm mb-4">Sign up to sync your dreams across devices and get advanced insights.</p>
                <button
                  onClick={() => setCurrentScreen('auth')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
          <BottomNav activeScreen="home" />
        </div>
      </div>
    );
  }

  // INPUT SCREEN
  if (currentScreen === 'input') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Record Dream</h2>
              <button 
                onClick={() => setTextToSpeech(!textToSpeech)}
                className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
              >
                {textToSpeech ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5 text-gray-300" />}
              </button>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">Describe Your Dream</h3>
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <button
                    onClick={isRecording ? stopRealRecording : startRealRecording}
                    disabled={!audioSupported}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl relative ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse scale-110' 
                        : audioSupported
                        ? 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                    )}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-gray-300 mb-2 font-medium">
                    {isRecording 
                      ? `🎤 ${isListening ? 'Listening' : 'Recording'}... ${formatTime(recordingTimer)}` 
                      : audioSupported 
                      ? 'Tap the microphone to start voice recording'
                      : 'Voice recording not available - please type your dream below'
                    }
                  </p>
                  {isRecording && isListening && (
                    <div className="bg-green-500/20 rounded-xl p-3 border border-green-500/30">
                      <p className="text-green-300 text-sm font-medium">🗣️ Speak now - your words will appear below</p>
                    </div>
                  )}
                  {!audioSupported && (
                    <div className="bg-orange-500/20 rounded-xl p-3 border border-orange-500/30">
                      <p className="text-orange-300 text-sm">💡 Voice recording requires Chrome, Firefox, or Safari</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  placeholder="Type your dream here or use voice recording above...&#10;&#10;💡 Include details like:&#10;• Colors and emotions you felt&#10;• People and places involved&#10;• Any symbols or unusual elements&#10;• The overall atmosphere"
                  disabled={isRecording}
                  rows={8}
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  {dreamText.trim() && (
                    <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                      {dreamText.length} chars
                    </span>
                  )}
                  {dreamText.trim() && !isProcessing && !isRecording && (
                    <button
                      onClick={() => {
                        const textToProcess = dreamText;
                        setDreamText('');
                        generateAdvancedInterpretation(textToProcess);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full transition-all shadow-lg hover:scale-105"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <h4 className="text-blue-300 font-medium mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Recording Tips
              </h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Include emotions and colors you remember</li>
                <li>• Describe the setting and people involved</li>
                <li>• Mention any symbols or unusual elements</li>
                <li>• Note the time and how you felt upon waking</li>
              </ul>
            </div>
            
            {/* Quick Dream Templates */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h4 className="text-white font-medium mb-3">Quick Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Flying Dream', template: 'I was flying through...' },
                  { label: 'Water Dream', template: 'I saw water that was...' },
                  { label: 'Light Vision', template: 'I saw a bright light that...' },
                  { label: 'Voice/Message', template: 'I heard a voice saying...' }
                ].map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setDreamText(template.template)}
                    className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 p-2 rounded-lg transition-colors"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <BottomNav activeScreen="input" />
        </div>
      </div>
    );
  }

  // JOURNAL SCREEN
  if (currentScreen === 'journal') {
    const filteredDreams = getSortedFilteredDreams();
    
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Dream Journal</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                >
                  <Filter className="w-5 h-5 text-gray-300" />
                </button>
                <button onClick={() => setCurrentScreen('search')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                  <Search className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            {/* Filter Controls */}
            {showFilters && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50 space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Filter by Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'bookmarked', 'recent', 'prophetic', 'encouragement'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedFilter === filter
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Sort by</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm"
                  >
                    <option value="date">Date (Newest)</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="confidence">Confidence Score</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {filteredDreams.map((dream) => (
                <div
                  key={dream.id}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 
                        onClick={() => {
                          setSelectedDream(dream);
                          setCurrentScreen('interpretation');
                        }}
                        className="text-lg font-bold text-white cursor-pointer hover:text-blue-300 transition-colors"
                      >
                        {dream.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          {dream.category}
                        </span>
                        <span className="text-sm text-gray-400">{dream.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleBookmark(dream.id)}
                        className="p-2 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${dream.isBookmarked ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(dream.content)}
                        className="p-2 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => deleteDream(dream.id)}
                        className="p-2 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  
                  <p 
                    onClick={() => {
                      setSelectedDream(dream);
                      setCurrentScreen('interpretation');
                    }}
                    className="text-gray-300 mb-4 cursor-pointer overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {dream.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {dream.themes.slice(0, 3).map((theme, index) => (
                        <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-yellow-300">{dream.confidence}%</span>
                      </div>
                      {textToSpeech && (
                        <button
                          onClick={() => speakText(dream.content)}
                          className="p-1 rounded hover:bg-gray-600/50 transition-colors"
                        >
                          <Volume2 className="w-4 h-4 text-blue-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredDreams.length === 0 && (
              <div className="text-center py-12">
                <Moon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No dreams found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'Try different search terms' : 'Start recording your dreams to build your spiritual journal'}
                </p>
                <button 
                  onClick={() => {
                    if (searchQuery) {
                      setSearchQuery('');
                      setSelectedFilter('all');
                    } else {
                      setCurrentScreen('input');
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  {searchQuery ? 'Clear Filters' : 'Record First Dream'}
                </button>
              </div>
            )}
          </div>
          <BottomNav activeScreen="journal" />
        </div>
      </div>
    );
  }

  // TRENDS SCREEN
  if (currentScreen === 'trends') {
    const emotionalData = getEmotionalToneData();
    const categoryData = getCategoryData();
    const recurringSymbols = getRecurringSymbols();

    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Spiritual Insights</h2>
              <button 
                onClick={() => addNotification('Trends exported!', 'success')}
                className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
              >
                <Download className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            {/* Emotional Tone Analysis */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                Emotional Patterns
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-300">Positive Dreams</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-400 transition-all duration-1000"
                        style={{ width: `${emotionalData.positive}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{emotionalData.positive}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300">Neutral Dreams</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all duration-1000"
                        style={{ width: `${emotionalData.neutral}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{emotionalData.neutral}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-300">Challenging Dreams</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-400 transition-all duration-1000"
                        style={{ width: `${emotionalData.negative}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{emotionalData.negative}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 text-sm">
                  💡 Your dreams show a predominantly positive spiritual tone, indicating healthy spiritual growth.
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                Dream Categories
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {categoryData.map(({ category, count }, index) => (
                  <div key={category} className="text-center">
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <div className="text-sm text-gray-400">{category}</div>
                    <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          index === 0 ? 'bg-blue-400' :
                          index === 1 ? 'bg-purple-400' :
                          index === 2 ? 'bg-green-400' :
                          'bg-yellow-400'
                        }`}
                        style={{ width: `${(count / dreams.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring Symbols */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Recurring Symbols
              </h3>
              <div className="space-y-3">
                {recurringSymbols.map(({ symbol, count }, index) => (
                  <div key={symbol} className="flex items-center justify-between">
                    <span className="text-gray-300">{symbol}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 transition-all duration-1000"
                          style={{ width: `${(count / Math.max(...recurringSymbols.map(s => s.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 text-sm">
                  📖 These symbols appear frequently in your dreams and may hold special spiritual significance.
                </p>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-400" />
                Dream Frequency
              </h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-400 mb-2">{day}</div>
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                        index < 3 ? 'bg-green-500/20 text-green-300' : 
                        index < 5 ? 'bg-yellow-500/20 text-yellow-300' : 
                        'bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      {index < 5 ? '1' : '0'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">5</div>
                <div className="text-sm text-gray-400">Dreams this week</div>
              </div>
            </div>

            {/* Spiritual Growth Insights */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                Spiritual Growth Insights
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Your dreams show increasing spiritual sensitivity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Frequent divine symbols suggest active spiritual communication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Balanced emotional themes indicate healthy spiritual growth</span>
                </div>
              </div>
            </div>
          </div>
          <BottomNav activeScreen="trends" />
        </div>
      </div>
    );
  }

  // INTERPRETATION SCREEN
  if (currentScreen === 'interpretation') {
    if (!selectedDream) {
      return (
        <div className="max-w-sm mx-auto bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <p className="text-white">Loading dream...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentScreen('journal')} 
                className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Dream Analysis</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(selectedDream.content + '\n\n' + selectedDream.interpretation)}
                  className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                >
                  <Copy className="w-5 h-5 text-gray-300" />
                </button>
                <button 
                  onClick={() => addNotification('Dream shared!', 'success')}
                  className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Analyzing Your Dream</h3>
                <p className="text-gray-400 text-center max-w-sm mb-4">
                  Our AI is interpreting the biblical symbolism and spiritual meaning...
                </p>
                <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Dream Header */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{selectedDream.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          {selectedDream.category}
                        </span>
                        <span className="text-sm text-gray-400">{selectedDream.date}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-yellow-300">{selectedDream.confidence}% confidence</span>
                        </div>
                        <span className={`text-sm ${
                          selectedDream.emotionalTone === 'Positive' ? 'text-green-400' :
                          selectedDream.emotionalTone === 'Negative' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {selectedDream.emotionalTone}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => toggleBookmark(selectedDream.id)}
                        className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors"
                      >
                        <Heart className={`w-6 h-6 ${selectedDream.isBookmarked ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                      </button>
                      {textToSpeech && (
                        <button
                          onClick={() => speakText(selectedDream.interpretation)}
                          className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors"
                        >
                          <Volume2 className="w-5 h-5 text-blue-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dream Content */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Moon className="w-5 h-5 mr-2 text-blue-400" />
                    Your Dream
                  </h4>
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <p className="text-gray-300 leading-relaxed">{selectedDream.content}</p>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    Spiritual Interpretation
                  </h4>
                  <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                    <p className="text-gray-300 leading-relaxed">{selectedDream.interpretation}</p>
                  </div>
                </div>

                {/* Themes and Symbols */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                      Spiritual Themes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDream.themes.map((theme, index) => (
                        <span key={index} className="text-sm bg-purple-500/20 text-purple-300 px-3 py-2 rounded-full border border-purple-500/30">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>

                  {showSymbols && (
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white flex items-center">
                          <Star className="w-5 h-5 mr-2 text-yellow-400" />
                          Key Symbols
                        </h4>
                        <button 
                          onClick={() => setShowSymbols(!showSymbols)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          {showSymbols ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDream.symbols.map((symbol, index) => (
                          <span key={index} className="text-sm bg-yellow-500/20 text-yellow-300 px-3 py-2 rounded-full border border-yellow-500/30">
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Biblical References */}
                {showBiblicalRefs && selectedDream.biblicalRefs && (
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                        Biblical References
                      </h4>
                      <button 
                        onClick={() => setShowBiblicalRefs(!showBiblicalRefs)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        {showBiblicalRefs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-4">
                      {selectedDream.biblicalRefs.map((ref, index) => (
                        <div key={index} className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-300">{ref.verse}</h5>
                            <button 
                              onClick={() => copyToClipboard(`${ref.verse}: ${ref.text}`)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-gray-300 text-sm mb-2 italic">"{ref.text}"</p>
                          <p className="text-green-200 text-xs">{ref.relevance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setDreamText(selectedDream.content);
                      setCurrentScreen('input');
                    }}
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold py-3 rounded-xl hover:bg-blue-500/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Re-analyze</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('journal')}
                    className="bg-gray-700/50 border border-gray-600 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-600/50 transition-all flex items-center justify-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Back to Journal</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SEARCH SCREEN
  if (currentScreen === 'search') {
    const searchResults = dreams.filter(dream => 
      !searchQuery || 
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dream.symbols.some(symbol => symbol.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('journal')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Search Dreams</h2>
              <div className="w-10 h-10"></div>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dreams, themes, symbols, or content..."
                className="w-full p-4 pl-12 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
                <p className="text-gray-300 text-sm">
                  Found <span className="font-semibold text-white">{searchResults.length}</span> dreams matching "{searchQuery}"
                </p>
              </div>
            )}

            {searchQuery ? (
              <div className="space-y-4">
                {searchResults.map((dream) => (
                  <div
                    key={dream.id}
                    onClick={() => {
                      setSelectedDream(dream);
                      setCurrentScreen('interpretation');
                    }}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 cursor-pointer hover:bg-gray-700/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{dream.title}</h4>
                      <span className="text-xs text-gray-400">{dream.date}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>{dream.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {dream.themes.slice(0, 2).map((theme, index) => (
                          <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                            {theme}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-yellow-300">{dream.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Search Your Dreams</h3>
                <p className="text-gray-500 mb-6">Find dreams by title, content, themes, or symbols</p>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['light', 'water', 'mountain', 'voice', 'flying'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-3 py-1 rounded-full transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PROFILE SCREEN
  if (currentScreen === 'profile') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <NotificationBar />
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Profile</h2>
              <button 
                onClick={() => setCurrentScreen('settings')}
                className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {isAuthenticated ? 'Sophia Carter' : 'Guest User'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">Spiritual Dream Explorer</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{dreams.length}</div>
                  <div className="text-xs text-gray-400">Dreams</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {Math.round(dreams.reduce((sum, d) => sum + d.confidence, 0) / dreams.length || 0)}%
                  </div>
                  <div className="text-xs text-gray-400">Avg Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">14</div>
                  <div className="text-xs text-gray-400">Days Active</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button 
                onClick={() => setCurrentScreen('journal')}
                className="w-full bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:bg-gray-700/50 transition-all flex items-center space-x-3"
              >
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">My Dream Journal</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto rotate-270" />
              </button>
              
              <button 
                onClick={() => setCurrentScreen('trends')}
                className="w-full bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:bg-gray-700/50 transition-all flex items-center space-x-3"
              >
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Spiritual Insights</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto rotate-270" />
              </button>
              
              <button 
                onClick={() => addNotification('Export feature coming soon!', 'info')}
                className="w-full bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 hover:bg-gray-700/50 transition-all flex items-center space-x-3"
              >
                <Download className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Export Dreams</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto rotate-270" />
              </button>
            </div>

            {!isAuthenticated ? (
              <button 
                onClick={() => setCurrentScreen('auth')} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentScreen('home');
                  addNotification('Signed out successfully', 'info');
                }}
                className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-4 rounded-xl hover:bg-red-500/30 transition-all"
              >
                Sign Out
              </button>
            )}

            <div className="text-center pt-4">
              <DreamScrollLogo size={32} className="mx-auto mb-2" />
              <p className="text-gray-500 text-sm">DreamScroll v2.0.0</p>
              <p className="text-gray-600 text-xs">Biblical dream interpretation with AI</p>
            </div>
          </div>
          <BottomNav activeScreen="profile" />
        </div>
      </div>
    );
  }

  // DEFAULT FALLBACK
  return (
    <div className="max-w-sm mx-auto bg-gray-900 min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <DreamScrollLogo size={64} className="mx-auto mb-4" />
        <p>Loading DreamScroll...</p>
      </div>
    </div>
  );
}
