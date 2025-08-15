import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Composant de protection des routes
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les composants enfants à rendre
 * @param {Array|string} props.allowedUserTypes - Types d'utilisateurs autorisés
 * @param {boolean} props.requireAuth - Si l'authentification est requise (défaut: true)
 * @param {boolean} props.requireApproval - Si l'approbation est requise (défaut: false)
 * @param {boolean} props.requireEmailVerification - Si la vérification email est requise (défaut: false)
 * @param {string} props.redirectTo - URL de redirection en cas d'accès refusé
 * @param {React.ReactNode} props.fallback - Composant à afficher pendant le chargement
 */
const ProtectedRoute = ({
  children,
  allowedUserTypes = [],
  requireAuth = true,
  requireApproval = false,
  requireEmailVerification = false,
  redirectTo = '/login',
  fallback = <LoadingSpinner />
}) => {
  const { user, loading, isAuthenticated, hasUserType, hasAnyUserType, isApproved, isEmailVerified } = useAuth();
  const location = useLocation();

  // Afficher le fallback pendant le chargement
  if (loading) {
    return fallback;
  }

  // Si l'authentification est requise et l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si l'utilisateur est connecté mais que l'authentification n'est pas requise
  // (par exemple, pages de connexion/inscription)
  if (!requireAuth && isAuthenticated) {
    // Rediriger selon le type d'utilisateur
    const userType = user?.user_type?.toLowerCase();
    switch (userType) {
      case 'candidat':
        return <Navigate to="/candidat" replace />;
      case 'recruteur':
        return <Navigate to="/recruteur/dashboard" replace />;
      case 'prestataire':
        return <Navigate to="/prestataire/home" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  // Vérifier les types d'utilisateurs autorisés
  if (allowedUserTypes.length > 0 && isAuthenticated) {
    const userTypesArray = Array.isArray(allowedUserTypes) ? allowedUserTypes : [allowedUserTypes];
    
    if (!hasAnyUserType(userTypesArray)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Vérifier si l'approbation est requise
  if (requireApproval && isAuthenticated && !isApproved()) {
    return <Navigate to="/account-pending" replace />;
  }

  // Vérifier si la vérification email est requise
  if (requireEmailVerification && isAuthenticated && !isEmailVerified()) {
    return <Navigate to="/verify-email" replace />;
  }

  // Rendre les composants enfants si toutes les conditions sont remplies
  return children;
};

/**
 * Composant de chargement simple
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
  </div>
);

/**
 * Composant pour les routes publiques uniquement (redirections si connecté)
 */
export const PublicOnlyRoute = ({ children, redirectTo = "/" }) => {
  return (
    <ProtectedRoute
      requireAuth={false}
      redirectTo={redirectTo}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Composant pour les routes candidat uniquement
 */
export const CandidatRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedUserTypes={['candidat']}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Composant pour les routes recruteur uniquement
 */
export const RecruteurRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedUserTypes={['recruteur']}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Composant pour les routes prestataire uniquement
 */
export const PrestataireRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      allowedUserTypes={['prestataire']}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Composant pour les routes admin (tous types d'utilisateurs connectés)
 */
export const AuthenticatedRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      requireAuth={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Composant pour les routes nécessitant une approbation
 */
export const ApprovedRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      requireAuth={true}
      requireApproval={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

/**
 * Composant pour les routes nécessitant une vérification email
 */
export const VerifiedRoute = ({ children, ...props }) => {
  return (
    <ProtectedRoute
      requireAuth={true}
      requireEmailVerification={true}
      {...props}
    >
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
