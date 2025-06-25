// src/components/Weather.js
import React, { useState } from 'react';
import './Weather.css'; // Create this file for custom styles

function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');

  const fetchWeather = async () => {
    try {
      const res = await fetch(`https://ai-climate.onrender.com/weather?city=${city}`);
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        setError('');
      } else {
        setWeather(null);
        setError(data.error);
      }
    } catch {
      setError('Server error. Try again later.');
    }
  };

  const handleAskAI = async () => {
    try {
      const res = await fetch('https://climate-api-set4.onrender.com/ask-ai', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, weather }),
      });
      const data = await res.json();
      setAiAnswer(data.answer);
    } catch {
      setAiAnswer('AI is unavailable. Please try later.');
    }
  };

  return (
    <div className="weather-page">
      <h1 className="weather-title">🌦 Check Weather in Your City</h1>

      <div className="weather-input-section">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="weather-input"
        />
        <button className="weather-btn" onClick={fetchWeather}>Get Weather</button>
      </div>

      {error && <p className="weather-error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.city}</h2>
          <p><strong>🌡 Temperature:</strong> {weather.temperature}°C</p>
          <p><strong>💧 Humidity:</strong> {weather.humidity}%</p>
          <p><strong>☁️ Condition:</strong> {weather.description}</p>
        </div>
      )}

      {weather && (
        <div className="ai-section">
          <h3>💬 Ask about this weather (or in your language)</h3>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g. Should I carry an umbrella? / इस मौसम में क्या पहनना चाहिए?"
            className="ai-input"
          />
          <button className="weather-btn" onClick={handleAskAI}>Ask AI</button>

          {aiAnswer && (
            <div className="ai-response">
              <p><strong>🤖 AI:</strong> {aiAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Weather;
