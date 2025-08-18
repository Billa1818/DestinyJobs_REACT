import api from './api';

class ProfileService {
  /**
   * Récupérer le profil candidat
   * @returns {Promise} - Promesse contenant le profil candidat
   */
  async getCandidateProfile() {
    try {
      const response = await api.get('/api/auth/profile/candidate/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil candidat:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le profil candidat
   * @param {FormData} profileData - Données du profil (multipart/form-data)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateCandidateProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile/candidate/', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil candidat:', error);
      throw error;
    }
  }

  /**
   * Récupérer le profil recruteur
   * @returns {Promise} - Promesse contenant le profil recruteur
   */
  async getRecruiterProfile() {
    try {
      const response = await api.get('/api/auth/profile/recruiter/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil recruteur:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le profil recruteur
   * @param {FormData} profileData - Données du profil (multipart/form-data)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateRecruiterProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile/recruiter/', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil recruteur:', error);
      throw error;
    }
  }

  /**
   * Récupérer le profil prestataire
   * @returns {Promise} - Promesse contenant le profil prestataire
   */
  async getProviderProfile() {
    try {
      const response = await api.get('/api/auth/profile/provider/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil prestataire:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le profil prestataire
   * @param {FormData} profileData - Données du profil (multipart/form-data)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateProviderProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile/provider/', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil prestataire:', error);
      throw error;
    }
  }

  /**
   * Récupérer un profil public
   * @param {string} userType - Type d'utilisateur (candidate, recruiter, provider)
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise} - Promesse contenant le profil public
   */
  async getPublicProfile(userType, userId) {
    try {
      const response = await api.get(`/api/auth/public/${userType}/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil public:', error);
      throw error;
    }
  }

  /**
   * Rechercher des profils
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats de recherche
   */
  async searchProfiles(searchParams) {
    try {
      const response = await api.get('/api/auth/public/search/', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de profils:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la visibilité du profil
   * @param {string} visibility - Niveau de visibilité (PUBLIC, RECRUITERS_ONLY, PRIVATE)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateProfileVisibility(visibility) {
    try {
      const response = await api.put('/api/auth/profile/visibility/update/', {
        profile_visibility: visibility
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
      throw error;
    }
  }

  /**
   * Obtenir les options de visibilité disponibles
   * @returns {Promise} - Promesse contenant les options de visibilité
   */
  async getProfileVisibilityOptions() {
    try {
      const response = await api.get('/api/auth/profile/visibility/options/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des options de visibilité:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques de visibilité
   * @returns {Promise} - Promesse contenant les statistiques
   */
  async getProfileVisibilityStats() {
    try {
      const response = await api.get('/api/auth/profile/visibility/stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de visibilité:', error);
      throw error;
    }
  }

  /**
   * Contacter un profil
   * @param {string} userId - ID de l'utilisateur à contacter
   * @param {Object} messageData - Données du message
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async contactProfile(userId, messageData) {
    try {
      const response = await api.post('/api/auth/profiles/contact/', {
        user_id: userId,
        ...messageData
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  /**
   * Convertir un candidat en prestataire
   * @param {Object} providerData - Données du prestataire
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async becomeProvider(providerData) {
    try {
      const response = await api.post('/api/auth/become-provider/', providerData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la conversion en prestataire:', error);
      throw error;
    }
  }

  /**
   * Gérer le type de prestataire
   * @param {Object} providerTypeData - Données du type de prestataire
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async manageProviderType(providerTypeData) {
    try {
      const response = await api.put('/api/auth/provider/type/', providerTypeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la gestion du type de prestataire:', error);
      throw error;
    }
  }

  /**
   * Gérer les services du prestataire
   * @param {Object} servicesData - Données des services
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async manageProviderServices(servicesData) {
    try {
      const response = await api.put('/api/auth/provider/services/', servicesData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la gestion des services:', error);
      throw error;
    }
  }

  /**
   * Récupérer la localisation de l'utilisateur
   * @returns {Promise} - Promesse contenant la localisation
   */
  async getLocation() {
    try {
      const response = await api.get('/api/auth/profile/location/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la localisation de l'utilisateur
   * @param {Object} locationData - Données de localisation
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateLocation(locationData) {
    try {
      console.log('🚀 Envoi de la requête PUT /api/auth/profile/location/');
      console.log('📤 Données envoyées:', JSON.stringify(locationData, null, 2));
      
      const response = await api.put('/api/auth/profile/location/', locationData);
      console.log('✅ Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la localisation:', error);
      if (error.response) {
        console.error('📥 Réponse d\'erreur:', error.response.data);
        console.error('📊 Status:', error.response.status);
        console.error('🔍 Headers:', error.response.headers);
      }
      throw error;
    }
  }

  /**
   * Lister tous les pays disponibles
   * @returns {Promise} - Promesse contenant la liste des pays
   */
  async getCountries() {
    try {
      const response = await api.get('/api/auth/countries/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      throw error;
    }
  }

  /**
   * Lister les régions d'un pays
   * @param {number} countryId - ID du pays
   * @returns {Promise} - Promesse contenant la liste des régions
   */
  async getRegions(countryId) {
    try {
      const response = await api.get(`/api/auth/countries/${countryId}/regions/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
      throw error;
    }
  }

  /**
   * Supprimer le CV du candidat
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async deleteCandidateCV() {
    try {
      const response = await api.delete('/api/auth/profile/candidate/cv/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du CV:', error);
      throw error;
    }
  }

  /**
   * Supprimer l'image du candidat
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async deleteCandidateImage() {
    try {
      const response = await api.delete('/api/auth/profile/candidate/image/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }

  /**
   * Récupérer la visibilité du profil
   * @returns {Promise} - Promesse contenant la visibilité
   */
  async getProfileVisibility() {
    try {
      const response = await api.get('/api/auth/profile/visibility/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la visibilité:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la visibilité du profil
   * @param {string} visibility - Nouvelle visibilité (PUBLIC, RECRUITERS_ONLY, PRIVATE)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateProfileVisibility(visibility) {
    try {
      const response = await api.put('/api/auth/profile/visibility/update/', {
        profile_visibility: visibility
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
      throw error;
    }
  }

  /**
   * Récupérer les options de visibilité disponibles
   * @returns {Promise} - Promesse contenant les options
   */
  async getVisibilityOptions() {
    try {
      const response = await api.get('/api/auth/profile/visibility/options/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des options de visibilité:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques de visibilité
   * @returns {Promise} - Promesse contenant les statistiques
   */
  async getVisibilityStats() {
    try {
      const response = await api.get('/api/auth/profile/visibility/stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de visibilité:', error);
      throw error;
    }
  }

  /**
   * Récupérer le profil public d'un candidat
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise} - Promesse contenant le profil public
   */
  async getPublicCandidateProfile(userId) {
    try {
      // Essayer d'abord l'endpoint public
      const publicResponse = await api.get(`/api/auth/public/candidates/${userId}/`);
      const publicData = publicResponse.data;
      
      // Si l'endpoint public ne contient pas le CV, essayer l'endpoint complet
      if (!publicData.cv) {
        console.log('🔍 CV non trouvé dans l\'endpoint public, tentative avec l\'endpoint complet...');
        try {
          const fullResponse = await api.get(`/api/auth/profile/candidate/${userId}/`);
          const fullData = fullResponse.data;
          
          // Fusionner les données : public + CV et autres champs manquants
          return {
            ...publicData,
            cv: fullData.cv,
            education: fullData.education,
            professional_experience: fullData.professional_experience,
            achievements: fullData.achievements
          };
        } catch (fullError) {
          console.log('⚠️ Impossible de récupérer le profil complet, utilisation des données publiques uniquement');
          return publicData;
        }
      }
      
      return publicData;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil public:', error);
      throw error;
    }
  }

  /**
   * Récupérer le profil public d'un recruteur
   * @param {string} userId - ID de l'utilisateur recruteur
   * @returns {Promise} - Promesse contenant le profil public
   */
  async getPublicRecruiterProfile(userId) {
    try {
      const response = await api.get(`/api/auth/public/recruiters/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil public du recruteur:', error);
      throw error;
    }
  }

  /**
   * Rechercher des profils publics
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchPublicProfiles(searchParams) {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await api.get(`/api/auth/public/search/?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de profils:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques du candidat
   * @returns {Promise} - Promesse contenant les statistiques
   */
  async getCandidateStats() {
    try {
      const response = await api.get('/api/auth/profile/candidate/stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du candidat:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques personnelles du profil
   * @returns {Promise} - Promesse contenant les statistiques personnelles
   */
  async getPersonalStats() {
    try {
      const response = await api.get('/api/auth/profile/personal-stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques personnelles:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques de mes candidatures
   * @returns {Promise} - Promesse contenant les statistiques des candidatures
   */
  async getMyApplicationsStats() {
    try {
      const response = await api.get('/api/applications/my-applications-stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des candidatures:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques globales des candidatures
   * @returns {Promise} - Promesse contenant les statistiques globales
   */
  async getApplicationsStats() {
    try {
      const response = await api.get('/api/applications/stats/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques globales:', error);
      throw error;
    }
  }

  /**
   * Récupérer le profil utilisateur de base
   * @returns {Promise} - Promesse contenant le profil utilisateur
   */
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      throw error;
    }
  }

  /**
   * Récupérer les préférences de notification de l'utilisateur
   * GET /api/notifications/preferences/
   */
  async getNotificationPreferences() {
    try {
      const response = await api.get('/api/notifications/preferences/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des préférences de notification:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les préférences de notification de l'utilisateur
   * PUT /api/notifications/preferences/
   */
  async updateNotificationPreferences(preferences) {
    try {
      const response = await api.put('/api/notifications/preferences/', preferences);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des préférences de notification:', error);
      throw error;
    }
  }

  /**
   * Réinitialiser les préférences de notification aux valeurs par défaut
   */
  async resetNotificationPreferencesToDefaults() {
    try {
      const defaultPreferences = {
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
        
        notification_frequency: "IMMEDIATE",
        quiet_hours_start: "22:00:00",
        quiet_hours_end: "08:00:00"
      };
      
      const response = await api.put('/api/notifications/preferences/', defaultPreferences);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation des préférences:', error);
      throw error;
    }
  }
}

export default new ProfileService(); 