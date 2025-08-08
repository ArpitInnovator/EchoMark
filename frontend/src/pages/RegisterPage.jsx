import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Reuse the same CSS for consistency

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering:', formData);
    // Perform validation and API call here
    navigate('/dashboard'); // Redirect after successful registration
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Register</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className="login-input"
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          className="login-input"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          className="login-input"
        />
        <button type="submit" className="login-button">
          Register
        </button>
      </form>
      <p className="login-privacy" onClick={() => navigate('/')}>Back to Home</p>
    </div>
  );
};

export default RegisterPage;
