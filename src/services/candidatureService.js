import api from './api';

class CandidatureService {
  constructor() {
    this.baseUrl = '/api/applications/';
  }

  /**
   * Récupère toutes les candidatures avec filtres et pagination
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures
   */
  async getApplications(filters = {}, page = 1, pageSize = 20) {
    try {
      console.log('🔍 getApplications appelé avec:', { filters, page, pageSize });
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      console.log('📡 URL de requête:', `${this.baseUrl}?${params}`);
      
      const response = await api.get(`${this.baseUrl}?${params}`);
      console.log('✅ Réponse reçue:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur dans getApplications:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  /**
   * Récupère les candidatures par type d'offre
   * @param {string} type - Type d'offre (JOB, CONSULTATION, FUNDING)
   * @param {Object} filters - Filtres additionnels
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures
   */
  async getApplicationsByType(type, filters = {}, page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        application_type: type,
        ...filters
      });

      const response = await api.get(`${this.baseUrl}?${params}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des candidatures ${type}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les candidatures d'emploi
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures d'emploi
   */
  async getJobApplications(filters = {}, page = 1, pageSize = 20) {
    try {
      console.log('🔍 getJobApplications appelé avec:', { filters, page, pageSize });
      
      // Essayer d'abord l'endpoint spécifique aux emplois
      try {
        const response = await api.get(`${this.baseUrl}job/`, {
          params: {
            page: page.toString(),
            page_size: pageSize.toString(),
            ...filters
          }
        });
        console.log('✅ Réponse getJobApplications (endpoint spécifique):', response.data);
        return response.data;
      } catch (jobError) {
        console.log('⚠️ Endpoint spécifique aux emplois échoué, utilisation de l\'endpoint général');
        
        // Fallback vers l'endpoint général avec filtre par type
        const response = await this.getApplications({
          ...filters,
          application_type: 'JOB'
        }, page, pageSize);
        
        console.log('✅ Réponse getJobApplications (endpoint général):', response);
        return response;
      }
    } catch (error) {
      console.error('❌ Erreur dans getJobApplications:', error);
      throw error;
    }
  }

  /**
   * Récupère les candidatures de consultation
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures de consultation
   */
  async getConsultationApplications(filters = {}, page = 1, pageSize = 20) {
    try {
      console.log('🔍 getConsultationApplications appelé avec:', { filters, page, pageSize });
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      console.log('📡 URL de requête consultation:', `/api/applications/consultation/?${params}`);
      
      const response = await api.get(`/api/applications/consultation/?${params}`);
      console.log('✅ Réponse getConsultationApplications reçue:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur dans getConsultationApplications:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  /**
   * Récupère les candidatures de financement
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures de financement
   */
  async getFundingApplications(filters = {}, page = 1, pageSize = 20) {
    try {
      console.log('🔍 getFundingApplications appelé avec:', { filters, page, pageSize });
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      console.log('📡 URL de requête funding:', `/api/applications/funding/?${params}`);
      
      const response = await api.get(`/api/applications/funding/?${params}`);
      console.log('✅ Réponse getFundingApplications reçue:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur dans getFundingApplications:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  /**
   * Récupère les candidatures pour une offre spécifique
   * @param {string} offerId - ID de l'offre
   * @param {string} offerType - Type d'offre (JOB, CONSULTATION, FUNDING)
   * @param {Object} filters - Filtres additionnels
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures filtrées
   */
  async getApplicationsByOffer(offerId, offerType = 'JOB', filters = {}, page = 1, pageSize = 20) {
    try {
      console.log(`🔍 getApplicationsByOffer appelé pour l'offre ${offerId} de type ${offerType}`);
      
      // Récupérer toutes les candidatures du type spécifié
      let allApplications;
      
      if (offerType === 'JOB') {
        allApplications = await this.getJobApplications(filters, page, pageSize);
      } else if (offerType === 'CONSULTATION') {
        allApplications = await this.getConsultationApplications(filters, page, pageSize);
      } else if (offerType === 'FUNDING') {
        allApplications = await this.getFundingApplications(filters, page, pageSize);
      } else {
        allApplications = await this.getApplicationsByType(offerType, filters, page, pageSize);
      }
      
      console.log('📡 allApplications reçu:', allApplications);
      
      // Vérifier que allApplications existe et a la bonne structure
      if (!allApplications) {
        console.warn('⚠️ allApplications est undefined, retour d\'un objet vide');
        return {
          count: 0,
          next: null,
          previous: null,
          results: []
        };
      }
      
      // Extraire les résultats selon la structure de la réponse
      let results = [];
      if (allApplications.results && Array.isArray(allApplications.results)) {
        results = allApplications.results;
      } else if (Array.isArray(allApplications)) {
        results = allApplications;
      } else if (allApplications.data && Array.isArray(allApplications.data)) {
        results = allApplications.data;
      } else {
        console.warn('⚠️ Structure de allApplications inattendue:', allApplications);
        return {
          count: 0,
          next: null,
          previous: null,
          results: []
        };
      }
      
      console.log(`📊 ${results.length} candidatures trouvées avant filtrage`);
      
      // Filtrer par offre spécifique côté client
      const filteredApplications = results.filter(app => {
        try {
          if (offerType === 'JOB' && app.jobapplication) {
            return app.jobapplication.job_offer && app.jobapplication.job_offer.id === offerId;
          } else if (offerType === 'CONSULTATION' && app.consultationapplication) {
            return app.consultationapplication.consultation_offer && app.consultationapplication.consultation_offer.id === offerId;
          } else if (offerType === 'FUNDING' && app.fundingapplication) {
            return app.fundingapplication.funding_offer && app.fundingapplication.funding_offer.id === offerId;
          }
          return false;
        } catch (filterError) {
          console.warn('⚠️ Erreur lors du filtrage d\'une candidature:', filterError, app);
          return false;
        }
      });

      console.log(`✅ ${filteredApplications.length} candidatures filtrées pour l'offre ${offerId}`);

      return {
        count: filteredApplications.length,
        next: null, // Pas de pagination pour les résultats filtrés
        previous: null,
        results: filteredApplications
      };
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des candidatures pour l'offre ${offerId}:`, error);
      // Retourner un objet vide en cas d'erreur plutôt que de faire planter l'application
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }
  }

  /**
   * Récupère les candidatures d'emploi pour une offre spécifique
   * @param {string} jobOfferId - ID de l'offre d'emploi
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures d'emploi
   */
  async getJobApplicationsByOffer(jobOfferId, filters = {}, page = 1, pageSize = 20) {
    try {
      console.log(`🔍 getJobApplicationsByOffer appelé pour l'offre ${jobOfferId}`);
      console.log('🔍 Filtres:', filters);
      console.log('🔍 Pagination:', { page, pageSize });
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      const url = `/api/applications/job/by-offer/${jobOfferId}/?${params}`;
      console.log('📡 URL de requête:', url);
      
      const response = await api.get(url);
      console.log('✅ Réponse getJobApplicationsByOffer reçue:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur dans getJobApplicationsByOffer pour l'offre ${jobOfferId}:`, error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      // Retourner un objet vide en cas d'erreur
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }
  }

  /**
   * Récupère les candidatures de consultation pour une offre spécifique
   * @param {string} consultationOfferId - ID de l'offre de consultation
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures de consultation
   */
  async getConsultationApplicationsByOffer(consultationOfferId, filters = {}, page = 1, pageSize = 20) {
    try {
      console.log(`🔍 getConsultationApplicationsByOffer appelé pour la consultation ${consultationOfferId}`);
      console.log('🔍 Filtres:', filters);
      console.log('🔍 Pagination:', { page, pageSize });
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      const url = `/api/applications/consultation/by-offer/${consultationOfferId}/?${params}`;
      console.log('📡 URL de requête:', url);
      
      const response = await api.get(url);
      console.log('✅ Réponse getConsultationApplicationsByOffer reçue:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur dans getConsultationApplicationsByOffer pour la consultation ${consultationOfferId}:`, error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      // Retourner un objet vide en cas d'erreur
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }
  }

  /**
   * Récupère les candidatures de financement pour une offre spécifique
   * @param {string} fundingOfferId - ID de l'offre de financement
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures de financement
   */
  async getFundingApplicationsByOffer(fundingOfferId, filters = {}, page = 1, pageSize = 20) {
    try {
      console.log(`🔍 getFundingApplicationsByOffer appelé pour le financement ${fundingOfferId}`);
      console.log('🔍 Filtres:', filters);
      console.log('🔍 Pagination:', { page, pageSize });
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      const url = `/api/applications/funding/by-offer/${fundingOfferId}/?${params}`;
      console.log('📡 URL de requête:', url);
      
      const response = await api.get(url);
      console.log('✅ Réponse getFundingApplicationsByOffer reçue:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur dans getFundingApplicationsByOffer pour le financement ${fundingOfferId}:`, error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      // Retourner un objet vide en cas d'erreur
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }
  }

  /**
   * Récupère les meilleurs candidats IA pour une offre d'emploi
   * @param {string} jobOfferId - ID de l'offre d'emploi
   * @returns {Promise<Object>} Réponse avec les candidats IA
   */
  async getAICandidatesForJob(jobOfferId) {
    try {
      const response = await api.get(`${this.baseUrl}ai/candidates/?job_offer_id=${jobOfferId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des candidats IA pour l'offre ${jobOfferId}:`, error);
      throw error;
    }
  }

  /**
   * Calculer le score de compatibilité d'un candidat pour une offre
   * @param {string} jobOfferId - ID de l'offre d'emploi
   * @param {string} candidateId - ID du candidat
   * @returns {Promise<Object>} Réponse avec le score de compatibilité
   */
  async calculateCompatibility(jobOfferId, candidateId) {
    try {
      console.log('🧮 Calcul de compatibilité pour:', { jobOfferId, candidateId });
      
      const response = await api.post('/api/applications/ai/analyze-compatibility/', {
        job_offer_id: jobOfferId,
        candidate_id: candidateId
      });
      
      console.log('✅ Score de compatibilité calculé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du calcul de compatibilité:', error);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} newStatus - Nouveau statut
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async updateApplicationStatus(applicationId, newStatus) {
    try {
      const response = await api.post(`${this.baseUrl}status/update/`, {
        application_id: applicationId,
        new_status: newStatus
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la candidature ${applicationId}:`, error);
      throw error;
    }
  }

  /**
   * Marque une candidature comme vue
   * @param {string} applicationId - ID de la candidature
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async markAsViewed(applicationId) {
    try {
      const response = await api.post(`${this.baseUrl}mark-viewed/${applicationId}/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du marquage de la candidature ${applicationId} comme vue:`, error);
      throw error;
    }
  }

  /**
   * Recherche des candidatures par nom/email du candidat
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} filters - Filtres additionnels
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures
   */
  async searchApplications(searchTerm, filters = {}, page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        search: searchTerm,
        ...filters
      });

      const response = await api.get(`${this.baseUrl}?${params}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la recherche des candidatures avec "${searchTerm}":`, error);
      throw error;
    }
  }

  /**
   * Récupère les candidatures avec filtres avancés
   * @param {Object} filters - Filtres avancés
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de la page
   * @returns {Promise<Object>} Réponse paginée des candidatures
   */
  async getFilteredApplications(filters = {}, page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });

      const response = await api.get(`${this.baseUrl}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures filtrées:', error);
      throw error;
    }
  }
}

// Export d'une instance unique du service
const candidatureService = new CandidatureService();
export default candidatureService; 