import React from 'react';
import { Link } from 'react-router-dom';
import CandidateProfileSection from '../../components/candidat/CandidateProfileSection';

const Profil = () => {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                <p className="text-gray-600 mt-1">Gérez votre profil professionnel et vos informations</p>
              </div>
              <Link 
                to="/candidat/parametre"
                className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-edit mr-2"></i>
                Modifier
              </Link>
            </div>
          </div>

          {/* Profile Section */}
          <CandidateProfileSection />
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link to="/candidat/parametre" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-edit text-fuchsia-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Modifier le profil</h4>
                  <p className="text-xs text-gray-500">Mettre à jour mes informations</p>
              </div>
              </Link>
              
              <Link to="/candidat/offre" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-search text-blue-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Rechercher des offres</h4>
                  <p className="text-xs text-gray-500">Trouver des opportunités</p>
              </div>
              </Link>
              
              <Link to="/candidat/candidature-recente" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-file-alt text-green-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Mes candidatures</h4>
                  <p className="text-xs text-gray-500">Suivre mes postulations</p>
              </div>
              </Link>
            </div>
          </div>

          {/* Profile Tips */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb mr-2 text-yellow-600"></i>
              Conseils pour votre profil
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <p>Complétez votre profil à 100% pour augmenter votre visibilité</p>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <p>Ajoutez une photo professionnelle pour personnaliser votre profil</p>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <p>Mettez à jour régulièrement vos compétences et technologies</p>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <p>Décrivez clairement votre expérience et vos réalisations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profil;
