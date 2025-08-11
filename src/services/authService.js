import api from './api';
import Cookies from 'js-cookie';

class AuthService {
  
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Les données d'inscription
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register/', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        user_type: userData.user_type.toUpperCase(),
        phone: userData.phone,
        terms_accepted: userData.terms_accepted
      });

      const { user, refresh, access } = response.data;

      // Stocker les tokens et informations utilisateur
      this.storeAuthData(access, refresh, user);

      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de l\'inscription');
      throw error;
    }
  }

  /**
   * Connexion utilisateur
   * @param {Object} credentials - Les identifiants de connexion
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login/', {
        login: credentials.login,  // Le backend Django attend 'login', pas 'email'
        password: credentials.password
      });

      const { user, refresh, access } = response.data;

      // Stocker les tokens et informations utilisateur
      this.storeAuthData(access, refresh, user);

      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur de connexion');
      throw error;
    }
  }

  /**
   * Déconnexion utilisateur
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async logout() {
    try {
      const refreshToken = Cookies.get('refresh_token');

      if (refreshToken) {
        await api.post('/api/auth/logout/', {
          refresh: refreshToken
        });
      }

      this.clearAuthData();
    } catch (error) {
      // Même en cas d'erreur, on nettoie les données locales
      this.clearAuthData();
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  /**
   * Rafraîchir le token d'accès
   * @returns {Promise} - Promesse contenant le nouveau token
   */
  async refreshToken() {
    try {
      const refreshToken = Cookies.get('refresh_token');
      
      if (!refreshToken) {
        throw new Error('Aucun token de rafraîchissement disponible');
      }

      const response = await api.post('/api/auth/token/refresh/', {
        refresh: refreshToken
      });

      const { access } = response.data;
      
      // Mettre à jour le token d'accès avec la même durée d'expiration
      Cookies.set('access_token', access, { expires: 7 });
      
      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors du rafraîchissement du token');
      throw error;
    }
  }

  /**
   * Changement de mot de passe
   * @param {Object} passwords - Ancien et nouveau mot de passe
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async changePassword(passwords) {
    try {
      const response = await api.post('/api/auth/password/change/', {
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword
      });

      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors du changement de mot de passe');
      throw error;
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   * @param {string} email - Email pour la réinitialisation
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async resetPassword(email) {
    try {
      const response = await api.post('/api/auth/password/reset/', {
        email: email
      });

      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de l\'envoi de l\'email');
      throw error;
    }
  }

  /**
   * Confirmation de réinitialisation de mot de passe
   * @param {Object} data - Token et nouveau mot de passe
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async resetPasswordConfirm(data) {
    try {
      const response = await api.post('/api/auth/password/reset/confirm/', {
        uid: data.uid,
        token: data.token,
        new_password: data.newPassword
      });

      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de la réinitialisation');
      throw error;
    }
  }

  /**
   * Demander l'envoi d'un email de vérification
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async requestEmailVerification() {
    try {
      const response = await api.post('/api/auth/request-email-verification/');
      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de la demande de vérification d\'email');
      throw error;
    }
  }

  /**
   * Vérifier l'email via le lien reçu par email
   * @param {string} uid - ID de l'utilisateur
   * @param {string} token - Token de vérification
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async verifyEmail(uid, token) {
    try {
      const response = await api.get(`/api/auth/verify-email/${uid}/${token}/`);
      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de la vérification de l\'email');
      throw error;
    }
  }

  /**
   * Récupération du profil utilisateur
   * @returns {Promise} - Promesse contenant le profil utilisateur
   */
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile/');
      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de la récupération du profil');
      throw error;
    }
  }

  /**
   * Mise à jour du profil utilisateur
   * @param {Object} profileData - Nouvelles données du profil
   * @returns {Promise} - Promesse contenant le profil mis à jour
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile/', profileData);
      
      // Mettre à jour les données utilisateur stockées
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data };
        Cookies.set('user_data', JSON.stringify(updatedUser), { expires: 7 });
      }

      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de la mise à jour du profil');
      throw error;
    }
  }

  /**
   * Récupération du profil spécifique selon le type d'utilisateur
   * @param {string} userType - Type d'utilisateur (candidate, recruiter, provider)
   * @returns {Promise} - Promesse contenant le profil spécifique
   */
  async getSpecificProfile(userType) {
    try {
      const response = await api.get(`/api/auth/profile/${userType}/`);
      return response.data;
    } catch (error) {
      this.handleAuthError(error, `Erreur lors de la récupération du profil ${userType}`);
      throw error;
    }
  }

  /**
   * Mise à jour du profil spécifique selon le type d'utilisateur
   * @param {string} userType - Type d'utilisateur (candidate, recruiter, provider)
   * @param {Object} profileData - Nouvelles données du profil
   * @returns {Promise} - Promesse contenant le profil mis à jour
   */
  async updateSpecificProfile(userType, profileData) {
    try {
      const response = await api.put(`/api/auth/profile/${userType}/`, profileData);
      return response.data;
    } catch (error) {
      this.handleAuthError(error, `Erreur lors de la mise à jour du profil ${userType}`);
      throw error;
    }
  }

  /**
   * Connexion sociale
   * @param {Object} socialData - Données de connexion sociale
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async socialLogin(socialData) {
    try {
      const response = await api.post('/api/auth/social-login/', {
        access_token: socialData.accessToken,
        provider: socialData.provider.toUpperCase()
      });

      // Si la connexion sociale renvoie des tokens, les stocker
      if (response.data.access && response.data.refresh) {
        const { user, refresh, access } = response.data;
        this.storeAuthData(access, refresh, user);
      }

      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur de connexion sociale');
      throw error;
    }
  }

  /**
   * Stockage des données d'authentification
   * @param {string} accessToken - Token d'accès
   * @param {string} refreshToken - Token de rafraîchissement
   * @param {Object} user - Données utilisateur
   */
  storeAuthData(accessToken, refreshToken, user) {
    // Stocker les tokens avec des durées d'expiration appropriées
    Cookies.set('access_token', accessToken, { expires: 7 }); // 7 jours au lieu de 1
    Cookies.set('refresh_token', refreshToken, { expires: 30 }); // 30 jours au lieu de 7
    Cookies.set('user_data', JSON.stringify(user), { expires: 30 }); // 30 jours au lieu de 7
  }

  /**
   * Nettoyage des données d'authentification
   */
  clearAuthData() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_data');
  }

  /**
   * Vérification si l'utilisateur est connecté
   * @returns {boolean} - True si connecté, false sinon
   */
  isAuthenticated() {
    const accessToken = Cookies.get('access_token');
    const userData = Cookies.get('user_data');
    return !!(accessToken && userData);
  }

  /**
   * Récupération des données utilisateur actuelles
   * @returns {Object|null} - Données utilisateur ou null
   */
  getCurrentUser() {
    const userData = Cookies.get('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Récupération du token d'accès actuel
   * @returns {string|null} - Token d'accès ou null
   */
  getAccessToken() {
    return Cookies.get('access_token') || null;
  }

  /**
   * Gestion des erreurs d'authentification
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   */
  handleAuthError(error, defaultMessage) {
    let message = defaultMessage;

    if (error.response?.data) {
      const errorData = error.response.data;
      console.log('Auth Error - Response data:', errorData);
      
      // Gérer les erreurs de validation Django
      if (errorData.login && Array.isArray(errorData.login)) {
        message = errorData.login[0]; // Premier message d'erreur pour le champ login
      } else if (errorData.password && Array.isArray(errorData.password)) {
        message = errorData.password[0]; // Premier message d'erreur pour le champ password
      } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
        message = errorData.non_field_errors[0]; // Erreurs générales (ex: "Identifiants incorrects")
      } else if (errorData.error) {
        message = errorData.error;
      } else if (errorData.details) {
        // Gérer les erreurs de validation de champs
        const fieldErrors = Object.values(errorData.details).flat();
        message = fieldErrors.join(', ');
      } else if (typeof errorData === 'string') {
        message = errorData;
      } else if (typeof errorData === 'object') {
        // Extraire tous les messages d'erreur
        const allErrors = [];
        Object.keys(errorData).forEach(key => {
          if (Array.isArray(errorData[key])) {
            allErrors.push(...errorData[key]);
          }
        });
        if (allErrors.length > 0) {
          message = allErrors.join(', ');
        }
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error('Auth Error:', error);
    console.log('Auth Error - Message final:', message);
    // Retourner le message d'erreur pour que le composant puisse l'afficher
    return message;
  }

  /**
   * Récupérer la liste des sessions actives
   * @returns {Promise} - Promesse contenant la liste des sessions
   */
  async getSessions() {
    try {
      const response = await api.get('/api/auth/sessions/');
      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de la récupération des sessions');
      throw error;
    }
  }

  /**
   * Déconnexion de toutes les sessions
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async logoutAllSessions() {
    try {
      const response = await api.post('/api/auth/sessions/logout-all/', {
        confirm: true
      });
      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de la déconnexion de toutes les sessions');
      throw error;
    }
  }

  /**
   * Invalider une session spécifique
   * @param {string} sessionId - ID de la session à invalider
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async invalidateSession(sessionId) {
    try {
      const response = await api.post(`/api/auth/sessions/${sessionId}/invalidate/`);
      return response.data;
    } catch (error) {
      this.handleAuthError(error, 'Erreur lors de l\'invalidation de la session');
      throw error;
    }
  }
}

// Créer une instance unique du service
const authService = new AuthService();

export default authService;
