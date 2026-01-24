import { useState, useEffect } from 'react';

function SearchModal({ isOpen, onClose, socket, onCreateRoom }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('search-results', (videos) => {
      console.log('Search results received:', videos);
      setSearchResults(videos);
      setLoading(false);
      setError('');
    });

    socket.on('search-error', (errorMessage) => {
      console.error('Search error:', errorMessage);
      setError(errorMessage || 'Failed to search videos. Please try again.');
      setLoading(false);
    });

    return () => {
      socket.off('search-results');
      socket.off('search-error');
    };
  }, [socket]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);
    
    console.log('Searching for:', searchQuery);
    socket.emit('search-youtube', { query: searchQuery });
  };

  const handleVideoSelect = (video) => {
    const name = prompt(`Watch "${video.title}"?\n\nEnter your name to start:`);
    if (name && name.trim()) {
      // Close modal
      onClose();
      // Create room with user's name
      onCreateRoom(name.trim(), video.id);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A2332] rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slideUp border border-[#2A3C52]">
        {/* Header */}
        <div className="bg-[#1E5B99] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Search YouTube
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-[#2A3C52]">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for videos..."
              className="flex-1 px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E5B99] focus:border-transparent text-white placeholder-[#5A6A7F]"
              autoFocus
            />
            <button
              type="submit"
              disabled={!searchQuery.trim() || loading}
              className="px-6 py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-220px)] bg-[#0E1726]">
          {error && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-[#1E5B99] hover:text-[#2672B8] text-sm"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && searchResults.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-[#2A3C52] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-[#A1B0C8]">Search for videos to watch together</p>
              <p className="text-[#5A6A7F] text-sm mt-2">Try searching for music, movies, or your favorite creators</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#1E5B99] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#A1B0C8]">Searching YouTube...</p>
            </div>
          )}

          {!loading && !error && searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className="flex gap-4 p-3 bg-[#1A2332] hover:bg-[#2A3C52] rounded-xl cursor-pointer transition border border-[#2A3C52] hover:border-[#1E5B99] group"
                >
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-48 h-28 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition flex items-center justify-center">
                      <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-[#2672B8] transition">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[#A1B0C8] mb-1">{video.channelTitle}</p>
                    {video.description && (
                      <p className="text-xs text-[#5A6A7F] line-clamp-2">{video.description}</p>
                    )}
                  </div>

                  {/* Select indicator */}
                  <div className="flex items-center">
                    <div className="px-3 py-1 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg text-sm font-semibold transition opacity-0 group-hover:opacity-100">
                      Watch
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;