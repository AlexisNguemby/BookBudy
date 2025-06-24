const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion MongoDB réussie'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

module.exports = mongoose;