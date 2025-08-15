import React from 'react';

const FinancementStats = ({ fundings }) => {
  // Calculer les statistiques basées sur les données réellement disponibles dans l'API
  const stats = {
    total: fundings.length,
    published: fundings.filter(f => f.status === 'PUBLISHED').length,
    approved: fundings.filter(f => f.status === 'APPROVED').length,
    pending: fundings.filter(f => f.status === 'PENDING_APPROVAL').length,
    draft: fundings.filter(f => f.status === 'DRAFT').length,
    rejected: fundings.filter(f => f.status === 'REJECTED').length,
    expired: fundings.filter(f => f.status === 'EXPIRED').length,
    // Seulement les données disponibles dans l'API
    totalApplications: fundings.reduce((sum, f) => sum + (f.applications_count || 0), 0),
    totalViews: fundings.reduce((sum, f) => sum + (f.views_count || 0), 0),
    totalAmount: fundings.reduce((sum, f) => sum + (parseFloat(f.max_amount) || 0), 0),
    // Nouvelles statistiques pour les dates limites
    withDeadline: fundings.filter(f => f.application_deadline).length,
    deadlineSoon: fundings.filter(f => {
      if (!f.application_deadline) return false;
      const deadline = new Date(f.application_deadline);
      const now = new Date();
      const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0; // Dans les 30 prochains jours
    }).length,
    deadlineExpired: fundings.filter(f => {
      if (!f.application_deadline) return false;
      const deadline = new Date(f.application_deadline);
      const now = new Date();
      return deadline < now;
    }).length
  };

  const statCards = [
    {
      title: 'Total des financements',
      value: stats.total,
      icon: 'fas fa-hand-holding-usd',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Approuvés',
      value: stats.approved,
      icon: 'fas fa-thumbs-up',
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
      title: 'Refusés',
      value: stats.rejected,
      icon: 'fas fa-times-circle',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Candidatures',
      value: stats.totalApplications,
      icon: 'fas fa-users',
      color: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50'
    },
    {
      title: 'Limite proche (≤30j)',
      value: stats.deadlineSoon,
      icon: 'fas fa-exclamation-triangle',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Limite expirée',
      value: stats.deadlineExpired,
      icon: 'fas fa-calendar-times',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
        Statistiques de vos financements
      </h2>
      
      {/* Cartes principales avec dates limites intégrées */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 max-w-7xl mx-auto mb-6">
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

      {/* Statistiques détaillées */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Répartition par statut</h3>
            <div className="space-y-2">
              {stats.published > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Publiés</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(stats.published / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.published}</span>
                  </div>
                </div>
              )}
              {stats.approved > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approuvés</span>
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
                  <span className="text-sm text-gray-600">Refusés</span>
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
              {stats.deadlineExpired > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Limite expirée</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(stats.deadlineExpired / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.deadlineExpired}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Métriques des candidatures</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total des candidatures</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total des vues</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Montant total (FCFA)</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat('fr-FR').format(stats.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé et alertes */}
      <div className="mt-6 p-4 bg-fuchsia-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-info-circle text-fuchsia-600 mr-3 mt-1"></i>
          <div>
            <p className="text-sm text-fuchsia-800 mb-2">
              <strong>Résumé :</strong> Vous avez créé {stats.total} offre{stats.total > 1 ? 's' : ''} de financement au total.
            </p>
            {stats.deadlineSoon > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-2">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-orange-500 mr-2"></i>
                  <span className="text-sm text-orange-800 font-medium">
                    ⚠️ {stats.deadlineSoon} financement{stats.deadlineSoon > 1 ? 's' : ''} avec date limite proche (≤30 jours)
                  </span>
                </div>
              </div>
            )}
            {stats.deadlineExpired > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                  <span className="text-sm text-red-800 font-medium">
                    🚨 {stats.deadlineExpired} financement{stats.deadlineExpired > 1 ? 's' : ''} avec date limite expirée
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

export default FinancementStats; 