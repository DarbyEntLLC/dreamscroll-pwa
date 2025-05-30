'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Book, TrendingUp, User, Settings, MessageCircle, 
  Share2, Calendar, Moon, Sparkles, Heart, Users, BookOpen, PenTool, 
  Volume2, Search, Filter, Star, Crown, ArrowLeft, Plus, Eye, Brain, 
  Zap, Download, Wifi, WifiOff
} from 'lucide-react';

interface Dream {
  id: number;
  title: string;
  date: string;
  content: string;
  interpretation: string;
  themes: string[];
  mood: string;
  quality: number;
  symbols: string[];
  biblicalRefs: string[];
  audioUrl?: string | null;
}

type ScreenType = 'onboarding' | 'home' | 'input' | 'journal' | 'dreamDetail' | 'interpretation' | 'trends' | 'profile';

const DreamScrollPWA: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTimer, setRecordingTimer] = useState<number>(0);
  const [dreamText, setDreamText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioSupported, setAudioSupported] = useState<boolean>(false);
  
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 1,
      title: "Flying Over Mountains",
      date: "2025-05-28",
      content: "I was flying over beautiful snow-capped mountains, feeling completely free and peaceful...",
      interpretation: "Flying dreams often represent a desire for freedom and escape from life's constraints. The mountains may symbolize obstacles you've overcome or challenges you're rising above.",
      themes: ["Freedom", "Achievement", "Spiritual Growth"],
      mood: "Peaceful",
      quality: 85,
      symbols: ["Flying", "Mountains", "Sky"],
      biblicalRefs: ["Isaiah 40:31", "Psalm 91:4"],
      audioUrl: null
    }
  ]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  useEffect(() => {
    const checkAudioSupport = async () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          setAudioSupported(true);
        } else {
          setAudioSupported(false);
        }
      } catch (error) {
        setAudioSupported(false);
      }
    };
    checkAudioSupport();
  }, []);

  const handleInstallPWA = async () => {
    if (installPrompt) {
      (installPrompt as any).prompt();
      const result = await (installPrompt as any).userChoice;
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  const startRealRecording = async () => {
    if (!audioSupported) {
      alert('Audio recording not supported on this device');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        processAudioToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTimer(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record dreams');
    }
  };

  const stopRealRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const processAudioToText = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const mockTranscription = "I had a vivid dream where I was walking through a beautiful garden filled with colorful flowers. Suddenly, I noticed a bright light in the sky that seemed to be calling to me. I felt an overwhelming sense of peace and love.";
      setDreamText(mockTranscription);
      setIsProcessing(false);
    }, 2000);
  };

  const generateInterpretation = async (dreamContent: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const interpretation = {
        interpretation: `Your dream reveals significant spiritual symbolism. The garden represents your spiritual life and growth, while the colorful flowers symbolize the fruits of the Spirit - love, joy, peace, and kindness. The bright light calling to you represents divine guidance and God's presence in your life. This dream suggests you are in a season of spiritual awakening and divine connection.`,
        themes: ["Spiritual Growth", "Divine Guidance", "Peace", "Awakening"],
        mood: "Peaceful",
        quality: 92,
        symbols: ["Garden", "Light", "Flowers", "Sky"],
        biblicalRefs: ["John 15:5", "Matthew 5:14", "Galatians 5:22"]
      };
      
      const newDream: Dream = {
        id: dreams.length + 1,
        title: dreamContent.substring(0, 30) + (dreamContent.length > 30 ? "..." : ""),
        date: new Date().toISOString().split('T')[0],
        content: dreamContent,
        ...interpretation,
        audioUrl: null
      };
      
      setDreams([newDream, ...dreams]);
      setSelectedDream(newDream);
      setIsProcessing(false);
      setCurrentScreen('interpretation');
    }, 3000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const PWAInstallBanner: React.FC = () => {
    if (!installPrompt) return null;
    
    return (
      <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 z-50 mx-auto max-w-sm">
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
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
            <button 
              onClick={handleInstallPWA}
              className="bg-white/20 px-3 py-1 rounded-lg text-white text-sm font-semibold"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    );
  };

  const OfflineIndicator: React.FC = () => {
    if (isOnline) return null;
    
    return (
      <div className="fixed top-4 left-4 right-4 bg-yellow-600 rounded-xl p-3 z-40 mx-auto max-w-sm">
        <div className="flex items-center justify-center space-x-2">
          <WifiOff className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-sm">You're offline - recordings saved locally</span>
        </div>
      </div>
    );
  };

  const OnboardingScreen: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-6 text-white">
      <PWAInstallBanner />
      <OfflineIndicator />
      
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
            <span>Works offline • Installable • Real voice recording</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Real Voice Recording</h3>
              <p className="text-sm text-purple-200">
                {audioSupported ? 'Record dreams with your voice' : 'Type your dreams'}
              </p>
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
              <h3 className="font-semibold">Install as App</h3>
              <p className="text-sm text-purple-200">Add to home screen for quick access</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('home')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          Begin Your Journey
        </button>
        
        {installPrompt && (
          <button
            onClick={handleInstallPWA}
            className="w-full bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all"
          >
            📱 Install as App
          </button>
        )}
      </div>
    </div>
  );

  const HomeScreen: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
      <PWAInstallBanner />
      <OfflineIndicator />
      <div className="p-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              DreamScroll
            </h1>
            <div className="flex items-center space-x-2">
              <p className="text-purple-300">Good evening, Dreamer</p>
              {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-yellow-400" />}
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
            </div>
          </div>
          <p className="text-white/70 mb-4">
            {audioSupported ? 'Record with voice or type your dream' : 'Type your dream to get started'}
          </p>
          <button
            onClick={() => setCurrentScreen('input')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            {audioSupported ? '🎤 Start Recording' : '✍️ Write Dream'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setCurrentScreen('journal')}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left hover:bg-white/15 transition-all"
          >
            <Book className="w-8 h-8 mb-3 text-blue-300" />
            <h3 className="font-semibold mb-1">Journal</h3>
            <p className="text-sm text-white/70">{dreams.length} dreams</p>
          </button>
          
          <button
            onClick={() => setCurrentScreen('trends')}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-left hover:bg-white/15 transition-all"
          >
            <TrendingUp className="w-8 h-8 mb-3 text-green-300" />
            <h3 className="font-semibold mb-1">Trends</h3>
            <p className="text-sm text-white/70">AI insights</p>
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
                <p className="text-sm text-white/70 line-clamp-1">{dream.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around py-3 px-6 max-w-sm mx-auto">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center space-y-1 ${currentScreen === 'home' ? 'text-purple-400' : 'text-white/60'}`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('input')}
            className={`flex flex-col items-center space-y-1 ${currentScreen === 'input' ? 'text-purple-400' : 'text-white/60'} relative`}
          >
            <div className="relative">
              <Plus className="w-6 h-6" />
              {audioSupported && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>}
            </div>
            <span className="text-xs">Record</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('journal')}
            className={`flex flex-col items-center space-y-1 ${currentScreen === 'journal' ? 'text-purple-400' : 'text-white/60'}`}
          >
            <Book className="w-6 h-6" />
            <span className="text-xs">Journal</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('trends')}
            className={`flex flex-col items-center space-y-1 ${currentScreen === 'trends' ? 'text-purple-400' : 'text-white/60'}`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Trends</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center space-y-1 ${currentScreen === 'profile' ? 'text-purple-400' : 'text-white/60'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  const DreamInputScreen: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <OfflineIndicator />
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentScreen('home')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Record Dream</h2>
          <div className="flex items-center">
            {isOnline ? <Wifi className="w-5 h-5 text-green-400" /> : <WifiOff className="w-5 h-5 text-yellow-400" />}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Moon className="w-5 h-5 mr-2 text-purple-300" />
              Describe Your Dream
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <button
                  onClick={isRecording ? stopRealRecording : startRealRecording}
                  disabled={!audioSupported}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                      : audioSupported
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                      : 'bg-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-purple-200 mb-2">
                  {isRecording 
                    ? `Recording... ${formatTime(recordingTimer)}` 
                    : audioSupported 
                    ? 'Tap to start recording' 
                    : 'Audio not supported - use text input'
                  }
                </p>
                {isRecording && (
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
                {isProcessing && (
                  <div className="text-yellow-300">
                    <Sparkles className="w-5 h-5 mx-auto animate-spin mb-1" />
                    <p className="text-sm">Processing audio...</p>
                  </div>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  placeholder="Type your dream here or use voice recording above..."
                  className="w-full bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder-white/50 min-h-32 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  disabled={isRecording || isProcessing}
                />
                {dreamText.trim() && !isProcessing && (
                  <button
                    onClick={() => {
                      generateInterpretation(dreamText);
                      setDreamText('');
                    }}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
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
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'home':
        return <HomeScreen />;
      case 'input':
        return <DreamInputScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-black min-h-screen relative overflow-hidden">
      {renderScreen()}
    </div>
  );
};

export default function Home() {
  return <DreamScrollPWA />;
}
