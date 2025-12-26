import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import Chat from './Chat';

function Room({ room, socket, currentUser }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const playerRef = useRef(null);
  const isAdmin = room.users.find(u => u.id === socket.id)?.isAdmin;

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
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎬 WatchWithMe</h1>
            <p className="text-sm text-gray-400">Room: {room.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{room.users.length} viewers</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            {isAdmin && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube URL here..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
                <button
                  onClick={handleUrlSubmit}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
                >
                  Load Video
                </button>
              </div>
            )}

            {/* Video container with chat overlay */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              {videoId ? (
                <YouTube
                  videoId={videoId}
                  opts={opts}
                  onReady={onPlayerReady}
                  onStateChange={onPlayerStateChange}
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-800">
                  <p className="text-gray-400">
                    {isAdmin ? 'Enter a YouTube URL to start watching' : 'Waiting for admin to load a video...'}
                  </p>
                </div>
              )}
              
              {/* Chat overlay - TikTok style */}
              <Chat socket={socket} roomId={room.id} username={currentUser} />
            </div>
          </div>

          {/* Sidebar - Users List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Viewers ({room.users.length})</h3>
              <div className="space-y-2">
                {room.users.map(user => (
                  <div key={user.id} className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-semibold">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="flex-1 truncate">{user.username}</span>
                    {user.isAdmin && <span className="text-yellow-400">👑</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;