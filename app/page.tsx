'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

// Import all screens
import { LoadingScreen } from '@/components/screens/LoadingScreen';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';
import { TrendsScreen } from '@/components/screens/TrendsScreen';
import { JournalScreen } from '@/components/screens/JournalScreen';
import { InputScreen } from '@/components/screens/InputScreen';
import { InterpretationScreen } from '@/components/screens/InterpretationScreen';

// Import UI components
import { NotificationBar } from '@/components/ui/NotificationBar';
import { BottomNav } from '@/components/ui/BottomNav';

// Import types
import type { Dream, Notification, UserProfile, BiblicalRef } from '@/lib/types';

// Import utilities
import * as dreamAnalysis from '@/lib/dreamAnalysis';

type Screen = 'loading' | 'auth' | 'home' | 'journal' | 'input' | 'profile' | 'trends' | 'interpretation';

// Type declarations for browser APIs
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

/**
 * Main DreamScroll Application Component
 * 
 * Manages application state, screen navigation, and data flow between components
 */
export default function DreamScrollApp() {
  // Core state
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 1,
      title: 'Walking on Golden Streets',
      content: 'I found myself walking on streets that seemed to be made of pure gold...',
      date: 'Nov 12, 2024',
      timestamp: new Date('2024-11-12'),
      themes: ['Heaven', 'Glory', 'Promise'],
      symbols: ['🏛️ City', '✨ Gold', '🚪 Gates'],
      interpretation: 'This dream reflects divine promises and heavenly visions...',
      biblicalRefs: [
        {
          verse: 'Revelation 21:21',
          text: 'The twelve gates were twelve pearls... The great street of the city was of gold.',
          relevance: 'Heavenly Jerusalem imagery'
        }
      ],
      emotionalTone: 'Peaceful',
      mood: 'Positive',
      confidence: 92,
      isBookmarked: true,
      category: 'prophetic',
      tags: ['Heaven', 'Glory', 'Promise', 'Nighttime'],
      audioNotes: null,
      lastViewed: new Date()
    }
  ]);
  
  // User state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'DreamSeeker',
    subtitle: 'Exploring the spiritual realm',
    profileImage: '',
    selectedLLM: 'GPT-4'
  });
  
  // UI state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [dreamInput, setDreamInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize app
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('auth');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setDreamInput(prev => prev + finalTranscript);
          }
        };
        
        recognition.onerror = () => {
          setIsListening(false);
          addNotification('Voice input error. Please try again.', 'error');
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Notification management
  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Dream interpretation
  const generateAdvancedInterpretation = async (dreamText: string) => {
    setIsProcessing(true);
    setCurrentScreen('interpretation');
    
    setTimeout(() => {
      const newDream: Dream = {
        id: dreams.length + 1,
        title: dreamAnalysis.extractDreamTitle(dreamText),
        content: dreamText,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        timestamp: new Date(),
        themes: dreamAnalysis.generateThemes(dreamText),
        symbols: dreamAnalysis.extractSymbols(dreamText),
        interpretation: dreamAnalysis.generateInterpretation(dreamText) + ` (Interpreted using ${userProfile.selectedLLM})`,
        biblicalRefs: dreamAnalysis.generateBiblicalRefs(dreamText),
        emotionalTone: dreamAnalysis.analyzeEmotionalTone(dreamText),
        mood: dreamAnalysis.analyzeMood(dreamText),
        confidence: Math.floor(Math.random() * 20) + 80,
        isBookmarked: false,
        category: dreamAnalysis.categorize(dreamText),
        tags: dreamAnalysis.generateTags(dreamText, dreamAnalysis.generateThemes(dreamText), dreamAnalysis.extractSymbols(dreamText)),
        audioNotes: audioBlob || null,
        lastViewed: new Date()
      };
      
      setDreams(prev => [newDream, ...prev]);
      setSelectedDream(newDream);
      setIsProcessing(false);
      setDreamInput('');
      setAudioBlob(null);
      addNotification('Dream interpretation complete!', 'success');
    }, 3500);
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      addNotification('Microphone access denied', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      addNotification('Audio recorded successfully', 'success');
    }
  };

  // Voice transcription toggle
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      addNotification('Voice input not supported in your browser', 'error');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      addNotification('Listening... Speak your dream', 'info');
    }
  };

  // Dream management functions
  const toggleBookmark = (dreamId: number) => {
    setDreams(prev => prev.map(dream => 
      dream.id === dreamId 
        ? { ...dream, isBookmarked: !dream.isBookmarked }
        : dream
    ));
    const dream = dreams.find(d => d.id === dreamId);
    if (dream) {
      addNotification(
        dream.isBookmarked ? 'Bookmark removed' : 'Dream bookmarked',
        'success'
      );
    }
  };

  const deleteDream = (dreamId: number) => {
    setDreams(prev => prev.filter(dream => dream.id !== dreamId));
    if (selectedDream?.id === dreamId) {
      setSelectedDream(null);
      setCurrentScreen('journal');
    }
    addNotification('Dream deleted', 'info');
  };

  // Navigation handler
  const handleNavigation = (screen: string) => {
  if (screen === 'input') {
    // Reset input state when navigating to input screen
    setDreamInput('');
    setAudioBlob(null);
    setRecordingTime(0);
  }
  setCurrentScreen(screen as Screen);
};

  // Screen rendering
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (currentScreen === 'auth') {
    return <AuthScreen onSuccess={() => setCurrentScreen('home')} />;
  }

  // Main app layout with screen routing
  // Update the main return section:
return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    {/* Notification Bar - Fixed with removeNotification prop */}
    <NotificationBar 
      notifications={notifications} 
      removeNotification={removeNotification} 
    />
    
    {/* Screen Router */}
    <div className="pb-16">
      {currentScreen === 'home' && (
        <HomeScreen
          userProfile={userProfile}
          recentDreams={dreams.slice(0, 3)}
          totalDreams={dreams.length}
          onNavigate={handleNavigation}
          onSelectDream={(dream) => {
            setSelectedDream(dream);
            setCurrentScreen('interpretation');
          }}
        />
      )}
      
      {currentScreen === 'journal' && (
        <JournalScreen
          dreams={dreams}
          onSelectDream={(dream) => {
            setSelectedDream(dream);
            setCurrentScreen('interpretation');
          }}
          onToggleBookmark={toggleBookmark}
          onDeleteDream={deleteDream}
        />
      )}
      
      {currentScreen === 'input' && (
        <InputScreen
          dreamInput={dreamInput}
          setDreamInput={setDreamInput}
          isListening={isListening}
          isRecording={isRecording}
          recordingTime={recordingTime}
          audioBlob={audioBlob}
          onToggleVoice={toggleVoiceInput}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSubmit={() => {
            if (dreamInput.trim() || audioBlob) {
              generateAdvancedInterpretation(dreamInput);
            } else {
              addNotification('Please enter or record your dream first', 'info');
            }
          }}
          onCancel={() => {
            setDreamInput('');
            setAudioBlob(null);
            setCurrentScreen('home');
          }}
        />
      )}
      
      {currentScreen === 'profile' && (
        <ProfileScreen
          userProfile={userProfile}
          totalDreams={dreams.length}
          onUpdateProfile={(updates) => {
            setUserProfile(prev => ({ ...prev, ...updates }));
            addNotification('Profile updated successfully', 'success');
          }}
          onNavigate={handleNavigation}
        />
      )}
      
      {currentScreen === 'trends' && (
        <TrendsScreen
          dreams={dreams}
          onNavigate={handleNavigation}
        />
      )}
      
      {currentScreen === 'interpretation' && selectedDream && (
        <InterpretationScreen
          dream={selectedDream}
          isProcessing={isProcessing}
          onBack={() => setCurrentScreen('journal')}
          onToggleBookmark={() => toggleBookmark(selectedDream.id)}
          onDelete={() => deleteDream(selectedDream.id)}
        />
      )}
    </div>
    
    {/* Bottom Navigation - Fixed prop name */}
    <BottomNav 
      activeScreen={currentScreen} 
      setCurrentScreen={handleNavigation} 
    />
  </div>
  );
}