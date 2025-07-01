import { useState } from 'react';
import EditBookForm from './EditBookForm';

export default function BookComponent({ book, onBookUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedBook) => {
    setCurrentBook(updatedBook);
    setIsEditing(false);
    if (onBookUpdate) {
      onBookUpdate(updatedBook);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div>
        <div>
          <div>
            <h3>{currentBook.title}</h3>
            <p><strong>Auteur :</strong> {currentBook.author}</p>
            {currentBook.cover && (
              <img 
                src={currentBook.cover} 
                alt={currentBook.title}
              />
            )}
            <p><strong>Statut :</strong> {currentBook.status}</p>
            <p><strong>Pages :</strong> {currentBook.pageCount}</p>
            <p><strong>Dernière page lue :</strong> {currentBook.lastPageRead}</p>
            <p><strong>Catégorie :</strong> {currentBook.category}</p>
          </div>
          
          <button
            onClick={handleEdit}
          >
             Modifier
          </button>
        </div>
        
        {currentBook.pageCount > 0 && (
          <div>
            <strong>Progression : </strong>
            {Math.round((currentBook.lastPageRead / currentBook.pageCount) * 100)}%
            <div>
              <div style={{ 
                width: `${(currentBook.lastPageRead / currentBook.pageCount) * 100}%`
              }}></div>
            </div>
          </div>
        )}
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
