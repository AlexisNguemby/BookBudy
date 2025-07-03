import React, { useState, useEffect } from 'react';
import './BadgeDisplay.css';

const BadgeDisplay = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [nextBadge, setNextBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserBadges();
    fetchNextBadge();
  }, []);

  const fetchUserBadges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rewards/badges', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.data);
      } else {
        setError('Erreur lors de la récupération des badges');
      }
    } catch (error) {
      setError('Erreur de connexion');
      console.error('Erreur:', error);
    }
  };

  const fetchNextBadge = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rewards/next-badge', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNextBadge(data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du prochain badge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="badge-loading">Chargement des badges...</div>;
  }

  if (error) {
    return <div className="badge-error">{error}</div>;
  }

  return (
    <div className="badge-container">
      <h2 className="badge-title"> Mes Badges de Lecture</h2>
      
      {/* Statistiques générales */}
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number">{userProgress?.totalBooks || 0}</span>
          <span className="stat-label">Livres enregistrés</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{userProgress?.earnedBadges?.length || 0}</span>
          <span className="stat-label">Badges obtenus</span>
        </div>
      </div>

      {/* Prochain badge à débloquer */}
      {nextBadge && (
        <div className="next-badge-section">
          <h3> Prochain Objectif</h3>
          <div className="next-badge-card">
            <div className="badge-emoji-large">{nextBadge.emoji}</div>
            <div className="next-badge-info">
              <h4>{nextBadge.name}</h4>
              <p>{nextBadge.description}</p>
              <div className="progress-info">
                <span>Plus que {nextBadge.booksNeeded} livre(s) à ajouter !</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${nextBadge.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {nextBadge.progress} / {nextBadge.threshold}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badges obtenus */}
      <div className="earned-badges-section">
        <h3> Badges Obtenus</h3>
        {userProgress?.earnedBadges?.length > 0 ? (
          <div className="badges-grid">
            {userProgress.earnedBadges.map((badge, index) => (
              <div key={index} className="badge-card earned">
                <div className="badge-emoji">{badge.emoji}</div>
                <div className="badge-info">
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>
                  <span className="badge-date">
                    Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-badges">Aucun badge obtenu pour le moment. Ajoutez des livres pour commencer !</p>
        )}
      </div>

      {/* Tous les badges disponibles */}
      <div className="all-badges-section">
        <h3> Tous les Badges Disponibles</h3>
        <div className="badges-grid">
          {userProgress?.progress?.map((badgeProgress, index) => (
            <div 
              key={index} 
              className={`badge-card ${badgeProgress.earned ? 'earned' : 'locked'}`}
            >
              <div className="badge-emoji">{badgeProgress.emoji}</div>
              <div className="badge-info">
                <h4>{badgeProgress.name}</h4>
                <p>{badgeProgress.description}</p>
                <div className="badge-requirement">
                  {badgeProgress.threshold} livre(s) requis
                </div>
                {!badgeProgress.earned && (
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${badgeProgress.progressPercentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeDisplay;
