import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import consultationDemandesService from '../../services/consultationDemandesService';

const Demandes = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [demandes, setDemandes] = useState([]);
  const [formattedDemandes, setFormattedDemandes] = useState([]);
  const [stats, setStats] = useState({});
  
  // États pour l'interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    minScore: 0,
    urgentOnly: false,
    recentOnly: false,
    unviewedOnly: false
  });
  
  // États pour le tri
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // États pour les actions
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Charger les demandes au montage du composant
  useEffect(() => {
    loadDemandes();
  }, []);

  // Charger les demandes depuis l'API
  const loadDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const demandesData = await consultationDemandesService.getConsultationDemandes();
      setDemandes(demandesData);
      
      // Formater les demandes pour l'affichage
      const formatted = demandesData.map(demande => 
        consultationDemandesService.formatDemandeForDisplay(demande)
      );
      setFormattedDemandes(formatted);
      
      // Calculer les statistiques
      const statsData = consultationDemandesService.getDemandesStats(demandesData);
      setStats(statsData);
      
      console.log('✅ Demandes chargées:', demandesData.length);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des demandes:', error);
      setError('Erreur lors du chargement des demandes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres et le tri
  useEffect(() => {
    if (demandes.length > 0) {
      let filtered = consultationDemandesService.filterDemandes(demandes, filters);
      filtered = consultationDemandesService.sortDemandes(filtered, sortBy, sortOrder);
      
      // Filtrage supplémentaire par recherche
      if (filters.search) {
        filtered = filtered.filter(demande => {
          const searchTerm = filters.search.toLowerCase();
          const consultationTitle = demande.consultation_offer?.title?.toLowerCase() || '';
          const candidateName = demande.candidate_profile?.user?.first_name?.toLowerCase() || '';
          const candidateLastName = demande.candidate_profile?.user?.last_name?.toLowerCase() || '';
          const candidateUsername = demande.candidate_profile?.user?.username?.toLowerCase() || '';
          
          return consultationTitle.includes(searchTerm) || 
                 candidateName.includes(searchTerm) || 
                 candidateLastName.includes(searchTerm) || 
                 candidateUsername.includes(searchTerm);
        });
      }
      
      const formatted = filtered.map(demande => 
        consultationDemandesService.formatDemandeForDisplay(demande)
      );
      setFormattedDemandes(formatted);
    }
  }, [demandes, filters, sortBy, sortOrder]);

  // Gérer le changement de filtre
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Gérer le changement de tri
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Ouvrir le modal d'action
  const openActionModal = (demande, type) => {
    setSelectedDemande(demande);
    setActionType(type);
    setActionReason('');
    setShowActionModal(true);
  };

  // Fermer le modal d'action
  const closeActionModal = () => {
    setShowActionModal(false);
    setSelectedDemande(null);
    setActionType('');
    setActionReason('');
  };

  // Exécuter l'action sélectionnée
  const executeAction = async () => {
    if (!selectedDemande || !actionType) return;
    
    try {
      setProcessingAction(true);
      
      // Marquer la demande comme vue
      const result = await consultationDemandesService.markDemandeAsViewed(
        selectedDemande.applicationId
      );
      
      console.log('✅ Demande marquée comme vue:', result);
      
      // Recharger les demandes pour mettre à jour l'affichage
      await loadDemandes();
      
      // Fermer le modal
      closeActionModal();
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour. Veuillez réessayer.');
    } finally {
      setProcessingAction(false);
    }
  };

  // Obtenir le texte de l'action
  const getActionText = () => 'Voir les détails';

  // Obtenir la couleur de l'action
  const getActionColor = () => 'bg-orange-600 hover:bg-orange-700';

  // Obtenir l'icône de l'action
  const getActionIcon = () => 'fas fa-eye';

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater le score de compatibilité
  const formatScore = (score) => {
    if (!score || score === 0) return 'N/A';
    return `${parseFloat(score).toFixed(1)}%`;
  };

  // Obtenir la couleur du score
  const getScoreColor = (score) => {
    if (!score || score === 0) return 'text-gray-500';
    const numScore = parseFloat(score);
    if (numScore >= 80) return 'text-green-600';
    if (numScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chargement des demandes...</h2>
          <p className="text-gray-600">Récupération des candidatures reçues</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              <i className="fas fa-inbox text-orange-600 mr-3"></i>
              Demandes de consultation
            </h1>
            <p className="text-gray-600">Gérez les candidatures  pour vos consultations</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <i className="fas fa-filter mr-2"></i>
              {showFilters ? 'Masquer' : 'Afficher'} les filtres
            </button>
            
            <button
              onClick={loadDemandes}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistiques */}
      {formattedDemandes && formattedDemandes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-list text-blue-600 text-lg"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="fas fa-clock text-yellow-600 text-lg"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-star text-blue-600 text-lg"></i>
            </div>
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Shortlist</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlisted || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-check text-green-600 text-lg"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accepted || 0}</p>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
              <input
                type="text"
              placeholder="Rechercher par titre de consultation ou candidat..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="SHORTLISTED">Pré-sélectionnée</option>
              <option value="ACCEPTED">Acceptée</option>
              <option value="REJECTED">Refusée</option>
              <option value="WITHDRAWN">Retirée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      {formattedDemandes.length > 0 ? (
      <div className="space-y-4">
          {formattedDemandes.map((demande) => (
            <div key={demande.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {/* Photo du candidat */}
                    <div className="flex-shrink-0">
                      {demande.candidateImage ? (
                        <img
                          src={`http://localhost:8000${demande.candidateImage}`}
                          alt={demande.candidateName}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <i className="fas fa-user text-gray-400 text-xl"></i>
            </div>
            )}
          </div>

                    {/* Détails de la consultation */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {demande.consultationTitle || 'Titre non disponible'}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${demande.statusColor}`}>
                          {demande.statusDisplay}
                        </span>
                        {!demande.viewedAt && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            Nouveau
                        </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        <i className="fas fa-user text-gray-400 mr-2"></i>
                        {demande.candidateName} • {demande.candidateUserType}
                      </p>
                      
                      {/* Informations essentielles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-tag text-gray-400 mr-2"></i>
                          <span className="truncate">
                            {demande.consultationType || 'Type non spécifié'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-globe text-gray-400 mr-2"></i>
                          <span className="truncate">
                            {demande.expertiseSector || 'Secteur non spécifié'}
                          </span>
                    </div>

                      <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-briefcase text-gray-400 mr-2"></i>
                          <span className="truncate">
                            {demande.deliveryMode || 'Mode non spécifié'}
                          </span>
                      </div>
                        
                      <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-clock text-gray-400 mr-2"></i>
                          <span className="truncate">
                            {demande.estimatedDuration || 'Durée non spécifiée'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Score IA et autres détails */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-chart-line text-gray-400 mr-2"></i>
                          <span>
                            Score IA: {demande.hasAIAnalysis ? formatScore(demande.aiCompatibilityScore) : 'N/A'}
                          </span>
                      </div>
                        
                      <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                          <span>
                            Postulé le {formatDate(demande.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Urgence et date de fin */}
                      {demande.isUrgent && (
                        <div className="flex items-center text-sm text-red-600 mb-2">
                          <i className="fas fa-hourglass-half mr-2"></i>
                          <span className="font-medium">CONSULTATION URGENTE</span>
                        </div>
                      )}
                      
                      {demande.endDate && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                          <span>
                            Date limite: {formatDate(demande.endDate)}
                          </span>
                        </div>
                      )}
                    </div>
                      </div>
                    </div>

                {/* Actions */}
                <div className="flex justify-end mt-4 lg:mt-0 lg:ml-4">
                  <button
                    onClick={() => openActionModal(demande, 'view')}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                  >
                    <i className="fas fa-eye mr-2"></i>
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-inbox text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
          <p className="text-gray-500 mb-6">
            {demandes && demandes.length === 0 
              ? "Vous n'avez pas encore reçu de demandes de consultation."
              : "Aucune demande ne correspond à vos critères de recherche."
            }
          </p>
        </div>
      )}

      {/* Modal d'action */}
      {showActionModal && selectedDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  <i className="fas fa-eye text-orange-600 mr-2"></i>
                  Détails de la candidature
                </h2>
                <button 
                  onClick={closeActionModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Détails de la candidature</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Candidat:</span>
                      <span className="font-medium">{selectedDemande.candidateName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation:</span>
                      <span className="font-medium">{selectedDemande.consultationTitle}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedDemande.consultationType}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Score IA:</span>
                      <span className="font-medium">{selectedDemande.hasAIAnalysis ? formatScore(selectedDemande.aiCompatibilityScore) : 'N/A'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de candidature:</span>
                      <span className="font-medium">{formatDate(selectedDemande.createdAt)}</span>
                    </div>
                  </div>
                    </div>
                  </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeActionModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={executeAction}
                  disabled={processingAction}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingAction ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-eye mr-2"></i>
                      Marquer comme vue
                    </>
                  )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
    </div>
  );
};

export default Demandes; 