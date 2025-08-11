import React, { useState } from 'react';
import { useMessage } from '../MessageManager';
import { authService } from '../../services';

const AuthExample = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    user_type: 'CANDIDAT',
    phone: '',
    terms_accepted: false
  });

  const [loginData, setLoginData] = useState({
    login: '',
    password: ''
  });

  const { success, error, info, warning } = useMessage();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // Validation basique
      if (!formData.terms_accepted) {
        warning('Attention', 'Veuillez accepter les conditions d\'utilisation');
        return;
      }

      if (formData.password !== formData.password2) {
        error('Erreur', 'Les mots de passe ne correspondent pas');
        return;
      }

      info('Inscription en cours...', 'Veuillez patienter');
      
      const result = await authService.register(formData);
      
      success('Inscription réussie !', `Bienvenue ${result.user.username}`);
      
      // Réinitialiser le formulaire
      setFormData({
        username: '',
        email: '',
        password: '',
        password2: '',
        user_type: 'CANDIDAT',
        phone: '',
        terms_accepted: false
      });
      
    } catch (err) {
      const errorMessage = authService.handleAuthError(err, 'Erreur lors de l\'inscription');
      error('Erreur d\'inscription', errorMessage);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      info('Connexion en cours...', 'Veuillez patienter');
      
      const result = await authService.login(loginData);
      
      success('Connexion réussie !', `Bienvenue ${result.user.first_name || result.user.username}`);
      
      // Réinitialiser le formulaire
      setLoginData({
        login: '',
        password: ''
      });
      
    } catch (err) {
      const errorMessage = authService.handleAuthError(err, 'Erreur de connexion');
      error('Erreur de connexion', errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      success('Déconnexion réussie', 'Vous avez été déconnecté avec succès');
    } catch (err) {
      error('Erreur de déconnexion', 'Une erreur est survenue lors de la déconnexion');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Exemple d'Authentification</h1>
      
      {/* Formulaire d'inscription */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Inscription</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'utilisateur
              </label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CANDIDAT">Candidat</option>
                <option value="RECRUTEUR">Recruteur</option>
                <option value="PRESTATAIRE">Prestataire</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms_accepted"
              checked={formData.terms_accepted}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              J'accepte les conditions d'utilisation
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            S'inscrire
          </button>
        </form>
      </div>

      {/* Formulaire de connexion */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ou nom d'utilisateur
            </label>
            <input
              type="text"
              name="login"
              value={loginData.login}
              onChange={handleLoginInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Se connecter
          </button>
        </form>
      </div>

      {/* Bouton de déconnexion */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Se déconnecter
        </button>
      </div>

      {/* Statut de connexion */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-700">
          Statut: {authService.isAuthenticated() ? 'Connecté' : 'Non connecté'}
        </p>
        {authService.isAuthenticated() && (
          <p className="text-sm text-gray-500 mt-1">
            Utilisateur: {authService.getCurrentUser()?.username}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthExample; 