// components/screens/LoadingScreen.tsx
import React from 'react';
import { DreamScrollLogo } from '@/components/ui/DreamScrollLogo';

/**
 * LoadingScreen Component
 * 
 * Full-screen loading display shown during app initialization
 * Features animated logo and loading progress
 */
export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <DreamScrollLogo size={80} />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
          DreamScroll
        </h1>
        <p className="text-gray-400 text-sm animate-pulse">
          Unveiling Divine Messages...
        </p>
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}