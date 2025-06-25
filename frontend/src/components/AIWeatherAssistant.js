import React, { useState } from 'react';

function AIWeatherAssistant({ city }) {
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const selectedCity = city || 'your location';

  const askAI = async () => {
    try {
      const res = await fetch('https://ai-climate.onrender.com/ask-ai', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion, city: selectedCity })
      });
      const data = await res.json();
      setAIResponse(data.response);
    } catch (err) {
      setAIResponse('🤖 AI is unavailable. Please try later.');
    }
  };

  return (
    <div className="ai-weather-section">
      <h3>Ask about this weather (or in your language)</h3>
      <input
        type="text"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        placeholder="e.g., Should I carry an umbrella?"
        className="input-box"
      />
      <button onClick={askAI} className="ask-ai-button">Ask AI</button>

      {aiResponse && (
        <div className="ai-response">
          <p>🤖 AI: {aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default AIWeatherAssistant;
