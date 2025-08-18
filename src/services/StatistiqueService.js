import api from './api';

/**
 * Service pour la gestion des statistiques du recruteur
 * Basé sur la documentation des endpoints notifications et autres statistiques
 */
class StatistiqueService {
  
  /**
   * Récupérer les statistiques des notifications
   * GET /api/notifications/stats/
   */
  async getNotificationStats() {
    try {
      const response = await api.get('/api/notifications/stats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques des notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des candidatures
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
   * Récupérer les statistiques des offres d'emploi
   * GET /api/jobs/my-job-offers/stats/
   */
  async getJobOfferStats() {
    try {
      const response = await api.get('/api/jobs/my-job-offers/stats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques des offres d\'emploi:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des offres de consultation
   * GET /api/jobs/my-consultation-offers/stats/
   */
  async getConsultationOfferStats() {
    try {
      const response = await api.get('/api/jobs/my-consultation-offers/stats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques des consultations:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des offres de financement
   * GET /api/jobs/my-funding-offers/stats/
   */
  async getFundingOfferStats() {
    try {
      const response = await api.get('/api/jobs/my-funding-offers/stats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques des financements:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des bourses d'études
   * GET /api/jobs/my-scholarships/stats/
   */
  async getScholarshipStats() {
    try {
      const response = await api.get('/api/jobs/my-scholarships/stats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques des bourses:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques de diffusion (vues, clics, etc.)
   * GET /api/analytics/diffusion/
   */
  async getDiffusionStats() {
    try {
      const response = await api.get('/api/analytics/diffusion/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques de diffusion:', error);
      // Retourner des données par défaut si l'endpoint n'existe pas
      return {
        total_views: 0,
        total_clicks: 0,
        click_through_rate: 0,
        average_time_on_page: 0,
        bounce_rate: 0,
        top_performing_offers: []
      };
    }
  }

  /**
   * Récupérer les statistiques de facturation
   * GET /api/billing/stats/
   */
  async getBillingStats() {
    try {
      const response = await api.get('/api/billing/stats/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques de facturation:', error);
      // Retourner des données par défaut si l'endpoint n'existe pas
      return {
        total_spent: 0,
        monthly_spending: 0,
        subscription_cost: 0,
        payment_methods: [],
        billing_history: []
      };
    }
  }

  /**
   * Récupérer les statistiques de localisation
   * GET /api/analytics/location/
   */
  async getLocationStats() {
    try {
      const response = await api.get('/api/analytics/location/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques de localisation:', error);
      // Retourner des données par défaut si l'endpoint n'existe pas
      return {
        top_locations: [],
        location_performance: [],
        geographic_distribution: {}
      };
    }
  }

  /**
   * Récupérer les statistiques de performance des candidats
   * GET /api/analytics/candidate-performance/
   */
  async getCandidatePerformanceStats() {
    try {
      const response = await api.get('/api/analytics/candidate-performance/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques de performance des candidats:', error);
      // Retourner des données par défaut si l'endpoint n'existe pas
      return {
        average_response_time: 0,
        candidate_satisfaction: 0,
        interview_success_rate: 0,
        time_to_hire: 0,
        quality_metrics: {}
      };
    }
  }

  /**
   * Récupérer toutes les statistiques en parallèle
   */
  async getAllStats() {
    try {
      console.log('🚀 Chargement de toutes les statistiques...');
      
      const [
        notificationStats,
        applicationStats,
        jobOfferStats,
        consultationOfferStats,
        fundingOfferStats,
        scholarshipStats,
        diffusionStats,
        billingStats,
        locationStats,
        candidatePerformanceStats
      ] = await Promise.all([
        this.getNotificationStats(),
        this.getApplicationStats(),
        this.getJobOfferStats().catch(() => null),
        this.getConsultationOfferStats().catch(() => null),
        this.getFundingOfferStats().catch(() => null),
        this.getScholarshipStats().catch(() => null),
        this.getDiffusionStats(),
        this.getBillingStats(),
        this.getLocationStats(),
        this.getCandidatePerformanceStats()
      ]);

      console.log('✅ Toutes les statistiques chargées avec succès');
      
      return {
        notificationStats,
        applicationStats,
        jobOfferStats,
        consultationOfferStats,
        fundingOfferStats,
        scholarshipStats,
        diffusionStats,
        billingStats,
        locationStats,
        candidatePerformanceStats,
        
        // Statistiques consolidées
        myStats: applicationStats,
        diffusionStats,
        billingStats,
        locationAnalytics: locationStats
      };
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement de toutes les statistiques:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des notifications avec filtres
   * GET /api/notifications/stats/?period=month&type=all
   */
  async getNotificationStatsWithFilters(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/notifications/stats/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques filtrées:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des candidatures avec filtres
   * GET /api/applications/stats/?period=month&status=all
   */
  async getApplicationStatsWithFilters(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/applications/stats/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques des candidatures filtrées:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques de performance par période
   * GET /api/analytics/performance/?period=month&metric=applications
   */
  async getPerformanceStats(period = 'month', metric = 'applications') {
    try {
      const response = await api.get(`/api/analytics/performance/?period=${period}&metric=${metric}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques de performance:', error);
      // Retourner des données par défaut
      return {
        period,
        metric,
        data: [],
        trends: {},
        summary: {}
      };
    }
  }
}

export default new StatistiqueService(); 