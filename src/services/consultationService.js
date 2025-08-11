import api from './api';

class ConsultationService {
  
  /**
   * Récupération des consultations
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise} - Promesse contenant les consultations
   */
  async getConsultations(filters = {}) {
    try {
      const response = await api.get('/api/consultations/', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération des consultations');
    }
  }

  /**
   * Récupération d'une consultation spécifique
   * @param {string} consultationId - ID de la consultation
   * @returns {Promise} - Promesse contenant la consultation
   */
  async getConsultation(consultationId) {
    try {
      const response = await api.get(`/api/consultations/${consultationId}/`);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération de la consultation');
    }
  }

  /**
   * Création d'une consultation
   * @param {Object} consultationData - Données de la consultation
   * @returns {Promise} - Promesse contenant la consultation créée
   */
  async createConsultation(consultationData) {
    try {
      const response = await api.post('/api/consultations/', consultationData);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la création de la consultation');
    }
  }

  /**
   * Mise à jour d'une consultation
   * @param {string} consultationId - ID de la consultation
   * @param {Object} consultationData - Nouvelles données
   * @returns {Promise} - Promesse contenant la consultation mise à jour
   */
  async updateConsultation(consultationId, consultationData) {
    try {
      const response = await api.put(`/api/consultations/${consultationId}/`, consultationData);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la mise à jour de la consultation');
    }
  }

  /**
   * Suppression d'une consultation
   * @param {string} consultationId - ID de la consultation
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteConsultation(consultationId) {
    try {
      const response = await api.delete(`/api/consultations/${consultationId}/`);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la suppression de la consultation');
    }
  }

  /**
   * Candidature à une consultation
   * @param {string} consultationId - ID de la consultation
   * @param {Object} applicationData - Données de candidature
   * @returns {Promise} - Promesse contenant la candidature
   */
  async applyToConsultation(consultationId, applicationData) {
    try {
      const response = await api.post(`/api/consultations/${consultationId}/apply/`, applicationData);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la candidature à la consultation');
    }
  }

  /**
   * Récupération des candidatures aux consultations d'un utilisateur
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getUserConsultationApplications() {
    try {
      const response = await api.get('/api/consultations/applications/');
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération des candidatures aux consultations');
    }
  }

  /**
   * Récupération des candidatures pour une consultation (client)
   * @param {string} consultationId - ID de la consultation
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getConsultationApplications(consultationId) {
    try {
      const response = await api.get(`/api/consultations/${consultationId}/applications/`);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération des candidatures à la consultation');
    }
  }

  /**
   * Récupération des financements
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise} - Promesse contenant les financements
   */
  async getFinancements(filters = {}) {
    try {
      const response = await api.get('/api/financements/', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération des financements');
    }
  }

  /**
   * Récupération d'un financement spécifique
   * @param {string} financementId - ID du financement
   * @returns {Promise} - Promesse contenant le financement
   */
  async getFinancement(financementId) {
    try {
      const response = await api.get(`/api/financements/${financementId}/`);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération du financement');
    }
  }

  /**
   * Création d'un financement
   * @param {Object} financementData - Données du financement
   * @returns {Promise} - Promesse contenant le financement créé
   */
  async createFinancement(financementData) {
    try {
      const response = await api.post('/api/financements/', financementData);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la création du financement');
    }
  }

  /**
   * Mise à jour d'un financement
   * @param {string} financementId - ID du financement
   * @param {Object} financementData - Nouvelles données
   * @returns {Promise} - Promesse contenant le financement mis à jour
   */
  async updateFinancement(financementId, financementData) {
    try {
      const response = await api.put(`/api/financements/${financementId}/`, financementData);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la mise à jour du financement');
    }
  }

  /**
   * Suppression d'un financement
   * @param {string} financementId - ID du financement
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteFinancement(financementId) {
    try {
      const response = await api.delete(`/api/financements/${financementId}/`);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la suppression du financement');
    }
  }

  /**
   * Candidature à un financement
   * @param {string} financementId - ID du financement
   * @param {Object} applicationData - Données de candidature
   * @returns {Promise} - Promesse contenant la candidature
   */
  async applyToFinancement(financementId, applicationData) {
    try {
      const response = await api.post(`/api/financements/${financementId}/apply/`, applicationData);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la candidature au financement');
    }
  }

  /**
   * Récupération des candidatures aux financements d'un utilisateur
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getUserFinancementApplications() {
    try {
      const response = await api.get('/api/financements/applications/');
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération des candidatures aux financements');
    }
  }

  /**
   * Récupération des candidatures pour un financement (client)
   * @param {string} financementId - ID du financement
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getFinancementApplications(financementId) {
    try {
      const response = await api.get(`/api/financements/${financementId}/applications/`);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la récupération des candidatures au financement');
    }
  }

  /**
   * Recherche avancée de consultations
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchConsultations(searchParams) {
    try {
      const response = await api.post('/api/consultations/search/', searchParams);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la recherche de consultations');
    }
  }

  /**
   * Recherche avancée de financements
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchFinancements(searchParams) {
    try {
      const response = await api.post('/api/financements/search/', searchParams);
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la recherche de financements');
    }
  }

  /**
   * Mise à jour du statut d'une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} status - Nouveau statut
   * @param {string} type - Type (consultation ou financement)
   * @returns {Promise} - Promesse contenant la candidature mise à jour
   */
  async updateApplicationStatus(applicationId, status, type) {
    try {
      const endpoint = type === 'financement' ? 'financements' : 'consultations';
      const response = await api.patch(`/api/${endpoint}/applications/${applicationId}/`, {
        status: status
      });
      return response.data;
    } catch (error) {
      throw this.handleConsultationError(error, 'Erreur lors de la mise à jour du statut');
    }
  }

  /**
   * Gestion des erreurs
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleConsultationError(error, defaultMessage) {
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

    console.error('Consultation Error:', error);
    return new Error(message);
  }
}

// Créer une instance unique du service
const consultationService = new ConsultationService();

export default consultationService; 