import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PrestataireSettings = () => {
  const [activeTab, setActiveTab] = useState('services');

  const tabs = [
    { id: 'services', name: 'Services', icon: 'fas fa-tools' },
    { id: 'profile', name: 'Profil', icon: 'fas fa-user' },
    { id: 'pricing', name: 'Tarification', icon: 'fas fa-dollar-sign' },
    { id: 'notifications', name: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', name: 'Sécurité', icon: 'fas fa-shield-alt' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres Prestataire</h1>
        <p className="text-gray-600 mt-1">Gérez vos services et vos préférences</p>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4 border-r border-gray-200">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition duration-200 ${
                      activeTab === tab.id
                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <i className={`${tab.icon} mr-3 w-4 h-4`}></i>
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 p-6">
          {activeTab === 'services' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes Services</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Services proposés</h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200">
                    <i className="fas fa-plus mr-2"></i>Ajouter un service
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">Développement Web</h4>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Création de sites web et applications</p>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-600 font-semibold">25 000 FCFA</span>
                      <span className="text-green-600 text-sm">Actif</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">Design Graphique</h4>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Logos, affiches, supports marketing</p>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-600 font-semibold">15 000 FCFA</span>
                      <span className="text-green-600 text-sm">Actif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil Prestataire</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise/Organisation
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="votre.email@entreprise.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ville, Pays"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Décrivez vos compétences et expériences..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-200"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tarification</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Stratégie de tarification</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input type="radio" name="pricing" className="text-purple-600 focus:ring-purple-500" />
                      <span className="ml-3 text-gray-700">Tarif horaire</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="pricing" className="text-purple-600 focus:ring-purple-500" />
                      <span className="ml-3 text-gray-700">Tarif par projet</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="pricing" className="text-purple-600 focus:ring-purple-500" />
                      <span className="ml-3 text-gray-700">Tarif mensuel</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Devises acceptées</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['FCFA', 'EUR', 'USD', 'GBP'].map((currency) => (
                      <label key={currency} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="ml-3 text-gray-700">{currency}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Méthodes de paiement</h3>
                  <div className="space-y-3">
                    {['Carte bancaire', 'Mobile Money', 'Virement bancaire', 'PayPal'].map((method) => (
                      <label key={method} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="ml-3 text-gray-700">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications par email</h3>
                  <div className="space-y-4">
                    {[
                      'Nouvelles demandes de service',
                      'Messages des clients',
                      'Paiements reçus',
                      'Évaluations et commentaires',
                      'Newsletter'
                    ].map((notification) => (
                      <label key={notification} className="flex items-center justify-between">
                        <span className="text-gray-700">{notification}</span>
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sécurité</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-200"
                    >
                      Changer le mot de passe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrestataireSettings;
