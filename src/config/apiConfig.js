// Configuration des URLs API et images
export const API_CONFIG = {
  // URL de base de l'API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  
  // URL de base pour les images et fichiers
  MEDIA_BASE_URL: process.env.REACT_APP_MEDIA_URL || 'http://localhost:3000',
  
  // Configuration des endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/api/auth/login/',
      REGISTER: '/api/auth/register/',
      PROFILE: '/api/auth/profile/',
      CHANGE_PASSWORD: '/api/auth/change-password/',
      RESET_PASSWORD: '/api/auth/reset-password/',
      VERIFY_EMAIL: '/api/auth/verify-email/',
      SESSIONS: '/api/auth/sessions/',
      LOGOUT_ALL: '/api/auth/logout-all-sessions/',
    },
    
    // Provider
    PROVIDER: {
      PROFILE: '/api/auth/profile/provider/',
      SERVICES: '/api/auth/provider/services/',
      TYPE: '/api/auth/provider/type/',
      STATS: '/api/auth/provider/stats/',
    },
    
    // Location
    LOCATION: {
      COUNTRIES: '/api/auth/countries/',
      REGIONS: '/api/auth/countries/{countryId}/regions/',
    },
    
    // Public
    PUBLIC: {
      SEARCH: '/api/auth/public/search/',
      PROVIDER_PROFILE: '/api/auth/public/providers/{userId}/',
    }
  }
};

// Fonction utilitaire pour construire l'URL des images
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si c'est déjà une URL complète, la retourner
  if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }
  
  // Si c'est un fichier File, créer une URL temporaire
  if (imagePath instanceof File) {
    return URL.createObjectURL(imagePath);
  }
  
  // Si c'est un chemin relatif, ajouter l'URL de base des médias
  if (typeof imagePath === 'string' && imagePath.startsWith('/')) {
    return `${API_CONFIG.MEDIA_BASE_URL}${imagePath}`;
  }
  
  // Si c'est un chemin sans slash, ajouter l'URL de base des médias
  if (typeof imagePath === 'string') {
    return `${API_CONFIG.MEDIA_BASE_URL}/${imagePath}`;
  }
  
  return null;
};

// Fonction utilitaire pour construire l'URL de l'API
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

export default API_CONFIG;
