import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../MessageManager';
import { authService } from '../../services/authService';

const BaseSettings = ({ children, userType }) => {
  const { user, updateUser } = useAuth();
  const { success, error } = useMessage();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileVisibility: 'PUBLIC'
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    jobAlerts: true,
    newsletter: false
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'PUBLIC',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  // Charger les données du profil au montage
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await authService.getProfile();
      
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        profileVisibility: profile.profile_visibility || 'PUBLIC'
      });
      
      setPrivacy(prev => ({
        ...prev,
        profileVisibility: profile.profile_visibility || 'PUBLIC'
      }));
    } catch (err) {
      error('Erreur', 'Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const updateData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        profile_visibility: privacy.profileVisibility
      };

      await authService.updateProfile(updateData);
      
      // Mettre à jour le contexte utilisateur
      if (updateUser) {
        updateUser({
          ...user,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          profile_visibility: privacy.profileVisibility
        });
      }
      
      success('Succès', 'Profil mis à jour avec succès');
    } catch (err) {
      error('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (passwords) => {
    try {
      setLoading(true);
      await authService.changePassword(passwords);
      success('Succès', 'Mot de passe modifié avec succès');
      return true;
    } catch (err) {
      error('Erreur', 'Impossible de modifier le mot de passe');
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.firstName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fuchsia-600"></div>
      </div>
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
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-gray-600 mt-1">Gérez vos préférences et informations personnelles</p>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-save mr-2"></i>
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'profile' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Profil
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'notifications' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-bell mr-2"></i>Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'privacy' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-shield-alt mr-2"></i>Confidentialité
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'security' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-lock mr-2"></i>Sécurité
              </button>
            </div>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-user mr-2 text-fuchsia-600"></i>
                Informations du profil
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-bell mr-2 text-fuchsia-600"></i>
                Paramètres de notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications par email</h3>
                    <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications push</h3>
                    <p className="text-sm text-gray-600">Recevoir les notifications sur le navigateur</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Alertes d'emploi</h3>
                    <p className="text-sm text-gray-600">Être notifié des nouvelles offres correspondant à votre profil</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.jobAlerts}
                      onChange={() => handleNotificationChange('jobAlerts')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Newsletter</h3>
                    <p className="text-sm text-gray-600">Recevoir les actualités et conseils par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={() => handleNotificationChange('newsletter')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-shield-alt mr-2 text-fuchsia-600"></i>
                Paramètres de confidentialité
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibilité du profil</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="RECRUITERS_ONLY">Recruteurs uniquement</option>
                    <option value="PRIVATE">Privé</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Afficher l'email</h3>
                      <p className="text-sm text-gray-600">Permettre aux recruteurs de voir votre email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.showEmail}
                        onChange={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Afficher le téléphone</h3>
                      <p className="text-sm text-gray-600">Permettre aux recruteurs de voir votre téléphone</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.showPhone}
                        onChange={() => handlePrivacyChange('showPhone', !privacy.showPhone)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Autoriser les messages</h3>
                      <p className="text-sm text-gray-600">Permettre aux recruteurs de vous contacter</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy.allowMessages}
                        onChange={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-lock mr-2 text-fuchsia-600"></i>
                Sécurité du compte
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                  <PasswordChangeForm onSubmit={handleChangePassword} loading={loading} />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Authentification à deux facteurs</h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS</h4>
                      <p className="text-sm text-gray-600">Recevoir un code par SMS</p>
                    </div>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200">
                      Activer
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4 text-red-600">Zone dangereuse</h3>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Supprimer le compte</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenu spécifique au type d'utilisateur */}
          {children}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Account Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-user-circle mr-2 text-fuchsia-600"></i>
              Résumé du compte
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-user text-fuchsia-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{profileData.firstName} {profileData.lastName}</h4>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                  <p className="text-xs text-fuchsia-600 font-medium capitalize">{userType}</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-medium">Janvier 2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dernière connexion</span>
                  <span className="font-medium">Aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <a href={`/${userType.toLowerCase()}/profil`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-eye text-fuchsia-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Voir mon profil</h4>
                  <p className="text-xs text-gray-500">Comment les autres me voient</p>
                </div>
              </a>
              
              <a href={`/${userType.toLowerCase()}/editer-profil`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-edit text-green-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Modifier le profil</h4>
                  <p className="text-xs text-gray-500">Mettre à jour mes informations</p>
                </div>
              </a>
              
              <a href={`/${userType.toLowerCase()}/notification`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-bell text-purple-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                  <p className="text-xs text-gray-500">Gérer mes alertes</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Composant pour le changement de mot de passe
const PasswordChangeForm = ({ onSubmit, loading }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!passwords.oldPassword) newErrors.oldPassword = 'Mot de passe actuel requis';
    if (!passwords.newPassword) newErrors.newPassword = 'Nouveau mot de passe requis';
    if (passwords.newPassword.length < 8) newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    if (passwords.newPassword !== passwords.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(passwords);
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
        <input
          type="password"
          value={passwords.oldPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, oldPassword: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent ${
            errors.oldPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Entrez votre mot de passe actuel"
        />
        {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
        <input
          type="password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent ${
            errors.newPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Entrez votre nouveau mot de passe"
        />
        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
        <input
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Confirmez votre nouveau mot de passe"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Modification...' : 'Changer le mot de passe'}
      </button>
    </form>
  );
};

export default BaseSettings; 