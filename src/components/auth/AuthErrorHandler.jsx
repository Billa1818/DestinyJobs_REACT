import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Composant pour gérer globalement les erreurs d'authentification
 * Intercepte les erreurs 401 et force la déconnexion
 */
const AuthErrorHandler = ({ children }) => {
  const { handleAuthError } = useAuth();

  useEffect(() => {
    // Fonction pour intercepter les erreurs globales
    const handleGlobalError = (event) => {
      // Vérifier si c'est une erreur d'authentification
      if (event.error && event.error.status === 401) {
        console.log('🚨 Erreur 401 détectée globalement');
        handleAuthError();
      }
    };

    // Fonction pour intercepter les erreurs de fetch
    const handleFetchError = (event) => {
      if (event.detail && event.detail.status === 401) {
        console.log('🚨 Erreur 401 fetch détectée globalement');
        handleAuthError();
      }
    };

    // Fonction pour intercepter les erreurs d'authentification personnalisées
    const handleAuthErrorEvent = (event) => {
      if (event.detail && event.detail.status === 401) {
        console.log('🚨 Événement auth-error détecté:', event.detail);
        handleAuthError();
      }
    };

    // Écouter les erreurs globales
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);
    
    // Écouter les erreurs de fetch
    window.addEventListener('fetch-error', handleFetchError);
    
    // Écouter les erreurs d'authentification personnalisées
    window.addEventListener('auth-error', handleAuthErrorEvent);

    // Nettoyage
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
      window.removeEventListener('fetch-error', handleFetchError);
      window.removeEventListener('auth-error', handleAuthErrorEvent);
    };
  }, [handleAuthError]);

  return <>{children}</>;
};

export default AuthErrorHandler; 