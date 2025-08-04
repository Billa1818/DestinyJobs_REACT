import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      titre: 'Nouvelle candidature reçue',
      message: 'Votre candidature pour "Développement d\'application mobile" a été acceptée',
      date: '2024-01-16T10:30:00',
      lu: false,
      priorite: 'high',
      entreprise: 'TechCorp Solutions',
      projet: 'Développement d\'application mobile'
    },
    {
      id: 2,
      type: 'message',
      titre: 'Nouveau message',
      message: 'Vous avez reçu un message de FastDelivery concernant votre proposition',
      date: '2024-01-16T09:15:00',
      lu: false,
      priorite: 'medium',
      expediteur: 'FastDelivery',
      sujet: 'Proposition de projet'
    },
    {
      id: 3,
      type: 'project',
      titre: 'Projet terminé',
      message: 'Le projet "E-commerce Platform" a été marqué comme terminé',
      date: '2024-01-15T16:45:00',
      lu: true,
      priorite: 'low',
      projet: 'E-commerce Platform',
      client: 'TechCorp Solutions'
    },
    {
      id: 4,
      type: 'payment',
      titre: 'Paiement reçu',
      message: 'Vous avez reçu un paiement de 450,000 FCFA pour le projet "E-commerce Platform"',
      date: '2024-01-15T14:20:00',
      lu: true,
      priorite: 'high',
      montant: '450,000 FCFA',
      projet: 'E-commerce Platform'
    },
    {
      id: 5,
      type: 'consultation',
      titre: 'Nouvelle consultation disponible',
      message: 'Une nouvelle consultation correspondant à vos compétences est disponible',
      date: '2024-01-15T11:30:00',
      lu: false,
      priorite: 'medium',
      titreConsultation: 'Développement d\'API REST',
      budget: '300,000 - 500,000 FCFA'
    },
    {
      id: 6,
      type: 'review',
      titre: 'Nouvelle évaluation',
      message: 'Vous avez reçu une évaluation 5 étoiles pour le projet "Dashboard Analytics"',
      date: '2024-01-14T18:00:00',
      lu: true,
      priorite: 'low',
      note: 5,
      projet: 'Dashboard Analytics'
    },
    {
      id: 7,
      type: 'deadline',
      titre: 'Échéance approche',
      message: 'L\'échéance du projet "App de Livraison" approche (3 jours restants)',
      date: '2024-01-14T15:30:00',
      lu: false,
      priorite: 'high',
      projet: 'App de Livraison',
      echeance: '2024-01-17'
    },
    {
      id: 8,
      type: 'system',
      titre: 'Maintenance prévue',
      message: 'Une maintenance est prévue le 20 janvier de 02h00 à 04h00',
      date: '2024-01-14T10:00:00',
      lu: true,
      priorite: 'low',
      dateMaintenance: '2024-01-20'
    }
  ]);

  const [filters] = useState({
    all: notifications.length,
    unread: notifications.filter(n => !n.lu).length,
    applications: notifications.filter(n => n.type === 'application').length,
    messages: notifications.filter(n => n.type === 'message').length,
    projects: notifications.filter(n => n.type === 'project').length,
    payments: notifications.filter(n => n.type === 'payment').length,
    consultations: notifications.filter(n => n.type === 'consultation').length,
    reviews: notifications.filter(n => n.type === 'review').length,
    deadlines: notifications.filter(n => n.type === 'deadline').length,
    system: notifications.filter(n => n.type === 'system').length
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'application':
        return 'fas fa-file-alt text-blue-600';
      case 'message':
        return 'fas fa-envelope text-green-600';
      case 'project':
        return 'fas fa-project-diagram text-purple-600';
      case 'payment':
        return 'fas fa-money-bill-wave text-green-600';
      case 'consultation':
        return 'fas fa-search text-orange-600';
      case 'review':
        return 'fas fa-star text-yellow-600';
      case 'deadline':
        return 'fas fa-clock text-red-600';
      case 'system':
        return 'fas fa-cog text-gray-600';
      default:
        return 'fas fa-bell text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-orange-500';
      case 'low':
        return 'border-l-gray-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, lu: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, lu: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.lu;
    return notification.type === activeTab;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Gérez vos notifications et restez informé</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={markAllAsRead}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                <i className="fas fa-check-double mr-2"></i>Tout marquer comme lu
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-bell text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{filters.all}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <i className="fas fa-envelope-open text-red-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Non lues</p>
                <p className="text-xl font-bold text-gray-900">{filters.unread}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-file-alt text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Candidatures</p>
                <p className="text-xl font-bold text-gray-900">{filters.applications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fas fa-money-bill-wave text-purple-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Paiements</p>
                <p className="text-xl font-bold text-gray-900">{filters.payments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <i className="fas fa-search text-orange-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Consultations</p>
                <p className="text-xl font-bold text-gray-900">{filters.consultations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Toutes ({filters.all})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'unread'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Non lues ({filters.unread})
              </button>
              <button
                onClick={() => setActiveTab('application')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'application'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Candidatures ({filters.applications})
              </button>
              <button
                onClick={() => setActiveTab('message')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'message'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages ({filters.messages})
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'payment'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Paiements ({filters.payments})
              </button>
              <button
                onClick={() => setActiveTab('consultation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'consultation'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Consultations ({filters.consultations})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-bell-slash text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                <p className="text-gray-500">Vous n'avez aucune notification pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border-l-4 ${getPriorityColor(notification.priorite)} bg-white border border-gray-200 rounded-lg p-6 ${
                      !notification.lu ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-full ${!notification.lu ? 'bg-orange-100' : 'bg-gray-100'}`}>
                          <i className={`${getTypeIcon(notification.type)} text-lg`}></i>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.titre}</h3>
                            {!notification.lu && (
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                Nouveau
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          {/* Additional Info */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {notification.entreprise && (
                              <span><i className="fas fa-building mr-1"></i>{notification.entreprise}</span>
                            )}
                            {notification.projet && (
                              <span><i className="fas fa-project-diagram mr-1"></i>{notification.projet}</span>
                            )}
                            {notification.expediteur && (
                              <span><i className="fas fa-user mr-1"></i>{notification.expediteur}</span>
                            )}
                            {notification.montant && (
                              <span><i className="fas fa-money-bill-wave mr-1"></i>{notification.montant}</span>
                            )}
                            {notification.note && (
                              <span><i className="fas fa-star mr-1"></i>{notification.note} étoiles</span>
                            )}
                            {notification.titreConsultation && (
                              <span><i className="fas fa-search mr-1"></i>{notification.titreConsultation}</span>
                            )}
                            {notification.budget && (
                              <span><i className="fas fa-tag mr-1"></i>{notification.budget}</span>
                            )}
                            {notification.echeance && (
                              <span><i className="fas fa-calendar mr-1"></i>Échéance: {notification.echeance}</span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-400 mt-3">
                            <i className="fas fa-clock mr-1"></i>
                            {new Date(notification.date).toLocaleString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.lu && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-orange-600 hover:text-orange-700 p-2 rounded-full hover:bg-orange-100"
                            title="Marquer comme lu"
                          >
                            <i className="fas fa-check text-sm"></i>
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100"
                          title="Supprimer"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 