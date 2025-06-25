import React, { useRef, useState } from 'react';
import './Home.css';
import Chatbot from './Chatbot'; // Import the chatbot component

function Home() {
  const weatherRef = useRef(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(`https://climate-api-set4.onrender.com/weather?city=${city}`);

      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        setError('');
        setAiResponse('');
      } else {
        setWeather(null);
        setError(data.error || 'City not found.');
      }
    } catch (err) {
      setWeather(null);
      setError('Server Error. Please try again.');
    }
  };

  const askAI = async () => {
    if (!query || !weather) return;
    setLoading(true);
    setAiResponse('');
    try {
      const res = await fetch('https://climate-api.onrender.com/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, city: weather.city }),
      });
      const data = await res.json();
      setAiResponse(data.response || 'No response from AI.');
    } catch (err) {
      setAiResponse('🤖 AI is unavailable. Please try later.');
    }
    setLoading(false);
  };

  const scrollToWeather = () => {
    weatherRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  window.scrollToWeather = scrollToWeather;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Welcome to Climate Educator</h1>
          <p>
            This app helps you understand local weather conditions and how they relate to climate change.
            Enter a city to explore current conditions like temperature, humidity, and more.
            Stay informed and make climate-conscious decisions!
          </p>
          <button onClick={scrollToWeather}>Try It Now</button>
        </div>
        <img src="/images/greenimg.png" alt="Climate" className="hero-image" />
      </section>

      {/* Weather Section */}
      <section className="weather-section" ref={weatherRef}>
        <h2>🌥️ Check Weather in Your City</h2>
        <div className="input-group">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
          <button onClick={fetchWeather}>Get Weather</button>
        </div>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h3>{weather.city}</h3>
            <p><strong>🌡️ Temperature:</strong> {weather.temperature}°C</p>
            <p><strong>💧 Humidity:</strong> {weather.humidity}%</p>
            <p><strong>⛅ Condition:</strong> {weather.description}</p>
          </div>
        )}

        {weather && (
          <div className="ai-box">
            <h4>💬 Ask about this weather (or in your language)</h4>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Will it rain tomorrow?"
            />
            <button onClick={askAI} disabled={loading}>
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
            {aiResponse && <p><strong>🤖 AI:</strong> {aiResponse}</p>}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>Why Climate Educator?</h2>
        <p>
          Climate Educator helps users understand weather conditions and how they relate to climate change.
          You can get live weather data, AI-based suggestions, and multilingual explanations.
        </p>
      </section>

      {/* Suggestions Section */}
<div className="card-row">
  <div className="card">
    <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="Cool Clothing Icon" />
    <p><strong>Dress Smart in Heat</strong><br />
      Wear light cotton clothing.<br />
      Avoid dark colors that absorb heat.<br />
      Stay hydrated.<br />
      Use sunscreen to avoid sunburn.
    </p>
  </div>

  <div className="card">
    <img src="https://cdn-icons-png.flaticon.com/512/3159/3159894.png" alt="No Plastic Icon" />
    <p><strong>Say No to Plastic</strong><br />
      Use cloth bags and glass bottles.<br />
      Recycle household waste.<br />
      Participate in clean-up drives.<br />
      Save our environment.
    </p>
  </div>

  <div className="card">
    <img src="https://cdn-icons-png.flaticon.com/512/3448/3448335.png" alt="Public Transport Icon" />
    <p><strong>Use Public Transport</strong><br />
      Carpool when possible.<br />
      Take buses or metro trains.<br />
      Walk or cycle for short trips.<br />
      Reduce your carbon footprint.
    </p>
  </div>

  <div className="card">
    <img src="https://cdn-icons-png.flaticon.com/512/2909/2909764.png" alt="Tree Icon" />
    <p><strong>Plant More Trees</strong><br />
      Trees absorb carbon dioxide.<br />
      They cool down cities.<br />
      Join tree plantation drives.<br />
      Help restore green cover.
    </p>
  </div>

  <div className="card">
    <img src="https://cdn-icons-png.flaticon.com/512/3304/3304569.png" alt="Water Droplet Icon" />
    <p><strong>Save Water</strong><br />
      Fix leaking taps promptly.<br />
      Don’t leave the tap running.<br />
      Use buckets instead of showers.<br />
      Harvest and store rainwater.
    </p>
  </div>

  
</div>


      {/* Chatbot Section */}
      <Chatbot />
      {/* Footer Section */}
<footer className="footer">
  <div className="footer-column">
    <h4>About Us</h4>
    <p>
      Empowering users to learn about climate, weather, and eco-living.<br />
      Making sustainable choices simple and informed.
    </p>
  </div>

  <div className="footer-column">
    <h4>Quick Links</h4>
    <ul>
      <li><a href="#faq">FAQs</a></li>
      <li><a href="#privacy">Privacy Policy</a></li>
      <li><a href="#terms">Terms of Service</a></li>
    </ul>
  </div>

  <div className="footer-column">
    <h4>Contact Us</h4>
    <p>tejeswarreddybeduthuri@gmail.com.com</p>
    <li><a href="https://www.linkedin.com/in/b-tejeswarreddy" target="_blank" rel="noopener noreferrer">linkedin</a></li>
  </div>

  <div className="footer-column">
    <h4>Friends Links</h4>
    <ul>
      <li><a href="https://www.linkedin.com/in/satyanivas" target="_blank" rel="noopener noreferrer">Satya Nivas</a></li>
      <p>Satyanivas2345@gmail.com</p>
      <li><a href="https://www.linkedin.com/in/nakkaraju-lokeswari-j151106" target="_blank" rel="noopener noreferrer">Lokeswari</a></li>
      <p>nakkarajulokeswari@gmail.com</p>
    </ul>
  </div>
</footer>
{/* Footer Section */}
<footer style={{ textAlign: 'center', marginTop: '30px', color: '#444' }}>
  © {new Date().getFullYear()} Climate Educator. All rights reserved.
</footer>



    </div>
  );
}

export default Home;
