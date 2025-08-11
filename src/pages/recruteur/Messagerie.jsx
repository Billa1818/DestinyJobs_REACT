import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Messagerie = () => {
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const offres = [
    {
      id: 1,
      titre: 'Développeur Full Stack Senior',
      entreprise: 'Tech Solutions SARL',
      statut: 'active',
      candidatsSelectionnes: 4,
      totalCandidats: 15,
      derniereActivite: 'Il y a 2 heures'
    },
    {
      id: 2,
      titre: 'Chef de projet IT',
      entreprise: 'Digital Innovation',
      statut: 'active',
      candidatsSelectionnes: 2,
      totalCandidats: 8,
      derniereActivite: 'Il y a 1 jour'
    },
    {
      id: 3,
      titre: 'Marketing Manager',
      entreprise: 'Growth Marketing',
      statut: 'active',
      candidatsSelectionnes: 3,
      totalCandidats: 12,
      derniereActivite: 'Il y a 3 jours'
    }
  ];

  const candidatsParOffre = {
    1: [ // Développeur Full Stack Senior
      {
        id: 1,
        nom: 'Amina Kone',
        email: 'amina.kone@email.com',
        statut: 'selectionne',
        avatar: 'AK',
        derniereActivite: 'Il y a 2 heures'
      },
      {
        id: 2,
        nom: 'Marc Dossou',
        email: 'marc.dossou@email.com',
        statut: 'selectionne',
        avatar: 'MD',
        derniereActivite: 'Il y a 1 jour'
      },
      {
        id: 3,
        nom: 'Fatou Diallo',
        email: 'fatou.diallo@email.com',
        statut: 'selectionne',
        avatar: 'FD',
        derniereActivite: 'Il y a 3 jours'
      },
      {
        id: 4,
        nom: 'Kofi Mensah',
        email: 'kofi.mensah@email.com',
        statut: 'selectionne',
        avatar: 'KM',
        derniereActivite: 'Il y a 30 minutes'
      }
    ],
    2: [ // Chef de projet IT
      {
        id: 5,
        nom: 'Pierre Adjo',
        email: 'pierre.adjo@email.com',
        statut: 'selectionne',
        avatar: 'PA',
        derniereActivite: 'Il y a 4 heures'
      },
      {
        id: 6,
        nom: 'Marie Kossi',
        email: 'marie.kossi@email.com',
        statut: 'selectionne',
        avatar: 'MK',
        derniereActivite: 'Il y a 1 jour'
      }
    ],
    3: [ // Marketing Manager
      {
        id: 7,
        nom: 'Jean Akpovi',
        email: 'jean.akpovi@email.com',
        statut: 'selectionne',
        avatar: 'JA',
        derniereActivite: 'Il y a 6 heures'
      },
      {
        id: 8,
        nom: 'Sarah Mensah',
        email: 'sarah.mensah@email.com',
        statut: 'selectionne',
        avatar: 'SM',
        derniereActivite: 'Il y a 2 jours'
      },
      {
        id: 9,
        nom: 'David Kone',
        email: 'david.kone@email.com',
        statut: 'selectionne',
        avatar: 'DK',
        derniereActivite: 'Il y a 1 jour'
      }
    ]
  };

  const envoyerMessage = () => {
    if (messageText.trim() && selectedOffre) {
      const candidatsSelectionnes = candidatsParOffre[selectedOffre.id] || [];
      console.log('Message envoyé à', candidatsSelectionnes.length, 'candidats:', messageText);
      console.log('Candidats:', candidatsSelectionnes.map(c => c.email));
      
      // Simuler l'envoi par email avec contenu HTML
      setMessageSent(true);
      setMessageText('');
      setShowMessageModal(false);
      
      // Vider l'éditeur
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      
      // Reset après 3 secondes
      setTimeout(() => {
        setMessageSent(false);
      }, 3000);
    }
  };

  const ouvrirModalMessage = (offre) => {
    setSelectedOffre(offre);
    setShowMessageModal(true);
    setMessageText('');
    
    // Réinitialiser l'éditeur après un court délai
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        editorRef.current.focus();
      }
    }, 100);
  };

  // Fonctions pour l'éditeur de texte riche
  const editorRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const getSelection = () => {
    return window.getSelection();
  };

  const isFormatActive = (format) => {
    return document.queryCommandState(format);
  };

  const insertLink = () => {
    const url = prompt('Entrez l\'URL :');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertList = (type) => {
    execCommand(type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messagerie</h1>
          <p className="text-gray-600">Envoyez des messages aux candidats sélectionnés par offre</p>
        </div>

        {/* Message de succès */}
        {messageSent && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              <span>Message envoyé avec succès aux candidats sélectionnés !</span>
            </div>
          </div>
        )}

        {/* Liste des offres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offres.map((offre) => (
            <div key={offre.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{offre.titre}</h3>
                    <p className="text-sm text-gray-600 mb-3">{offre.entreprise}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        <i className="fas fa-users mr-1"></i>
                        {offre.candidatsSelectionnes} sélectionnés / {offre.totalCandidats} total
                      </span>
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        {offre.derniereActivite}
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-fuchsia-600 flex items-center justify-center">
                    <i className="fas fa-briefcase text-white"></i>
                  </div>
                </div>

                {/* Candidats sélectionnés */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Candidats sélectionnés :</h4>
                  <div className="space-y-2">
                    {candidatsParOffre[offre.id]?.map((candidat) => (
                      <div key={candidat.id} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-fuchsia-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-fuchsia-600">{candidat.avatar}</span>
                        </div>
                        <span className="text-sm text-gray-600">{candidat.nom}</span>
                        <span className="text-xs text-gray-400">({candidat.email})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bouton envoyer message */}
                <button
                  onClick={() => ouvrirModalMessage(offre)}
                  className="w-full bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center justify-center"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Envoyer un message
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal pour composer le message */}
        {showMessageModal && selectedOffre && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  <i className="fas fa-envelope mr-2 text-fuchsia-600"></i>
                  Envoyer un message
                </h2>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Informations de l'offre */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedOffre.titre}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedOffre.entreprise}</p>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Destinataires :</span> {candidatsParOffre[selectedOffre.id]?.length || 0} candidats sélectionnés
                </div>
              </div>

              {/* Liste des destinataires */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Destinataires :</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {candidatsParOffre[selectedOffre.id]?.map((candidat) => (
                    <div key={candidat.id} className="flex items-center space-x-2 text-sm">
                      <div className="w-6 h-6 bg-fuchsia-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-fuchsia-600">{candidat.avatar}</span>
                      </div>
                      <span className="text-gray-900">{candidat.nom}</span>
                      <span className="text-gray-500">({candidat.email})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Éditeur de texte riche */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message :
                </label>
                
                {/* Barre d'outils de l'éditeur */}
                <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap items-center gap-1">
                  {/* Formatage de texte */}
                  <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                    <button
                      onClick={() => execCommand('bold')}
                      className={`p-2 rounded hover:bg-gray-200 ${isFormatActive('bold') ? 'bg-gray-300' : ''}`}
                      title="Gras"
                    >
                      <i className="fas fa-bold text-sm"></i>
                    </button>
                    <button
                      onClick={() => execCommand('italic')}
                      className={`p-2 rounded hover:bg-gray-200 ${isFormatActive('italic') ? 'bg-gray-300' : ''}`}
                      title="Italique"
                    >
                      <i className="fas fa-italic text-sm"></i>
                    </button>
                    <button
                      onClick={() => execCommand('underline')}
                      className={`p-2 rounded hover:bg-gray-200 ${isFormatActive('underline') ? 'bg-gray-300' : ''}`}
                      title="Souligné"
                    >
                      <i className="fas fa-underline text-sm"></i>
                    </button>
                  </div>

                  {/* Alignement */}
                  <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                    <button
                      onClick={() => execCommand('justifyLeft')}
                      className="p-2 rounded hover:bg-gray-200"
                      title="Aligner à gauche"
                    >
                      <i className="fas fa-align-left text-sm"></i>
                    </button>
                    <button
                      onClick={() => execCommand('justifyCenter')}
                      className="p-2 rounded hover:bg-gray-200"
                      title="Centrer"
                    >
                      <i className="fas fa-align-center text-sm"></i>
                    </button>
                    <button
                      onClick={() => execCommand('justifyRight')}
                      className="p-2 rounded hover:bg-gray-200"
                      title="Aligner à droite"
                    >
                      <i className="fas fa-align-right text-sm"></i>
                    </button>
                  </div>

                  {/* Listes */}
                  <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                    <button
                      onClick={() => insertList('unordered')}
                      className="p-2 rounded hover:bg-gray-200"
                      title="Liste à puces"
                    >
                      <i className="fas fa-list-ul text-sm"></i>
                    </button>
                    <button
                      onClick={() => insertList('ordered')}
                      className="p-2 rounded hover:bg-gray-200"
                      title="Liste numérotée"
                    >
                      <i className="fas fa-list-ol text-sm"></i>
                    </button>
                  </div>

                  {/* Liens et couleurs */}
                  <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                    <button
                      onClick={insertLink}
                      className="p-2 rounded hover:bg-gray-200"
                      title="Insérer un lien"
                    >
                      <i className="fas fa-link text-sm"></i>
                    </button>
                    <input
                      type="color"
                      onChange={(e) => execCommand('foreColor', e.target.value)}
                      className="w-8 h-8 border-0 rounded cursor-pointer"
                      title="Couleur du texte"
                    />
                  </div>

                  {/* Taille de police */}
                  <div className="flex items-center">
                    <select
                      onChange={(e) => execCommand('fontSize', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                      title="Taille de police"
                    >
                      <option value="1">Petit</option>
                      <option value="3" selected>Normal</option>
                      <option value="5">Grand</option>
                      <option value="7">Très grand</option>
                    </select>
                  </div>
                </div>

                {/* Zone d'édition */}
                <div
                  ref={editorRef}
                  contentEditable
                  className="w-full h-32 p-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 overflow-y-auto bg-white"
                  style={{ 
                    minHeight: '128px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}
                  onInput={(e) => setMessageText(e.target.innerHTML)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && envoyerMessage()}
                  data-placeholder="Tapez votre message ici..."
                ></div>
                
                {/* Aide pour l'éditeur */}
                <div className="mt-2 text-xs text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  Utilisez la barre d'outils pour formater votre message (gras, italique, couleurs, etc.)
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={envoyerMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messagerie; 