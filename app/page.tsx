}

  // For any other screen, show a simple message with navigation
  return (
    <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
      <NotificationBar />
      <div className="min-h-screen">
        <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentScreen('home')} className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}>
              <ArrowLeft className={`w-5 h-5 ${getTextSecondaryClass()}`} />
            </button>
            <h2 className={`text-xl font-bold ${getTextPrimaryClass()}`}>DreamScroll</h2>
            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                addNotification(`${darkMode ? 'Light' : 'Dark'} mode ${darkMode ? 'enabled' : 'disabled'}`, 'info');
              }}
              className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
            >
              {darkMode ? <Sun className={`w-5 h-5 ${getTextSecondaryClass()}`} /> : <Moon className={`w-5 h-5 ${getTextSecondaryClass()}`} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center p-8">
            <DreamScrollLogo size={64} className="mx-auto mb-6" />
            <h1 className={`text-3xl font-bold ${getTextPrimaryClass()} mb-4`}>DreamScroll</h1>
            <p className={`text-lg ${getTextSecondaryClass()} mb-2`}>Biblical Dream Interpretation</p>
            <p className={`${getTextMutedClass()} mb-8`}>Current Screen: {currentScreen}</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('input')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Record</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('journal')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Journal</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('profile')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <h3 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-2`}>App Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>Voice Recording & Speech-to-Text</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>AI Model Selection (GPT-4, Claude, Gemini)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>Biblical Dream Interpretation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>Profile Editing with Image Upload</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>Dream Journaling & Bookmarking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>Light/Dark Mode Toggle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>Spiritual Analytics & Trends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className={getTextSecondaryClass()}>Responsive Mobile & Desktop Design</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className={`${getTextMutedClass()} text-sm mb-2`}>Try the light/dark mode toggle above!</p>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs ${getTextMutedClass()}`}>Dark Mode</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${!darkMode ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs ${getTextMutedClass()}`}>Light Mode</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <BottomNav activeScreen={currentScreen} />
      </div>
    </div>
  );
}

  // JOURNAL SCREEN
  if (currentScreen === 'journal') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen">
          <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}>
                <ArrowLeft className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
              <h2 className={`text-xl font-bold ${getTextPrimaryClass()}`}>Dream Journal</h2>
              <button onClick={() => setCurrentScreen('search')} className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}>
                <Search className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className="space-y-4">
              {dreams.map((dream) => (
                <div
                  key={dream.id}
                  className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()} hover:opacity-80 transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 
                        onClick={() => {
                          setSelectedDream(dream);
                          setCurrentScreen('interpretation');
                        }}
                        className={`text-lg font-bold ${getTextPrimaryClass()} cursor-pointer hover:text-blue-300 transition-colors`}
                      >
                        {dream.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          {dream.category}
                        </span>
                        <span className={`text-sm ${getTextMutedClass()}`}>{dream.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleBookmark(dream.id)}
                        className="p-2 rounded-lg hover:opacity-70 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${dream.isBookmarked ? 'text-red-400 fill-current' : getTextMutedClass()}`} />
                      </button>
                    </div>
                  </div>
                  
                  <p 
                    onClick={() => {
                      setSelectedDream(dream);
                      setCurrentScreen('interpretation');
                    }}
                    className={`${getTextSecondaryClass()} mb-4 cursor-pointer`}
                  >
                    {dream.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {dream.themes.slice(0, 3).map((theme, index) => (
                        <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-yellow-300">{dream.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {dreams.length === 0 && (
              <div className="text-center py-12">
                <Moon className={`w-16 h-16 ${getTextMutedClass()} mx-auto mb-4`} />
                <h3 className={`text-xl font-semibold ${getTextMutedClass()} mb-2`}>No dreams found</h3>
                <p className={`${getTextMutedClass()} mb-6`}>Start recording your dreams to build your spiritual journal</p>
                <button 
                  onClick={() => setCurrentScreen('input')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Record First Dream
                </button>
              </div>
            )}
          </div>
          <BottomNav activeScreen="journal" />
        </div>
      </div>
    );
  }

  // TRENDS SCREEN
  if (currentScreen === 'trends') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen">
          <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}>
                <ArrowLeft className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
              <h2 className={`text-xl font-bold ${getTextPrimaryClass()}`}>Spiritual Insights</h2>
              <button 
                onClick={() => addNotification('Trends exported!', 'success')}
                className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
              >
                <Download className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
              <h3 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-4 flex items-center`}>
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                Dream Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{dreams.length}</div>
                  <div className={`text-sm ${getTextMutedClass()}`}>Total Dreams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{dreams.filter(d => d.isBookmarked).length}</div>
                  <div className={`text-sm ${getTextMutedClass()}`}>Bookmarked</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
              <h3 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-4 flex items-center`}>
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                Spiritual Growth Insights
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className={`${getTextSecondaryClass()} text-sm`}>Your dreams show increasing spiritual sensitivity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className={`${getTextSecondaryClass()} text-sm`}>Frequent divine symbols suggest active spiritual communication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className={`${getTextSecondaryClass()} text-sm`}>Balanced emotional themes indicate healthy spiritual growth</span>
                </div>
              </div>
            </div>
          </div>
          <BottomNav activeScreen="trends" />
        </div>
      </div>
    );
  }

  // INTERPRETATION SCREEN
  if (currentScreen === 'interpretation') {
    if (!selectedDream) {
      return (
        <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <p className={getTextPrimaryClass()}>Loading dream...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen">
          <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentScreen('journal')} 
                className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
              >
                <ArrowLeft className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
              <h2 className={`text-xl font-bold ${getTextPrimaryClass()}`}>Dream Analysis</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(selectedDream.content + '\n\n' + selectedDream.interpretation)}
                  className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
                >
                  <Copy className={`w-5 h-5 ${getTextSecondaryClass()}`} />
                </button>
                <button 
                  onClick={() => addNotification('Dream shared!', 'success')}
                  className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
                >
                  <Share2 className={`w-5 h-5 ${getTextSecondaryClass()}`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${getTextPrimaryClass()} mb-4`}>Analyzing Your Dream</h3>
                <p className={`${getTextMutedClass()} text-center max-w-sm mb-4`}>
                  Our AI is interpreting the biblical symbolism and spiritual meaning...
                </p>
                <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${getTextPrimaryClass()} mb-2`}>{selectedDream.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          {selectedDream.category}
                        </span>
                        <span className={`text-sm ${getTextMutedClass()}`}>{selectedDream.date}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-yellow-300">{selectedDream.confidence}% confidence</span>
                        </div>
                        <span className="text-sm text-green-400">{selectedDream.emotionalTone}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(selectedDream.id)}
                      className="p-2 rounded-xl hover:opacity-70 transition-colors"
                    >
                      <Heart className={`w-6 h-6 ${selectedDream.isBookmarked ? 'text-red-400 fill-current' : getTextMutedClass()}`} />
                    </button>
                  </div>
                </div>

                <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
                  <h4 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-4 flex items-center`}>
                    <Moon className="w-5 h-5 mr-2 text-blue-400" />
                    Your Dream
                  </h4>
                  <div className={`${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'} rounded-xl p-4`}>
                    <p className={`${getTextSecondaryClass()} leading-relaxed`}>{selectedDream.content}</p>
                  </div>
                </div>

                <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
                  <h4 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-4 flex items-center`}>
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    Spiritual Interpretation
                  </h4>
                  <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                    <p className={`${getTextSecondaryClass()} leading-relaxed`}>{selectedDream.interpretation}</p>
                  </div>
                </div>

                <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
                  <h4 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-4 flex items-center`}>
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                    Spiritual Themes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDream.themes.map((theme, index) => (
                      <span key={index} className="text-sm bg-purple-500/20 text-purple-300 px-3 py-2 rounded-full border border-purple-500/30">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedDream.biblicalRefs && (
                  <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
                    <h4 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-4 flex items-center`}>
                      <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                      Biblical References
                    </h4>
                    <div className="space-y-4">
                      {selectedDream.biblicalRefs.map((ref, index) => (
                        <div key={index} className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-300">{ref.verse}</h5>
                            <button 
                              onClick={() => copyToClipboard(`${ref.verse}: ${ref.text}`)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <p className={`${getTextSecondaryClass()} text-sm mb-2 italic`}>"{ref.text}"</p>
                          <p className="text-green-200 text-xs">{ref.relevance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setDreamText(selectedDream.content);
                      setCurrentScreen('input');
                    }}
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold py-3 rounded-xl hover:bg-blue-500/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Re-analyze</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('journal')}
                    className="bg-gray-700/50 border border-gray-600 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-600/50 transition-all flex items-center justify-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Back to Journal</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SEARCH SCREEN
  if (currentScreen === 'search') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen">
          <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('journal')} className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}>
                <ArrowLeft className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
              <h2 className={`text-xl font-bold ${getTextPrimaryClass()}`}>Search Dreams</h2>
              <div className="w-10 h-10"></div>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dreams, themes, symbols, or content..."
                className={`w-full p-4 pl-12 rounded-xl ${getCardBgClass()} border ${getCardBorderClass()} ${getTextPrimaryClass()} placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              <Search className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${getTextMutedClass()}`} />
            </div>

            <div className="text-center py-12">
              <Search className={`w-16 h-16 ${getTextMutedClass()} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${getTextMutedClass()} mb-2`}>Search Your Dreams</h3>
              <p className={`${getTextMutedClass()} mb-6`}>Find dreams by title, content, themes, or symbols</p>
              <div className="space-y-2">
                <p className={`${getTextMutedClass()} text-sm`}>Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['light', 'water', 'mountain', 'voice', 'flying'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className={`text-xs ${getButtonSecondaryClass()} ${getTextSecondaryClass()} px-3 py-1 rounded-full transition-colors`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PROFILE SCREEN
  if (currentScreen === 'profile') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen">
          <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}>
                <ArrowLeft className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
              <h2 className={`text-xl font-bold ${getTextPrimaryClass()}`}>Profile</h2>
              <button 
                onClick={() => isEditingProfile ? saveProfile() : setIsEditingProfile(true)}
                className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
              >
                {isEditingProfile ? <Save className="w-5 h-5 text-green-400" /> : <Edit3 className={`w-5 h-5 ${getTextSecondaryClass()}`} />}
              </button>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()} text-center`}>
              <div className="relative inline-block mb-4">
                {userProfile.profileImage ? (
                  <img src={userProfile.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                {isEditingProfile && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {isEditingProfile ? (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full p-2 rounded-lg ${getInputBgClass()} border ${getInputBorderClass()} ${getTextPrimaryClass()} text-center`}
                    placeholder="Your name"
                  />
                  <input
                    type="text"
                    value={userProfile.subtitle}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, subtitle: e.target.value }))}
                    className={`w-full p-2 rounded-lg ${getInputBgClass()} border ${getInputBorderClass()} ${getTextPrimaryClass()} text-center text-sm`}
                    placeholder="Your subtitle"
                  />
                </div>
              ) : (
                <>
                  <h3 className={`text-xl font-bold ${getTextPrimaryClass()} mb-1`}>
                    {isAuthenticated ? userProfile.name : 'Guest User'}
                  </h3>
                  <p className={`text-sm ${getTextMutedClass()} mb-4`}>{userProfile.subtitle}</p>
                </>
              )}
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${getTextPrimaryClass()}`}>{dreams.length}</div>
                  <div className={`text-xs ${getTextMutedClass()}`}>Dreams</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {Math.round(dreams.reduce((sum, d) => sum + d.confidence, 0) / dreams.length || 0)}%
                  </div>
                  <div className={`text-xs ${getTextMutedClass()}`}>Avg Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">14</div>
                  <div className={`text-xs ${getTextMutedClass()}`}>Days Active</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setCurrentScreen('journal')}
                className={`w-full ${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 border ${getCardBorderClass()} hover:opacity-80 transition-all flex items-center space-x-3`}
              >
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className={`${getTextPrimaryClass()} font-medium`}>My Dream Journal</span>
                <ChevronDown className={`w-4 h-4 ${getTextMutedClass()} ml-auto rotate-270`} />
              </button>
              
              <button 
                onClick={() => setCurrentScreen('trends')}
                className={`w-full ${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 border ${getCardBorderClass()} hover:opacity-80 transition-all flex items-center space-x-3`}
              >
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className={`${getTextPrimaryClass()} font-medium`}>Spiritual Insights</span>
                <ChevronDown className={`w-4 h-4 ${getTextMutedClass()} ml-auto rotate-270`} />
              </button>
              
              <button 
                onClick={() => addNotification('Export feature coming soon!', 'info')}
                className={`w-full ${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 border ${getCardBorderClass()} hover:opacity-80 transition-all flex items-center space-x-3`}
              >
                <Download className="w-5 h-5 text-purple-400" />
                <span className={`${getTextPrimaryClass()} font-medium`}>Export Dreams</span>
                <ChevronDown className={`w-4 h-4 ${getTextMutedClass()} ml-auto rotate-270`} />
              </button>
            </div>

            {!isAuthenticated ? (
              <button 
                onClick={() => setCurrentScreen('auth')} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentScreen('home');
                  addNotification('Signed out successfully', 'info');
                }}
                className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-4 rounded-xl hover:bg-red-500/30 transition-all"
              >
                Sign Out
              </button>
            )}

            <div className="text-center pt-4">
              <DreamScrollLogo size={32} className="mx-auto mb-2" />
              <p className={`${getTextMutedClass()} text-sm`}>DreamScroll v2.0.0</p>
              <p className={`${getTextMutedClass()} text-xs`}>Biblical dream interpretation with AI</p>
            </div>
          </div>
          <BottomNav activeScreen="profile" />
        </div>
      </div>
    );
  }import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Star, Heart, BookOpen, Mic, MicOff, Send, Search, 
  User, Settings, Home, TrendingUp, PlusCircle, ArrowLeft, 
  Sparkles, Brain, Share2, HelpCircle, Mail, Download, 
  Bell, Shield, Globe, FileText, LogOut, Calendar, Filter,
  Volume2, VolumeX, Copy, ChevronDown, ChevronUp, Bookmark,
  Trash2, Edit3, Play, Pause, RefreshCw, Eye, EyeOff, Camera, Save
} from 'lucide-react';

interface BiblicalRef {
  verse: string;
  text: string;
  relevance: string;
}

interface Dream {
  id: number;
  title: string;
  content: string;
  date: string;
  timestamp: Date;
  themes: string[];
  symbols: string[];
  interpretation: string;
  biblicalRefs: BiblicalRef[];
  emotionalTone: string;
  mood: string;
  confidence: number;
  isBookmarked: boolean;
  category: string;
  tags: string[];
  audioNotes: any;
  lastViewed: Date;
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: Date;
}

interface UserProfile {
  name: string;
  subtitle: string;
  profileImage: string;
  selectedLLM: string;
}

const DreamScrollLogo = ({ size = 40, className = "" }) => (
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

export default function DreamScrollApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'Kevin Darby',
    subtitle: 'Spiritual Dream Explorer',
    profileImage: '',
    selectedLLM: 'GPT-4'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [dreams, setDreams] = useState([
    {
      id: 1,
      title: "Golden Mountain Vision",
      content: "I found myself standing at the base of a magnificent golden mountain that seemed to touch the heavens. The peak was shrouded in brilliant white clouds, and I could hear a gentle voice calling my name from above.",
      date: "Nov 15, 2024",
      timestamp: new Date("2024-11-15T06:30:00"),
      themes: ["Divine Calling", "Spiritual Ascension", "Sacred Journey"],
      symbols: ["Golden Mountain", "Divine Voice", "Ancient Trees", "Heavenly Light"],
      interpretation: "This dream represents a divine calling and spiritual awakening in your life. The golden mountain symbolizes the sacred path God is inviting you to walk.",
      biblicalRefs: [
        {
          verse: "Matthew 17:1-2",
          text: "After six days Jesus took with him Peter, James and John the brother of James, and led them up a high mountain by themselves.",
          relevance: "Mountains often represent places of divine encounter and transformation in Scripture."
        }
      ],
      emotionalTone: "Positive",
      mood: "Peaceful & Inspired",
      confidence: 92,
      isBookmarked: true,
      category: "Prophetic",
      tags: ["vision", "calling", "mountain", "peace"],
      audioNotes: null,
      lastViewed: new Date("2024-11-16T10:00:00")
    },
    {
      id: 2,
      title: "The Ancient Scroll",
      content: "In my dream, I discovered an ancient scroll hidden within the walls of what appeared to be Solomon's temple. The parchment glowed with a soft, warm light.",
      date: "Nov 12, 2024",
      timestamp: new Date("2024-11-12T04:15:00"),
      themes: ["Divine Revelation", "Hidden Wisdom", "Family Heritage"],
      symbols: ["Ancient Scroll", "Hebrew Letters", "Temple", "Divine Light"],
      interpretation: "This dream signifies that God is revealing hidden truths and divine wisdom to you.",
      biblicalRefs: [
        {
          verse: "Jeremiah 1:12",
          text: "The Lord said to me, 'You have seen correctly, for I am watching to see that my word is fulfilled.'",
          relevance: "God's words appearing on the scroll represent His active involvement in revealing His will."
        }
      ],
      emotionalTone: "Positive",
      mood: "Awe-struck & Grateful",
      confidence: 88,
      isBookmarked: false,
      category: "Revelation",
      tags: ["scroll", "wisdom", "temple", "family"],
      audioNotes: null,
      lastViewed: new Date("2024-11-13T09:30:00")
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasMediaRecorder = 'MediaRecorder' in window;
      setAudioSupported(hasMediaRecorder);
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTimer(0);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRealRecording = async () => {
    if (!audioSupported) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startSpeechRecognition();
    } catch (error) {
      addNotification('Error accessing microphone. Please check permissions.', 'error');
    }
  };

  const stopRealRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsRecording(false);
    setIsListening(false);
  };

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    recognitionRef.current = new SpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setDreamText(prev => prev + ' ' + finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        addNotification('Speech recognition error. Please try again.', 'error');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    }
  };

  const generateAdvancedInterpretation = async (dreamText) => {
    setIsProcessing(true);
    setCurrentScreen('interpretation');
    
    setTimeout(() => {
      const newDream = {
        id: dreams.length + 1,
        title: extractDreamTitle(dreamText),
        content: dreamText,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        timestamp: new Date(),
        themes: generateThemes(dreamText),
        symbols: extractSymbols(dreamText),
        interpretation: generateInterpretation(dreamText) + ` (Interpreted using ${userProfile.selectedLLM})`,
        biblicalRefs: generateBiblicalRefs(dreamText),
        emotionalTone: 'Positive',
        mood: 'Contemplative',
        confidence: Math.floor(Math.random() * 20) + 80,
        isBookmarked: false,
        category: 'Spiritual Life',
        tags: ['spiritual', 'guidance'],
        audioNotes: null,
        lastViewed: new Date()
      };
      
      setDreams(prev => [newDream, ...prev]);
      setSelectedDream(newDream);
      setIsProcessing(false);
      addNotification('Dream interpretation complete!', 'success');
    }, 3500);
  };

  const extractDreamTitle = (text) => {
    const words = text.split(' ').slice(0, 4);
    return words.join(' ') + (text.split(' ').length > 4 ? '...' : '');
  };

  const generateThemes = () => {
    return ["Spiritual Growth", "Divine Guidance"];
  };

  const extractSymbols = () => {
    return ["Light", "Water"];
  };

  const generateInterpretation = () => {
    return "Your dream contains meaningful spiritual symbolism that suggests divine guidance and growth in your spiritual journey.";
  };

  const generateBiblicalRefs = () => {
    return [
      {
        verse: "Psalm 119:105",
        text: "Your word is a lamp for my feet, a light on my path.",
        relevance: "God provides guidance and illumination for our spiritual journey."
      }
    ];
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          profileImage: e.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setIsEditingProfile(false);
    addNotification('Profile updated successfully!', 'success');
  };

  const toggleBookmark = (dreamId) => {
    setDreams(prev => prev.map(dream => 
      dream.id === dreamId 
        ? { ...dream, isBookmarked: !dream.isBookmarked }
        : dream
    ));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      addNotification('Copied to clipboard!', 'success');
    });
  };

  // Theme helper functions
  const getBgClass = () => darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const getCardBgClass = () => darkMode ? 'bg-gray-800/50' : 'bg-white/80';
  const getCardBorderClass = () => darkMode ? 'border-gray-700/50' : 'border-gray-200';
  const getTextPrimaryClass = () => darkMode ? 'text-white' : 'text-gray-900';
  const getTextSecondaryClass = () => darkMode ? 'text-gray-300' : 'text-gray-700';
  const getTextMutedClass = () => darkMode ? 'text-gray-400' : 'text-gray-500';
  const getInputBgClass = () => darkMode ? 'bg-gray-800' : 'bg-white';
  const getInputBorderClass = () => darkMode ? 'border-gray-700' : 'border-gray-300';
  const getButtonSecondaryClass = () => darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-200 hover:bg-gray-300';

  const NotificationBar = () => (
    notifications.length > 0 && (
      <div className="w-full max-w-sm md:max-w-6xl mx-auto">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-2 p-3 rounded-xl backdrop-blur-xl border ${
              notification.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
              'bg-blue-500/20 border-blue-500/30 text-blue-300'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    )
  );

  const BottomNav = ({ activeScreen }) => {
    const navBgClass = darkMode ? 'bg-gray-800/90' : 'bg-white/90';
    const navBorderClass = darkMode ? 'border-gray-700/50' : 'border-gray-200';
    const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';
    
    return (
      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm ${navBgClass} backdrop-blur-xl border-t ${navBorderClass}`}>
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'journal', icon: BookOpen, label: 'Journal' },
            { id: 'input', icon: PlusCircle, label: 'Record' },
            { id: 'trends', icon: TrendingUp, label: 'Trends' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentScreen(id)}
              className={
                activeScreen === id 
                  ? 'flex flex-col items-center py-2 px-3 rounded-lg transition-all text-blue-400 bg-blue-500/20' 
                  : `flex flex-col items-center py-2 px-3 rounded-lg transition-all ${textMutedClass}`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // AUTH SCREEN
  if (currentScreen === 'auth') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center p-8">
            <div className="text-center mb-8">
              <DreamScrollLogo size={60} className="mx-auto mb-4" />
              <h1 className={`text-2xl font-bold ${getTextPrimaryClass()} mb-2`}>
                {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className={getTextMutedClass()}>
                {authMode === 'signin' 
                  ? 'Sign in to access your dream journal' 
                  : 'Start your spiritual dream journey'
                }
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <input
                type="email"
                placeholder="Email address"
                className={`w-full p-4 rounded-xl ${getInputBgClass()} border ${getInputBorderClass()} ${getTextPrimaryClass()} placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              <input
                type="password"
                placeholder="Password"
                className={`w-full p-4 rounded-xl ${getInputBgClass()} border ${getInputBorderClass()} ${getTextPrimaryClass()} placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
              />
              {authMode === 'signup' && (
                <input
                  type="password"
                  placeholder="Confirm password"
                  className={`w-full p-4 rounded-xl ${getInputBgClass()} border ${getInputBorderClass()} ${getTextPrimaryClass()} placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                />
              )}
            </div>
            
            <button
              onClick={() => {
                setIsAuthenticated(true);
                setCurrentScreen('home');
                addNotification('Welcome to DreamScroll!', 'success');
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-all mb-4"
            >
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
            
            <button
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="w-full text-blue-400 hover:text-blue-300 py-2 transition-all"
            >
              {authMode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
          
          <div className="p-8">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`w-full ${getTextMutedClass()} py-2 transition-all`}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // HOME SCREEN
  if (currentScreen === 'home') {
    const recentDreams = dreams.slice(0, 2);
    
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen">
          <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DreamScrollLogo size={32} />
                <div>
                  <h1 className={`text-xl font-bold ${getTextPrimaryClass()}`}>DreamScroll</h1>
                  <p className={`text-sm ${getTextMutedClass()}`}>Biblical Dream Interpretation</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    setDarkMode(!darkMode);
                    addNotification(`${darkMode ? 'Light' : 'Dark'} mode ${darkMode ? 'enabled' : 'disabled'}`, 'info');
                  }}
                  className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
                >
                  {darkMode ? <Sun className={`w-5 h-5 ${getTextSecondaryClass()}`} /> : <Moon className={`w-5 h-5 ${getTextSecondaryClass()}`} />}
                </button>
                <button 
                  onClick={() => addNotification('No new notifications', 'info')}
                  className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
                >
                  <Bell className={`w-5 h-5 ${getTextSecondaryClass()}`} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
              <h2 className={`text-2xl font-bold ${getTextPrimaryClass()} mb-2`}>
                {isAuthenticated ? `Welcome back, ${userProfile.name}! 👋` : 'Welcome to DreamScroll! 👋'}
              </h2>
              <p className={`${getTextSecondaryClass()} mb-4`}>
                Ready to discover the spiritual meaning behind your dreams?
              </p>
              <button 
                onClick={() => setCurrentScreen('input')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Record New Dream ✨
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className={`${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 text-center border ${getCardBorderClass()}`}>
                <div className={`text-2xl font-bold ${getTextPrimaryClass()}`}>{dreams.length}</div>
                <div className={`text-xs ${getTextMutedClass()}`}>Dreams</div>
              </div>
              <div className={`${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 text-center border ${getCardBorderClass()}`}>
                <div className="text-2xl font-bold text-blue-400">{dreams.filter(d => d.isBookmarked).length}</div>
                <div className={`text-xs ${getTextMutedClass()}`}>Saved</div>
              </div>
              <div className={`${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 text-center border ${getCardBorderClass()}`}>
                <div className="text-2xl font-bold text-green-400">7</div>
                <div className={`text-xs ${getTextMutedClass()}`}>Day Streak</div>
              </div>
            </div>
            
            {dreams.length > 0 && (
              <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${getTextPrimaryClass()}`}>Recent Dreams</h3>
                  <button 
                    onClick={() => setCurrentScreen('journal')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentDreams.map((dream) => (
                    <div
                      key={dream.id}
                      onClick={() => {
                        setSelectedDream(dream);
                        setCurrentScreen('interpretation');
                      }}
                      className={`${darkMode ? 'bg-gray-700/30 hover:bg-gray-600/30' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl p-4 cursor-pointer transition-all`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${getTextPrimaryClass()} text-sm`}>{dream.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                            {dream.category}
                          </span>
                          <span className={`text-xs ${getTextMutedClass()}`}>{dream.date}</span>
                        </div>
                      </div>
                      <p className={`${getTextSecondaryClass()} text-xs mb-2`}>{dream.content.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {dream.themes.slice(0, 2).map((theme, index) => (
                            <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                              {theme}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          {dream.isBookmarked && <Heart className="w-3 h-3 text-red-400 fill-current" />}
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-yellow-300">{dream.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentScreen('trends')}
                className={`${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 text-left border ${getCardBorderClass()} transition-all hover:opacity-80`}
              >
                <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
                <h4 className={`font-semibold ${getTextPrimaryClass()} text-sm mb-1`}>Trends</h4>
                <p className={`${getTextMutedClass()} text-xs`}>View patterns</p>
              </button>
              <button
                onClick={() => setCurrentScreen('journal')}
                className={`${getCardBgClass()} backdrop-blur-xl rounded-xl p-4 text-left border ${getCardBorderClass()} transition-all hover:opacity-80`}
              >
                <BookOpen className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className={`font-semibold ${getTextPrimaryClass()} text-sm mb-1`}>Journal</h4>
                <p className={`${getTextMutedClass()} text-xs`}>Browse dreams</p>
              </button>
            </div>
            
            {!isAuthenticated && (
              <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
                <h3 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-2`}>Unlock Premium Features</h3>
                <p className={`${getTextSecondaryClass()} text-sm mb-4`}>Sign up to sync your dreams across devices and get advanced insights.</p>
                <button
                  onClick={() => setCurrentScreen('auth')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
          <BottomNav activeScreen="home" />
        </div>
      </div>
    );
  }

  // INPUT SCREEN
  if (currentScreen === 'input') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen`}>
        <NotificationBar />
        <div className="min-h-screen">
          <div className={`${getCardBgClass()} backdrop-blur-xl border-b ${getCardBorderClass()} p-6`}>
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentScreen('home')} className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}>
                <ArrowLeft className={`w-5 h-5 ${getTextSecondaryClass()}`} />
              </button>
              <h2 className={`text-xl font-bold ${getTextPrimaryClass()}`}>Record Dream</h2>
              <button 
                onClick={() => setTextToSpeech(!textToSpeech)}
                className={`w-10 h-10 ${getButtonSecondaryClass()} rounded-xl flex items-center justify-center transition-colors`}
              >
                {textToSpeech ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className={`w-5 h-5 ${getTextSecondaryClass()}`} />}
              </button>
            </div>
          </div>
          <div className="p-6 pb-24 space-y-6">
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <h4 className="text-purple-300 font-medium mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                AI Interpretation Model
              </h4>
              <select 
                value={userProfile.selectedLLM}
                onChange={(e) => setUserProfile(prev => ({ ...prev, selectedLLM: e.target.value }))}
                className={`w-full p-2 rounded-lg ${getInputBgClass()} border ${getInputBorderClass()} ${getTextPrimaryClass()} text-sm`}
              >
                <option value="GPT-4">GPT-4 (OpenAI) - Most balanced</option>
                <option value="Claude">Claude (Anthropic) - Best reasoning</option>
                <option value="Gemini">Gemini (Google) - Creative insights</option>
              </select>
              <p className="text-purple-200 text-xs mt-2">
                Your dreams will be interpreted using {userProfile.selectedLLM}
              </p>
            </div>
            
            <div className={`${getCardBgClass()} backdrop-blur-xl rounded-2xl p-6 border ${getCardBorderClass()}`}>
              <h3 className={`text-lg font-semibold ${getTextPrimaryClass()} mb-6`}>Describe Your Dream</h3>
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <button
                    onClick={isRecording ? stopRealRecording : startRealRecording}
                    disabled={!audioSupported}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl relative ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse scale-110' 
                        : audioSupported
                        ? 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                    )}
                  </button>
                </div>
                <div className="mt-4">
                  <p className={`${getTextSecondaryClass()} mb-2 font-medium`}>
                    {isRecording 
                      ? `🎤 ${isListening ? 'Listening' : 'Recording'}... ${formatTime(recordingTimer)}` 
                      : audioSupported 
                      ? 'Tap the microphone to start voice recording'
                      : 'Voice recording not available - please type your dream below'
                    }
                  </p>
                  {isRecording && isListening && (
                    <div className="bg-green-500/20 rounded-xl p-3 border border-green-500/30">
                      <p className="text-green-300 text-sm font-medium">🗣️ Speak now - your words will appear below</p>
                    </div>
                  )}
                  {!audioSupported && (
                    <div className="bg-orange-500/20 rounded-xl p-3 border border-orange-500/30">
                      <p className="text-orange-300 text-sm">💡 Voice recording requires Chrome, Firefox, or Safari</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  placeholder="Type your dream here or use voice recording above..."
                  disabled={isRecording}
                  rows={8}
                  className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-300'} border ${getTextPrimaryClass()} placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors`}
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  {dreamText.trim() && (
                    <span className={`text-xs ${getTextMutedClass()} ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'} px-2 py-1 rounded`}>
                      {dreamText.length} chars
                    </span>
                  )}
                  {dreamText.trim() && !isProcessing && !isRecording && (
                    <button
                      onClick={() => {
                        const textToProcess = dreamText;
                        setDreamText('');
                        generateAdvancedInterpretation(textToProcess);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full transition-all shadow-lg hover:scale-105"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <h4 className="text-blue-300 font-medium mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Recording Tips
              </h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Include emotions and colors you remember</li>
                <li>• Describe the setting and people involved</li>
                <li>• Mention any symbols or unusual elements</li>
                <li>• Note the time and how you felt upon waking</li>
              </ul>
            </div>
          </div>
          <BottomNav activeScreen="input" />
        </div>
      </div>
    );
  }

  // For any other screen, show a simple message
  return (
    <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${getBgClass()} min-h-screen flex items-center justify-center`}>
      <div className="text-center">
        <DreamScrollLogo size={64} className="mx-auto mb-4" />
        <p className={getTextPrimaryClass()}>Screen: {currentScreen}</p>
        <button 
          onClick={() => setCurrentScreen('home')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
