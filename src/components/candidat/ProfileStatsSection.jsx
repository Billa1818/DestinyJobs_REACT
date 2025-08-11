import React, { useState } from 'react';

const ProfileStatsSection = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [stats] = useState({
    profileViews: {
      total: 156,
      monthly: [12, 19, 15, 25, 22, 30, 28, 35, 42, 38, 45, 48],
      trend: '+12%'
    },
    applications: {
      total: 23,
      sent: 23,
      viewed: 18,
      shortlisted: 8,
      interviewed: 5,
      offered: 2,
      accepted: 1
    },
    skills: {
      total: 24,
      endorsed: 18,
      pending: 6
    },
    recommendations: {
      total: 7,
      verified: 5,
      pending: 2
    }
  });

  const timeRanges = [
    { value: 'week', label: '7 jours' },
    { value: 'month', label: '30 jours' },
    { value: 'quarter', label: '3 mois' },
    { value: 'year', label: '12 mois' }
  ];

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendColor = (trend) => {
    return trend.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  const renderMiniChart = (data) => {
    const max = Math.max(...data);
    return (
      <div className="flex items-end space-x-1 h-12">
        {data.slice(-7).map((value, index) => (
          <div
            key={index}
            className="bg-fuchsia-200 rounded-t"
            style={{
              width: '8px',
              height: `${(value / max) * 100}%`,
              minHeight: '4px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
          Statistiques détaillées
        </h3>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1 text-sm rounded-lg transition duration-200 ${
                timeRange === range.value
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Views */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Vues du profil</h4>
            <span className={`text-sm font-medium ${getTrendColor(stats.profileViews.trend)}`}>
              {stats.profileViews.trend}
            </span>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.profileViews.total}</div>
              <div className="text-sm text-gray-500">Total des vues</div>
            </div>
            <div className="flex-1 ml-4">
              {renderMiniChart(stats.profileViews.monthly)}
            </div>
          </div>
        </div>

        {/* Applications Pipeline */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Pipeline des candidatures</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Envoyées</span>
              <span className="font-medium">{stats.applications.sent}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vues par recruteur</span>
              <span className="font-medium">{stats.applications.viewed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pré-sélectionnées</span>
              <span className="font-medium">{stats.applications.shortlisted}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Entretiens</span>
              <span className="font-medium">{stats.applications.interviewed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Offres reçues</span>
              <span className="font-medium">{stats.applications.offered}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Acceptées</span>
              <span className="font-medium">{stats.applications.accepted}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Taux de conversion</span>
              <span>{Math.round((stats.applications.accepted / stats.applications.sent) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor((stats.applications.accepted / stats.applications.sent) * 100)}`}
                style={{ width: `${(stats.applications.accepted / stats.applications.sent) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills and Endorsements */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-fuchsia-600">{stats.skills.total}</div>
            <div className="text-sm text-gray-500">Compétences</div>
            <div className="mt-2 text-xs text-gray-400">
              {stats.skills.endorsed} validées, {stats.skills.pending} en attente
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.recommendations.total}</div>
            <div className="text-sm text-gray-500">Recommandations</div>
            <div className="mt-2 text-xs text-gray-400">
              {stats.recommendations.verified} vérifiées, {stats.recommendations.pending} en attente
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-gray-500">Complétude du profil</div>
            <div className="mt-2 text-xs text-gray-400">
              Profil presque complet
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Actions rapides</h4>
        <div className="flex flex-wrap gap-2">
          <button className="bg-fuchsia-100 text-fuchsia-800 px-3 py-2 rounded-lg text-sm hover:bg-fuchsia-200 transition duration-200">
            <i className="fas fa-eye mr-2"></i>Voir le profil public
          </button>
          <button className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition duration-200">
            <i className="fas fa-download mr-2"></i>Exporter les statistiques
          </button>
          <button className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition duration-200">
            <i className="fas fa-share mr-2"></i>Partager les résultats
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatsSection; 