import { useState } from 'react';

function VideoQueue({ queue, socket, roomId, isAdmin }) {
  const [showQueue, setShowQueue] = useState(false);

  const handleRemoveFromQueue = (queueItemId) => {
    socket.emit('remove-from-queue', { roomId, queueItemId });
  };

  const handlePlayNext = () => {
    if (queue.length > 0) {
      socket.emit('play-next', { roomId });
    }
  };

  return (
    <>
      {/* Queue Toggle Button */}
      <button
        onClick={() => setShowQueue(!showQueue)}
        className="relative px-4 py-2 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Queue {queue.length > 0 && `(${queue.length})`}
        {queue.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
            {queue.length}
          </span>
        )}
      </button>

      {/* Queue Panel */}
      {showQueue && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#131F2F] shadow-2xl z-50 animate-slideIn border-l border-[#1F2F44]">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-[#1E5B99] p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Video Queue</h2>
                <p className="text-white/80 text-sm">{queue.length} video{queue.length !== 1 ? 's' : ''} in queue</p>
              </div>
              <button
                onClick={() => setShowQueue(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0E1726]">
              {queue.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-[#2A3C52] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <p className="text-[#A1B0C8]">Queue is empty</p>
                  <p className="text-[#5A6A7F] text-sm mt-2">Add videos from YouTube search</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queue.map((video, index) => (
                    <div
                      key={video.id}
                      className="bg-[#1A2332] rounded-xl p-3 shadow-sm border border-[#2A3C52] hover:border-[#1E5B99] hover:shadow-md transition group"
                    >
                      <div className="flex gap-3">
                        {/* Position Number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-[#1E5B99]/20 rounded-lg flex items-center justify-center font-bold text-[#2672B8]">
                          {index + 1}
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm line-clamp-2">
                            {video.title}
                          </h4>
                          {index === 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs font-semibold rounded border border-green-700">
                              Up Next
                            </span>
                          )}
                        </div>

                        {/* Remove Button */}
                        {isAdmin && (
                          <button
                            onClick={() => handleRemoveFromQueue(video.id)}
                            className="flex-shrink-0 w-8 h-8 bg-red-900/30 hover:bg-red-900/50 rounded-lg flex items-center justify-center transition opacity-0 group-hover:opacity-100 border border-red-700"
                            title="Remove from queue"
                          >
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Play Next Button */}
            {isAdmin && queue.length > 0 && (
              <div className="p-4 bg-[#131F2F] border-t border-[#1F2F44]">
                <button
                  onClick={handlePlayNext}
                  className="w-full px-4 py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Skip to Next Video
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default VideoQueue;