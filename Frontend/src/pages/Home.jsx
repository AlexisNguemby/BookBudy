import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import './Home.css';

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
];

function Home() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('fantasy');
  const [selectedCategory, setSelectedCategory] = useState('fantasy');
  const [loading, setLoading] = useState(false);
  const [addingBookId, setAddingBookId] = useState(null);
  const [modalBook, setModalBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&maxResults=20`
        );
        const data = await res.json();
        setBooks(data.items || []);
      } catch (err) {
        console.error('Erreur chargement livres:', err);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setSearchTerm('');
  };

  const handleAddToCollection = async (book) => {
    const info = book.volumeInfo;
    setAddingBookId(book.id);
    try {
      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: info.title,
          author: info.authors ? info.authors.join(', ') : 'Auteur inconnu',
          cover: info.imageLinks?.thumbnail || '',
          category: selectedCategory,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur ajout à la collection');
      }
      alert(`Livre "${info.title}" ajouté à votre collection !`);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setAddingBookId(null);
    }
  };

  const filteredBooks = searchTerm
    ? books.filter((book) =>
        book.volumeInfo.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : books;

  const openModal = (book) => setModalBook(book);
  const closeModal = () => setModalBook(null);

  return (
    <div>
      <Header />

      <section className="explore-container">
        <h2 className="explore-heading">Explorez notre Librairie</h2>

        <div className="explore-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`explore-category-btn ${
                selectedCategory === cat ? 'active-category' : ''
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Rechercher un livre par titre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="explore-search-input"
        />

        {loading ? (
          <p className="explore-status-text">Chargement des livres...</p>
        ) : filteredBooks.length === 0 ? (
          <p className="explore-status-text">Aucun livre trouvé pour cette recherche.</p>
        ) : (
          <div className="explore-book-grid">
            {filteredBooks.map((book) => {
              const info = book.volumeInfo;
              return (
                <div
                  key={book.id}
                  className="explore-book-card"
                  onClick={() => openModal(book)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={info.imageLinks?.thumbnail || '/placeholder.png'}
                    alt={info.title}
                    className="explore-book-img"
                  />
                  <div className="explore-book-details">
                    <h3 className="explore-book-title" title={info.title}>
                      {info.title}
                    </h3>
                    <p className="explore-book-authors">
                      {info.authors ? info.authors.join(', ') : 'Auteur inconnu'}
                    </p>
                    {info.publishedDate && (
                      <p className="explore-book-year">
                        Publié en {info.publishedDate.slice(0, 4)}
                      </p>
                    )}
                    <p className="explore-book-description">
                      {info.description
                        ? info.description.slice(0, 100) + '...'
                        : 'Pas de description disponible.'}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCollection(book);
                      }}
                      disabled={addingBookId === book.id}
                      className="add-collection-button"
                    >
                      {addingBookId === book.id ? 'Ajout en cours...' : 'Ajouter à ma collection'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {modalBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <h2>{modalBook.volumeInfo.title}</h2>
            {modalBook.volumeInfo.subtitle && (
              <h3
                style={{
                  fontWeight: 'normal',
                  fontStyle: 'italic',
                  marginTop: '-0.5rem',
                }}
              >
                {modalBook.volumeInfo.subtitle}
              </h3>
            )}
            <img
              src={modalBook.volumeInfo.imageLinks?.thumbnail || '/placeholder.png'}
              alt={modalBook.volumeInfo.title}
              style={{ maxWidth: '180px', margin: '1rem 0' }}
            />
            <p>
              <strong>Auteur(s):</strong>{' '}
              {modalBook.volumeInfo.authors?.join(', ') || 'Auteur inconnu'}
            </p>
            <p>
              <strong>Éditeur:</strong> {modalBook.volumeInfo.publisher || 'Inconnu'}
            </p>
            <p>
              <strong>Date de publication:</strong>{' '}
              {modalBook.volumeInfo.publishedDate || 'Inconnue'}
            </p>
            <p>
              <strong>Nombre de pages:</strong> {modalBook.volumeInfo.pageCount || 'N/A'}
            </p>
            <p>
              <strong>Catégories:</strong>{' '}
              {modalBook.volumeInfo.categories?.join(', ') || 'N/A'}
            </p>
            <p>
              <strong>Langue:</strong> {modalBook.volumeInfo.language || 'N/A'}
            </p>
            {modalBook.volumeInfo.averageRating && (
              <p>
                <strong>Note moyenne:</strong> {modalBook.volumeInfo.averageRating} / 5 (
                {modalBook.volumeInfo.ratingsCount || 0} évaluations)
              </p>
            )}
            <div
              style={{
                marginTop: '1rem',
                maxHeight: '250px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              <p>{modalBook.volumeInfo.description || 'Pas de description disponible.'}</p>
            </div>
            {modalBook.volumeInfo.infoLink && (
              <p style={{ marginTop: '1rem' }}>
                <a
                  href={modalBook.volumeInfo.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Plus d'infos sur Google Books
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
