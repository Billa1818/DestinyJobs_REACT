import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import CandidatNotificationService from '../../services/CandidatNotificationService';
import NotificationItem from '../../components/candidat/NotificationItem';

const Notification = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  });
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  
  // États pour la pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20
  });

  // Récupérer les notifications
  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CandidatNotificationService.getNotifications(page, pagination.pageSize, false);
      
      // Formater les notifications pour l'affichage
      const formattedNotifications = CandidatNotificationService.formatNotificationsForDisplay(response.notifications);
      setAllNotifications(formattedNotifications);
      
      // Mettre à jour la pagination
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil((response.count || formattedNotifications.length) / pagination.pageSize),
        totalCount: response.count || formattedNotifications.length
      }));
      
      // Calculer les stats localement
      const unreadCount = formattedNotifications.filter(n => !n.isRead).length;
      const readCount = formattedNotifications.filter(n => n.isRead).length;
      
      setStats({
        total: pagination.totalCount,
        unread: unreadCount,
        read: readCount
      });
      
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
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
      setBulkActionLoading(true);
      
      // Appel API
      await CandidatNotificationService.markAsRead(notificationIds, markAll);
      
      // Mettre à jour l'état local
      const updated = allNotifications.map(notif => 
        markAll || notificationIds.includes(notif.id) 
          ? { ...notif, isRead: true }
          : notif
      );
      setAllNotifications(updated);
      
      // Mettre à jour les stats
      const unreadCount = updated.filter(n => !n.isRead).length;
      const readCount = updated.filter(n => n.isRead).length;
      setStats({
        total: updated.length,
        unread: unreadCount,
        read: readCount
      });
      
      // Vider la sélection
      setSelectedNotifications([]);
      
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      setError(error.message);
    } finally {
      setBulkActionLoading(false);
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

  // Charger les données au montage du composant
  useEffect(() => {
    fetchNotifications(1);
    fetchPreferences();
  }, []);
  
  // Gestionnaire de changement de page
  const handlePageChange = (page) => {
    fetchNotifications(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Séparer les notifications
  const unreadNotifications = allNotifications.filter(n => !n.isRead);
  const readNotifications = allNotifications.filter(n => n.isRead);

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col">
        {/* Main Content Column */}
        <div className="w-full">
          {loading && allNotifications.length === 0 ? (
            <LoadingSpinner variant="page" size="lg" text="Chargement des notifications..." />
          ) : (
            <>
              {/* Header */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">
                      {stats.unread} notification{stats.unread > 1 ? 's' : ''} non lue{stats.unread > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedNotifications.length > 0 && (
                      <button
                        onClick={() => markAsRead(selectedNotifications)}
                        disabled={bulkActionLoading}
                        className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium disabled:opacity-50"
                      >
                        <i className="fas fa-check mr-2"></i>
                        Marquer {selectedNotifications.length} comme lu{selectedNotifications.length > 1 ? 's' : ''}
                      </button>
                    )}
                    <button
                      onClick={() => markAsRead([], true)}
                      disabled={stats.unread === 0 || bulkActionLoading}
                      className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium disabled:opacity-50"
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
                      <p className="text-3xl font-bold text-fuchsia-600">{stats.unread}</p>
                    </div>
                    <i className="fas fa-envelope text-4xl text-fuchsia-300"></i>
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
                    <i className="fas fa-envelope text-fuchsia-500 mr-2"></i>
                    Non lues ({unreadNotifications.length})
                  </h2>
                  <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                    {unreadNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onSelect={toggleSelection}
                        isSelected={selectedNotifications.includes(notification.id)}
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
                        onMarkAsRead={markAsRead}
                        onSelect={toggleSelection}
                        isSelected={selectedNotifications.includes(notification.id)}
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

          {/* Actions rapides */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mt-6">
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
        
        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalCount}
              itemsPerPage={pagination.pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        )}
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
