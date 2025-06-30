import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookComponent from '../components/BookComponent';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    status: '',
    pageCount: '',
    lastPageRead: '',
    category: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/profile', { // fetch endpoint for profile data
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur récupération profil');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    if (profile) {
      fetch('http://localhost:5000/api/books', {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur récupération livres');
          return res.json();
        })
        .then(data => setBooks(data))
        .catch(err => setError(err.message));
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', { // fetch endpoint for logout
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur lors de la déconnexion');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  // gestion du formulaire
  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/books', { // fetch endpoint for book addition
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Erreur ajout livre');
      const data = await res.json();
      setBooks(prev => [...prev, data.book]); // ajoute le nouveau livre dans la liste
      setFormData({
        title: '',
        author: '',
        cover: '',
        status: '',
        pageCount: '',
        lastPageRead: '',
        category: '',
      }); // reset form
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Chargement profil...</p>;

  return (
    <div>
      <h2>Profil de {profile.username}</h2>
      <p>Email : {profile.email}</p>

      <h3>Ajouter un livre</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="author"
          placeholder="Auteur"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="cover"
          placeholder="URL couverture"
          value={formData.cover}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="status"
          placeholder="Statut"
          value={formData.status}
          onChange={handleChange}
        />
        <br />
        <input
          type="number"
          name="pageCount"
          placeholder="Nombre de pages"
          value={formData.pageCount}
          onChange={handleChange}
          min="1"
        />
        <br />
        <input
          type="number"
          name="lastPageRead"
          placeholder="Dernière page lue"
          value={formData.lastPageRead}
          onChange={handleChange}
          min="0"
        />
        <br />
        <input
          type="text"
          name="category"
          placeholder="Catégorie"
          value={formData.category}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Ajouter le livre</button>
      </form>

      <h3>Ma collection de livres</h3>
      {books.length === 0 && <p>Pas encore de livres ajoutés.</p>}
      {books.map(book => (
        <BookComponent key={book._id} book={book} />
      ))}

      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
