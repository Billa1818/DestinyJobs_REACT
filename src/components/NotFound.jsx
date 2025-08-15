import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = ({ 
  title = "Page non trouvée", 
  message = "La page que vous recherchez n'existe pas ou a été déplacée.",
  showBackButton = true,
  showHomeButton = true,
  customActions = null 
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icône */}
        <div className="mx-auto h-24 w-24 text-gray-400">
          <i className="fas fa-exclamation-triangle text-6xl"></i>
        </div>

        {/* Titre et message */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {message}
          </p>
        </div>

        {/* Code d'erreur */}
        <div className="bg-gray-100 rounded-lg p-4 mb-8">
          <span className="text-6xl font-bold text-gray-400">404</span>
        </div>

        {/* Actions personnalisées ou par défaut */}
        {customActions ? (
          customActions
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showBackButton && (
              <button
                onClick={handleGoBack}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-colors duration-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Retour
              </button>
            )}
            
            {showHomeButton && (
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-colors duration-200"
              >
                <i className="fas fa-home mr-2"></i>
                Accueil
              </Link>
            )}
          </div>
        )}

        {/* Liens utiles */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Liens utiles :</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/jobs"
              className="text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
            >
              Offres d'emploi
            </Link>
            <Link
              to="/consultations"
              className="text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
            >
              Consultations
            </Link>
            <Link
              to="/financements"
              className="text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
            >
              Financements
            </Link>
            <Link
              to="/bourses"
              className="text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
            >
              Bourses
            </Link>
            <Link
              to="/blog"
              className="text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 