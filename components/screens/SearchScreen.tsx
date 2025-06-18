  // --- SEARCH SCREEN ---
  if (currentScreen === 'search') {
    const filteredDreams = dreams.filter(dream =>
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
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
              <h2 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>Search Dreams</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className={`w-full p-3 rounded-xl border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
                  placeholder="Search by keyword, tag, or content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              {filteredDreams.length === 0 && (
                <div className="text-gray-400 text-center py-8">No dreams found for your search.</div>
              )}
              {filteredDreams.map(dream => (
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
                  <div className="flex flex-wrap gap-2 mt-1">
                    {dream.tags.map(tag => (
                      <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }