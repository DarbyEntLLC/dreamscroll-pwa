// components/ui/DreamCard.tsx
import React from 'react';
import { Calendar, Bookmark, ChevronRight } from 'lucide-react';
import type { Dream } from '@/lib/types';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
  onBookmarkToggle?: (e: React.MouseEvent) => void;
}

/**
 * DreamCard Component
 * 
 * Displays a dream entry in card format with title, date, themes, and bookmark option
 * Used in journal listings and search results
 */
export function DreamCard({ dream, onClick, onBookmarkToggle }: DreamCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-gray-800/70 transition-all duration-200 border border-gray-700/50"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white flex-1 pr-2">{dream.title}</h3>
        {onBookmarkToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle(e);
            }}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${dream.isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="flex items-center text-gray-400 text-sm mb-3">
        <Calendar className="w-4 h-4 mr-1" />
        <span>{dream.date}</span>
        {dream.category && (
          <>
            <span className="mx-2">•</span>
            <span className="capitalize text-purple-400">{dream.category}</span>
          </>
        )}
      </div>
      
      {dream.themes && dream.themes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {dream.themes.map((theme, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs"
            >
              {theme}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <p className="text-gray-300 text-sm line-clamp-2 flex-1">
          {dream.content}
        </p>
        <ChevronRight className="w-5 h-5 text-gray-500 ml-2 flex-shrink-0" />
      </div>
    </div>
  );
}