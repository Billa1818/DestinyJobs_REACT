import api from './api';

class FinancementService {
  
  /**
   * Récupération des offres de financement publiques avec filtres et pagination
   * @param {Object} filters - Filtres de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les offres avec pagination
   */
  async getPublicFundingOffers(filters = {}, page = 1, pageSize = 20) {
    try {
      const params = {
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      };
      
      const response = await api.get('/api/jobs/funding-offers/', { params });
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération des offres de financement');
    }
  }

  /**
   * Recherche d'offres par mot-clé
   * @param {string} query - Terme de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchFundingOffers(query, page = 1, pageSize = 20) {
    return this.getPublicFundingOffers({ query }, page, pageSize);
  }

  /**
   * Filtrage par secteur de financement
   * @param {number} sectorId - ID du secteur
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterBySector(sectorId, page = 1, pageSize = 20) {
    return this.getPublicFundingOffers({ sector: sectorId }, page, pageSize);
  }

  /**
   * Filtrage par cible de financement
   * @param {number} targetId - ID de la cible
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByTarget(targetId, page = 1, pageSize = 20) {
    return this.getPublicFundingOffers({ target: targetId }, page, pageSize);
  }

  /**
   * Filtrage par montant
   * @param {number} minAmount - Montant minimum
   * @param {number} maxAmount - Montant maximum (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByAmount(minAmount, maxAmount = null, page = 1, pageSize = 20) {
    const filters = { min_amount: minAmount };
    if (maxAmount) filters.max_amount = maxAmount;
    return this.getPublicFundingOffers(filters, page, pageSize);
  }

  /**
   * Filtrage par conditions
   * @param {boolean} noGuarantee - Sans garantie (optionnel)
   * @param {boolean} gracePeriod - Période de grâce disponible (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByConditions(noGuarantee = null, gracePeriod = null, page = 1, pageSize = 20) {
    const filters = {};
    if (noGuarantee !== null) filters.no_guarantee = noGuarantee;
    if (gracePeriod !== null) filters.grace_period_available = gracePeriod;
    return this.getPublicFundingOffers(filters, page, pageSize);
  }

  /**
   * Filtrage par localisation
   * @param {number} countryId - ID du pays
   * @param {number} regionId - ID de la région (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByLocation(countryId, regionId = null, page = 1, pageSize = 20) {
    const filters = { country: countryId };
    if (regionId) filters.region = regionId;
    return this.getPublicFundingOffers(filters, page, pageSize);
  }

  /**
   * Filtrage par zone géographique
   * @param {string} zone - Zone géographique
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByGeographicZone(zone, page = 1, pageSize = 20) {
    return this.getPublicFundingOffers({ geographic_zone: zone }, page, pageSize);
  }

  /**
   * Tri des offres
   * @param {string} sortBy - Champ de tri
   * @param {string} sortOrder - Ordre de tri (asc/desc)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async sortFundingOffers(sortBy, sortOrder = 'desc', page = 1, pageSize = 20) {
    return this.getPublicFundingOffers({ 
      sort_by: sortBy, 
      sort_order: sortOrder 
    }, page, pageSize);
  }

  /**
   * Combinaison de filtres avancés
   * @param {Object} filters - Objet contenant tous les filtres
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async getFilteredFundingOffers(filters = {}, page = 1, pageSize = 20) {
    return this.getPublicFundingOffers(filters, page, pageSize);
  }

  /**
   * Récupération des secteurs de financement
   * @returns {Promise} - Promesse contenant les secteurs
   */
  async getFundingSectors() {
    try {
      const response = await api.get('/api/jobs/funding-sectors/');
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération des secteurs de financement');
    }
  }

  /**
   * Récupération des cibles de financement
   * @returns {Promise} - Promesse contenant les cibles
   */
  async getFundingTargets() {
    try {
      const response = await api.get('/api/jobs/funding-targets/');
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération des cibles de financement');
    }
  }

  /**
   * Récupération des fonctions/Postes
   * @returns {Promise} - Promesse contenant les fonctions
   */
  async getJobFunctions() {
    try {
      const response = await api.get('/api/jobs/job-functions/');
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération des fonctions métier');
    }
  }

  /**
   * Récupération des secteurs d'activité
   * @returns {Promise} - Promesse contenant les secteurs
   */
  async getActivitySectors() {
    try {
      const response = await api.get('/api/jobs/activity-sectors/');
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération des secteurs d\'activité');
    }
  }

  /**
   * Récupération des pays
   * @returns {Promise} - Promesse contenant les pays
   */
  async getCountries() {
    try {
      const response = await api.get('/api/accounts/countries/');
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération des pays');
    }
  }

  /**
   * Récupération des régions
   * @param {number} countryId - ID du pays (optionnel)
   * @returns {Promise} - Promesse contenant les régions
   */
  async getRegions(countryId = null) {
    try {
      const params = countryId ? { country: countryId } : {};
      const response = await api.get('/api/accounts/regions/', { params });
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération des régions');
    }
  }

  /**
   * Récupération du détail d'une offre de financement
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse contenant le détail de l'offre
   */
  async getFundingOfferDetail(offerId) {
    try {
      const response = await api.get(`/api/jobs/funding-offers/${offerId}/`);
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la récupération du détail de l\'offre de financement');
    }
  }

  /**
   * Recherche avancée
   * @param {Object} searchParams - Paramètres de recherche avancée
   * @returns {Promise} - Promesse contenant les résultats
   */
  async advancedSearch(searchParams) {
    try {
      const response = await api.post('/api/jobs/funding-offers/advanced-search/', searchParams);
      return response.data;
    } catch (error) {
      throw this.handleFinancementError(error, 'Erreur lors de la recherche avancée');
    }
  }

  /**
   * Gestion des erreurs
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleFinancementError(error, defaultMessage) {
    let message = defaultMessage;

    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.error) {
        message = errorData.error;
      } else if (errorData.details) {
        const fieldErrors = Object.values(errorData.details).flat();
        message = fieldErrors.join(', ');
      } else if (typeof errorData === 'string') {
        message = errorData;
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error('Financement Error:', error);
    return new Error(message);
  }
}

// Créer une instance unique du service
const financementService = new FinancementService();

export default financementService; 