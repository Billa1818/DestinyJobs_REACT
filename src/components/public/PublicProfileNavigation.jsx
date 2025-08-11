import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicProfileNavigation = ({ userType, userId }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      label: 'Candidats',
      path: '/profile/candidat',
      icon: 'fas fa-user-graduate',
      active: userType === 'candidat'
    },
    {
      label: 'Recruteurs',
      path: '/profile/recruteur',
      icon: 'fas fa-briefcase',
      active: userType === 'recruteur'
    },
    {
      label: 'Prestataires',
      path: '/profile/prestataire',
      icon: 'fas fa-tools',
      active: userType === 'prestataire'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              item.active
                ? 'bg-fuchsia-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className={`${item.icon} mr-2`}></i>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PublicProfileNavigation; 