import api from './api';

class ValidationService {
  
  /**
   * Met à jour le statut d'une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} status - Nouveau statut (ACCEPTED, REJECTED, SHORTLISTED, etc.)
   * @param {string} notes - Notes ou commentaires sur la décision
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async updateApplicationStatus(applicationId, status, notes = '') {
    try {
      console.log(`🔍 updateApplicationStatus appelé pour la candidature ${applicationId}`);
      console.log('🔍 Nouveau statut:', status);
      console.log('🔍 Notes:', notes);
      
      const payload = {
        status: status,
        notes: notes
      };

      const url = `/api/applications/status/update/${applicationId}/`;
      console.log('📡 URL de requête:', url);
      console.log('📡 Payload:', payload);
      
      const response = await api.put(url, payload);
      console.log('✅ Statut de candidature mis à jour:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur lors de la mise à jour du statut de la candidature ${applicationId}:`, error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      throw new Error(`Impossible de mettre à jour le statut de la candidature: ${error.message}`);
    }
  }

  /**
   * Accepter une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} notes - Notes sur la décision d'acceptation
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async acceptApplication(applicationId, notes = 'Candidat parfaitement qualifié pour le poste') {
    try {
      console.log(`✅ Acceptation de la candidature ${applicationId}`);
      return await this.updateApplicationStatus(applicationId, 'SHORTLISTED', notes);
    } catch (error) {
      console.error(`❌ Erreur lors de l'acceptation de la candidature ${applicationId}:`, error);
      throw error;
    }
  }

  /**
   * Rejeter une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} notes - Notes sur la décision de rejet
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async rejectApplication(applicationId, notes = 'Candidature non retenue') {
    try {
      console.log(`❌ Rejet de la candidature ${applicationId}`);
      return await this.updateApplicationStatus(applicationId, 'REJECTED', notes);
    } catch (error) {
      console.error(`❌ Erreur lors du rejet de la candidature ${applicationId}:`, error);
      throw error;
    }
  }

  /**
   * Présélectionner une candidature pour entretien
   * @param {string} applicationId - ID de la candidature
   * @param {string} notes - Notes sur la présélection
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async shortlistApplication(applicationId, notes = 'Profil intéressant, convocation pour entretien') {
    try {
      console.log(`⭐ Présélection de la candidature ${applicationId}`);
      return await this.updateApplicationStatus(applicationId, 'SHORTLISTED', notes);
    } catch (error) {
      console.error(`❌ Erreur lors de la présélection de la candidature ${applicationId}:`, error);
      throw error;
    }
  }

  /**
   * Programmer un entretien
   * @param {string} applicationId - ID de la candidature
   * @param {string} notes - Détails de l'entretien
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async scheduleInterview(applicationId, notes = 'Entretien programmé') {
    try {
      console.log(`📅 Programmation d'entretien pour la candidature ${applicationId}`);
      return await this.updateApplicationStatus(applicationId, 'INTERVIEW_SCHEDULED', notes);
    } catch (error) {
      console.error(`❌ Erreur lors de la programmation de l'entretien ${applicationId}:`, error);
      throw error;
    }
  }

  /**
   * Mettre en attente une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} notes - Raison de la mise en attente
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async putOnHold(applicationId, notes = 'Mise en attente pour révision') {
    try {
      console.log(`⏸️ Mise en attente de la candidature ${applicationId}`);
      return await this.updateApplicationStatus(applicationId, 'ON_HOLD', notes);
    } catch (error) {
      console.error(`❌ Erreur lors de la mise en attente de la candidature ${applicationId}:`, error);
      throw error;
    }
  }

  /**
   * Marquer comme vue une candidature
   * @param {string} applicationId - ID de la candidature
   * @returns {Promise<Object>} Réponse de la mise à jour
   */
  async markAsViewed(applicationId) {
    try {
      console.log(`👁️ Marquage comme vue de la candidature ${applicationId}`);
      return await this.updateApplicationStatus(applicationId, 'VIEWED', 'Candidature consultée');
    } catch (error) {
      console.error(`❌ Erreur lors du marquage comme vue de la candidature ${applicationId}:`, error);
      throw error;
    }
  }

  /**
   * Récupérer l'historique des statuts d'une candidature
   * @param {string} applicationId - ID de la candidature
   * @returns {Promise<Object>} Historique des statuts
   */
  async getApplicationStatusHistory(applicationId) {
    try {
      console.log(`📚 Récupération de l'historique des statuts pour la candidature ${applicationId}`);
      
      const url = `/api/applications/status/history/${applicationId}/`;
      const response = await api.get(url);
      
      console.log('✅ Historique des statuts récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération de l'historique des statuts ${applicationId}:`, error);
      throw new Error(`Impossible de récupérer l'historique des statuts: ${error.message}`);
    }
  }

  /**
   * Récupérer les statistiques des statuts pour une offre
   * @param {string} offerId - ID de l'offre
   * @param {string} offerType - Type d'offre (JOB, CONSULTATION, FUNDING)
   * @returns {Promise<Object>} Statistiques des statuts
   */
  async getStatusStatistics(offerId, offerType = 'JOB') {
    try {
      console.log(`📊 Récupération des statistiques des statuts pour l'offre ${offerId} (${offerType})`);
      
      const url = `/api/applications/status/statistics/${offerId}/?offer_type=${offerType}`;
      const response = await api.get(url);
      
      console.log('✅ Statistiques des statuts récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des statistiques des statuts ${offerId}:`, error);
      throw new Error(`Impossible de récupérer les statistiques des statuts: ${error.message}`);
    }
  }

  /**
   * Gestion des erreurs
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleValidationError(error, defaultMessage) {
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

    console.error('Validation Error:', error);
    return new Error(message);
  }
}

// Créer une instance unique du service
const validationService = new ValidationService();

export default validationService; 