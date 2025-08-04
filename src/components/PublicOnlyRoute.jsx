import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Rediriger vers la page appropriée selon le rôle
    switch (user.role) {
      case 'candidat':
        return <Navigate to="/candidat" replace />;
      case 'prestataire':
        return <Navigate to="/prestataire" replace />;
      case 'recruteur':
        return <Navigate to="/recruteur" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicOnlyRoute; 