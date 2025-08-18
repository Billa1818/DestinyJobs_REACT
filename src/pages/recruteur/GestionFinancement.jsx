import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import FinancementStats from '../../components/FinancementStats';
import FinancementPagination from '../../components/FinancementPagination';

const GestionFinancement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // États pour les données
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les filtres et recherche
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sector, setSector] = useState('');
  const [target, setTarget] = useState('');
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // États pour les modales
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    fundingId: null,
    fundingName: ''
  });

  // États pour les données de référence
  const [fundingSectors, setFundingSectors] = useState([]);
  const [fundingTargets, setFundingTargets] = useState([]);

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les données au montage
  useEffect(() => {
    loadReferenceData();
    loadMyFundingOffers();
  }, []);

  // Charger les données de référence
  const loadReferenceData = async () => {
    try {
      const [
        sectorsData,
        targetsData
      ] = await Promise.all([
        consultationService.getFundingSectors(),
        consultationService.getFundingTargets()
      ]);

      setFundingSectors(sectorsData);
      setFundingTargets(targetsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
    }
  };

  // Charger mes offres de financement
  const loadMyFundingOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await consultationService.getMyFundingOffers();
      
      if (response.results) {
        setFundings(response.results);
        setTotalCount(response.count || 0);
        setTotalPages(Math.ceil((response.count || 0) / 10)); // Supposons 10 par page
      } else {
        setFundings(response);
        setTotalCount(response.length || 0);
        setTotalPages(1);
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les offres
  const filteredFundings = fundings.filter((funding) => {
    const matchesSearch = !search || 
      funding.title?.toLowerCase().includes(search.toLowerCase()) ||
      funding.description?.toLowerCase().includes(search.toLowerCase());
    
    // Gestion spéciale pour le statut "expiré" basé sur la date limite
    let matchesStatus = true;
    if (status) {
      if (status === 'DEADLINE_EXPIRED') {
        // Filtrer les offres avec date limite expirée
        matchesStatus = funding.application_deadline && new Date(funding.application_deadline) < new Date();
      } else if (status === 'DEADLINE_SOON') {
        // Filtrer les offres avec date limite proche (≤30 jours)
        if (funding.application_deadline) {
          const deadline = new Date(funding.application_deadline);
          const now = new Date();
          const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
          matchesStatus = diffDays <= 30 && diffDays > 0;
        } else {
          matchesStatus = false;
        }
      } else {
        // Filtrage normal par statut
        matchesStatus = funding.status === status;
      }
    }
    
    const matchesSector = !sector || funding.sector?.id === parseInt(sector);
    const matchesTarget = !target || funding.target?.id === parseInt(target);
    
    return matchesSearch && matchesStatus && matchesSector && matchesTarget;
  });

  // Gérer la suppression
  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      fundingId: id,
      fundingName: name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      fundingId: null,
      fundingName: ''
    });
  };

  const confirmDelete = async () => {
    if (deleteModal.fundingId) {
      try {
        await consultationService.deleteFundingOffer(deleteModal.fundingId);
        
        // Mettre à jour la liste locale
        setFundings(prev => prev.filter(f => f.id !== deleteModal.fundingId));
        setTotalCount(prev => prev - 1);
        
      closeDeleteModal();
      } catch (error) {
        setError(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  // Gérer la modification
  const handleModifier = (id) => {
    navigate(`/recruteur/creer-financement?edit=${id}`, { replace: true });
  };

  // Gérer l'aperçu
  const handleApercu = (id) => {
    // Naviguer vers l'aperçu dans le même onglet
    navigate(`/financements/${id}`);
  };

  // Obtenir le texte du statut
  const getStatusText = (funding) => {
    // Vérifier d'abord si la date limite est expirée
    if (funding.application_deadline) {
      const deadline = new Date(funding.application_deadline);
      const now = new Date();
      if (deadline < now) {
        return 'Limite expirée';
      }
    }
    
    // Sinon, utiliser le statut normal
    switch (funding.status) {
      case 'DRAFT':
        return 'Brouillon';
      case 'PENDING_APPROVAL':
        return 'En attente d\'approbation';
      case 'APPROVED':
        return 'Approuvée';
      case 'PUBLISHED':
        return 'Publiée';
      case 'REJECTED':
        return 'Refusée';
      case 'EXPIRED':
        return 'Expirée';
      default:
        return funding.status;
    }
  };

  // Obtenir la couleur du statut
  const getStatusColor = (funding) => {
    // Vérifier d'abord si la date limite est expirée
    if (funding.application_deadline) {
      const deadline = new Date(funding.application_deadline);
      const now = new Date();
      if (deadline < now) {
        return 'bg-red-600 text-white'; // Rouge plus foncé pour la limite expirée
      }
    }
    
    // Sinon, utiliser la couleur du statut normal
    switch (funding.status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PUBLISHED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formater le montant
  const formatAmount = (amount) => {
    if (!amount) return 'Non précisé';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non précisé';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading && fundings.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos offres de financement...</p>
        </div>
      </div>
    );
    }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-hand-holding-usd mr-2 text-fuchsia-600"></i>
              Mes Financements
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez vos offres de financement et suivez les candidatures
            </p>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {totalCount} offre{totalCount > 1 ? 's' : ''} au total
              </p>
            )}
          </div>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/creer-financement"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouveau financement
            </Link>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {fundings.length > 0 && <FinancementStats fundings={fundings} />}

      {/* Messages d'erreur */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher un financement..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="DRAFT">Brouillons</option>
              <option value="PENDING_APPROVAL">En attente d'approbation</option>
              <option value="APPROVED">Approuvées</option>
              <option value="REJECTED">Refusées</option>
              <option value="EXPIRED">Expirées</option>
              <option value="DEADLINE_EXPIRED">Limite expirée</option>
              <option value="DEADLINE_SOON">Limite proche (≤30j)</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">Tous les secteurs</option>
              {fundingSectors.map(sectorItem => (
                <option key={sectorItem.id} value={sectorItem.id}>
                  {sectorItem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="">Tous les publics</option>
              {fundingTargets.map(targetItem => (
                <option key={targetItem.id} value={targetItem.id}>
                  {targetItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Funding List */}
      <div className="space-y-4">
        {filteredFundings.map((funding) => (
          <div key={funding.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-fuchsia-500">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{funding.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {funding.sector && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {funding.sector.name}
                      </span>
                      )}
                      {funding.target && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {funding.target.name}
                      </span>
                      )}
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {formatAmount(funding.min_amount)} - {formatAmount(funding.max_amount)}
                      </span>
                      {funding.annual_interest_rate && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                          {funding.annual_interest_rate}% taux
                      </span>
                      )}
                    </div>
                    {funding.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {funding.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(funding)}`}>
                      <i className="fas fa-circle text-xs mr-1"></i>
                      {getStatusText(funding)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fuchsia-600">
                      {funding.applications_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Candidatures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {funding.views_count || 0}
                    </div>
                    <div className="text-xs text-gray-500">Vues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {funding.repayment_duration || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Durée remboursement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {funding.geographic_zone || 'Toutes zones'}
                    </div>
                    <div className="text-xs text-gray-500">Zone géographique</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>
                    <i className="fas fa-calendar-plus mr-1"></i>
                    Créé le {formatDate(funding.created_at)}
                  </span>
                  {funding.application_deadline && (
                    <span>
                      <i className="fas fa-calendar-times mr-1"></i>
                      Expire le {formatDate(funding.application_deadline)}
                    </span>
                  )}
                  {funding.updated_at && funding.updated_at !== funding.created_at && (
                    <span>
                      <i className="fas fa-edit mr-1"></i>
                      Modifié le {formatDate(funding.updated_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
              <Link 
                to={`/recruteur/postulations-financements?financement=${funding.id}`}
                className="flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-users mr-2"></i>
                Voir candidatures ({funding.applications_count || 0})
              </Link>
              
              <button 
                onClick={() => handleModifier(funding.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <i className="fas fa-edit mr-2"></i>
                Modifier
              </button>
              
              <button 
                onClick={() => handleApercu(funding.id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                <i className="fas fa-eye mr-2"></i>
                Aperçu
              </button>
              
              <button 
                onClick={() => openDeleteModal(funding.id, funding.title)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              >
                <i className="fas fa-trash mr-2"></i>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <FinancementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Empty State */}
      {filteredFundings.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-money-bill-wave text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {fundings.length === 0 ? 'Aucun financement créé' : 'Aucun financement trouvé'}
          </h3>
          <p className="text-gray-600 mb-4">
            {fundings.length === 0 
              ? 'Commencez par créer votre première offre de financement.'
              : 'Aucun financement ne correspond aux critères de recherche.'
            }
          </p>
          <Link 
            to="/recruteur/creer-financement"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
          >
            {fundings.length === 0 ? 'Créer votre premier financement' : 'Créer un nouveau financement'}
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.fundingName}
        itemType="ce financement"
      />
    </div>
  );
};

export default GestionFinancement;