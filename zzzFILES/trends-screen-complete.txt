// components/screens/TrendsScreen.tsx
import React, { useState } from 'react';
import { 
  TrendingUp, Calendar, BarChart3, PieChart, 
  ArrowUp, ArrowDown, ChevronRight, Filter,
  Moon, Sun, Cloud, Star
} from 'lucide-react';
import type { Dream } from '@/lib/types';

interface TrendsScreenProps {
  dreams: Dream[];
  onNavigate: (screen: string) => void;
}

export function TrendsScreen({ dreams, onNavigate }: TrendsScreenProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  // Calculate date range
  const now = new Date();
  const startDate = new Date();
  if (timeRange === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (timeRange === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  } else {
    startDate.setFullYear(2000); // All time
  }

  // Filter dreams by time range
  const filteredDreams = dreams.filter(
    dream => new Date(dream.timestamp) >= startDate
  );

  // Calculate statistics
  const totalDreams = filteredDreams.length;
  const avgPerWeek = totalDreams / (timeRange === 'week' ? 1 : timeRange === 'month' ? 4 : 52);
  
  // Theme frequency
  const themeCount = filteredDreams.reduce((acc, dream) => {
    dream.themes.forEach(theme => {
      acc[theme] = (acc[theme] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topThemes = Object.entries(themeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Emotional tone distribution
  const toneCount = filteredDreams.reduce((acc, dream) => {
    acc[dream.emotionalTone] = (acc[dream.emotionalTone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Time of day analysis
  const timeOfDay = filteredDreams.reduce((acc, dream) => {
    const hour = new Date(dream.timestamp).getHours();
    if (hour >= 5 && hour < 12) acc.morning++;
    else if (hour >= 12 && hour < 17) acc.afternoon++;
    else if (hour >= 17 && hour < 22) acc.evening++;
    else acc.night++;
    return acc;
  }, { morning: 0, afternoon: 0, evening: 0, night: 0 });

  // Category distribution
  const categoryCount = filteredDreams.reduce((acc, dream) => {
    acc[dream.category] = (acc[dream.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-transparent p-6">
        <div className="flex items-center gap-4 mb-6">
          <TrendingUp className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Dream Insights</h1>
            <p className="text-gray-400 text-sm">Discover patterns in your spiritual journey</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="grid grid-cols-3 gap-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Dreams</p>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalDreams}</p>
            <p className="text-xs text-gray-500 mt-1">
              {avgPerWeek.toFixed(1)} per week
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Most Active</p>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">Night</p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((timeOfDay.night / totalDreams) * 100)}% of dreams
            </p>
          </div>
        </div>

        {/* Top Themes */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Top Themes
          </h3>
          <div className="space-y-3">
            {topThemes.map(([theme, count], index) => (
              <div key={theme} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-4">{index + 1}</span>
                  <span className="text-white">{theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                      style={{ width: `${(count / totalDreams) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Tone Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-400" />
            Emotional Patterns
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(toneCount).map(([tone, count]) => (
              <div key={tone} className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{tone}</p>
                <p className="text-white font-semibold text-lg">
                  {Math.round((count / totalDreams) * 100)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Time of Day Analysis */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-4">Recording Patterns</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Morning</p>
              <p className="text-white font-semibold">{timeOfDay.morning}</p>
            </div>
            <div className="text-center">
              <Sun className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Afternoon</p>
              <p className="text-white font-semibold">{timeOfDay.afternoon}</p>
            </div>
            <div className="text-center">
              <Cloud className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Evening</p>
              <p className="text-white font-semibold">{timeOfDay.evening}</p>
            </div>
            <div className="text-center">
              <Moon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Night</p>
              <p className="text-white font-semibold">{timeOfDay.night}</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Dream Categories</h3>
          <div className="space-y-2">
            {Object.entries(categoryCount).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between py-2">
                <span className="text-gray-300 capitalize">{category}</span>
                <span className="text-purple-400 font-medium">{count} dreams</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}