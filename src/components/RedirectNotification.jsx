import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RedirectNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur vient d'être redirigé
    const searchParams = new URLSearchParams(location.search);
    const redirected = searchParams.get('redirected');
    const reason = searchParams.get('reason');

    if (redirected === 'true') {
      setShowNotification(true);
      
      switch (reason) {
        case 'not_authenticated':
          setMessage('Vous devez être connecté pour accéder à cette page.');
          break;
        case 'wrong_user_type':
          setMessage('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
          break;
        default:
          setMessage('Vous avez été redirigé vers la page d\'accueil.');
      }

      // Masquer la notification après 5 secondes
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg max-w-md">
        <div className="flex items-center">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectNotification; 