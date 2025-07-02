const mongoose = require('mongoose');
const { Reward, REWARDS } = require('./app/documents/Reward');
require('dotenv').config();

const initializeRewards = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB');

    // Supprimer les anciens badges s'ils existent
    await Reward.deleteMany({});
    console.log('Anciens badges supprimés');

    // Créer les nouveaux badges
    await Reward.insertMany(REWARDS);
    console.log('Badges initialisés avec succès');

    console.log('Badges créés:');
    REWARDS.forEach(reward => {
      console.log(`- ${reward.emoji} ${reward.name} (${reward.threshold} livres)`);
    });

    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des badges:', error);
    process.exit(1);
  }
};

initializeRewards();
