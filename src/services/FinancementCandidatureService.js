import api from './api';

class FinancementCandidatureService {
  
  /**
   * Récupération des candidatures de financement de l'utilisateur connecté
   * @param {Object} filters - Filtres de recherche
   * @param {string} filters.status - Statut de la candidature (PENDING, VIEWED, SHORTLISTED, etc.)
   * @param {string} filters.search - Recherche par nom d'utilisateur ou email
   * @param {string} filters.ordering - Tri (-application__created_at, application__status)
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getMyFundingApplications(filters = {}) {
    try {
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      
      if (filters.status) params.append('application__status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering || '-application__created_at');
      
      const url = `/api/applications/funding/${params.toString() ? '?' + params.toString() : ''}`;
      
      console.log('🔍 Requête candidatures financement:', url);
      
      const response = await api.get(url);
      const applications = Array.isArray(response.data) ? response.data : [];
      
      console.log('✅ Candidatures financement récupérées:', applications);
      
      return {
        applications: applications,
        pagination: {
          count: applications.length,
          next: null,
          previous: null,
          currentPage: 1,
          pageSize: applications.length,
          totalPages: 1
        }
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des candidatures financement:', error);
      throw this.handleError(error, 'Erreur lors de la récupération des candidatures de financement');
    }
  }

  /**
   * Récupération du détail d'une candidature spécifique
   * @param {string} applicationId - UUID de la candidature
   * @returns {Promise} - Promesse contenant le détail de la candidature
   */
  async getFundingApplicationDetail(applicationId) {
    try {
      const response = await api.get(`/api/applications/funding/${applicationId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération du détail de la candidature');
    }
  }

  /**
   * Mise à jour d'une candidature de financement
   * @param {string} applicationId - UUID de la candidature
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise} - Promesse contenant la candidature mise à jour
   */
  async updateFundingApplication(applicationId, updateData) {
    try {
      const response = await api.put(`/api/applications/funding/${applicationId}/update/`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la mise à jour de la candidature');
    }
  }

  /**
   * Suppression d'une candidature de financement
   * @param {string} applicationId - UUID de la candidature
   * @returns {Promise} - Promesse contenant la confirmation de suppression
   */
  async deleteFundingApplication(applicationId) {
    try {
      const response = await api.delete(`/api/applications/funding/${applicationId}/delete/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la suppression de la candidature');
    }
  }

  /**
   * Récupération des candidatures par offre spécifique (pour recruteurs)
   * @param {string} fundingOfferId - UUID de l'offre de financement
   * @returns {Promise} - Promesse contenant les candidatures pour cette offre
   */
  async getFundingApplicationsByOffer(fundingOfferId) {
    try {
      const response = await api.get(`/api/applications/funding/by-offer/${fundingOfferId}/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des candidatures pour cette offre');
    }
  }

  /**
   * Gestion des erreurs
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleError(error, defaultMessage) {
    let message = defaultMessage;

    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.detail) {
        message = errorData.detail;
      } else if (errorData.error) {
        message = errorData.error;
      } else if (typeof errorData === 'string') {
        message = errorData;
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error('FinancementCandidature Error:', error);
    return new Error(message);
  }

  /**
   * Obtenir la couleur du statut
   * @param {string} status - Statut de la candidature
   * @returns {string} - Classe CSS de couleur
   */
  getStatusColor(status) {
    const colorMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'VIEWED': 'bg-blue-100 text-blue-800',
      'SHORTLISTED': 'bg-purple-100 text-purple-800',
      'INTERVIEW': 'bg-indigo-100 text-indigo-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtenir le texte du statut en français
   * @param {string} status - Statut en anglais
   * @returns {string} - Statut traduit en français
   */
  getStatusText(status) {
    const statusMap = {
      'PENDING': 'En attente',
      'VIEWED': 'Consultée',
      'SHORTLISTED': 'Présélectionnée',
      'INTERVIEW': 'Entretien',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Refusée'
    };
    return statusMap[status] || status;
  }

  /**
   * Obtenir la couleur de la priorité
   * @param {string} priority - Priorité de la candidature
   * @returns {string} - Classe CSS de couleur
   */
  getPriorityColor(priority) {
    const colorMap = {
      'LOW': 'bg-gray-100 text-gray-800',
      'NORMAL': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'PREMIUM': 'bg-purple-100 text-purple-800'
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtenir le texte de la priorité en français
   * @param {string} priority - Priorité en anglais
   * @returns {string} - Priorité traduite en français
   */
  getPriorityText(priority) {
    const priorityMap = {
      'LOW': 'Faible',
      'NORMAL': 'Normale',
      'HIGH': 'Élevée',
      'PREMIUM': 'Premium'
    };
    return priorityMap[priority] || priority;
  }
}

// Créer une instance unique du service
const financementCandidatureService = new FinancementCandidatureService();

export default financementCandidatureService; 