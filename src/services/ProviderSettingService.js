import api from './api';

/**
 * Service pour la gestion des paramètres et de la sécurité des prestataires
 */
class ProviderSettingService {
  /**
   * Modifier le mot de passe de l'utilisateur connecté
   * @param {Object} passwordData - Données de changement de mot de passe {old_password, new_password}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async changePassword(passwordData) {
    try {
      const response = await api.post('/api/auth/password/change/', passwordData);
      console.log('🔑 Mot de passe modifié avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  /**
   * Demander la réinitialisation du mot de passe
   * @param {Object} resetData - Données de réinitialisation {email}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async requestPasswordReset(resetData) {
    try {
      const response = await api.post('/api/auth/password/reset/', resetData);
      console.log('📧 Demande de réinitialisation envoyée:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      throw error;
    }
  }

  /**
   * Confirmer la réinitialisation du mot de passe
   * @param {Object} confirmData - Données de confirmation {token, new_password}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async confirmPasswordReset(confirmData) {
    try {
      const response = await api.post('/api/auth/password/reset/confirm/', confirmData);
      console.log('✅ Réinitialisation confirmée:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la confirmation de réinitialisation:', error);
      throw error;
    }
  }

  /**
   * Vérifier l'email de l'utilisateur connecté
   * @param {Object} emailData - Données de vérification {email}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async verifyEmail(emailData) {
    try {
      const response = await api.post('/api/auth/verify-email/', emailData);
      console.log('📧 Email vérifié avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
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
      console.log('📧 Demande de vérification email envoyée:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la demande de vérification email:', error);
      throw error;
    }
  }

  /**
   * Renouveler un token d'accès expiré
   * @param {Object} tokenData - Données de renouvellement {refresh, session_id}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async refreshToken(tokenData) {
    try {
      const response = await api.post('/api/auth/token/refresh/', tokenData);
      console.log('🔄 Token renouvelé avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du renouvellement du token:', error);
      throw error;
    }
  }

  /**
   * Lister toutes les sessions actives de l'utilisateur
   * @returns {Promise} - Promesse contenant la liste des sessions
   */
  async getSessions() {
    try {
      const response = await api.get('/api/auth/sessions/');
      console.log('🖥️ Sessions récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  }

  /**
   * Déconnecter l'utilisateur de toutes ses sessions
   * @param {Object} confirmData - Données de confirmation {confirm: true}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async logoutAllSessions(confirmData) {
    try {
      const response = await api.post('/api/auth/sessions/logout-all/', confirmData);
      console.log('🚪 Déconnexion de toutes les sessions:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la déconnexion de toutes les sessions:', error);
      throw error;
    }
  }

  /**
   * Forcer la déconnexion de la session actuelle
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async forceLogout() {
    try {
      const response = await api.post('/api/auth/sessions/force-logout/');
      console.log('🚪 Déconnexion forcée de la session actuelle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la déconnexion forcée:', error);
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
      console.log(`🚪 Session ${sessionId} invalidée:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'invalidation de la session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Valider les données de changement de mot de passe
   * @param {Object} passwordData - Données à valider
   * @returns {Object} - Résultat de la validation
   */
  validatePasswordChange(passwordData) {
    const errors = [];

    if (!passwordData.old_password) {
      errors.push('L\'ancien mot de passe est requis');
    }

    if (!passwordData.new_password) {
      errors.push('Le nouveau mot de passe est requis');
    } else if (passwordData.new_password.length < 8) {
      errors.push('Le nouveau mot de passe doit contenir au moins 8 caractères');
    } else if (passwordData.new_password === passwordData.old_password) {
      errors.push('Le nouveau mot de passe doit être différent de l\'ancien');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valider les données de réinitialisation de mot de passe
   * @param {Object} resetData - Données à valider
   * @returns {Object} - Résultat de la validation
   */
  validatePasswordReset(resetData) {
    const errors = [];

    if (!resetData.email) {
      errors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetData.email)) {
      errors.push('L\'email doit être valide');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valider les données de confirmation de réinitialisation
   * @param {Object} confirmData - Données à valider
   * @returns {Object} - Résultat de la validation
   */
  validatePasswordResetConfirm(confirmData) {
    const errors = [];

    if (!confirmData.token) {
      errors.push('Le token de réinitialisation est requis');
    }

    if (!confirmData.new_password) {
      errors.push('Le nouveau mot de passe est requis');
    } else if (confirmData.new_password.length < 8) {
      errors.push('Le nouveau mot de passe doit contenir au moins 8 caractères');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new ProviderSettingService(); 