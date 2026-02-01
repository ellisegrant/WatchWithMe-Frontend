import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Home from './Home';
import Room from './Room';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server!', socket.id);
    });

    socket.on('room-created', (room) => {
      console.log('Room created:', room);
      setCurrentRoom(room);
    });

    socket.on('room-joined', (room) => {
      console.log('Joined room:', room);
      setCurrentRoom(room);
    });

    socket.on('user-joined', (user) => {
      console.log('User joined:', user);
      setCurrentRoom(prev => ({
        ...prev,
        users: [...prev.users, user]
      }));
    });

    socket.on('user-left', (user) => {
      console.log('User left:', user);
      setCurrentRoom(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== user.id)
      }));
    });

    socket.on('user-kicked', (user) => {
      console.log('User kicked:', user);
      setCurrentRoom(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== user.id)
      }));
    });

    socket.on('room-updated', (updatedRoom) => {
      console.log('Room updated:', updatedRoom);
      setCurrentRoom(updatedRoom);
    });

    socket.on('kicked', ({ message }) => {
      alert(message);
      setCurrentRoom(null);
      setCurrentUser('');
    });

    socket.on('error', (message) => {
      console.error('Error:', message);
      alert(message);
    });

    return () => {
      socket.off('connect');
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('user-kicked');
      socket.off('room-updated');
      socket.off('kicked');
      socket.off('error');
    };
  }, []);

  const handleCreateRoom = (username) => {
    console.log('Creating room with username:', username);
    setCurrentUser(username);
    socket.emit('create-room', { username });
  };

  const handleJoinRoom = (username, roomId) => {
    console.log('Joining room:', roomId, 'with username:', username);
    setCurrentUser(username);
    socket.emit('join-room', { roomId, username });
  };

  return (
    <>
      {!currentRoom ? (
        <Home 
          onCreateRoom={handleCreateRoom} 
          onJoinRoom={handleJoinRoom}
          socket={socket}
        />
      ) : (
        <Room 
          room={currentRoom} 
          socket={socket} 
          currentUser={currentUser} 
        />
      )}
    </>
  );
}

export default App;