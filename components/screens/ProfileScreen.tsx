  // --- PROFILE SCREEN ---
  if (currentScreen === 'profile') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${themeClasses.textPrimary}`}>Profile</h2>
              <button
                onClick={() => setIsEditingProfile(e => !e)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center gap-1"
              >
                <Edit3 className="w-4 h-4" /> {isEditingProfile ? "Cancel" : "Edit"}
              </button>
            </div>
            {!isEditingProfile ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center">
                    {userProfile.profileImage ? (
                      <img src={userProfile.profileImage} alt="Profile" className="rounded-full w-20 h-20 object-cover" />
                    ) : (
                      <User className="text-white w-10 h-10" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{userProfile.name}</div>
                  <div className="text-blue-400">{userProfile.subtitle}</div>
                  <div className="text-xs text-gray-400 mt-1">LLM: {userProfile.selectedLLM}</div>
                </div>
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <button
                    onClick={() => setCurrentScreen('auth')}
                    className="w-full text-red-400 border border-red-400 hover:bg-red-400/20 py-2 rounded-xl font-semibold"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center border-4 border-blue-300 hover:opacity-80 transition-all"
                  >
                    {userProfile.profileImage ? (
                      <img src={userProfile.profileImage} alt="Profile" className="rounded-full w-20 h-20 object-cover" />
                    ) : (
                      <Camera className="text-white w-8 h-8" />
                    )}
                  </button>
                  <span className="text-xs text-gray-400 mt-1">Tap to change photo</span>
                </div>
                <input
                  type="text"
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                  value={userProfile.name}
                  onChange={e => setUserProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="Name"
                />
                <input
                  type="text"
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                  value={userProfile.subtitle}
                  onChange={e => setUserProfile(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="Subtitle"
                />
                <select
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} focus:outline-none focus:border-blue-500`}
                  value={userProfile.selectedLLM}
                  onChange={e => setUserProfile(p => ({ ...p, selectedLLM: e.target.value as "GPT-4" | "Claude 3" | "Gemini 1.5" }))}
                >
                  <option value="GPT-4">GPT-4</option>
                  <option value="Claude 3">Claude 3</option>
                  <option value="Gemini 1.5">Gemini 1.5</option>
                </select>
                <button
                  onClick={saveProfile}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>
        </div>
        <BottomNav activeScreen="profile" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }