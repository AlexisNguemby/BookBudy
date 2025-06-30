const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../documents/User');
const Book = require('../documents/Book');


//create the token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { //variable of secret token stocked in .env
    expiresIn: '7d' //496 heures = 7days
  });
};

exports.register = async (req, res) => {  //inscription
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email déjà utilisé.' });

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPwd
    });

    const token = generateToken(newUser._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ user: { id: newUser._id, username: newUser.username } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => { //login
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const token = generateToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 //7days
    });

    res.status(200).json({ user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.getProfile = async (req, res) => { // profil
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // get user book
    const books = await Book.find({ userId: req.user.id });

    res.status(200).json({ 
      id: user._id, 
      username: user.username, 
      email: user.email,
      books // list of the books
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.logout = (req, res) => { //logout
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Déconnecté avec succès' });
};
