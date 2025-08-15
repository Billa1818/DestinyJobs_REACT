import React, { useState } from 'react';
import authService from '../../services/authService';

const PasswordManagement = () => {
  const [activeTab, setActiveTab] = useState('change');
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (changePasswordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await authService.changePassword({
        oldPassword: changePasswordData.oldPassword,
        newPassword: changePasswordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setChangePasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors du changement de mot de passe' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setMessage({ type: 'error', text: 'Veuillez saisir votre email' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await authService.resetPassword(resetEmail);
      
      setMessage({ type: 'success', text: 'Email de réinitialisation envoyé. Vérifiez votre boîte mail.' });
      setResetEmail('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'envoi de l\'email' });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          <i className="fas fa-lock mr-2 text-fuchsia-600"></i>
          Gestion des mots de passe
        </h2>
        <p className="text-gray-600 mt-1">Sécurisez votre compte en gérant vos mots de passe</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('change')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'change' 
                ? 'bg-white text-fuchsia-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-key mr-2"></i>Changer le mot de passe
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'reset' 
                ? 'bg-white text-fuchsia-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-unlock mr-2"></i>Réinitialiser le mot de passe
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <i className={`fas ${
                message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'
              } mr-2`}></i>
              <p>{message.text}</p>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'change' && (
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={changePasswordData.oldPassword}
                onChange={(e) => setChangePasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={changePasswordData.newPassword}
                onChange={(e) => setChangePasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
                minLength={8}
              />
              <p className="text-sm text-gray-500 mt-1">
                Le mot de passe doit contenir au moins 8 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={changePasswordData.confirmPassword}
                onChange={(e) => setChangePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span><i className="fas fa-spinner fa-spin mr-2"></i>Modification...</span>
              ) : (
                <span><i className="fas fa-save mr-2"></i>Modifier le mot de passe</span>
              )}
            </button>
          </form>
        )}

        {/* Reset Password Tab */}
        {activeTab === 'reset' && (
          <div className="space-y-6">
            {/* Request Reset */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                <i className="fas fa-envelope mr-2 text-blue-600"></i>
                Demander une réinitialisation
              </h3>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span><i className="fas fa-spinner fa-spin mr-2"></i>Envoi...</span>
                  ) : (
                    <span><i className="fas fa-paper-plane mr-2"></i>Envoyer l'email</span>
                  )}
                </button>
              </form>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordManagement; 