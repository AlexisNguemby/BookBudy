const RewardService = require('../services/RewardService');

exports.getUserBadges = async (req, res) => {
  const userId = req.user.id;

  try {
    const userProgress = await RewardService.getUserProgress(userId);
    
    res.status(200).json({
      message: 'Badges récupérés avec succès',
      data: userProgress
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des badges:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des badges' 
    });
  }
};

exports.getNextBadge = async (req, res) => {
  const userId = req.user.id;

  try {
    const nextBadge = await RewardService.getNextBadge(userId);
    
    if (!nextBadge) {
      return res.status(200).json({
        message: 'Félicitations ! Vous avez débloqué tous les badges disponibles !',
        data: null
      });
    }

    res.status(200).json({
      message: 'Prochain badge récupéré avec succès',
      data: nextBadge
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du prochain badge:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération du prochain badge' 
    });
  }
};

exports.checkBadges = async (req, res) => {
  const userId = req.user.id;

  try {
    const rewardResult = await RewardService.checkAndAwardBadges(userId);
    
    res.status(200).json({
      message: 'Vérification des badges effectuée',
      data: rewardResult
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des badges:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la vérification des badges' 
    });
  }
};
