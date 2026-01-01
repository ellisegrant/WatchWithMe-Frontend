import { useState, useEffect, useRef } from 'react';

function Chat({ socket, roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const typingTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  // Notification sound
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,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');
  }, []);

  const quickReactions = ['👍', '❤️', '😂', '😍', '🔥', '👏'];
  const emojis = ['😀', '😂', '😍', '🥺', '😎', '🤔', '👍', '❤️', '🔥', '✨', '💯', '🎉'];

  // Play notification sound
  const playSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  // Messages
  useEffect(() => {
    socket.on('new-message', (message) => {
      console.log('💬 New message received:', message);
      setMessages(prev => [...prev, message]);
      
      // Play sound for new messages (not your own)
      if (message.username !== username) {
        playSound();
      }
      
      // Auto-remove message after 8 seconds
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== message.id));
      }, 8000);
    });

    return () => {
      socket.off('new-message');
    };
  }, [socket, username, soundEnabled]);

  // Reactions
  useEffect(() => {
    socket.on('new-reaction', (reaction) => {
      console.log('🎉 New reaction:', reaction);
      setReactions(prev => [...prev, reaction]);
      
      // Auto-remove reaction after 3 seconds
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 3000);
    });

    return () => {
      socket.off('new-reaction');
    };
  }, [socket]);

  // Typing indicators
  useEffect(() => {
    socket.on('user-typing', ({ username: typingUser }) => {
      setTypingUsers(prev => {
        if (!prev.includes(typingUser)) {
          return [...prev, typingUser];
        }
        return prev;
      });
    });

    socket.on('user-stopped-typing', ({ username: typingUser }) => {
      setTypingUsers(prev => prev.filter(u => u !== typingUser));
    });

    return () => {
      socket.off('user-typing');
      socket.off('user-stopped-typing');
    };
  }, [socket]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Emit typing start
    if (e.target.value.trim() && !typingTimeoutRef.current) {
      socket.emit('typing-start', { roomId, username });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to emit typing stop
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing-stop', { roomId, username });
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      console.log('📤 Sending message:', inputMessage);
      socket.emit('send-message', {
        roomId,
        message: inputMessage,
        username
      });
      setInputMessage('');
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      socket.emit('typing-stop', { roomId, username });
    }
  };

  const handleSendReaction = (emoji) => {
    socket.emit('send-reaction', {
      roomId,
      reaction: emoji,
      username
    });
    setShowReactionPicker(false);
  };

  const addEmoji = (emoji) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Parse message for @mentions
  const parseMessage = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-cyan-300 font-semibold bg-cyan-900/30 px-1 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating messages (TikTok style) */}
      <div className="absolute bottom-20 left-4 right-4 pointer-events-none z-10 space-y-2 max-w-md">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg animate-slideUp pointer-events-auto"
          >
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {msg.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm text-purple-300">{msg.username}: </span>
                <span className="text-sm text-white">{parseMessage(msg.message)}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg animate-pulse">
            <span className="text-xs text-gray-400">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
      </div>

      {/* Floating reactions (appear and float up) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute animate-float-up text-4xl"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              bottom: '20%',
            }}
          >
            {reaction.reaction}
          </div>
        ))}
      </div>

      {/* Quick Reactions Bar */}
      {showReactionPicker && (
        <div className="absolute bottom-20 right-4 z-20 bg-black/90 backdrop-blur-sm border border-purple-500 rounded-lg p-3 flex gap-2 animate-slideUp">
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSendReaction(emoji)}
              className="text-2xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Chat Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 items-end">
        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition"
          title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
        >
          {soundEnabled ? '🔔' : '🔕'}
        </button>

        {/* Reaction button */}
        <button
          onClick={() => {
            setShowReactionPicker(!showReactionPicker);
            setShowInput(false);
            setShowEmojiPicker(false);
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-lg transition"
          title="Quick reactions"
        >
          ❤️
        </button>

        {/* Chat button */}
        <button
          onClick={() => {
            setShowInput(!showInput);
            setShowReactionPicker(false);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition"
          title="Toggle chat"
        >
          💬
        </button>
      </div>

      {/* Chat input (appears when button clicked) */}
      {showInput && (
        <div className="absolute bottom-28 right-4 z-20 w-96 animate-slideUp">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mb-2 bg-black/90 backdrop-blur-sm border border-purple-500 rounded-lg p-3 grid grid-cols-6 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-xl"
              title="Add emoji"
            >
              😀
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message... (@mention)"
              autoFocus
              className="flex-1 px-4 py-2 bg-black/80 backdrop-blur-sm border border-purple-500 rounded-lg focus:outline-none focus:border-purple-400 text-white text-sm placeholder-gray-500"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chat;