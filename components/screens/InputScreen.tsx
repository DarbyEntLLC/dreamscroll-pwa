   // --- INPUT SCREEN ---
  if (currentScreen === 'input') {
    return (
      <div className={`w-full max-w-sm md:max-w-6xl mx-auto ${themeClasses.background} min-h-screen`}>
        <NotificationBar notifications={notifications} removeNotification={removeNotification} />
        <div className="min-h-screen flex flex-col pb-20">
          <div className="p-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="mb-8 flex items-center gap-2 text-blue-300 hover:text-blue-200"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <div className="mb-4">
              <h2 className={`text-xl font-semibold mb-1 ${themeClasses.textPrimary}`}>Record a New Dream</h2>
              <p className={themeClasses.textMuted}>Type or speak your dream below. The AI will help interpret it!</p>
            </div>
            <textarea
              className={`w-full mt-3 p-4 rounded-xl h-36 resize-none border ${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.textPrimary} placeholder-gray-400 focus:outline-none focus:border-blue-500`}
              placeholder="Describe your dream in detail..."
              value={dreamText}
              onChange={e => setDreamText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-3">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isRecording ? 'bg-red-500 text-white' : themeClasses.buttonSecondary
                }`}
                onClick={isRecording ? stopRealRecording : startRealRecording}
                disabled={!audioSupported}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isRecording ? 'Stop Recording' : 'Record Audio'}
                {isRecording && <span className="ml-2 text-sm font-mono">{formatTime(recordingTimer)}</span>}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all"
                onClick={() => {
                  if (!dreamText.trim()) {
                    addNotification('Please enter or record a dream first.', 'error');
                    return;
                  }
                  generateAdvancedInterpretation(dreamText);
                  setDreamText('');
                }}
                disabled={isProcessing}
              >
                <Sparkles className="w-5 h-5" /> Interpret Dream
              </button>
            </div>
          </div>
        </div>
        <BottomNav activeScreen="input" setCurrentScreen={setCurrentScreen} />
      </div>
    );
  }
  