/**
 * Utilitaire pour gérer les URLs avec le backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Construit une URL complète pour une image/fichier du backend
 * @param {string} imagePath - Chemin relatif ou URL complète
 * @returns {string} - URL complète
 */
export const buildImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Construire l'URL avec le baseURL
  return `${API_BASE_URL}${imagePath}`;
};

/**
 * Retourne l'API_BASE_URL
 */
export const getApiBaseUrl = () => API_BASE_URL;

export default {
  buildImageUrl,
  getApiBaseUrl,
  API_BASE_URL
};
