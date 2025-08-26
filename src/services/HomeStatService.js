import api from './api';

/**
 * Service pour récupérer les statistiques publiques de la page d'accueil
 */
class HomeStatService {
  /**
   * Récupérer les statistiques publiques globales
   * GET /api/common/stats/public/
   * @returns {Promise} - Promesse contenant les statistiques publiques
   */
  async getPublicStats() {
    try {
      const response = await api.get('/api/common/stats/public/');
      console.log('📊 Statistiques publiques récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques publiques:', error);
      throw error;
    }
  }

  /**
   * Formater les statistiques pour l'affichage
   * @param {Object} statsData - Données brutes de l'API
   * @returns {Object} - Statistiques formatées pour l'affichage
   */
  formatStatsForDisplay(statsData) {
    if (!statsData || !statsData.statistics) {
      return this.getDefaultStats();
    }

    const { offers, users } = statsData.statistics;

    return {
      offers: {
        total: offers?.total || 0,
        jobOffers: offers?.job_offers || 0,
        consultationOffers: offers?.consultation_offers || 0,
        fundingOffers: offers?.funding_offers || 0,
        scholarshipOffers: offers?.scholarship_offers || 0
      },
      users: {
        total: users?.total || 0,
        recruiters: users?.recruiters || 0,
        candidates: users?.candidates || 0,
        providers: users?.providers || 0
      }
    };
  }

  /**
   * Obtenir les statistiques par défaut en cas d'erreur
   * @returns {Object} - Statistiques par défaut
   */
  getDefaultStats() {
    return {
      offers: {
        total: 0,
        jobOffers: 0,
        consultationOffers: 0,
        fundingOffers: 0,
        scholarshipOffers: 0
      },
      users: {
        total: 0,
        recruiters: 0,
        candidates: 0,
        providers: 0
      }
    };
  }

  /**
   * Formater un nombre avec le suffixe "+" si > 1000
   * @param {number} number - Nombre à formater
   * @returns {string} - Nombre formaté
   */
  formatNumber(number) {
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k+`;
    }
    return `${number}+`;
  }

  /**
   * Obtenir l'icône pour un type d'offre
   * @param {string} offerType - Type d'offre
   * @returns {string} - Classe CSS de l'icône
   */
  getOfferIcon(offerType) {
    const iconMap = {
      jobOffers: 'fas fa-briefcase',
      consultationOffers: 'fas fa-handshake',
      fundingOffers: 'fas fa-money-bill-wave',
      scholarshipOffers: 'fas fa-graduation-cap'
    };
    return iconMap[offerType] || 'fas fa-chart-bar';
  }

  /**
   * Obtenir le label pour un type d'offre
   * @param {string} offerType - Type d'offre
   * @returns {string} - Label formaté
   */
  getOfferLabel(offerType) {
    const labelMap = {
      jobOffers: 'Offres d\'emploi',
      consultationOffers: 'Consultations',
      fundingOffers: 'Financements',
      scholarshipOffers: 'Bourses d\'études'
    };
    return labelMap[offerType] || 'Offres';
  }

  /**
   * Obtenir la couleur pour un type d'offre
   * @param {string} offerType - Type d'offre
   * @returns {string} - Classe CSS de couleur
   */
  getOfferColor(offerType) {
    const colorMap = {
      jobOffers: 'text-blue-600',
      consultationOffers: 'text-fuchsia-600',
      fundingOffers: 'text-green-600',
      scholarshipOffers: 'text-purple-600'
    };
    return colorMap[offerType] || 'text-gray-600';
  }
}

export default new HomeStatService(); 