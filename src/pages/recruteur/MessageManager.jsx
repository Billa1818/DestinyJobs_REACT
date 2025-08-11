import React, { useState, useEffect } from 'react';

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Sample messages data
  const messagesData = [
    {
      id: 1,
      subject: "Opportunité développeur senior React",
      type: "job-offer",
      status: "sent", 
      date: "2024-06-25",
      recipients: 45,
      opened: 32,
      clicked: 8,
      content: "Nous recherchons un développeur React senior pour rejoindre notre équipe..."
    },
    {
      id: 2,
      subject: "Invitation événement tech",
      type: "event",
      status: "scheduled",
      date: "2024-06-28",
      recipients: 120,
      opened: 0,
      clicked: 0,
      content: "Vous êtes invité à notre événement tech du mois..."
    },
    {
      id: 3,
      subject: "Newsletter mensuelle - Juin",
      type: "info",
      status: "sent",
      date: "2024-06-20",
      recipients: 247,
      opened: 189,
      clicked: 23,
      content: "Découvrez les actualités de ce mois..."
    },
    {
      id: 4,
      subject: "Poste marketing digital",
      type: "job-offer",
      status: "draft",
      date: "2024-06-24",
      recipients: 0,
      opened: 0,
      clicked: 0,
      content: "Rejoignez notre équipe marketing..."
    },
    {
      id: 5,
      subject: "Formation JavaScript avancé",
      type: "event",
      status: "cancelled",
      date: "2024-06-22",
      recipients: 67,
      opened: 23,
      clicked: 5,
      content: "Formation annulée en raison de circonstances..."
    }
  ];

  useEffect(() => {
    setMessages(messagesData);
    setFilteredMessages(messagesData);
  }, []);

  useEffect(() => {
    let filtered = messages;
    
    if (searchQuery) {
      filtered = filtered.filter(msg => 
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }
    
    if (typeFilter) {
      filtered = filtered.filter(msg => msg.type === typeFilter);
    }
    
    setFilteredMessages(filtered);
  }, [messages, searchQuery, statusFilter, typeFilter]);

  // Status badges
  const getStatusBadge = (status) => {
    const badges = {
      'sent': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i className="fas fa-check mr-1"></i>Envoyé</span>,
      'scheduled': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i className="fas fa-clock mr-1"></i>Programmé</span>,
      'draft': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i className="fas fa-edit mr-1"></i>Brouillon</span>,
      'cancelled': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><i className="fas fa-times mr-1"></i>Annulé</span>
    };
    return badges[status] || status;
  };

  // Type badges
  const getTypeBadge = (type) => {
    const types = {
      'job-offer': <span className="text-xs text-gray-600"><i className="fas fa-briefcase mr-1"></i>Offre emploi</span>,
      'event': <span className="text-xs text-gray-600"><i className="fas fa-calendar mr-1"></i>Événement</span>,
      'info': <span className="text-xs text-gray-600"><i className="fas fa-info-circle mr-1"></i>Information</span>
    };
    return types[type] || type;
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMessages(filteredMessages.map(msg => msg.id));
    } else {
      setSelectedMessages([]);
    }
  };

  // Handle individual message selection
  const handleMessageSelect = (messageId, checked) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, messageId]);
    } else {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
    }
  };

  // Message actions
  const viewMessage = (message) => {
    setCurrentMessage(message);
    setShowDetailsModal(true);
  };

  const editMessage = (id) => {
    console.log('Edit message:', id);
    alert('Redirection vers la page d\'édition...');
  };

  const cancelMessage = (message) => {
    setCurrentMessage(message);
    setShowCancelModal(true);
  };

  const deleteMessage = (message) => {
    setCurrentMessage(message);
    setShowDeleteModal(true);
  };

  // Confirm actions
  const confirmDelete = () => {
    if (currentMessage) {
      setMessages(messages.filter(msg => msg.id !== currentMessage.id));
      setSelectedMessages(selectedMessages.filter(id => id !== currentMessage.id));
    }
    setShowDeleteModal(false);
    setCurrentMessage(null);
  };

  const confirmCancel = () => {
    if (currentMessage) {
      setMessages(messages.map(msg => 
        msg.id === currentMessage.id ? { ...msg, status: 'cancelled' } : msg
      ));
    }
    setShowCancelModal(false);
    setCurrentMessage(null);
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (selectedMessages.length > 0) {
      if (confirm(`Supprimer ${selectedMessages.length} message(s) sélectionné(s) ?`)) {
        setMessages(messages.filter(msg => !selectedMessages.includes(msg.id)));
        setSelectedMessages([]);
      }
    }
  };

  const handleBulkCancel = () => {
    const scheduledSelected = selectedMessages.filter(id => {
      const msg = messages.find(m => m.id === id);
      return msg && msg.status === 'scheduled';
    });
    
    if (scheduledSelected.length > 0) {
      if (confirm(`Annuler ${scheduledSelected.length} message(s) programmé(s) ?`)) {
        setMessages(messages.map(msg => 
          scheduledSelected.includes(msg.id) ? { ...msg, status: 'cancelled' } : msg
        ));
        setSelectedMessages([]);
      }
    } else {
      alert('Seuls les messages programmés peuvent être annulés.');
    }
  };

  const totalMessages = messages.length;
  const sentMessages = messages.filter(msg => msg.status === 'sent').length;
  const scheduledMessages = messages.filter(msg => msg.status === 'scheduled').length;
  const draftMessages = messages.filter(msg => msg.status === 'draft').length;
  const cancelledMessages = messages.filter(msg => msg.status === 'cancelled').length;

  return (
    <main className="flex-1 bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                <i className="fas fa-envelope text-fuchsia-600 mr-3"></i>
                Gestion des Messages
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Gérez tous vos messages envoyés aux candidats</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <i className="fas fa-paper-plane mr-1"></i>
                <span>{totalMessages}</span> messages
              </span>
              <a href="#" className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200 text-sm font-medium">
                <i className="fas fa-plus mr-2"></i>
                Nouveau message
              </a>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher par objet, contenu..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="sent">Envoyé</option>
                <option value="scheduled">Programmé</option>
                <option value="draft">Brouillon</option>
                <option value="cancelled">Annulé</option>
              </select>
              
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm"
              >
                <option value="">Tous les types</option>
                <option value="job-offer">Offre d'emploi</option>
                <option value="event">Événement</option>
                <option value="info">Information générale</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <i className="fas fa-check text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Envoyés</p>
                <p className="text-2xl font-bold text-gray-900">{sentMessages}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <i className="fas fa-clock text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Programmés</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledMessages}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <i className="fas fa-edit text-yellow-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900">{draftMessages}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <i className="fas fa-times text-red-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Annulés</p>
                <p className="text-2xl font-bold text-gray-900">{cancelledMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Liste des messages</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleBulkDelete}
                  disabled={selectedMessages.length === 0}
                  className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-trash mr-1"></i>
                  Supprimer sélectionnés
                </button>
                <button 
                  onClick={handleBulkCancel}
                  disabled={selectedMessages.length === 0}
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-ban mr-1"></i>
                  Annuler sélectionnés
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input 
                      type="checkbox" 
                      checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinataires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statistiques</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map(message => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedMessages.includes(message.id)}
                        onChange={(e) => handleMessageSelect(message.id, e.target.checked)}
                        className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{message.subject}</div>
                        <div className="text-xs text-gray-500 mt-1">{getTypeBadge(message.type)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{message.recipients} candidats</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(message.date).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      {message.status === 'sent' ? (
                        <div className="text-xs text-gray-600">
                          <div>📧 {message.opened}/{message.recipients} ouverts</div>
                          <div>🔗 {message.clicked} clics</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => viewMessage(message)} 
                          className="text-fuchsia-600 hover:text-fuchsia-800 text-sm"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {(message.status === 'draft' || message.status === 'scheduled') && (
                          <button 
                            onClick={() => editMessage(message.id)} 
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        {message.status === 'scheduled' && (
                          <button 
                            onClick={() => cancelMessage(message)} 
                            className="text-orange-600 hover:text-orange-800 text-sm"
                          >
                            <i className="fas fa-ban"></i>
                          </button>
                        )}
                        <button 
                          onClick={() => deleteMessage(message)} 
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredMessages.length}</span> sur <span className="font-medium">{totalMessages}</span> résultats
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
                  Précédent
                </button>
                <span className="px-3 py-1 bg-fuchsia-600 text-white rounded text-sm">1</span>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-red-100">
                  <i className="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
              </div>
              <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce(s) message(s) ? Cette action est irréversible.</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDeleteModal(false)} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Message Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-orange-100">
                  <i className="fas fa-ban text-orange-600"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Annuler l'envoi</h3>
              </div>
              <p className="text-gray-600 mb-6">Voulez-vous annuler l'envoi de ce(s) message(s) programmé(s) ?</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowCancelModal(false)} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Non
                </button>
                <button 
                  onClick={confirmCancel} 
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Oui, annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Details Modal */}
      {showDetailsModal && currentMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Détails du message</h3>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{currentMessage.subject}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{getTypeBadge(currentMessage.type)}</span>
                    <span>{getStatusBadge(currentMessage.status)}</span>
                    <span><i className="fas fa-calendar mr-1"></i>{new Date(currentMessage.date).toLocaleDateString('fr-FR')}</span>
                    <span><i className="fas fa-users mr-1"></i>{currentMessage.recipients} destinataires</span>
                  </div>
                </div>
                
                {currentMessage.status === 'sent' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Statistiques d'engagement</h5>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{currentMessage.opened}</div>
                        <div className="text-sm text-gray-600">Ouvertures</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentMessage.clicked}</div>
                        <div className="text-sm text-gray-600">Clics</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-fuchsia-600">{Math.round((currentMessage.opened/currentMessage.recipients)*100)}%</div>
                        <div className="text-sm text-gray-600">Taux d'ouverture</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Contenu du message</h5>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="whitespace-pre-wrap text-gray-700">{currentMessage.content}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MessageManager;