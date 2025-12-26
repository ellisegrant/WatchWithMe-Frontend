import { useState } from 'react';

function Home({ onCreateRoom, onJoinRoom }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  const handleCreateRoom = () => {
    if (username.trim()) {
      onCreateRoom(username);
    }
  };

  const handleJoinRoom = () => {
    if (username.trim() && roomId.trim()) {
      onJoinRoom(roomId.toUpperCase(), username);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-900 text-white">
      <h1 className="text-5xl font-bold mb-2">🎬 WatchWithMe</h1>
      <p className="text-xl opacity-90 mb-8">Watch YouTube together with friends</p>

      <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl min-w-[350px] flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition"
        />

        {!showJoin ? (
          <>
            <button 
              onClick={handleCreateRoom} 
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!username.trim()}
            >
              Create Room
            </button>
            <button 
              onClick={() => setShowJoin(true)} 
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:-translate-y-1 transition"
            >
              Join Room
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition uppercase"
              maxLength={6}
            />
            <button 
              onClick={handleJoinRoom} 
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg hover:-translate-y-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!username.trim() || !roomId.trim()}
            >
              Join
            </button>
            <button 
              onClick={() => setShowJoin(false)} 
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:-translate-y-1 transition"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;