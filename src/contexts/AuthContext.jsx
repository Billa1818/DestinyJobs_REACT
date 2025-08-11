import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

// Créer le contexte d'authentification
const AuthContext = createContext({});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    checkAuthState();
  }, []);

  /**
   * Vérifier l'état d'authentification actuel
   */
  const checkAuthState = () => {
    try {
      const isAuth = authService.isAuthenticated();
      const userData = authService.getCurrentUser();

      if (isAuth && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'état d\'authentification:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion utilisateur
   * @param {Object} credentials - Identifiants de connexion
   * @returns {Promise} - Promesse de connexion
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscription utilisateur
   * @param {Object} userData - Données d'inscription
   * @returns {Promise} - Promesse d'inscription
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion utilisateur
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  /**
   * Déconnexion de toutes les sessions
   */
  const logoutAll = async () => {
    try {
      setLoading(true);
      await authService.logoutAllSessions();
    } catch (error) {
      console.error('Erreur lors de la déconnexion de toutes les sessions:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  /**
   * Mise à jour du profil utilisateur
   * @param {Object} profileData - Nouvelles données du profil
   * @returns {Promise} - Promesse de mise à jour
   */
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Changement de mot de passe
   * @param {Object} passwords - Ancien et nouveau mot de passe
   * @returns {Promise} - Promesse de changement
   */
  const changePassword = async (passwords) => {
    try {
      return await authService.changePassword(passwords);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Demande de réinitialisation de mot de passe
   * @param {string} email - Email pour la réinitialisation
   * @returns {Promise} - Promesse de demande
   */
  const resetPassword = async (email) => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Confirmation de réinitialisation de mot de passe
   * @param {Object} data - Token et nouveau mot de passe
   * @returns {Promise} - Promesse de confirmation
   */
  const resetPasswordConfirm = async (data) => {
    try {
      return await authService.resetPasswordConfirm(data);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Récupération du profil spécifique
   * @param {string} userType - Type d'utilisateur
   * @returns {Promise} - Promesse du profil spécifique
   */
  const getSpecificProfile = async (userType) => {
    try {
      return await authService.getSpecificProfile(userType);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Mise à jour du profil spécifique
   * @param {string} userType - Type d'utilisateur
   * @param {Object} profileData - Données du profil
   * @returns {Promise} - Promesse de mise à jour
   */
  const updateSpecificProfile = async (userType, profileData) => {
    try {
      return await authService.updateSpecificProfile(userType, profileData);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Récupération des sessions utilisateur
   * @returns {Promise} - Promesse des sessions
   */
  const getSessions = async () => {
    try {
      return await authService.getSessions();
    } catch (error) {
      throw error;
    }
  };

  /**
   * Invalidation d'une session spécifique
   * @param {string} sessionId - ID de la session
   * @returns {Promise} - Promesse d'invalidation
   */
  const invalidateSession = async (sessionId) => {
    try {
      return await authService.invalidateSession(sessionId);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Connexion sociale
   * @param {Object} socialData - Données de connexion sociale
   * @returns {Promise} - Promesse de connexion sociale
   */
  const socialLogin = async (socialData) => {
    try {
      setLoading(true);
      const response = await authService.socialLogin(socialData);
      
      if (response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vérifier si l'utilisateur a un type spécifique
   * @param {string} requiredType - Type requis
   * @returns {boolean} - True si l'utilisateur a le bon type
   */
  const hasUserType = (requiredType) => {
    return user?.user_type?.toLowerCase() === requiredType?.toLowerCase();
  };

  /**
   * Vérifier si l'utilisateur a l'un des types spécifiés
   * @param {Array} requiredTypes - Types requis
   * @returns {boolean} - True si l'utilisateur a l'un des types
   */
  const hasAnyUserType = (requiredTypes) => {
    if (!user?.user_type || !Array.isArray(requiredTypes)) return false;
    return requiredTypes.some(type => 
      user.user_type.toLowerCase() === type.toLowerCase()
    );
  };

  /**
   * Vérifier si l'utilisateur est approuvé
   * @returns {boolean} - True si approuvé
   */
  const isApproved = () => {
    return user?.is_approved === true;
  };

  /**
   * Vérifier si l'email est vérifié
   * @returns {boolean} - True si vérifié
   */
  const isEmailVerified = () => {
    return user?.email_verified === true;
  };

  /**
   * Actualiser les données utilisateur depuis l'API
   */
  const refreshUser = async () => {
    try {
      if (isAuthenticated) {
        const updatedUser = await authService.getProfile();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Erreur lors de l\'actualisation des données utilisateur:', error);
    }
  };

  /**
   * Gérer les erreurs d'authentification (401, etc.)
   * Force la déconnexion et redirige vers la page de login
   */
  const handleAuthError = () => {
    console.log('🚨 Erreur d\'authentification détectée, déconnexion forcée');
    
    // Forcer la déconnexion
    setIsAuthenticated(false);
    setUser(null);
    
    // Nettoyer les cookies
    authService.clearAuthData();
    
    // Rediriger vers la page de login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  // Valeurs du contexte
  const contextValue = {
    // État
    user,
    loading,
    isAuthenticated,
    
    // Méthodes d'authentification
    login,
    register,
    logout,
    logoutAll,
    
    // Gestion du profil
    updateProfile,
    getSpecificProfile,
    updateSpecificProfile,
    refreshUser,
    
    // Gestion des mots de passe
    changePassword,
    resetPassword,
    resetPasswordConfirm,
    
    // Gestion des sessions
    getSessions,
    invalidateSession,
    
    // Connexion sociale
    socialLogin,
    
    // Utilitaires
    hasUserType,
    hasAnyUserType,
    isApproved,
    isEmailVerified,
    checkAuthState,
    handleAuthError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;