'use client';

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

// Import our new components
import { DreamScrollLogo } from '@/components/ui/DreamScrollLogo';
import { NotificationBar } from '@/components/ui/NotificationBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { Dream, Notification, UserProfile } from '@/lib/types';

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
  const extractDreamTitle = (text: string) => {
    const words = text.split(' ').slice(0, 4);
    return words.join(' ') + (text.split(' ').length > 4 ? '...' : '');
  };
  const generateThemes = (text: string) => {
    const themes = ["Spiritual Growth", "Divine Guidance", "Personal Journey"];
    return themes.slice(0, Math.floor(Math.random() * 2) + 1);
  };
  const extractSymbols = (text: string) => {
    const commonSymbols = ["Light", "Water", "Mountain", "Tree"];
    return commonSymbols.slice(0, Math.floor(Math.random() * 2) + 1);
  };
  const generateInterpretation = (text: string) => {
    return "Your dream contains meaningful spiritual symbolism that suggests divine guidance and growth in your spiritual journey.";
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
  const analyzeEmotionalTone = (text: string) => 'Positive';
  const analyzeMood = (text: string) => 'Contemplative';
  const categorize = (text: string) => {
    const categories = ['Prophetic', 'Encouragement', 'Spiritual Life'];
    return categories[Math.floor(Math.random() * categories.length)];
  };
  const generateTags = (text: string) => ['spiritual', 'guidance'];

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

  // --- AUTH SCREEN ---
  if (currentScreen === 'auth') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center p-8">
            <div className="text-center mb-8">
              <DreamScrollLogo size={60} className="mx-auto mb-4" />
              <h1 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-2`}>
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className={themeClasses.textMuted}>
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
                className={`w-full p-4 rounded-xl ${themeClasses.inputBackground} border ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
              />
              <input
                type="password"
                placeholder="Password"
                className={`w-full p-4 rounded-xl ${themeClasses.inputBackground} border ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
              />
              {authMode === 'signup' && (
                <input
                  type="password"
                  placeholder="Confirm password"
                  className={`w-full p-4 rounded-xl ${themeClasses.inputBackground} border ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                />
              )}
            </div>
            {authMode === 'signin' && (
              <button
                onClick={() => addNotification('Password reset feature coming soon!', 'info')}
                className="w-full text-blue-400 hover:text-blue-300 text-sm mb-4 transition-all"
              >
                Forgot password?
              </button>
            )}
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
              className="w-full text-sm text-blue-300 mt-2"
            >
              {authMode === 'signin'
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
          <div className="p-8">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`w-full ${themeClasses.textMuted} hover:${themeClasses.textSecondary} py-2 transition-all`}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- HOME SCREEN ---
  if (currentScreen === 'home') {
    const recentDreams = dreams.slice(0, 2);
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DreamScrollLogo size={40} />
                <span className={`font-bold text-xl ${themeClasses.textPrimary}`}>DreamScroll</span>
              </div>
              <button
                onClick={() => setDarkMode(d => !d)}
                className="p-2 rounded-full bg-gray-700/40 hover:bg-gray-600 transition-all"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
            </div>
            <div className="mb-8">
              <div className={`text-xl font-semibold mb-1 ${themeClasses.textPrimary}`}>
                Welcome, {userProfile.name.split(' ')[0]}!
              </div>
              <div className={themeClasses.textMuted}>
                Ready to record and explore your spiritual dreams?
              </div>
            </div>
            <div className="mb-6">
              <button
                onClick={() => setCurrentScreen('input')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl font-bold shadow-lg text-lg flex items-center justify-center gap-2 transition-all"
              >
                <PlusCircle className="w-6 h-6" /> Record a New Dream
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${themeClasses.textSecondary}`}>Recent Dreams</span>
                <button
                  onClick={() => setCurrentScreen('journal')}
                  className="text-sm text-blue-400 hover:text-blue-200"
                >
                  See All
                </button>
              </div>
              <div className="space-y-4">
                {recentDreams.map(dream => (
                  <div
                    key={dream.id}
                    className={`rounded-xl p-4 border ${themeClasses.cardBackground} ${themeClasses.cardBorder} flex flex-col gap-1 cursor-pointer`}
                    onClick={() => {
                      setSelectedDream(dream);
                      setCurrentScreen('interpretation');
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark
                        className={`w-4 h-4 mr-1 ${dream.isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
                        onClick={e => {
                          e.stopPropagation();
                          toggleBookmark(dream.id);
                        }}
                      />
                      <span className={`font-semibold ${themeClasses.textPrimary}`}>{dream.title}</span>
                      <span className="ml-auto text-xs text-gray-400">{dream.date}</span>
                    </div>
                    <div className={`${themeClasses.textSecondary} text-sm truncate`}>
                      {dream.content}
                    </div>
                  </div>
                ))}
                {recentDreams.length === 0 && (
                  <div className="py-8 text-center text-gray-400">No dreams recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <BottomNav activeScreen="home" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }

  // --- INPUT SCREEN ---
  if (currentScreen === 'input') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="mb-8 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <div className="mb-4">
              <h2 className={`text-xl font-semibold mb-1 ${themeClasses.textPrimary}`}>Record a New Dream</h2>
              <p className={themeClasses.textMuted}>Type or speak your dream below. The AI will help interpret it!</p>
            </div>
            <textarea
              className={`w-full mt-3 p-4 rounded-xl h-36 resize-none border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
              placeholder="Describe your dream in detail..."
              value={dreamText}
              onChange={e => setDreamText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-3">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isRecording ? 'bg-red-500 text-white' : themeClasses.buttonSecondary
                }`}
                onClick={isRecording ? stopRealRecording : startRealRecording}
                disabled={!audioSupported}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isRecording ? 'Stop Recording' : 'Record Audio'}
                {isRecording && <span className="ml-2 text-sm font-mono">{formatTime(recordingTimer)}</span>}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all"
                onClick={() => {
                  if (!dreamText.trim()) {
                    addNotification('Please enter or record a dream first.', 'error');
                    return;
                  }
                  generateAdvancedInterpretation(dreamText);
                  setDreamText('');
                }}
                disabled={isProcessing}
              >
                <Sparkles className="w-5 h-5" /> Interpret Dream
              </button>
            </div>
          </div>
        </div>
        <BottomNav activeScreen="input" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }
  
  // --- JOURNAL SCREEN ---
  if (currentScreen === 'journal') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Home
            </button>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-xl font-semibold mb-1 ${themeClasses.textPrimary}`}>Dream Journal</h2>
              <button
                onClick={() => setCurrentScreen('input')}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" /> New
              </button>
            </div>
            <div className="space-y-4">
              {dreams.length === 0 && (
                <div className="py-8 text-center text-gray-400">No dreams recorded yet.</div>
              )}
              {dreams.map(dream => (
                <div
                  key={dream.id}
                  className={`rounded-xl p-4 border ${themeClasses.cardBackground} ${themeClasses.cardBorder} flex flex-col gap-1 cursor-pointer`}
                  onClick={() => {
                    setSelectedDream(dream);
                    setCurrentScreen('interpretation');
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bookmark
                      className={`w-4 h-4 mr-1 ${dream.isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
                      onClick={e => {
                        e.stopPropagation();
                        toggleBookmark(dream.id);
                      }}
                    />
                    <span className={`font-semibold ${themeClasses.textPrimary}`}>{dream.title}</span>
                    <span className="ml-auto text-xs text-gray-400">{dream.date}</span>
                  </div>
                  <div className={`${themeClasses.textSecondary} text-sm truncate`}>
                    {dream.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {dream.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BottomNav activeScreen="journal" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }

  // --- TRENDS SCREEN ---
  if (currentScreen === 'trends') {
    // Simple trends visualization mockup
    const tagCounts: Record<string, number> = {};
    dreams.forEach(dream => dream.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }));
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Home
            </button>
            <div className="mb-4">
              <h2 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>Spiritual Dream Trends</h2>
              <p className={themeClasses.textMuted}>See which themes are most common in your dreams.</p>
            </div>
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Most Frequent Tags</h3>
                {sortedTags.length === 0 ? (
                  <div className="text-gray-400">No dream tags yet.</div>
                ) : (
                  <div className="space-y-2">
                    {sortedTags.map(([tag, count]) => (
                      <div key={tag} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-300 bg-blue-700/40 px-2 py-0.5 rounded">{tag}</span>
                        <div className="flex-1 bg-gray-700/40 rounded h-2 mx-2">
                          <div
                            className="bg-blue-400 rounded h-2"
                            style={{ width: `${Math.min(90, count * 30)}px` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <BottomNav activeScreen="trends" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }

  // --- INTERPRETATION SCREEN ---
  if (currentScreen === 'interpretation') {
    const dream = selectedDream || dreams[0];
    if (!dream) {
      return (
        <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen flex items-center justify-center`}>
          <NotificationBar notifications={notifications} removeNotification={removeNotification} />
          <div className="text-center">
            <p className="text-gray-400">No dream selected.</p>
            <button
              onClick={() => setCurrentScreen('journal')}
              className="mt-6 text-blue-400"
            >
              Go to Journal
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('journal')}
              className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Journal
            </button>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{dream.title}</h2>
              <Bookmark
                className={`w-6 h-6 cursor-pointer ${dream.isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={() => toggleBookmark(dream.id)}
                {dream.isBookmarked ? "Remove bookmark" : "Bookmark"}
              />
            </div>
            <div className={`${themeClasses.cardBackground} rounded-xl p-4 border ${themeClasses.cardBorder}`}>
              <div className="mb-3 text-sm text-gray-400">{dream.date}</div>
              <div className="mb-4 whitespace-pre-line">{dream.content}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {dream.tags.map(tag => (
                  <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg">{tag}</span>
                ))}
              </div>
              <div className="mb-4">
                <div className="flex gap-4 mb-2">
                  <span className="text-xs text-gray-400">Mood: <span className="font-semibold text-blue-300">{dream.mood}</span></span>
                  <span className="text-xs text-gray-400">Confidence: <span className="font-semibold text-green-400">{dream.confidence}%</span></span>
                </div>
                <div className="flex gap-4 mb-2">
                  <span className="text-xs text-gray-400">Category: <span className="font-semibold text-purple-300">{dream.category}</span></span>
                  <span className="text-xs text-gray-400">Emotional Tone: <span className="font-semibold text-pink-300">{dream.emotionalTone}</span></span>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-blue-400 mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> AI Interpretation
                </div>
                <div className="text-sm whitespace-pre-line">{dream.interpretation}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-purple-400 mb-1 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Biblical References
                </div>
                {dream.biblicalRefs.map((ref, i) => (
                  <div key={i} className="mb-2 p-2 rounded bg-purple-950/40 border border-purple-800 text-xs">
                    <div className="font-semibold text-purple-300">{ref.verse}</div>
                    <div className="italic text-gray-300">{ref.text}</div>
                    <div className="text-gray-400">{ref.relevance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // --- SEARCH SCREEN ---
  if (currentScreen === 'search') {
    const filteredDreams = dreams.filter(dream =>
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Home
            </button>
            <div className="mb-4">
              <h2 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>Search Dreams</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                  placeholder="Search by keyword, tag, or content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              {filteredDreams.length === 0 && (
                <div className="text-gray-400 text-center py-8">No dreams found for your search.</div>
              )}
              {filteredDreams.map(dream => (
                <div
                  key={dream.id}
                  className={`rounded-xl p-4 border ${themeClasses.cardBackground} ${themeClasses.cardBorder} flex flex-col gap-1 cursor-pointer`}
                  onClick={() => {
                    setSelectedDream(dream);
                    setCurrentScreen('interpretation');
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bookmark
                      className={`w-4 h-4 mr-1 ${dream.isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
                      onClick={e => {
                        e.stopPropagation();
                        toggleBookmark(dream.id);
                      }}
                    />
                    <span className={`font-semibold ${themeClasses.textPrimary}`}>{dream.title}</span>
                    <span className="ml-auto text-xs text-gray-400">{dream.date}</span>
                  </div>
                  <div className={`${themeClasses.textSecondary} text-sm truncate`}>
                    {dream.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {dream.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PROFILE SCREEN ---
  if (currentScreen === 'profile') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${themeClasses.textPrimary}`}>Profile</h2>
              <button
                onClick={() => setIsEditingProfile(e => !e)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" /> {isEditingProfile ? "Cancel" : "Edit"}
              </button>
            </div>
            {!isEditingProfile ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center">
                    {userProfile.profileImage ? (
                      <img src={userProfile.profileImage} alt="Profile" className="rounded-full w-20 h-20 object-cover" />
                    ) : (
                      <User className="text-white w-10 h-10" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{userProfile.name}</div>
                  <div className="text-blue-400">{userProfile.subtitle}</div>
                  <div className="text-xs text-gray-400 mt-1">LLM: {userProfile.selectedLLM}</div>
                </div>
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <button
                    onClick={() => setCurrentScreen('auth')}
                    className="w-full text-red-400 border border-red-400 hover:bg-red-400/20 py-2 rounded-xl font-semibold"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center border-4 border-blue-300 hover:opacity-80 transition-all"
                  >
                    {userProfile.profileImage ? (
                      <img src={userProfile.profileImage} alt="Profile" className="rounded-full w-20 h-20 object-cover" />
                    ) : (
                      <Camera className="text-white w-8 h-8" />
                    )}
                  </button>
                  <span className="text-xs text-gray-400 mt-1">Tap to change photo</span>
                </div>
                <input
                  type="text"
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                  value={userProfile.name}
                  onChange={e => setUserProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="Name"
                />
                <input
                  type="text"
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                  value={userProfile.subtitle}
                  onChange={e => setUserProfile(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Subtitle"
                />
                <select
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} focus:outline-none focus:border-blue-500`}
                  value={userProfile.selectedLLM}
                  onChange={e => setUserProfile(p => ({ ...p, selectedLLM: e.target.value }))}
                >
                  <option value="GPT-4">GPT-4</option>
                  <option value="Claude 3">Claude 3</option>
                  <option value="Gemini 1.5">Gemini 1.5</option>
                </select>
                <button
                  onClick={saveProfile}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>
        </div>
        <BottomNav activeScreen="profile" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }

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
