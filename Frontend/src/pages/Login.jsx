import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', { // fetch endpoint for login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('Connexion réussie ! Redirection en cours...', { style: { color: 'green' } });

      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setMessage(err.message || 'Erreur');
    }
  };

  return (
    <div className="login-container">
      
      
        <h1 style={{ fontSize: '1.5rem' }}>
          Bienvenu sur <strong>BOOKBUDDY</strong>
        </h1>
    
      <div className="login-card">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">Se connecter</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}
