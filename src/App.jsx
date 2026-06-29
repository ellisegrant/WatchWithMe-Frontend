import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import supabase from './config/supabase';
import Home from './Home';
import Room from './Room';
import AuthPage from './components/auth/AuthPage';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

// Ping backend every 10 minutes to keep it alive
setInterval(() => {
  fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/ping`)
    .catch(() => {});
}, 10 * 60 * 1000);

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setAuthUser({
                id: session.user.id,
                email: session.user.email,
                username: profile.username,
                avatar_url: profile.avatar_url,
                token: session.access_token
              });
            } else {
              // Google user with no profile yet - create one
              const username = session.user.user_metadata?.full_name?.replace(/\s+/g, '') || 
                               session.user.email.split('@')[0];
              supabase.from('profiles').insert({
                id: session.user.id,
                username,
                email: session.user.email,
                avatar_url: session.user.user_metadata?.avatar_url
              }).then(() => {
                setAuthUser({
                  id: session.user.id,
                  email: session.user.email,
                  username,
                  avatar_url: session.user.user_metadata?.avatar_url,
                  token: session.access_token
                });
              });
            }
          });
      }
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setAuthUser({
              id: session.user.id,
              email: session.user.email,
              username: profile.username,
              avatar_url: profile.avatar_url,
              token: session.access_token
            });
          } else {
            // Google user - create profile
            const username = session.user.user_metadata?.full_name?.replace(/\s+/g, '') ||
                             session.user.email.split('@')[0];
            await supabase.from('profiles').insert({
              id: session.user.id,
              username,
              email: session.user.email,
              avatar_url: session.user.user_metadata?.avatar_url
            });
            setAuthUser({
              id: session.user.id,
              email: session.user.email,
              username,
              avatar_url: session.user.user_metadata?.avatar_url,
              token: session.access_token
            });
          }
        }

        if (event === 'SIGNED_OUT') {
          setAuthUser(null);
          setCurrentRoom(null);
          setCurrentUser('');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

  const handleAuthSuccess = (user) => {
    setAuthUser(user);
  };

  const handleSkipAuth = () => {
    setAuthUser({ guest: true, username: 'Guest' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setCurrentRoom(null);
    setCurrentUser('');
  };

  const handleCreateRoom = (username) => {
    const name = username || authUser?.username;
    console.log('Creating room with username:', name);
    setCurrentUser(name);
    socket.emit('create-room', { username: name });
  };

  const handleJoinRoom = (roomId, username) => {
    const name = username || authUser?.username;
    console.log('Joining room:', roomId, 'with username:', name);
    setCurrentUser(name);
    socket.emit('join-room', { roomId, username: name });
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0E1726] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1E5B99] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#A1B0C8]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!authUser) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        onSkip={handleSkipAuth}
      />
    );
  }

  return (
    <>
      {!currentRoom ? (
        <Home
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          socket={socket}
          authUser={authUser}
          onLogout={handleLogout}
        />
      ) : (
        <Room
          room={currentRoom}
          socket={socket}
          currentUser={currentUser}
          authUser={authUser}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;