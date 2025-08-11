import React from 'react';
import { Link } from 'react-router-dom';

const TestPublicProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <i className="fas fa-check text-green-600 text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Test des Routes Publiques
          </h1>
          <p className="text-gray-600 mb-6">
            Cette page confirme que les routes publiques fonctionnent correctement.
          </p>
          
          <div className="space-y-3">
            <Link 
              to="/profiles"
              className="block w-full bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-users mr-2"></i>
              Voir l'index des profils
            </Link>
            
            <Link 
              to="/profile/candidat/test-user-123"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <i className="fas fa-user-graduate mr-2"></i>
              Test profil candidat
            </Link>
            
            <Link 
              to="/api-test"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            >
              <i className="fas fa-vial mr-2"></i>
              Test de l'API
            </Link>
            
            <Link 
              to="/"
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              <i className="fas fa-home mr-2"></i>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPublicProfile; 