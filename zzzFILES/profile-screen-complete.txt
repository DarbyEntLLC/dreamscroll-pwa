// components/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { 
  User, Camera, Mail, Shield, LogOut, Moon, Sun, 
  ChevronRight, Edit3, Save, X, Bell, HelpCircle 
} from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  totalDreams: number;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (screen: string) => void;
}

export function ProfileScreen({ 
  userProfile, 
  totalDreams,
  onUpdateProfile,
  onNavigate
}: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [showLLMOptions, setShowLLMOptions] = useState(false);

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-transparent p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                {editedProfile.profileImage ? (
                  <img 
                    src={editedProfile.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
            {isEditing && (
              <>
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-2 cursor-pointer transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                </label>
              </>
            )}
          </div>

          {!isEditing ? (
            <>
              <h2 className="text-xl font-semibold text-white mb-1">{userProfile.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{userProfile.subtitle}</p>
            </>
          ) : (
            <div className="w-full max-w-sm space-y-3 mb-4">
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Your name"
              />
              <input
                type="text"
                value={editedProfile.subtitle}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Your subtitle"
              />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{totalDreams}</p>
              <p className="text-gray-400 text-xs">Dreams</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {Math.floor(totalDreams * 0.3)}
              </p>
              <p className="text-gray-400 text-xs">Insights</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-gray-400 text-xs">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-6">
        {/* AI Model Selection */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">AI Interpreter</h3>
          <button
            onClick={() => isEditing && setShowLLMOptions(!showLLMOptions)}
            disabled={!isEditing}
            className={`w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center justify-between ${
              isEditing ? 'hover:bg-gray-800/70' : 'opacity-75'
            } transition-all`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">{editedProfile.selectedLLM}</p>
                <p className="text-gray-400 text-xs">AI Model for interpretations</p>
              </div>
            </div>
            {isEditing && <ChevronRight className="w-5 h-5 text-gray-400" />}
          </button>

          {showLLMOptions && isEditing && (
            <div className="mt-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
              {(['GPT-4', 'Claude 3', 'Gemini 1.5'] as const).map((llm) => (
                <button
                  key={llm}
                  onClick={() => {
                    setEditedProfile(prev => ({ ...prev, selectedLLM: llm }));
                    setShowLLMOptions(false);
                  }}
                  className={`w-full p-3 text-left hover:bg-gray-700/50 transition-colors ${
                    editedProfile.selectedLLM === llm ? 'bg-purple-600/20 text-purple-400' : 'text-gray-300'
                  }`}
                >
                  {llm}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          <button className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800/70 transition-all">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-white font-medium">Notifications</p>
                <p className="text-gray-400 text-xs">Dream reminders & insights</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800/70 transition-all">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-white font-medium">Appearance</p>
                <p className="text-gray-400 text-xs">Theme & display settings</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800/70 transition-all">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-white font-medium">Help & Support</p>
                <p className="text-gray-400 text-xs">FAQs and contact</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => onNavigate('auth')}
          className="w-full mt-8 bg-red-600/20 border border-red-600/50 rounded-lg p-4 flex items-center justify-center gap-3 text-red-400 hover:bg-red-600/30 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        {/* App Version */}
        <p className="text-center text-gray-600 text-xs mt-6">
          DreamScroll v0.1.0
        </p>
      </div>
    </div>
  );
}