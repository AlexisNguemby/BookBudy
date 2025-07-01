import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookComponent from '../components/BookComponent';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
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

  // gestion du formulaire d'ajout de livre
  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // gestion du formulaire de modification du profil
  const handleEditChange = e => {
    setEditFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Vérification que les mots de passe correspondent
    if (editFormData.newPassword && editFormData.newPassword !== editFormData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const updateData = {};
      
      // Ajouter l'email s'il a été modifié
      if (editFormData.email && editFormData.email !== profile.email) {
        updateData.email = editFormData.email;
      }
      
      // Ajouter les mots de passe s'ils sont fournis
      if (editFormData.newPassword) {
        if (!editFormData.currentPassword) {
          setError('Le mot de passe actuel est requis pour modifier le mot de passe');
          return;
        }
        updateData.currentPassword = editFormData.currentPassword;
        updateData.newPassword = editFormData.newPassword;
      }

      // Vérifier qu'au moins une modification est demandée
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
      setShowEditForm(false);
      setEditFormData({
        email: data.user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError('');
      alert('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (profile) {
      setEditFormData(prev => ({
        ...prev,
        email: profile.email
      }));
    }
  }, [profile]);

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

  const handleBookUpdate = (updatedBook) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book._id === updatedBook._id ? updatedBook : book
      )
    );
  };

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Chargement profil...</p>;

  return (
    <div>
      <div>
        <h2>Profil de {profile.username}</h2>
        <p>Email : {profile.email}</p>
      </div>
      
      <button 
        onClick={() => setShowEditForm(!showEditForm)}
      >
        {showEditForm ? 'Annuler' : 'Modifier mes informations'}
      </button>

      {showEditForm && (
        <div>
          <h3>Modifier mes informations</h3>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label>Nouvel email (optionnel) :</label>
              <input
                type="email"
                name="email"
                placeholder={profile.email}
                value={editFormData.email}
                onChange={handleEditChange}
              />
            </div>

            <div>
              <label>Mot de passe actuel (requis pour changer le mot de passe) :</label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Mot de passe actuel"
                value={editFormData.currentPassword}
                onChange={handleEditChange}
              />
            </div>

            <div>
              <label>Nouveau mot de passe (optionnel) :</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe"
                value={editFormData.newPassword}
                onChange={handleEditChange}
              />
            </div>

            <div>
              <label>Confirmer le nouveau mot de passe :</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe"
                value={editFormData.confirmPassword}
                onChange={handleEditChange}
              />
            </div>

            <div>
              <button type="submit">
                Sauvegarder
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setError('');
                  setEditFormData({
                    email: profile.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div>{error}</div>}

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
       <select name="status" value={formData.status} onChange={handleChange}>
          <option value="">Sélectionner un statut</option>
           <option value="A lire">A lire</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>  
           </select>
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
       <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Sélectionner une catégorie</option>
          <option value="Action">Action</option>
          <option value="Aventure">Aventure</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horreur</option>
          <option value="science-fiction">Science-fiction</option>
        </select>
        <br />
        <button type="submit">Ajouter le livre</button>
      </form>

      <h3>Ma collection de livres</h3>
      {books.length === 0 && <p>Pas encore de livres ajoutés.</p>}
      {books.map(book => (
        <BookComponent key={book._id} book={book} onBookUpdate={handleBookUpdate} />
      ))}

      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
