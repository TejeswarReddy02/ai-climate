import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!message) return;
    const newChat = [...chat, { sender: 'user', text: message }];
    setChat(newChat);
    setMessage('');

    try {
      const res = await fetch('https://climate-api-set4.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setChat([...newChat, { sender: 'bot', text: data.response }]);
    } catch {
      setChat([...newChat, { sender: 'bot', text: 'Bot is currently unavailable.' }]);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">🌿 Green bot</div>
          <div className="chat-body">
            {chat.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about the climate..."
            />
            <button onClick={sendMessage}>Send</button>
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
