import { useState } from 'react';

function Home({ onCreateRoom, onJoinRoom }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  // const handleRoomIdChange = (e) => {
  //   const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  //   if (value.length <= 6) {
  //     setRoomId(value);
  //   }
  // };




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
    const cleanRoomId = roomId.replace(/\s/g, ''); // Remove all spaces
    if (username.trim() && cleanRoomId.length === 6) {
      onJoinRoom(username.trim(), cleanRoomId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800">WatchWithMe</h2>
          <span className="text-xs text-purple-600 font-semibold">BETA</span>
        </div>

        <nav className="space-y-1 flex-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-100 text-purple-700 font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            My Rooms
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Friends
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </a>
        </nav>

        <div className="pt-6 border-t border-gray-200 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Hero Section - Create/Join Room */}
          <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-3xl p-12 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            </div>
            <div className="relative z-10 max-w-xl">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">Get Started</span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">Watch Together</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Start Your Watch Party</h1>
              <p className="text-white/90 text-lg mb-6">Create a room and invite your friends for synchronized viewing experience</p>
              
              {/* Username Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                  className="w-full px-5 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  maxLength={20}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateRoom}
                  disabled={!username.trim()}
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Create Room
                </button>
                <button
                  onClick={() => setShowJoinModal(true)}
                  disabled={!username.trim()}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Room
                </button>
              </div>
            </div>

            {/* Decorative avatars */}
            <div className="absolute bottom-8 right-8 flex -space-x-3">
              <div className="w-12 h-12 bg-white rounded-full border-4 border-pink-500 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full border-4 border-pink-500 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400"></div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full border-4 border-pink-500 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-400"></div>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 flex items-center justify-center">
                <span className="text-white text-sm font-bold">+12</span>
              </div>
            </div>
          </div>

          {/* Trending Now Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Trending now</h2>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Action Movies', color: 'from-red-500 to-orange-500', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400' },
                { title: 'Sci-Fi Classics', color: 'from-blue-500 to-cyan-500', img: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400' },
                { title: 'Comedy Nights', color: 'from-pink-500 to-purple-500', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400' },
              ].map((category, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden group cursor-pointer h-48">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style={{backgroundImage: `url(${category.img})`}}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60`}></div>
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-gray-800">NEW</span>
                      <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                      <p className="text-white/80 text-sm">Popular · Trending</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why WatchWithMe?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Real-Time Sync</h3>
                <p className="text-gray-600 text-sm">Perfect synchronization across all viewers</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm">Chat overlay visible in fullscreen</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Private Rooms</h3>
                <p className="text-gray-600 text-sm">Secure with unique access codes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Join Room</h3>
                <p className="text-gray-600 text-sm mt-1">Enter the 6-character room code</p>
              </div>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setRoomId('');
                }}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <input
              type="text"
              placeholder="ABC123"
              value={roomId}
              onChange={handleRoomIdChange}
              onKeyPress={(e) => e.key === 'Enter' && roomId.length === 6 && handleJoinRoom()}
              className="w-full px-5 py-4 bg-gray-100 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white text-center text-3xl font-bold tracking-[0.5em] mb-6 transition-all"
              maxLength={6}
              autoFocus
            />

            <button
              onClick={handleJoinRoom}
              disabled={roomId.length !== 6}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
            >
              Join Watch Party
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;