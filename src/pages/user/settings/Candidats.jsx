import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidatsSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: 'fas fa-user' },
    { id: 'cv', name: 'CV & Documents', icon: 'fas fa-file-alt' },
    { id: 'preferences', name: 'Préférences', icon: 'fas fa-cog' },
    { id: 'notifications', name: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', name: 'Sécurité', icon: 'fas fa-shield-alt' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres Candidat</h1>
        <p className="text-gray-600 mt-1">Gérez votre profil et vos préférences</p>
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
                        ? 'bg-fuchsia-50 text-fuchsia-700 border-r-2 border-fuchsia-500'
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
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations du profil</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="votre.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Ville, Pays"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Parlez-nous de vous..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-fuchsia-600 text-white px-6 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'cv' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">CV & Documents</h2>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <i className="fas fa-file-upload text-4xl text-gray-400 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ajouter votre CV</h3>
                  <p className="text-gray-600 mb-4">Formats acceptés : PDF, DOC, DOCX (max 5MB)</p>
                  <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200">
                    Choisir un fichier
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Documents téléchargés</h3>
                  <p className="text-gray-600">Aucun document téléchargé</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Préférences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Types d'emploi recherchés</h3>
                  <div className="space-y-3">
                    {['Temps plein', 'Temps partiel', 'Freelance', 'Stage', 'Alternance'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                        <span className="ml-3 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Secteurs d'activité</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Technologie', 'Marketing', 'Finance', 'Santé', 'Éducation', 'Commerce'].map((sector) => (
                      <label key={sector} className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                        <span className="ml-3 text-gray-700">{sector}</span>
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
                      'Nouvelles offres d\'emploi',
                      'Mise à jour de candidature',
                      'Invitations à des entretiens',
                      'Messages des recruteurs',
                      'Newsletter hebdomadaire'
                    ].map((notification) => (
                      <label key={notification} className="flex items-center justify-between">
                        <span className="text-gray-700">{notification}</span>
                        <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-fuchsia-600 text-white px-6 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200"
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

export default CandidatsSettings;
