'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Book, User, ArrowLeft, Plus, 
  Moon, Sparkles, Brain, Wifi, WifiOff, Download
} from 'lucide-react';

interface Dream {
  id: number;
  title: string;
  date: string;
  content: string;
  interpretation: string;
  themes: string[];
  mood: string;
  symbols: string[];
  biblicalRefs: string[];
}

type ScreenType = 'onboarding' | 'home' | 'input' | 'journal' | 'dreamDetail' | 'interpretation' | 'profile';

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
  const recordingIntervalRef = useRef<any>(null);
  
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 1,
      title: "Flying Over Mountains",
      date: "2025-05-28",
      content: "I was flying over beautiful snow-capped mountains, feeling completely free and peaceful.",
      interpretation: "Flying dreams represent freedom and spiritual elevation.",
      themes: ["Freedom", "Spiritual Growth"],
      mood: "Peaceful",
      symbols: ["Flying", "Mountains"],
      biblicalRefs: ["Isaiah 40:31"]
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

  // PWA Install Banner Component
  const PWAInstallBanner = () => {
    if (!installPrompt || isInstalled) return null;
    
    return (
      <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 z-50 mx-auto max-w-sm shadow-lg">
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
              className="text-white/60 hover:text-white transition-colors"
              title="Dismiss"
            >
              ✕
            </button>
            <button 
              onClick={handleInstallPWA}
              className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm font-semibold hover:bg-white/30 transition-colors"
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
      <div className="fixed top-4 left-4 right-4 bg-orange-600 rounded-xl p-3 z-40 mx-auto max-w-sm shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <WifiOff className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">You're offline - some features may be limited</span>
        </div>
      </div>
    );
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

  const generateInterpretation = (dreamContent: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const interpretations = [
        {
          interpretation: "Your dream reveals significant spiritual symbolism. The garden represents your spiritual life and growth, while the colorful flowers symbolize the fruits of the Spirit. The bright light calling to you represents divine guidance and God's presence in your life.",
          themes: ["Spiritual Growth", "Divine Guidance", "Peace", "Awakening"],
          mood: "Peaceful",
          symbols: ["Garden", "Light", "Flowers", "Sky"],
          biblicalRefs: ["John 15:5", "Matthew 5:14", "Galatians 5:22"]
        },
        {
          interpretation: "The ocean represents the vastness of God's love and mercy. Crystal clear water symbolizes purity and truth. The voice from the waves represents God speaking to you, offering comfort and reassurance about your spiritual journey.",
          themes: ["Trust", "Divine Communication", "Purity", "Faith"],
          mood: "Reassuring",
          symbols: ["Ocean", "Water", "Voice", "Clarity"],
          biblicalRefs: ["Psalm 29:3", "Isaiah 43:2", "Matthew 14:27"]
        }
      ];
      
      const randomInterpretation = interpretations[Math.floor(Math.random() * interpretations.length)];
      
      const newDream: Dream = {
        id: dreams.length + 1,
        title: dreamContent.substring(0, 30) + (dreamContent.length > 30 ? "..." : ""),
        date: new Date().toISOString().split('T')[0],
        content: dreamContent,
        ...randomInterpretation
      };
      
      setDreams([newDream, ...dreams]);
      setSelectedDream(newDream);
      setIsProcessing(false);
      setCurrentScreen('interpretation');
    }, 3000);
  };

  // Onboarding Screen
  if (currentScreen === 'onboarding') {
    return (
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <PWAInstallBanner />
        <OfflineIndicator />
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-6 text-white">
          <div className="text-center space-y-8 max-w-md">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Moon className="w-16 h-16 text-white" />
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
                <span>Works offline • Voice recording • Installable PWA</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Voice Recording</h3>
                  <p className="text-sm text-purple-200">Record dreams with your voice</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Interpretation</h3>
                  <p className="text-sm text-purple-200">Biblical insights powered by AI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Works Offline</h3>
                  <p className="text-sm text-purple-200">Install as app on your device</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Begin Your Journey
            </button>
            
            {installPrompt && !isInstalled && (
              <button
                onClick={handleInstallPWA}
                className="w-full bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all"
              >
                📱 Install as App
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <PWAInstallBanner />
        <OfflineIndicator />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
          <div className="p-6 pb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  DreamScroll
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-purple-300">Good evening, Dreamer</p>
                  <div className="flex items-center space-x-1">
                    {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-orange-400" />}
                    {isInstalled && <Download className="w-4 h-4 text-blue-400" title="Installed as PWA" />}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentScreen('profile')}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <User className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quick Record</h2>
                <div className="flex items-center space-x-2">
                  <Moon className="w-6 h-6 text-purple-300" />
                  {audioSupported && <Mic className="w-5 h-5 text-green-400" />}
                  {!isOnline && <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Offline</span>}
                </div>
              </div>
              <p className="text-white/70 mb-4">
                Record with voice or type your dream
              </p>
              <button
                onClick={() => setCurrentScreen('input')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                🎤 Start Recording
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                Recent Dreams
              </h3>
              
              <div className="space-y-3">
                {dreams.slice(0, 2).map((dream) => (
                  <div
                    key={dream.id}
                    onClick={() => {
                      setSelectedDream(dream);
                      setCurrentScreen('dreamDetail');
                    }}
                    className="bg-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{dream.title}</h4>
                      <span className="text-xs text-purple-300">{dream.date}</span>
                    </div>
                    <p className="text-sm text-white/70">{dream.content.substring(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>

            {installPrompt && !isInstalled && (
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-purple-500/30">
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

          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10">
            <div className="flex items-center justify-around py-3 px-6 max-w-sm mx-auto">
              <button
                onClick={() => setCurrentScreen('home')}
                className="flex flex-col items-center space-y-1 text-purple-400"
              >
                <Moon className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('input')}
                className="flex flex-col items-center space-y-1 text-white/60"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs">Record</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('journal')}
                className="flex flex-col items-center space-y-1 text-white/60"
              >
                <Book className="w-6 h-6" />
                <span className="text-xs">Journal</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('profile')}
                className="flex flex-col items-center space-y-1 text-white/60"
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

  // Input Screen
  if (currentScreen === 'input') {
    return (
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <OfflineIndicator />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setCurrentScreen('home')}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Record Dream</h2>
              <div className="w-6 h-6"></div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Moon className="w-5 h-5 mr-2 text-purple-300" />
                  Describe Your Dream
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={isRecording ? stopRealRecording : startRealRecording}
                      disabled={!audioSupported}
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isRecording 
                          ? 'bg-red-500 animate-pulse shadow-red-500/50' 
                          : audioSupported
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/50'
                          : 'bg-gray-500 cursor-not-allowed'
                      }`}
                      title={audioSupported ? (isRecording ? 'Stop Recording' : 'Start Voice Recording') : 'Microphone not available'}
                    >
                      {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-purple-200 mb-2">
                      {isRecording 
                        ? `🎤 ${isListening ? 'Listening' : 'Recording'}... ${formatTime(recordingTimer)}` 
                        : audioSupported 
                        ? 'Click the microphone to start voice recording'
                        : 'Voice recording not available - please type your dream below'
                      }
                    </p>
                    {isRecording && (
                      <div className="space-y-2">
                        <div className="flex justify-center space-x-1 mb-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        {isListening && (
                          <p className="text-green-300 text-sm">
                            🗣️ Speak now - your words will appear below
                          </p>
                        )}
                      </div>
                    )}
                    {isProcessing && (
                      <div className="text-yellow-300">
                        <Sparkles className="w-5 h-5 mx-auto animate-spin mb-1" />
                        <p className="text-sm">Converting speech to text...</p>
                      </div>
                    )}
                    {!audioSupported && (
                      <div className="text-orange-300 text-sm mt-2">
                        <p>💡 Voice recording requires Chrome, Firefox, or Safari</p>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      value={dreamText}
                      onChange={(e) => setDreamText(e.target.value)}
                      placeholder="Type your dream here or use voice recording above..."
                      disabled={isRecording}
                      rows={4}
                      style={{
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        border: '1px solid #4b5563'
                      }}
                      className="w-full p-4 rounded-2xl placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 transition-all"
                    />
                    {dreamText.trim() && !isProcessing && !isRecording && (
                      <button
                        onClick={() => {
                          const textToProcess = dreamText;
                          setDreamText('');
                          generateInterpretation(textToProcess);
                        }}
                        className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interpretation Screen
  if (currentScreen === 'interpretation') {
    if (!selectedDream) {
      return <div>Loading...</div>;
    }
    
    return (
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setCurrentScreen('home')}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Dream Interpretation</h2>
              <div className="w-6 h-6"></div>
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                  <Brain className="w-10 h-10 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Dream</h3>
                <p className="text-purple-200 text-center max-w-sm">
                  Our AI is interpreting the biblical symbolism and spiritual meaning...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
                    Interpretation
                  </h3>
                  <p className="text-white/90 leading-relaxed">{selectedDream.interpretation}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Biblical References</h3>
                  <div className="space-y-2">
                    {selectedDream.biblicalRefs.map((ref, index) => (
                      <div key={index} className="bg-blue-500/20 rounded-xl p-3">
                        <span className="text-blue-300 font-semibold">{ref}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold"
                >
                  Save to Journal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Journal Screen
  if (currentScreen === 'journal') {
    return (
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
          <div className="p-6 pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setCurrentScreen('home')}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Dream Journal</h2>
              <div className="w-6 h-6"></div>
            </div>

            <div className="space-y-4">
              {dreams.map((dream) => (
                <div
                  key={dream.id}
                  onClick={() => {
                    setSelectedDream(dream);
                    setCurrentScreen('dreamDetail');
                  }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/15 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{dream.title}</h3>
                    <span className="text-xs text-purple-300">{dream.date}</span>
                  </div>
                  
                  <p className="text-white/70 mb-4">{dream.content.substring(0, 120)}...</p>
                  
                  <div className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-lg text-xs inline-block">
                    {dream.mood}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dream Detail Screen
  if (currentScreen === 'dreamDetail') {
    if (!selectedDream) {
      return <div>Loading...</div>;
    }
    
    return (
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setCurrentScreen('journal')}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold">Dream Details</h2>
              <button
                onClick={() => setCurrentScreen('interpretation')}
                className="p-2 bg-white/10 rounded-full"
              >
                <Brain className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                <h3 className="text-2xl font-bold mb-4">{selectedDream.title}</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-purple-300">{selectedDream.date}</span>
                  <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                    {selectedDream.mood}
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">{selectedDream.content}</p>
              </div>

              <button
                onClick={() => setCurrentScreen('interpretation')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-2xl font-semibold"
              >
                View Full Interpretation
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
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
          <div className="p-6 pb-20">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setCurrentScreen('home')}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Profile</h2>
              <div className="w-6 h-6"></div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Dream Explorer</h3>
                <p className="text-purple-300">Member since May 2025</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">{dreams.length}</div>
                    <div className="text-xs text-white/70">Dreams</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">7</div>
                    <div className="text-xs text-white/70">Day Streak</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-4">App Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mic className="w-5 h-5 text-green-400" />
                      <span>Voice Recording</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${audioSupported ? 'bg-green-500' : 'bg-gray-500'} relative`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${audioSupported ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-blue-400" />
                      <span>PWA Installed</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-gray-500'} relative`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isInstalled ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wifi className="w-5 h-5 text-green-400" />
                      <span>Online Status</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'} relative`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${isOnline ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  
                  {swRegistration && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span>Service Worker</span>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-green-500 relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isInstalled && installPrompt && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Install DreamScroll</h3>
                  <p className="text-white/80 mb-4">Add to your home screen for the best experience</p>
                  <button
                    onClick={handleInstallPWA}
                    className="w-full bg-white/20 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-colors"
                  >
                    📱 Install Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
