import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const PostulationFinancement = () => {
  // State for modals
  const [modals, setModals] = useState({
    viewApplication: { isOpen: false, data: null },
    viewCV: { isOpen: false, data: null },
    viewBusinessPlan: { isOpen: false, data: null },
    approveApplication: { isOpen: false, data: null },
    rejectApplication: { isOpen: false, data: null },
    contactApplicant: { isOpen: false, data: null },
    assignEvaluator: { isOpen: false, data: null },
    addNote: { isOpen: false, data: null },
    viewEvaluationHistory: { isOpen: false, data: null },
    compatibilityScore: { isOpen: false, data: null }
  });

  // Search functionality
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.application-card');

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Status filter
  const handleStatusFilter = (e) => {
    const filterValue = e.target.value;
    const cards = document.querySelectorAll('.application-card');

    cards.forEach(card => {
      if (filterValue === '' || card.dataset.status === filterValue) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };



  // Modal management functions
  const openModal = (modalName, data = null) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: true, data }
    }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: false, data: null }
    }));
  };

  // Updated action functions to use modals
  const viewApplication = (id) => {
    openModal('viewApplication', { id, name: 'Aminata KONE' });
  };

  const viewCV = (id) => {
    openModal('viewCV', { id, name: 'Aminata KONE' });
  };

  const viewBusinessPlan = (id) => {
    openModal('viewBusinessPlan', { id, name: 'Aminata KONE' });
  };

  const approveApplication = (id) => {
    openModal('approveApplication', { id, name: 'Aminata KONE' });
  };

  const rejectApplication = (id) => {
    openModal('rejectApplication', { id, name: 'Aminata KONE' });
  };

  const contactApplicant = (id) => {
    openModal('contactApplicant', { id, name: 'Aminata KONE' });
  };

  const assignEvaluator = (id) => {
    openModal('assignEvaluator', { id, name: 'Aminata KONE' });
  };

  const addNote = (id) => {
    openModal('addNote', { id, name: 'Aminata KONE' });
  };

  const viewEvaluationHistory = (id) => {
    openModal('viewEvaluationHistory', { id, name: 'Aminata KONE' });
  };

  const viewCompatibilityScore = (id) => {
    openModal('compatibilityScore', { 
      id, 
      name: 'Aminata KONE',
      score: 85,
      details: {
        experience: 90,
        businessPlan: 85,
        financialStability: 80,
        marketPotential: 88,
        teamCapability: 82
      }
    });
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-full">
          {/* Header Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  <i className="fas fa-users mr-2 text-destiny-gold"></i>
                  Candidatures - Microcrédit Femmes Entrepreneures
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Gérez et évaluez les candidatures reçues pour ce financement
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center">
                    <i className="fas fa-download mr-2"></i>
                    Exporter
                  </button>
                  <button className="bg-destiny-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center">
                    <i className="fas fa-check-circle mr-2"></i>
                    Actions groupées
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Funding Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6 border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">47</div>
                <div className="text-xs text-gray-600">Total candidatures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-xs text-gray-600">En cours d'évaluation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-xs text-gray-600">Approuvées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">15</div>
                <div className="text-xs text-gray-600">Refusées</div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input 
                    type="text" 
                    id="searchInput" 
                    placeholder="Rechercher par nom, email ou entreprise..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select 
                  id="statusFilter" 
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                  onChange={handleStatusFilter}
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="under_review">En cours d'évaluation</option>
                  <option value="approved">Approuvée</option>
                  <option value="rejected">Refusée</option>
                  <option value="on_hold">En suspens</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select id="scoreFilter" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
                  <option value="">Toutes les notes</option>
                  <option value="excellent">Excellent (8-10)</option>
                  <option value="good">Bon (6-8)</option>
                  <option value="average">Moyen (4-6)</option>
                  <option value="poor">Faible (0-4)</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select id="dateFilter" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
                  <option value="">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="older">Plus ancien</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select id="compatibilityFilter" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
                  <option value="">Compatibilité</option>
                  <option value="excellent">Excellente (80-100%)</option>
                  <option value="good">Bonne (60-80%)</option>
                  <option value="average">Moyenne (40-60%)</option>
                  <option value="poor">Faible (0-40%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des candidatures */}
          <div className="space-y-4" id="applicationsList">
            {/* Application Card 1 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-fuchsia-500 application-card" data-status="approved">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-semibold">
                        AK
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Aminata KONE</h3>
                        <p className="text-sm text-gray-600">aminata.kone@email.com</p>
                        <p className="text-sm text-gray-600">+229 97 45 67 89</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            Cotonou
                          </span>
                          <span className="text-sm text-gray-500">
                            <i className="fas fa-briefcase mr-1"></i>
                            3 ans
                          </span>
                          <span className="text-sm text-gray-500">
                            <i className="fas fa-graduation-cap mr-1"></i>
                            Formation
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <i className="fas fa-check-circle text-xs mr-1"></i>Approuvée
                      </span>
                      <div className="text-center">
                        <div className="text-lg font-bold text-fuchsia-600">8.5</div>
                        <div className="text-xs text-gray-500">Note</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Projet</h4>
                    <p className="text-sm text-gray-700">
                      Création d'un atelier de couture moderne spécialisé dans les vêtements traditionnels béninois avec formation de 5 apprenties...
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">3 ans</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">Oui</div>
                      <div className="text-xs text-gray-500">Business Plan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">Forte</div>
                      <div className="text-xs text-gray-500">Motivation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">5</div>
                      <div className="text-xs text-gray-500">Employés prévus</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Candidature soumise le 15 juin 2025 • Approuvée le 20 juin 2025 • Évaluée par Marie TOGBE
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <Link to="/recruteur/postulations-financements/1" className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm">
                    <i className="fas fa-eye mr-1"></i>Voir postulations
                  </Link>
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewApplication(1)}>
                    <i className="fas fa-eye mr-1"></i>Détails
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(1)}>
                    <i className="fas fa-file-pdf mr-1"></i>CV
                  </button>
                  <button className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition duration-200 text-sm" onClick={() => viewBusinessPlan(1)}>
                    <i className="fas fa-chart-line mr-1"></i>Business Plan
                  </button>
                  <button className="px-3 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCompatibilityScore(1)}>
                    <i className="fas fa-chart-pie mr-1"></i>Compatibilité (85%)
                  </button>
                  <button className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm" onClick={() => contactApplicant(1)}>
                    <i className="fas fa-envelope mr-1"></i>Contacter
                  </button>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition duration-200 text-sm" onClick={() => addNote(1)}>
                    <i className="fas fa-sticky-note mr-1"></i>Note
                  </button>
                </div>
              </div>
            </div>

            {/* Application Card 2 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-yellow-500 application-card" data-status="under_review">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-blue-600"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Fatou ABDOU</h3>
                        <p className="text-sm text-gray-600 mb-2">fatou.abdou@email.com • +229 96 78 45 12</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Restauration</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">1.8M FCFA demandés</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Porto-Novo</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        <i className="fas fa-clock text-xs mr-1"></i>En évaluation
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">Note:</span>
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-yellow-600">7.2</span>
                          <span className="text-xs text-gray-400 ml-1">/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <strong>Projet:</strong> Ouverture d'un restaurant de spécialités locales avec service de livraison et formation du personnel aux bonnes pratiques d'hygiène...
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">5 ans</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">Oui</div>
                      <div className="text-xs text-gray-500">Business Plan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">Moyenne</div>
                      <div className="text-xs text-gray-500">Motivation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">8</div>
                      <div className="text-xs text-gray-500">Employés prévus</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Candidature soumise le 18 juin 2025 • En cours d'évaluation par Jean DOSSOU
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <Link to="/recruteur/postulations-financements/2" className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm">
                    <i className="fas fa-eye mr-1"></i>Voir postulations
                  </Link>
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewApplication(2)}>
                    <i className="fas fa-eye mr-1"></i>Détails
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(2)}>
                    <i className="fas fa-file-pdf mr-1"></i>CV
                  </button>
                  <button className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition duration-200 text-sm" onClick={() => viewBusinessPlan(2)}>
                    <i className="fas fa-chart-line mr-1"></i>Business Plan
                  </button>
                  <button className="px-3 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCompatibilityScore(2)}>
                    <i className="fas fa-chart-pie mr-1"></i>Compatibilité (78%)
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => approveApplication(2)}>
                    <i className="fas fa-check mr-1"></i>Approuver
                  </button>
                  <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 text-sm" onClick={() => rejectApplication(2)}>
                    <i className="fas fa-times mr-1"></i>Refuser
                  </button>
                </div>
              </div>
            </div>

            {/* Application Card 3 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-blue-500 application-card" data-status="pending">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-green-600"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Rachelle HOUNGBO</h3>
                        <p className="text-sm text-gray-600 mb-2">rachelle.houngbo@email.com • +229 95 34 78 90</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">Cosmétiques</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">3.2M FCFA demandés</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Parakou</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <i className="fas fa-hourglass text-xs mr-1"></i>En attente
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">Note:</span>
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-gray-400">-</span>
                          <span className="text-xs text-gray-400 ml-1">/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <strong>Projet:</strong> Production de cosmétiques naturels à base de karité et d'huiles essentielles locales pour le marché national et sous-régional...
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">2 ans</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">Oui</div>
                      <div className="text-xs text-gray-500">Business Plan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">Forte</div>
                      <div className="text-xs text-gray-500">Motivation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">12</div>
                      <div className="text-xs text-gray-500">Employés prévus</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Candidature soumise le 22 juin 2025 • En attente d'attribution d'un évaluateur
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <Link to="/recruteur/postulations-financements/3" className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm">
                    <i className="fas fa-eye mr-1"></i>Voir postulations
                  </Link>
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewApplication(3)}>
                    <i className="fas fa-eye mr-1"></i>Détails
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(3)}>
                    <i className="fas fa-file-pdf mr-1"></i>CV
                  </button>
                  <button className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition duration-200 text-sm" onClick={() => viewBusinessPlan(3)}>
                    <i className="fas fa-chart-line mr-1"></i>Business Plan
                  </button>
                  <button className="px-3 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCompatibilityScore(3)}>
                    <i className="fas fa-chart-pie mr-1"></i>Compatibilité (92%)
                  </button>
                  <button className="px-3 py-2 text-destiny-gold hover:bg-yellow-50 rounded-lg transition duration-200 text-sm" onClick={() => assignEvaluator(3)}>
                    <i className="fas fa-user-plus mr-1"></i>Assigner
                  </button>
                  <button className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm" onClick={() => contactApplicant(3)}>
                    <i className="fas fa-envelope mr-1"></i>Contacter
                  </button>
                </div>
              </div>
            </div>

            {/* Application Card 4 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-red-500 application-card" data-status="rejected">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-red-600"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Sandra AKPO</h3>
                        <p className="text-sm text-gray-600 mb-2">sandra.akpo@email.com • +229 94 12 56 78</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Commerce</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">4.5M FCFA demandés</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Abomey</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        <i className="fas fa-times-circle text-xs mr-1"></i>Refusée
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">Note:</span>
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-red-600">4.1</span>
                          <span className="text-xs text-gray-400 ml-1">/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      <strong>Projet:</strong> Création d'une boutique de vente de produits importés avec focus sur les équipements électroniques...
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                      <strong>Motif de refus:</strong> Business plan incomplet, manque de garanties financières
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">1 an</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-red-600">Incomplet</div>
                      <div className="text-xs text-gray-500">Business Plan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-yellow-600">Faible</div>
                      <div className="text-xs text-gray-500">Motivation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">3</div>
                      <div className="text-xs text-gray-500">Employés prévus</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Candidature soumise le 14 juin 2025 • Refusée le 19 juin 2025 • Évaluée par Paul MARTIN
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <Link to="/recruteur/postulations-financements/4" className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm">
                    <i className="fas fa-eye mr-1"></i>Voir postulations
                  </Link>
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewApplication(4)}>
                    <i className="fas fa-eye mr-1"></i>Détails
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(4)}>
                    <i className="fas fa-file-pdf mr-1"></i>CV
                  </button>
                  <button className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition duration-200 text-sm" onClick={() => viewBusinessPlan(4)}>
                    <i className="fas fa-chart-line mr-1"></i>Business Plan
                  </button>
                  <button className="px-3 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCompatibilityScore(4)}>
                    <i className="fas fa-chart-pie mr-1"></i>Compatibilité (42%)
                  </button>
                  <button className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm" onClick={() => contactApplicant(4)}>
                    <i className="fas fa-envelope mr-1"></i>Contacter
                  </button>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition duration-200 text-sm" onClick={() => viewEvaluationHistory(4)}>
                    <i className="fas fa-history mr-1"></i>Historique
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Affichage de 1 à 4 sur 47 candidatures
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200" disabled>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="px-3 py-2 bg-destiny-gold text-white rounded-lg">1</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">2</button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">3</button>
                <span className="px-2">...</span>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">12</button>
                <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      
      {/* Compatibility Score Modal */}
      {modals.compatibilityScore.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                <i className="fas fa-chart-pie mr-2 text-fuchsia-600"></i>
                Score de Compatibilité - {modals.compatibilityScore.data?.name}
              </h3>
              <button 
                onClick={() => closeModal('compatibilityScore')}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-fuchsia-600 mb-2">
                  {modals.compatibilityScore.data?.score}%
                </div>
                <div className="text-sm text-gray-600">Score global de compatibilité</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Expérience</span>
                    <span className="text-sm font-bold text-green-600">{modals.compatibilityScore.data?.details?.experience}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${modals.compatibilityScore.data?.details?.experience}%`}}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Business Plan</span>
                    <span className="text-sm font-bold text-blue-600">{modals.compatibilityScore.data?.details?.businessPlan}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${modals.compatibilityScore.data?.details?.businessPlan}%`}}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Stabilité Financière</span>
                    <span className="text-sm font-bold text-purple-600">{modals.compatibilityScore.data?.details?.financialStability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: `${modals.compatibilityScore.data?.details?.financialStability}%`}}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Potentiel Marché</span>
                    <span className="text-sm font-bold text-orange-600">{modals.compatibilityScore.data?.details?.marketPotential}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: `${modals.compatibilityScore.data?.details?.marketPotential}%`}}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Capacité Équipe</span>
                    <span className="text-sm font-bold text-indigo-600">{modals.compatibilityScore.data?.details?.teamCapability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${modals.compatibilityScore.data?.details?.teamCapability}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => closeModal('compatibilityScore')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200">
                <i className="fas fa-download mr-2"></i>
                Exporter Rapport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Application Modal */}
      {modals.viewApplication.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                <i className="fas fa-eye mr-2 text-blue-600"></i>
                Détails de la Candidature - {modals.viewApplication.data?.name}
              </h3>
              <button 
                onClick={() => closeModal('viewApplication')}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informations Personnelles</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {modals.viewApplication.data?.name}</p>
                    <p><strong>Email:</strong> aminata.kone@email.com</p>
                    <p><strong>Téléphone:</strong> +229 97 45 67 89</p>
                    <p><strong>Localisation:</strong> Cotonou, Bénin</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Projet</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Secteur:</strong> Couture</p>
                    <p><strong>Montant demandé:</strong> 2.5M FCFA</p>
                    <p><strong>Durée:</strong> 24 mois</p>
                    <p><strong>Statut:</strong> Approuvée</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Description du Projet</h4>
                <p className="text-sm text-gray-700">
                  Création d'un atelier de couture moderne spécialisé dans les vêtements traditionnels béninois 
                  avec formation de 5 apprenties. Le projet vise à préserver les traditions tout en créant 
                  des emplois durables dans la communauté.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Évaluation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">8.5</div>
                    <div className="text-xs text-gray-600">Note globale</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">85%</div>
                    <div className="text-xs text-gray-600">Compatibilité</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">3 ans</div>
                    <div className="text-xs text-gray-600">Expérience</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">5</div>
                    <div className="text-xs text-gray-600">Emplois créés</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={() => closeModal('viewApplication')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                <i className="fas fa-edit mr-2"></i>
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Application Modal */}
      {modals.approveApplication.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-600 text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Approuver la candidature
                </h3>
                <p className="text-sm text-gray-500">
                  Confirmer l'approbation de {modals.approveApplication.data?.name}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Êtes-vous sûr de vouloir approuver cette candidature ? 
                Cette action enverra une notification au candidat.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => closeModal('approveApplication')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                Annuler
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                <i className="fas fa-check mr-2"></i>
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Application Modal */}
      {modals.rejectApplication.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-times text-red-600 text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Refuser la candidature
                </h3>
                <p className="text-sm text-gray-500">
                  Confirmer le refus de {modals.rejectApplication.data?.name}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif du refus
              </label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
                placeholder="Expliquez les raisons du refus..."
              ></textarea>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => closeModal('rejectApplication')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                Annuler
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                <i className="fas fa-times mr-2"></i>
                Refuser
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PostulationFinancement;