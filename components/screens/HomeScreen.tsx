 // --- HOME SCREEN ---
  if (currentScreen === 'home') {
    const recentDreams = dreams.slice(0, 2);
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DreamScrollLogo size={40} />
                <span className={`font-bold text-xl ${themeClasses.textPrimary}`}>DreamScroll</span>
              </div>
              <button
                onClick={() => setDarkMode(d => !d)}
                className="p-2 rounded-full bg-gray-700/40 hover:bg-gray-600 transition-all"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
            </div>
            <div className="mb-8">
              <div className={`text-xl font-semibold mb-1 ${themeClasses.textPrimary}`}>
                Welcome, {userProfile.name.split(' ')[0]}!
              </div>
              <div className={themeClasses.textMuted}>
                Ready to record and explore your spiritual dreams?
              </div>
            </div>
            <div className="mb-6">
              <button
                onClick={() => setCurrentScreen('input')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl font-bold shadow-lg text-lg flex items-center justify-center gap-2 transition-all"
              >
                <PlusCircle className="w-6 h-6" /> Record a New Dream
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${themeClasses.textSecondary}`}>Recent Dreams</span>
                <button
                  onClick={() => setCurrentScreen('journal')}
                  className="text-sm text-blue-400 hover:text-blue-200"
                >
                  See All
                </button>
              </div>
              <div className="space-y-4">
                {recentDreams.map(dream => (
                  <div
                    key={dream.id}
                    className={`rounded-xl p-4 border ${themeClasses.cardBackground} ${themeClasses.cardBorder} flex flex-col gap-1 cursor-pointer`}
                    onClick={() => {
                      setSelectedDream(dream);
                      setCurrentScreen('interpretation');
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark
                        className={`w-4 h-4 mr-1 ${dream.isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
                        onClick={e => {
                          e.stopPropagation();
                          toggleBookmark(dream.id);
                        }}
                      />
                      <span className={`font-semibold ${themeClasses.textPrimary}`}>{dream.title}</span>
                      <span className="ml-auto text-xs text-gray-400">{dream.date}</span>
                    </div>
                    <div className={`${themeClasses.textSecondary} text-sm truncate`}>
                      {dream.content}
                    </div>
                  </div>
                ))}
                {recentDreams.length === 0 && (
                  <div className="py-8 text-center text-gray-400">No dreams recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <BottomNav activeScreen="home" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }