import api from './api';

class BourseService {
  // Récupérer les types de bourses
  async getScholarshipTypes() {
    try {
      const response = await api.get('/api/jobs/scholarship-types/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des types de bourses');
    }
  }

  // Récupérer les domaines d'études
  async getStudyDomains() {
    try {
      const response = await api.get('/api/jobs/study-domains/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des domaines d\'études');
    }
  }

  // Récupérer les types d'organisations
  async getOrganizationTypes() {
    try {
      const response = await api.get('/api/jobs/organization-types/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des types d\'organisations');
    }
  }

  // Récupérer la liste des bourses publiques
  async getPublicScholarships(params = {}) {
    try {
      const response = await api.get('/api/jobs/scholarships/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des bourses');
    }
  }

  // Créer une nouvelle bourse
  async createScholarship(scholarshipData) {
    try {
      const response = await api.post('/api/jobs/scholarships/', scholarshipData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la création de la bourse');
    }
  }

  // Récupérer les détails d'une bourse
  async getScholarshipDetail(id) {
    try {
      const response = await api.get(`/api/jobs/scholarships/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des détails de la bourse');
    }
  }

  // Modifier une bourse
  async updateScholarship(id, scholarshipData) {
    try {
      const response = await api.patch(`/api/jobs/scholarships/${id}/`, scholarshipData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la modification de la bourse');
    }
  }

  // Supprimer une bourse
  async deleteScholarship(id) {
    try {
      const response = await api.delete(`/api/jobs/scholarships/${id}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la suppression de la bourse');
    }
  }

  // Récupérer mes bourses (recruteur connecté)
  async getMyScholarships() {
    try {
      const response = await api.get('/api/jobs/my-scholarships/');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération de vos bourses');
    }
  }

  /**
   * Récupérer les détails d'une bourse publique
   * @param {string} id - ID de la bourse
   * @returns {Promise<Object>} - Détails de la bourse
   */
  async getPublicScholarshipDetail(id) {
    try {
      const response = await api.get(`/api/jobs/scholarships/public/${id}/`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        throw error;
      }
      throw this.handleError(error, 'Erreur lors de la récupération du détail de la bourse');
    }
  }

  // ===== NOUVELLES MÉTHODES API POUR LA LISTE PUBLIQUE =====

  /**
   * Récupération des bourses publiques avec filtres et pagination
   * @param {Object} filters - Filtres de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les bourses avec pagination
   */
  async getPublicScholarships(filters = {}, page = 1, pageSize = 20) {
    try {
      const params = {
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      };
      
      const response = await api.get('/api/jobs/scholarships/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des bourses publiques');
    }
  }

  /**
   * Recherche de bourses par mot-clé
   * @param {string} query - Terme de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchScholarships(query, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ query }, page, pageSize);
  }

  /**
   * Filtrage par type de bourse
   * @param {number} typeId - ID du type de bourse
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByScholarshipType(typeId, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ scholarship_type: typeId }, page, pageSize);
  }

  /**
   * Filtrage par niveau requis
   * @param {string} level - Niveau requis (BACHELOR, MASTER, PHD, POST_DOC)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByRequiredLevel(level, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ required_level: level }, page, pageSize);
  }

  /**
   * Filtrage par domaine d'études
   * @param {number} domainId - ID du domaine d'études
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByStudyDomain(domainId, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ study_domain: domainId }, page, pageSize);
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
    const filters = { amount_min: minAmount };
    if (maxAmount) filters.amount_max = maxAmount;
    return this.getPublicScholarships(filters, page, pageSize);
  }

  /**
   * Filtrage par type de financement
   * @param {boolean} fullFunding - Financement complet (optionnel)
   * @param {boolean} partialFunding - Financement partiel (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByFunding(fullFunding = null, partialFunding = null, page = 1, pageSize = 20) {
    const filters = {};
    if (fullFunding !== null) filters.full_funding = fullFunding;
    if (partialFunding !== null) filters.partial_funding = partialFunding;
    return this.getPublicScholarships(filters, page, pageSize);
  }

  /**
   * Filtrage par conditions
   * @param {boolean} accommodation - Hébergement inclus (optionnel)
   * @param {boolean} travelExpenses - Frais de voyage inclus (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByConditions(accommodation = null, travelExpenses = null, page = 1, pageSize = 20) {
    const filters = {};
    if (accommodation !== null) filters.accommodation_included = accommodation;
    if (travelExpenses !== null) filters.travel_expenses_included = travelExpenses;
    return this.getPublicScholarships(filters, page, pageSize);
  }

  /**
   * Filtrage par type d'organisation
   * @param {number} orgTypeId - ID du type d'organisation
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByOrganizationType(orgTypeId, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ organization_type: orgTypeId }, page, pageSize);
  }

  /**
   * Combinaison de filtres avancés
   * @param {Object} filters - Objet contenant tous les filtres
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async getFilteredScholarships(filters = {}, page = 1, pageSize = 20) {
    return this.getPublicScholarships(filters, page, pageSize);
  }

  // ===== FIN DES NOUVELLES MÉTHODES =====

  // Gestion centralisée des erreurs
  handleError(error, defaultMessage) {
    if (error.response) {
      // Erreur de réponse du serveur
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          if (data && typeof data === 'object') {
            const errorMessages = Object.entries(data)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            return new Error(`Données invalides: ${errorMessages}`);
          }
          return new Error(data?.message || 'Données invalides');
        
        case 401:
          return new Error('Authentification requise. Veuillez vous connecter.');
        
        case 403:
          return new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
        
        case 404:
          return new Error('Bourse non trouvée.');
        
        case 500:
          return new Error('Erreur interne du serveur. Veuillez réessayer plus tard.');
        
        default:
          return new Error(data?.message || defaultMessage);
      }
    } else if (error.request) {
      // Erreur de requête (pas de réponse)
      return new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
    } else {
      // Erreur de configuration ou autre
      return new Error(error.message || defaultMessage);
    }
  }
}

export default new BourseService(); 