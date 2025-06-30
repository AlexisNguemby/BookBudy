import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
      const res = await fetch('http://localhost:5000/api/auth/register', { // fetch endpoint for registration
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de l’inscription.');

      setMessage('Inscription réussie ! Redirection en cours...');
      
     // direct to login after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ marginTop: '1rem' }}>S’inscrire</button>
      </form>

      {message && (
        <p style={{ marginTop: '1rem', color: message.includes('Erreur') ? 'red' : 'green' }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: '2rem' }}>
        Déjà un compte ?{' '}
        <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Se connecter
        </Link>
      </p>
    </div>
  );
}
