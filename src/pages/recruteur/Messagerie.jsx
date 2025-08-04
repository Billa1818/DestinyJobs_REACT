import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Messagerie = () => {
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [selectedCandidat, setSelectedCandidat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('offres');

  const offres = [
    {
      id: 1,
      titre: 'Développeur Full Stack Senior',
      entreprise: 'Tech Solutions SARL',
      statut: 'active',
      candidats: 15,
      derniereActivite: 'Il y a 2 heures',
      nonLus: 3
    },
    {
      id: 2,
      titre: 'Chef de projet IT',
      entreprise: 'Digital Innovation',
      statut: 'active',
      candidats: 8,
      derniereActivite: 'Il y a 1 jour',
      nonLus: 1
    },
    {
      id: 3,
      titre: 'Marketing Manager',
      entreprise: 'Growth Marketing',
      statut: 'active',
      candidats: 12,
      derniereActivite: 'Il y a 3 jours',
      nonLus: 0
    }
  ];

  const candidats = [
    {
      id: 1,
      nom: 'Amina Kone',
      email: 'amina.kone@email.com',
      offre: 'Développeur Full Stack Senior',
      statut: 'selectionne',
      avatar: 'AK',
      derniereActivite: 'Il y a 2 heures',
      nonLus: 2
    },
    {
      id: 2,
      nom: 'Marc Dossou',
      email: 'marc.dossou@email.com',
      offre: 'Développeur Full Stack Senior',
      statut: 'en-cours',
      avatar: 'MD',
      derniereActivite: 'Il y a 1 jour',
      nonLus: 0
    },
    {
      id: 3,
      nom: 'Fatou Diallo',
      email: 'fatou.diallo@email.com',
      offre: 'Développeur Full Stack Senior',
      statut: 'finalise',
      avatar: 'FD',
      derniereActivite: 'Il y a 3 jours',
      nonLus: 0
    },
    {
      id: 4,
      nom: 'Kofi Mensah',
      email: 'kofi.mensah@email.com',
      offre: 'Développeur Full Stack Senior',
      statut: 'selectionne',
      avatar: 'KM',
      derniereActivite: 'Il y a 30 minutes',
      nonLus: 1
    }
  ];

  const messages = [
    {
      id: 1,
      expediteur: 'recruteur',
      contenu: 'Bonjour Amina, nous avons bien reçu votre candidature. Pouvez-vous nous envoyer votre portfolio ?',
      date: '2024-01-15 10:30',
      lu: true
    },
    {
      id: 2,
      expediteur: 'recruteur',
      contenu: 'Parfait, nous l\'examinons et nous vous recontactons rapidement.',
      date: '2024-01-15 14:20',
      lu: false
    },
    {
      id: 3,
      expediteur: 'recruteur',
      contenu: 'Nous avons examiné votre portfolio et nous souhaitons organiser un entretien.',
      date: '2024-01-16 09:15',
      lu: false
    }
  ];

  const envoyerMessage = () => {
    if (messageText.trim() && selectedCandidat) {
      console.log('Envoi du message à', selectedCandidat.nom, ':', messageText);
      // Ici on ajouterait la logique pour envoyer le message par email
      setMessageText('');
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'selectionne': return 'text-green-600 bg-green-100';
      case 'en-cours': return 'text-yellow-600 bg-yellow-100';
      case 'finalise': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'selectionne': return 'Sélectionné';
      case 'en-cours': return 'En cours';
      case 'finalise': return 'Finalisé';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messagerie</h1>
          <p className="text-gray-600">Envoyez des messages aux candidats sélectionnés par offre</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('offres')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'offres'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-briefcase mr-2"></i>
                Par offre
              </button>
              <button
                onClick={() => setActiveTab('candidats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'candidats'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-users mr-2"></i>
                Tous les candidats
              </button>
            </nav>
          </div>

          <div className="flex h-96">
            {/* Liste des offres ou candidats */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4">
                {activeTab === 'offres' ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Offres</h3>
                    <div className="space-y-2">
                      {offres.map((offre) => (
                        <div
                          key={offre.id}
                          onClick={() => setSelectedOffre(offre)}
                          className={`p-3 rounded-lg cursor-pointer transition duration-200 ${
                            selectedOffre?.id === offre.id
                              ? 'bg-fuchsia-50 border border-fuchsia-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-fuchsia-600 flex items-center justify-center">
                              <i className="fas fa-briefcase text-white text-sm"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{offre.titre}</h4>
                                {offre.nonLus > 0 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {offre.nonLus}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate">{offre.entreprise}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-400">{offre.candidats} candidats</span>
                                <span className="text-xs text-gray-400">{offre.derniereActivite}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Candidats</h3>
                    <div className="space-y-2">
                      {candidats.map((candidat) => (
                        <div
                          key={candidat.id}
                          onClick={() => setSelectedCandidat(candidat)}
                          className={`p-3 rounded-lg cursor-pointer transition duration-200 ${
                            selectedCandidat?.id === candidat.id
                              ? 'bg-fuchsia-50 border border-fuchsia-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-fuchsia-600 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{candidat.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{candidat.nom}</h4>
                                {candidat.nonLus > 0 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {candidat.nonLus}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 truncate">{candidat.offre}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(candidat.statut)}`}>
                                  {getStatutText(candidat.statut)}
                                </span>
                                <span className="text-xs text-gray-400">{candidat.derniereActivite}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col">
              {selectedCandidat ? (
                <>
                  {/* Header du chat */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{selectedCandidat.avatar}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{selectedCandidat.nom}</h3>
                        <p className="text-xs text-gray-500">{selectedCandidat.email}</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(selectedCandidat.statut)}`}>
                          {getStatutText(selectedCandidat.statut)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className="flex justify-end"
                        >
                          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-fuchsia-600 text-white">
                            <p className="text-sm">{message.contenu}</p>
                            <p className="text-xs mt-1 text-fuchsia-100">
                              {message.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Zone de saisie */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && envoyerMessage()}
                      />
                      <button
                        onClick={envoyerMessage}
                        disabled={!messageText.trim()}
                        className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start">
                        <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
                        <div className="text-xs text-blue-700">
                          <p className="font-medium mb-1">Messages envoyés par email</p>
                          <p>Les candidats ne peuvent pas répondre directement. Ils recevront votre message par email et pourront vous contacter via les coordonnées fournies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-comments text-gray-400 text-4xl mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === 'offres' ? 'Sélectionnez une offre' : 'Sélectionnez un candidat'}
                    </h3>
                    <p className="text-gray-500">
                      {activeTab === 'offres' 
                        ? 'Choisissez une offre pour voir les candidats et envoyer des messages'
                        : 'Choisissez un candidat pour commencer la conversation'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messagerie; 