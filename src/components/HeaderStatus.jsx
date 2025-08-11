import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HeaderStatus = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
        <strong>Chargement...</strong> Vérification du statut utilisateur...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>Utilisateur non connecté</strong> - Header public affiché
      </div>
    );
  }

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <strong>Utilisateur connecté</strong><br />
      <strong>Type:</strong> {user.user_type || 'Non défini'}<br />
      <strong>Email:</strong> {user.email || 'Non défini'}<br />
      <strong>Header affiché:</strong> {user.user_type ? `${user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}Header` : 'PublicHeader'}
    </div>
  );
};

export default HeaderStatus; 