import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import './index.css'

import { UserProvider } from './context/UserContext';  

function App() {
  return (
    <UserProvider>   
      <Router>
        <>
          <Routes>
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="custom-toast-container"
            toastClassName="custom-toast"
          />
        </>
      </Router>
    </UserProvider>
  );
}

export default App;
