import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StatGeneral = () => {
  const [period, setPeriod] = useState('1A');

  const stats = [
    {
      title: 'Offres actives',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: 'fas fa-briefcase',
      color: 'blue'
    },
    {
      title: 'Candidatures reçues',
      value: '342',
      change: '+8%',
      changeType: 'positive',
      icon: 'fas fa-users',
      color: 'green'
    },
    {
      title: 'Taux de conversion',
      value: '12.5%',
      change: '-2%',
      changeType: 'negative',
      icon: 'fas fa-chart-line',
      color: 'fuchsia'
    },
    {
      title: 'Embauches ce mois',
      value: '8',
      change: '+25%',
      changeType: 'positive',
      icon: 'fas fa-handshake',
      color: 'orange'
    }
  ];

  const monthlyData = [
    { month: 'Jan', candidatures: 45, embauches: 3 },
    { month: 'Fév', candidatures: 52, embauches: 4 },
    { month: 'Mar', candidatures: 38, embauches: 2 },
    { month: 'Avr', candidatures: 61, embauches: 5 },
    { month: 'Mai', candidatures: 48, embauches: 3 },
    { month: 'Juin', candidatures: 67, embauches: 6 },
    { month: 'Juil', candidatures: 55, embauches: 4 },
    { month: 'Août', candidatures: 72, embauches: 7 },
    { month: 'Sep', candidatures: 58, embauches: 5 },
    { month: 'Oct', candidatures: 65, embauches: 6 },
    { month: 'Nov', candidatures: 78, embauches: 8 },
    { month: 'Déc', candidatures: 85, embauches: 9 }
  ];

  const topOffres = [
    { titre: 'Développeur Full Stack', candidatures: 45, vues: 234, conversion: '19.2%' },
    { titre: 'Chef de projet IT', candidatures: 32, vues: 189, conversion: '16.9%' },
    { titre: 'Marketing Manager', candidatures: 28, vues: 156, conversion: '17.9%' },
    { titre: 'Designer UI/UX', candidatures: 25, vues: 142, conversion: '17.6%' },
    { titre: 'Data Analyst', candidatures: 22, vues: 128, conversion: '17.2%' }
  ];

  const recentActivity = [
    { action: 'Nouvelle candidature', detail: 'Développeur Full Stack', time: 'Il y a 2h', type: 'candidature' },
    { action: 'Entretien programmé', detail: 'Chef de projet IT', time: 'Il y a 4h', type: 'entretien' },
    { action: 'Offre publiée', detail: 'Data Scientist', time: 'Il y a 6h', type: 'offre' },
    { action: 'Embauche confirmée', detail: 'Marketing Manager', time: 'Il y a 1j', type: 'embauche' },
    { action: 'Candidature rejetée', detail: 'Designer UI/UX', time: 'Il y a 1j', type: 'rejet' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'candidature': return 'fas fa-user-plus text-blue-600';
      case 'entretien': return 'fas fa-calendar-check text-green-600';
      case 'offre': return 'fas fa-plus text-fuchsia-600';
      case 'embauche': return 'fas fa-handshake text-orange-600';
      case 'rejet': return 'fas fa-times text-red-600';
      default: return 'fas fa-info text-gray-600';
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case 'candidature': return 'bg-blue-50';
      case 'entretien': return 'bg-green-50';
      case 'offre': return 'bg-fuchsia-50';
      case 'embauche': return 'bg-orange-50';
      case 'rejet': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const maxCandidatures = Math.max(...monthlyData.map(d => d.candidatures));
  const maxEmbauches = Math.max(...monthlyData.map(d => d.embauches));

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tableau de bord entreprise</h1>
            <p className="text-gray-600">Suivez les performances de vos offres d'emploi et recrutements</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Link 
              to="/recruteur/creer-offre"
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i>Nouvelle offre
            </Link>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center">
              <i className="fas fa-download mr-2"></i>Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 flex items-center ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  <i className={`fas fa-arrow-${stat.changeType === 'positive' ? 'up' : 'down'} mr-1`}></i>
                  {stat.change} ce mois
                </p>
              </div>
              <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-${stat.color}-600 text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Candidatures par mois */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Candidatures par mois</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPeriod('6M')}
                className={`text-xs px-2 py-1 rounded ${period === '6M' ? 'bg-fuchsia-600 text-white' : 'text-gray-500 hover:text-fuchsia-600'}`}
              >
                6M
              </button>
              <button 
                onClick={() => setPeriod('1A')}
                className={`text-xs px-2 py-1 rounded ${period === '1A' ? 'bg-fuchsia-600 text-white' : 'text-gray-500 hover:text-fuchsia-600'}`}
              >
                1A
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.slice(period === '6M' ? 6 : 0).map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-200 rounded-t mb-2 relative">
                  <div 
                    className="bg-fuchsia-600 rounded-t transition-all duration-500"
                    style={{ height: `${(data.candidatures / maxCandidatures) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Total: {monthlyData.slice(period === '6M' ? 6 : 0).reduce((sum, d) => sum + d.candidatures, 0)} candidatures</p>
          </div>
        </div>

        {/* Embauches par mois */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Embauches par mois</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPeriod('6M')}
                className={`text-xs px-2 py-1 rounded ${period === '6M' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-600'}`}
              >
                6M
              </button>
              <button 
                onClick={() => setPeriod('1A')}
                className={`text-xs px-2 py-1 rounded ${period === '1A' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-600'}`}
              >
                1A
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.slice(period === '6M' ? 6 : 0).map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-200 rounded-t mb-2 relative">
                  <div 
                    className="bg-green-600 rounded-t transition-all duration-500"
                    style={{ height: `${(data.embauches / maxEmbauches) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Total: {monthlyData.slice(period === '6M' ? 6 : 0).reduce((sum, d) => sum + d.embauches, 0)} embauches</p>
          </div>
        </div>
      </div>

      {/* Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Top Offres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 des offres</h3>
          <div className="space-y-4">
            {topOffres.map((offre, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{offre.titre}</h4>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{offre.candidatures} candidatures</span>
                    <span className="text-sm text-gray-600">{offre.vues} vues</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-fuchsia-600">{offre.conversion}</span>
                  <p className="text-xs text-gray-500">Taux de conversion</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${getActivityBg(activity.type)}`}>
                <div className="flex-shrink-0">
                  <i className={`${getActivityIcon(activity.type)} mt-1`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/recruteur/creer-offre"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-plus text-fuchsia-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Créer une offre</h4>
              <p className="text-sm text-gray-500">Publier une nouvelle offre</p>
            </div>
          </Link>
          
          <Link 
            to="/recruteur/candidatures"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-users text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Voir candidatures</h4>
              <p className="text-sm text-gray-500">Gérer les candidatures</p>
            </div>
          </Link>
          
          <Link 
            to="/recruteur/gestion-offres"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-briefcase text-green-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Gérer les offres</h4>
              <p className="text-sm text-gray-500">Modifier ou supprimer</p>
            </div>
          </Link>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-download text-purple-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Exporter rapport</h4>
              <p className="text-sm text-gray-500">Télécharger les données</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatGeneral;
