// components/screens/JournalScreen.tsx
import React, { useState } from 'react';
import { Search, Filter, Calendar, Bookmark, BookOpen, ArrowLeft } from 'lucide-react';
import type { Dream } from '@/lib/types';
import { DreamCard } from '@/components/ui/DreamCard';

interface JournalScreenProps {
  dreams: Dream[];
  onSelectDream: (dream: Dream) => void;
  onToggleBookmark: (dreamId: number) => void;
  onDeleteDream: (dreamId: number) => void;
}

export function JournalScreen({ 
  dreams, 
  onSelectDream, 
  onToggleBookmark, 
  onDeleteDream 
}: JournalScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'bookmarked' | 'recent'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter dreams based on search and filter criteria
  const filteredDreams = dreams.filter(dream => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    const matchesFilter = 
      filterBy === 'all' || 
      (filterBy === 'bookmarked' && dream.isBookmarked) ||
      (filterBy === 'recent' && 
        new Date(dream.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);

    return matchesSearch && matchesFilter;
  });

  // Group dreams by month
  const groupedDreams = filteredDreams.reduce((acc, dream) => {
    const monthYear = new Date(dream.timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(dream);
    return acc;
  }, {} as Record<string, Dream[]>);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-transparent p-6">
        <div className="flex items-center gap-4 mb-6">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Dream Journal</h1>
            <p className="text-gray-400 text-sm">
              {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'} recorded
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search dreams, themes, or symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Filter Options */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800/70 transition-all"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          {filterBy !== 'all' && (
            <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm">
              {filterBy === 'bookmarked' ? 'Bookmarked' : 'Recent (7 days)'}
            </span>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-4">
            <p className="text-gray-300 text-sm font-medium mb-3">Filter by:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFilterBy('all')}
                className={`py-2 px-3 rounded-lg text-sm transition-all ${
                  filterBy === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All Dreams
              </button>
              <button
                onClick={() => setFilterBy('bookmarked')}
                className={`py-2 px-3 rounded-lg text-sm transition-all ${
                  filterBy === 'bookmarked' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Bookmarked
              </button>
              <button
                onClick={() => setFilterBy('recent')}
                className={`py-2 px-3 rounded-lg text-sm transition-all ${
                  filterBy === 'recent' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Recent
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dreams List */}
      <div className="px-6 pb-6">
        {filteredDreams.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">
              {searchQuery ? 'No dreams match your search' : 'No dreams recorded yet'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedDreams).map(([monthYear, monthDreams]) => (
              <div key={monthYear}>
                <h3 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {monthYear}
                </h3>
                <div className="space-y-4">
                  {monthDreams.map((dream) => (
                    <DreamCard
                      key={dream.id}
                      dream={dream}
                      onClick={() => onSelectDream(dream)}
                      onBookmarkToggle={() => onToggleBookmark(dream.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}