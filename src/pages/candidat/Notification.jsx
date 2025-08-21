import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CandidatNotificationService from '../../services/CandidatNotificationService';

const Notification = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 0
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [stats, setStats] = useState(null);

  // Récupérer les notifications
  const fetchNotifications = async (page = 1, unreadOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CandidatNotificationService.getNotifications(page, 20, unreadOnly);
      
      // Formater les notifications pour l'affichage
      const formattedNotifications = CandidatNotificationService.formatNotificationsForDisplay(response.notifications);
      setNotifications(formattedNotifications);
      setPagination(response.pagination);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les statistiques
  const fetchStats = async () => {
    try {
      const statsData = await CandidatNotificationService.getNotificationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  // Récupérer les préférences
  const fetchPreferences = async () => {
    try {
      setLoadingPreferences(true);
      const prefsData = await CandidatNotificationService.getNotificationPreferences();
      const formattedPrefs = CandidatNotificationService.formatPreferencesForDisplay(prefsData);
      setPreferences(formattedPrefs);
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
    } finally {
      setLoadingPreferences(false);
    }
  };

  // Marquer comme lu
  const markAsRead = async (notificationIds = [], markAll = false) => {
    try {
      // Feedback visuel immédiat
      const notificationIdsToUpdate = markAll ? notifications.map(n => n.id) : notificationIds;
      
      // Mettre à jour l'état local immédiatement pour un feedback instantané
      setNotifications(prev => 
        prev.map(notif => 
          notificationIdsToUpdate.includes(notif.id) 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // Appel API
      await CandidatNotificationService.markAsRead(notificationIds, markAll);
      
      // Rafraîchir les données depuis l'API
      await fetchNotifications(pagination.currentPage);
      await fetchStats();
      
      // Vider la sélection
      setSelectedNotifications([]);
      
      // Afficher un message de succès temporaire
      if (notificationIdsToUpdate.length === 1) {
        setError(null); // Effacer les erreurs précédentes
        // Optionnel : afficher un message de succès
      }
      
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      setError(error.message);
      
      // En cas d'erreur, remettre l'état précédent
      await fetchNotifications(pagination.currentPage);
    }
  };

  // Mettre à jour les préférences
  const updatePreferences = async (newPreferences) => {
    try {
      const apiPreferences = CandidatNotificationService.formatPreferencesForAPI(newPreferences);
      await CandidatNotificationService.updateNotificationPreferences(apiPreferences);
      
      // Rafraîchir les préférences
      await fetchPreferences();
      
      // Fermer le modal
      setShowPreferences(false);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      setError(error.message);
    }
  };

  // Gérer la sélection multiple
  const toggleSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Gérer la sélection de toutes les notifications
  const toggleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  // Filtrer les notifications selon l'onglet actif
  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    
    const typeMapping = {
      'application': 'APPLICATION_STATUS',
      'interview': 'APPLICATION_STATUS',
      'job': 'NEW_OFFER_MATCH',
      'profile': 'ACCOUNT_UPDATES'
    };
    
    return notifications.filter(notif => notif.type === typeMapping[activeTab]);
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchNotifications();
    fetchStats();
    fetchPreferences();
  }, []);

  // Rafraîchir quand l'onglet change
  useEffect(() => {
    if (activeTab === 'unread') {
      fetchNotifications(1, true);
    } else {
      fetchNotifications(1, false);
    }
  }, [activeTab]);

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (loading && notifications.length === 0) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des notifications...</p>
          </div>
        </div>
      </main>
    );
  }

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
                <p className="text-gray-600 mt-1">
                  {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedNotifications.length > 0 && (
                  <button
                    onClick={() => markAsRead(selectedNotifications)}
                    className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Marquer {selectedNotifications.length} comme lu{selectedNotifications.length > 1 ? 's' : ''}
                  </button>
                )}
                <button
                  onClick={() => markAsRead([], true)}
                  className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                >
                  <i className="fas fa-check-double mr-2"></i>
                  Tout marquer comme lu
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="text-gray-600 hover:text-gray-700 text-sm p-2 rounded-lg hover:bg-gray-100"
                  title="Préférences"
                >
                  <i className="fas fa-cog"></i>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'all' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'unread' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Non lues
              </button>
              <button
                onClick={() => setActiveTab('application')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'application' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Candidatures
              </button>
              <button
                onClick={() => setActiveTab('job')}
                className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'job' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Offres d'emploi
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <i className="fas fa-bell-slash text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'unread' 
                    ? 'Vous êtes à jour avec toutes vos notifications !' 
                    : 'Vous n\'avez pas encore reçu de notifications.'
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Sélection multiple */}
                {filteredNotifications.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.length === filteredNotifications.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                        />
                        <span className="text-sm text-gray-700">
                          {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} sélectionnée{selectedNotifications.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      {selectedNotifications.length > 0 && (
                        <button
                          onClick={() => markAsRead(selectedNotifications)}
                          className="text-sm text-fuchsia-600 hover:text-fuchsia-700 font-medium"
                        >
                          <i className="fas fa-check mr-2"></i>
                          Marquer comme lu{selectedNotifications.length > 1 ? 's' : ''}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Liste des notifications */}
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg p-4 shadow-sm border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                      notification.isRead ? 'opacity-75' : 'border-l-fuchsia-500'
                    } ${notification.isRead ? 'border-l-gray-300' : ''}`}
                    onClick={() => !notification.isRead && markAsRead([notification.id])}
                    title={!notification.isRead ? "Cliquez pour marquer comme lu" : "Notification déjà lue"}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Checkbox de sélection */}
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleSelection(notification.id)}
                        className="mt-1 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      
                      {/* Icône */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.isRead ? 'bg-gray-100' : 'bg-fuchsia-100'
                      }`}>
                        <i className={`${CandidatNotificationService.getTypeIcon(notification.type)} ${
                          notification.isRead ? 'text-gray-500' : 'text-fuchsia-600'
                        } text-lg`}></i>
                      </div>
                      
                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`text-sm font-medium ${
                                notification.isRead ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h3>
                              {notification.isHighPriority && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <i className="fas fa-exclamation-triangle mr-1"></i>
                                  Priorité haute
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${
                              notification.isRead ? 'text-gray-500' : 'text-gray-700'
                            } mb-2`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{notification.timeAgo}</span>
                              <span>•</span>
                              <span className={CandidatNotificationService.getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </span>
                              <span>•</span>
                              <span>{notification.typeLabel}</span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead([notification.id])}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-fuchsia-700 bg-fuchsia-100 border border-fuchsia-200 rounded-md hover:bg-fuchsia-200 hover:text-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-1 transition-all duration-200"
                                title="Marquer cette notification comme lue"
                              >
                                <i className="fas fa-check mr-1.5 text-xs"></i>
                                Marquer comme lu
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {pagination.currentPage} sur {pagination.totalPages} 
                  ({pagination.totalCount} notification{pagination.totalCount > 1 ? 's' : ''})
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchNotifications(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => fetchNotifications(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Statistiques */}
          {stats && (
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Non lues</span>
                  <span className="text-lg font-semibold text-fuchsia-600">{stats.unread}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aujourd'hui</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.today}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cette semaine</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.this_week}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link
                to="/candidat/emploi-candidature"
                className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-briefcase text-blue-600 mr-3"></i>
                <span className="text-sm font-medium text-blue-800">Mes candidatures emploi</span>
              </Link>
              <Link
                to="/candidat/consultation-candidature"
                className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-search text-green-600 mr-3"></i>
                <span className="text-sm font-medium text-green-800">Mes candidatures consultation</span>
              </Link>
              <Link
                to="/candidat/financement-candidature"
                className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
              >
                <i className="fas fa-coins text-purple-600 mr-3"></i>
                <span className="text-sm font-medium text-purple-800">Mes candidatures financement</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal des préférences */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  <i className="fas fa-cog mr-2 text-fuchsia-600"></i>
                  Préférences de notifications
                </h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {loadingPreferences ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des préférences...</p>
                </div>
              ) : preferences ? (
                <NotificationPreferencesForm
                  preferences={preferences}
                  onSave={updatePreferences}
                  onCancel={() => setShowPreferences(false)}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Impossible de charger les préférences</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// Composant pour le formulaire des préférences
const NotificationPreferencesForm = ({ preferences, onSave, onCancel }) => {
  const [formData, setFormData] = useState(preferences);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNotificationType = (type, enabled) => {
    setFormData(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: enabled
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notifications générales */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Méthodes de notification</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={(e) => updateField('emailNotifications', e.target.checked)}
              className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="ml-3 text-sm text-gray-700">Notifications par email</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.pushNotifications}
              onChange={(e) => updateField('pushNotifications', e.target.checked)}
              className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="ml-3 text-sm text-gray-700">Notifications push</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.smsNotifications}
              onChange={(e) => updateField('smsNotifications', e.target.checked)}
              className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="ml-3 text-sm text-gray-700">Notifications SMS</span>
          </label>
        </div>
      </div>

      {/* Fréquence */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fréquence</h3>
        <select
          value={formData.frequency}
          onChange={(e) => updateField('frequency', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
        >
          <option value="IMMEDIATE">Immédiat</option>
          <option value="HOURLY">Toutes les heures</option>
          <option value="DAILY">Quotidien</option>
          <option value="WEEKLY">Hebdomadaire</option>
        </select>
      </div>

      {/* Heures silencieuses */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Heures silencieuses</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.quietHours.enabled}
              onChange={(e) => updateField('quietHours', { ...formData.quietHours, enabled: e.target.checked })}
              className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
            />
            <span className="ml-3 text-sm text-gray-700">Activer les heures silencieuses</span>
          </label>
          
          {formData.quietHours.enabled && (
            <div className="ml-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                <input
                  type="time"
                  value={formData.quietHours.startTime}
                  onChange={(e) => updateField('quietHours', { ...formData.quietHours, startTime: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
                <input
                  type="time"
                  value={formData.quietHours.endTime}
                  onChange={(e) => updateField('quietHours', { ...formData.quietHours, endTime: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Types de notifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Types de notifications</h3>
        <div className="space-y-3">
          {Object.entries(formData.notificationTypes).map(([type, enabled]) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => updateNotificationType(type, e.target.checked)}
                className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                {CandidatNotificationService.getTypeLabel(type)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-fuchsia-600 border border-transparent rounded-md hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Sauvegarde...
            </>
          ) : (
            'Sauvegarder'
          )}
        </button>
      </div>
    </form>
  );
};

export default Notification;