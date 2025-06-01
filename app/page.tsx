'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Book, User, ArrowLeft, Plus, Settings,
  Moon, Sparkles, Brain, Wifi, WifiOff, Download, Share2,
  Search, Filter, Calendar, Clock, Heart, MessageCircle,
  CheckCircle, Star, BookOpen, Volume2, Pause, Play,
  TrendingUp, BarChart3, PieChart, Home, Bell, Globe,
  HelpCircle, Mail, Shield, FileText, LogOut
} from 'lucide-react';

const DreamScrollLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#4A9EFF" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>
          <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" opacity="0.95" />
        <circle cx="25" cy="25" r="1.5" fill="#60A5FA" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="30" r="1" fill="#60A5FA" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M35 20 C35 20, 25 30, 25 50 C25 70, 35 80, 45 80 C40 80, 35 75, 35 50 C35 25, 40 20, 45 20 Z" fill="url(#moonGradient)" />
        <rect x="55" y="35" width="25" height="30" rx="2" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="55" y="35" width="25" height="4" rx="2" fill="#E2E8F0" />
        <line x1="58" y1="45" x2="75" y2="45" stroke="#64748B" strokeWidth="1" opacity="0.8" />
        <line x1="58" y1="50" x2="77" y2="50" stroke="#64748B" strokeWidth="1" opacity="0.8" />
        <line x1="58" y1="55" x2="72" y2="55" stroke="#64748B" strokeWidth="1" opacity="0.8" />
      </svg>
    </div>
  );
};

interface Dream {
  id: number;
  title: string;
  date: string;
  content: string;
  interpretation: string;
  themes: string[];
  mood: string;
  symbols: string[];
  biblicalRefs: { verse: string; text: string; relevance: string }[];
  confidence: number;
  tags: string[];
  isBookmarked: boolean;
  emotionalTone: 'Positive' | 'Neutral' | 'Negative';
  shareId?: string;
}

type ScreenType = 'onboarding' | 'home' | 'input' | 'journal' | 'dreamDetail' | 'interpretation' | 'profile' | 'search' | 'auth' | 'trends' | 'settings';

export default function DreamScrollPWA() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [dreamText, setDreamText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [audioSupported, setAudioSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const recordingIntervalRef = useRef<any>(null);

const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 1,
      title: "The Whispering Woods",
      date: "2025-05-30",
      content: "I found myself in a dense forest, the air thick with a strange, whispering sound. The trees were ancient, their branches intertwined, creating a canopy that filtered the sunlight into dappled patterns on the forest floor. As I walked deeper, the whispering grew louder, seeming to emanate from the trees themselves. I felt a mix of fear and curiosity, drawn to uncover the source of the sound. Suddenly, a path appeared, leading to a clearing where a single, luminous flower bloomed. As I reached for it, the whispering ceased, replaced by a profound sense of peace.",
      interpretation: "This dream may symbolize your journey through the subconscious mind, represented by the dense forest. The whispering could signify the inner voice or intuition, guiding you towards self-discovery. The luminous flower in the clearing might represent a moment of clarity or a realization of inner peace, achieved by confronting and understanding your fears and curiosities.",
      themes: ["Spiritual Journey", "Inner Voice", "Self-Discovery", "Peace"],
      mood: "Mysterious",
      symbols: ["Forest", "Whispering", "Ancient Trees", "Luminous Flower"],
      biblicalRefs: [
        {
          verse: "Psalm 23:3",
          text: "He guides me along the right paths for his name's sake.",
          relevance: "The path appearing represents divine guidance through life's mysteries"
        }
      ],
      confidence: 88,
      tags: ["spiritual", "mystery", "guidance"],
      isBookmarked: true,
      emotionalTone: 'Positive'
    },
    {
      id: 2,
      title: "Flying Over Golden Mountains",
      date: "2025-05-28",
      content: "I was soaring high above magnificent golden mountains that stretched endlessly toward the horizon. The peaks gleamed like burnished gold in the sunlight, and I felt an overwhelming sense of freedom and peace.",
      interpretation: "This dream represents your spiritual ascension and divine calling. The golden mountains symbolize the eternal foundation of God's kingdom.",
      themes: ["Spiritual Elevation", "Divine Freedom", "Heavenly Perspective"],
      mood: "Uplifting",
      symbols: ["Flying", "Golden Mountains", "Sunlight"],
      biblicalRefs: [
        {
          verse: "Isaiah 40:31",
          text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
          relevance: "The flying represents spiritual strength and renewal through faith"
        }
      ],
      confidence: 95,
      tags: ["spiritual", "freedom", "elevation"],
      isBookmarked: false,
      emotionalTone: 'Positive'
    },
    {
      id: 3,
      title: "The Dark Labyrinth",
      date: "2025-05-26",
      content: "I was trapped in a dark maze with no clear exit. The walls seemed to shift and change as I walked, making me feel lost and anxious.",
      interpretation: "This dream reflects feelings of confusion and uncertainty in your waking life. The shifting walls represent changing circumstances.",
      themes: ["Confusion", "Uncertainty", "Challenge"],
      mood: "Anxious",
      symbols: ["Maze", "Dark Walls", "Shifting Paths"],
      biblicalRefs: [
        {
          verse: "Psalm 119:105",
          text: "Your word is a lamp for my feet, a light on my path.",
          relevance: "God's guidance can illuminate the path through confusion"
        }
      ],
      confidence: 82,
      tags: ["challenge", "confusion", "guidance"],
      isBookmarked: false,
      emotionalTone: 'Negative'
    }
  ]);
  
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
      };
      
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      const checkIfInstalled = () => {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
          setIsInstalled(true);
        }
      };
      
      checkIfInstalled();
      
      const checkAudioSupport = async () => {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (SpeechRecognition) {
            setSpeechRecognition(new SpeechRecognition());
            setAudioSupported(true);
          }
        } catch (error) {
          setAudioSupported(false);
        }
      };
      
      checkAudioSupport();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateAdvancedInterpretation = (dreamContent: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const interpretations = [
        {
          interpretation: "Your dream reveals profound spiritual symbolism deeply rooted in biblical imagery. This represents a divine calling and spiritual awakening in your life.",
          themes: ["Spiritual Awakening", "Divine Calling", "Inner Peace"],
          mood: "Spiritually Uplifting",
          symbols: ["Light", "Path", "Voice"],
          biblicalRefs: [
            {
              verse: "John 14:6",
              text: "Jesus answered, 'I am the way and the truth and the life.'",
              relevance: "The path in your dream represents Christ as the way to spiritual truth"
            }
          ],
          confidence: 94,
          emotionalTone: 'Positive' as const
        }
      ];
      
      const randomInterpretation = interpretations[0];
      
      const newDream: Dream = {
        id: dreams.length + 1,
        title: dreamContent.substring(0, 40) + (dreamContent.length > 40 ? "..." : ""),
        date: new Date().toISOString().split('T')[0],
        content: dreamContent,
        tags: randomInterpretation.themes.map(theme => theme.toLowerCase().replace(/\s+/g, '-')),
        isBookmarked: false,
        ...randomInterpretation
      };
      
      setDreams([newDream, ...dreams]);
      setSelectedDream(newDream);
      setIsProcessing(false);
      setCurrentScreen('interpretation');
    }, 3000);
  };

  const startRealRecording = async () => {
    if (!audioSupported) {
      alert('Voice recording not supported in this browser.');
      return;
    }

    try {
      if (speechRecognition) {
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;
        speechRecognition.lang = 'en-US';
        
        let finalTranscript = '';
        
        speechRecognition.onstart = () => {
          setIsRecording(true);
          setIsListening(true);
          setRecordingTimer(0);
          
          recordingIntervalRef.current = setInterval(() => {
            setRecordingTimer(prev => prev + 1);
          }, 1000);
        };
        
        speechRecognition.onresult = (event: any) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          const currentText = finalTranscript + interimTranscript;
          if (currentText.trim()) {
            setDreamText(currentText.trim());
          }
        };
        
        speechRecognition.onend = () => {
          setIsRecording(false);
          setIsListening(false);
          
          if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
          }
          
          if (finalTranscript.trim()) {
            setDreamText(finalTranscript.trim());
          }
        };
        
        speechRecognition.start();
      }
    } catch (error) {
      alert('Voice recording failed. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRealRecording = () => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    setIsRecording(false);
    setIsListening(false);
    setRecordingTimer(0);
  };

  const toggleBookmark = (dreamId: number) => {
    setDreams(dreams.map(dream => 
      dream.id === dreamId 
        ? { ...dream, isBookmarked: !dream.isBookmarked }
        : dream
    ));
  };

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = searchQuery === '' || 
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' ||
      (selectedFilter === 'bookmarked' && dream.isBookmarked) ||
      (selectedFilter === 'recent' && new Date(dream.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesFilter;
  });

  const getDreamFrequencyData = () => {
    const last30Days = Array.from({length: 30}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });
    
    return last30Days.map(date => {
      const dreamCount = dreams.filter(dream => dream.date === date).length;
      return dreamCount;
    });
  };

  const getEmotionalToneData = () => {
    const positive = dreams.filter(d => d.emotionalTone === 'Positive').length;
    const neutral = dreams.filter(d => d.emotionalTone === 'Neutral').length;
    const negative = dreams.filter(d => d.emotionalTone === 'Negative').length;
    const total = dreams.length;
    
    return {
      positive: total > 0 ? Math.round((positive / total) * 100) : 0,
      neutral: total > 0 ? Math.round((neutral / total) * 100) : 0,
      negative: total > 0 ? Math.round((negative / total) * 100) : 0
    };
  };

  const getRecurringSymbols = () => {
    const symbolCounts: { [key: string]: number } = {};
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
      });
    });
    
    return Object.entries(symbolCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([symbol, count]) => ({ symbol, count }));
  };

// NAVIGATION COMPONENT
  const BottomNav = ({ activeScreen }: { activeScreen: string }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50">
      <div className="flex items-center justify-around py-3 px-6 max-w-sm mx-auto">
        <button onClick={() => setCurrentScreen('home')} className={`flex flex-col items-center space-y-1 ${activeScreen === 'home' ? 'text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}>
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => setCurrentScreen('input')} className={`flex flex-col items-center space-y-1 ${activeScreen === 'input' ? 'text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}>
          <Plus className="w-6 h-6" />
          <span className="text-xs">Record</span>
        </button>
        <button onClick={() => setCurrentScreen('trends')} className={`flex flex-col items-center space-y-1 ${activeScreen === 'trends' ? 'text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}>
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs">Trends</span>
        </button>
        <button onClick={() => setCurrentScreen('journal')} className={`flex flex-col items-center space-y-1 ${activeScreen === 'journal' ? 'text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}>
          <BookOpen className="w-6 h-6" />
          <span className="text-xs">Journal</span>
        </button>
        <button onClick={() => setCurrentScreen('profile')} className={`flex flex-col items-center space-y-1 ${activeScreen === 'profile' ? 'text-blue-400' : 'text-gray-400 hover:text-white'} transition-colors`}>
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );

  // ONBOARDING SCREEN
  if (currentScreen === 'onboarding') {
    const onboardingScreens = [
      { title: "Record your dreams", description: "Capture the essence of your dreams with our intuitive recording feature. Speak or type to document every detail, ensuring no dream is forgotten.", icon: <Mic className="w-16 h-16 text-blue-400" /> },
      { title: "Access your journal", description: "Easily revisit your dream journal, where all your recorded dreams are stored. Search, filter, and organize your entries for quick access and reflection.", icon: <BookOpen className="w-16 h-16 text-blue-400" /> },
      { title: "Analyze your trends", description: "Discover patterns and insights in your dreams with our trend analysis tools. Track recurring themes, emotions, and symbols to understand your subconscious better.", icon: <TrendingUp className="w-16 h-16 text-blue-400" /> }
    ];

    const currentOnboardingScreen = onboardingScreens[onboardingStep];

    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex justify-center pt-16 pb-8">
            <div className="flex space-x-2">
              {onboardingScreens.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === onboardingStep ? 'bg-blue-400 w-6' : 'bg-gray-600'}`} />
              ))}
            </div>
          </div>
          <div className="flex-1 px-6 flex flex-col items-center justify-center text-center">
            <div className="mb-8">{currentOnboardingScreen.icon}</div>
            <h1 className="text-3xl font-bold text-white mb-4">{currentOnboardingScreen.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-sm">{currentOnboardingScreen.description}</p>
          </div>
          <div className="p-6 space-y-4">
            {onboardingStep < onboardingScreens.length - 1 ? (
              <button onClick={() => setOnboardingStep(onboardingStep + 1)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-200">Next</button>
            ) : (
              <button onClick={() => setCurrentScreen('auth')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-200">Start recording your first dream</button>
            )}
            {onboardingStep > 0 && (
              <button onClick={() => setOnboardingStep(onboardingStep - 1)} className="w-full text-gray-400 hover:text-white transition-colors">Back</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AUTH SCREEN
  if (currentScreen === 'auth') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen flex flex-col justify-center p-6">
          <div className="text-center mb-8">
            <DreamScrollLogo size={80} className="mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to DreamScroll</h1>
            <p className="text-gray-400">Sign in to access your personal dream journal</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input type="password" className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
              </div>
              <button onClick={() => { setIsAuthenticated(true); setCurrentScreen('home'); }} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-200">Sign In</button>
              <div className="text-center">
                <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">Don't have an account? Sign up</button>
              </div>
            </div>
          </div>
          <button onClick={() => { setIsAuthenticated(false); setCurrentScreen('home'); }} className="w-full text-center text-gray-400 hover:text-white transition-colors">Continue as Guest</button>
        </div>
      </div>
    );
  }

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">DreamScroll</h1>
                <p className="text-gray-400">Good evening, {isAuthenticated ? 'Sophia' : 'Guest'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setCurrentScreen('search')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                  <Search className="w-5 h-5 text-gray-300" />
                </button>
                <button onClick={() => setCurrentScreen('profile')} className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Quick Record</h2>
                <div className="flex items-center space-x-2">
                  {audioSupported && <Mic className="w-4 h-4 text-green-400" />}
                  {!isOnline && <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">Offline</span>}
                </div>
              </div>
              <p className="text-gray-400 mb-4">Record your dream with voice or type it manually</p>
              <button onClick={() => setCurrentScreen('input')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-200">🎤 Start Recording</button>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Dreams</h3>
                <button onClick={() => setCurrentScreen('journal')} className="text-blue-400 hover:text-blue-300 transition-colors text-sm">View All</button>
              </div>
              <div className="space-y-3">
                {dreams.slice(0, 2).map((dream) => (
                  <div key={dream.id} onClick={() => { setSelectedDream(dream); setCurrentScreen('interpretation'); }} className="bg-gray-700/30 rounded-xl p-4 cursor-pointer hover:bg-gray-700/50 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">{dream.title}</h4>
                      <div className="flex items-center space-x-2">
                        {dream.isBookmarked && <Heart className="w-4 h-4 text-red-400 fill-current" />}
                        <span className="text-xs text-gray-400">{dream.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{dream.content.substring(0, 80)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {dream.themes.slice(0, 2).map((theme, index) => (
                          <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{theme}</span>
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
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Record Dream</h2>
              <div className="w-10 h-10"></div>
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
                  placeholder="Type your dream here or use voice recording above..."
                  disabled={isRecording}
                  rows={6}
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
                />
                {dreamText.trim() && !isProcessing && !isRecording && (
                  <button
                    onClick={() => {
                      const textToProcess = dreamText;
                      setDreamText('');
                      generateAdvancedInterpretation(textToProcess);
                    }}
                    className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 p-3 rounded-full transition-all shadow-lg hover:scale-105"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <h4 className="text-blue-300 font-medium mb-2">💡 Recording Tips</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Include emotions and colors you remember</li>
                <li>• Describe the setting and people involved</li>
                <li>• Mention any symbols or unusual elements</li>
              </ul>
            </div>
          </div>
          <BottomNav activeScreen="input" />
        </div>
      </div>
    );
  }

  // TRENDS SCREEN
  if (currentScreen === 'trends') {
    const emotionalData = getEmotionalToneData();
    const frequencyData = getDreamFrequencyData();
    const recurringSymbols = getRecurringSymbols();

    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Trend Analysis</h2>
              <div className="w-10 h-10"></div>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">Frequency</button>
              <button className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg text-sm font-medium">Themes</button>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Dream Frequency</h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{dreams.length}</div>
                  <div className="text-sm text-green-400">Last 30 Days +10%</div>
                </div>
              </div>
              <div className="h-32 flex items-end justify-between space-x-1">
                {frequencyData.slice(-7).map((count, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500/30 rounded-t"
                      style={{ 
                        height: `${Math.max(8, (count / Math.max(...frequencyData)) * 100)}px`,
                        backgroundColor: count > 0 ? '#3B82F6' : '#374151'
                      }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Emotional Tone</h3>
              <div className="text-2xl font-bold text-white mb-4">Positive</div>
              <div className="text-sm text-green-400 mb-6">Last 30 Days +5%</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Positive</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${emotionalData.positive}%` }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">{emotionalData.positive}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Neutral</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${emotionalData.neutral}%` }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">{emotionalData.neutral}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Negative</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${emotionalData.negative}%` }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">{emotionalData.negative}%</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Recurring Symbols</h3>
              <div className="grid grid-cols-2 gap-3">
                {recurringSymbols.map((item, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">
                      {item.symbol === 'Forest' && '🌲'}
                      {item.symbol === 'Flying' && '🕊️'}
                      {item.symbol === 'Golden Mountains' && '⛰️'}
                      {item.symbol === 'Whispering' && '💬'}
                      {item.symbol === 'Ancient Trees' && '🌳'}
                      {item.symbol === 'Luminous Flower' && '🌸'}
                    </div>
                    <div className="text-sm font-medium text-white">{item.symbol}</div>
                    <div className="text-xs text-gray-400">{item.count}x</div>
                  </div>
                ))}
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
      return <div className="max-w-sm mx-auto bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }
    
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Dream Analysis</h2>
              <button className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Analyzing Your Dream</h3>
                <p className="text-gray-400 text-center max-w-sm">Our AI is interpreting the biblical symbolism and spiritual meaning...</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{selectedDream.title}</h3>
                      <p className="text-gray-400 text-sm">{selectedDream.date}</p>
                    </div>
                    <button
                      onClick={() => toggleBookmark(selectedDream.id)}
                      className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors"
                    >
                      <Heart className={`w-6 h-6 ${selectedDream.isBookmarked ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="bg-gray-700/30 rounded-xl p-4 mb-4">
                    <p className="text-gray-300 leading-relaxed">{selectedDream.content}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-300 text-sm font-medium">{selectedDream.confidence}% Confidence</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedDream.emotionalTone === 'Positive' ? 'bg-green-500/20 text-green-300' :
                      selectedDream.emotionalTone === 'Negative' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {selectedDream.emotionalTone}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                    Interpretation
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedDream.interpretation}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Spiritual Themes</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDream.themes.map((theme, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                        {theme}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Mood:</span>
                    <span className="text-blue-300 font-medium">{selectedDream.mood}</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                    Biblical References
                  </h3>
                  <div className="space-y-4">
                    {selectedDream.biblicalRefs.map((ref, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-300 mb-2">{ref.verse}</h4>
                        <p className="text-gray-300 text-sm mb-3 italic">"{ref.text}"</p>
                        <p className="text-gray-400 text-sm">{ref.relevance}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Symbols</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDream.symbols.map((symbol, index) => (
                      <span key={index} className="bg-green-500/20 text-green-300 px-3 py-2 rounded-full text-sm border border-green-500/30">
                        {symbol}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

// JOURNAL SCREEN
  if (currentScreen === 'journal') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Dream Journal</h2>
              <button onClick={() => setCurrentScreen('search')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <Search className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            <div className="flex space-x-2">
              {['all', 'bookmarked', 'recent'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {filteredDreams.map((dream) => (
                <div
                  key={dream.id}
                  onClick={() => {
                    setSelectedDream(dream);
                    setCurrentScreen('interpretation');
                  }}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 cursor-pointer hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{dream.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(dream.id);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${dream.isBookmarked ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                      </button>
                      <span className="text-sm text-gray-400">{dream.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-3">{dream.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {dream.themes.slice(0, 3).map((theme, index) => (
                        <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-yellow-300">{dream.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredDreams.length === 0 && (
              <div className="text-center py-12">
                <Moon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No dreams found</h3>
                <p className="text-gray-500 mb-6">Start recording your dreams to build your spiritual journal</p>
                <button onClick={() => setCurrentScreen('input')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                  Record First Dream
                </button>
              </div>
            )}
          </div>
          <BottomNav activeScreen="journal" />
        </div>
      </div>
    );
  }

  // SEARCH SCREEN
  if (currentScreen === 'search') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
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
                placeholder="Search dreams, themes, or symbols..."
                className="w-full p-4 pl-12 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="space-y-4">
              {filteredDreams.map((dream) => (
                <div
                  key={dream.id}
                  onClick={() => {
                    setSelectedDream(dream);
                    setCurrentScreen('interpretation');
                  }}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 cursor-pointer hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{dream.title}</h3>
                    <span className="text-sm text-gray-400">{dream.date}</span>
                  </div>
                  <p className="text-gray-300 mb-3 line-clamp-2">{dream.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {dream.themes.slice(0, 3).map((theme, index) => (
                      <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {searchQuery && filteredDreams.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching for different keywords or themes</p>
              </div>
            )}
            {!searchQuery && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Search Your Dreams</h3>
                <p className="text-gray-500">Find dreams by title, content, themes, or symbols</p>
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
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <button onClick={() => setCurrentScreen('settings')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <Settings className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{isAuthenticated ? 'Sophia Carter' : 'Guest User'}</h3>
              <p className="text-blue-400 mb-1">Premium</p>
              <p className="text-gray-400 text-sm">Joined 2022</p>
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
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Edit Profile</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Backup & Sync</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Export Dreams</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Help Center</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Contact Us</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              </div>
            </div>
            {!isAuthenticated ? (
              <button onClick={() => setCurrentScreen('auth')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all">
                Sign In / Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentScreen('home');
                }}
                className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-4 rounded-xl hover:bg-red-500/30 transition-all"
              >
                Sign Out
              </button>
            )}
            <div className="text-center pt-4">
              <DreamScrollLogo size={32} className="mx-auto mb-2" />
              <p className="text-gray-500 text-sm">DreamScroll v1.0.0</p>
              <p className="text-gray-600 text-xs">Biblical dream interpretation</p>
            </div>
          </div>
          <BottomNav activeScreen="profile" />
        </div>
      </div>
    );
  }

  // SETTINGS SCREEN
  if (currentScreen === 'settings') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('profile')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <div className="w-10 h-10"></div>
            </div>
          </div>
          <div className="p-6 pb-24">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Edit Profile</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Change Password</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Notifications</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Language</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Help Center</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Contact Us</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Terms of Service</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
                <button className="w-full bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Privacy Policy</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                </button>
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentScreen('home');
                }}
                className="w-full bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center justify-center hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-400 font-semibold">Sign Out</span>
              </button>
            )}
          </div>
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
