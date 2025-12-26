import { useState, useEffect, useRef } from 'react';

function Chat({ socket, roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    socket.on('new-message', (message) => {
      console.log('New message received:', message); // Debug log
      setMessages(prev => [...prev, message]);
      
      // Auto-remove message after 8 seconds (TikTok style)
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== message.id));
      }, 8000);
    });

    return () => {
      socket.off('new-message');
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      console.log('Sending message:', inputMessage); // Debug log
      socket.emit('send-message', {
        roomId,
        message: inputMessage,
        username
      });
      setInputMessage('');
      setShowInput(false);
    }
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
                <span className="text-sm text-white">{msg.message}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat input toggle button */}
      <button
        onClick={() => setShowInput(!showInput)}
        className="absolute bottom-4 right-4 z-20 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition"
      >
        💬
      </button>

      {/* Chat input (appears when button clicked) */}
      {showInput && (
        <div className="absolute bottom-16 right-4 z-20 w-80">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              autoFocus
              className="flex-1 px-4 py-2 bg-black/80 backdrop-blur-sm border border-purple-500 rounded-lg focus:outline-none focus:border-purple-400 text-white text-sm"
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