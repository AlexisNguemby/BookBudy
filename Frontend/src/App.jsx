import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Navigate to="/register" replace />} /> {/* Redirect root to register page */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
