import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h1 className="login-title">EchoMark</h1>

      <button className="login-button" onClick={() => navigate('/signin')}>
        Sign In
      </button>
      <button className="login-button" onClick={() => navigate('/register')}>
        Register
      </button>
      <button className="login-button" onClick={() => navigate('/anonymous')}>
        Continue as anonymous
      </button>

      <p className="login-privacy">Our Privacy Policy</p>
    </div>
  );
};

export default LoginPage;
