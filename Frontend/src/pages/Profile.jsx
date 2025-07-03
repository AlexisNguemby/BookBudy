import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookComponent from '../components/BookComponent';
import EditBookForm from '../components/EditBookForm';
import BadgeDisplay from '../components/BadgeDisplay';
import BadgeNotification from '../components/BadgeNotification';
import AddBook from '../components/AddBookForm'; 
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [newBadges, setNewBadges] = useState([]);

  const [activeTab, setActiveTab] = useState('collection');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  const [editFormData, setEditFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    status: '',
    pageCount: '',
    lastPageRead: '',
    category: '',
  });

  const [editingBook, setEditingBook] = useState(null);

  const navigate = useNavigate();

  // Fetch profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur récupération profil');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, []);

  // Fetch livres
  useEffect(() => {
    if (!profile) return;
    const fetchBooks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/books', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur récupération livres');
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBooks();
  }, [profile]);


  useEffect(() => {
    if (profile) {
      setEditFormData(prev => ({
        ...prev,
        email: profile.email || '',
      }));
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur lors de la déconnexion');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setError('');

    if (editFormData.newPassword && editFormData.newPassword !== editFormData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const updateData = {};

      if (editFormData.email && editFormData.email !== profile.email) {
        updateData.email = editFormData.email;
      }

      if (editFormData.newPassword) {
        if (!editFormData.currentPassword) {
          setError('Le mot de passe actuel est requis pour modifier le mot de passe');
          return;
        }
        updateData.currentPassword = editFormData.currentPassword;
        updateData.newPassword = editFormData.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        setError('Aucune modification détectée');
        return;
      }

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      const data = await res.json();
      setProfile(prev => ({ ...prev, ...data.user }));
      setActiveTab('collection');
      setError('');
      alert('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur ajout livre');
      }

      const data = await res.json();
      setBooks(prev => [...prev, data.book]);

      if (data.rewards?.newBadges?.length > 0) {
        setNewBadges(data.rewards.newBadges);
      }

      setFormData({
        title: '',
        author: '',
        cover: '',
        status: '',
        pageCount: '',
        lastPageRead: '',
        category: '',
      });

      setActiveTab('collection');
    } catch (err) {
      setError(err.message);
    }
  };

 
  const handleBookUpdate = updatedBook => {
    setBooks(prevBooks =>
      prevBooks.map(book => (book._id === updatedBook._id ? updatedBook : book))
    );
  };

  const categories = ['Tous', 'Action', 'Horreur', 'Aventure', 'Romance', 'Manga'];

  const filteredBooks =
    categoryFilter === 'Tous'
      ? books
      : books.filter(book => book.category === categoryFilter);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Chargement profil...</p>;

  return (
    <div>
      <div className="profile-wrapper">
        <div className="profile-container">
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2>Profil de {profile.username}</h2>
            <p>Email : {profile.email}</p>
            <button onClick={handleLogout} className="profile-button">Déconnexion</button>
          </div>
        </div>
      </div>

      <nav className="tab-nav">
        {['collection', 'addBook', 'editProfile'].map(tab => {
          const label =
            tab === 'collection'
              ? 'Ma collection'
              : tab === 'addBook'
                ? 'Ajouter un livre'
                : 'Modifier mes informations';

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {activeTab === 'collection' && (
        <div>
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`category-button ${categoryFilter === cat ? 'active' : ''}`}
                aria-pressed={categoryFilter === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <p className="no-books-msg">Pas encore de livres dans cette catégorie.</p>
          ) : (
            <div className="books-container">
              {filteredBooks.map(book => (
                <BookComponent
                  key={book._id}
                  book={book}
                  onBookUpdate={handleBookUpdate}
                  onEdit={() => setEditingBook(book)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'addBook' && (
        <AddBook
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          categories={categories}
        />
      )}

      {activeTab === 'editProfile' && (
        <div className="edit-profile-form">
          <h3>Modifier mes informations</h3>
          <form onSubmit={handleEditSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editFormData.email}
              onChange={handleEditChange}
              required
            />
            <input
              type="password"
              name="currentPassword"
              placeholder="Mot de passe actuel"
              value={editFormData.currentPassword}
              onChange={handleEditChange}
              autoComplete="current-password"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Nouveau mot de passe"
              value={editFormData.newPassword}
              onChange={handleEditChange}
              autoComplete="new-password"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le nouveau mot de passe"
              value={editFormData.confirmPassword}
              onChange={handleEditChange}
              autoComplete="new-password"
            />
            <button type="submit">Mettre à jour</button>
          </form>
        </div>
      )}

      {/* Modal édition livre */}
      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSave={updatedBook => {
            handleBookUpdate(updatedBook);
            setEditingBook(null);
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <BadgeDisplay />

      {newBadges.length > 0 && (
        <BadgeNotification badges={newBadges} onClose={() => setNewBadges([])} />
      )}
    </div>
  );
}
