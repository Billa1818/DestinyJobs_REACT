import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bourseService from '../../services/bourseService';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import BourseStats from '../../components/BourseStats';
import BoursePagination from '../../components/BoursePagination';

const GestionBourse = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Filtres
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [scholarshipType, setScholarshipType] = useState('');
  const [studyDomain, setStudyDomain] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  
  // Modal de suppression
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    scholarshipId: null,
    scholarshipTitle: ''
  });

  // Charger les bourses au montage du composant
  useEffect(() => {
    loadScholarships();
  }, [currentPage, status, scholarshipType, studyDomain]);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bourseService.getMyScholarships();
      setScholarships(response.results || response);
      setTotalPages(Math.ceil((response.count || response.length) / pageSize));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadScholarships();
  };

  const handleDelete = async (id) => {
    try {
      await bourseService.deleteScholarship(id);
      setNotification({
        type: 'success',
        message: 'Bourse supprimée avec succès !'
      });
      loadScholarships(); // Recharger la liste
      closeDeleteModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleModifier = (id) => {
    navigate(`/recruteur/creer-bourse?edit=${id}`);
  };

  const handleApercu = (id) => {
    navigate(`/bourses/${id}`);
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      scholarshipId: id,
      scholarshipTitle: title
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      scholarshipId: null,
      scholarshipTitle: ''
    });
  };

  const getStatusText = (scholarship) => {
    if (scholarship.application_deadline) {
      const deadline = new Date(scholarship.application_deadline);
      const now = new Date();
      if (deadline < now) {
        return 'Limite expirée';
      }
    }
    switch (scholarship.status) {
      case 'PUBLISHED': return 'Publiée';
      case 'PENDING_APPROVAL': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Refusée';
      case 'EXPIRED': return 'Expirée';
      case 'CLOSED': return 'Fermée';
      case 'DRAFT': return 'Brouillon';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (scholarship) => {
    if (scholarship.application_deadline) {
      const deadline = new Date(scholarship.application_deadline);
      const now = new Date();
      if (deadline < now) {
        return 'bg-red-600 text-white'; // Limite expirée
      }
    }
    switch (scholarship.status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-orange-100 text-orange-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return 'À négocier';
    return new Intl.NumberFormat('fr-FR').format(parseFloat(amount)) + ' FCFA';
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = search === '' || 
      scholarship.title.toLowerCase().includes(search.toLowerCase()) ||
      (scholarship.study_domain?.name && scholarship.study_domain.name.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = status === '' || scholarship.status === status;
    const matchesType = scholarshipType === '' || scholarship.scholarship_type?.id === parseInt(scholarshipType);
    const matchesDomain = studyDomain === '' || scholarship.study_domain?.id === parseInt(studyDomain);
    
    return matchesSearch && matchesStatus && matchesType && matchesDomain;
  });

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des bourses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Bourses</h1>
              <p className="mt-2 text-gray-600">
                Gérez vos bourses d'études et suivez les candidatures
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => navigate('/recruteur/creer-bourse')}
                className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
              >
                <i className="fas fa-plus mr-2"></i>
                Créer une bourse
              </button>
            </div>
          </div>
        </div>


        {/* Statistiques */}
        <BourseStats scholarships={scholarships} />

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Rechercher une bourse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              />
            </div>
            
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            >
              <option value="">Tous les statuts</option>
              <option value="DRAFT">Brouillons</option>
              <option value="PENDING_APPROVAL">En attente d'approbation</option>
              <option value="APPROVED">Approuvées</option>
              <option value="PUBLISHED">Publiées</option>
              <option value="REJECTED">Refusées</option>
              <option value="EXPIRED">Expirées</option>
              <option value="CLOSED">Fermées</option>
              <option value="DEADLINE_EXPIRED">Limite expirée</option>
              <option value="DEADLINE_SOON">Limite proche (≤30j)</option>
            </select>
            
            <select
              value={scholarshipType}
              onChange={(e) => setScholarshipType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            >
              <option value="">Tous les types</option>
              {Array.from(new Set(scholarships.map(s => s.scholarship_type?.id))).map(typeId => {
                const type = scholarships.find(s => s.scholarship_type?.id === typeId)?.scholarship_type;
                return type ? (
                  <option key={typeId} value={typeId}>{type.name}</option>
                ) : null;
              })}
            </select>
            
            <button
              type="submit"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-search mr-2"></i>
              Filtrer
          </button>
          </form>
        </div>

        {/* Liste des bourses */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredScholarships.length === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-graduation-cap text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune bourse trouvée</h3>
              <p className="text-gray-600 mb-4">
                {search || status || scholarshipType || studyDomain 
                  ? 'Aucune bourse ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore créé de bourse.'
                }
              </p>
              {!search && !status && !scholarshipType && !studyDomain && (
                <button
                  onClick={() => navigate('/recruteur/creer-bourse')}
                  className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200"
                >
                  Créer votre première bourse
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredScholarships.map((scholarship) => (
                <div key={scholarship.id} className="p-6 hover:bg-gray-50 transition duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {scholarship.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scholarship)}`}>
                              {getStatusText(scholarship)}
                            </span>
                            
                            {scholarship.scholarship_type && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {scholarship.scholarship_type.name}
                              </span>
                            )}
                            
                            {scholarship.study_domain && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {scholarship.study_domain.name}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Montant :</span>
                              <p>{formatAmount(scholarship.scholarship_amount)}</p>
                            </div>
                            <div>
                              <span className="font-medium">Durée :</span>
                              <p>{scholarship.duration || 'Non précisée'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Bénéficiaires :</span>
                              <p>{scholarship.beneficiary_count || 'Non précisé'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Vues :</span>
                              <p>{scholarship.views_count || 0}</p>
        </div>
      </div>

                          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                            {scholarship.created_at && (
                              <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {new Date(scholarship.created_at).toLocaleDateString('fr-FR')}</span>
                            )}
                            {scholarship.updated_at && (
                              <span><i className="fas fa-calendar-edit mr-1"></i>Modifiée le {new Date(scholarship.updated_at).toLocaleDateString('fr-FR')}</span>
                            )}
                            {scholarship.application_deadline && (
                              <span><i className="fas fa-calendar-times mr-1"></i>Date limite : {new Date(scholarship.application_deadline).toLocaleDateString('fr-FR')}</span>
                            )}
        </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => handleApercu(scholarship.id)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                      >
                        <i className="fas fa-eye mr-2"></i>Aperçu
                      </button>
                      
                      <button
                        onClick={() => handleModifier(scholarship.id)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                      >
                        <i className="fas fa-edit mr-2"></i>Modifier
                      </button>
                      
                      <button
                        onClick={() => openDeleteModal(scholarship.id, scholarship.title)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                      >
                        <i className="fas fa-trash mr-2"></i>Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <BoursePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.scholarshipId)}
        title="Supprimer la bourse"
        message={`Êtes-vous sûr de vouloir supprimer la bourse "${deleteModal.scholarshipTitle}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
};

export default GestionBourse;