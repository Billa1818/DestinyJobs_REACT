import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import ConsultationStats from '../../components/ConsultationStats';
import ConsultationPagination from '../../components/ConsultationPagination';
import LoadingSpinner from '../../components/LoadingSpinner';


const GestionConsultation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // États pour les données
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les filtres et recherche
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  
  // États pour la pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0
  });
  
  // États pour les modales
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    consultationId: null,
    consultationName: ''
  });

  // États pour les notifications
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'info',
    message: ''
  });

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les données au montage
  useEffect(() => {
    loadMyConsultationOffers();
  }, []);

  // Charger mes offres de consultation
  const loadMyConsultationOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await consultationService.getMyConsultationOffers();
      
      if (response.results) {
        setConsultations(response.results);
        setPagination(prev => ({
          ...prev,
          totalItems: response.count || 0,
          totalPages: Math.ceil((response.count || 0) / prev.pageSize)
        }));
      } else {
        setConsultations(response);
        setPagination(prev => ({
          ...prev,
          totalItems: response.length || 0,
          totalPages: 1
        }));
      }
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement des consultations');
    } finally {
      setLoading(false);
    }
  };

  // Actualiser les données
  const handleRefresh = () => {
    loadMyConsultationOffers();
  };

  // Appliquer les filtres locaux (recherche et statuts)
  useEffect(() => {
    let filtered = consultations;

    if (filters.search) {
      filtered = filtered.filter(consultation => 
        consultation.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        consultation.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(consultation => consultation.status === filters.status);
    }

    setFilteredConsultations(filtered);
  }, [filters.search, filters.status, consultations]);

  // Gérer la suppression
  const openDeleteModal = (consultationId, consultationName) => {
    setDeleteModal({
      isOpen: true,
      consultationId,
      consultationName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      consultationId: null,
      consultationName: ''
    });
  };

  const confirmDelete = async () => {
    try {
      await consultationService.deleteConsultationOffer(deleteModal.consultationId);
      showNotification('success', 'Consultation supprimée avec succès !');
      loadMyConsultationOffers();
      closeDeleteModal();
    } catch (error) {
      showNotification('error', error.message || 'Erreur lors de la suppression');
    }
  };

  // Gérer la fermeture d'une consultation expirée
  const handleCloseExpired = async (consultation) => {
    try {
      setLoading(true);
      await consultationService.closeExpiredConsultationOffer(consultation.id);
      showNotification('success', 'Consultation fermée avec succès');
      setTimeout(() => {
        loadMyConsultationOffers();
      }, 1000);
    } catch (error) {
      showNotification('error', error.message || 'Erreur lors de la fermeture de la consultation');
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  // Gérer la modification
  const handleModifier = (consultationId) => {
    navigate(`/recruteur/creer-consultation?edit=${consultationId}`);
  };

  // Gérer l'aperçu
  const handleApercu = (consultationId) => {
    navigate(`/consultations/${consultationId}`);
  };

  // Gérer les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Changer de page
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  // Afficher une notification
  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });
  };

  // Fermer la notification
  const closeNotification = () => {
    setNotification({
      isVisible: false,
      type: 'info',
      message: ''
    });
  };

  // Fonctions utilitaires pour l'affichage
  const getStatusColor = (consultation) => {
    switch (consultation.status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-orange-100 text-orange-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (consultation) => {
    switch (consultation.status) {
      case 'PUBLISHED': return 'Publiée';
      case 'DRAFT': return 'Brouillon';
      case 'PENDING_APPROVAL': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Refusée';
      case 'EXPIRED': return 'Expirée';
      case 'CLOSED': return 'Fermée';
      default: return 'Inconnu';
    }
  };

  // États de chargement et d'erreur
  if (loading && consultations.length === 0) {
    return (
      <LoadingSpinner 
        variant="page" 
        size="lg" 
        text="Chargement des consultations..."
      />
    );
  }

  if (error && consultations.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            Réessayer
          </button>
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
              <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
              Mes Offres de Consultation
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez vos offres de consultation et suivez les candidatures
            </p>
            {pagination.totalItems > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {pagination.totalItems} consultation{pagination.totalItems > 1 ? 's' : ''} au total
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-fuchsia-600 transition duration-200"
              title="Actualiser"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/creer-consultation"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle consultation
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Statistiques des consultations */}
      {consultations.length > 0 && <ConsultationStats consultations={consultations} />}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher une consultation..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              />
            </div>
          </div>
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
            >
              <option value="">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="PENDING_APPROVAL">En attente</option>
              <option value="APPROVED">Approuvée</option>
              <option value="REJECTED">Refusée</option>
              <option value="EXPIRED">Expirée</option>
              <option value="CLOSED">Fermée</option>
              <option value="PUBLISHED">Publiée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultation List */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => (
          <div key={consultation.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-fuchsia-500">
            <div className="flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{consultation.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {consultation.region && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {consultation.region.name}
                          </span>
                        )}
                        {consultation.country && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {consultation.country.name}
                          </span>
                        )}
                      </div>
                      {consultation.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {consultation.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation)}`}>
                        <i className="fas fa-circle text-xs mr-1"></i>{getStatusText(consultation)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{consultation.views_count || 0}</div>
                      <div className="text-xs text-gray-500">Vues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        {consultation.company_details?.company_name || 'Entreprise non précisée'}
                      </div>
                      <div className="text-xs text-gray-500">Entreprise</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    {consultation.created_at && (
                      <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {new Date(consultation.created_at).toLocaleDateString('fr-FR')}</span>
                    )}
                    {consultation.updated_at && (
                      <span><i className="fas fa-calendar-edit mr-1"></i>Modifiée le {new Date(consultation.updated_at).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                </div>
              </div>
            
            {/* Action Buttons */}
             <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
               <Link 
                 to={`/recruteur/postulations-consultations?consultation=${consultation.id}`}
                 className="flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
               >
                 <i className="fas fa-users mr-2"></i>Voir candidatures ({consultation.applications_count || 0})
               </Link>
               <button 
                 onClick={() => handleModifier(consultation.id)}
                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
               >
                 <i className="fas fa-edit mr-2"></i>Modifier
               </button>
               <button 
                  onClick={() => handleApercu(consultation.id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                >
                  <i className="fas fa-eye mr-2"></i>Aperçu
                </button>
                {consultation.status === 'EXPIRED' && (
                  <button 
                    onClick={() => handleCloseExpired(consultation)}
                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200"
                  >
                    <i className="fas fa-times-circle mr-2"></i>Fermer
                  </button>
                )}
                <button 
                  onClick={() => openDeleteModal(consultation.id, consultation.title)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                >
                  <i className="fas fa-trash mr-2"></i>Supprimer
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <ConsultationPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Empty State */}
      {filteredConsultations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-chart-line text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {pagination.totalItems === 0 ? 'Aucune consultation créée' : 'Aucune consultation trouvée'}
          </h3>
          <p className="text-gray-600 mb-4">
            {pagination.totalItems === 0 
              ? 'Commencez par créer votre première offre de consultation pour attirer des prestataires.'
              : 'Aucune consultation ne correspond aux critères de recherche.'
            }
          </p>
          <Link 
            to="/recruteur/creer-consultation"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
          >
            {pagination.totalItems === 0 ? 'Créer votre première consultation' : 'Créer une nouvelle consultation'}
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.consultationName}
      />
    </div>
  );
};

export default GestionConsultation;