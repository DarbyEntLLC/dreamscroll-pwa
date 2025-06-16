'use client';

import { useState } from 'react';
import { Home, BookOpen, PlusCircle, TrendingUp, User, Moon, Sun } from 'lucide-react';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [darkMode, setDarkMode] = useState(true);

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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>DreamScroll</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Biblical Dream Interpretation</p>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-10 h-10 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl flex items-center justify-center transition-colors`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-24">
        <div className="text-center py-12">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Welcome to DreamScroll! 👋
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8`}>
            Current Screen: <span className="text-blue-400 font-semibold">{currentScreen}</span>
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button 
              onClick={() => setCurrentScreen('home')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentScreen('input')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Record Dream
            </button>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-2`}>
              Try the light/dark mode toggle above! ☀️🌙
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
