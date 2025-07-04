import React from 'react';
import headerVideo from '../assets/book.mp4';
import '../components/header.css';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';  

const Header = () => {
  const { user, logout } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="header-container">
      <video autoPlay loop muted className="background-video">
        <source src={headerVideo} type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo HTML5.
      </video>

      <div className="video-overlay"></div>

      <nav className="nav-bar">
        <div className="logo">BookBuddy</div>

        <div className="nav-center">
          <div className="dropdown">
            <span>{user ? `Bienvenue, ${user.username}` : 'Mon compte'}</span>

            <div className="dropdown-content">
              {user ? (
                <>
                  <Link to="/profile">Mon profil</Link>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    Se déconnecter
                  </a>
                </>
              ) : (
                <>
                  <Link to="/register">S'inscrire</Link>
                  <Link to="/login">Connexion</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
