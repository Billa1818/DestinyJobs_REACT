import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import JobStats from '../../components/JobStats';
import Pagination from '../../components/Pagination';
import jobService from '../../services/jobService';

const GestionOffre = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    contract_type: '',
    experience_required: '',
    work_mode: ''
  });

  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'info',
    message: ''
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    offreId: null,
    offreName: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
    totalItems: 0
  });

  // Charger les offres au montage du composant
  useEffect(() => {
    loadOffres();
  }, [pagination.currentPage, pagination.pageSize]);

  // Charger les offres depuis l'API
  const loadOffres = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters = {
        page: pagination.currentPage,
        page_size: pagination.pageSize
      };
      
      if (filters.status) apiFilters.status = filters.status;
      if (filters.contract_type) apiFilters.contract_type = filters.contract_type;
      if (filters.experience_required) apiFilters.experience_required = filters.experience_required;
      if (filters.work_mode) apiFilters.work_mode = filters.work_mode;
      
      const response = await jobService.getMyJobOffers(apiFilters);
      
      setOffres(response.results || []);
      setFilteredOffres(response.results || []);
      
      // Mettre à jour la pagination
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil((response.count || 0) / pagination.pageSize),
        totalItems: response.count || 0
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      setError(error.message || 'Erreur lors du chargement des offres');
      showNotification('error', error.message || 'Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
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

  // Appliquer les filtres locaux (recherche et statuts spéciaux)
  useEffect(() => {
    let filtered = offres;

    if (filters.search) {
      filtered = filtered.filter(offre => 
        offre.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        offre.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Appliquer les filtres de statut spéciaux (dates limites)
    if (filters.status) {
      if (filters.status === 'DEADLINE_EXPIRED') {
        filtered = filtered.filter(offre => 
          offre.application_deadline && new Date(offre.application_deadline) < new Date()
        );
      } else if (filters.status === 'DEADLINE_SOON') {
        filtered = filtered.filter(offre => {
          if (!offre.application_deadline) return false;
          const deadline = new Date(offre.application_deadline);
          const now = new Date();
          const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
          return diffDays <= 30 && diffDays > 0;
        });
      } else {
        filtered = filtered.filter(offre => offre.status === filters.status);
      }
    }

    setFilteredOffres(filtered);
  }, [filters.search, filters.status, offres]);

  // Appliquer les filtres API (recharger depuis le serveur)
  const applyApiFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    loadOffres();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Appliquer les filtres après un délai (pour éviter trop de requêtes)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.status || filters.contract_type || filters.experience_required || filters.work_mode) {
        applyApiFilters();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.status, filters.contract_type, filters.experience_required, filters.work_mode]);

  // Changer de page
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getStatusColor = (offre) => {
    // Vérifier d'abord les dates limites
    if (offre.application_deadline) {
      const deadline = new Date(offre.application_deadline);
      const now = new Date();
      if (deadline < now) {
        return 'bg-red-600 text-white'; // Limite expirée
      }
    }
    
    // Sinon, utiliser le statut normal
    switch (offre.status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800'; // Changé en vert
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-orange-100 text-orange-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (offre) => {
    // Vérifier d'abord les dates limites
    if (offre.application_deadline) {
      const deadline = new Date(offre.application_deadline);
      const now = new Date();
      if (deadline < now) {
        return 'Limite expirée';
      }
    }
    
    // Sinon, utiliser le statut normal
    switch (offre.status) {
      case 'PUBLISHED': return 'Publiée';
      case 'PENDING_APPROVAL': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Refusée';
      case 'EXPIRED': return 'Expirée';
      case 'CLOSED': return 'Fermée';
      default: return 'Inconnu';
    }
  };

  const getContractTypeText = (contractType) => {
    switch (contractType) {
      case 'CDI': return 'CDI';
      case 'CDD': return 'CDD';
      case 'STAGE': return 'Stage';
      case 'FREELANCE': return 'Freelance';
      case 'TEMPS_PARTIEL': return 'Temps partiel';
      default: return contractType || 'Non précisé';
    }
  };

  const getExperienceText = (experience) => {
    switch (experience) {
      case 'JUNIOR': return 'Junior (0-2 ans)';
      case 'INTERMEDIATE': return 'Intermédiaire (3-5 ans)';
      case 'SENIOR': return 'Senior (6-10 ans)';
      case 'EXPERT': return 'Expert (10+ ans)';
      default: return experience || 'Non précisé';
    }
  };

  const getWorkModeText = (workMode) => {
    switch (workMode) {
      case 'PRESENTIEL': return 'Présentiel';
      case 'REMOTE': return 'Télétravail';
      case 'HYBRIDE': return 'Hybride';
      default: return workMode || 'Non précisé';
    }
  };

  const formatSalary = (salaryType, salaryMin, salaryMax) => {
    if (!salaryType || salaryType === 'NON_PRECISE') return 'À négocier';
    if (salaryType === 'FIXE') return `${salaryMin ? salaryMin.toLocaleString() : '0'} FCFA`;
    if (salaryType === 'FOURCHETTE') {
      if (salaryMin && salaryMax) {
        return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} FCFA`;
      }
      return salaryMin ? `${salaryMin.toLocaleString()}+ FCFA` : 'À négocier';
    }
    return 'À négocier';
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      offreId: id,
      offreName: name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      offreId: null,
      offreName: ''
    });
  };

  const confirmDelete = async () => {
    if (deleteModal.offreId) {
      try {
        await jobService.deleteJobOffer(deleteModal.offreId);
        // Recharger les offres après suppression
        await loadOffres();
      closeDeleteModal();
        showNotification('success', 'Offre supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification('error', error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleModifier = (id) => {
    navigate(`/recruteur/creer-offre?edit=${id}`, { replace: true });
  };

  const handleRefresh = () => {
    loadOffres();
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos offres...</p>
        </div>
      </div>
    );
    }

  if (error && offres.length === 0) {
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
              <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
              Mes Offres d'Emploi
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez vos offres d'emploi et suivez les candidatures
            </p>
            {pagination.totalItems > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {pagination.totalItems} offre{pagination.totalItems > 1 ? 's' : ''} au total
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
              to="/recruteur/creer-offre"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle offre
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Statistiques des offres */}
      {offres.length > 0 && <JobStats offres={offres} />}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher une offre..." 
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
              <option value="PENDING_APPROVAL">En attente</option>
              <option value="APPROVED">Approuvées</option>
              <option value="REJECTED">Refusées</option>
              <option value="EXPIRED">Expirées</option>
              <option value="CLOSED">Fermées</option>
              <option value="DEADLINE_EXPIRED">Limite expirée</option>
              <option value="DEADLINE_SOON">Limite proche (≤30j)</option>
            </select>
          </div>
          <div>
            <select 
              name="contract_type"
              value={filters.contract_type}
              onChange={handleFilterChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
            >
              <option value="">Tous les contrats</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="STAGE">Stage</option>
              <option value="FREELANCE">Freelance</option>
              <option value="TEMPS_PARTIEL">Temps partiel</option>
            </select>
          </div>
          <div>
            <select 
              name="work_mode"
              value={filters.work_mode}
              onChange={handleFilterChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
            >
              <option value="">Tous les modes</option>
              <option value="PRESENTIEL">Présentiel</option>
              <option value="REMOTE">Télétravail</option>
              <option value="HYBRIDE">Hybride</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Offers List */}
      <div className="space-y-4">
        {filteredOffres.map((offre) => (
          <div key={offre.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-fuchsia-500">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{offre.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {getContractTypeText(offre.contract_type)}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {getExperienceText(offre.experience_required)}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {formatSalary(offre.salary_type, offre.salary_min, offre.salary_max)}
                      </span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        {getWorkModeText(offre.work_mode)}
                      </span>
                      {offre.location && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {offre.location}
                        </span>
                      )}
                    </div>
                    {offre.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {offre.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offre)}`}>
                      <i className="fas fa-circle text-xs mr-1"></i>{getStatusText(offre)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fuchsia-600">{offre.applications_count || 0}</div>
                    <div className="text-xs text-gray-500">Candidatures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{offre.views_count || 0}</div>
                    <div className="text-xs text-gray-500">Vues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {offre.contract_type || 'Non précisé'}
                    </div>
                    <div className="text-xs text-gray-500">Type de contrat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {offre.experience_required || 'Non précisé'}
                    </div>
                    <div className="text-xs text-gray-500">Expérience</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  {offre.created_at && (
                    <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {new Date(offre.created_at).toLocaleDateString('fr-FR')}</span>
                  )}
                  {offre.updated_at && (
                    <span><i className="fas fa-calendar-edit mr-1"></i>Modifiée le {new Date(offre.updated_at).toLocaleDateString('fr-FR')}</span>
                  )}
                  {offre.application_deadline && (
                    <span><i className="fas fa-calendar-times mr-1"></i>Date limite : {new Date(offre.application_deadline).toLocaleDateString('fr-FR')}</span>
                  )}
                  {offre.post_date && (
                    <span><i className="fas fa-calendar-check mr-1"></i>Publiée le {new Date(offre.post_date).toLocaleDateString('fr-FR')}</span>
                  )}
                  {offre.closing_date && (
                    <span><i className="fas fa-calendar-times mr-1"></i>Expire le {new Date(offre.closing_date).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
              <Link 
                to={`/recruteur/postulations-offres?offre=${offre.id}`}
                className="flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-users mr-2"></i>Voir candidatures ({offre.applications_count || 0})
              </Link>
              <button 
                onClick={() => handleModifier(offre.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <i className="fas fa-edit mr-2"></i>Modifier
              </button>
              <Link 
                to={`/jobs/${offre.id}`}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                <i className="fas fa-eye mr-2"></i>Aperçu
              </Link>
              <button 
                onClick={() => openDeleteModal(offre.id, offre.title)}
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
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.pageSize}
        />
      )}

      {/* Empty State */}
      {filteredOffres.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-briefcase text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {pagination.totalItems === 0 ? 'Aucune offre créée' : 'Aucune offre trouvée'}
          </h3>
          <p className="text-gray-600 mb-4">
            {pagination.totalItems === 0 
              ? 'Commencez par créer votre première offre d\'emploi pour attirer des candidats.'
              : 'Aucune offre ne correspond aux critères de recherche.'
            }
          </p>
          <Link 
            to="/recruteur/creer-offre"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
          >
            {pagination.totalItems === 0 ? 'Créer votre première offre' : 'Créer une nouvelle offre'}
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.offreName}
        itemType="cette offre"
      />
    </div>
  );
};

export default GestionOffre;