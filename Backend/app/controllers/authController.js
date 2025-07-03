const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../documents/User');
const Book = require('../documents/Book');


//create the token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { //variable of secret token stocked in .env
   expiresIn: '5m' // 5 minutes

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
            maxAge: 5 * 60 * 1000 // 5 minutes
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
            maxAge: 5 * 60 * 1000 // 5 minutes
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


exports.updateProfile = async (req, res) => { // modifier profil
  try {
    const { email, currentPassword, newPassword } = req.body;
    
    // Récupérer l'utilisateur actuel
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const updateData = {};

    // Si un nouvel email est fourni
    if (email && email !== user.email) {
      // Vérifier si l'email n'est pas déjà utilisé
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      updateData.email = email;
    }

    // Si un nouveau mot de passe est fourni
    if (newPassword) {
      // Vérifier que le mot de passe actuel est fourni
      if (!currentPassword) {
        return res.status(400).json({ message: 'Le mot de passe actuel est requis pour le modifier' });
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    // Si aucune modification n'est demandée
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Aucune modification fournie' });
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.logout = (req, res) => { //logout
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Déconnecté avec succès' });
};
