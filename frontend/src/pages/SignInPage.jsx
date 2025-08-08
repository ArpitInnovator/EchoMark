import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse styles

const SignInPage = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signing in with:', credentials);
    // You can perform your login logic or API call here
    navigate('/main'); // Replace with actual protected route
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Sign In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={credentials.email} 
          onChange={handleChange} 
          required 
          className="login-input"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={credentials.password} 
          onChange={handleChange} 
          required 
          className="login-input"
        />
        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
      <p className="login-privacy" onClick={() => navigate('/')}>Back to Home</p>
    </div>
  );
};

export default SignInPage;
