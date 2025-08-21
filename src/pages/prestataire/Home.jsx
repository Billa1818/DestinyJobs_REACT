import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PrestataireHome = () => {
  const [stats] = useState({
    candidatures: 12,
    offresConsultees: 45,
    favoris: 8,
    revenus: '2.5M FCFA'
  });

  const [recentApplications] = useState([
    {
      id: 1,
      title: 'Développement d\'application mobile',
      client: 'TechStart Bénin',
      status: 'En attente',
      date: 'Il y a 2 jours',
      montant: '500K FCFA'
    },
    {
      id: 2,
      title: 'Formation en marketing digital',
      client: 'Digital Academy',
      status: 'Acceptée',
      date: 'Il y a 1 semaine',
      montant: '800K FCFA'
    },
    {
      id: 3,
      title: 'Consultation en stratégie',
      client: 'InnovCorp',
      status: 'En cours',
      date: 'Il y a 3 jours',
      montant: '1.2M FCFA'
    }
  ]);

  const [upcomingProjects] = useState([
    {
      id: 1,
      title: 'Audit de sécurité informatique',
      client: 'Banque du Bénin',
      date: '15 Jan 2024',
      status: 'Confirmé'
    },
    {
      id: 2,
      title: 'Formation équipe commerciale',
      client: 'Retail Plus',
      date: '20 Jan 2024',
      status: 'En négociation'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Bienvenue, Marie Prestataire</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200">
              <i className="fas fa-plus mr-2"></i>Nouveau service
            </button>
            <button className="border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition duration-200">
              <i className="fas fa-search mr-2"></i>Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="fas fa-paper-plane text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Candidatures</p>
              <p className="text-2xl font-bold text-gray-900">{stats.candidatures}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="fas fa-eye text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offres consultées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offresConsultees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <i className="fas fa-heart text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Favoris</p>
              <p className="text-2xl font-bold text-gray-900">{stats.favoris}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <i className="fas fa-money-bill-wave text-orange-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus 2024</p>
              <p className="text-2xl font-bold text-gray-900">{stats.revenus}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mes candidatures emploi</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{application.title}</h3>
                    <p className="text-sm text-gray-600">{application.client}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span>{application.date}</span>
                      <span className="text-orange-600 font-medium">{application.montant}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === 'Acceptée' ? 'bg-green-100 text-green-800' :
                      application.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                    <Link to={`/prestataire/candidature/${application.id}`} className="text-orange-600 hover:text-orange-700">
                      <i className="fas fa-external-link-alt"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/prestataire/candidatures" className="text-orange-600 hover:text-orange-700 font-medium">
                Voir toutes les candidatures →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Projects */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Projets à venir</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.client}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span><i className="fas fa-calendar mr-1"></i>{project.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Confirmé' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/prestataire/projets" className="text-orange-600 hover:text-orange-700 font-medium">
                Voir tous les projets →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/consultation" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <i className="fas fa-search text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Rechercher des consultations</h3>
              <p className="text-sm text-gray-600">Trouver de nouvelles opportunités</p>
            </div>
          </Link>

          <Link to="/prestataire/services" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <i className="fas fa-briefcase text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Gérer mon portfolio</h3>
              <p className="text-sm text-gray-600">Mettre à jour mes services</p>
            </div>
          </Link>

          <Link to="/prestataire/profile" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <i className="fas fa-user text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Mon profil</h3>
              <p className="text-sm text-gray-600">Modifier mes informations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrestataireHome; 