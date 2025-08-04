import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecruteurSettings = () => {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', name: 'Entreprise', icon: 'fas fa-building' },
    { id: 'profile', name: 'Profil', icon: 'fas fa-user' },
    { id: 'billing', name: 'Facturation', icon: 'fas fa-credit-card' },
    { id: 'notifications', name: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', name: 'Sécurité', icon: 'fas fa-shield-alt' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres Recruteur</h1>
        <p className="text-gray-600 mt-1">Gérez votre entreprise et vos préférences</p>
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
                        ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
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
          {activeTab === 'company' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de l'entreprise</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur d'activité
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Sélectionner un secteur</option>
                      <option>Technologie</option>
                      <option>Marketing</option>
                      <option>Finance</option>
                      <option>Santé</option>
                      <option>Éducation</option>
                      <option>Commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille de l'entreprise
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Sélectionner une taille</option>
                      <option>1-10 employés</option>
                      <option>11-50 employés</option>
                      <option>51-200 employés</option>
                      <option>201-1000 employés</option>
                      <option>1000+ employés</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://www.votre-entreprise.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description de l'entreprise
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Décrivez votre entreprise..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profil personnel</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Votre poste dans l'entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="votre.email@entreprise.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Facturation</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Plan actuel</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold text-green-600">Plan Premium</p>
                      <p className="text-gray-600">50 offres d'emploi par mois</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">50 000 FCFA</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Méthode de paiement</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="text-green-600 focus:ring-green-500" />
                      <span className="ml-3 text-gray-700">Carte bancaire</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="text-green-600 focus:ring-green-500" />
                      <span className="ml-3 text-gray-700">Mobile Money</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="payment" className="text-green-600 focus:ring-green-500" />
                      <span className="ml-3 text-gray-700">Virement bancaire</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Historique des factures</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">Aucune facture disponible</p>
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
                      'Nouvelles candidatures',
                      'Mise à jour de candidature',
                      'Messages des candidats',
                      'Rapports hebdomadaires',
                      'Newsletter'
                    ].map((notification) => (
                      <label key={notification} className="flex items-center justify-between">
                        <span className="text-gray-700">{notification}</span>
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
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

export default RecruteurSettings;
