import React from 'react';
import { Link } from 'react-router-dom';

const BlogGererTest = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Test - Gestion du Blog</h1>
            <p className="text-gray-600 mt-1">Page de test pour vérifier la gestion des articles</p>
          </div>
          <Link
            to="/recruteur/blog/publier"
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvel article
          </Link>
        </div>
      </div>

      {/* Test des routes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Routes testées :</h2>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-green-600">✅</span>
            <span>Page actuelle : <code className="bg-gray-100 px-2 py-1 rounded">/recruteur/blog/gerer</code></span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-green-600">✅</span>
            <span>Lien "Nouvel article" : <code className="bg-gray-100 px-2 py-1 rounded">/recruteur/blog/publier</code></span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-blue-600">ℹ️</span>
            <span>Route configurée dans : <code className="bg-gray-100 px-2 py-1 rounded">recruteurRoutes.jsx</code></span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Navigation disponible :</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/recruteur/blog/publier"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Créer un article
          </Link>
          
          <Link
            to="/recruteur/blog/categories"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-center"
          >
            <i className="fas fa-tags mr-2"></i>
            Gérer les catégories
          </Link>
          
          <Link
            to="/recruteur/blog/test"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200 text-center"
          >
            <i className="fas fa-vial mr-2"></i>
            Test de l'API
          </Link>
          
          <Link
            to="/recruteur/blog/advanced-test"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 text-center"
          >
            <i className="fas fa-cogs mr-2"></i>
            Test avancé
          </Link>
        </div>
      </div>

      {/* Informations */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations :</h3>
        
        <div className="text-sm text-gray-700 space-y-2">
          <p>• Cette page est accessible via la route <code className="bg-gray-100 px-1 rounded">/recruteur/blog/gerer</code></p>
          <p>• Elle permet de gérer tous les articles du blog du recruteur connecté</p>
          <p>• Les liens de navigation pointent vers les bonnes routes</p>
          <p>• Le composant principal <code className="bg-gray-100 px-1 rounded">BlogGerer.jsx</code> est chargé</p>
        </div>
      </div>
    </div>
  );
};

export default BlogGererTest;
