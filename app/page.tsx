'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Send, Book, TrendingUp, User, ArrowLeft, Plus, 
  Moon, Sparkles, Brain, Download, Wifi, WifiOff
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

type ScreenType = 'onboarding' | 'home' | 'input' | 'journal' | 'dreamDetail' | 'interpretation' | 'trends' | 'profile';

export default function DreamScrollPWA() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [dreamText, setDreamText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [audioSupported, setAudioSupported] = useState(false);
  
  const [dreams, setDreams] = useState([
    {
      id: 1,
      title: "Flying Over Mountains",
      date: "2025-05-28",
      content: "I was flying over beautiful snow-capped mountains, feeling completely free and peaceful. The wind carried me higher and higher until I could see the entire world below me. There was a golden light surrounding me, and I felt God's presence so strongly.",
      interpretation: "Flying dreams often represent a desire for freedom and escape from life's constraints. The mountains may symbolize obstacles you've overcome or challenges you're rising above. The golden light represents divine presence and spiritual elevation.",
      themes: ["Freedom", "Achievement", "Spiritual Growth", "Divine Presence"],
      mood: "Peaceful",
      symbols: ["Flying", "Mountains", "Sky", "Golden Light"],
      biblicalRefs: ["Isaiah 40:31", "Psalm 91:4", "Matthew 17:1-2"]
    },
    {
      id: 2,
      title: "Walking Through a Garden",
      date: "2025-05-30",
      content: "I found myself in the most beautiful garden I've ever seen. Every flower was more vibrant than anything in real life. There was a path made of light that led to a magnificent tree in the center.",
      interpretation: "Gardens in dreams often represent spiritual growth and the fruits of your faith. The path of light symbolizes divine guidance, while the tree represents the tree of life and your connection to God's eternal promises.",
      themes: ["Spiritual Growth", "Divine Guidance", "Peace", "Eternal Life"],
      mood: "Joyful",
      symbols: ["Garden", "Light", "Flowers", "Tree", "Path"],
      biblicalRefs: ["Genesis 2:8", "Revelation 22:2", "John 15:5"]
    }
  ]);
  const [selectedDream, setSelectedDream] = useState(null);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Check audio support
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        setAudioSupported(true);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const testVoiceFunction = () => {
    console.log('=== VOICE TEST ===');
    console.log('Audio supported:', audioSupported);
    
    if (!isRecording) {
      console.log('Starting test...');
      setIsRecording(true);
      setRecordingTimer(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } else {
      console.log('Stopping test...');
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
    console.log('Processing audio to text');
    setIsProcessing(true);
    
    setTimeout(() => {
      const mockTexts = [
        "I had a vivid dream where I was walking through a beautiful garden filled with colorful flowers. Suddenly, I noticed a bright light in the sky that seemed to be calling to me. I felt an overwhelming sense of peace and love.",
        "In my dream, I was standing at the edge of a vast ocean. The water was crystal clear, and I could see all the way to the bottom. A voice spoke to me from the waves, telling me not to be afraid.",
        "I dreamed I was in a magnificent temple made of white stone. There were golden pillars everywhere, and the most beautiful music was playing. I felt like I was in the presence of something holy."
      ];
      
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      console.log('Setting text:', randomText.substring(0, 50) + '...');
      setDreamText(randomText);
      setIsProcessing(false);
    }, 2000);
  };

  const generateInterpretation = (dreamContent) => {
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
      
      const newDream = {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                className={`flex flex-col items-center space-y-1 ${currentScreen === 'home' ? 'text-purple-400' : 'text-white/60'}`}
              >
                <Moon className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </button>
              
              <button
                onClick={() => setCurrentScreen('input')}
                className={`flex flex-col items-center space-y-1 ${currentScreen === 'input' ? 'text-purple-400' : 'text-white/60'}`}
              >
                <Plus className="w-6 h-6" />
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
                onClick={() => setCurrentScreen('profile')}
                className={`flex flex-col items-center space-y-1 ${currentScreen === 'profile' ? 'text-purple-400' : 'text-white/60'}`}
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
                      onClick={testVoiceFunction}
                      className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold"
                      title="Test Recording"
                    >
                      TEST
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-purple-200 mb-2">
                      {isRecording 
                        ? `Recording... ${formatTime(recordingTimer)}` 
                        : 'Click TEST to simulate voice recording'
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
                      disabled={isRecording}
                      className="w-full h-32 p-4 bg-gray-800 border border-gray-600 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 transition-all"
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

  if (currentScreen === 'interpretation') {
    if (!selectedDream) return null;
    
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

  if (currentScreen === 'dreamDetail') {
    if (!selectedDream) return null;
    
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
