import { useState } from 'react';
import EditBookForm from './EditBookForm';
import './bookComponent.css';

export default function BookComponent({ book, onBookUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = (updatedBook) => {
    setCurrentBook(updatedBook);
    setIsEditing(false);
    if (onBookUpdate) onBookUpdate(updatedBook);
  };

  const progress = currentBook.pageCount > 0
    ? Math.round((currentBook.lastPageRead / currentBook.pageCount) * 100)
    : 0;

  return (
    <>
      <div className="book-card">
        {currentBook.category && (
          <div className="book-badge">{currentBook.category}</div>
        )}

        <div
          className="book-cover"
          style={{ backgroundImage: `url(${currentBook.cover || 'placeholder.jpg'})` }}
        />

        <div className="book-info">
          <h3 className="book-title">{currentBook.title}</h3>
          <p className="book-author">{currentBook.author}</p>
          <p className="book-meta">Statut : {currentBook.status}</p>
          <p className="book-meta">Pages : {currentBook.pageCount}</p>
          <p className="book-meta">Dernière page lue : {currentBook.lastPageRead}</p>
        </div>

        {currentBook.pageCount > 0 && (
          <div className="book-progress">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}

        <button className="edit-button" onClick={handleEdit}>Modifier</button>
      </div>

      {isEditing && (
        <EditBookForm
          book={currentBook}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
