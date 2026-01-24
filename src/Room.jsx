import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import Chat from './Chat';
import YouTubeSearch from './components/YouTubeSearch';
import VideoQueue from './components/VideoQueue';

function Room({ room, socket, currentUser }) {
  // Safety check
  if (!room || !room.users) {
    return (
      <div className="min-h-screen bg-[#0E1726] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E5B99] mx-auto mb-4"></div>
          <p className="text-[#A1B0C8]">Loading room...</p>
        </div>
      </div>
    );
  }

  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);
  const [queue, setQueue] = useState([]);
  const playerRef = useRef(null);
  const isAdmin = room.users.find(u => u.id === socket.id)?.isAdmin || false;
  const isMuted = room.mutedUsers?.includes(socket.id) || false;

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

  // Admin actions
  const handleKickUser = (userId) => {
    if (window.confirm('Are you sure you want to kick this user?')) {
      socket.emit('kick-user', { roomId: room.id, userId });
    }
  };

  const handleToggleMute = (userId) => {
    socket.emit('toggle-mute-user', { roomId: room.id, userId });
  };

  const handleToggleLock = () => {
    socket.emit('toggle-lock-room', { roomId: room.id });
  };

  const handleTransferAdmin = (userId) => {
    if (window.confirm('Are you sure you want to transfer admin rights to this user?')) {
      socket.emit('transfer-admin', { roomId: room.id, newAdminId: userId });
    }
  };

  const handleTogglePlaybackControl = () => {
    socket.emit('toggle-playback-control', { roomId: room.id });
  };

  // Listen for video URL changes from other users
  useEffect(() => {
    // Load video if room already has one when component mounts
    if (room.videoUrl) {
      setVideoId(room.videoUrl);
    }

    // Load queue if room has one
    if (room.queue) {
      setQueue(room.queue);
    }

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

    socket.on('queue-updated', (updatedQueue) => {
      console.log('Queue updated:', updatedQueue);
      setQueue(updatedQueue);
    });

    socket.on('queue-finished', () => {
      console.log('Queue finished');
      alert('Queue finished! No more videos.');
    });

    return () => {
      socket.off('video-url-changed');
      socket.off('video-play');
      socket.off('video-pause');
      socket.off('video-seek');
      socket.off('queue-updated');
      socket.off('queue-finished');
    };
  }, [socket, room.videoUrl, room.queue]);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event) => {
    const currentTime = event.target.getCurrentTime();
    
    // 0 = ended, 1 = playing, 2 = paused
    if (event.data === 0) {
      // Video ended - trigger auto-play
      console.log('Video ended, playing next...');
      socket.emit('video-ended', { roomId: room.id });
    } else if (event.data === 1) {
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
    <div className="min-h-screen bg-[#0E1726] flex flex-col">
      {/* Header */}
      <div className="bg-[#131F2F] backdrop-blur-sm border-b border-[#1F2F44] px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-white">
              Watch<span className="text-[#1E5B99]">With</span>Me
            </h1>
            <div className="flex items-center gap-3 px-4 py-2 bg-[#1A2332] rounded-lg border border-[#2A3C52]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-white">Room: {room.id}</span>
            </div>
            {room.isLocked && (
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-900/30 rounded-lg border border-orange-700">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs font-semibold text-orange-400">Locked</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1A2332] rounded-lg border border-[#2A3C52]">
              <svg className="w-5 h-5 text-[#A1B0C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-semibold text-white">{room.users.length} Watching</span>
            </div>
            
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setShowYouTubeSearch(true);
                    setShowUrlInput(false);
                  }}
                  className="px-4 py-2 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#1E5B99]/20 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search YouTube
                </button>
                <button
                  onClick={() => {
                    setShowUrlInput(!showUrlInput);
                    setShowYouTubeSearch(false);
                  }}
                  className="px-4 py-2 bg-[#1A2332] hover:bg-[#2A3C52] text-white rounded-lg font-semibold text-sm transition-all border border-[#2A3C52]"
                >
                  {showUrlInput ? 'Cancel' : 'Paste URL'}
                </button>
                
                {/* Video Queue Button */}
                <VideoQueue 
                  queue={queue} 
                  socket={socket} 
                  roomId={room.id} 
                  isAdmin={isAdmin} 
                />
                
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="px-4 py-2 bg-[#1A2332] hover:bg-[#2A3C52] text-white rounded-lg font-semibold text-sm transition-all border border-[#2A3C52] flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {isAdmin && showAdminPanel && (
        <div className="bg-[#0B1220] border-b border-[#1F2F44] px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1E5B99]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Admin Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lock Room */}
              <button
                onClick={handleToggleLock}
                className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  room.isLocked 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-[#1A2332] hover:bg-[#2A3C52] text-white border border-[#2A3C52]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {room.isLocked ? 'Unlock Room' : 'Lock Room'}
              </button>

              {/* Playback Control */}
              <button
                onClick={handleTogglePlaybackControl}
                className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  room.playbackControl === 'admin-only'
                    ? 'bg-[#1E5B99] hover:bg-[#2672B8] text-white'
                    : 'bg-[#1A2332] hover:bg-[#2A3C52] text-white border border-[#2A3C52]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {room.playbackControl === 'admin-only' ? 'Admin Only Playback' : 'Everyone Can Control'}
              </button>

              {/* Info */}
              <div className="px-4 py-3 bg-[#1A2332] rounded-lg flex items-center justify-center border border-[#2A3C52]">
                <span className="text-[#A1B0C8] text-sm">
                  You are the admin
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 p-6 overflow-auto bg-[#0E1726]">
          <div className="max-w-6xl mx-auto">
            
            {/* URL Input (Admin Only) */}
            {isAdmin && showUrlInput && (
              <div className="mb-6 animate-slideUp">
                <div className="bg-[#1A2332] rounded-2xl p-6 shadow-lg border border-[#2A3C52]">
                  <h3 className="text-lg font-bold text-white mb-3">Load YouTube Video</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Paste YouTube URL here..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                      className="flex-1 px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5B99] focus:border-transparent text-white placeholder-[#5A6A7F]"
                    />
                    <button
                      onClick={handleUrlSubmit}
                      className="px-6 py-3 bg-[#1E5B99] hover:bg-[#2672B8] rounded-xl font-semibold text-white transition-all"
                    >
                      Load
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Muted Warning */}
            {isMuted && (
              <div className="mb-4 bg-red-900/30 border border-red-700 rounded-xl p-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <div>
                  <p className="font-semibold text-red-400">You have been muted</p>
                  <p className="text-sm text-red-300">You cannot send messages in chat</p>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1220] to-[#0E1726]">
                  <svg className="w-20 h-20 text-[#2A3C52] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#A1B0C8] text-lg mb-2">
                    {isAdmin ? 'Click "Search YouTube" or "Paste URL" to start watching' : 'Waiting for admin to load a video...'}
                  </p>
                  <p className="text-[#5A6A7F] text-sm">The video will sync automatically for everyone</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            {videoId && (
              <div className="bg-[#1A2332] rounded-2xl p-6 shadow-lg border border-[#2A3C52]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Now Playing</h2>
                    <p className="text-[#A1B0C8] text-sm">Video synced across all viewers</p>
                    {room.playbackControl === 'admin-only' && !isAdmin && (
                      <p className="text-orange-400 text-xs mt-1">Only admin can control playback</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 bg-green-900/30 rounded-lg border border-green-700">
                      <span className="text-green-400 text-xs font-semibold">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - User List */}
        <div className="w-80 bg-[#131F2F] backdrop-blur-sm border-l border-[#1F2F44] p-6 overflow-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1E5B99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Viewers ({room.users.length})
            </h3>
            
            <div className="space-y-2">
              {room.users.map(user => {
                const userIsMuted = room.mutedUsers?.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className="bg-[#1A2332] rounded-xl border border-[#2A3C52] overflow-hidden hover:border-[#1E5B99] transition-colors"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-10 h-10 bg-[#1E5B99] rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md">
                        {user.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate flex items-center gap-2">
                          {user.username || 'Unknown'}
                          {userIsMuted && (
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                          )}
                        </p>
                        <p className="text-xs text-[#A1B0C8]">
                          {user.isAdmin ? 'Admin' : 'Viewer'}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>

                    {/* Admin Controls for each user */}
                    {isAdmin && !user.isAdmin && (
                      <div className="bg-[#0E1726] px-3 py-2 flex gap-2">
                        <button
                          onClick={() => handleToggleMute(user.id)}
                          className={`flex-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                            userIsMuted
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-orange-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          {userIsMuted ? 'Unmute' : 'Mute'}
                        </button>
                        <button
                          onClick={() => handleTransferAdmin(user.id)}
                          className="flex-1 px-2 py-1 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded text-xs font-semibold transition-all"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() => handleKickUser(user.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-all"
                        >
                          Kick
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Room Info */}
          <div className="mt-6 p-4 bg-[#1A2332] rounded-xl border border-[#2A3C52]">
            <h4 className="font-bold text-white mb-2 text-sm">Room Details</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A1B0C8]">Room Code:</span>
                <span className="font-mono font-bold text-[#1E5B99]">{room.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1B0C8]">Your Role:</span>
                <span className="font-semibold text-white">{isAdmin ? 'Admin' : 'Viewer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1B0C8]">Status:</span>
                <span className={`font-semibold ${room.isLocked ? 'text-orange-400' : 'text-green-400'}`}>
                  {room.isLocked ? 'Locked' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1B0C8]">Playback:</span>
                <span className="font-semibold text-white text-[10px]">
                  {room.playbackControl === 'admin-only' ? 'Admin Only' : 'Everyone'}
                </span>
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
              className="w-full px-4 py-3 bg-[#1A2332] hover:bg-[#2A3C52] border-2 border-[#2A3C52] hover:border-[#1E5B99] rounded-xl font-semibold text-[#1E5B99] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Room Code
            </button>
          </div>
        </div>
      </div>

      {/* YouTube Search Modal */}
      {showYouTubeSearch && (
        <YouTubeSearch
          socket={socket}
          onSelectVideo={(url, title) => {
            const id = extractVideoId(url);
            if (id) {
              const playNow = window.confirm(
                `"${title}"\n\nClick OK to play now\nClick Cancel to add to queue`
              );
              
              if (playNow) {
                setVideoId(id);
                socket.emit('video-url-change', { roomId: room.id, videoUrl: id });
              } else {
                socket.emit('add-to-queue', { 
                  roomId: room.id, 
                  videoUrl: id, 
                  title: title 
                });
              }
            }
            setShowYouTubeSearch(false);
          }}
          onClose={() => setShowYouTubeSearch(false)}
        />
      )}
    </div>
  );
}

export default Room;