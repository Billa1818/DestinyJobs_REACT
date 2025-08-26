import React, { useState, useEffect } from 'react';
import ProviderNotificationService from '../../services/ProviderNotificationService';

const Notifications = () => {
  // États pour les notifications
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [stats, setStats] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [notificationTypes, setNotificationTypes] = useState(null);

  // États pour l'interface
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // États pour les filtres
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    loadInitialData();
  }, []);

  // Charger les données initiales
  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadNotifications(),
        loadStats(),
        loadPreferences(),
        loadNotificationTypes()
      ]);
    } catch (err) {
      console.error('Erreur lors du chargement des données initiales:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications
  const loadNotifications = async (page = 1, filters = {}) => {
    try {
      const params = {
        page,
        page_size: pageSize,
        unread_only: unreadOnly,
        ...filters
      };

      const response = await ProviderNotificationService.getNotifications(params);
      
      setNotifications(ProviderNotificationService.formatNotificationsForDisplay(response.notifications));
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);
      
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
      setError('Erreur lors du chargement des notifications');
    }
  };

  // Charger les statistiques
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const statsData = await ProviderNotificationService.getNotificationStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Charger les préférences
  const loadPreferences = async () => {
    try {
      setLoadingPreferences(true);
      const prefsData = await ProviderNotificationService.getNotificationPreferences();
      setPreferences(prefsData);
    } catch (err) {
      console.error('Erreur lors du chargement des préférences:', err);
      // Utiliser les préférences par défaut si erreur
      setPreferences(ProviderNotificationService.getDefaultPreferences());
    } finally {
      setLoadingPreferences(false);
    }
  };

  // Charger les types de notifications
  const loadNotificationTypes = async () => {
    try {
      const typesData = await ProviderNotificationService.getNotificationTypes();
      setNotificationTypes(typesData);
    } catch (err) {
      console.error('Erreur lors du chargement des types de notifications:', err);
    }
  };

  // Marquer des notifications comme lues
  const markNotificationsAsRead = async (notificationIds = null) => {
    try {
      setSaving(true);
      setError(null);

      let data;
      if (notificationIds) {
        data = { notification_ids: notificationIds };
      } else if (selectedNotifications.size > 0) {
        data = { notification_ids: Array.from(selectedNotifications) };
      } else {
        data = { mark_all: true };
      }

      const result = await ProviderNotificationService.markNotificationsAsRead(data);
      setSuccess(result.message || 'Notifications marquées comme lues');
      
      // Recharger les notifications et statistiques
      setTimeout(() => {
        loadNotifications();
        loadStats();
        setSelectedNotifications(new Set());
      }, 1000);
      
    } catch (err) {
      console.error('Erreur lors du marquage des notifications:', err);
      setError('Erreur lors du marquage des notifications');
    } finally {
      setSaving(false);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    if (window.confirm('Marquer toutes les notifications comme lues ?')) {
      await markNotificationsAsRead();
    }
  };

  // Gérer la sélection d'une notification
  const toggleNotificationSelection = (notificationId) => {
    const newSelection = new Set(selectedNotifications);
    if (newSelection.has(notificationId)) {
      newSelection.delete(notificationId);
    } else {
      newSelection.add(notificationId);
    }
    setSelectedNotifications(newSelection);
  };

  // Gérer la sélection de toutes les notifications
  const toggleAllNotifications = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }
  };

  // Appliquer les filtres
  const applyFilters = () => {
    setCurrentPage(1);
    loadNotifications(1);
  };

  // Changer de page
  const changePage = (page) => {
    setCurrentPage(page);
    loadNotifications(page);
  };

  // Mettre à jour les préférences
  const updatePreferences = async (newPreferences) => {
    try {
      setSaving(true);
      setError(null);

      // Validation
      const validation = ProviderNotificationService.validateNotificationPreferences(newPreferences);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      const updatedPrefs = await ProviderNotificationService.updateNotificationPreferences(newPreferences);
      setPreferences(updatedPrefs);
      setSuccess('Préférences mises à jour avec succès');
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour des préférences:', err);
      setError('Erreur lors de la mise à jour des préférences');
    } finally {
      setSaving(false);
    }
  };

  // Gérer le changement de préférence
  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  // Obtenir l'icône du type de notification
  const getNotificationIcon = (type) => {
    const iconMap = {
      'NEW_OFFER_MATCH': 'fas fa-briefcase',
      'APPLICATION_STATUS': 'fas fa-file-alt',
      'AI_SERVICE_UPDATE': 'fas fa-robot',
      'SUBSCRIPTION_EXPIRING': 'fas fa-credit-card',
      'SYSTEM_UPDATE': 'fas fa-cog',
      'MESSAGE_RECEIVED': 'fas fa-envelope',
      'BLOG_POST_PUBLISHED': 'fas fa-newspaper',
      'DAILY_DIGEST': 'fas fa-calendar-day',
      'WEEKLY_REPORT': 'fas fa-chart-line'
    };
    
    return iconMap[type] || 'fas fa-bell';
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des notifications...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Gérez vos notifications et préférences</p>
            </div>
            <div className="flex space-x-3">
              {selectedNotifications.size > 0 && (
                <button
                  onClick={() => markNotificationsAsRead()}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {saving ? 'Marquage...' : `Marquer ${selectedNotifications.size} comme lue(s)`}
                </button>
              )}
              <button 
                onClick={markAllAsRead}
                disabled={saving || totalCount === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
              >
                {saving ? 'Marquage...' : 'Tout marquer comme lu'}
              </button>
          </div>
        </div>

          {/* Messages de succès/erreur */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Statistiques rapides */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
                  <i className="fas fa-bell text-blue-600 text-xl mr-3"></i>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    <p className="text-sm text-blue-600">Total</p>
                  </div>
              </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-envelope text-orange-600 text-xl mr-3"></i>
                  <div>
                    <p className="text-2xl font-bold text-orange-900">{stats.unread}</p>
                    <p className="text-sm text-orange-600">Non lues</p>
            </div>
          </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-calendar-day text-green-600 text-xl mr-3"></i>
                  <div>
                    <p className="text-2xl font-bold text-green-900">{stats.today}</p>
                    <p className="text-sm text-green-600">Aujourd'hui</p>
              </div>
            </div>
          </div>
              <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
                  <i className="fas fa-calendar-week text-purple-600 text-xl mr-3"></i>
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{stats.this_week}</p>
                    <p className="text-sm text-purple-600">Cette semaine</p>
                  </div>
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-bell mr-2"></i>
                Toutes les notifications
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'unread'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-envelope mr-2"></i>
                Non lues ({stats?.unread || 0})
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-cog mr-2"></i>
                Préférences
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Toutes les notifications */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                {/* Filtres */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={unreadOnly}
                        onChange={(e) => setUnreadOnly(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Notifications non lues seulement</span>
                    </label>
                    <button
                      onClick={applyFilters}
                      className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                    >
                      Appliquer
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {totalCount} notification(s) • Page {currentPage} sur {totalPages}
                  </div>
              </div>

                {/* Liste des notifications */}
                {notifications.length > 0 ? (
              <div className="space-y-4">
                    {/* En-tête avec sélection */}
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.size === notifications.length && notifications.length > 0}
                        onChange={toggleAllNotifications}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {selectedNotifications.size} sur {notifications.length} sélectionnée(s)
                      </span>
                    </div>

                    {/* Notifications */}
                    {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          notification.is_read
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-orange-200 shadow-sm'
                        } ${notification.isUrgent ? 'border-red-300 bg-red-50' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.has(notification.id)}
                            onChange={() => toggleNotificationSelection(notification.id)}
                            className="mt-1 mr-2"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <i className={`${getNotificationIcon(notification.notification_type)} text-orange-600`}></i>
                                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.priorityColor}`}>
                                  {notification.priorityText}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">{notification.timeAgo}</span>
                        </div>
                            <p className="text-gray-700 mb-3">{notification.message}</p>
                            
                            {/* Métadonnées supprimées - pas d'affichage des détails */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-bell-slash text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                    <p className="text-gray-600">
                      {unreadOnly ? 'Aucune notification non lue' : 'Vous n\'avez pas encore de notifications'}
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <button
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Précédent
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-3 py-2 border rounded-md text-sm ${
                          page === currentPage
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Notifications non lues */}
            {activeTab === 'unread' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Notifications non lues ({stats?.unread || 0})
                  </h3>
                  <button
                    onClick={markAllAsRead}
                    disabled={saving || !stats?.unread}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                  >
                    {saving ? 'Marquage...' : 'Tout marquer comme lu'}
                  </button>
                </div>

                {notifications.filter(n => !n.is_read).length > 0 ? (
                  <div className="space-y-4">
                    {notifications.filter(n => !n.is_read).map((notification) => (
                      <div
                        key={notification.id}
                        className="border border-orange-200 rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <i className={`${getNotificationIcon(notification.notification_type)} text-orange-600`}></i>
                                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.priorityColor}`}>
                                  {notification.priorityText}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">{notification.timeAgo}</span>
                            </div>
                            <p className="text-gray-700">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-check-circle text-4xl text-green-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Toutes les notifications sont lues !</h3>
                    <p className="text-gray-600">Vous êtes à jour avec vos notifications</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Préférences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Préférences de notification</h3>
                          <button 
                    onClick={() => updatePreferences(preferences)}
                    disabled={saving}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 disabled:opacity-50"
                  >
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>

                {loadingPreferences ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des préférences...</p>
                  </div>
                ) : preferences ? (
                  <div className="space-y-8">
                    {/* Notifications par email */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">
                        <i className="fas fa-envelope mr-2 text-blue-600"></i>
                        Notifications par email
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.email_notifications}
                            onChange={(e) => handlePreferenceChange('email_notifications', e.target.checked)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">Activer les notifications par email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.email_new_offers}
                            onChange={(e) => handlePreferenceChange('email_new_offers', e.target.checked)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">Nouvelles offres correspondantes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.email_application_updates}
                            onChange={(e) => handlePreferenceChange('email_application_updates', e.target.checked)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">Mises à jour de candidatures</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.email_ai_services}
                            onChange={(e) => handlePreferenceChange('email_ai_services', e.target.checked)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">Services IA</span>
                        </label>
                      </div>
                    </div>

                    {/* Notifications push */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">
                        <i className="fas fa-mobile-alt mr-2 text-green-600"></i>
                        Notifications push
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.push_notifications}
                            onChange={(e) => handlePreferenceChange('push_notifications', e.target.checked)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">Activer les notifications push</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.push_new_offers}
                            onChange={(e) => handlePreferenceChange('push_new_offers', e.target.checked)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">Nouvelles offres</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={preferences.push_messages}
                            onChange={(e) => handlePreferenceChange('push_messages', e.target.checked)}
                            className="mr-3"
                          />
                          <span className="text-sm text-gray-700">Nouveaux messages</span>
                        </label>
                      </div>
                    </div>

                    {/* Fréquence et heures de silence */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">
                        <i className="fas fa-clock mr-2 text-purple-600"></i>
                        Fréquence et heures de silence
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fréquence des notifications
                          </label>
                          <select
                            value={preferences.notification_frequency || 'IMMEDIATE'}
                            onChange={(e) => handlePreferenceChange('notification_frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="IMMEDIATE">Immédiat</option>
                            <option value="HOURLY">Toutes les heures</option>
                            <option value="DAILY">Quotidien</option>
                            <option value="WEEKLY">Hebdomadaire</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heure de début (silence)
                          </label>
                          <input
                            type="time"
                            value={preferences.quiet_hours_start || ''}
                            onChange={(e) => handlePreferenceChange('quiet_hours_start', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heure de fin (silence)
                          </label>
                          <input
                            type="time"
                            value={preferences.quiet_hours_end || ''}
                            onChange={(e) => handlePreferenceChange('quiet_hours_end', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Impossible de charger les préférences</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Notifications; 