import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookComponent from '../components/BookComponent';
import EditBookForm from '../components/EditBookForm';
import BadgeDisplay from '../components/BadgeDisplay';
import BadgeNotification from '../components/BadgeNotification';
import AddBook from '../components/AddBookForm';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';

export default function Profile() {
  const { user, fetchUser, logout } = useUser();

  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [newBadges, setNewBadges] = useState([]);

  const [activeTab, setActiveTab] = useState('collection');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  const [editFormData, setEditFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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

  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  useEffect(() => {
    if (user) {
      setEditFormData((prev) => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (editFormData.newPassword && editFormData.newPassword !== editFormData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const updateData = {};

      if (editFormData.email && editFormData.email !== user.email) {
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

      await fetchUser();

      setActiveTab('collection');
      setError('');
      alert('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
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
      setBooks((prev) => [...prev, data.book]);

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

  const handleBookUpdate = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book._id === updatedBook._id ? updatedBook : book))
    );
  };

  const categories = [
    'fantasy',
    'romance',
    'science fiction',
    'horror',
    'history',
    'mystery',
    'biography',
    'children',
    'philosophy',
    'Tous',
  ];

  const filteredBooks =
    categoryFilter === 'Tous'
      ? books
      : books.filter((book) => book.category === categoryFilter);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Chargement profil...</p>;

  return (
    <div>
      <Header />

      <div className="profile-header">
        <button onClick={() => navigate('/Home')} className="back-button">
          ← Retour à l&apos;accueil
        </button>

        <div className="profile-container">
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2>Profil de {user.username}</h2>
            <p>Email : {user.email}</p>
            <button onClick={handleLogout} className="profile-button">
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="profile-layout">
        {/* Sidebar fixée à gauche */}
        <aside className="sidebar">
          {['collection', 'addBook', 'editProfile'].map((tab) => {
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
                className={`sidebar-button ${activeTab === tab ? 'active' : ''}`}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                {label}
              </button>
            );
          })}
        </aside>

        <main className="content-area">
          {activeTab === 'collection' && (
            <>
              <div className="category-filter">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`category-button ${
                      categoryFilter === cat ? 'active' : ''
                    }`}
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
                  {filteredBooks.map((book) => (
                    <BookComponent
                      key={book._id}
                      book={book}
                      onBookUpdate={handleBookUpdate}
                      onEdit={() => setEditingBook(book)}
                    />
                  ))}
                </div>
              )}
            </>
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
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          )}
        </main>
      </div>

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSave={(updatedBook) => {
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
