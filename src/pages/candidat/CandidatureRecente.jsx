import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidatureRecente = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    offerType: '',
    location: '',
    dateRange: '',
    salaryRange: '',
    company: ''
  });
  
  // États pour les modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [followStatus, setFollowStatus] = useState('active');
  
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: 'Développeur Full Stack',
      company: 'TechCorp Solutions',
      status: 'pending',
      date: 'Il y a 2 jours',
      location: 'Cotonou, Bénin',
      salary: '800K - 1.2M FCFA',
      offerType: 'emploi',
      description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe...',
      requirements: ['React', 'Node.js', 'MongoDB', '3+ ans d\'expérience'],
      applicationDate: '2024-01-15',
      lastUpdate: '2024-01-17',
      followStatus: 'active'
    },
    {
      id: 2,
      jobTitle: 'Développeur Frontend',
      company: 'Digital Solutions',
      status: 'accepted',
      date: 'Il y a 1 semaine',
      location: 'Porto-Novo, Bénin',
      salary: '600K - 900K FCFA',
      offerType: 'emploi',
      description: 'Poste de développeur Frontend pour une startup innovante...',
      requirements: ['Vue.js', 'JavaScript', 'CSS3', '2+ ans d\'expérience'],
      applicationDate: '2024-01-10',
      lastUpdate: '2024-01-12',
      followStatus: 'active'
    },
    {
      id: 3,
      jobTitle: 'DevOps Engineer',
      company: 'CloudTech',
      status: 'rejected',
      date: 'Il y a 2 semaines',
      location: 'Cotonou, Bénin',
      salary: '1.1M - 1.5M FCFA',
      offerType: 'emploi',
      description: 'Ingénieur DevOps pour gérer notre infrastructure cloud...',
      requirements: ['Docker', 'Kubernetes', 'AWS', '5+ ans d\'expérience'],
      applicationDate: '2024-01-05',
      lastUpdate: '2024-01-08',
      followStatus: 'inactive'
    },
    {
      id: 4,
      jobTitle: 'Product Manager',
      company: 'InnovTech',
      status: 'interview',
      date: 'Il y a 3 jours',
      location: 'Abomey-Calavi, Bénin',
      salary: '1.2M - 1.8M FCFA',
      offerType: 'emploi',
      description: 'Product Manager pour diriger le développement de nos produits...',
      requirements: ['Gestion de projet', 'Agile', 'Analytics', '4+ ans d\'expérience'],
      applicationDate: '2024-01-14',
      lastUpdate: '2024-01-16',
      followStatus: 'active'
    },
    {
      id: 5,
      jobTitle: 'Bourse d\'études Master Informatique',
      company: 'Université de Cotonou',
      status: 'pending',
      date: 'Il y a 5 jours',
      location: 'Cotonou, Bénin',
      salary: 'Bourse complète',
      offerType: 'bourse',
      description: 'Bourse complète pour un Master en Informatique...',
      requirements: ['Licence en Informatique', 'Moyenne > 14/20', 'Lettre de motivation'],
      applicationDate: '2024-01-12',
      lastUpdate: '2024-01-12',
      followStatus: 'active'
    },
    {
      id: 6,
      jobTitle: 'Financement projet agricole',
      company: 'Fonds Agricole Bénin',
      status: 'interview',
      date: 'Il y a 1 semaine',
      location: 'Parakou, Bénin',
      salary: '5M FCFA',
      offerType: 'financement',
      description: 'Financement pour un projet agricole innovant...',
      requirements: ['Plan d\'affaires', 'Expérience agricole', 'Garanties'],
      applicationDate: '2024-01-10',
      lastUpdate: '2024-01-13',
      followStatus: 'active'
    },
    {
      id: 7,
      jobTitle: 'Consultation technique',
      company: 'Ministère du Numérique',
      status: 'accepted',
      date: 'Il y a 2 semaines',
      location: 'Porto-Novo, Bénin',
      salary: '2.5M FCFA',
      offerType: 'consultation',
      description: 'Consultation technique pour la digitalisation des services...',
      requirements: ['Expertise technique', 'Expérience gouvernementale', 'Certifications'],
      applicationDate: '2024-01-05',
      lastUpdate: '2024-01-07',
      followStatus: 'active'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      case 'interview':
        return 'Entretien';
      default:
        return 'Inconnu';
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      offerType: '',
      location: '',
      dateRange: '',
      salaryRange: '',
      company: ''
    });
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleDeleteApplication = (application) => {
    setSelectedApplication(application);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedApplication) {
      setApplications(prev => prev.filter(app => app.id !== selectedApplication.id));
      setShowDeleteModal(false);
      setSelectedApplication(null);
    }
  };

  const handleFollowApplication = (application) => {
    setSelectedApplication(application);
    setFollowStatus(application.followStatus);
    setShowFollowModal(true);
  };

  const confirmFollow = () => {
    if (selectedApplication) {
      setApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, followStatus: followStatus }
          : app
      ));
      setShowFollowModal(false);
      setSelectedApplication(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    // Filtre par statut
    const matchesStatus = activeTab === 'all' || app.status === activeTab;
    
    // Filtre par type d'offre
    const matchesOfferType = !filters.offerType || app.offerType === filters.offerType;
    
    // Filtre par localisation
    const matchesLocation = !filters.location || app.location.includes(filters.location);
    
    // Filtre par entreprise
    const matchesCompany = !filters.company || app.company.toLowerCase().includes(filters.company.toLowerCase());
    
    return matchesStatus && matchesOfferType && matchesLocation && matchesCompany;
  });

  // Modal de détails
  const DetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Détails de la candidature</h2>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedApplication.offerType === 'emploi' ? 'bg-blue-100' :
                  selectedApplication.offerType === 'bourse' ? 'bg-green-100' :
                  selectedApplication.offerType === 'financement' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <i className={`text-xl ${
                    selectedApplication.offerType === 'emploi' ? 'fas fa-briefcase text-blue-600' :
                    selectedApplication.offerType === 'bourse' ? 'fas fa-graduation-cap text-green-600' :
                    selectedApplication.offerType === 'financement' ? 'fas fa-money-bill-wave text-purple-600' :
                    'fas fa-handshake text-orange-600'
                  }`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedApplication.jobTitle}</h3>
                  <p className="text-blue-600 font-medium">{selectedApplication.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusText(selectedApplication.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Localisation</label>
                  <p className="text-gray-900">{selectedApplication.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Salaire/Rémunération</label>
                  <p className="text-gray-900">{selectedApplication.salary}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date de candidature</label>
                  <p className="text-gray-900">{selectedApplication.applicationDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Dernière mise à jour</label>
                  <p className="text-gray-900">{selectedApplication.lastUpdate}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900 mt-1">{selectedApplication.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Exigences</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedApplication.requirements.map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Link 
                  to={`/candidat/detail-offre`} 
                  className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-fuchsia-700 transition duration-200"
                >
                  Voir l'offre complète
                </Link>
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    handleFollowApplication(selectedApplication);
                  }}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition duration-200"
                >
                  Gérer le suivi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Modal de suppression
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Supprimer la candidature</h3>
              <p className="text-gray-600">Cette action est irréversible</p>
            </div>
          </div>
          
          {selectedApplication && (
            <div className="mb-6">
              <p className="text-gray-700">
                Êtes-vous sûr de vouloir supprimer votre candidature pour :
              </p>
              <p className="font-semibold text-gray-900 mt-2">
                {selectedApplication.jobTitle} chez {selectedApplication.company}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal de suivi
  const FollowModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-bell text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gérer le suivi</h3>
              <p className="text-gray-600">Configurez vos notifications</p>
            </div>
          </div>
          
          {selectedApplication && (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Candidature : <span className="font-semibold">{selectedApplication.jobTitle}</span>
              </p>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="followStatus"
                    value="active"
                    checked={followStatus === 'active'}
                    onChange={(e) => setFollowStatus(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Suivi actif</span>
                    <p className="text-sm text-gray-600">Recevoir toutes les notifications</p>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="followStatus"
                    value="minimal"
                    checked={followStatus === 'minimal'}
                    onChange={(e) => setFollowStatus(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Suivi minimal</span>
                    <p className="text-sm text-gray-600">Notifications importantes uniquement</p>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="followStatus"
                    value="inactive"
                    checked={followStatus === 'inactive'}
                    onChange={(e) => setFollowStatus(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Désactiver le suivi</span>
                    <p className="text-sm text-gray-600">Aucune notification</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowFollowModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              onClick={confirmFollow}
              className="flex-1 bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal de statistiques détaillées
  const StatsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">Statistiques détaillées</h2>
            <button 
              onClick={() => setShowStatsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistiques par statut */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Par statut</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700">En attente</span>
                  <span className="font-semibold text-yellow-600">
                    {applications.filter(app => app.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Entretiens</span>
                  <span className="font-semibold text-blue-600">
                    {applications.filter(app => app.status === 'interview').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Acceptées</span>
                  <span className="font-semibold text-green-600">
                    {applications.filter(app => app.status === 'accepted').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700">Refusées</span>
                  <span className="font-semibold text-red-600">
                    {applications.filter(app => app.status === 'rejected').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistiques par type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Par type d'offre</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Emplois</span>
                  <span className="font-semibold text-blue-600">
                    {applications.filter(app => app.offerType === 'emploi').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Bourses</span>
                  <span className="font-semibold text-green-600">
                    {applications.filter(app => app.offerType === 'bourse').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Financements</span>
                  <span className="font-semibold text-purple-600">
                    {applications.filter(app => app.offerType === 'financement').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">Consultations</span>
                  <span className="font-semibold text-orange-600">
                    {applications.filter(app => app.offerType === 'consultation').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique de progression */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression</h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Taux de succès</span>
                <span className="text-sm font-semibold text-fuchsia-600">
                  {Math.round((applications.filter(app => app.status === 'accepted').length / applications.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-fuchsia-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(applications.filter(app => app.status === 'accepted').length / applications.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>
                <p className="text-gray-600 mt-1">Suivez l'état de vos candidatures</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
                  <option>Plus récentes</option>
                  <option>Date d'application</option>
                  <option>Statut</option>
                  <option>Entreprise</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'all' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Toutes ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'pending' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                En attente ({applications.filter(app => app.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('interview')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'interview' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Entretiens ({applications.filter(app => app.status === 'interview').length})
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'accepted' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Acceptées ({applications.filter(app => app.status === 'accepted').length})
              </button>
            </div>

            {/* Filtres avancés */}
            <div className="mt-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm text-fuchsia-600 hover:text-fuchsia-700 font-medium"
              >
                <i className={`fas fa-filter mr-2 ${showFilters ? 'text-fuchsia-700' : ''}`}></i>
                Filtres avancés
                <i className={`fas fa-chevron-down ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}></i>
              </button>
              
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Type d'offre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type d'offre</label>
                      <select
                        value={filters.offerType}
                        onChange={(e) => handleFilterChange('offerType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      >
                        <option value="">Tous les types</option>
                        <option value="emploi">Emploi</option>
                        <option value="bourse">Bourse</option>
                        <option value="financement">Financement</option>
                        <option value="consultation">Consultation</option>
                      </select>
                    </div>

                    {/* Localisation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                      <select
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      >
                        <option value="">Toutes les localisations</option>
                        <option value="Cotonou">Cotonou</option>
                        <option value="Porto-Novo">Porto-Novo</option>
                        <option value="Abomey-Calavi">Abomey-Calavi</option>
                        <option value="Parakou">Parakou</option>
                      </select>
                    </div>

                    {/* Entreprise */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                      <input
                        type="text"
                        placeholder="Rechercher par entreprise..."
                        value={filters.company}
                        onChange={(e) => handleFilterChange('company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 text-sm font-medium"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Effacer les filtres
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                        application.offerType === 'emploi' ? 'bg-blue-100' :
                        application.offerType === 'bourse' ? 'bg-green-100' :
                        application.offerType === 'financement' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        <i className={`text-xl ${
                          application.offerType === 'emploi' ? 'fas fa-briefcase text-blue-600' :
                          application.offerType === 'bourse' ? 'fas fa-graduation-cap text-green-600' :
                          application.offerType === 'financement' ? 'fas fa-money-bill-wave text-purple-600' :
                          'fas fa-handshake text-orange-600'
                        }`}></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.offerType === 'emploi' ? 'bg-blue-100 text-blue-800' :
                            application.offerType === 'bourse' ? 'bg-green-100 text-green-800' :
                            application.offerType === 'financement' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {application.offerType === 'emploi' ? 'Emploi' :
                             application.offerType === 'bourse' ? 'Bourse' :
                             application.offerType === 'financement' ? 'Financement' :
                             'Consultation'}
                          </span>
                        </div>
                        <p className="text-blue-600 font-medium">{application.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-money-bill mr-2"></i>
                        <span>{application.salary}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-calendar mr-2"></i>
                        <span>{application.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(application)}
                        className="text-gray-400 hover:text-fuchsia-600 transition duration-200"
                        title="Voir les détails"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        onClick={() => handleFollowApplication(application)}
                        className={`transition duration-200 ${
                          application.followStatus === 'active' ? 'text-green-600' : 
                          application.followStatus === 'minimal' ? 'text-yellow-600' : 
                          'text-gray-400'
                        } hover:text-fuchsia-600`}
                        title="Gérer le suivi"
                      >
                        <i className="fas fa-bell"></i>
                      </button>
                      <button 
                        onClick={() => handleDeleteApplication(application)}
                        className="text-gray-400 hover:text-red-600 transition duration-200"
                        title="Supprimer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Link to={`/candidat/detail-offre`} className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-fuchsia-700 transition duration-200">
                    Voir l'offre
                  </Link>
                  <button 
                    onClick={() => handleFollowApplication(application)}
                    className={`border px-4 py-2 rounded-lg text-sm transition duration-200 ${
                      application.followStatus === 'active' 
                        ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100' 
                        : application.followStatus === 'minimal'
                        ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {application.followStatus === 'active' ? 'Suivi actif' :
                     application.followStatus === 'minimal' ? 'Suivi minimal' :
                     'Désactivé'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
              <p className="text-gray-600">Vous n'avez aucune candidature pour le moment.</p>
              <Link to="/candidat/offre" className="mt-4 inline-block bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200">
                Rechercher des emplois
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Statistics */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
              <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
              Statistiques
            </h3>
              <button 
                onClick={() => setShowStatsModal(true)}
                className="text-fuchsia-600 hover:text-fuchsia-700 text-sm"
              >
                <i className="fas fa-expand-alt"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total candidatures</span>
                <span className="font-semibold text-fuchsia-600">{applications.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">En attente</span>
                <span className="font-semibold text-yellow-600">{applications.filter(app => app.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Entretiens</span>
                <span className="font-semibold text-blue-600">{applications.filter(app => app.status === 'interview').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Acceptées</span>
                <span className="font-semibold text-green-600">{applications.filter(app => app.status === 'accepted').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Refusées</span>
                <span className="font-semibold text-red-600">{applications.filter(app => app.status === 'rejected').length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link to="/candidat/offre" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-search text-fuchsia-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Rechercher des emplois</h4>
                  <p className="text-xs text-gray-500">Trouvez de nouvelles opportunités</p>
                </div>
              </Link>
              
              <Link to="/candidat/profil" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-user text-green-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Mettre à jour mon profil</h4>
                  <p className="text-xs text-gray-500">Améliorez vos chances</p>
                </div>
              </Link>
              
              <Link to="/candidat/notification" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-bell text-purple-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Voir les notifications</h4>
                  <p className="text-xs text-gray-500">Restez informé</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb mr-2 text-fuchsia-600"></i>
              Conseils
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Suivez vos candidatures</h4>
                  <p className="text-xs text-gray-600">Gardez un œil sur l'état de vos applications</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Préparez vos entretiens</h4>
                  <p className="text-xs text-gray-600">Anticipez les questions courantes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Mettez à jour votre CV</h4>
                  <p className="text-xs text-gray-600">Ajoutez vos nouvelles expériences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && <DetailModal />}
      {showDeleteModal && <DeleteModal />}
      {showFollowModal && <FollowModal />}
      {showStatsModal && <StatsModal />}
    </main>
  );
};

export default CandidatureRecente;
