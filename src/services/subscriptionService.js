import api from './api';
import toast from 'react-hot-toast';

/**
 * Service pour gérer les abonnements et plans
 */
const subscriptionService = {
  /**
   * Récupère l'abonnement actuel de l'utilisateur
   */
  getCurrentSubscription: async () => {
    try {
      const response = await api.get('/api/subscription/subscriptions/current/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement actuel:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les plans disponibles
   */
  getAllPlans: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.user_type) params.append('user_type', filters.user_type);
      if (filters.plan_type) params.append('plan_type', filters.plan_type);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active);

      const queryString = params.toString();
      const url = `/api/subscription/plans/${queryString ? '?' + queryString : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les plans disponibles pour le type d'utilisateur
   */
  getAvailablePlans: async () => {
    try {
      const response = await api.get('/api/subscription/plans/available_for_user/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des plans disponibles:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les abonnements (pour admin)
   */
  getAllSubscriptions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.user_type) params.append('user_type', filters.user_type);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active);

      const queryString = params.toString();
      const url = `/api/subscription/subscriptions/${queryString ? '?' + queryString : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements:', error);
      throw error;
    }
  },

  /**
   * Souscrire à un nouveau plan
   * @param {string} plan_id - ID du plan
   * @param {string} duration_id - ID de la durée
   * @param {string} payment_method - Méthode de paiement (STRIPE ou FREE)
   */
  subscribe: async (plan_id, duration_id, payment_method = 'STRIPE') => {
    try {
      const response = await api.post('/api/subscription/subscriptions/subscribe/', {
        plan_id,
        duration_id,
        payment_method
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la souscription au plan:', error);
      throw error;
    }
  },

  /**
   * Annule l'abonnement actuel
   */
  cancelSubscription: async () => {
    try {
      const response = await api.post('/api/subscription/subscriptions/cancel/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    }
  },

  /**
   * Récupère l'historique des paiements
   * @param {Object} filters - Filtres optionnels (status, payment_method, etc.)
   */
  getPaymentHistory: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.payment_method) params.append('payment_method', filters.payment_method);
      if (filters.created_at_gte) params.append('created_at__gte', filters.created_at_gte);
      if (filters.created_at_lte) params.append('created_at__lte', filters.created_at_lte);

      const queryString = params.toString();
      const url = `/api/subscription/payments/${queryString ? '?' + queryString : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des paiements:', error);
      throw error;
    }
  },

  /**
   * Récupère les factures
   * @param {Object} filters - Filtres optionnels (status, issued_date, etc.)
   */
  getInvoices: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.issued_date_gte) params.append('issued_date__gte', filters.issued_date_gte);
      if (filters.issued_date_lte) params.append('issued_date__lte', filters.issued_date_lte);

      const queryString = params.toString();
      const url = `/api/subscription/invoices/${queryString ? '?' + queryString : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      throw error;
    }
  },

  /**
   * Traite le webhook Stripe
   * @param {Object} webhookData - Données du webhook Stripe
   */
  handleStripeWebhook: async (webhookData) => {
    try {
      const response = await api.post('/api/subscription/webhooks/stripe/', webhookData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du traitement du webhook Stripe:', error);
      throw error;
    }
  }
};

export default subscriptionService;
