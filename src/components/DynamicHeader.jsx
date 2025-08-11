import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PublicHeader from './headers/PublicHeader';
import CandidatHeader from './headers/CandidatHeader';
import RecruteurHeader from './headers/RecruteurHeader';
import PrestataireHeader from './headers/PrestataireHeader';

const DynamicHeader = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Si en cours de chargement, afficher un header temporaire ou rien
  if (loading) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </header>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher le header public
  if (!isAuthenticated || !user) {
    return <PublicHeader />;
  }

  // Selon le type d'utilisateur, afficher le header approprié
  const userType = user.user_type?.toLowerCase();

  switch (userType) {
    case 'candidat':
      return <CandidatHeader />;
    case 'recruteur':
      return <RecruteurHeader />;
    case 'prestataire':
      return <PrestataireHeader />;
    default:
      // Si le type n'est pas reconnu, afficher le header public
      console.warn('Type d\'utilisateur non reconnu:', userType);
      return <PublicHeader />;
  }
};

export default DynamicHeader; 