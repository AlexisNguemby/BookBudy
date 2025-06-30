const Book = require('../documents/Book');
const User = require('../documents/User');

exports.addBookToCollection = async (req, res) => {
  const userId = req.user.id;
  const { title, author, cover, status, pageCount, lastPageRead, category } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Le titre et l’auteur sont obligatoires.' });
  }

  try {
   
    const newBook = await Book.create({
      userId,
      title,
      author,
      cover: cover || '',
      status: status || '',
      pageCount: pageCount || 0,
      lastPageRead: lastPageRead || 0,
      category: category || '',
      isFavorite: true,
    });

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.favorites.push(newBook._id);
    await user.save();

    return res.status(201).json({ message: 'Livre ajouté à la collection', book: newBook });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.getUserBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const books = await Book.find({ userId });  // find books by userId
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};