import React from 'react';
import { Link } from 'react-router-dom';

const TestRouting = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test du Système de Routage Décentralisé
          </h1>
          <p className="text-lg text-gray-600">
            Testez les différents headers selon les types d'utilisateurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Candidat */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-fuchsia-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user text-2xl text-fuchsia-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidat</h2>
              <p className="text-gray-600">Interface pour les candidats avec header spécialisé</p>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/candidat" 
                className="block w-full bg-fuchsia-600 text-white text-center py-3 rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Tableau de bord
              </Link>
              <Link 
                to="/candidat/profil" 
                className="block w-full bg-fuchsia-100 text-fuchsia-700 text-center py-3 rounded-md hover:bg-fuchsia-200 transition duration-200"
              >
                <i className="fas fa-user mr-2"></i>
                Mon Profil
              </Link>
              <Link 
                to="/candidat/candidatures" 
                className="block w-full bg-fuchsia-100 text-fuchsia-700 text-center py-3 rounded-md hover:bg-fuchsia-200 transition duration-200"
              >
                <i className="fas fa-file-alt mr-2"></i>
                Mes Candidatures
              </Link>
            </div>

            <div className="mt-6 p-4 bg-fuchsia-50 rounded-md">
              <h3 className="font-semibold text-fuchsia-800 mb-2">Fonctionnalités:</h3>
              <ul className="text-sm text-fuchsia-700 space-y-1">
                <li>• Header couleur fuchsia</li>
                <li>• Navigation spécialisée candidat</li>
                <li>• Sidebar avec recherche d'emploi</li>
                <li>• Statistiques personnalisées</li>
              </ul>
            </div>
          </div>

          {/* Prestataire */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-briefcase text-2xl text-orange-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Prestataire</h2>
              <p className="text-gray-600">Interface pour les prestataires de services</p>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/prestataire" 
                className="block w-full bg-orange-600 text-white text-center py-3 rounded-md hover:bg-orange-700 transition duration-200"
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Tableau de bord
              </Link>
              <Link 
                to="/prestataire/services" 
                className="block w-full bg-orange-100 text-orange-700 text-center py-3 rounded-md hover:bg-orange-200 transition duration-200"
              >
                <i className="fas fa-briefcase mr-2"></i>
                Mon Portfolio
              </Link>
              <Link 
                to="/prestataire/demandes" 
                className="block w-full bg-orange-100 text-orange-700 text-center py-3 rounded-md hover:bg-orange-200 transition duration-200"
              >
                <i className="fas fa-handshake mr-2"></i>
                Mes Demandes
              </Link>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-md">
              <h3 className="font-semibold text-orange-800 mb-2">Fonctionnalités:</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Header couleur orange</li>
                <li>• Navigation consultations</li>
                <li>• Sidebar portfolio</li>
                <li>• Gestion des services</li>
              </ul>
            </div>
          </div>

          {/* Recruteur */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-fuchsia-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-building text-2xl text-fuchsia-600"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recruteur</h2>
              <p className="text-gray-600">Interface pour les recruteurs et entreprises</p>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/recruteur" 
                className="block w-full bg-fuchsia-600 text-white text-center py-3 rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Tableau de bord
              </Link>
              <Link 
                to="/recruteur/creer-offre" 
                className="block w-full bg-fuchsia-100 text-fuchsia-700 text-center py-3 rounded-md hover:bg-fuchsia-200 transition duration-200"
              >
                <i className="fas fa-plus mr-2"></i>
                Créer une Offre
              </Link>
              <Link 
                to="/recruteur/candidatures" 
                className="block w-full bg-fuchsia-100 text-fuchsia-700 text-center py-3 rounded-md hover:bg-fuchsia-200 transition duration-200"
              >
                <i className="fas fa-users mr-2"></i>
                Candidatures Reçues
              </Link>
            </div>

            <div className="mt-6 p-4 bg-fuchsia-50 rounded-md">
              <h3 className="font-semibold text-fuchsia-800 mb-2">Fonctionnalités:</h3>
              <ul className="text-sm text-fuchsia-700 space-y-1">
                <li>• Header couleur fuchsia</li>
                <li>• Navigation création d'offres</li>
                <li>• Sidebar actions rapides</li>
                <li>• Statistiques recrutement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <i className="fas fa-info-circle text-blue-500 mr-2"></i>
            Instructions de Test
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Objectifs du Test</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Vérifier que chaque route affiche le bon header</li>
                <li>• Tester la navigation mobile et desktop</li>
                <li>• Valider les couleurs spécifiques à chaque type d'utilisateur</li>
                <li>• Confirmer le bon fonctionnement des menus déroulants</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 Points à Vérifier</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Responsivité sur mobile et desktop</li>
                <li>• Animations des menus mobiles</li>
                <li>• Cohérence des couleurs (fuchsia/orange)</li>
                <li>• Fonctionnement des sidebars spécialisées</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800 text-center">
              <i className="fas fa-lightbulb mr-2"></i>
              <strong>Astuce:</strong> Utilisez les outils de développement pour tester différentes tailles d'écran et vérifier la responsivité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRouting;
