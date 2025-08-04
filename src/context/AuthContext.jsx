import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement de l'app
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Rediriger vers la page de connexion
    window.location.href = '/login';
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      const updatedUser = await authService.updateProfile(user.id, profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      await authService.changePassword(user.id, currentPassword, newPassword);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    isAuthenticated: !!user && authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 