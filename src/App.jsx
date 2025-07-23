import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
 import SignInPage from './pages/SignInPage';
 import RegisterPage from './pages/RegisterPage';
 import MainScreen from './pages/MainScreen';
// import AnonymousPage from './pages/AnonymousPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<SignInPage />} />
        <Route path="/main" element={<MainScreen />} />
         
        {/* <Route path="/anonymous" element={<AnonymousPage />} /> */} 
      </Routes>
    </Router>
  );
}

export default App;
