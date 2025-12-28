import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import Chat from './Chat';

function Room({ room, socket, currentUser }) {
  // Safety check
  if (!room || !room.users) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const playerRef = useRef(null);
  const isAdmin = room.users.find(u => u.id === socket.id)?.isAdmin || false;

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleUrlSubmit = () => {
    const id = extractVideoId(videoUrl);
    if (id) {
      setVideoId(id);
      socket.emit('video-url-change', { roomId: room.id, videoUrl: id });
      setVideoUrl('');
      setShowUrlInput(false);
    } else {
      alert('Invalid YouTube URL');
    }
  };

  // Listen for video URL changes from other users
  useEffect(() => {
    socket.on('video-url-changed', (newVideoId) => {
      setVideoId(newVideoId);
    });

    socket.on('video-play', (currentTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime);
        playerRef.current.playVideo();
      }
    });

    socket.on('video-pause', (currentTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime);
        playerRef.current.pauseVideo();
      }
    });

    socket.on('video-seek', (currentTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime);
      }
    });

    return () => {
      socket.off('video-url-changed');
      socket.off('video-play');
      socket.off('video-pause');
      socket.off('video-seek');
    };
  }, [socket]);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event) => {
    const currentTime = event.target.getCurrentTime();
    
    // 1 = playing, 2 = paused
    if (event.data === 1) {
      socket.emit('play-video', { roomId: room.id, currentTime });
    } else if (event.data === 2) {
      socket.emit('pause-video', { roomId: room.id, currentTime });
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800">WatchWithMe</h1>
            <div className="flex items-center gap-3 px-4 py-2 bg-purple-100 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-purple-700">Room: {room.id}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">{room.users.length} Watching</span>
            </div>
            
            {isAdmin && (
              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-purple-500/30"
              >
                {showUrlInput ? 'Cancel' : '+ Load Video'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* URL Input (Admin Only) */}
            {isAdmin && showUrlInput && (
              <div className="mb-6 animate-slideUp">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Load YouTube Video</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Paste YouTube URL here..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800"
                    />
                    <button
                      onClick={handleUrlSubmit}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-white transition-all"
                    >
                      Load
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 relative" style={{ aspectRatio: '16/9' }}>
              {videoId ? (
                <>
                  <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange}
                    className="w-full h-full"
                  />
                  
                  {/* Chat Overlay */}
                  <Chat socket={socket} roomId={room.id} username={currentUser} />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <svg className="w-20 h-20 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg mb-2">
                    {isAdmin ? 'Click "Load Video" to start watching' : 'Waiting for admin to load a video...'}
                  </p>
                  <p className="text-gray-600 text-sm">The video will sync automatically for everyone</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            {videoId && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Now Playing</h2>
                    <p className="text-gray-600 text-sm">Video synced across all viewers</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-green-100 rounded-lg">
                      <span className="text-green-700 text-xs font-semibold">● LIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - User List */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-gray-200 p-6 overflow-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Viewers ({room.users.length})
            </h3>
            
            <div className="space-y-2">
              {room.users.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all border border-purple-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500">
                      {user.isAdmin ? '👑 Admin' : 'Viewer'}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Info */}
          <div className="mt-6 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border border-purple-200">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">Room Details</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Code:</span>
                <span className="font-mono font-bold text-purple-700">{room.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Role:</span>
                <span className="font-semibold text-gray-800">{isAdmin ? 'Admin' : 'Viewer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600">● Active</span>
              </div>
            </div>
          </div>

          {/* Share Room */}
          <div className="mt-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(room.id);
                alert('Room code copied to clipboard!');
              }}
              className="w-full px-4 py-3 bg-white hover:bg-gray-50 border-2 border-purple-200 hover:border-purple-300 rounded-xl font-semibold text-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Room Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;