import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Home from './Home';
import Room from './Room';

const socket = io('http://localhost:3001');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server!');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('room-created', ({ roomId, room }) => {
      console.log('Room created:', roomId);
      setCurrentRoom(room);
    });

    socket.on('room-joined', ({ roomId, room }) => {
      console.log('Joined room:', roomId);
      setCurrentRoom(room);
    });

    socket.on('user-joined', (user) => {
      setCurrentRoom(prev => ({
        ...prev,
        users: [...prev.users, user]
      }));
    });

    socket.on('user-left', (userId) => {
      setCurrentRoom(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== userId)
      }));
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('error');
    };
  }, []);

  const handleCreateRoom = (username) => {
    setUsername(username);
    socket.emit('create-room', username);
  };

  const handleJoinRoom = (roomId, username) => {
    setUsername(username);
    socket.emit('join-room', { roomId, username });
  };

  return (
    <div className="min-h-screen">
      {!currentRoom ? (
        <Home onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      ) : (
        <Room room={currentRoom} socket={socket} currentUser={username} />
      )}
    </div>
  );
}

export default App;