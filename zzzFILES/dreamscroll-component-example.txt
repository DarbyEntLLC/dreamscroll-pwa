// components/dreams/DreamCard.tsx
import React from 'react';
import { Bookmark } from 'lucide-react';
import { Dream } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface DreamCardProps {
  dream: Dream;
  onSelect: (dream: Dream) => void;
  onToggleBookmark: (dreamId: number) => void;
  className?: string;
}

/**
 * DreamCard Component
 * 
 * Displays a single dream entry in a card format with bookmark functionality.
 * Used in both the home screen (recent dreams) and journal view.
 * 
 * @param dream - The dream object to display
 * @param onSelect - Callback when dream is clicked
 * @param onToggleBookmark - Callback to toggle bookmark status
 * @param className - Additional CSS classes
 * 
 * @example
 * <DreamCard
 *   dream={dreamData}
 *   onSelect={(dream) => navigateTo('interpretation', dream)}
 *   onToggleBookmark={handleBookmarkToggle}
 * />
 */
export function DreamCard({ 
  dream, 
  onSelect, 
  onToggleBookmark,
  className = '' 
}: DreamCardProps) {
  const handleCardClick = () => {
    onSelect(dream);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onToggleBookmark(dream.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        rounded-xl p-4 border bg-gray-800/50 border-gray-700/50 
        flex flex-col gap-1 cursor-pointer
        hover:bg-gray-800/70 transition-all duration-200
        ${className}
      `}
      role="article"
      aria-label={`Dream: ${dream.title}`}
    >
      {/* Header Row */}
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={handleBookmarkClick}
          className="p-1 hover:bg-gray-700/50 rounded transition-colors"
          aria-label={dream.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark
            className={`w-4 h-4 ${
              dream.isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
            }`}
          />
        </button>
        
        <span className="font-semibold text-white flex-1 truncate">
          {dream.title}
        </span>
        
        <time className="text-xs text-gray-400" dateTime={dream.timestamp.toISOString()}>
          {formatDate(dream.timestamp)}
        </time>
      </div>

      {/* Content Preview */}
      <div className="text-gray-300 text-sm line-clamp-2">
        {dream.content}
      </div>

      {/* Tags */}
      {dream.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {dream.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg"
            >
              {tag}
            </span>
          ))}
          {dream.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{dream.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Metadata Row */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        {dream.confidence && (
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            {dream.confidence}% confidence
          </span>
        )}
        {dream.category && (
          <span className="capitalize">{dream.category}</span>
        )}
      </div>
    </div>
  );
}

// Memoized version for performance with large lists
export const MemoizedDreamCard = React.memo(DreamCard, (prevProps, nextProps) => {
  return (
    prevProps.dream.id === nextProps.dream.id &&
    prevProps.dream.isBookmarked === nextProps.dream.isBookmarked &&
    prevProps.className === nextProps.className
  );
});