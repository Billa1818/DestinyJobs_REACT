import React from 'react';

const UserInfoSection = ({ userProfile, onEditClick, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center py-8">
          <i className="fas fa-user text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-600">Impossible de charger vos informations personnelles.</p>
        </div>
      </div>
    );
  }

  const infoItems = [
    {
      label: 'Nom d\'utilisateur',
      value: userProfile.username,
      icon: 'fas fa-user',
      field: 'username'
    },
    {
      label: 'Email',
      value: userProfile.email,
      icon: 'fas fa-envelope',
      field: 'email',
      badge: userProfile.email_verified ? 'Vérifié' : 'Non vérifié'
    },
    {
      label: 'Prénom',
      value: userProfile.first_name || '-',
      icon: 'fas fa-user-circle',
      field: 'first_name'
    },
    {
      label: 'Nom',
      value: userProfile.last_name || '-',
      icon: 'fas fa-user-circle',
      field: 'last_name'
    },
    {
      label: 'Téléphone',
      value: userProfile.phone || '-',
      icon: 'fas fa-phone',
      field: 'phone'
    },
    {
      label: 'Type d\'utilisateur',
      value: userProfile.user_type || '-',
      icon: 'fas fa-id-badge',
      field: 'user_type',
      editable: false
    },
    {
      label: 'Statut d\'approbation',
      value: userProfile.is_approved ? 'Approuvé' : 'En attente',
      icon: 'fas fa-check-circle',
      field: 'is_approved',
      editable: false,
      badge: userProfile.is_approved ? 'Approuvé' : 'En attente'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          <i className="fas fa-user text-orange-600 mr-2"></i>
          Informations Personnelles
        </h2>
        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 flex items-center text-sm"
        >
          <i className="fas fa-edit mr-2"></i>
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <i className={`${item.icon} text-orange-600`}></i>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                {item.badge && (
                  <div className="mt-2">
                    {item.field === 'email' && (
                      <span
                        className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                          userProfile.email_verified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.field === 'is_approved' && (
                      <span
                        className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                          userProfile.is_approved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Compte créé le</p>
            <p className="text-sm font-semibold text-gray-900">
              {userProfile.created_at
                ? new Date(userProfile.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '-'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Dernière activité</p>
            <p className="text-sm font-semibold text-gray-900">
              {userProfile.last_activity
                ? new Date(userProfile.last_activity).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Note sur la modification d'email */}
      {!userProfile.email_verified && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-800 flex items-start">
            <i className="fas fa-info-circle text-orange-600 mr-2 mt-0.5 flex-shrink-0"></i>
            <span>
              Votre email n'est pas encore vérifié. Vérifiez votre boîte mail pour confirmer votre adresse.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInfoSection;
