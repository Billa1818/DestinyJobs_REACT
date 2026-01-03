import React, { useState, useEffect } from 'react';
import ProviderNotificationService from '../../services/ProviderNotificationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationItem from '../../components/prestataire/NotificationItem';

const Notifications = () => {
  // États pour les notifications
  const [allNotifications, setAllNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  });
  const [preferences, setPreferences] = useState(null);

  // États pour l'interface
  const [loading, setLoading] = useState(true);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);

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
        loadPreferences()
      ]);
    } catch (err) {
      console.error('Erreur lors du chargement des données initiales:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      const params = {
        page: 1,
        page_size: 1000
      };

      const response = await ProviderNotificationService.getNotifications(params);
      
      const notifs = ProviderNotificationService.formatNotificationsForDisplay(response.notifications);
      setAllNotifications(notifs);
      
      // Calculer les stats localement
      const unreadCount = notifs.filter(n => !n.is_read).length;
      const readCount = notifs.filter(n => n.is_read).length;
      
      setStats({
        total: notifs.length,
        unread: unreadCount,
        read: readCount
      });
      
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
      setError('Erreur lors du chargement des notifications');
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
      setPreferences(ProviderNotificationService.getDefaultPreferences());
    } finally {
      setLoadingPreferences(false);
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

      await ProviderNotificationService.markNotificationsAsRead(data);
      
      // Mettre à jour l'état local
      const updated = allNotifications.map(notif => 
        (data.mark_all || data.notification_ids.includes(notif.id))
          ? { ...notif, is_read: true }
          : notif
      );
      setAllNotifications(updated);
      
      // Mettre à jour les stats
      const unreadCount = updated.filter(n => !n.is_read).length;
      const readCount = updated.filter(n => n.is_read).length;
      
      setStats({
        total: updated.length,
        unread: unreadCount,
        read: readCount
      });
      
      // Vider la sélection
      setSelectedNotifications(new Set());
      
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

  // Mettre à jour les préférences
  const updatePreferences = async (newPreferences) => {
    try {
      setSaving(true);
      setError(null);

      const validation = ProviderNotificationService.validateNotificationPreferences(newPreferences);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      const updatedPrefs = await ProviderNotificationService.updateNotificationPreferences(newPreferences);
      setPreferences(updatedPrefs);
      setShowPreferences(false);
      
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

  // Séparer les notifications
  const unreadNotifications = allNotifications.filter(n => !n.is_read);
  const readNotifications = allNotifications.filter(n => n.is_read);

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {loading && allNotifications.length === 0 ? (
        <LoadingSpinner variant="page" size="lg" text="Chargement des notifications..." />
      ) : (
        <>
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {stats.unread} notification{stats.unread > 1 ? 's' : ''} non lue{stats.unread > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex space-x-3">
                {selectedNotifications.size > 0 && (
                  <button
                    onClick={() => markNotificationsAsRead()}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Marquer {selectedNotifications.size} comme lu{selectedNotifications.size > 1 ? 's' : ''}
                  </button>
                )}
                <button
                  onClick={markAllAsRead}
                  disabled={saving || stats.unread === 0}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 disabled:opacity-50"
                >
                  <i className="fas fa-check-double mr-2"></i>
                  Tout marquer comme lu
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Préférences
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <i className="fas fa-bell text-4xl text-gray-300"></i>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Non lues</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.unread}</p>
                </div>
                <i className="fas fa-envelope text-4xl text-orange-300"></i>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Lues</p>
                  <p className="text-3xl font-bold text-green-600">{stats.read}</p>
                </div>
                <i className="fas fa-check-circle text-4xl text-green-300"></i>
              </div>
            </div>
          </div>

          {/* Notifications non lues */}
          {unreadNotifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                <i className="fas fa-envelope text-orange-500 mr-2"></i>
                Non lues ({unreadNotifications.length})
              </h2>
              <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markNotificationsAsRead}
                    onSelect={toggleNotificationSelection}
                    isSelected={selectedNotifications.has(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notifications lues */}
          {readNotifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                Lues ({readNotifications.length})
              </h2>
              <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markNotificationsAsRead}
                    onSelect={toggleNotificationSelection}
                    isSelected={selectedNotifications.has(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Aucune notification */}
          {allNotifications.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-bell text-6xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-500">
                Vous n'avez pas encore reçu de notifications
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal des préférences */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  <i className="fas fa-cog mr-2 text-orange-600"></i>
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des préférences...</p>
                </div>
              ) : preferences ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updatePreferences(preferences);
                }} className="space-y-6">
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

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowPreferences(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                      {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </div>
                </form>
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

export default Notifications;
