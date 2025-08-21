import api from './api';

class CandidatNotificationService {
  // Récupérer les notifications du candidat
  async getNotifications(page = 1, pageSize = 20, unreadOnly = false) {
    try {
      console.log('🔔 API Call - CandidatNotificationService.getNotifications:', { page, pageSize, unreadOnly });
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      });
      
      if (unreadOnly) {
        params.append('unread_only', 'true');
      }
      
      const response = await api.get(`/api/notifications/?${params}`);
      
      console.log('✅ API Response - CandidatNotificationService.getNotifications:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatNotificationService.getNotifications:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Authentification requise. Veuillez vous reconnecter.');
          case 403:
            throw new Error('Vous n\'êtes pas autorisé à accéder aux notifications.');
          case 404:
            throw new Error('Notifications non trouvées.');
          default:
            throw new Error(`Erreur ${error.response.status}: ${error.response.data.detail || 'Erreur lors de la récupération des notifications'}`);
        }
      } else if (error.request) {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Erreur: ${error.message}`);
      }
    }
  }



  // Marquer des notifications comme lues
  async markAsRead(notificationIds = [], markAll = false) {
    try {
      console.log('✅ API Call - CandidatNotificationService.markAsRead:', { notificationIds, markAll });
      
      const payload = markAll ? { mark_all: true } : { notification_ids: notificationIds };
      
      const response = await api.post('/api/notifications/mark-as-read/', payload);
      
      console.log('✅ API Response - CandidatNotificationService.markAsRead:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatNotificationService.markAsRead:', error);
      throw error;
    }
  }

  // Récupérer les préférences de notifications
  async getNotificationPreferences() {
    try {
      console.log('⚙️ API Call - CandidatNotificationService.getNotificationPreferences');
      
      const response = await api.get('/api/notifications/preferences/');
      
      console.log('✅ API Response - CandidatNotificationService.getNotificationPreferences:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatNotificationService.getNotificationPreferences:', error);
      throw error;
    }
  }

  // Mettre à jour les préférences de notifications
  async updateNotificationPreferences(preferences) {
    try {
      console.log('⚙️ API Call - CandidatNotificationService.updateNotificationPreferences:', preferences);
      
      const response = await api.put('/api/notifications/preferences/', preferences);
      
      console.log('✅ API Response - CandidatNotificationService.updateNotificationPreferences:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatNotificationService.updateNotificationPreferences:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des notifications
  async getNotificationStats() {
    try {
      console.log('📊 API Call - CandidatNotificationService.getNotificationStats');
      
      const response = await api.get('/api/notifications/stats/');
      
      console.log('✅ API Response - CandidatNotificationService.getNotificationStats:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatNotificationService.getNotificationStats:', error);
      throw error;
    }
  }

  // Récupérer les types de notifications disponibles
  async getNotificationTypes() {
    try {
      console.log('🎯 API Call - CandidatNotificationService.getNotificationTypes');
      
      const response = await api.get('/api/notifications/types/');
      
      console.log('✅ API Response - CandidatNotificationService.getNotificationTypes:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CandidatNotificationService.getNotificationTypes:', error);
      throw error;
    }
  }

  // Formater les notifications pour l'affichage
  formatNotificationsForDisplay(notifications) {
    if (!notifications || !Array.isArray(notifications)) return [];

    return notifications.map(notification => ({
      id: notification.id,
      type: notification.notification_type,
      title: notification.title,
      message: notification.message,
      isRead: notification.is_read,
      priority: notification.priority,
      createdAt: notification.created_at,
      readAt: notification.read_at,
      metadata: notification.metadata || {},
      
      // Propriétés calculées
      isHighPriority: notification.priority === 'HIGH',
      isUnread: !notification.is_read,
      timeAgo: this.getTimeAgo(notification.created_at),
      typeLabel: this.getTypeLabel(notification.notification_type),
      priorityColor: this.getPriorityColor(notification.priority)
    }));
  }

  // Obtenir le temps écoulé depuis la création
  getTimeAgo(createdAt) {
    if (!createdAt) return '';
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffInSeconds = Math.floor((now - created) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;
    
    return created.toLocaleDateString('fr-FR');
  }

  // Obtenir le label du type de notification
  getTypeLabel(type) {
    const labels = {
      'APPLICATION_STATUS': 'Statut de candidature',
      'NEW_OFFER_MATCH': 'Nouvelle offre correspondante',
      'ACCOUNT_UPDATES': 'Mises à jour du compte',
      'AI_IMPROVEMENTS': 'Améliorations IA',
      'RECRUITER_APPROVAL': 'Approbation recruteur',
      'PAYMENT_CONFIRMATION': 'Confirmation de paiement'
    };
    
    return labels[type] || type;
  }

  // Obtenir la couleur de la priorité
  getPriorityColor(priority) {
    const colors = {
      'HIGH': 'text-red-600 bg-red-100',
      'NORMAL': 'text-blue-600 bg-blue-100',
      'LOW': 'text-gray-600 bg-gray-100'
    };
    
    return colors[priority] || 'text-gray-600 bg-gray-100';
  }

  // Obtenir l'icône du type de notification
  getTypeIcon(type) {
    const icons = {
      'APPLICATION_STATUS': 'fas fa-file-alt',
      'NEW_OFFER_MATCH': 'fas fa-briefcase',
      'ACCOUNT_UPDATES': 'fas fa-user-cog',
      'AI_IMPROVEMENTS': 'fas fa-robot',
      'RECRUITER_APPROVAL': 'fas fa-check-circle',
      'PAYMENT_CONFIRMATION': 'fas fa-credit-card'
    };
    
    return icons[type] || 'fas fa-bell';
  }

  // Formater les préférences pour l'affichage
  formatPreferencesForDisplay(preferences) {
    if (!preferences) return null;

    return {
      emailNotifications: preferences.email_notifications || false,
      pushNotifications: preferences.push_notifications || false,
      smsNotifications: preferences.sms_notifications || false,
      frequency: preferences.frequency || 'IMMEDIATE',
      quietHours: preferences.quiet_hours || {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      },
      notificationTypes: preferences.notification_types || {}
    };
  }

  // Formater les préférences pour l'envoi à l'API
  formatPreferencesForAPI(preferences) {
    return {
      email_notifications: preferences.emailNotifications,
      push_notifications: preferences.pushNotifications,
      sms_notifications: preferences.smsNotifications,
      frequency: preferences.frequency,
      quiet_hours: {
        enabled: preferences.quietHours.enabled,
        start_time: preferences.quietHours.startTime,
        end_time: preferences.quietHours.endTime
      },
      notification_types: preferences.notificationTypes
    };
  }
}

export default new CandidatNotificationService(); 