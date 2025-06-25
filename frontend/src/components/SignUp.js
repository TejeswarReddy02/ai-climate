// src/components/SignUp.js
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './auth.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/weather');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      navigate('/weather');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleEmailSignUp} className="auth-form">
        <h2>Create your account</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="btn">Sign Up</button>
        <button type="button" className="google-btn" onClick={handleGoogleSignUp}>
          Continue with Google
        </button>
        <p>Already have an account? <a href="/signin">Sign In</a></p>
      </form>
    </div>
  );
}

export default SignUp;
