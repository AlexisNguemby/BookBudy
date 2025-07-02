const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Import des fonctions du contrôleur de manière plus explicite
const {
  getUserBadges,
  getNextBadge,
  checkBadges
} = require('../controllers/RewardController');

// Route pour récupérer tous les badges de l'utilisateur avec le progrès
router.get('/badges', protect, getUserBadges);

// Route pour récupérer le prochain badge à débloquer
router.get('/next-badge', protect, getNextBadge);

// Route pour forcer la vérification des badges (optionnel)
router.post('/check-badges', protect, checkBadges);

module.exports = router;
