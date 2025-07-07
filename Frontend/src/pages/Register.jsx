import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de l’inscription.');

      setMessage('Inscription réussie ! Redirection en cours...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="register-container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img
          src="../src/assets/logo.png"
          alt="Logo SEA BookBuddy"
          style={{ height: '200px', marginBottom: '0.5rem' }}
        />
        <h1 className="register-title">
          Bienvenue sur <strong>BOOKBUDDY</strong>
        </h1>
      </div>

      <div className="register-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-button">S’inscrire</button>
        </form>

        {message && (
          <p className="register-message" style={{ color: message.includes('Erreur') ? 'red' : 'rgb(48, 201, 43)' }}>
            {message}
          </p>
        )}

        <p style={{ fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#C19A6B', textDecoration: 'none' }}>
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
