import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import SearchModal from './components/SearchModal';

function Home({ onCreateRoom, onJoinRoom, socket }) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const trendingVideos = [
    {
      id: 1,
      title: 'The Weeknd - Blinding Lights (Official Video)',
      thumbnail: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg',
      category: 'Music',
      views: '1.2B views',
      videoId: '4NRXx6U8ABQ'
    },
    {
      id: 2,
      title: 'MrBeast - $1 vs $500,000 Experiences',
      thumbnail: 'https://i.ytimg.com/vi/kX3nB4PpJko/maxresdefault.jpg',
      category: 'Entertainment',
      views: '89M views',
      videoId: 'kX3nB4PpJko'
    },
    {
      id: 3,
      title: 'Marvel Studios Avengers: Endgame - Official Trailer',
      thumbnail: 'https://i.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg',
      category: 'Movies',
      views: '104M views',
      videoId: 'TcMBFSGVi1c'
    },
    {
      id: 4,
      title: 'Ed Sheeran - Shape of You (Official Music Video)',
      thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      category: 'Music',
      views: '6.2B views',
      videoId: 'JGwWNGJdvx8'
    },
    {
      id: 5,
      title: 'The Last of Us Part II - Official Trailer',
      thumbnail: 'https://i.ytimg.com/vi/qPNiIeKMHyg/maxresdefault.jpg',
      category: 'Gaming',
      views: '32M views',
      videoId: 'qPNiIeKMHyg'
    },
    {
      id: 6,
      title: 'Billie Eilish - bad guy (Official Music Video)',
      thumbnail: 'https://i.ytimg.com/vi/DyDfgMOUjCI/maxresdefault.jpg',
      category: 'Music',
      views: '1.5B views',
      videoId: 'DyDfgMOUjCI'
    }
  ];

  const popularVideos = [
    {
      id: 7,
      title: 'Dua Lipa - Levitating (Official Music Video)',
      thumbnail: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/maxresdefault.jpg',
      category: 'Music',
      views: '459M views',
      videoId: 'TUVcZfQe-Kw'
    },
    {
      id: 8,
      title: 'Minecraft Speedrun World Record',
      thumbnail: 'https://i.ytimg.com/vi/f0ZHq7WNM3c/maxresdefault.jpg',
      category: 'Gaming',
      views: '12M views',
      videoId: 'f0ZHq7WNM3c'
    },
    {
      id: 9,
      title: 'Spider-Man: No Way Home - Official Trailer',
      thumbnail: 'https://i.ytimg.com/vi/JfVOs4VSpmA/maxresdefault.jpg',
      category: 'Movies',
      views: '93M views',
      videoId: 'JfVOs4VSpmA'
    },
    {
      id: 10,
      title: 'Post Malone - Circles (Official Music Video)',
      thumbnail: 'https://i.ytimg.com/vi/wXhTHyIgQ_U/maxresdefault.jpg',
      category: 'Music',
      views: '627M views',
      videoId: 'wXhTHyIgQ_U'
    }
  ];

  const handleCreateRoom = () => {
    if (username.trim()) {
      onCreateRoom(username);
      setShowCreateModal(false);
    } else {
      alert('Please enter your name');
    }
  };

  const handleJoinRoom = () => {
    if (username.trim() && roomCode.trim()) {
      onJoinRoom(roomCode.toUpperCase(), username);
      setShowJoinModal(false);
    } else {
      alert('Please enter your name and room code');
    }
  };

  const handleVideoClick = (videoId, title) => {
    const name = prompt('Enter your name to start watching:');
    if (name && name.trim()) {
      onCreateRoom(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1726] flex">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onSearchClick={() => setShowSearchModal(true)}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0E1726]/95 backdrop-blur-sm border-b border-[#1F2F44]">
          <div className="px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-semibold text-white">Discover</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-5 py-2.5 bg-[#1A2332] hover:bg-[#2A3C52] text-white rounded-lg font-medium transition-all border border-[#2A3C52]"
              >
                Join Room
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-medium transition-all shadow-lg shadow-[#1E5B99]/20"
              >
                Create Room
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section Component */}
        <HeroSection 
          onCreateClick={() => setShowCreateModal(true)}
          onJoinClick={() => setShowJoinModal(true)}
        />

        {/* Trending Section */}
        <div className="px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Trending Now</h3>
            <button 
              onClick={() => setShowSearchModal(true)}
              className="text-[#1E5B99] hover:text-[#2672B8] font-medium flex items-center gap-2"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.videoId, video.title)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1A2332] mb-3 shadow-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#1E5B99]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-1 bg-[#1E5B99] text-white text-xs font-semibold rounded backdrop-blur-sm">
                    {video.category}
                  </div>
                </div>
                <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">{video.title}</h4>
                <p className="text-xs text-[#A1B0C8]">{video.views}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Section */}
        <div className="px-8 py-8 pb-16 bg-[#0B1220]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Popular This Week</h3>
            <button 
              onClick={() => setShowSearchModal(true)}
              className="text-[#1E5B99] hover:text-[#2672B8] font-medium flex items-center gap-2"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.videoId, video.title)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1A2332] mb-3 shadow-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#1E5B99]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">{video.title}</h4>
                <p className="text-xs text-[#A1B0C8]">{video.views}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Modal - Real YouTube Search */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        socket={socket}
        onCreateRoom={onCreateRoom}
      />

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2332] rounded-2xl max-w-md w-full p-8 animate-slideUp border border-[#2A3C52]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Create Room</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#A1B0C8] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#A1B0C8]">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                maxLength={20}
                autoFocus
              />
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={!username.trim()}
              className="w-full py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1E5B99]/20"
            >
              Create Room
            </button>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2332] rounded-2xl max-w-md w-full p-8 animate-slideUp border border-[#2A3C52]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Join Room</h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-[#A1B0C8] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#A1B0C8]">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                maxLength={20}
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#A1B0C8]">Room Code</label>
              <input
                type="text"
                placeholder="Enter 6-character code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors font-mono text-lg"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={!username.trim() || !roomCode.trim()}
              className="w-full py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1E5B99]/20"
            >
              Join Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;