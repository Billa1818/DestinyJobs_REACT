import api from './api';

/**
 * Service pour la gestion des notifications et préférences des prestataires
 */
class ProviderNotificationService {
  /**
   * Récupérer la liste des notifications du prestataire
   * @param {Object} params - Paramètres de pagination et filtres
   * @returns {Promise} - Promesse contenant la liste des notifications
   */
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.page_size) queryParams.append('page_size', params.page_size);
      if (params.unread_only !== undefined) queryParams.append('unread_only', params.unread_only);
      
      const url = `/api/notifications/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      
      console.log('🔔 Notifications récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer le détail d'une notification spécifique
   * @param {string} notificationId - ID de la notification
   * @returns {Promise} - Promesse contenant le détail de la notification
   */
  async getNotificationDetail(notificationId) {
    try {
      const response = await api.get(`/api/notifications/${notificationId}/`);
      console.log('📄 Détail de la notification récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du détail de la notification:', error);
      throw error;
    }
  }

  /**
   * Marquer des notifications comme lues
   * @param {Object} data - Données de marquage {notification_ids ou mark_all}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async markNotificationsAsRead(data) {
    try {
      const response = await api.post('/api/notifications/mark-as-read/', data);
      console.log('✅ Notifications marquées comme lues:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
      throw error;
    }
  }

  /**
   * Marquer des notifications spécifiques comme lues
   * @param {Array} notificationIds - IDs des notifications à marquer
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async markSpecificNotificationsAsRead(notificationIds) {
    return this.markNotificationsAsRead({ notification_ids: notificationIds });
  }

  /**
   * Marquer toutes les notifications non lues comme lues
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async markAllNotificationsAsRead() {
    return this.markNotificationsAsRead({ mark_all: true });
  }

  /**
   * Récupérer les statistiques des notifications
   * @returns {Promise} - Promesse contenant les statistiques
   */
  async getNotificationStats() {
    try {
      const response = await api.get('/api/notifications/stats/');
      console.log('📊 Statistiques des notifications récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Récupérer les préférences de notification du prestataire
   * @returns {Promise} - Promesse contenant les préférences
   */
  async getNotificationPreferences() {
    try {
      const response = await api.get('/api/notifications/preferences/');
      console.log('⚙️ Préférences de notification récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      throw error;
    }
  }

  /**
   * Modifier les préférences de notification du prestataire
   * @param {Object} preferences - Nouvelles préférences
   * @returns {Promise} - Promesse contenant les préférences mises à jour
   */
  async updateNotificationPreferences(preferences) {
    try {
      const response = await api.put('/api/notifications/preferences/', preferences);
      console.log('✅ Préférences de notification mises à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  }

  /**
   * Récupérer la liste des types de notifications disponibles
   * @returns {Promise} - Promesse contenant les types de notifications
   */
  async getNotificationTypes() {
    try {
      const response = await api.get('/api/notifications/types/');
      console.log('📋 Types de notifications récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des types de notifications:', error);
      throw error;
    }
  }

  /**
   * Valider les préférences de notification avant envoi
   * @param {Object} preferences - Préférences à valider
   * @returns {Object} - Résultat de la validation
   */
  validateNotificationPreferences(preferences) {
    const errors = [];

    // Validation des heures de silence si fournies
    if (preferences.quiet_hours_start && preferences.quiet_hours_end) {
      const startTime = new Date(`2000-01-01T${preferences.quiet_hours_start}`);
      const endTime = new Date(`2000-01-01T${preferences.quiet_hours_end}`);
      
      if (startTime >= endTime) {
        errors.push('L\'heure de début des heures de silence doit être antérieure à l\'heure de fin');
      }
    }

    // Validation de la fréquence si fournie
    if (preferences.notification_frequency && 
        !['IMMEDIATE', 'HOURLY', 'DAILY', 'WEEKLY'].includes(preferences.notification_frequency)) {
      errors.push('La fréquence de notification doit être IMMEDIATE, HOURLY, DAILY ou WEEKLY');
    }

    // Validation des valeurs booléennes
    const booleanFields = [
      'email_notifications', 'email_new_offers', 'email_application_updates',
      'email_blog_updates', 'email_subscription_updates', 'email_daily_digest',
      'email_weekly_report', 'email_account_validation', 'email_ai_services',
      'email_recruiter_updates', 'push_notifications', 'push_new_offers',
      'push_application_updates', 'push_messages', 'push_subscription_reminders',
      'push_account_validation', 'push_ai_services', 'sms_notifications',
      'sms_urgent_updates', 'sms_account_validation'
    ];

    booleanFields.forEach(field => {
      if (preferences[field] !== undefined && typeof preferences[field] !== 'boolean') {
        errors.push(`Le champ ${field} doit être un booléen`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtenir les préférences par défaut pour un nouveau prestataire
   * @returns {Object} - Préférences par défaut
   */
  getDefaultPreferences() {
    return {
      email_notifications: true,
      email_new_offers: true,
      email_application_updates: true,
      email_blog_updates: false,
      email_subscription_updates: true,
      email_daily_digest: false,
      email_weekly_report: false,
      email_account_validation: true,
      email_ai_services: true,
      email_recruiter_updates: true,
      push_notifications: true,
      push_new_offers: true,
      push_application_updates: true,
      push_messages: true,
      push_subscription_reminders: true,
      push_account_validation: true,
      push_ai_services: true,
      sms_notifications: false,
      sms_urgent_updates: false,
      sms_account_validation: false,
      notification_frequency: 'IMMEDIATE',
      quiet_hours_start: null,
      quiet_hours_end: null
    };
  }

  /**
   * Formater les notifications pour l'affichage
   * @param {Array} notifications - Notifications brutes
   * @returns {Array} - Notifications formatées
   */
  formatNotificationsForDisplay(notifications) {
    return notifications.map(notification => ({
      ...notification,
      priorityColor: this.getPriorityColor(notification.priority),
      priorityText: this.getPriorityText(notification.priority),
      typeText: this.getNotificationTypeText(notification.notification_type),
      timeAgo: this.getTimeAgo(notification.created_at),
      isUrgent: notification.priority === 'URGENT',
      isHigh: notification.priority === 'HIGH'
    }));
  }

  /**
   * Obtenir la couleur de la priorité
   * @param {string} priority - Priorité de la notification
   * @returns {string} - Classe CSS de couleur
   */
  getPriorityColor(priority) {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-100';
      case 'HIGH':
        return 'text-orange-600 bg-orange-100';
      case 'NORMAL':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Obtenir le texte de la priorité
   * @param {string} priority - Priorité de la notification
   * @returns {string} - Texte de la priorité
   */
  getPriorityText(priority) {
    switch (priority) {
      case 'URGENT':
        return 'Urgente';
      case 'HIGH':
        return 'Élevée';
      case 'NORMAL':
        return 'Normale';
      default:
        return priority;
    }
  }

  /**
   * Obtenir le texte du type de notification
   * @param {string} type - Type de notification
   * @returns {string} - Texte du type
   */
  getNotificationTypeText(type) {
    const typeMap = {
      'NEW_OFFER_MATCH': 'Nouvelle offre correspondante',
      'APPLICATION_STATUS': 'Statut candidature',
      'AI_SERVICE_UPDATE': 'Mise à jour service IA',
      'SUBSCRIPTION_EXPIRING': 'Abonnement expirant',
      'SYSTEM_UPDATE': 'Mise à jour système',
      'MESSAGE_RECEIVED': 'Nouveau message',
      'BLOG_POST_PUBLISHED': 'Nouvel article',
      'DAILY_DIGEST': 'Résumé quotidien',
      'WEEKLY_REPORT': 'Rapport hebdomadaire',
      'SUBSCRIPTION_EXPIRED': 'Abonnement expiré',
      'OFFER_EXPIRED': 'Offre expirée',
      'RECRUITER_ACCOUNT_PENDING': 'Compte recruteur en attente',
      'RECRUITER_ACCOUNT_APPROVED': 'Compte recruteur approuvé',
      'APPLICATION_ACCEPTED': 'Candidature acceptée',
      'AI_CV_IMPROVEMENT_COMPLETE': 'Amélioration CV IA terminée'
    };
    
    return typeMap[type] || type;
  }

  /**
   * Obtenir le temps écoulé depuis la création
   * @param {string} createdAt - Date de création
   * @returns {string} - Temps écoulé formaté
   */
  getTimeAgo(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInSeconds = Math.floor((now - created) / 1000);

    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return created.toLocaleDateString('fr-FR');
    }
  }
}

export default new ProviderNotificationService(); 