// components/screens/InputScreen.tsx
import React, { useState } from 'react';
import { 
  Mic, MicOff, Send, X, Volume2, Sparkles, 
  AlertCircle, Loader2, ChevronDown, Moon 
} from 'lucide-react';

interface InputScreenProps {
  dreamInput: string;
  setDreamInput: (value: string) => void;
  isListening: boolean;
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  onToggleVoice: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function InputScreen({ 
  dreamInput,
  setDreamInput,
  isListening,
  isRecording,
  recordingTime,
  audioBlob,
  onToggleVoice,
  onStartRecording,
  onStopRecording,
  onSubmit,
  onCancel
}: InputScreenProps) {
  const [showTips, setShowTips] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const dreamPrompts = [
    "Describe the setting and atmosphere...",
    "Who or what appeared in your dream?",
    "What emotions did you feel?",
    "Were there any symbols or repeated themes?",
    "How did the dream end?"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-transparent p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Moon className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Record Dream</h1>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-1">Capture every detail</p>
              <p className="text-gray-400">
                The more details you provide, the better the interpretation. 
                Include emotions, symbols, colors, and any biblical elements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        {/* Text Input Area */}
        <div className="mb-6">
          <div className="relative">
            <textarea
              value={dreamInput}
              onChange={(e) => setDreamInput(e.target.value)}
              placeholder="Start describing your dream..."
              className="w-full h-48 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {dreamInput.length} characters
            </div>
          </div>

          {/* Voice Input Indicator */}
          {isListening && (
            <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Listening... Speak clearly
            </div>
          )}
        </div>

        {/* Audio Recording Status */}
        {audioBlob && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white text-sm font-medium">Audio recorded</p>
                <p className="text-gray-400 text-xs">Ready to submit with text</p>
              </div>
            </div>
            <button
              onClick={() => {/* Play audio logic */}}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Play
            </button>
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-lg font-medium transition-all ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 hover:bg-gray-800/70'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Recording ({formatTime(recordingTime)})
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Record Audio
              </>
            )}
          </button>

          <button
            onClick={onToggleVoice}
            className={`flex items-center justify-center px-6 rounded-lg transition-all ${
              isListening 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 hover:bg-gray-800/70'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* Dream Prompts */}
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 mb-4 text-gray-300 hover:bg-gray-800/50 transition-all"
        >
          <span className="text-sm">Need help remembering details?</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showTips ? 'rotate-180' : ''}`} />
        </button>

        {showTips && (
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm font-medium mb-3">Consider these aspects:</p>
            <ul className="space-y-2">
              {dreamPrompts.map((prompt, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-400 text-sm">
                  <span className="text-purple-400">•</span>
                  {prompt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submit Actions */}
      <div className="p-6 bg-gradient-to-t from-gray-900 to-transparent">
        <button
          onClick={onSubmit}
          disabled={!dreamInput.trim() && !audioBlob}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-4 font-semibold flex items-center justify-center gap-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          Interpret Dream
        </button>
        
        <button
          onClick={onCancel}
          className="w-full mt-3 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}