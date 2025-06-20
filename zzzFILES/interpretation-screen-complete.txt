// components/screens/InterpretationScreen.tsx
import React, { useState } from 'react';
import { 
  ArrowLeft, Bookmark, Share2, Trash2, Calendar, 
  Brain, BookOpen, Sparkles, Heart, BarChart, 
  Copy, Check, Loader2, ChevronDown, ChevronUp
} from 'lucide-react';
import type { Dream } from '@/lib/types';

interface InterpretationScreenProps {
  dream: Dream;
  isProcessing: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onDelete: () => void;
}

export function InterpretationScreen({ 
  dream, 
  isProcessing,
  onBack, 
  onToggleBookmark, 
  onDelete 
}: InterpretationScreenProps) {
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    interpretation: true,
    biblical: true,
    themes: true,
    details: false
  });

  const copyVerse = (verse: string, text: string) => {
    const fullText = `${verse}\n"${text}"`;
    navigator.clipboard.writeText(fullText);
    setCopiedVerse(verse);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Interpreting Your Dream...
          </h2>
          <p className="text-gray-400 text-sm">
            Analyzing symbols and finding biblical connections
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-transparent p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <Bookmark className={`w-5 h-5 ${dream.isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dream Title and Date */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">{dream.title}</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{dream.date}</span>
            <span className="mx-2">•</span>
            <span className="capitalize text-purple-400">{dream.category}</span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
          <span className="text-gray-300 text-sm">Interpretation Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full"
                style={{ width: `${dream.confidence}%` }}
              />
            </div>
            <span className="text-green-400 text-sm font-medium">{dream.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Dream Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-gray-400" />
            Your Dream
          </h3>
          <p className="text-gray-300 leading-relaxed">{dream.content}</p>
        </div>

        {/* AI Interpretation */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('interpretation')}
            className="w-full flex items-center justify-between text-white font-medium mb-3"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Interpretation
            </span>
            {expandedSections.interpretation ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>
          {expandedSections.interpretation && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{dream.interpretation}</p>
            </div>
          )}
        </div>

        {/* Biblical References */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('biblical')}
            className="w-full flex items-center justify-between text-white font-medium mb-3"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Biblical References
            </span>
            {expandedSections.biblical ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>
          {expandedSections.biblical && (
            <div className="space-y-3">
              {dream.biblicalRefs.map((ref, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-purple-400 font-medium">{ref.verse}</h4>
                    <button
                      onClick={() => copyVerse(ref.verse, ref.text)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedVerse === ref.verse ? 
                        <Check className="w-4 h-4 text-green-400" /> : 
                        <Copy className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  <p className="text-gray-300 italic mb-2">"{ref.text}"</p>
                  <p className="text-gray-500 text-sm">{ref.relevance}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Themes and Symbols */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('themes')}
            className="w-full flex items-center justify-between text-white font-medium mb-3"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Themes & Symbols
            </span>
            {expandedSections.themes ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>
          {expandedSections.themes && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              {dream.themes.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Major Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {dream.themes.map((theme, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {dream.symbols.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Symbols Present</p>
                  <div className="flex flex-wrap gap-2">
                    {dream.symbols.map((symbol, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                        {symbol}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div>
          <button
            onClick={() => toggleSection('details')}
            className="w-full flex items-center justify-between text-white font-medium mb-3"
          >
            <span className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-green-400" />
              Analysis Details
            </span>
            {expandedSections.details ? 
              <ChevronUp className="w-4 h-4 text-gray-400" /> : 
              <ChevronDown className="w-4 h-4 text-gray-400" />
            }
          </button>
          {expandedSections.details && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Emotional Tone</p>
                  <p className="text-white font-medium">{dream.emotionalTone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Overall Mood</p>
                  <p className="text-white font-medium">{dream.mood}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white font-medium capitalize">{dream.category}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Viewed</p>
                  <p className="text-white font-medium">
                    {new Date(dream.lastViewed).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {dream.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {dream.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg mb-2">Delete Dream?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. Your dream and its interpretation will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}