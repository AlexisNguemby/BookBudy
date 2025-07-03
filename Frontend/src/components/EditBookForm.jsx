import { useState } from 'react';

export default function EditBookForm({ book, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    cover: book.cover || '',
    status: book.status || '',
    pageCount: book.pageCount || '',
    lastPageRead: book.lastPageRead || '',
    category: book.category || '',
  });

  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`http://localhost:5000/api/books/${book._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur mise à jour livre');
      }

      const updatedBook = await res.json();
      onSave(updatedBook.book); // remonte la mise à jour
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top:0, left:0, right:0, bottom:0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div className="modal-content" style={{
        background: 'white',
        padding: 20,
        borderRadius: 8,
        width: '90%',
        maxWidth: 400,
      }}>
        <h3>Modifier le livre</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Auteur"
            value={formData.author}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cover"
            placeholder="URL de la couverture"
            value={formData.cover}
            onChange={handleChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Statut"
            value={formData.status}
            onChange={handleChange}
          />
          <input
            type="number"
            name="pageCount"
            placeholder="Nombre de pages"
            value={formData.pageCount}
            onChange={handleChange}
          />
          <input
            type="number"
            name="lastPageRead"
            placeholder="Dernière page lue"
            value={formData.lastPageRead}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Catégorie"
            value={formData.category}
            onChange={handleChange}
          />
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onCancel}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
