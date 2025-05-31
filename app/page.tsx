'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Book, User, ArrowLeft, Plus, 
  Moon, Sparkles, Brain, Wifi, WifiOff
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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
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
      
      // Enhanced audio support detection
      const checkAudioSupport = async () => {
        console.log('🔍 Checking audio support...');
        
        try {
          // Check if MediaDevices API is available
          if (!navigator.mediaDevices) {
            console.log('❌ MediaDevices API not available');
            setAudioSupported(false);
            return;
          }
          
          // Check if getUserMedia is available
          if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
            console.log('❌ getUserMedia not available');
            setAudioSupported(false);
            return;
          }
          
          // Check if MediaRecorder is available
          if (typeof MediaRecorder === 'undefined') {
            console.log('❌ MediaRecorder not available');
            setAudioSupported(false);
            return;
          }
          
          // Check if any audio MIME types are supported
          const audioMimeTypes = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/ogg;codecs=opus'
          ];
          
          const supportedMimeType = audioMimeTypes.find(mimeType => 
            MediaRecorder.isTypeSupported(mimeType)
          );
          
          if (!supportedMimeType) {
            console.log('❌ No supported audio MIME types');
            setAudioSupported(false);
            return;
          }
          
          console.log('✅ Audio support detected');
          console.log('📼 Supported MIME type:', supportedMimeType);
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
      };
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const testVoiceFunction = () => {
    console.log('=== VOICE TEST ===');
    
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTimer(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      setRecordingTimer(0);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      processAudioToText();
    }
  };

  const processAudioToText = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const mockText = "I had a vivid dream where I was walking through a beautiful garden filled with colorful flowers.";
      setDreamText(mockText);
      setIsProcessing(false);
    }, 2000);
  };

  const startRealRecording = async () => {
    console.log('🎤 Starting real microphone recording...');
    
    if (!audioSupported) {
      console.log('❌ Audio not supported');
      alert('Audio recording not supported in this browser. Please use Chrome, Firefox, or Safari, or try the TEST button.');
      return;
    }

    try {
      console.log('🔍 Requesting microphone access...');
      
      // Request microphone permission with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      console.log('✅ Microphone access granted');
      
      // Check MediaRecorder support
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
          console.log('📼 Using MIME type:', mimeType);
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported audio format found');
      }
      
      // Create MediaRecorder
      const recorder = new MediaRecorder(stream, { 
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000
      });
      
      const audioChunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        console.log('📊 Audio chunk received:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        console.log('⏹️ Recording stopped, processing audio...');
        
        // Create audio blob
        const audioBlob = new Blob(audioChunks, { type: selectedMimeType });
        console.log('🔊 Final audio blob size:', audioBlob.size, 'bytes');
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('🔇 Audio track stopped');
        });
        
        // Process the audio (for now, simulate transcription)
        processRealAudio(audioBlob);
      };
      
      recorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        alert('Recording error occurred. Please try again or use the TEST button.');
        setIsRecording(false);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.onstart = () => {
        console.log('▶️ Recording started successfully');
      };
      
      // Start recording with data collection every second
      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTimer(0);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTimer(prev => {
          const newTime = prev + 1;
          console.log('⏱️ Recording time:', newTime + 's');
          return newTime;
        });
      }, 1000);
      
      console.log('🎙️ Recording started successfully');
      
    } catch (error: any) {
      console.error('❌ Microphone access error:', error);
      
      let errorMessage = 'Microphone access failed. ';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Please allow microphone access in your browser settings and try again.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Audio recording not supported in this browser. Please try Chrome, Firefox, or Safari.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Microphone is already in use by another application.';
      } else {
        errorMessage += 'Please check your microphone settings and try again.';
      }
      
      alert(errorMessage + '\n\nYou can use the TEST button as an alternative.');
      setAudioSupported(false);
      setIsRecording(false);
    }
  };

  const stopRealRecording = () => {
    console.log('🛑 Stopping real recording...');
    
    if (mediaRecorder) {
      if (mediaRecorder.state === 'recording') {
        console.log('⏹️ Calling mediaRecorder.stop()');
        mediaRecorder.stop();
      } else {
        console.log('ℹ️ MediaRecorder not in recording state:', mediaRecorder.state);
      }
    } else {
      console.log('❌ No mediaRecorder found');
    }
    
    // Clear timer
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    setIsRecording(false);
    setRecordingTimer(0);
  };

  const processRealAudio = (audioBlob: Blob) => {
    console.log('🔄 Processing real audio, size:', audioBlob.size, 'bytes');
    setIsProcessing(true);
    
    // For now, simulate audio processing since we need a speech-to-text service
    setTimeout(() => {
      const transcriptions = [
        "I had a beautiful dream where I was standing in a field of golden wheat, with a gentle breeze blowing. I felt such peace and heard a voice saying 'Be still and know that I am God.'",
        "In my dream, I was walking on water like Peter did. I felt scared at first, but then I looked up and saw Jesus reaching out his hand to me. When I took it, I felt completely safe.",
        "I dreamed I was in a magnificent garden with trees bearing fruit I'd never seen before. There was a river flowing through it, and I knew this was a glimpse of paradise.",
        "I saw myself climbing a mountain in my dream. It was difficult, but each step made me stronger. At the top, there was a bright light and I heard angels singing."
      ];
      
      const randomTranscription = transcriptions[Math.floor(Math.random() * transcriptions.length)];
      console.log('📝 Real audio transcription (simulated):', randomTranscription.substring(0, 50) + '...');
      
      setDreamText(randomTranscription);
      setIsProcessing(false);
      
      // Scroll to textarea
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.scrollIntoView({ behavior: 'smooth' });
          textarea.focus();
        }
      }, 100);
      
    }, 3000); // Longer processing time to simulate real transcription
  };

  const generateInterpretation = (dreamContent: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const newDream: Dream = {
        id: dreams.length + 1,
        title: dreamContent.substring(0, 30) + "...",
        date: new Date().toISOString().split('T')[0],
        content: dreamContent,
        interpretation: "Your dream reveals spiritual symbolism and divine guidance.",
        themes: ["Spiritual Growth", "Peace"],
        mood: "Peaceful",
        symbols: ["Garden", "Light"],
        biblicalRefs: ["John 15:5"]
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
            </div>

            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="max-w-sm mx-auto bg-black min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
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
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        isRecording 
                          ? 'bg-red-500 animate-pulse' 
                          : audioSupported
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                    
                    <button
                      onClick={testVoiceFunction}
                      className="w-16 h-16 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-xs font-bold transition-all"
                    >
                      TEST
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-purple-200 mb-2">
                      {isRecording 
                        ? `🎤 Recording... ${formatTime(recordingTimer)}` 
                        : audioSupported 
                        ? 'Click microphone to record or TEST to simulate'
                        : 'Microphone not available - use TEST or type below'
                      }
                    </p>
                    {isRecording && (
                      <div className="flex justify-center space-x-1 mb-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                    {isProcessing && (
                      <div className="text-yellow-300">
                        <Sparkles className="w-5 h-5 mx-auto animate-spin mb-1" />
                        <p className="text-sm">Converting speech to text...</p>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
