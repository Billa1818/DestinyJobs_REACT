import React from 'react';

const BourseStats = ({ scholarships }) => {
  const stats = {
    total: scholarships.length,
    approved: scholarships.filter(s => s.status === 'APPROVED').length,
    pending: scholarships.filter(s => s.status === 'PENDING_APPROVAL').length,
    closed: scholarships.filter(s => s.status === 'CLOSED').length,
    expired: scholarships.filter(s => s.status === 'EXPIRED').length,
    rejected: scholarships.filter(s => s.status === 'REJECTED').length,
    totalViews: scholarships.reduce((sum, s) => sum + (s.views_count || 0), 0)
  };

  const statCards = [
    { title: 'Total des bourses', value: stats.total, icon: 'fas fa-graduation-cap', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Approuvées', value: stats.approved, icon: 'fas fa-thumbs-up', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'En attente', value: stats.pending, icon: 'fas fa-clock', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Refusées', value: stats.rejected, icon: 'fas fa-times-circle', color: 'text-red-600', bgColor: 'bg-red-50' },
    { title: 'Vues', value: stats.totalViews, icon: 'fas fa-eye', color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-50' },
    { title: 'Expirées', value: stats.expired, icon: 'fas fa-calendar-times', color: 'text-red-600', bgColor: 'bg-red-50' },
    { title: 'Fermées', value: stats.closed, icon: 'fas fa-lock', color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
        Statistiques de vos bourses
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
              {stats.approved > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approuvées</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(stats.approved / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.approved}</span>
                  </div>
                </div>
              )}
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
              {stats.rejected > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Refusées</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.rejected}</span>
                  </div>
                </div>
              )}
              {stats.expired > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expirées</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(stats.expired / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.expired}</span>
                  </div>
                </div>
              )}
              {stats.closed > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fermées</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-gray-500 h-2 rounded-full" 
                        style={{ width: `${(stats.closed / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.closed}</span>
                  </div>
                </div>
              )}
              </div>
              </div>
    
          <div>
             <h3 className="text-sm font-medium text-gray-700 mb-3">Métriques supplémentaires</h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-sm text-gray-600">Total des vues</span>
                 <span className="text-sm font-medium text-gray-900">{stats.totalViews}</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-info-circle text-blue-600 mr-3 mt-1"></i>
          <div>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Résumé :</strong> Vous avez créé {stats.total} bourse{stats.total > 1 ? 's' : ''} au total.
            </p>
            {stats.expired > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                  <span className="text-sm text-red-800 font-medium">
                    🚨 {stats.expired} bourse{stats.expired > 1 ? 's' : ''} expirée{stats.expired > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BourseStats; 