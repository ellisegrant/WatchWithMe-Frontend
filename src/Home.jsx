import { useState } from 'react';

function Home({ onCreateRoom, onJoinRoom }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleRoomIdChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setRoomId(value);
    }
  };

  const handleCreateRoom = () => {
    if (username.trim()) {
      onCreateRoom(username.trim());
    }
  };

  const handleJoinRoom = () => {
    if (username.trim() && roomId.length === 6) {
      onJoinRoom(username.trim(), roomId);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background with Cinema Image */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop)',
          }}
        ></div>
        
        {/* Dark overlay gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Subtle animated glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-blue-600/5 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        
        {/* Logo & Hero Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-2xl"></div>
            <h1 className="relative text-7xl md:text-9xl font-black text-white tracking-tighter">
              WATCH<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">WITH</span>ME
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light tracking-wide">
            The Ultimate Watch Party Platform
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Host synchronized watch parties with friends. Real-time video sync, live chat, and seamless viewing experience.
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md mb-20 animate-slideUp">
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25"></div>
            
            <div className="relative bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-2xl rounded-lg shadow-2xl border border-gray-800/50 p-10">
              
              {/* Username Input */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showJoinInput && handleCreateRoom()}
                  className="w-full px-5 py-4 bg-black/60 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-600 transition-all text-lg"
                  maxLength={20}
                />
              </div>

              {/* Create Room Button */}
              <button
                onClick={handleCreateRoom}
                disabled={!username.trim()}
                className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-bold text-white text-base shadow-xl shadow-blue-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-cyan-600 transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
              >
                Create Watch Party
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-gradient-to-b from-gray-900/95 to-black/95 text-gray-500 uppercase tracking-widest font-semibold">Or</span>
                </div>
              </div>

              {/* Join Room Section */}
              {!showJoinInput ? (
                <button
                  onClick={() => setShowJoinInput(true)}
                  disabled={!username.trim()}
                  className="w-full px-6 py-4 bg-transparent hover:bg-gray-800/30 border-2 border-gray-700 hover:border-gray-600 rounded-lg font-semibold text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide text-sm"
                >
                  Join Existing Room
                </button>
              ) : (
                <div className="space-y-5 animate-slideUp">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Room Code
                  </label>
                  <input
                    type="text"
                    placeholder="XXXXXX"
                    value={roomId}
                    onChange={handleRoomIdChange}
                    onKeyPress={(e) => e.key === 'Enter' && roomId.length === 6 && handleJoinRoom()}
                    className="w-full px-4 py-5 bg-black/60 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-700 text-center text-3xl font-bold tracking-[0.5em] transition-all"
                    maxLength={6}
                    autoFocus
                  />
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowJoinInput(false);
                        setRoomId('');
                      }}
                      className="flex-1 px-4 py-3 bg-transparent border-2 border-gray-700 hover:border-gray-600 rounded-lg font-semibold text-gray-400 hover:text-gray-300 transition-all uppercase tracking-wide text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleJoinRoom}
                      disabled={roomId.length !== 6}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-bold text-white shadow-lg shadow-cyan-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                    >
                      Join
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4 mb-16">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center hover:border-gray-700 transition-all">
              <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-wide">REAL-TIME SYNC</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Perfect synchronization across all viewers with zero lag</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center hover:border-gray-700 transition-all">
              <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-wide">LIVE CHAT</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Interactive chat overlay visible even in fullscreen</p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center hover:border-gray-700 transition-all">
              <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-wide">PRIVATE ROOMS</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Secure watch parties with unique access codes</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-700 text-xs tracking-wider">
          <p>© 2024 WATCHWITHME — ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
}

export default Home;