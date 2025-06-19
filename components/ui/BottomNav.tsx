// components/ui/BottomNav.tsx
import React from 'react';
import { Home, BookOpen, PlusCircle, TrendingUp, User } from 'lucide-react';

interface BottomNavProps {
  activeScreen: string;
  setCurrentScreen: (screen: string) => void;  // Changed from onNavigate
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'input', icon: PlusCircle, label: 'Record' },
  { id: 'trends', icon: TrendingUp, label: 'Trends' },
  { id: 'profile', icon: User, label: 'Profile' }
];

/**
 * BottomNav Component
 * 
 * Fixed bottom navigation bar for mobile app navigation.
 * Highlights the active screen and provides quick access to main features.
 * 
 * @param activeScreen - Currently active screen ID
 * @param setCurrentScreen - Callback to change screens
 */
export function BottomNav({
  activeScreen,
  setCurrentScreen
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-gray-800/90 backdrop-blur-xl border-t border-gray-700/50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentScreen(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
              activeScreen === id 
                ? 'text-blue-400 bg-blue-500/20' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            aria-label={label}
            aria-current={activeScreen === id ? 'page' : undefined}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}