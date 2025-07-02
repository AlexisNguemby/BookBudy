import { useState } from 'react';

export default function EditBookForm({ book, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    cover: book.cover || '',
    status: book.status || '',
    pageCount: book.pageCount || 0,
    lastPageRead: book.lastPageRead || 0,
    category: book.category || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = `http://localhost:5000/api/books/${book._id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedBook = await response.json();
        onSave(updatedBook.book);
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du livre');
    }
  };

  return (
    <div>
      <div>
        <h2>Modifier le livre</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Titre *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Auteur *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>URL de la couverture</label>
            <input
              type="text"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Sélectionner un statut</option>
              <option value="À lire">À lire</option>
              <option value="En cours">En cours</option>
              <option value="Lu">Lu</option>
              <option value="Abandonné">Abandonné</option>
            </select>
          </div>

          <div>
            <label>Nombre de pages</label>
            <input
              type="number"
              name="pageCount"
              value={formData.pageCount}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <label>Dernière page lue</label>
            <input
              type="number"
              name="lastPageRead"
              value={formData.lastPageRead}
              onChange={handleChange}
              min="0"
              max={formData.pageCount}
            />
          </div>

          <div>
            <label>Catégorie</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Ex: Fiction, Science-fiction, Romance..."
            />
          </div>

          <div>
            <button
              type="button"
              onClick={onCancel}
            >
              Annuler
            </button>
            <button
              type="submit"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
