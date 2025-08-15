import api from './api';

class ConsultationService {
  
  /**
   * Récupération des pays
   * @returns {Promise} - Promesse contenant la liste des pays
   */
  async getCountries() {
    try {
      const response = await api.get('/api/auth/countries/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des pays');
    }
  }

  /**
   * Récupération des régions d'un pays
   * @param {number} countryId - ID du pays
   * @returns {Promise} - Promesse contenant la liste des régions
   */
  async getRegionsByCountry(countryId) {
    try {
      const response = await api.get(`/api/auth/countries/${countryId}/regions/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des régions');
    }
  }

  // ===== MÉTHODES DE CONSULTATION =====

  /**
   * Récupération des types de consultation
   * @returns {Promise} - Promesse contenant la liste des types
   */
  async getConsultationTypes() {
    try {
      const response = await api.get('/api/jobs/consultation-types/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des types de consultation');
    }
  }

  /**
   * Création d'une offre de consultation
   * @param {Object} consultationData - Données de la consultation
   * @returns {Promise} - Promesse contenant la consultation créée
   */
  async createConsultationOffer(consultationData) {
    try {
      const response = await api.post('/api/jobs/consultation-offers/', consultationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la création de l\'offre de consultation');
    }
  }

  /**
   * Récupération de mes offres de consultation (recruteur connecté)
   * @returns {Promise} - Promesse contenant la liste des consultations
   */
  async getMyConsultationOffers() {
    try {
      const response = await api.get('/api/jobs/my-consultation-offers/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération de vos offres de consultation');
    }
  }

  /**
   * Récupération du détail d'une offre de consultation
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse contenant le détail de l'offre
   */
  async getConsultationOfferDetail(offerId) {
    try {
      const response = await api.get(`/api/jobs/consultation-offers/${offerId}/`);
      return response.data;
    } catch (error) {
      // Propager l'erreur avec le statut pour la gestion côté composant
      if (error.response?.status === 403 || error.response?.status === 404) {
        throw error; // Propager l'erreur pour redirection vers 404
      }
      throw this.handleError(error, 'Erreur lors de la récupération du détail de l\'offre');
    }
  }

  /**
   * Récupération du détail public d'une offre de consultation
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse contenant le détail public de l'offre
   */
  async getPublicConsultationDetail(offerId) {
    try {
      const response = await api.get(`/api/jobs/consultation-offers/public/${offerId}/`);
      return response.data;
    } catch (error) {
      // Propager l'erreur avec le statut pour la gestion côté composant
      if (error.response?.status === 403 || error.response?.status === 404) {
        throw error; // Propager l'erreur pour redirection vers 404
      }
      throw this.handleError(error, 'Erreur lors de la récupération du détail de la consultation');
    }
  }

  /**
   * Modification d'une offre de consultation
   * @param {string} offerId - ID de l'offre
   * @param {Object} updateData - Données à modifier
   * @returns {Promise} - Promesse contenant l'offre modifiée
   */
  async updateConsultationOffer(offerId, updateData) {
    try {
      const response = await api.patch(`/api/jobs/consultation-offers/${offerId}/`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la modification de l\'offre');
    }
  }

  /**
   * Suppression d'une offre de consultation
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse de suppression
   */
  async deleteConsultationOffer(offerId) {
    try {
      const response = await api.delete(`/api/jobs/consultation-offers/${offerId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la suppression de l\'offre');
    }
  }

  /**
   * Recherche avancée d'offres de consultation
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchConsultationOffers(searchParams) {
    try {
      const response = await api.get('/api/jobs/consultation-offers/', { params: searchParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la recherche d\'offres');
    }
  }

  // ===== NOUVELLES MÉTHODES API POUR LA LISTE PUBLIQUE =====

  /**
   * Récupération des offres de consultation publiques avec filtres et pagination
   * @param {Object} filters - Filtres de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les consultations avec pagination
   */
  async getPublicConsultationOffers(filters = {}, page = 1, pageSize = 20) {
    try {
      const params = {
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      };
      
      const response = await api.get('/api/jobs/consultation-offers/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des offres de consultation publiques');
    }
  }

  /**
   * Recherche de consultations par mot-clé
   * @param {string} query - Terme de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchConsultations(query, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers({ query }, page, pageSize);
  }

  /**
   * Filtrage par type de consultation
   * @param {number} typeId - ID du type de consultation
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByConsultationType(typeId, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers({ consultation_type: typeId }, page, pageSize);
  }

  /**
   * Filtrage par secteur d'expertise
   * @param {string} expertise - Secteur d'expertise
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByExpertise(expertise, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers({ expertise_sector: expertise }, page, pageSize);
  }

  /**
   * Filtrage par mode de livraison
   * @param {string} mode - Mode de livraison (ONSITE, REMOTE, HYBRID)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByDeliveryMode(mode, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers({ delivery_mode: mode }, page, pageSize);
  }

  /**
   * Filtrage par type de tarification
   * @param {string} pricingType - Type de tarification (HOURLY, DAILY, FIXED, NEGOTIABLE)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByPricingType(pricingType, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers({ pricing_type: pricingType }, page, pageSize);
  }

  /**
   * Filtrage par prix
   * @param {number} minPrice - Prix minimum
   * @param {number} maxPrice - Prix maximum (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByPrice(minPrice, maxPrice = null, page = 1, pageSize = 20) {
    const filters = { price_min: minPrice };
    if (maxPrice) filters.price_max = maxPrice;
    return this.getPublicConsultationOffers(filters, page, pageSize);
  }

  /**
   * Filtrage par type de client
   * @param {string} clientType - Type de client (INDIVIDUAL, SMALL_BUSINESS, ENTERPRISE, GOVERNMENT, NON_PROFIT)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByClientType(clientType, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers({ client_type: clientType }, page, pageSize);
  }

  /**
   * Filtrage par urgence
   * @param {boolean} isUrgent - Consultation urgente ou non
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByUrgency(isUrgent, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers({ is_urgent: isUrgent }, page, pageSize);
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
    return this.getPublicConsultationOffers(filters, page, pageSize);
  }

  /**
   * Combinaison de filtres avancés
   * @param {Object} filters - Objet contenant tous les filtres
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async getFilteredConsultations(filters = {}, page = 1, pageSize = 20) {
    return this.getPublicConsultationOffers(filters, page, pageSize);
  }

  // ===== FIN DES NOUVELLES MÉTHODES =====

  // ===== MÉTHODES DE FINANCEMENT =====

  /**
   * Récupération des secteurs de financement
   * @returns {Promise} - Promesse contenant la liste des secteurs
   */
  async getFundingSectors() {
    try {
      const response = await api.get('/api/jobs/funding-sectors/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des secteurs de financement');
    }
  }

  /**
   * Récupération des cibles de financement
   * @returns {Promise} - Promesse contenant la liste des cibles
   */
  async getFundingTargets() {
    try {
      const response = await api.get('/api/jobs/funding-targets/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des cibles de financement');
    }
  }

  /**
   * Récupération des fonctions/Postes
   * @returns {Promise} - Promesse contenant la liste des fonctions
   */
  async getJobFunctions() {
    try {
      const response = await api.get('/api/jobs/job-functions/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des fonctions');
    }
  }

  /**
   * Récupération des secteurs d'activité
   * @returns {Promise} - Promesse contenant la liste des secteurs
   */
  async getActivitySectors() {
    try {
      const response = await api.get('/api/jobs/activity-sectors/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des secteurs d\'activité');
    }
  }

  /**
   * Création d'une offre de financement
   * @param {Object} fundingData - Données du financement
   * @returns {Promise} - Promesse contenant l'offre créée
   */
  async createFundingOffer(fundingData) {
    try {
      const response = await api.post('/api/jobs/funding-offers/', fundingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la création de l\'offre de financement');
    }
  }

  /**
   * Récupération de mes offres de financement (recruteur connecté)
   * @returns {Promise} - Promesse contenant la liste des offres
   */
  async getMyFundingOffers() {
    try {
      const response = await api.get('/api/jobs/my-funding-offers/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération de vos offres de financement');
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
      // Propager l'erreur avec le statut pour la gestion côté composant
      if (error.response?.status === 403 || error.response?.status === 404) {
        throw error; // Propager l'erreur pour redirection vers 404
      }
      throw this.handleError(error, 'Erreur lors de la récupération du détail de l\'offre');
    }
  }

  /**
   * Modification d'une offre de financement
   * @param {string} offerId - ID de l'offre
   * @param {Object} updateData - Données à modifier
   * @returns {Promise} - Promesse contenant l'offre modifiée
   */
  async updateFundingOffer(offerId, updateData) {
    try {
      const response = await api.patch(`/api/jobs/funding-offers/${offerId}/`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la modification de l\'offre');
    }
  }

  /**
   * Suppression d'une offre de financement
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse de suppression
   */
  async deleteFundingOffer(offerId) {
    try {
      const response = await api.delete(`/api/jobs/funding-offers/${offerId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la suppression de l\'offre');
    }
  }

  /**
   * Recherche avancée d'offres de financement
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchFundingOffers(searchParams) {
    try {
      const response = await api.get('/api/jobs/funding-offers/', { params: searchParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la recherche d\'offres');
    }
  }

  /**
   * Gestion des erreurs génériques
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleError(error, defaultMessage) {
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
      } else if (typeof errorData === 'object') {
        const allErrors = [];
        Object.keys(errorData).forEach(key => {
          if (Array.isArray(errorData[key])) {
            allErrors.push(...errorData[key]);
          }
        });
        if (allErrors.length > 0) {
          message = allErrors.join(', ');
        }
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error('API Error:', error);
    return new Error(message);
  }
}

const consultationService = new ConsultationService();

export default consultationService; 