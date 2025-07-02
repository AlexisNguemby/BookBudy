const User = require('../documents/User');
const Book = require('../documents/Book');
const { REWARDS } = require('../documents/Reward');

class RewardService {
  /**
   * Vérifie et attribue les badges appropriés à un utilisateur
   * @param {string} userId - ID de l'utilisateur
   */
  static async checkAndAwardBadges(userId) {
    try {
      // Compter le nombre de livres de l'utilisateur
      const bookCount = await Book.countDocuments({ userId });
      
      // Récupérer l'utilisateur avec ses badges actuels
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier quels badges l'utilisateur devrait avoir
      const earnedBadges = REWARDS.filter(reward => bookCount >= reward.threshold);
      
      // Vérifier quels badges sont nouveaux
      const newBadges = [];
      for (const reward of earnedBadges) {
        const hasbadge = user.badges.some(badge => badge.level === reward.level);
        if (!hasbadge) {
          newBadges.push({
            name: reward.name,
            description: reward.description,
            emoji: reward.emoji,
            level: reward.level,
            earnedAt: new Date()
          });
        }
      }

      // Ajouter les nouveaux badges à l'utilisateur
      if (newBadges.length > 0) {
        user.badges.push(...newBadges);
        await user.save();
      }

      return {
        totalBooks: bookCount,
        newBadges,
        allBadges: user.badges.sort((a, b) => a.level - b.level)
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des badges:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les badges disponibles avec le statut de progression
   * @param {string} userId - ID de l'utilisateur
   */
  static async getUserProgress(userId) {
    try {
      const bookCount = await Book.countDocuments({ userId });
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const progress = REWARDS.map(reward => {
        const hasEarned = user.badges.some(badge => badge.level === reward.level);
        const earnedDate = hasEarned 
          ? user.badges.find(badge => badge.level === reward.level).earnedAt 
          : null;

        return {
          ...reward,
          earned: hasEarned,
          earnedAt: earnedDate,
          progress: Math.min(bookCount, reward.threshold),
          progressPercentage: Math.min((bookCount / reward.threshold) * 100, 100)
        };
      });

      return {
        totalBooks: bookCount,
        progress,
        earnedBadges: user.badges.sort((a, b) => a.level - b.level)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du progrès:', error);
      throw error;
    }
  }

  /**
   * Récupère le prochain badge à débloquer
   * @param {string} userId - ID de l'utilisateur
   */
  static async getNextBadge(userId) {
    try {
      const bookCount = await Book.countDocuments({ userId });
      
      // Trouver le prochain badge non débloqué
      const nextBadge = REWARDS.find(reward => bookCount < reward.threshold);
      
      if (!nextBadge) {
        return null; // Tous les badges sont débloqués
      }

      return {
        ...nextBadge,
        booksNeeded: nextBadge.threshold - bookCount,
        progress: bookCount,
        progressPercentage: (bookCount / nextBadge.threshold) * 100
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du prochain badge:', error);
      throw error;
    }
  }
}

module.exports = RewardService;
