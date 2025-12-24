import api from './api';
import { getApiBaseUrl } from '../utils/urlHelper';

const prestataireService = {
  /**
   * Récupérer le profil public d'un prestataire
   * @param {string} providerId - ID du prestataire
   * @returns {Promise} Données du profil public
   */
  getPublicPrestataireProfile: async (providerId) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/public/providers/${providerId}/`);
      
      if (!response.ok) {
        const error = new Error('Erreur lors du chargement du profil');
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: null
        };
        
        try {
          error.response.data = await response.json();
        } catch (e) {
          // Pas de JSON à parser
        }
        
        throw error;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Format de réponse inattendu');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur service prestataireService.getPublicPrestataireProfile:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les prestataires publics (avec pagination)
   * @param {number} page - Numéro de la page
   * @param {number} limit - Nombre d'éléments par page
   * @returns {Promise} Liste des prestataires
   */
  getPublicPrestataires: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/auth/public/providers/?page=${page}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur service prestataireService.getPublicPrestataires:', error);
      throw error;
    }
  },

  /**
   * Rechercher des prestataires par spécialisation
   * @param {string} specialization - Spécialisation à chercher
   * @returns {Promise} Liste des prestataires correspondants
   */
  searchBySpecialization: async (specialization) => {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/auth/public/providers/?specializations=${encodeURIComponent(specialization)}`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur service prestataireService.searchBySpecialization:', error);
      throw error;
    }
  },

  /**
   * Rechercher des prestataires par disponibilité
   * @param {string} availability - Disponibilité (AVAILABLE, BUSY, etc)
   * @returns {Promise} Liste des prestataires disponibles
   */
  searchByAvailability: async (availability) => {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/auth/public/providers/?availability=${availability}`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur service prestataireService.searchByAvailability:', error);
      throw error;
    }
  },

  /**
   * Contacter un prestataire (nécessite authentification)
   * @param {string} providerId - ID du prestataire
   * @param {object} data - Données du message (subject, message, etc)
   * @returns {Promise} Réponse de l'API
   */
  contactPrestaire: async (providerId, data) => {
    try {
      const response = await api.post(
        `/api/prestataires/${providerId}/contact/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erreur service prestataireService.contactPrestaire:', error);
      throw error;
    }
  },

  /**
   * Ajouter un prestataire aux favoris (nécessite authentification)
   * @param {string} providerId - ID du prestataire
   * @returns {Promise} Réponse de l'API
   */
  addToFavorites: async (providerId) => {
    try {
      const response = await api.post(
        `/api/prestataires/${providerId}/add-to-favorites/`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur service prestataireService.addToFavorites:', error);
      throw error;
    }
  },

  /**
   * Retirer un prestataire des favoris (nécessite authentification)
   * @param {string} providerId - ID du prestataire
   * @returns {Promise} Réponse de l'API
   */
  removeFromFavorites: async (providerId) => {
    try {
      const response = await api.delete(
        `/api/prestataires/${providerId}/remove-from-favorites/`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur service prestataireService.removeFromFavorites:', error);
      throw error;
    }
  },

  /**
   * Vérifier si un prestataire est en favoris (nécessite authentification)
   * @param {string} providerId - ID du prestataire
   * @returns {Promise} Booléen indiquant si le prestataire est en favoris
   */
  isFavorite: async (providerId) => {
    try {
      const response = await api.get(
        `/api/prestataires/${providerId}/is-favorite/`
      );
      return response.data.is_favorite;
    } catch (error) {
      console.error('Erreur service prestataireService.isFavorite:', error);
      return false;
    }
  }
};

export default prestataireService;
