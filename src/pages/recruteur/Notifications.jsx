import React, { useState, useEffect } from 'react';
import RecruteurNotificationService from '../../services/RecruteurNotificationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationItem from '../../components/recruteur/NotificationItem';
import NotificationPagination from '../../components/NotificationPagination';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_notifications: 0,
    unread_count: 0,
    read_count: 0,
  });
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20
  });

  // Charger les notifications avec pagination
  const loadNotifications = async (page = 1, pageSize = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await RecruteurNotificationService.getNotifications({}, page, pageSize);
      
      // Extraire les notifications de la réponse (personnalisé format)
      const notificationsData = response.notifications || response.results || [];
      
      // Format personnalisé avec pagination objet
      let totalCount = notificationsData.length;
      let totalPages = 1;
      
      if (response.pagination) {
        totalCount = response.pagination.totalCount;
        totalPages = response.pagination.totalPages;
      } else if (response.count) {
        // Format DRF standard
        totalCount = response.count;
        totalPages = Math.ceil(totalCount / pageSize);
      } else {
        // Fallback
        totalPages = Math.ceil(totalCount / pageSize);
      }
      
      setNotifications(notificationsData);
      
      // Mettre à jour la pagination
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount
      }));
      
      // Calculer les stats à partir des données actuelles
      const unreadCount = notificationsData.filter(n => !n.is_read).length;
      const readCount = notificationsData.filter(n => n.is_read).length;
      
      setStats({
        total_notifications: totalCount,
        unread_count: unreadCount,
        read_count: readCount,
      });
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadNotifications(1, pagination.pageSize);
  }, []);

  // Gérer le changement de page
  const handlePageChange = (page) => {
    loadNotifications(page, pagination.pageSize);
  };

  // Gérer le changement de taille de page
  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize }));
    loadNotifications(1, newPageSize);
  };

  // Marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      await RecruteurNotificationService.markAsRead([id]);
      
      const updated = notifications.map(notif => 
        notif.id === id ? { ...notif, is_read: true } : notif
      );
      setNotifications(updated);
      
      // Mettre à jour les stats
      const unreadCount = updated.filter(n => !n.is_read).length;
      const readCount = updated.filter(n => n.is_read).length;
      setStats({
        total_notifications: pagination.totalCount,
        unread_count: unreadCount,
        read_count: readCount,
      });
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      await RecruteurNotificationService.markAllAsRead();
      const updated = notifications.map(notif => ({ ...notif, is_read: true }));
      setNotifications(updated);
      
      // Mettre à jour les stats
      setStats({
        total_notifications: pagination.totalCount,
        unread_count: 0,
        read_count: updated.length,
      });
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  // Gestion sélection
  const toggleNotificationSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  // Marquer sélectionnées comme lues
  const markSelectedAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      setBulkActionLoading(true);
      await RecruteurNotificationService.markAsRead(selectedNotifications);
      
      const updated = notifications.map(notif => 
        selectedNotifications.includes(notif.id) 
          ? { ...notif, is_read: true } 
          : notif
      );
      setNotifications(updated);
      
      // Mettre à jour les stats
      const unreadCount = updated.filter(n => !n.is_read).length;
      const readCount = updated.filter(n => n.is_read).length;
      setStats({
        total_notifications: pagination.totalCount,
        unread_count: unreadCount,
        read_count: readCount,
      });
      
      setSelectedNotifications([]);
    } catch (error) {
      console.error('❌ Erreur:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Séparer les notifications
  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  return (
    <div className="bg-gray-50 min-h-screen">
      {loading && notifications.length === 0 ? (
        <LoadingSpinner variant="page" size="lg" text="Chargement des notifications..." />
      ) : (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Gérez vos notifications et restez informé</p>
            </div>
            <div className="flex space-x-3">
              {selectedNotifications.length > 0 && (
                <button 
                  onClick={markSelectedAsRead}
                  disabled={bulkActionLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  <i className="fas fa-check mr-2"></i>
                  {bulkActionLoading ? 'Traitement...' : `Marquer ${selectedNotifications.length} comme lu(es)`}
                </button>
              )}
              <button 
                onClick={markAllAsRead}
                disabled={stats.unread_count === 0}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <i className="fas fa-check-double mr-2"></i>
                Tout marquer comme lu
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_notifications || 0}</p>
              </div>
              <i className="fas fa-bell text-4xl text-gray-300"></i>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Non lues</p>
                <p className="text-3xl font-bold text-red-600">{stats.unread_count || 0}</p>
              </div>
              <i className="fas fa-envelope text-4xl text-red-300"></i>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lues</p>
                <p className="text-3xl font-bold text-green-600">{stats.read_count || 0}</p>
              </div>
              <i className="fas fa-check-circle text-4xl text-green-300"></i>
            </div>
          </div>
        </div>

        {/* Notifications non lues */}
        {unreadNotifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <i className="fas fa-envelope text-red-500 mr-2"></i>
              Non lues ({unreadNotifications.length})
            </h2>
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              {unreadNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onSelect={toggleNotificationSelection}
                  isSelected={selectedNotifications.includes(notification.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Notifications lues */}
        {readNotifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              Lues ({readNotifications.length})
            </h2>
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              {readNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onSelect={toggleNotificationSelection}
                  isSelected={selectedNotifications.includes(notification.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Aucune notification */}
        {notifications.length === 0 && !loading && (
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
            <NotificationPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Notifications;
