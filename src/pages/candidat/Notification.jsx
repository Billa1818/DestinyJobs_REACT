import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Notification = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      title: 'Candidature acceptée',
      message: 'Votre candidature pour le poste de Développeur Full Stack a été acceptée',
      time: 'Il y a 2h',
      read: false,
      company: 'TechCorp Solutions'
    },
    {
      id: 2,
      type: 'interview',
      title: 'Entretien programmé',
      message: 'Un entretien a été programmé pour le poste de Marketing Manager',
      time: 'Il y a 4h',
      read: false,
      company: 'StartupBJ'
    },
    {
      id: 3,
      type: 'job',
      title: 'Nouvelle offre d\'emploi',
      message: 'Une nouvelle offre correspondant à votre profil est disponible',
      time: 'Il y a 6h',
      read: true,
      company: 'Digital Solutions'
    },
    {
      id: 4,
      type: 'profile',
      title: 'Profil consulté',
      message: 'Votre profil a été consulté par un recruteur',
      time: 'Il y a 1 jour',
      read: true,
      company: 'Finance+ Group'
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return 'fas fa-paper-plane text-fuchsia-600';
      case 'interview':
        return 'fas fa-calendar-alt text-green-600';
      case 'job':
        return 'fas fa-briefcase text-blue-600';
      case 'profile':
        return 'fas fa-eye text-purple-600';
      default:
        return 'fas fa-bell text-gray-600';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'application':
        return 'bg-fuchsia-50 border-fuchsia-200';
      case 'interview':
        return 'bg-green-50 border-green-200';
      case 'job':
        return 'bg-blue-50 border-blue-200';
      case 'profile':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notif => notif.type === activeTab);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">{unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium">
                  <i className="fas fa-check-double mr-2"></i>Tout marquer comme lu
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm">
                  <i className="fas fa-cog"></i>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'all' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setActiveTab('application')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'application' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Candidatures
              </button>
              <button
                onClick={() => setActiveTab('interview')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'interview' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Entretiens
              </button>
              <button
                onClick={() => setActiveTab('job')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'job' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Emplois
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                  notification.read ? 'opacity-75' : ''
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-gray-100' : 'bg-white'
                  }`}>
                    <i className={`${getNotificationIcon(notification.type)} text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs text-gray-500">
                            {notification.company}
                          </span>
                          <span className="text-xs text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-fuchsia-600 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button className="text-gray-400 hover:text-red-600 text-sm">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-bell text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-600">Vous n'avez aucune notification pour le moment.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Notification Settings */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-cog mr-2 text-fuchsia-600"></i>
              Paramètres des notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notifications par email</h4>
                  <p className="text-xs text-gray-500">Recevoir les notifications par email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notifications push</h4>
                  <p className="text-xs text-gray-500">Recevoir les notifications sur le navigateur</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Offres d'emploi</h4>
                  <p className="text-xs text-gray-500">Nouvelles offres correspondant à votre profil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link to="/candidat/offre" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-search text-fuchsia-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Rechercher des emplois</h4>
                  <p className="text-xs text-gray-500">Trouvez votre prochain poste</p>
                </div>
              </Link>
              
              <Link to="/candidat/candidature-recente" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-paper-plane text-green-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Mes candidatures</h4>
                  <p className="text-xs text-gray-500">Suivez vos candidatures</p>
                </div>
              </Link>
              
              <Link to="/candidat/profil" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-user text-purple-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Mon profil</h4>
                  <p className="text-xs text-gray-500">Gérez votre profil</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Notification;