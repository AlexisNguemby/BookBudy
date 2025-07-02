const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Définition des badges/récompenses
const REWARDS = [
  {
    name: "Premier Pas",
    description: "Félicitations ! Vous avez enregistré votre premier livre",
    emoji: "📚",
    threshold: 1,
    level: 1
  },
  {
    name: "Lecteur Débutant",
    description: "Bravo ! 5 livres dans votre bibliothèque",
    emoji: "📖",
    threshold: 5,
    level: 2
  },
  {
    name: "Bibliophile",
    description: "Excellent ! 10 livres collectionnés",
    emoji: "📝",
    threshold: 10,
    level: 3
  },
  {
    name: "Collectionneur",
    description: "Impressionnant ! 15 livres dans votre collection",
    emoji: "🏆",
    threshold: 15,
    level: 4
  },
  {
    name: "Maître Lecteur",
    description: "Extraordinaire ! 20 livres enregistrés",
    emoji: "👑",
    threshold: 20,
    level: 5
  },
  {
    name: "Légende Littéraire",
    description: "Incroyable ! 25 livres dans votre bibliothèque",
    emoji: "🌟",
    threshold: 25,
    level: 6
  }
];

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = { Reward, REWARDS };