import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 text-gray-400">
            <i className="fas fa-exclamation-triangle text-8xl"></i>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page non trouvée
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Désolé, la page que vous recherchez n'existe pas ou n'est pas accessible.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Cette erreur peut survenir si :
          </p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• L'URL est incorrecte</li>
            <li>• La page a été supprimée</li>
            <li>• Vous n'avez pas les permissions nécessaires</li>
            <li>• La ressource n'existe plus</li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
          >
            <i className="fas fa-home mr-2"></i>
            Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Retour en arrière
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Si vous pensez qu'il s'agit d'une erreur, contactez notre support.
          </p>
          <Link
            to="/contact"
            className="text-xs text-fuchsia-600 hover:text-fuchsia-500"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 