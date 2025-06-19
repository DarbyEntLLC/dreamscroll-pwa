// components/screens/HomeScreen.tsx
import React from 'react';
import { PlusCircle, TrendingUp, BookOpen, Calendar, Sparkles, Moon } from 'lucide-react';
import type { Dream, UserProfile } from '@/lib/types';
import { DreamCard } from '@/components/ui/DreamCard';

interface HomeScreenProps {
  userProfile: UserProfile;
  recentDreams: Dream[];
  totalDreams: number;
  onNavigate: (screen: string) => void;
  onSelectDream: (dream: Dream) => void;
}

export function HomeScreen({ 
  userProfile, 
  recentDreams, 
  totalDreams, 
  onNavigate, 
  onSelectDream 
}: HomeScreenProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-transparent p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {userProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-400 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{totalDreams}</p>
            <p className="text-gray-400 text-sm">Total Dreams</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Moon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-semibold">{recentDreams.length}</p>
            <p className="text-gray-400 text-xs">This Week</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-semibold">
              {recentDreams.filter(d => d.isBookmarked).length}
            </p>
            <p className="text-gray-400 text-xs">Bookmarked</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Active</p>
            <p className="text-gray-400 text-xs">Streak</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* Primary Action Button */}
        <button
          onClick={() => onNavigate('input')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center gap-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg mb-8"
        >
          <PlusCircle className="w-6 h-6" />
          Record New Dream
        </button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => onNavigate('journal')}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-800/70 transition-all"
          >
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <p className="text-white font-medium">Dream Journal</p>
              <p className="text-gray-400 text-xs">View all entries</p>
            </div>
          </button>
          
          <button
            onClick={() => onNavigate('trends')}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-800/70 transition-all"
          >
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <p className="text-white font-medium">Insights</p>
              <p className="text-gray-400 text-xs">View patterns</p>
            </div>
          </button>
        </div>

        {/* Recent Dreams */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Dreams</h2>
            {totalDreams > 3 && (
              <button
                onClick={() => onNavigate('journal')}
                className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
              >
                View all →
              </button>
            )}
          </div>

          {recentDreams.length === 0 ? (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 text-center">
              <Moon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No dreams recorded yet</p>
              <button
                onClick={() => onNavigate('input')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Record your first dream →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onClick={() => onSelectDream(dream)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Inspirational Quote */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 text-center">
          <p className="text-gray-300 italic mb-2">
            "For God speaks in one way, and in two, though man does not perceive it. 
            In a dream, in a vision of the night..."
          </p>
          <p className="text-gray-400 text-sm">- Job 33:14-15</p>
        </div>
      </div>
    </div>
  );
}