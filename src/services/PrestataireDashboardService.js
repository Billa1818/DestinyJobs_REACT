import api from './api';

/**
 * Service pour la gestion du tableau de bord du prestataire
 * Basé sur la documentation des endpoints prestataire
 */
class PrestataireDashboardService {
  /**
   * Récupérer les statistiques personnelles des candidatures
   * GET /api/applications/my-stats/
   */
  async getMyApplicationStats() {
    try {
      const response = await api.get('/api/applications/my-stats/');
      console.log('📊 Statistiques des candidatures récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Récupérer les candidatures aux offres de consultation
   * GET /api/applications/consultation/
   */
  async getConsultationApplications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.application__status) queryParams.append('application__status', params.application__status);
      if (params.application__priority) queryParams.append('application__priority', params.application__priority);
      if (params.search) queryParams.append('search', params.search);
      if (params.ordering) queryParams.append('ordering', params.ordering);
      if (params.page) queryParams.append('page', params.page);
      if (params.page_size) queryParams.append('page_size', params.page_size);
      
      const url = `/api/applications/consultation/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      
      console.log('📋 Candidatures consultation récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des candidatures consultation:', error);
      throw error;
    }
  }

  /**
   * Récupérer les candidatures aux offres de financement
   * GET /api/applications/funding/
   */
  async getFundingApplications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.application__status) queryParams.append('application__status', params.application__status);
      if (params.application__priority) queryParams.append('application__priority', params.application__priority);
      if (params.search) queryParams.append('search', params.search);
      if (params.ordering) queryParams.append('ordering', params.ordering);
      if (params.page) queryParams.append('page', params.page);
      if (params.page_size) queryParams.append('page_size', params.page_size);
      
      const url = `/api/applications/funding/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      
      console.log('💰 Candidatures financement récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des candidatures financement:', error);
      throw error;
    }
  }

  /**
   * Récupérer les candidatures par offre spécifique
   * GET /api/applications/consultation/prestataire/by-offer/{uuid}/
   */
  async getApplicationsByOffer(offerId) {
    try {
      const response = await api.get(`/api/applications/consultation/prestataire/by-offer/${offerId}/`);
      console.log('🎯 Candidatures par offre récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des candidatures par offre:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une candidature consultation
   * PUT /api/applications/consultation/update/{uuid}/
   */
  async updateConsultationApplication(applicationId, updateData) {
    try {
      const response = await api.put(`/api/applications/consultation/update/${applicationId}/`, updateData);
      console.log('✏️ Candidature consultation mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la candidature consultation:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une candidature financement
   * PUT /api/applications/funding/update/{uuid}/
   */
  async updateFundingApplication(applicationId, updateData) {
    try {
      const response = await api.put(`/api/applications/funding/update/${applicationId}/`, updateData);
      console.log('✏️ Candidature financement mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la candidature financement:', error);
      throw error;
    }
  }

  /**
   * Supprimer une candidature consultation
   * DELETE /api/applications/consultation/delete/{uuid}/
   */
  async deleteConsultationApplication(applicationId) {
    try {
      const response = await api.delete(`/api/applications/consultation/delete/${applicationId}/`);
      console.log('🗑️ Candidature consultation supprimée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la candidature consultation:', error);
      throw error;
    }
  }

  /**
   * Supprimer une candidature financement
   * DELETE /api/applications/funding/delete/{uuid}/
   */
  async deleteFundingApplication(applicationId) {
    try {
      const response = await api.delete(`/api/applications/funding/delete/${applicationId}/`);
      console.log('🗑️ Candidature financement supprimée:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la candidature financement:', error);
      throw error;
    }
  }

  /**
   * Calculer le score de compatibilité IA
   * POST /api/applications/ai/calculate-compatibility/
   */
  async calculateCompatibility(offerType, offerId, candidateId) {
    try {
      const requestData = {
        offer_type: offerType,
        offer_id: offerId,
        candidate_id: candidateId
      };
      
      const response = await api.post('/api/applications/ai/calculate-compatibility/', requestData);
      console.log('🧠 Score de compatibilité calculé:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du calcul de compatibilité:', error);
      throw error;
    }
  }

  /**
   * Récupérer les offres de consultation disponibles
   * GET /api/jobs/consultation-offers/
   */
  async getConsultationOffers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.specialization) queryParams.append('specialization', params.specialization);
      if (params.budget_min) queryParams.append('budget_min', params.budget_min);
      if (params.budget_max) queryParams.append('budget_max', params.budget_max);
      if (params.location) queryParams.append('location', params.location);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.page_size) queryParams.append('page_size', params.page_size);
      
      const url = `/api/jobs/consultation-offers/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      
      console.log('🔍 Offres de consultation récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des offres de consultation:', error);
      throw error;
    }
  }

  /**
   * Récupérer les offres de financement disponibles
   * GET /api/jobs/funding-offers/
   */
  async getFundingOffers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.funding_type) queryParams.append('funding_type', params.funding_type);
      if (params.amount_min) queryParams.append('amount_min', params.amount_min);
      if (params.amount_max) queryParams.append('amount_max', params.amount_max);
      if (params.sector) queryParams.append('sector', params.sector);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.page_size) queryParams.append('page_size', params.page_size);
      
      const url = `/api/jobs/funding-offers/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      
      console.log('💰 Offres de financement récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des offres de financement:', error);
      throw error;
    }
  }

  /**
   * Formater les statistiques pour l'affichage
   * @param {Object} stats - Statistiques brutes de l'API
   * @returns {Object} - Statistiques formatées
   */
  formatStatsForDisplay(stats) {
    if (!stats) return null;

    return {
      totalApplications: stats.total_applications || 0,
      pendingApplications: stats.pending_applications || 0,
      acceptedApplications: stats.accepted_applications || 0,
      rejectedApplications: stats.rejected_applications || 0,
      successRate: stats.success_rate || 0,
      averageResponseTime: stats.average_response_time || 0,
      
      // Applications par mois
      applicationsByMonth: stats.applications_by_month || [],
      
      // Applications par type
      applicationsByType: stats.applications_by_type || {},
      
      // Top des domaines de consultation
      topConsultationAreas: stats.top_consultation_areas || [],
      
      // Calculs dérivés
      totalPending: stats.pending_applications || 0,
      totalAccepted: stats.accepted_applications || 0,
      totalRejected: stats.rejected_applications || 0,
      
      // Pourcentages
      pendingPercentage: stats.total_applications ? ((stats.pending_applications / stats.total_applications) * 100).toFixed(1) : 0,
      acceptedPercentage: stats.total_applications ? ((stats.accepted_applications / stats.total_applications) * 100).toFixed(1) : 0,
      rejectedPercentage: stats.total_applications ? ((stats.rejected_applications / stats.total_applications) * 100).toFixed(1) : 0
    };
  }

  /**
   * Formater les candidatures pour l'affichage
   * @param {Array} applications - Candidatures brutes de l'API
   * @returns {Array} - Candidatures formatées
   */
  formatApplicationsForDisplay(applications) {
    if (!applications || !Array.isArray(applications)) return [];

    return applications.map(app => ({
      id: app.id,
      offerTitle: app.offer?.title || 'Titre non disponible',
      offerType: app.offer?.offer_type || 'TYPE_INCONNU',
      status: app.application?.status || 'STATUS_INCONNU',
      priority: app.application?.priority || 'PRIORITY_INCONNU',
      coverLetter: app.application?.cover_letter || '',
      proposedRate: app.application?.proposed_rate || 0,
      availability: app.application?.availability || 'AVAILABILITY_INCONNU',
      createdAt: app.application?.created_at || app.created_at,
      updatedAt: app.application?.updated_at || app.updated_at,
      
      // Données de l'offre
      offerId: app.offer?.id,
      budget: app.offer?.budget,
      deadline: app.offer?.deadline,
      location: app.offer?.location,
      
      // Données du recruteur
      recruiterName: app.offer?.recruiter?.company_name || app.offer?.recruiter?.first_name || 'Recruteur',
      recruiterType: app.offer?.recruiter?.user_type || 'TYPE_INCONNU'
    }));
  }

  /**
   * Obtenir le statut formaté avec couleurs
   * @param {string} status - Statut de la candidature
   * @returns {Object} - Statut formaté avec couleurs
   */
  getStatusDisplay(status) {
    const statusConfig = {
      'PENDING': {
        text: 'En attente',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: 'fas fa-clock'
      },
      'ACCEPTED': {
        text: 'Acceptée',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: 'fas fa-check-circle'
      },
      'REJECTED': {
        text: 'Rejetée',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: 'fas fa-times-circle'
      },
      'WITHDRAWN': {
        text: 'Retirée',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: 'fas fa-undo'
      }
    };

    return statusConfig[status] || {
      text: status || 'Inconnu',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: 'fas fa-question-circle'
    };
  }

  /**
   * Obtenir la priorité formatée avec couleurs
   * @param {string} priority - Priorité de la candidature
   * @returns {Object} - Priorité formatée avec couleurs
   */
  getPriorityDisplay(priority) {
    const priorityConfig = {
      'LOW': {
        text: 'Basse',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: 'fas fa-arrow-down'
      },
      'MEDIUM': {
        text: 'Moyenne',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: 'fas fa-minus'
      },
      'HIGH': {
        text: 'Haute',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: 'fas fa-arrow-up'
      }
    };

    return priorityConfig[priority] || {
      text: priority || 'Inconnue',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: 'fas fa-question-circle'
    };
  }
}

export default new PrestataireDashboardService(); 