const mongoose = require('mongoose');
const User = require('./app/documents/User');
const RewardService = require('./app/services/RewardService');
require('dotenv').config();

const migrateUserBadges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB');

    // Récupérer tous les utilisateurs
    const users = await User.find({});
    console.log(`${users.length} utilisateurs trouvés`);

    for (const user of users) {
      try {
        console.log(`\nMigration des badges pour l'utilisateur: ${user.username}`);
        
        // Réinitialiser les badges de l'utilisateur
        user.badges = [];
        await user.save();
        
        // Vérifier et attribuer les badges appropriés
        const result = await RewardService.checkAndAwardBadges(user._id);
        
        console.log(`- ${result.totalBooks} livres`);
        console.log(`- ${result.newBadges.length} badges attribués`);
        result.newBadges.forEach(badge => {
          console.log(`  🏆 ${badge.emoji} ${badge.name}`);
        });
        
      } catch (error) {
        console.error(`Erreur pour l'utilisateur ${user.username}:`, error.message);
      }
    }

    await mongoose.disconnect();
    console.log('\nMigration terminée');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
};

migrateUserBadges();
