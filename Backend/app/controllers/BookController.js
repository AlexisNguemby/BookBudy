const Book = require('../documents/Book');
const User = require('../documents/User');
const RewardService = require('../services/RewardService');

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

    // Vérifier et attribuer les badges
    const rewardResult = await RewardService.checkAndAwardBadges(userId);

    return res.status(201).json({ 
      message: 'Livre ajouté à la collection', 
      book: newBook,
      rewards: rewardResult
    });
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

exports.updateBook = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;
  const { title, author, cover, status, pageCount, lastPageRead, category } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Le titre et l\'auteur sont obligatoires.' });
  }

  try {
    // Vérifier que le livre appartient à l'utilisateur
    const book = await Book.findOne({ _id: bookId, userId });
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé ou vous n\'avez pas l\'autorisation de le modifier.' });
    }

    // Mettre à jour le livre
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        title,
        author,
        cover: cover || book.cover,
        status: status || book.status,
        pageCount: pageCount || book.pageCount,
        lastPageRead: lastPageRead || book.lastPageRead,
        category: category || book.category,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Livre mis à jour avec succès', book: updatedBook });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};