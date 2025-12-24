import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant qui protège les routes d'authentification (login, signup)
 * Redirige automatiquement les utilisateurs déjà connectés vers leur dashboard
 */
const ProtectedAuthRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Rediriger selon le type d'utilisateur
      if (user.user_type === 'recruteur') {
        navigate('/recruteur/dashboard');
      } else if (user.user_type === 'prestataire') {
        navigate('/prestataire/home');
      } else if (user.user_type === 'candidat') {
        navigate('/candidat');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return <LoadingSpinner variant="page" size="lg" text="Vérification..." />;
  }

  // Si l'utilisateur est connecté, ne rien afficher (redirection en cours)
  if (isAuthenticated && user) {
    return null;
  }

  // Si l'utilisateur n'est pas connecté, afficher le composant d'authentification
  return children;
};

export default ProtectedAuthRoute; 