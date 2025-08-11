import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SessionManagement = () => {
  const { getSessions, invalidateSession, logoutAll, user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmLogoutAll, setConfirmLogoutAll] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSessions();
    } else {
      setLoading(false);
      setError('Vous devez être connecté pour gérer vos sessions');
    }
  }, [isAuthenticated, user]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getSessions();
      setSessions(data.sessions || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else if (err.response?.status === 403) {
        setError('Vous n\'avez pas les permissions pour accéder à cette fonctionnalité.');
      } else {
        setError('Erreur lors du chargement des sessions. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidateSession = async (sessionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir invalider cette session ?')) {
      return;
    }

    try {
      await invalidateSession(sessionId);
      // Recharger la liste des sessions
      fetchSessions();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors de l\'invalidation de la session. Veuillez réessayer.');
      }
    }
  };

  const handleLogoutAllSessions = async () => {
    if (!confirmLogoutAll) {
      setConfirmLogoutAll(true);
      return;
    }

    try {
      setLogoutAllLoading(true);
      await logoutAll();
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    } catch (err) {
      setError('Erreur lors de la déconnexion de toutes les sessions. Veuillez réessayer.');
      setConfirmLogoutAll(false);
    } finally {
      setLogoutAllLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return 'fas fa-mobile-alt text-blue-600';
      case 'tablet':
        return 'fas fa-tablet-alt text-green-600';
      case 'desktop':
      default:
        return 'fas fa-desktop text-purple-600';
    }
  };

  const getBrowserIcon = (browser) => {
    const browserLower = browser?.toLowerCase();
    if (browserLower?.includes('chrome')) return 'fab fa-chrome text-blue-600';
    if (browserLower?.includes('firefox')) return 'fab fa-firefox text-orange-600';
    if (browserLower?.includes('safari')) return 'fab fa-safari text-blue-500';
    if (browserLower?.includes('edge')) return 'fab fa-edge text-blue-600';
    return 'fas fa-globe text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement des sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-600">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              <i className="fas fa-shield-alt mr-2 text-fuchsia-600"></i>
              Gestion des sessions
            </h2>
            <p className="text-gray-600 mt-1">
              Gérez vos sessions actives et sécurisez votre compte
            </p>
          </div>
          
          {/* Logout All Button */}
          <div className="flex items-center space-x-3">
            {confirmLogoutAll && (
              <span className="text-sm text-red-600">
                Cliquez à nouveau pour confirmer
              </span>
            )}
            <button
              onClick={handleLogoutAllSessions}
              disabled={logoutAllLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                confirmLogoutAll
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              {logoutAllLoading ? (
                <span><i className="fas fa-spinner fa-spin mr-2"></i>Déconnexion...</span>
              ) : (
                <span><i className="fas fa-sign-out-alt mr-2"></i>Déconnexion totale</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="p-6">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <i className="fas fa-info-circle text-3xl mb-3"></i>
            <p>Aucune session active</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                className={`border rounded-lg p-4 ${
                  session.is_active && !session.is_expired
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {/* Device Icon */}
                      <div className="flex items-center space-x-2">
                        <i className={getDeviceIcon(session.device_info?.device_type)}></i>
                        <span className="text-sm font-medium text-gray-900">
                          {session.device_info?.device_type || 'Inconnu'}
                        </span>
                      </div>

                      {/* Browser Icon */}
                      <div className="flex items-center space-x-2">
                        <i className={getBrowserIcon(session.device_info?.browser)}></i>
                        <span className="text-sm text-gray-600">
                          {session.device_info?.browser || 'Inconnu'}
                        </span>
                      </div>

                      {/* OS */}
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-desktop text-gray-500"></i>
                        <span className="text-sm text-gray-600">
                          {session.device_info?.os || 'Inconnu'}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.is_active && !session.is_expired
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {session.is_active && !session.is_expired ? 'Active' : 'Expirée'}
                      </span>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">IP:</span>
                        <span className="ml-2 font-mono text-gray-900">{session.ip_address}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Créée le:</span>
                        <span className="ml-2 text-gray-900">{formatDate(session.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dernière activité:</span>
                        <span className="ml-2 text-gray-900">{formatDate(session.last_activity)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expire le:</span>
                        <span className="ml-2 text-gray-900">{formatDate(session.expires_at)}</span>
                      </div>
                    </div>

                    {/* User Agent */}
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">User Agent:</span>
                      <p className="text-xs text-gray-500 mt-1 font-mono break-all">
                        {session.user_agent}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4">
                    {session.is_active && !session.is_expired && (
                      <button
                        onClick={() => handleInvalidateSession(session.session_id)}
                        className="text-red-600 hover:text-red-800 transition duration-200"
                        title="Invalider cette session"
                      >
                        <i className="fas fa-times-circle text-lg"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {sessions.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total des sessions: {sessions.length}</span>
              <span>
                Sessions actives: {sessions.filter(s => s.is_active && !s.is_expired).length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManagement; 