import React, { useState } from 'react';

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'job-match',
      title: 'Nouvelle offre correspondant à votre profil',
      message: 'Une offre de développeur Full-Stack à Cotonou correspond parfaitement à vos compétences',
      company: 'TechStart Benin',
      isRead: false,
      priority: 'high',
      createdAt: '2024-01-20T10:30:00',
      actionRequired: true,
      category: 'opportunity'
    },
    {
      id: 2,
      type: 'application-update',
      title: 'Mise à jour de votre candidature',
      message: 'Votre candidature chez Digital Solutions a été examinée et est en cours d\'évaluation',
      company: 'Digital Solutions',
      isRead: true,
      priority: 'medium',
      createdAt: '2024-01-19T15:45:00',
      actionRequired: false,
      category: 'application'
    },
    {
      id: 3,
      type: 'skill-endorsement',
      title: 'Nouvelle recommandation de compétence',
      message: 'Marie Konan a recommandé votre compétence en React.js',
      company: null,
      isRead: false,
      priority: 'low',
      createdAt: '2024-01-19T09:15:00',
      actionRequired: false,
      category: 'social'
    },
    {
      id: 4,
      type: 'profile-view',
      title: 'Votre profil a été consulté',
      message: 'Un recruteur de Startup Benin a consulté votre profil',
      company: 'Startup Benin',
      isRead: true,
      priority: 'low',
      createdAt: '2024-01-18T14:20:00',
      actionRequired: false,
      category: 'profile'
    },
    {
      id: 5,
      type: 'deadline-reminder',
      title: 'Rappel : Date limite de candidature',
      message: 'La candidature pour le poste de Lead Developer chez Innovation Lab se termine dans 2 jours',
      company: 'Innovation Lab',
      isRead: false,
      priority: 'high',
      createdAt: '2024-01-18T08:00:00',
      actionRequired: true,
      category: 'deadline'
    },
    {
      id: 6,
      type: 'interview-invitation',
      title: 'Invitation à un entretien',
      message: 'Vous êtes invité à un entretien en ligne pour le poste de Senior Developer',
      company: 'TechCorp Africa',
      isRead: false,
      priority: 'high',
      createdAt: '2024-01-17T16:30:00',
      actionRequired: true,
      category: 'interview'
    }
  ]);

  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    readStatus: 'all'
  });

  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      jobMatches: true,
      applicationUpdates: true,
      skillEndorsements: false,
      profileViews: false,
      deadlines: true,
      interviews: true
    },
    push: {
      jobMatches: true,
      applicationUpdates: true,
      skillEndorsements: true,
      profileViews: false,
      deadlines: true,
      interviews: true
    },
    frequency: 'immediate' // immediate, daily, weekly
  });

  const notificationTypes = {
    'job-match': { icon: 'fas fa-briefcase', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'application-update': { icon: 'fas fa-file-alt', color: 'text-green-600', bgColor: 'bg-green-100' },
    'skill-endorsement': { icon: 'fas fa-thumbs-up', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'profile-view': { icon: 'fas fa-eye', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    'deadline-reminder': { icon: 'fas fa-clock', color: 'text-red-600', bgColor: 'bg-red-100' },
    'interview-invitation': { icon: 'fas fa-calendar-check', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  };

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500'
  };

  const categories = [
    { value: 'all', label: 'Toutes', count: notifications.length },
    { value: 'opportunity', label: 'Opportunités', count: notifications.filter(n => n.category === 'opportunity').length },
    { value: 'application', label: 'Candidatures', count: notifications.filter(n => n.category === 'application').length },
    { value: 'social', label: 'Social', count: notifications.filter(n => n.category === 'social').length },
    { value: 'profile', label: 'Profil', count: notifications.filter(n => n.category === 'profile').length },
    { value: 'deadline', label: 'Échéances', count: notifications.filter(n => n.category === 'deadline').length },
    { value: 'interview', label: 'Entretiens', count: notifications.filter(n => n.category === 'interview').length }
  ];

  const priorities = [
    { value: 'all', label: 'Toutes', count: notifications.length },
    { value: 'high', label: 'Haute', count: notifications.filter(n => n.priority === 'high').length },
    { value: 'medium', label: 'Moyenne', count: notifications.filter(n => n.priority === 'medium').length },
    { value: 'low', label: 'Basse', count: notifications.filter(n => n.priority === 'low').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filters.category !== 'all' && notification.category !== filters.category) return false;
    if (filters.priority !== 'all' && notification.priority !== filters.priority) return false;
    if (filters.readStatus === 'unread' && notification.isRead) return false;
    if (filters.readStatus === 'read' && !notification.isRead) return false;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `Il y a ${diffInWeeks}s`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const handleNotificationAction = (notification) => {
    markAsRead(notification.id);
    
    switch (notification.type) {
      case 'job-match':
        // Rediriger vers la page de l'offre
        console.log('Redirection vers l\'offre d\'emploi');
        break;
      case 'interview-invitation':
        // Ouvrir le modal de réponse à l'invitation
        console.log('Ouverture du modal de réponse à l\'invitation');
        break;
      case 'deadline-reminder':
        // Rediriger vers la page de candidature
        console.log('Redirection vers la candidature');
        break;
      default:
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">
            <i className="fas fa-bell mr-2 text-fuchsia-600"></i>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={markAllAsRead}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition duration-200"
          >
            <i className="fas fa-check-double mr-2"></i>Tout marquer comme lu
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-700 transition duration-200"
          >
            <i className="fas fa-cog mr-2"></i>Paramètres
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setFilters(prev => ({ ...prev, category: category.value }))}
              className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                filters.category === category.value
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {priorities.map(priority => (
            <button
              key={priority.value}
              onClick={() => setFilters(prev => ({ ...prev, priority: priority.value }))}
              className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                filters.priority === priority.value
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {priority.label} ({priority.count})
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="readStatus"
              value="all"
              checked={filters.readStatus === 'all'}
              onChange={(e) => setFilters(prev => ({ ...prev, readStatus: e.target.value }))}
              className="text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="text-sm text-gray-700">Toutes</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="readStatus"
              value="unread"
              checked={filters.readStatus === 'unread'}
              onChange={(e) => setFilters(prev => ({ ...prev, readStatus: e.target.value }))}
              className="text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="text-sm text-gray-700">Non lues</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="readStatus"
              value="read"
              checked={filters.readStatus === 'read'}
              onChange={(e) => setFilters(prev => ({ ...prev, readStatus: e.target.value }))}
              className="text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="text-sm text-gray-700">Lues</span>
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      {showSettings && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Paramètres de notifications</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Notifications par email</h5>
              {Object.entries(notificationSettings.email).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, [key]: e.target.checked }
                    }))}
                    className="text-fuchsia-600 focus:ring-fuchsia-500 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
            
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Notifications push</h5>
              {Object.entries(notificationSettings.push).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      push: { ...prev.push, [key]: e.target.checked }
                    }))}
                    className="text-fuchsia-600 focus:ring-fuchsia-500 rounded"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="font-medium text-gray-800 mb-2">Fréquence des résumés</h5>
            <select
              value={notificationSettings.frequency}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, frequency: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="immediate">Immédiat</option>
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-bell-slash text-4xl mb-3"></i>
            <p>Aucune notification trouvée</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 ${priorityColors[notification.priority]} bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200 ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notificationTypes[notification.type]?.bgColor}`}>
                  <i className={`${notificationTypes[notification.type]?.icon} ${notificationTypes[notification.type]?.color}`}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-medium ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {notification.company && (
                        <p className="text-sm text-fuchsia-600 mt-1">
                          <i className="fas fa-building mr-1"></i>{notification.company}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      {notification.actionRequired && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Action requise
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {notification.actionRequired && (
                      <button
                        onClick={() => handleNotificationAction(notification)}
                        className="bg-fuchsia-600 text-white px-3 py-1 rounded text-sm hover:bg-fuchsia-700 transition duration-200"
                      >
                        Voir les détails
                      </button>
                    )}
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition duration-200"
                      >
                        <i className="fas fa-check mr-1"></i>Marquer comme lu
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition duration-200"
                    >
                      <i className="fas fa-trash mr-1"></i>Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-fuchsia-600">{notifications.length}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-sm text-gray-500">Non lues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {notifications.filter(n => n.actionRequired).length}
            </div>
            <div className="text-sm text-gray-500">Actions requises</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => n.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-500">Haute priorité</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection; 