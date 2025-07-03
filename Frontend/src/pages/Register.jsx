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

      setMessage('Inscription réussie ! Redirection en cours...', { style: { color: 'green' } });
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#faf8f3',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '2rem',
      fontFamily: 'sans-serif'
    }}>
      {/* Logo + Titre */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
  <img src="../src/assets/logo.png" alt="Logo SEA BookBuddy" style={{ height: '200px', marginBottom: '0.5rem' }} />
        <h1 style={{ fontSize: '1.5rem' }}>
          Bienvenu sur <strong>BOOKBUDDY</strong>
        </h1>
      </div>

      {/* Formulaire encadré */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '300px',
        textAlign: 'left'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Nom d'utilisateur:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Mots de passe:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

        <button type="submit" className="register-button">S’inscrire</button>

        </form>

        {message && (
          <p style={{
            marginTop: '1rem',
            color: message.includes('Erreur') ? 'red' : 'green',
            fontSize: '0.9rem'
          }}>
            {message}
          </p>
        )}

        <p style={{ fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#3B82F6', textDecoration: 'none' }}>
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  marginBottom: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '0.95rem'
};

const buttonStyle = {
  width: '100%',
  padding: '8px',
  backgroundColor: '#c4a77d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '1rem'
};
