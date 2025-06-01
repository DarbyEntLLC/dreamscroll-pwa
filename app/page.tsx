'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Star, Heart, BookOpen, Mic, MicOff, Send, Search, 
  User, Settings, Home, TrendingUp, PlusCircle, ArrowLeft, 
  Sparkles, Brain, Share2, HelpCircle, Mail, Download, 
  Bell, Shield, Globe, FileText, LogOut
} from 'lucide-react';

// Logo Component
const DreamScrollLogo = ({ size = 40, className = "" }) => (
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
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(true); // Skip onboarding for testing
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
  const [selectedDream, setSelectedDream] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Sample Dreams Data
  const [dreams, setDreams] = useState([
    {
      id: 1,
      title: "Golden Mountain Vision",
      content: "I found myself standing at the base of a magnificent golden mountain that seemed to touch the heavens. The peak was shrouded in brilliant white clouds, and I could hear a gentle voice calling my name from above. As I began to climb, each step felt lighter, and my heart filled with an overwhelming sense of peace and purpose. Ancient trees lined the path, their leaves shimmering like precious gems in the divine light.",
      date: "Nov 15, 2024",
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
      isBookmarked: true
    },
    {
      id: 2,
      title: "The Ancient Scroll",
      content: "In my dream, I discovered an ancient scroll hidden within the walls of what appeared to be Solomon's temple. The parchment glowed with a soft, warm light, and as I unrolled it, beautiful Hebrew letters began to appear, writing themselves across the surface. Though I couldn't read Hebrew in waking life, somehow I understood every word. The scroll contained prophecies about restoration and hope for my family lineage.",
      date: "Nov 12, 2024",
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
      isBookmarked: false
    },
    {
      id: 3,
      title: "Storm and Rainbow",
      content: "I was caught in a fierce storm with thunder and lightning all around me. The wind was so strong I could barely stand, and rain poured down like a waterfall. Just when I thought I couldn't endure anymore, the storm suddenly stopped, and the most beautiful rainbow I've ever seen appeared across the entire sky. A gentle dove landed on my shoulder, and I felt an incredible sense of God's faithfulness and promise.",
      date: "Nov 10, 2024",
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
      isBookmarked: true
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
      clearInterval(timerRef.current);
      setRecordingTimer(0);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // Format timer
  const formatTime = (seconds) => {
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
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };
    
    recognitionRef.current.onresult = (event) => {
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
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.start();
  };

  // Dream processing function
  const generateAdvancedInterpretation = async (dreamText) => {
    setIsProcessing(true);
    setCurrentScreen('interpretation');
    
    // Simulate AI processing
    setTimeout(() => {
      const newDream = {
        id: dreams.length + 1,
        title: "Recent Dream Vision",
        content: dreamText,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        themes: ["Spiritual Growth", "Divine Guidance", "Personal Journey"],
        symbols: ["Light", "Path", "Voice"],
        interpretation: "Your dream contains beautiful spiritual symbolism. The elements you described suggest God is speaking to you about upcoming growth and transformation in your spiritual journey. Pay attention to the emotions and colors in your dream, as they often carry significant meaning about your current spiritual state and God's intentions for your future.",
        biblicalRefs: [
          {
            verse: "Psalm 119:105",
            text: "Your word is a lamp for my feet, a light on my path.",
            relevance: "God provides guidance and illumination for our spiritual journey."
          }
        ],
        emotionalTone: "Positive",
        mood: "Peaceful",
        confidence: 85,
        isBookmarked: false
      };
      
      setDreams(prev => [newDream, ...prev]);
      setSelectedDream(newDream);
      setIsProcessing(false);
    }, 3000);
  };

  // Helper functions
  const toggleBookmark = (dreamId) => {
    setDreams(prev => prev.map(dream => 
      dream.id === dreamId 
        ? { ...dream, isBookmarked: !dream.isBookmarked }
        : dream
    ));
  };

  const filteredDreams = dreams.filter(dream => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'bookmarked' && dream.isBookmarked) ||
      (selectedFilter === 'recent' && new Date(dream.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    const matchesSearch = !searchQuery || 
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

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

  const getDreamFrequencyData = () => {
    return [2, 1, 3, 0, 1, 2, 1];
  };

  const getRecurringSymbols = () => {
    const symbolCounts = {};
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
      });
    });
    
    return Object.entries(symbolCounts)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  // Bottom Navigation Component
  const BottomNav = ({ activeScreen }) => (
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
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
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
              <button className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <Bell className="w-5 h-5 text-gray-300" />
              </button>
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
                  {dreams.slice(0, 2).map((dream) => (
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
                        <span className="text-xs text-gray-400">{dream.date}</span>
                      </div>
                      <p className="text-gray-300 text-xs line-clamp-2 mb-2">{dream.content}</p>
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

  // All other screens - JOURNAL, TRENDS, INTERPRETATION, SEARCH, PROFILE, SETTINGS
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
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Dream Frequency</h3>
              <div className="text-center py-8">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Record more dreams to see trends</p>
              </div>
            </div>
          </div>
          <BottomNav activeScreen="trends" />
        </div>
      </div>
    );
  }

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
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <h4 className="text-blue-300 font-medium mb-2">Interpretation</h4>
                  <p className="text-gray-300 text-sm">{selectedDream.interpretation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Search Your Dreams</h3>
              <p className="text-gray-500">Find dreams by title, content, themes, or symbols</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'profile') {
    return (
      <div className="max-w-sm mx-auto bg-gray-900 min-h-screen">
        <div className="min-h-screen">
          <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center hover:bg-gray-600/50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-white">Profile</h2>
              <div className="w-10 h-10"></div>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{isAuthenticated ? 'Sophia Carter' : 'Guest User'}</h3>
              <p className="text-gray-400 text-sm">Welcome to DreamScroll</p>
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
