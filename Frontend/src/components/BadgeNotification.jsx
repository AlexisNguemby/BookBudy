import React, { useEffect, useState } from 'react';
import './BadgeNotification.css';

const BadgeNotification = ({ badges, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (badges && badges.length > 0) {
      setVisible(true);
      // Auto-fermeture après 5 secondes
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Délai pour l'animation
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [badges, onClose]);

  if (!badges || badges.length === 0) return null;

  return (
    <div className={`badge-notification-overlay ${visible ? 'visible' : ''}`}>
      <div className="badge-notification-container">
        <div className="badge-notification-header">
          <h2> Nouveau Badge Obtenu !</h2>
          <button 
            className="close-btn"
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            ×
          </button>
        </div>
        
        <div className="new-badges-list">
          {badges.map((badge, index) => (
            <div key={index} className="new-badge-item">
              <div className="badge-emoji-notification">{badge.emoji}</div>
              <div className="badge-details">
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="notification-footer">
          <p>Continuez à ajouter des livres pour débloquer plus de badges !</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;
