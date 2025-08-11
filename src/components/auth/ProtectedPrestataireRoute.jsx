import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedPrestataireRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
      if (!isAuthenticated || !user) {
        navigate('/?redirected=true&reason=not_authenticated', { replace: true });
        return;
      }

      // Si l'utilisateur n'est pas un prestataire, rediriger vers la page d'accueil
      if (user.user_type?.toLowerCase() !== 'prestataire') {
        navigate('/?redirected=true&reason=wrong_user_type', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté ou n'est pas un prestataire, ne rien afficher
  if (!isAuthenticated || !user || user.user_type?.toLowerCase() !== 'prestataire') {
    return null;
  }

  // Si tout est bon, afficher le contenu protégé
  return children;
};

export default ProtectedPrestataireRoute; 