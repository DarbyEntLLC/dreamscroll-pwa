'use client';

import { useState, useEffect, useRef } from 'react';
import { Home, BookOpen, PlusCircle, TrendingUp, User, Moon, Sun, Mic, MicOff, Send, ArrowLeft, Brain, Sparkles } from 'lucide-react';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Check for audio support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudioSupported('MediaRecorder' in window);
    }
  }, []);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const startRecording = () => {
    setIsRecording(true);
    addNotification('Recording started! 🎤', 'success');
  };

  const stopRecording = () => {
    setIsRecording(false);
    addNotification('Recording stopped', 'info');
  };

  const processDream = () => {
    if (!dreamText.trim()) return;
    addNotification('Dream interpretation complete! ✨', 'success');
    setDreamText('');
    setCurrentScreen('home');
  };

  const NotificationBar = () => (
    notifications.length > 0 && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-2 p-3 rounded-xl backdrop-blur-xl border ${
              notification.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
              'bg-blue-500/20 border-blue-500/30 text-blue-300'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    )
  );

  const BottomNav = () => (
    <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-200'}`}>
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
              currentScreen === id 
                ? 'text-blue-400 bg-blue-500/20' 
                : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // INPUT SCREEN
  if (currentScreen === 'input') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <NotificationBar />
        
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} p-6`}>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`w-10 h-10 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl flex items-center justify-center transition-colors`}
            >
              <ArrowLeft className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Record Dream</h2>
            <div className="w-10 h-10"></div>
          </div>
        </div>

        <div className="p-6 pb-24 space-y-6">
          {/* AI Model Selection */}
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
            <h4 className="text-purple-300 font-medium mb-2 flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Interpretation Model
            </h4>
            <select className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} text-sm`}>
              <option value="GPT-4">GPT-4 (OpenAI) - Most balanced</option>
              <option value="Claude">Claude (Anthropic) - Best reasoning</option>
              <option value="Gemini">Gemini (Google) - Creative insights</option>
            </select>
          </div>

          {/* Recording Section */}
          <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-xl rounded-2xl p-6 border ${darkMode ? 'border-gray-700/50' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Describe Your Dream</h3>
            
            {/* Voice Recording Button */}
            <div className="text-center mb-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!audioSupported}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse scale-110' 
                    : audioSupported
                    ? 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
              </button>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                {isRecording 
                  ? '🎤 Recording your dream...' 
                  : audioSupported 
                  ? 'Tap to start voice recording'
                  : 'Voice recording not available - please type below'
                }
              </p>
            </div>

            {/* Text Input */}
            <div className="relative">
              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="Type your dream here or use voice recording above..."
                disabled={isRecording}
                rows={8}
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {dreamText.trim() && !isRecording && (
                <button
                  onClick={processDream}
                  className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 p-3 rounded-full transition-all shadow-lg hover:scale-105"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
            <h4 className="text-blue-300 font-medium mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Recording Tips
            </h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Include emotions and colors you remember</li>
              <li>• Describe the setting and people involved</li>
              <li>• Note any symbols or unusual elements</li>
            </ul>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // HOME SCREEN (Default)
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <NotificationBar />
      
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>DreamScroll</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Biblical Dream Interpretation</p>
          </div>
          <button 
            onClick={() => {
              setDarkMode(!darkMode);
              addNotification(`${darkMode ? 'Light' : 'Dark'} mode enabled`, 'info');
            }}
            className={`w-10 h-10 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl flex items-center justify-center transition-colors`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-24">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30 mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome to DreamScroll! 👋
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            Ready to discover the spiritual meaning behind your dreams?
          </p>
          <button 
            onClick={() => setCurrentScreen('input')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Record New Dream ✨
          </button>
        </div>

        <div className="text-center">
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            Current Screen: <span className="text-blue-400 font-semibold">{currentScreen}</span>
          </p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            Use the navigation below to explore different screens
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
