import axios from 'axios';
import api from './api';

const CHATBOT_BASE_URL = 'https://api.destinyjobs.net/api/chatbot';

/**
 * Service pour gérer les interactions avec le chatbot IA du backend Django
 * Endpoints utilisés:
 * - POST /api/chatbot/sessions/ - Créer une session
 * - GET /api/chatbot/sessions/ - Lister les sessions
 * - GET /api/chatbot/sessions/{id}/ - Détails d'une session
 * - POST /api/chatbot/messages/ - Envoyer un message
 * - GET /api/chatbot/messages/?session_id={id} - Lister messages
 * - POST /api/chatbot/messages/{id}/rate/ - Évaluer un message
 * - GET /api/chatbot/analytics/my_analytics/ - Analytiques
 */
const chatbotService = {
  // ==================== SESSIONS ====================

  /**
   * Crée une nouvelle session de chat
   * @param {string} title - Titre optionnel de la session
   * @returns {Promise<Object>} Nouvelle session avec id
   */
  createSession: async (title = 'Chat Session') => {
    try {
      const response = await api.post(`${CHATBOT_BASE_URL}/sessions/`, {
        title,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur création session:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Erreur création session',
        status: error.response?.status,
      };
    }
  },

  /**
   * Récupère toutes les sessions de l'utilisateur
   * @returns {Promise<Object>} liste des sessions
   */
  getSessions: async () => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/sessions/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur récupération sessions:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur récupération sessions',
        status: error.response?.status,
      };
    }
  },

  /**
   * Récupère les détails d'une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Object>} Détails de la session (avec messages)
   */
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/sessions/${sessionId}/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur récupération session:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur récupération session',
        status: error.response?.status,
      };
    }
  },

  /**
   * Ferme une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Object>} Réponse de fermeture
   */
  closeSession: async (sessionId) => {
    try {
      const response = await api.post(`${CHATBOT_BASE_URL}/sessions/${sessionId}/close/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur fermeture session:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur fermeture session',
        status: error.response?.status,
      };
    }
  },

  /**
   * Archive une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Object>} Réponse d'archivage
   */
  archiveSession: async (sessionId) => {
    try {
      const response = await api.post(`${CHATBOT_BASE_URL}/sessions/${sessionId}/archive/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur archivage session:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur archivage session',
        status: error.response?.status,
      };
    }
  },

  /**
   * Supprime une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Object>} Réponse de suppression
   */
  deleteSession: async (sessionId) => {
    try {
      const response = await api.delete(`${CHATBOT_BASE_URL}/sessions/${sessionId}/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur suppression session:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur suppression session',
        status: error.response?.status,
      };
    }
  },

  /**
   * Récupère le résumé d'une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Object>} Résumé de la session
   */
  getSessionSummary: async (sessionId) => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/sessions/${sessionId}/summary/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur résumé session:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur résumé session',
        status: error.response?.status,
      };
    }
  },

  /**
   * Récupère le contexte d'une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Object>} Contexte de la session
   */
  getSessionContext: async (sessionId) => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/sessions/${sessionId}/context/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur récupération contexte:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur récupération contexte',
        status: error.response?.status,
      };
    }
  },

  // ==================== MESSAGES ====================

  /**
   * Envoie un message et reçoit la réponse de l'assistant
   * @param {string} sessionId - ID de la session
   * @param {string} content - Contenu du message
   * @returns {Promise<Object>} Messages créés (user + assistant)
   */
  sendMessage: async (sessionId, content) => {
    try {
      if (!content || !content.trim()) {
        throw new Error('Le message ne peut pas être vide');
      }

      const response = await api.post(
        `${CHATBOT_BASE_URL}/messages/`,
        {
          session_id: sessionId,
          content: content.trim(),
        },
        {
          timeout: 120000, // 2 minutes pour les réponses IA
        }
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur envoi message:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Erreur envoi message',
        status: error.response?.status,
      };
    }
  },

  /**
   * Récupère tous les messages d'une session
   * @param {string} sessionId - ID de la session
   * @returns {Promise<Object>} Liste des messages
   */
  getSessionMessages: async (sessionId) => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/messages/`, {
        params: {
          session_id: sessionId,
        },
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur récupération messages:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur récupération messages',
        status: error.response?.status,
      };
    }
  },

  /**
   * Récupère les détails d'un message
   * @param {string} messageId - ID du message
   * @returns {Promise<Object>} Détails du message
   */
  getMessage: async (messageId) => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/messages/${messageId}/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur récupération message:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur récupération message',
        status: error.response?.status,
      };
    }
  },

  /**
   * Évalue une réponse du chatbot
   * @param {string} messageId - ID du message à évaluer
   * @param {number} rating - Note de 1 à 5
   * @param {string} feedback - Feedback optionnel
   * @returns {Promise<Object>} Message mis à jour avec l'évaluation
   */
  rateMessage: async (messageId, rating, feedback = '') => {
    try {
      if (!rating || rating < 1 || rating > 5) {
        throw new Error('La note doit être entre 1 et 5');
      }

      const response = await api.post(`${CHATBOT_BASE_URL}/messages/${messageId}/rate/`, {
        rating,
        feedback,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur évaluation message:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Erreur évaluation message',
        status: error.response?.status,
      };
    }
  },

  // ==================== ANALYTICS ====================

  /**
   * Récupère les analytiques de l'utilisateur
   * @returns {Promise<Object>} Analytiques complètes
   */
  getMyAnalytics: async () => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/analytics/my_analytics/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur récupération analytics:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur récupération analytics',
        status: error.response?.status,
      };
    }
  },

  /**
   * Récupère toutes les analytiques (pour admin)
   * @returns {Promise<Object>} Liste des analytiques
   */
  getAllAnalytics: async () => {
    try {
      const response = await api.get(`${CHATBOT_BASE_URL}/analytics/`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erreur récupération toutes analytics:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur récupération analytics',
        status: error.response?.status,
      };
    }
  },
};

export default chatbotService;
