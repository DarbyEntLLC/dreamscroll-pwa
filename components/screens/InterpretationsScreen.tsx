  // --- INTERPRETATION SCREEN ---
  if (currentScreen === 'interpretation') {
    const dream = selectedDream || dreams[0];
    if (!dream) {
      return (
        <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen flex items-center justify-center`}>
          <NotificationBar notifications={notifications} removeNotification={removeNotification} />
          <div className="text-center">
            <p className="text-gray-400">No dream selected.</p>
            <button
              onClick={() => setCurrentScreen('journal')}
              className="mt-6 text-blue-400"
            >
              Go to Journal
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('journal')}
              className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Journal
            </button>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{dream.title}</h2>
              <Bookmark
                className={`w-6 h-6 cursor-pointer ${dream.isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={() => toggleBookmark(dream.id)}
              />
            </div>
            <div className={`${themeClasses.cardBackground} rounded-xl p-4 border ${themeClasses.cardBorder}`}>
              <div className="mb-3 text-sm text-gray-400">{dream.date}</div>
              <div className="mb-4 whitespace-pre-line">{dream.content}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {dream.tags.map(tag => (
                  <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg">{tag}</span>
                ))}
              </div>
              <div className="mb-4">
                <div className="flex gap-4 mb-2">
                  <span className="text-xs text-gray-400">Mood: <span className="font-semibold text-blue-300">{dream.mood}</span></span>
                  <span className="text-xs text-gray-400">Confidence: <span className="font-semibold text-green-400">{dream.confidence}%</span></span>
                </div>
                <div className="flex gap-4 mb-2">
                  <span className="text-xs text-gray-400">Category: <span className="font-semibold text-purple-300">{dream.category}</span></span>
                  <span className="text-xs text-gray-400">Emotional Tone: <span className="font-semibold text-pink-300">{dream.emotionalTone}</span></span>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-blue-400 mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> AI Interpretation
                </div>
                <div className="text-sm whitespace-pre-line">{dream.interpretation}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-purple-400 mb-1 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Biblical References
                </div>
                {dream.biblicalRefs.map((ref, i) => (
                  <div key={i} className="mb-2 p-2 rounded bg-purple-950/40 border border-purple-800 text-xs">
                    <div className="font-semibold text-purple-300">{ref.verse}</div>
                    <div className="italic text-gray-300">{ref.text}</div>
                    <div className="text-gray-400">{ref.relevance}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }