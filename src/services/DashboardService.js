import api from './api';

/**
 * Service pour le tableau de bord du recruteur
 * Gère toutes les API liées au dashboard
 */
class DashboardService {
  
  /**
   * Récupérer les statistiques complètes des candidatures
   * GET /api/applications/stats/
   */
  async getApplicationStats() {
    try {
      const response = await api.get('/api/applications/stats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques des candidatures:', error);
      throw error;
    }
  }

  /**
   * Récupérer mes offres d'emploi
   * GET /api/jobs/my-job-offers/
   */
  async getMyJobOffers(page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      });
      const response = await api.get(`/api/jobs/my-job-offers/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des offres d\'emploi:', error);
      throw error;
    }
  }

  /**
   * Récupérer mes offres de financement
   * GET /api/jobs/my-funding-offers/
   */
  async getMyFundingOffers(page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      });
      const response = await api.get(`/api/jobs/my-funding-offers/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des offres de financement:', error);
      throw error;
    }
  }

  /**
   * Récupérer mes offres de consultation
   * GET /api/jobs/my-consultation-offers/
   */
  async getMyConsultationOffers(page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      });
      const response = await api.get(`/api/jobs/my-consultation-offers/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des offres de consultation:', error);
      throw error;
    }
  }

  /**
   * Récupérer mes bourses d'études
   * GET /api/jobs/my-scholarships/
   */
  async getMyScholarships(page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      });
      const response = await api.get(`/api/jobs/my-scholarships/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des bourses d\'études:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les candidatures pour mes offres
   * GET /api/applications/
   */
  async getMyApplications(filters = {}, page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });
      const response = await api.get(`/api/applications/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  }

  /**
   * Récupérer mes notifications
   * GET /api/notifications/
   */
  async getMyNotifications(page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      });
      const response = await api.get(`/api/notifications/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer le tableau de bord complet
   * Combine toutes les données nécessaires
   */
  async getDashboardData() {
    try {
      console.log('🚀 Chargement du tableau de bord complet...');
      
      // Charger toutes les données en parallèle
      const [
        applicationStats,
        jobOffers,
        fundingOffers,
        consultationOffers,
        scholarships,
        recentApplications,
        notifications
      ] = await Promise.all([
        this.getApplicationStats(),
        this.getMyJobOffers(1, 5), // 5 dernières offres
        this.getMyFundingOffers(1, 5),
        this.getMyConsultationOffers(1, 5),
        this.getMyScholarships(1, 5),
        this.getMyApplications({ ordering: '-created_at' }, 1, 10), // 10 dernières candidatures
        this.getMyNotifications(1, 10) // 10 dernières notifications
      ]);

      console.log('✅ Tableau de bord chargé avec succès');
      
      return {
        applicationStats,
        jobOffers,
        fundingOffers,
        consultationOffers,
        scholarships,
        recentApplications,
        notifications
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement du tableau de bord:', error);
      throw error;
    }
  }
}

export default new DashboardService(); 