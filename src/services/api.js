import axios from 'axios';
import Cookies from 'js-cookie';

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Création de l'instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Augmenté à 30 secondes par défaut
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuration spécifique pour l'analyse IA (peut prendre plus de temps)
export const aiAnalysisConfig = {
  timeout: 120000, // 2 minutes pour l'analyse IA
  headers: {
    'Content-Type': 'application/json',
  },
};

// Intercepteur pour ajouter automatiquement le token d'accès
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le renouvellement automatique des tokens
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Gestion de l'erreur 402 (Payment Required)
    if (error.response?.status === 402) {
      const paymentErrorEvent = new CustomEvent('payment-required', {
        detail: {
          status: 402,
          message: error.response?.data?.detail || 'Vous devez souscrire à un plan pour accéder à cette fonctionnalité.',
          error: error
        }
      });
      window.dispatchEvent(paymentErrorEvent);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;

          // Mettre à jour le token d'accès
          Cookies.set('access_token', access, { expires: 7 }); // 7 jours

          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } else {
          // Pas de refresh token, déconnecter l'utilisateur
          console.log('🚨 Pas de refresh token disponible, déconnexion forcée');
          handleAuthError();
        }
      } catch (refreshError) {
        console.error('❌ Erreur lors du rafraîchissement du token:', refreshError);
        // Le refresh a échoué, déconnecter l'utilisateur
        console.log('🚨 Échec du refresh token, déconnexion forcée');
        handleAuthError();
      }
    }

    // Déclencher un événement personnalisé pour les erreurs 401
    if (error.response?.status === 401) {
      const authErrorEvent = new CustomEvent('auth-error', {
        detail: {
          status: 401,
          message: 'Erreur d\'authentification',
          error: error
        }
      });
      window.dispatchEvent(authErrorEvent);
    }

    return Promise.reject(error);
  }
);

// Fonction pour gérer les erreurs d'authentification
const handleAuthError = () => {
  // Nettoyer tous les cookies d'authentification
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('user_data');
  
  // Rediriger vers la page de connexion
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export default api;
