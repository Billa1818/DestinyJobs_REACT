import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: 'Offres publiées',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: 'fas fa-briefcase',
      color: 'fuchsia'
    },
    {
      title: 'Candidatures reçues',
      value: '89',
      change: '+15',
      changeType: 'positive',
      icon: 'fas fa-users',
      color: 'green'
    },
    {
      title: 'Entretiens planifiés',
      value: '15',
      change: '+3',
      changeType: 'positive',
      icon: 'fas fa-calendar-check',
      color: 'blue'
    },
    {
      title: 'Embauches réalisées',
      value: '8',
      change: '+1',
      changeType: 'positive',
      icon: 'fas fa-user-check',
      color: 'purple'
    }
  ];

  const recentOffers = [
    {
      id: 1,
      title: 'Développeur Full Stack Senior',
      status: 'active',
      applications: 15,
      date: '2024-01-15',
      location: 'Cotonou'
    },
    {
      id: 2,
      title: 'Chef de projet IT',
      status: 'pending',
      applications: 0,
      date: '2024-01-14',
      location: 'Porto-Novo'
    },
    {
      id: 3,
      title: 'Marketing Manager',
      status: 'active',
      applications: 8,
      date: '2024-01-12',
      location: 'Cotonou'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      candidate: 'Amina Kone',
      position: 'Développeur Full Stack Senior',
      status: 'new',
      date: '2024-01-15',
      avatar: 'AK'
    },
    {
      id: 2,
      candidate: 'Marc Dossou',
      position: 'Développeur Full Stack Senior',
      status: 'reviewed',
      date: '2024-01-14',
      avatar: 'MD'
    },
    {
      id: 3,
      candidate: 'Fatou Diallo',
      position: 'Marketing Manager',
      status: 'interviewed',
      date: '2024-01-13',
      avatar: 'FD'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'reviewed': return 'text-purple-600 bg-purple-100';
      case 'interviewed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tableau de bord Recruteur</h1>
            <p className="text-gray-600">Bienvenue ! Gérez vos offres et candidatures</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/recruteur/creer-offre"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer une offre
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} ce mois
                </p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-${stat.color}-600 text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Offers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
                Offres récentes
              </h2>
              <Link 
                to="/recruteur/gestion-offres"
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{offer.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{offer.location}</span>
                      <span className="text-sm text-gray-500">{offer.applications} candidatures</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.status)}`}>
                      {offer.status === 'active' ? 'Active' : offer.status === 'pending' ? 'En attente' : 'Fermée'}
                    </span>
                    <Link 
                      to={`/recruteur/postulations-offres/${offer.id}`}
                      className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-users mr-2 text-green-600"></i>
                Candidatures récentes
              </h2>
              <Link 
                to="/recruteur/candidatures"
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-fuchsia-600">{application.avatar}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{application.candidate}</h3>
                    <p className="text-sm text-gray-500 truncate">{application.position}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
                      {application.status === 'new' ? 'Nouvelle' : 
                       application.status === 'reviewed' ? 'Examinée' : 
                       application.status === 'interviewed' ? 'Entretien' : 'Rejetée'}
                    </span>
                    <Link 
                      to={`/recruteur/candidatures/${application.id}`}
                      className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-bolt mr-2 text-orange-600"></i>
            Actions rapides
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/recruteur/creer-offre"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-plus text-fuchsia-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Créer une offre</h3>
                <p className="text-sm text-gray-500">Publier une nouvelle offre</p>
              </div>
            </Link>
            
            <Link 
              to="/recruteur/candidatures"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-users text-green-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Candidatures</h3>
                <p className="text-sm text-gray-500">Gérer les candidatures</p>
              </div>
            </Link>
            
            <Link 
              to="/recruteur/statistiques"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-blue-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Statistiques</h3>
                <p className="text-sm text-gray-500">Voir les performances</p>
              </div>
            </Link>
            
            <Link 
              to="/recruteur/profil"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-cog text-purple-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Profil</h3>
                <p className="text-sm text-gray-500">Gérer le profil</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 