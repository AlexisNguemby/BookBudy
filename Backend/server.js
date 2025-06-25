// Connexion à la base de données
require('./app/config/Database');

const express = require('express');
const app = express();
const User = require('./app/documents/User');
const Book = require('./app/documents/Book');

app.use(express.json()); // Pour parser le JSON

// // Route pour créer un utilisateur
// app.post('/users', async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Route pour récupérer tous les utilisateurs
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Route pour créer un livre
// app.post('/books', async (req, res) => {
//   try {
//     const book = new Book(req.body);
//     await book.save();
//     res.status(201).json(book);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Route pour récupérer tous les livres
// app.get('/books', async (req, res) => {
//   try {
//     const books = await Book.find();
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`);
// });
