import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Simulation d'envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Contactez-nous</h1>
          <p className="text-gray-600 text-lg">Nous sommes là pour vous aider et répondre à toutes vos questions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Informations de contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
              Informations de contact
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-envelope text-fuchsia-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">contact@destinyjobs.bj</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-phone text-fuchsia-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Téléphone</h3>
                  <p className="text-gray-600">+229 XX XX XX XX</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-fuchsia-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Adresse</h3>
                  <p className="text-gray-600">Cotonou, Bénin</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-fuchsia-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Horaires d'ouverture</h3>
                  <p className="text-gray-600">Lun - Ven: 8h00 - 18h00</p>
                  <p className="text-gray-600">Sam: 9h00 - 13h00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-question-circle mr-2 text-fuchsia-600"></i>
              Questions fréquentes
            </h2>
            
            <div className="space-y-3">
              <Link 
                to="/faq" 
                className="block text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
              >
                Comment créer un compte ?
              </Link>
              <Link 
                to="/faq" 
                className="block text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
              >
                Comment publier une offre d'emploi ?
              </Link>
              <Link 
                to="/faq" 
                className="block text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
              >
                Comment postuler à une offre ?
              </Link>
              <Link 
                to="/faq" 
                className="block text-fuchsia-600 hover:text-fuchsia-700 transition-colors duration-200"
              >
                Comment contacter le support ?
              </Link>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-paper-plane mr-2 text-fuchsia-600"></i>
            Envoyez-nous un message
          </h2>

          {/* Messages de succès et d'erreur */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <i className="fas fa-check-circle text-green-400 mt-0.5"></i>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <i className="fas fa-exclamation-circle text-red-400 mt-0.5"></i>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="general">Question générale</option>
                <option value="support">Support technique</option>
                <option value="partnership">Partenariat</option>
                <option value="feedback">Retour d'expérience</option>
                <option value="bug">Signalement de bug</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Décrivez votre demande en détail..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fuchsia-600 text-white py-3 px-6 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Envoi en cours...
                </span>
              ) : (
                <span>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Envoyer le message
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Section des réseaux sociaux */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Suivez-nous sur les réseaux sociaux
        </h2>
        
        <div className="flex justify-center space-x-6">
          <a
            href="#"
            className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
            title="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          
          <a
            href="#"
            className="w-12 h-12 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
            title="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          
          <a
            href="#"
            className="w-12 h-12 bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors duration-200"
            title="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          
          <a
            href="#"
            className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors duration-200"
            title="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact; 