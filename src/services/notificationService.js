import api from './api';

class NotificationService {
  
  /**
   * Récupération des notifications de l'utilisateur
   * @param {Object} filters - Filtres (read, type, etc.)
   * @returns {Promise} - Promesse contenant les notifications
   */
  async getNotifications(filters = {}) {
    try {
      const response = await api.get('/api/notifications/', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la récupération des notifications');
    }
  }

  /**
   * Marquer une notification comme lue
   * @param {string} notificationId - ID de la notification
   * @returns {Promise} - Promesse contenant la notification mise à jour
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/api/notifications/${notificationId}/`, {
        read: true
      });
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors du marquage de la notification');
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   * @returns {Promise} - Promesse contenant la réponse
   */
  async markAllAsRead() {
    try {
      const response = await api.post('/api/notifications/mark-all-read/');
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors du marquage de toutes les notifications');
    }
  }

  /**
   * Supprimer une notification
   * @param {string} notificationId - ID de la notification
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/api/notifications/${notificationId}/`);
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la suppression de la notification');
    }
  }

  /**
   * Supprimer toutes les notifications
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteAllNotifications() {
    try {
      const response = await api.delete('/api/notifications/delete-all/');
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la suppression de toutes les notifications');
    }
  }

  /**
   * Récupération des conversations de messagerie
   * @returns {Promise} - Promesse contenant les conversations
   */
  async getConversations() {
    try {
      const response = await api.get('/api/messaging/conversations/');
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la récupération des conversations');
    }
  }

  /**
   * Récupération des messages d'une conversation
   * @param {string} conversationId - ID de la conversation
   * @returns {Promise} - Promesse contenant les messages
   */
  async getMessages(conversationId) {
    try {
      const response = await api.get(`/api/messaging/conversations/${conversationId}/messages/`);
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la récupération des messages');
    }
  }

  /**
   * Envoyer un message
   * @param {string} conversationId - ID de la conversation
   * @param {Object} messageData - Données du message
   * @returns {Promise} - Promesse contenant le message envoyé
   */
  async sendMessage(conversationId, messageData) {
    try {
      const response = await api.post(`/api/messaging/conversations/${conversationId}/messages/`, messageData);
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de l\'envoi du message');
    }
  }

  /**
   * Créer une nouvelle conversation
   * @param {Object} conversationData - Données de la conversation
   * @returns {Promise} - Promesse contenant la conversation créée
   */
  async createConversation(conversationData) {
    try {
      const response = await api.post('/api/messaging/conversations/', conversationData);
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la création de la conversation');
    }
  }

  /**
   * Marquer une conversation comme lue
   * @param {string} conversationId - ID de la conversation
   * @returns {Promise} - Promesse contenant la conversation mise à jour
   */
  async markConversationAsRead(conversationId) {
    try {
      const response = await api.patch(`/api/messaging/conversations/${conversationId}/`, {
        read: true
      });
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors du marquage de la conversation');
    }
  }

  /**
   * Supprimer une conversation
   * @param {string} conversationId - ID de la conversation
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteConversation(conversationId) {
    try {
      const response = await api.delete(`/api/messaging/conversations/${conversationId}/`);
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la suppression de la conversation');
    }
  }

  /**
   * Récupération des paramètres de notification
   * @returns {Promise} - Promesse contenant les paramètres
   */
  async getNotificationSettings() {
    try {
      const response = await api.get('/api/notifications/settings/');
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la récupération des paramètres');
    }
  }

  /**
   * Mise à jour des paramètres de notification
   * @param {Object} settings - Nouveaux paramètres
   * @returns {Promise} - Promesse contenant les paramètres mis à jour
   */
  async updateNotificationSettings(settings) {
    try {
      const response = await api.put('/api/notifications/settings/', settings);
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la mise à jour des paramètres');
    }
  }

  /**
   * S'abonner aux notifications push
   * @param {Object} subscriptionData - Données d'abonnement
   * @returns {Promise} - Promesse contenant la réponse
   */
  async subscribeToPushNotifications(subscriptionData) {
    try {
      const response = await api.post('/api/notifications/push-subscribe/', subscriptionData);
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de l\'abonnement aux notifications push');
    }
  }

  /**
   * Se désabonner des notifications push
   * @returns {Promise} - Promesse contenant la réponse
   */
  async unsubscribeFromPushNotifications() {
    try {
      const response = await api.post('/api/notifications/push-unsubscribe/');
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors du désabonnement des notifications push');
    }
  }

  /**
   * Récupération des statistiques de notification
   * @returns {Promise} - Promesse contenant les statistiques
   */
  async getNotificationStats() {
    try {
      const response = await api.get('/api/notifications/stats/');
      return response.data;
    } catch (error) {
      throw this.handleNotificationError(error, 'Erreur lors de la récupération des statistiques');
    }
  }

  /**
   * Gestion des erreurs
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleNotificationError(error, defaultMessage) {
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

    console.error('Notification Error:', error);
    return new Error(message);
  }
}

// Créer une instance unique du service
const notificationService = new NotificationService();

export default notificationService; 