import React from 'react';

const CandidatureStats = ({ candidatures }) => {
  const stats = {
    total: candidatures.length,
    pending: candidatures.filter(c => c.statut === 'pending').length,
    viewed: candidatures.filter(c => c.statut === 'viewed').length,
    shortlisted: candidatures.filter(c => c.statut === 'shortlisted').length,
    rejected: candidatures.filter(c => c.statut === 'rejected').length,
    interview: candidatures.filter(c => c.statut === 'interview').length,
    accepted: candidatures.filter(c => c.statut === 'accepted').length,
    highPriority: candidatures.filter(c => c.apiData?.priority === 'HIGH').length,
    withCV: candidatures.filter(c => c.cv).length,
    withLetter: candidatures.filter(c => c.lettre).length
  };

  const statCards = [
    { 
      title: 'Total des candidatures', 
      value: stats.total, 
      icon: 'fas fa-users', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    },
    { 
      title: 'En attente', 
      value: stats.pending, 
      icon: 'fas fa-clock', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50' 
    },
    { 
      title: 'Sélectionnées', 
      value: stats.shortlisted, 
      icon: 'fas fa-star', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50' 
    },
    { 
      title: 'Entretiens', 
      value: stats.interview, 
      icon: 'fas fa-handshake', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50' 
    },
    { 
      title: 'Acceptées', 
      value: stats.accepted, 
      icon: 'fas fa-check-circle', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50' 
    },
    { 
      title: 'Haute priorité', 
      value: stats.highPriority, 
      icon: 'fas fa-exclamation-triangle', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50' 
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
        Statistiques des candidatures
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <i className={`${stat.icon} ${stat.color} text-xl`}></i>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Répartition par statut</h3>
            <div className="space-y-2">
              {stats.pending > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">En attente</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.pending}</span>
                  </div>
                </div>
              )}
              {stats.shortlisted > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sélectionnées</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(stats.shortlisted / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.shortlisted}</span>
                  </div>
                </div>
              )}
              {stats.interview > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Entretiens</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${(stats.interview / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.interview}</span>
                  </div>
                </div>
              )}
              {stats.accepted > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Acceptées</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${(stats.accepted / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.accepted}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Documents fournis</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avec CV</span>
                <span className="text-sm font-medium text-gray-900">{stats.withCV}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avec lettre</span>
                <span className="text-sm font-medium text-gray-900">{stats.withLetter}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatureStats; 