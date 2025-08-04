import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'candidature',
      title: 'Nouvelle candidature reçue',
      message: 'Amina Kone a postulé pour le poste de Développeur Full Stack Senior',
      time: 'Il y a 5 minutes',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'offre',
      title: 'Offre d\'emploi publiée avec succès',
      message: 'Votre offre "Chef de projet IT" a été publiée et est maintenant visible',
      time: 'Il y a 1 heure',
      read: true,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'system',
      title: 'Mise à jour du système',
      message: 'De nouvelles fonctionnalités sont disponibles sur votre tableau de bord',
      time: 'Il y a 2 heures',
      read: false,
      priority: 'low'
    },
    {
      id: 4,
      type: 'candidature',
      title: 'Candidature acceptée',
      message: 'Marc Dossou a accepté votre offre pour le poste de Marketing Manager',
      time: 'Il y a 3 heures',
      read: true,
      priority: 'high'
    },
    {
      id: 5,
      type: 'financement',
      title: 'Nouvelle demande de financement',
      message: 'Fatou Diallo a soumis une demande pour le financement "Projet Innovation"',
      time: 'Il y a 4 heures',
      read: false,
      priority: 'medium'
    },
    {
      id: 6,
      type: 'bourse',
      title: 'Postulation bourse reçue',
      message: 'Kofi Mensah a postulé pour la bourse d\'excellence IT',
      time: 'Il y a 6 heures',
      read: true,
      priority: 'medium'
    },
    {
      id: 7,
      type: 'consultation',
      title: 'Nouvelle consultation demandée',
      message: 'Sarah Johnson demande une consultation pour un projet de développement',
      time: 'Il y a 1 jour',
      read: false,
      priority: 'high'
    },
    {
      id: 8,
      type: 'system',
      title: 'Maintenance prévue',
      message: 'Une maintenance est prévue ce soir de 22h à 23h',
      time: 'Il y a 1 jour',
      read: true,
      priority: 'low'
    }
  ]);

  const [filters] = useState({
    all: notifications.length,
    candidature: notifications.filter(n => n.type === 'candidature').length,
    offre: notifications.filter(n => n.type === 'offre').length,
    system: notifications.filter(n => n.type === 'system').length,
    financement: notifications.filter(n => n.type === 'financement').length,
    bourse: notifications.filter(n => n.type === 'bourse').length,
    consultation: notifications.filter(n => n.type === 'consultation').length
  });

  const getFilteredNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    }
    return notifications.filter(n => n.type === activeTab);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'candidature': return 'fas fa-user-plus text-blue-500';
      case 'offre': return 'fas fa-briefcase text-green-500';
      case 'system': return 'fas fa-cog text-gray-500';
      case 'financement': return 'fas fa-money-bill-wave text-purple-500';
      case 'bourse': return 'fas fa-graduation-cap text-orange-500';
      case 'consultation': return 'fas fa-comments text-indigo-500';
      default: return 'fas fa-bell text-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-gray-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Restez informé de toutes les activités importantes</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={markAllAsRead}
                className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-check-double mr-2"></i>
                Tout marquer comme lu
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Toutes ({filters.all})
              </button>
              <button
                onClick={() => setActiveTab('candidature')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'candidature'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Candidatures ({filters.candidature})
              </button>
              <button
                onClick={() => setActiveTab('offre')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'offre'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Offres ({filters.offre})
              </button>
              <button
                onClick={() => setActiveTab('financement')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'financement'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Financements ({filters.financement})
              </button>
              <button
                onClick={() => setActiveTab('bourse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'bourse'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bourses ({filters.bourse})
              </button>
              <button
                onClick={() => setActiveTab('consultation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'consultation'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Consultations ({filters.consultation})
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'system'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Système ({filters.system})
              </button>
            </nav>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {getFilteredNotifications().length === 0 ? (
              <div className="p-8 text-center">
                <i className="fas fa-bell-slash text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                <p className="text-gray-500">Vous n'avez aucune notification dans cette catégorie.</p>
              </div>
            ) : (
              getFilteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition duration-200 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <i className={`${getTypeIcon(notification.type)} text-lg`}></i>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                          title="Marquer comme lu"
                        >
                          <i className="fas fa-check text-sm"></i>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Supprimer"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {getFilteredNotifications().length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {getFilteredNotifications().length} notification{getFilteredNotifications().length > 1 ? 's' : ''}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-fuchsia-600 hover:text-fuchsia-700 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Tout supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 