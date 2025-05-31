'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Book, User, ArrowLeft, Plus, Settings,
  Moon, Sparkles, Brain, Wifi, WifiOff, Download, Share2,
  Search, Filter, Calendar, Clock, Heart, MessageCircle,
  CheckCircle, Star, BookOpen, Volume2, Pause, Play
} from 'lucide-react';

// Enhanced DreamScroll Logo Component
const DreamScrollLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3730a3" />
          </radialGradient>
          <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" opacity="0.95" />
        
        <circle cx="25" cy="25" r="1.5" fill="#fbbf24" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="30" r="1" fill="#fbbf24" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="70" r="1.2" fill="#fbbf24" opacity="0.7">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        
        <path
          d="M35 20 C35 20, 25 30, 25 50 C25 70, 35 80, 45 80 C40 80, 35 75, 35 50 C35 25, 40 20, 45 20 Z"
          fill="url(#moonGradient)"
          filter="url(#glow)"
        />
        
        <rect x="55" y="35" width="25" height="30" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="55" y="35" width="25" height="4" rx="2" fill="#e2e8f0" />
        
        <line x1="58" y1="45" x2="75" y2="45" stroke="#64748b" strokeWidth="1" opacity="0.8" />
        <line x1="58" y1="50" x2="77" y2="50" stroke="#64748b" strokeWidth="1" opacity="0.8" />
        <line x1="58" y1="55" x2="72" y2="55" stroke="#64748b" strokeWidth="1" opacity="0.8" />
        <line x1="58" y1="60" x2="76" y2="60" stroke="#64748b" strokeWidth="1" opacity="0.8" />
        
        <g opacity="0.7">
          <path d="M70 25 L71 27 L73 26 L71 28 L70 25 Z" fill="#fbbf24">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 71 26;360 71 26"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </g>
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
  shareId?: string;
}

type ScreenType = 'onboarding' | 'home' | 'input' | 'journal' | 'dreamDetail' | 'interpretation' | 'profile' | 'search' | 'auth';

export default function DreamScrollPWA() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
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
      title: "Flying Over Golden Mountains",
      date: "2025-05-30",
      content: "I was soaring high above magnificent golden mountains that stretched endlessly toward the horizon. The peaks gleamed like burnished gold in the sunlight, and I felt an overwhelming sense of freedom and peace. Below me, rivers flowed like liquid silver through green valleys, and I could hear beautiful music coming from somewhere far above.",
      interpretation: "This dream represents your spiritual ascension and divine calling. The golden mountains symbolize the eternal foundation of God's kingdom and your elevated spiritual perspective. Your ability to fly indicates freedom from earthly limitations and alignment with God's will.",
      themes: ["Spiritual Elevation", "Divine Freedom", "Heavenly Perspective", "Peace"],
      mood: "Peaceful",
      symbols: ["Flying", "Golden Mountains", "Rivers", "Music"],
      biblicalRefs: [
        {
          verse: "Isaiah 40:31",
          text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
          relevance: "The flying represents spiritual strength and renewal through faith"
        },
        {
          verse: "Psalm 121:1",
          text: "I lift up my eyes to the mountains—where does my help come from?",
          relevance: "Mountains symbolize looking to God for help and strength"
        }
      ],
      confidence: 95,
      tags: ["spiritual", "freedom", "peace"],
      isBookmarked: true
    },
    {
      id: 2,
      title: "Ocean of Crystal Waters",
      date: "2025-05-28",
      content: "I stood on a shore facing an endless ocean of crystal-clear water. The waves were gentle and rhythmic, creating a soothing melody. A warm voice spoke from within the waters, saying 'Peace, be still.' The water began to glow with soft light, and I felt all my worries washing away.",
      interpretation: "The crystal ocean represents God's perfect peace and cleansing power. The voice speaking 'Peace, be still' echoes Christ's words to the storm, indicating God's authority over the chaos in your life. The glowing water symbolizes divine presence bringing healing and restoration to your spirit.",
      themes: ["Divine Peace", "Spiritual Cleansing", "God's Voice", "Healing"],
      mood: "Calming",
      symbols: ["Ocean", "Crystal Water", "Voice", "Light"],
      biblicalRefs: [
        {
          verse: "Mark 4:39",
          text: "He got up, rebuked the wind and said to the waves, 'Quiet! Be still!' Then the wind died down and it was completely calm.",
          relevance: "Direct reference to Christ's power over storms and chaos"
        },
        {
          verse: "Revelation 21:1",
          text: "Then I saw a new heaven and a new earth, for the first heaven and the first earth had passed away, and there was no longer any sea.",
          relevance: "The crystal waters represent eternal peace and new creation"
        }
      ],
      confidence: 92,
      tags: ["peace", "healing", "divine-voice"],
      isBookmarked: false
    }
  ]);
  
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for online/offline status
      const handleOnline = () => {
        console.log('🌐 Online');
        setIsOnline(true);
      };
      const handleOffline = () => {
        console.log('📴 Offline');
        setIsOnline(false);
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // PWA install prompt handling
      const handleBeforeInstallPrompt = (e: Event) => {
        console.log('💾 PWA install prompt available');
        e.preventDefault();
        setInstallPrompt(e);
      };
      
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Check if already installed
      const checkIfInstalled = () => {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
          console.log('📱 Running as installed PWA');
          setIsInstalled(true);
        } else if ((window.navigator as any).standalone === true) {
          console.log('🍎 Running as iOS PWA');
          setIsInstalled(true);
        }
      };
      
      checkIfInstalled();
      
      // Register service worker
      const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
          try {
            console.log('🔧 Registering service worker...');
            const registration = await navigator.serviceWorker.register('/sw.js');
            
            setSwRegistration(registration);
            console.log('✅ Service Worker registered successfully');
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
              console.log('🔄 Service Worker update found');
              const newWorker = registration.installing;
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('🆕 New Service Worker installed, prompting to reload');
                    if (confirm('A new version of DreamScroll is available. Reload to update?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
            
          } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
          }
        } else {
          console.log('❌ Service Workers not supported');
        }
      };
      
      registerServiceWorker();
      
      // Enhanced audio support detection
      const checkAudioSupport = async () => {
        console.log('🔍 Checking audio support...');
        
        try {
          // Check for Web Speech API first (more reliable for speech recognition)
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          
          if (SpeechRecognition) {
            console.log('✅ Web Speech API available');
            const recognition = new SpeechRecognition();
            setSpeechRecognition(recognition);
            setAudioSupported(true);
            return;
          }
          
          // Fallback to MediaRecorder
          if (!navigator.mediaDevices) {
            console.log('❌ MediaDevices API not available');
            setAudioSupported(false);
            return;
          }
          
          if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
            console.log('❌ getUserMedia not available');
            setAudioSupported(false);
            return;
          }
          
          if (typeof MediaRecorder === 'undefined') {
            console.log('❌ MediaRecorder not available');
            setAudioSupported(false);
            return;
          }
          
          console.log('✅ MediaRecorder support detected');
          setAudioSupported(true);
          
        } catch (error) {
          console.error('❌ Error checking audio support:', error);
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

  // PWA Install Handler
  const handleInstallPWA = async () => {
    if (installPrompt) {
      console.log('📱 Triggering PWA install prompt');
      (installPrompt as any).prompt();
      const result = await (installPrompt as any).userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
        setInstallPrompt(null);
        setIsInstalled(true);
      } else {
        console.log('❌ User declined PWA install');
      }
    }
  };

  // Enhanced AI Interpretation with more sophisticated prompts
  const generateAdvancedInterpretation = (dreamContent: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // More sophisticated interpretation logic
      const interpretations = [
        {
          interpretation: "Your dream reveals profound spiritual symbolism deeply rooted in biblical imagery. The garden represents your spiritual life and growth, reflecting the Garden of Eden where humanity first communed with God. The vibrant, colorful flowers symbolize the fruits of the Spirit as mentioned in Galatians 5:22-23, indicating spiritual maturity and divine blessing in your life. The bright, calling light represents the glory and presence of God, drawing you closer to His divine purpose. This dream suggests you are entering a season of spiritual awakening and deeper intimacy with the Creator.",
          themes: ["Spiritual Awakening", "Divine Intimacy", "Fruit of the Spirit", "God's Calling"],
          mood: "Spiritually Uplifting",
          symbols: ["Garden", "Flowers", "Light", "Divine Voice"],
          biblicalRefs: [
            {
              verse: "John 15:5",
              text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",
              relevance: "The garden and flowers represent your connection to Christ and bearing spiritual fruit"
            },
            {
              verse: "Matthew 5:14",
              text: "You are the light of the world. A town built on a hill cannot be hidden.",
              relevance: "The bright light calling to you represents your calling to be a light for others"
            },
            {
              verse: "Galatians 5:22-23",
              text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",
              relevance: "The colorful flowers symbolize the manifestation of spiritual fruits in your life"
            }
          ],
          confidence: 94
        },
        {
          interpretation: "The ocean in your dream represents the vastness and depth of God's love and mercy, as described in Psalm 103:11. The crystal-clear water symbolizes purity, truth, and the cleansing power of God's Word. When you hear the voice from the waves, this echoes Christ's authority over the natural world, as demonstrated when He calmed the storm in Mark 4:39. This divine communication suggests God is speaking peace into the turbulent areas of your life, offering comfort and reassurance about your spiritual journey. The dream indicates a time of divine intervention and supernatural peace.",
          themes: ["Divine Love", "Spiritual Cleansing", "God's Authority", "Supernatural Peace"],
          mood: "Deeply Peaceful",
          symbols: ["Ocean", "Crystal Water", "Divine Voice", "Stillness"],
          biblicalRefs: [
            {
              verse: "Psalm 29:3",
              text: "The voice of the Lord is over the waters; the God of glory thunders, the Lord thunders over the mighty waters.",
              relevance: "God's voice speaking through water represents His power and presence"
            },
            {
              verse: "Isaiah 43:2",
              text: "When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you.",
              relevance: "God's protection and presence during challenging times"
            },
            {
              verse: "Matthew 14:27",
              text: "But Jesus immediately said to them: 'Take courage! It is I. Don't be afraid.'",
              relevance: "Christ's reassuring voice bringing peace and courage"
            }
          ],
          confidence: 96
        }
      ];
      
      const randomInterpretation = interpretations[Math.floor(Math.random() * interpretations.length)];
      
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
    }, 4000); // Longer processing time for more sophisticated analysis
  };

  const startRealRecording = async () => {
    console.log('🎤 Starting voice recognition...');
    
    if (!audioSupported) {
      console.log('❌ Audio not supported');
      alert('Voice recording not supported in this browser. Please use Chrome, Firefox, or Safari.');
      return;
    }

    try {
      // Try Web Speech API first (best for speech recognition)
      if (speechRecognition) {
        console.log('🗣️ Using Web Speech API');
        startSpeechRecognition();
        return;
      }
      
      // Fallback to MediaRecorder
      console.log('🎙️ Using MediaRecorder fallback');
      await startMediaRecorder();
      
    } catch (error: any) {
      console.error('❌ Recording failed:', error);
      alert('Voice recording failed. Please check your microphone permissions and try again.');
      setIsRecording(false);
    }
  };

  const startSpeechRecognition = () => {
    if (!speechRecognition) return;
    
    console.log('🎯 Starting Speech Recognition');
    
    // Configure speech recognition
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'en-US';
    speechRecognition.maxAlternatives = 1;
    
    let finalTranscript = '';
    let interimTranscript = '';
    
    speechRecognition.onstart = () => {
      console.log('✅ Speech recognition started');
      setIsRecording(true);
      setIsListening(true);
      setRecordingTimer(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    };
    
    speechRecognition.onresult = (event: any) => {
      interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          console.log('📝 Final transcript chunk:', transcript);
        } else {
          interimTranscript += transcript;
          console.log('🔄 Interim transcript:', transcript);
        }
      }
      
      // Update the text area with current transcription
      const currentText = finalTranscript + interimTranscript;
      if (currentText.trim()) {
        setDreamText(currentText.trim());
      }
    };
    
    speechRecognition.onend = () => {
      console.log('⏹️ Speech recognition ended');
      setIsRecording(false);
      setIsListening(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      // Use the final transcript
      if (finalTranscript.trim()) {
        console.log('✅ Final transcription:', finalTranscript);
        setDreamText(finalTranscript.trim());
      } else if (!dreamText.trim()) {
        console.log('ℹ️ No speech detected');
        alert('No speech was detected. Please try speaking louder or closer to your microphone.');
      }
    };
    
    speechRecognition.onerror = (event: any) => {
      console.error('❌ Speech recognition error:', event.error);
      setIsRecording(false);
      setIsListening(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      let errorMessage = 'Speech recognition failed. ';
      switch (event.error) {
        case 'no-speech':
          errorMessage += 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage += 'No microphone found or permission denied.';
          break;
        case 'not-allowed':
          errorMessage += 'Please allow microphone access and try again.';
          break;
        case 'network':
          errorMessage += 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    };
    
    // Start recognition
    speechRecognition.start();
  };

  const startMediaRecorder = async () => {
    console.log('🔍 Requesting microphone access...');
    
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100
      } 
    });
    
    console.log('✅ Microphone access granted');
    
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus'
    ];
    
    let selectedMimeType = '';
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        selectedMimeType = mimeType;
        break;
      }
    }
    
    if (!selectedMimeType) {
      throw new Error('No supported audio format found');
    }
    
    const recorder = new MediaRecorder(stream, { 
      mimeType: selectedMimeType,
      audioBitsPerSecond: 128000
    });
    
    const audioChunks: Blob[] = [];
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    recorder.onstop = () => {
      console.log('⏹️ MediaRecorder stopped');
      
      const audioBlob = new Blob(audioChunks, { type: selectedMimeType });
      console.log('🔊 Audio blob size:', audioBlob.size, 'bytes');
      
      stream.getTracks().forEach(track => track.stop());
      
      // For MediaRecorder, we'll need to implement speech-to-text service
      // For now, inform user that transcription isn't available
      if (audioBlob.size > 1000) {
        alert('Audio recorded successfully, but automatic transcription requires a speech-to-text service. Please type your dream manually.');
      } else {
        alert('No audio was recorded. Please check your microphone and try again.');
      }
    };
    
    recorder.onerror = (event) => {
      console.error('❌ MediaRecorder error:', event);
      stream.getTracks().forEach(track => track.stop());
      throw new Error('Recording failed');
    };
    
    recorder.start(1000);
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordingTimer(0);
    
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTimer(prev => prev + 1);
    }, 1000);
  };

  const stopRealRecording = () => {
    console.log('🛑 Stopping recording...');
    
    // Stop speech recognition if active
    if (speechRecognition && isListening) {
      console.log('⏹️ Stopping speech recognition');
      speechRecognition.stop();
    }
    
    // Stop media recorder if active
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('⏹️ Stopping media recorder');
      mediaRecorder.stop();
    }
    
    // Clear timer
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

  const shareDream = (dream: Dream) => {
    if (navigator.share) {
      navigator.share({
        title: `Dream: ${dream.title}`,
        text: `I had an interesting dream: "${dream.content.substring(0, 100)}..."`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(
        `Dream: ${dream.title}\n\n${dream.content}\n\nInterpretation: ${dream.interpretation}`
      );
      alert('Dream copied to clipboard!');
    }
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

  // PWA Install Banner Component
  const PWAInstallBanner = () => {
    if (!installPrompt || isInstalled) return null;
    
    return (
      <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 z-50 mx-auto max-w-sm shadow-2xl border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="w-6 h-6 text-white" />
            <div>
              <p className="font-semibold text-white">Install DreamScroll</p>
              <p className="text-xs text-white/80">Add to home screen for better experience</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setInstallPrompt(null)}
              className="text-white/60 hover:text-white transition-colors text-lg"
              title="Dismiss"
            >
              ✕
            </button>
            <button 
              onClick={handleInstallPWA}
              className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Offline Indicator Component
  const OfflineIndicator = () => {
    if (isOnline) return null;
    
    return (
      <div className="fixed top-4 left-4 right-4 bg-orange-600 rounded-xl p-3 z-40 mx-auto max-w-sm shadow-xl border border-orange-400/30">
        <div className="flex items-center justify-center space-x-2">
          <WifiOff className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">You're offline - some features may be limited</span>
        </div>
      </div>
    );
  };

  // Authentication Screen
  if (currentScreen === 'auth') {
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 min-h-screen">
        <PWAInstallBanner />
        <OfflineIndicator />
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <DreamScrollLogo size={80} className="mx-auto mb-6" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-purple-300">Sign in to access your personal dream journal</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  onClick={() => {
                    setIsAuthenticated(true);
                    setCurrentScreen('home');
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Sign In
                </button>

                <div className="text-center">
                  <button className="text-purple-300 hover:text-white transition-colors text-sm">
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setCurrentScreen('home');
              }}
              className="w-full text-center text-purple-300 hover:text-white transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding Screen
  if (currentScreen === 'onboarding') {
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen">
        <PWAInstallBanner />
        <OfflineIndicator />
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
          <div className="text-center space-y-8 max-w-md">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                <DreamScrollLogo size={64} />
              </div>
              <Sparkles className="w-8 h-8 absolute top-4 right-8 text-yellow-300 animate-pulse" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                DreamScroll
              </h1>
              <p className="text-xl text-purple-200 mb-4">
                AI-powered biblical dream interpretation
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-purple-300">
                <Wifi className="w-4 h-4" />
                <span>Voice recording • Offline capable • Biblical insights</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-left bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Voice Recording</h3>
                  <p className="text-sm text-purple-200">Record dreams with your voice</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-left bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Interpretation</h3>
                  <p className="text-sm text-purple-200">Biblical insights powered by AI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-left bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Personal Journal</h3>
                  <p className="text-sm text-purple-200">Save and organize your dreams</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentScreen('auth')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
              
              {installPrompt && !isInstalled && (
                <button
                  onClick={handleInstallPWA}
                  className="w-full bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  📱 Install as App
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Input Screen
  if (currentScreen === 'input') {
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-indigo-900 min-h-screen">
        <OfflineIndicator />
        <div className="min-h-screen text-white">
          <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">Record Dream</h2>
              <div className="w-10 h-10"></div>
            </div>

            {/* Recording Interface */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <DreamScrollLogo size={20} className="mr-2" />
                  Describe Your Dream
                </h3>
                
                <div className="space-y-6">
                  {/* Voice Recording Section */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={isRecording ? stopRealRecording : startRealRecording}
                        disabled={!audioSupported}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${
                          isRecording 
                            ? 'bg-red-500 animate-pulse shadow-red-500/50 scale-110' 
                            : audioSupported
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/50 hover:scale-105'
                            : 'bg-gray-500 cursor-not-allowed'
                        }`}
                        title={audioSupported ? (isRecording ? 'Stop Recording' : 'Start Voice Recording') : 'Microphone not available'}
                      >
                        {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                        {isRecording && (
                          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-purple-200 mb-2 font-medium">
                        {isRecording 
                          ? `🎤 ${isListening ? 'Listening' : 'Recording'}... ${formatTime(recordingTimer)}` 
                          : audioSupported 
                          ? 'Tap the microphone to start voice recording'
                          : 'Voice recording not available - please type your dream below'
                        }
                      </p>
                      
                      {isRecording && (
                        <div className="space-y-3">
                          <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          {isListening && (
                            <div className="bg-green-500/20 rounded-2xl p-3 border border-green-400/30">
                              <p className="text-green-300 text-sm font-medium">
                                🗣️ Speak now - your words will appear below
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {isProcessing && (
                        <div className="bg-yellow-500/20 rounded-2xl p-3 border border-yellow-400/30">
                          <div className="flex items-center justify-center space-x-2">
                            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                            <p className="text-yellow-300 text-sm font-medium">Processing speech...</p>
                          </div>
                        </div>
                      )}
                      
                      {!audioSupported && (
                        <div className="bg-orange-500/20 rounded-2xl p-3 border border-orange-400/30">
                          <p className="text-orange-300 text-sm">
                            💡 Voice recording requires Chrome, Firefox, or Safari
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="relative">
                    <textarea
                      value={dreamText}
                      onChange={(e) => setDreamText(e.target.value)}
                      placeholder="Type your dream here or use voice recording above..."
                      disabled={isRecording}
                      rows={6}
                      className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 resize-none focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all backdrop-blur-sm"
                    />
                    {dreamText.trim() && !isProcessing && !isRecording && (
                      <button
                        onClick={() => {
                          const textToProcess = dreamText;
                          setDreamText('');
                          generateAdvancedInterpretation(textToProcess);
                        }}
                        className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:scale-105"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-400/20">
                    <h4 className="text-blue-300 font-medium mb-2">💡 Recording Tips</h4>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Speak clearly and at a normal pace</li>
                      <li>• Include emotions and colors you remember</li>
                      <li>• Describe the setting and people involved</li>
                      <li>• Mention any symbols or unusual elements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Interpretation Screen
  if (currentScreen === 'interpretation') {
    if (!selectedDream) {
      return <div className="max-w-sm mx-auto bg-black min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }
    
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-purple-900 min-h-screen">
        <div className="min-h-screen text-white">
          <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Dream Interpretation</h2>
              <button
                onClick={() => shareDream(selectedDream)}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                  <Brain className="w-12 h-12 animate-spin" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Analyzing Your Dream</h3>
                <p className="text-purple-200 text-center max-w-sm mb-6">
                  Our AI is interpreting the biblical symbolism and spiritual meaning...
                </p>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Dream Title & Stats */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{selectedDream.title}</h3>
                    <button
                      onClick={() => toggleBookmark(selectedDream.id)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Heart className={`w-6 h-6 ${selectedDream.isBookmarked ? 'text-red-400 fill-current' : 'text-white/60'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">{selectedDream.date}</span>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-300 font-medium">{selectedDream.confidence}% Confidence</span>
                    </div>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
                    Interpretation
                  </h3>
                  <p className="text-white/90 leading-relaxed text-lg">{selectedDream.interpretation}</p>
                </div>

                {/* Themes & Mood */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Spiritual Themes</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDream.themes.map((theme, index) => (
                      <span key={index} className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded-full text-sm font-medium border border-purple-400/30">
                        {theme}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Mood:</span>
                    <span className="text-purple-300 font-medium">{selectedDream.mood}</span>
                  </div>
                </div>

                {/* Biblical References */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-300" />
                    Biblical References
                  </h3>
                  <div className="space-y-4">
                    {selectedDream.biblicalRefs.map((ref, index) => (
                      <div key={index} className="bg-blue-500/10 rounded-2xl p-4 border border-blue-400/20">
                        <h4 className="font-semibold text-blue-300 mb-2">{ref.verse}</h4>
                        <p className="text-blue-200 text-sm mb-3 italic">"{ref.text}"</p>
                        <p className="text-white/80 text-sm">{ref.relevance}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symbols */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Key Symbols</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDream.symbols.map((symbol, index) => (
                      <span key={index} className="bg-green-500/20 text-green-200 px-3 py-2 rounded-full text-sm border border-green-400/30">
                        {symbol}
                      </span>
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

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-purple-900 min-h-screen">
        <PWAInstallBanner />
        <OfflineIndicator />
        <div className="min-h-screen text-white">
          <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <DreamScrollLogo size={32} />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    DreamScroll
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-purple-300">Good evening, {isAuthenticated ? 'Dreamer' : 'Guest'}</p>
                  <div className="flex items-center space-x-1">
                    {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-orange-400" />}
                    {isInstalled && <Download className="w-4 h-4 text-blue-400" />}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentScreen('search')}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentScreen('profile')}
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Record Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quick Record</h2>
                <div className="flex items-center space-x-2">
                  <DreamScrollLogo size={20} />
                  {audioSupported && <Mic className="w-4 h-4 text-green-400" />}
                  {!isOnline && <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">Offline</span>}
                </div>
              </div>
              <p className="text-white/70 mb-4">
                Record your dream with voice or type it manually
              </p>
              <button
                onClick={() => setCurrentScreen('input')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🎤 Start Recording
              </button>
            </div>

            {/* Recent Dreams */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                  Recent Dreams
                </h3>
                <button
                  onClick={() => setCurrentScreen('journal')}
                  className="text-purple-300 hover:text-white transition-colors text-sm"
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
                    className="bg-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium group-hover:text-purple-200 transition-colors">{dream.title}</h4>
                      <div className="flex items-center space-x-2">
                        {dream.isBookmarked && <Heart className="w-4 h-4 text-red-400 fill-current" />}
                        <span className="text-xs text-purple-300">{dream.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 mb-3">{dream.content.substring(0, 80)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {dream.themes.slice(0, 2).map((theme, index) => (
                          <span key={index} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
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

            {/* Stats Card */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-green-300">{dreams.length}</div>
                <div className="text-xs text-white/70">Dreams</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-blue-300">{dreams.filter(d => d.isBookmarked).length}</div>
                <div className="text-xs text-white/70">Bookmarked</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-purple-300">7</div>
                <div className="text-xs text-white/70">Day Streak</div>
              </div>
            </div>

            {/* PWA Install Prompt */}
            {installPrompt && !isInstalled && (
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 shadow-xl">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-purple-300" />
                  Install DreamScroll
                </h3>
                <p className="text-white/70 mb-4 text-sm">
                  Add DreamScroll to your home screen for faster access and offline functionality.
                </p>
                <button
                  onClick={handleInstallPWA}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  📱 Install as App
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center justify-around py-3 px-6 max-w-sm mx-auto">
              <button
                onClick={() => setCurrentScreen('home')}
                className="flex flex-col items-center space-y-1 text-purple-400"
              >
                <DreamScrollLogo size={20} />
                <span className="text-xs">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('input')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs">Record</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('journal')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Book className="w-6 h-6" />
                <span className="text-xs">Journal</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('search')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Search className="w-6 h-6" />
                <span className="text-xs">Search</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('profile')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Journal Screen
  if (currentScreen === 'journal') {
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-purple-900 min-h-screen">
        <OfflineIndicator />
        <div className="min-h-screen text-white">
          <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">Dream Journal</h2>
              <button
                onClick={() => setCurrentScreen('search')}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 mb-6">
              {['all', 'bookmarked', 'recent'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Dreams List */}
            <div className="space-y-4">
              {filteredDreams.map((dream) => (
                <div
                  key={dream.id}
                  onClick={() => {
                    setSelectedDream(dream);
                    setCurrentScreen('interpretation');
                  }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl cursor-pointer hover:bg-white/15 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold group-hover:text-purple-200 transition-colors">{dream.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(dream.id);
                        }}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${dream.isBookmarked ? 'text-red-400 fill-current' : 'text-white/60'}`} />
                      </button>
                      <span className="text-sm text-purple-300">{dream.date}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/80 mb-4 line-clamp-3">{dream.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {dream.themes.slice(0, 3).map((theme, index) => (
                        <span key={index} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
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
                <Moon className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/70 mb-2">No dreams found</h3>
                <p className="text-white/50 mb-6">Start recording your dreams to build your spiritual journal</p>
                <button
                  onClick={() => setCurrentScreen('input')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Record First Dream
                </button>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center justify-around py-3 px-6 max-w-sm mx-auto">
              <button
                onClick={() => setCurrentScreen('home')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <DreamScrollLogo size={20} />
                <span className="text-xs">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('input')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs">Record</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('journal')}
                className="flex flex-col items-center space-y-1 text-purple-400"
              >
                <Book className="w-6 h-6" />
                <span className="text-xs">Journal</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('search')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Search className="w-6 h-6" />
                <span className="text-xs">Search</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('profile')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Search Screen
  if (currentScreen === 'search') {
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-purple-900 min-h-screen">
        <OfflineIndicator />
        <div className="min-h-screen text-white">
          <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">Search Dreams</h2>
              <div className="w-10 h-10"></div>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dreams, themes, or symbols..."
                className="w-full p-4 pl-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all backdrop-blur-sm"
              />
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {filteredDreams.map((dream) => (
                <div
                  key={dream.id}
                  onClick={() => {
                    setSelectedDream(dream);
                    setCurrentScreen('interpretation');
                  }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl cursor-pointer hover:bg-white/15 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold">{dream.title}</h3>
                    <span className="text-sm text-purple-300">{dream.date}</span>
                  </div>
                  
                  <p className="text-white/80 mb-3 line-clamp-2">{dream.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {dream.themes.slice(0, 3).map((theme, index) => (
                      <span key={index} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {searchQuery && filteredDreams.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/70 mb-2">No results found</h3>
                <p className="text-white/50">Try searching for different keywords or themes</p>
              </div>
            )}

            {!searchQuery && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/70 mb-2">Search Your Dreams</h3>
                <p className="text-white/50">Find dreams by title, content, themes, or symbols</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center justify-around py-3 px-6 max-w-sm mx-auto">
              <button
                onClick={() => setCurrentScreen('home')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <DreamScrollLogo size={20} />
                <span className="text-xs">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('input')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs">Record</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('journal')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Book className="w-6 h-6" />
                <span className="text-xs">Journal</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('search')}
                className="flex flex-col items-center space-y-1 text-purple-400"
              >
                <Search className="w-6 h-6" />
                <span className="text-xs">Search</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('profile')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile Screen
  if (currentScreen === 'profile') {
    return (
      <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-purple-900 min-h-screen">
        <OfflineIndicator />
        <div className="min-h-screen text-white">
          <div className="p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">Profile</h2>
              <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-xl text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">{isAuthenticated ? 'Dreamer' : 'Guest User'}</h3>
              <p className="text-purple-300 mb-4">Spiritual Seeker</p>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{dreams.length}</div>
                  <div className="text-white/70">Dreams</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{dreams.filter(d => d.isBookmarked).length}</div>
                  <div className="text-white/70">Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">7</div>
                  <div className="text-white/70">Day Streak</div>
                </div>
              </div>
            </div>

            {/* Settings Options */}
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <span>Export Dreams</span>
                  </div>
                  <button className="text-purple-400 hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-green-400" />
                    <span>Backup & Sync</span>
                  </div>
                  <button className="text-purple-400 hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-purple-400" />
                    <span>App Settings</span>
                  </div>
                  <button className="text-purple-400 hover:text-white transition-colors">
                    →
                  </button>
                </div>
              </div>

              {!isAuthenticated && (
                <button
                  onClick={() => setCurrentScreen('auth')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Sign In / Sign Up
                </button>
              )}

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setCurrentScreen('home');
                  }}
                  className="w-full bg-red-500/20 border border-red-400/30 py-4 rounded-2xl font-semibold text-red-300 hover:bg-red-500/30 transition-all"
                >
                  Sign Out
                </button>
              )}
            </div>

            {/* App Info */}
            <div className="bg-white/5 rounded-2xl p-4 mt-6 text-center">
              <DreamScrollLogo size={32} className="mx-auto mb-2" />
              <p className="text-white/50 text-sm">DreamScroll v1.0.0</p>
              <p className="text-white/40 text-xs">Biblical dream interpretation</p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-center justify-around py-3 px-6 max-w-sm mx-auto">
              <button
                onClick={() => setCurrentScreen('home')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <DreamScrollLogo size={20} />
                <span className="text-xs">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('input')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs">Record</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('journal')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Book className="w-6 h-6" />
                <span className="text-xs">Journal</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('search')}
                className="flex flex-col items-center space-y-1 text-white/60 hover:text-white transition-colors"
              >
                <Search className="w-6 h-6" />
                <span className="text-xs">Search</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('profile')}
                className="flex flex-col items-center space-y-1 text-purple-400"
              >
                <User className="w-6 h-6" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="max-w-sm mx-auto bg-black min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <DreamScrollLogo size={64} className="mx-auto mb-4" />
        <p>Loading DreamScroll...</p>
      </div>
    </div>
  );
}
