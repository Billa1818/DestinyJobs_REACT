import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderSettingService from '../../services/ProviderSettingService';
import ProviderProfilService from '../../services/ProviderProfilService';

const Settings = () => {
  const navigate = useNavigate();
  
  // États pour les formulaires
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [resetData, setResetData] = useState({
    email: ''
  });

  const [confirmResetData, setConfirmResetData] = useState({
    token: '',
    new_password: '',
    confirm_password: ''
  });

  const [emailData, setEmailData] = useState({
    email: ''
  });

  // États pour l'interface
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Charger le profil utilisateur au montage
  useEffect(() => {
    loadUserProfile();
    loadSessions();
  }, []);

  // Charger le profil utilisateur
  const loadUserProfile = async () => {
    try {
      const profile = await ProviderProfilService.getUserProfile();
      setUserProfile(profile);
      setEmailData({ email: profile.email });
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
    }
  };

  // Charger les sessions actives
  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const sessionsData = await ProviderSettingService.getSessions();
      setSessions(sessionsData.sessions || []);
    } catch (err) {
      console.error('Erreur lors du chargement des sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Gérer les changements de champs
  const handleInputChange = (formName, field, value) => {
    switch (formName) {
      case 'password':
        setPasswordData(prev => ({ ...prev, [field]: value }));
        break;
      case 'reset':
        setResetData(prev => ({ ...prev, [field]: value }));
        break;
      case 'confirmReset':
        setConfirmResetData(prev => ({ ...prev, [field]: value }));
        break;
      case 'email':
        setEmailData(prev => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  // Changer le mot de passe
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const validation = ProviderSettingService.validatePasswordChange({
      old_password: passwordData.old_password,
      new_password: passwordData.new_password
    });

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await ProviderSettingService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });

      setSuccess('Mot de passe modifié avec succès !');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'Erreur lors du changement de mot de passe');
      } else {
        setError('Erreur lors du changement de mot de passe. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Demander la réinitialisation du mot de passe
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    const validation = ProviderSettingService.validatePasswordReset(resetData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await ProviderSettingService.requestPasswordReset(resetData);
      setSuccess('Email de réinitialisation envoyé. Vérifiez votre boîte de réception.');
      setResetData({ email: '' });
      
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  // Confirmer la réinitialisation du mot de passe
  const handleConfirmPasswordReset = async (e) => {
    e.preventDefault();
    
    if (confirmResetData.new_password !== confirmResetData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const validation = ProviderSettingService.validatePasswordResetConfirm({
      token: confirmResetData.token,
      new_password: confirmResetData.new_password
    });

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await ProviderSettingService.confirmPasswordReset({
        token: confirmResetData.token,
        new_password: confirmResetData.new_password
      });

      setSuccess('Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.');
      setConfirmResetData({ token: '', new_password: '', confirm_password: '' });
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'Erreur lors de la réinitialisation');
      } else {
        setError('Erreur lors de la réinitialisation. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Vérifier l'email
  const handleEmailVerification = async (e) => {
    e.preventDefault();
    
    if (!emailData.email) {
      setError('L\'email est requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await ProviderSettingService.verifyEmail(emailData);
      setSuccess('Email vérifié avec succès !');
      
      // Recharger le profil pour mettre à jour le statut
      setTimeout(() => {
        loadUserProfile();
      }, 1000);
      
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.error || 'Erreur lors de la vérification');
      } else {
        setError('Erreur lors de la vérification. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Demander l'envoi d'un email de vérification
  const handleRequestEmailVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await ProviderSettingService.requestEmailVerification();
      setSuccess('Email de vérification envoyé. Vérifiez votre boîte de réception.');
      
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email de vérification');
    } finally {
      setLoading(false);
    }
  };

  // Déconnecter de toutes les sessions
  const handleLogoutAllSessions = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir déconnecter toutes vos sessions ?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await ProviderSettingService.logoutAllSessions({ confirm: true });
      setSuccess(result.message || 'Déconnexion de toutes les sessions réussie');
      
      // Rediriger vers la page de connexion si la session actuelle a été invalidée
      if (result.force_logout) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Recharger les sessions
        setTimeout(() => {
          loadSessions();
        }, 1000);
      }
      
    } catch (err) {
      setError('Erreur lors de la déconnexion de toutes les sessions');
    } finally {
      setLoading(false);
    }
  };

  // Forcer la déconnexion de la session actuelle
  const handleForceLogout = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir forcer la déconnexion de cette session ?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await ProviderSettingService.forceLogout();
      setSuccess(result.message || 'Déconnexion forcée réussie');
      
      // Rediriger vers la page de connexion
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError('Erreur lors de la déconnexion forcée');
    } finally {
      setLoading(false);
    }
  };

  // Invalider une session spécifique
  const handleInvalidateSession = async (sessionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir invalider cette session ?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await ProviderSettingService.invalidateSession(sessionId);
      setSuccess('Session invalidée avec succès');
      
      // Recharger les sessions
      setTimeout(() => {
        loadSessions();
      }, 1000);
      
    } catch (err) {
      setError('Erreur lors de l\'invalidation de la session');
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  // Obtenir les informations de l'appareil
  const getDeviceInfo = (session) => {
    if (session.device_info) {
      return `${session.device_info.browser} sur ${session.device_info.os}`;
    }
    return 'Informations non disponibles';
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Paramètres de sécurité</h1>
          <p className="text-gray-600 mt-2">Gérez la sécurité de votre compte et vos sessions</p>
          </div>

        {/* Messages de succès/erreur */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-6">
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
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-key mr-2"></i>
                Mot de passe
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'email'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-envelope mr-2"></i>
                Vérification email
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-desktop mr-2"></i>
                Sessions actives
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Mot de passe */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ancien mot de passe
                      </label>
                      <input
                        type="password"
                        value={passwordData.old_password}
                        onChange={(e) => handleInputChange('password', 'old_password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
            </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
              <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => handleInputChange('password', 'new_password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
            </label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => handleInputChange('password', 'confirm_password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Modification...' : 'Changer le mot de passe'}
                    </button>
                  </form>
          </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Réinitialiser le mot de passe</h3>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
              <input
                        type="email"
                        value={resetData.email}
                        onChange={(e) => handleInputChange('reset', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="votre.email@exemple.com"
                        required
                      />
          </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Envoi...' : 'Envoyer l\'email de réinitialisation'}
                    </button>
                  </form>
          </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la réinitialisation</h3>
                  <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token de réinitialisation
                      </label>
              <input
                        type="text"
                        value={confirmResetData.token}
                        onChange={(e) => handleInputChange('confirmReset', 'token', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Token reçu par email"
                        required
                      />
          </div>
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
              <input
                        type="password"
                        value={confirmResetData.new_password}
                        onChange={(e) => handleInputChange('confirmReset', 'new_password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        minLength={8}
                      />
          </div>
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
              <input
                        type="password"
                        value={confirmResetData.confirm_password}
                        onChange={(e) => handleInputChange('confirmReset', 'confirm_password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
          </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Confirmation...' : 'Confirmer la réinitialisation'}
                    </button>
                  </form>
        </div>
      </div>
            )}

            {/* Tab: Vérification email */}
            {activeTab === 'email' && (
    <div className="space-y-6">
          <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Vérification de l'email</h3>
                  
                  {userProfile && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
          <div>
                          <p className="text-sm text-gray-600">Email actuel : <span className="font-medium text-gray-900">{userProfile.email}</span></p>
                          <p className="text-sm text-gray-600 mt-1">
                            Statut : 
                            <span className={`ml-2 font-medium ${userProfile.email_verified ? 'text-green-600' : 'text-red-600'}`}>
                              {userProfile.email_verified ? 'Vérifié' : 'Non vérifié'}
                            </span>
                          </p>
          </div>
                        {!userProfile.email_verified && (
                          <button
                            onClick={handleRequestEmailVerification}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 text-sm"
                          >
                            {loading ? 'Envoi...' : 'Demander la vérification'}
                          </button>
                        )}
          </div>
        </div>
                  )}

                  <form onSubmit={handleEmailVerification} className="space-y-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email à vérifier
            </label>
              <input
                        type="email"
                        value={emailData.email}
                        onChange={(e) => handleInputChange('email', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="votre.email@exemple.com"
                        required
                      />
          </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Vérification...' : 'Vérifier l\'email'}
                    </button>
                  </form>
          </div>
        </div>
            )}

            {/* Tab: Sessions actives */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Sessions actives</h3>
                  <div className="space-x-3">
                    <button
                      onClick={handleForceLogout}
                      disabled={loading}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Déconnexion...' : 'Forcer la déconnexion'}
          </button>
                    <button
                      onClick={handleLogoutAllSessions}
                      disabled={loading}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Déconnexion...' : 'Déconnecter toutes les sessions'}
          </button>
        </div>
      </div>

                {loadingSessions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des sessions...</p>
                  </div>
                ) : sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.session_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-3 h-3 rounded-full ${session.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-sm font-medium text-gray-900">
                                {getDeviceInfo(session)}
                              </span>
                              {session.is_current_session && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Session actuelle
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>IP : {session.ip_address}</p>
                              <p>Dernière activité : {formatDate(session.last_activity)}</p>
                              <p>Créée le : {formatDate(session.created_at)}</p>
                              {session.expires_at && (
                                <p>Expire le : {formatDate(session.expires_at)}</p>
                              )}
    </div>
      </div>
                          {!session.is_current_session && (
                <button
                              onClick={() => handleInvalidateSession(session.session_id)}
                              disabled={loading}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 text-sm"
                            >
                              Invalider
                </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-desktop text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-600">Aucune session active</p>
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

export default Settings; 