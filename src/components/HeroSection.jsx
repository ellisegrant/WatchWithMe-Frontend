function HeroSection({ onCreateClick, onJoinClick }) {
  return (
    <div className="px-8 pt-8 pb-12">
      <div className="relative h-[500px] rounded-2xl overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 -z-0">
          <iframe
            src="https://www.youtube.com/embed/gCNeDWCI0vo?autoplay=1&mute=1&loop=1&playlist=gCNeDWCI0vo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            className="absolute top-1/2 left-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
            style={{ pointerEvents: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          ></iframe>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/60 z-10"></div>
        </div>

        {/* Animated Circles */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-10 right-20 w-64 h-64 bg-[#1E5B99]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#1E5B99]/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center z-30">
          <div className="px-16 max-w-3xl">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              New Platform Launch
            </div>
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Watch Together,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                Anywhere
              </span>
            </h2>
            <p className="text-xl text-white/95 mb-8 max-w-xl leading-relaxed drop-shadow-lg">
              Create a room in seconds, invite friends, and enjoy synchronized video watching with real-time chat and reactions.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onCreateClick}
                className="px-8 py-4 bg-[#1E5B99] text-white rounded-xl font-bold text-lg hover:bg-[#2672B8] transition-all shadow-2xl shadow-[#1E5B99]/50 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Watching
              </button>
              <button
                onClick={onJoinClick}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg backdrop-blur-md transition-all border border-white/30"
              >
                Join a Room
              </button>
            </div>
          </div>

          {/* Video Preview Mockup */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden xl:block">
            <div className="relative w-80 h-48 bg-black/40 backdrop-blur-md rounded-xl border border-white/30 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#1E5B99] rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
              {/* User Avatars */}
              <div className="absolute bottom-4 left-4 flex -space-x-2">
                <div className="w-8 h-8 bg-[#1E5B99] rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">A</div>
                <div className="w-8 h-8 bg-[#2672B8] rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">B</div>
                <div className="w-8 h-8 bg-[#1E5B99] rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">C</div>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">+5</div>
              </div>
              {/* Live indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-white">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;