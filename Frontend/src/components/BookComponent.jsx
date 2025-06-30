export default function BookComponent({ book }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
      <h3>{book.title}</h3>
      <p><strong>Auteur :</strong> {book.author}</p>
      {book.cover && <img src={book.cover} alt={book.title} style={{ width: 100 }} />}
      <p><strong>Statut :</strong> {book.status}</p>
      <p><strong>Pages :</strong> {book.pageCount}</p>
      <p><strong>Dernière page lue :</strong> {book.lastPageRead}</p>
      <p><strong>Catégorie :</strong> {book.category}</p>
    </div>
  );
}
