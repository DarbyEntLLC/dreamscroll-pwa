  // --- TRENDS SCREEN ---
  if (currentScreen === 'trends') {
    // Simple trends visualization mockup
    const tagCounts: Record<string, number> = {};
    dreams.forEach(dream => dream.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }));
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Home
            </button>
            <div className="mb-4">
              <h2 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>Spiritual Dream Trends</h2>
              <p className={themeClasses.textMuted}>See which themes are most common in your dreams.</p>
            </div>
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Most Frequent Tags</h3>
                {sortedTags.length === 0 ? (
                  <div className="text-gray-400">No dream tags yet.</div>
                ) : (
                  <div className="space-y-2">
                    {sortedTags.map(([tag, count]) => (
                      <div key={tag} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-300 bg-blue-700/40 px-2 py-0.5 rounded">{tag}</span>
                        <div className="flex-1 bg-gray-700/40 rounded h-2 mx-2">
                          <div
                            className="bg-blue-400 rounded h-2"
                            style={{ width: `${Math.min(90, count * 30)}px` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <BottomNav activeScreen="trends" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }