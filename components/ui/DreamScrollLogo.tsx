// components/ui/DreamScrollLogo.tsx
import React from 'react';
import { Moon } from 'lucide-react';

interface DreamScrollLogoProps {
  size?: number;
  className?: string;
}

/**
 * DreamScrollLogo Component
 * 
 * The app's logo featuring a moon icon with gradient background.
 * Used in navigation, loading screens, and branding.
 * 
 * @param size - Logo size in pixels (default: 40)
 * @param className - Additional CSS classes
 */
export function DreamScrollLogo({ size = 40, className = "" }: DreamScrollLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%)'
        }}
      />
      <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
        <Moon className="text-white" style={{ width: size * 0.4, height: size * 0.4 }} />
      </div>
    </div>
  );
}