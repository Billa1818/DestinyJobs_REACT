import api from './api';

class EmploiCandidatureRecentService {
  /**
   * Récupère les candidatures aux offres d'emploi avec filtres et pagination
   * @param {Object} filters - Filtres à appliquer
   * @param {number} page - Numéro de page (défaut: 1)
   * @param {number} pageSize - Taille de page (défaut: 10, max: 100)
   * @returns {Promise<Object>} Données des candidatures et pagination
   */
  async getJobApplications(filters = {}, page = 1, pageSize = 10) {
    try {
      // Limiter la taille de page à 100
      const validPageSize = Math.min(pageSize, 100);
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: validPageSize.toString(),
        ...filters
      }).toString();
      
      const url = `/api/applications/job/?${queryParams}`;
      
      const response = await api.get(url);
      
      // L'API retourne directement un tableau, pas un objet avec results
      const applications = Array.isArray(response.data) ? response.data : [];
      
      return {
        applications: applications,
        pagination: {
          count: applications.length,
          next: null, // L'API ne semble pas retourner de pagination
          previous: null,
          currentPage: page,
          pageSize: validPageSize,
          totalPages: Math.ceil(applications.length / validPageSize)
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  }

  /**
   * Récupère toutes les candidatures d'emploi (sans pagination)
   * @returns {Promise<Array>} Liste de toutes les candidatures
   */
  async getAllJobApplications() {
    try {
      const response = await api.get('/api/applications/job/?page_size=100');
      // L'API retourne directement un tableau
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les candidatures:', error);
      throw error;
    }
  }

  /**
   * Récupère les candidatures par statut
   * @param {string} status - Statut de la candidature
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise<Object>} Candidatures filtrées par statut
   */
  async getApplicationsByStatus(status, page = 1, pageSize = 20) {
    return this.getJobApplications(
      { 'application__status': status },
      page,
      pageSize
    );
  }

  /**
   * Récupère les candidatures par priorité
   * @param {string} priority - Priorité de la candidature
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise<Object>} Candidatures filtrées par priorité
   */
  async getApplicationsByPriority(priority, page = 1, pageSize = 20) {
    return this.getJobApplications(
      { 'application__priority': priority },
      page,
      pageSize
    );
  }

  /**
   * Recherche des candidatures par texte
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} additionalFilters - Filtres additionnels
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise<Object>} Candidatures correspondant à la recherche
   */
  async searchApplications(searchTerm, additionalFilters = {}, page = 1, pageSize = 20) {
    const filters = {
      search: searchTerm,
      ...additionalFilters
    };
    
    return this.getJobApplications(filters, page, pageSize);
  }

  /**
   * Récupère les candidatures récentes (triées par date de création)
   * @param {number} limit - Nombre de candidatures à récupérer
   * @returns {Promise<Array>} Candidatures récentes
   */
  async getRecentApplications(limit = 10) {
    try {
      const response = await api.get(`/api/applications/job/?ordering=-application__created_at&page_size=${limit}`);
      // L'API retourne directement un tableau
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures récentes:', error);
      throw error;
    }
  }

  /**
   * Récupère les candidatures prioritaires
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise<Object>} Candidatures prioritaires
   */
  async getPriorityApplications(page = 1, pageSize = 20) {
    return this.getJobApplications(
      { 'application__priority': 'HIGH' },
      page,
      pageSize
    );
  }

  /**
   * Récupère les statistiques des candidatures
   * @returns {Promise<Object>} Statistiques des candidatures
   */
  async getApplicationStats() {
    try {
      const response = await api.get('/api/applications/job/');
      // L'API retourne directement un tableau
      const applications = Array.isArray(response.data) ? response.data : [];
      
      const stats = {
        total: applications.length,
        byStatus: {},
        byPriority: {},
        recentCount: 0
      };
      
      // Compter par statut
      applications.forEach(app => {
        const status = app.application?.status || 'UNKNOWN';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      });
      
      // Compter par priorité (si disponible)
      applications.forEach(app => {
        const priority = app.application?.priority || 'NORMAL';
        stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
      });
      
      // Compter les candidatures récentes (moins de 7 jours)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      stats.recentCount = applications.filter(app => {
        const createdAt = new Date(app.application?.created_at);
        return createdAt > oneWeekAgo;
      }).length;
      
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Met à jour le statut d'une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} newStatus - Nouveau statut
   * @returns {Promise<Object>} Candidature mise à jour
   */
  async updateApplicationStatus(applicationId, newStatus) {
    try {
      const response = await api.patch(`/api/applications/status/update/${applicationId}/`, {
        status: newStatus
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  /**
   * Retire une candidature
   * @param {string} applicationId - ID de la candidature
   * @returns {Promise<Object>} Confirmation du retrait
   */
  async withdrawApplication(applicationId) {
    try {
      const response = await api.patch(`/api/applications/status/update/${applicationId}/`, {
        status: 'WITHDRAWN'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du retrait de la candidature:', error);
      throw error;
    }
  }

  /**
   * Supprime définitivement une candidature
   * @param {string} applicationId - ID de la candidature
   * @returns {Promise<boolean>} True si la suppression réussit
   */
  async deleteJobApplication(applicationId) {
    try {
      console.log(`🗑️ Tentative de suppression de la candidature: ${applicationId}`);
      
      const response = await api.delete(`/api/applications/job/${applicationId}/delete/`);
      
      // L'API retourne 204 No Content en cas de succès
      if (response.status === 204) {
        console.log('✅ Candidature supprimée avec succès');
        return true;
      } else {
        throw new Error(`Réponse inattendue: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la candidature:', error);
      
      // Gestion spécifique des erreurs selon la documentation
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentification requise. Veuillez vous reconnecter.');
          case 403:
            throw new Error('Vous n\'êtes pas autorisé à supprimer cette candidature.');
          case 404:
            throw new Error('Candidature non trouvée.');
          default:
            throw new Error(`Erreur serveur: ${error.response.status}`);
        }
      } else {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
      }
    }
  }
}

export default new EmploiCandidatureRecentService(); 