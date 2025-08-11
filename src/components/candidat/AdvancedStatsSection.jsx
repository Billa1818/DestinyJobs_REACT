import React, { useState, useEffect } from 'react';

const AdvancedStatsSection = () => {
  const [stats, setStats] = useState({
    profileViews: {
      total: 1247,
      monthly: [89, 134, 156, 178, 203, 189, 234, 267, 289, 312, 298, 345],
      weekly: [45, 67, 78, 89, 92, 85, 98, 112, 105, 118, 125, 134, 142, 156],
      sources: [
        { name: 'Recruteurs directs', value: 45, color: 'bg-blue-500' },
        { name: 'Recherche plateforme', value: 30, color: 'bg-green-500' },
        { name: 'Réseaux sociaux', value: 15, color: 'bg-purple-500' },
        { name: 'Autres', value: 10, color: 'bg-gray-500' }
      ]
    },
    applications: {
      total: 89,
      status: [
        { name: 'En attente', value: 23, color: 'bg-yellow-500' },
        { name: 'En cours', value: 34, color: 'bg-blue-500' },
        { name: 'Acceptées', value: 18, color: 'bg-green-500' },
        { name: 'Refusées', value: 14, color: 'bg-red-500' }
      ],
      monthly: [12, 15, 18, 22, 19, 25, 28, 31, 26, 29, 32, 35],
      responseRate: 78.5
    },
    skills: {
      endorsed: 67,
      total: 89,
      topSkills: [
        { name: 'React.js', endorsements: 45, level: 'Expert', trend: 'up' },
        { name: 'Node.js', endorsements: 38, level: 'Avancé', trend: 'up' },
        { name: 'Python', endorsements: 32, level: 'Intermédiaire', trend: 'stable' },
        { name: 'AWS', endorsements: 28, level: 'Avancé', trend: 'up' },
        { name: 'Docker', endorsements: 25, level: 'Intermédiaire', trend: 'up' }
      ],
      growthRate: 12.5
    },
    networking: {
      connections: 234,
      newConnections: 18,
      recommendations: 12,
      endorsements: 156,
      profileCompleteness: 87
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('profileViews');

  const periods = [
    { value: 'weekly', label: '7 jours', days: 7 },
    { value: 'monthly', label: '12 mois', days: 365 },
    { value: 'quarterly', label: '4 trimestres', days: 365 }
  ];

  const metrics = [
    { value: 'profileViews', label: 'Vues du profil', icon: 'fas fa-eye' },
    { value: 'applications', label: 'Candidatures', icon: 'fas fa-file-alt' },
    { value: 'skills', label: 'Compétences', icon: 'fas fa-code' },
    { value: 'networking', label: 'Réseau', icon: 'fas fa-network-wired' }
  ];

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'profileViews':
        return selectedPeriod === 'weekly' ? stats.profileViews.weekly : stats.profileViews.monthly;
      case 'applications':
        return stats.applications.monthly;
      default:
        return [];
    }
  };

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'profileViews':
        return 'text-blue-600';
      case 'applications':
        return 'text-green-600';
      case 'skills':
        return 'text-purple-600';
      case 'networking':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMetricBgColor = (metric) => {
    switch (metric) {
      case 'profileViews':
        return 'bg-blue-50';
      case 'applications':
        return 'bg-green-50';
      case 'skills':
        return 'bg-purple-50';
      case 'networking':
        return 'bg-orange-50';
      default:
        return 'bg-gray-50';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return 'fas fa-arrow-up text-green-500';
    if (growth < 0) return 'fas fa-arrow-down text-red-500';
    return 'fas fa-minus text-gray-500';
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
          Statistiques avancées
        </h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-sm"
          >
            {metrics.map(metric => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
          
          <div className="flex border border-gray-300 rounded-lg">
            {periods.map((period, index) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-2 text-sm font-medium transition duration-200 ${
                  selectedPeriod === period.value
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${index === 0 ? 'rounded-l-lg' : ''} ${index === periods.length - 1 ? 'rounded-r-lg' : ''}`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Vues du profil</p>
              <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.profileViews.total)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <i className="fas fa-eye text-blue-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <i className={getGrowthIcon(12.5)}></i>
            <span className={`ml-1 ${getGrowthColor(12.5)}`}>+12.5% ce mois</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Candidatures</p>
              <p className="text-2xl font-bold text-green-900">{stats.applications.total}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <i className="fas fa-file-alt text-green-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <i className={getGrowthIcon(8.2)}></i>
            <span className={`ml-1 ${getGrowthColor(8.2)}`}>+8.2% ce mois</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Compétences validées</p>
              <p className="text-2xl font-bold text-purple-900">{stats.skills.endorsed}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <i className="fas fa-code text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <i className={getGrowthIcon(stats.skills.growthRate)}></i>
            <span className={`ml-1 ${getGrowthColor(stats.skills.growthRate)}`}>
              +{stats.skills.growthRate}% ce mois
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Connexions</p>
              <p className="text-2xl font-bold text-orange-900">{stats.networking.connections}</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <i className="fas fa-network-wired text-orange-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <i className={getGrowthIcon(15.3)}></i>
            <span className={`ml-1 ${getGrowthColor(15.3)}`}>+15.3% ce mois</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Évolution des {metrics.find(m => m.value === selectedMetric)?.label.toLowerCase()}
          </h4>
          
          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {getMetricData().map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t">
                  <div 
                    className={`${getMetricBgColor(selectedMetric)} rounded-t transition-all duration-300`}
                    style={{ 
                      height: `${(value / Math.max(...getMetricData())) * 200}px`,
                      backgroundColor: selectedMetric === 'profileViews' ? '#3B82F6' : 
                                   selectedMetric === 'applications' ? '#10B981' : 
                                   selectedMetric === 'skills' ? '#8B5CF6' : '#F97316'
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Views Sources */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Sources des vues du profil</h4>
          <div className="space-y-3">
            {stats.profileViews.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                  <span className="text-sm text-gray-700">{source.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{source.value}%</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total des vues</span>
              <span className="font-medium text-gray-900">{formatNumber(stats.profileViews.total)}</span>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Statut des candidatures</h4>
          <div className="space-y-3">
            {stats.applications.status.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                  <span className="text-sm text-gray-700">{status.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{status.value}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Taux de réponse</span>
              <span className="font-medium text-green-600">{stats.applications.responseRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Skills */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Top compétences validées</h4>
        <div className="space-y-3">
          {stats.skills.topSkills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                  <span className="text-fuchsia-600 font-medium text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{skill.name}</p>
                  <p className="text-sm text-gray-600">{skill.level}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{skill.endorsements} validations</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  skill.trend === 'up' ? 'bg-green-100 text-green-800' :
                  skill.trend === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <i className={`fas fa-arrow-${skill.trend} mr-1`}></i>
                  {skill.trend === 'up' ? 'En hausse' : skill.trend === 'down' ? 'En baisse' : 'Stable'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Completeness */}
      <div className="mt-6 bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg p-4 border border-fuchsia-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-fuchsia-900">Complétude du profil</h4>
          <span className="text-2xl font-bold text-fuchsia-600">{stats.networking.profileCompleteness}%</span>
        </div>
        
        <div className="w-full bg-fuchsia-200 rounded-full h-3">
          <div 
            className="bg-fuchsia-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.networking.profileCompleteness}%` }}
          ></div>
        </div>
        
        <div className="mt-3 text-sm text-fuchsia-700">
          {stats.networking.profileCompleteness < 100 
            ? `Complétez votre profil pour augmenter vos chances d'être remarqué par les recruteurs`
            : 'Félicitations ! Votre profil est complet et optimisé'
          }
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-chart-pie text-blue-500 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Insights de vos statistiques</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Vos vues de profil ont augmenté de 12.5% ce mois - continuez à optimiser votre profil</li>
              <li>• Votre taux de réponse aux candidatures est de 78.5% - excellent !</li>
              <li>• Vous avez 67 compétences validées sur 89 - demandez plus de validations</li>
              <li>• Votre réseau de 234 connexions vous donne une bonne visibilité</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStatsSection; 