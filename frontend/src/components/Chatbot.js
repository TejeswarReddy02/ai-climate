import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { sender: 'user', text: message }];
    setChat(newChat);
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('https://ai-climate.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }), // ✅ Fixed key
      });

      const data = await res.json();
      const botResponse = data.response || 'Green Bot is currently unavailable.';
      setChat([...newChat, { sender: 'bot', text: botResponse }]);
    } catch {
      setChat([...newChat, { sender: 'bot', text: 'Green Bot is currently unavailable.' }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">🌿 Green Bot</div>
          <div className="chat-body">
            {chat.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="chat-msg bot">Typing...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder="Ask about the climate..."
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      )}
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? '✖' : '💬'}
      </button>
    </div>
  );
}

export default Chatbot;
