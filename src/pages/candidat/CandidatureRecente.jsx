import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const CandidatureRecente = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  
  // États pour les modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editForm, setEditForm] = useState({
    coverLetter: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const applicationsData = await dataService.getUserApplications(user.id);
      setApplications(applicationsData);
    } catch (error) {
      setError('Erreur lors du chargement des candidatures');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'text-yellow-600 bg-yellow-100';
      case 'examinee': return 'text-blue-600 bg-blue-100';
      case 'entretien': return 'text-purple-600 bg-purple-100';
      case 'acceptee': return 'text-green-600 bg-green-100';
      case 'refusee': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'examinee': return 'Examinée';
      case 'entretien': return 'Entretien';
      case 'acceptee': return 'Acceptée';
      case 'refusee': return 'Refusée';
      default: return 'Inconnu';
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesStatus = !filters.status || application.status === filters.status;
    const matchesSearch = !filters.search || 
      application.offerTitle?.toLowerCase().includes(filters.search.toLowerCase()) ||
      application.companyName?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour ouvrir le modal de modification
  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setEditForm({
      coverLetter: application.coverLetter || ''
    });
    setShowEditModal(true);
  };

  // Fonction pour ouvrir le modal de suppression
  const handleDeleteClick = (application) => {
    setSelectedApplication(application);
    setShowDeleteModal(true);
  };

  // Fonction pour modifier une candidature
  const handleEditApplication = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    // Validation
    if (!editForm.coverLetter.trim()) {
      setError('La lettre de motivation ne peut pas être vide');
      return;
    }

    setProcessing(true);
    setError(''); // Réinitialiser les erreurs précédentes
    
    try {
      console.log('Données à envoyer:', {
        id: selectedApplication.id,
        coverLetter: editForm.coverLetter
      });

      await dataService.updateApplication(selectedApplication.id, {
        coverLetter: editForm.coverLetter.trim()
      });

      // Mettre à jour la liste des candidatures
      await fetchApplications();
      setShowEditModal(false);
      setSelectedApplication(null);
      setEditForm({ coverLetter: '' });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      let errorMessage = 'Erreur lors de la modification de la candidature';
      
      if (error.message.includes('404')) {
        errorMessage = 'Candidature non trouvée. Elle a peut-être été supprimée.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Données invalides. Vérifiez votre lettre de motivation.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // Fonction pour supprimer une candidature
  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;

    setProcessing(true);
    try {
      await dataService.deleteApplication(selectedApplication.id);
      
      // Mettre à jour la liste des candidatures
      await fetchApplications();
      setShowDeleteModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      let errorMessage = 'Erreur lors de la suppression de la candidature';
      
      if (error.message.includes('404')) {
        errorMessage = 'Candidature non trouvée. Elle a peut-être déjà été supprimée.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Impossible de supprimer cette candidature.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mes candidatures</h1>
            <p className="text-gray-600">Suivez l'état de vos candidatures aux offres d'emploi</p>
          </div>
          <Link 
            to="/candidat/offre"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>Nouvelle candidature
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-file-alt text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-clock text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'en_attente').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user-tie text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Entretiens</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'entretien').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'acceptee').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Titre de l'offre ou entreprise..."
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="examinee">Examinée</option>
              <option value="entretien">Entretien</option>
              <option value="acceptee">Acceptée</option>
              <option value="refusee">Refusée</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', search: '' })}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-list mr-2 text-fuchsia-600"></i>
            Candidatures ({filteredApplications.length})
          </h2>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-alt text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
            <p className="text-gray-600 mb-4">
              {applications.length === 0 
                ? "Vous n'avez pas encore postulé à des offres d'emploi."
                : "Aucune candidature ne correspond à vos critères de recherche."
              }
            </p>
            <Link 
              to="/candidat/offre"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Postuler à une offre
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-briefcase text-fuchsia-600 text-xl"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.offerTitle || 'Titre non disponible'}
                          </h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                        <p className="text-fuchsia-600 font-medium mb-2">
                          {application.companyName || 'Entreprise non spécifiée'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <i className="fas fa-calendar mr-2 text-fuchsia-600"></i>
                            <span>Postulé le {formatDate(application.appliedAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-file-alt mr-2 text-fuchsia-600"></i>
                            <span>Lettre de motivation</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
                            <span>En cours de traitement</span>
                          </div>
                        </div>

                        {application.coverLetter && (
                          <div className="bg-gray-50 p-4 rounded-lg mb-3">
                            <h4 className="font-medium text-gray-900 mb-2">Votre lettre de motivation</h4>
                            <p className="text-gray-700 text-sm line-clamp-3">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Link
                      to={`/candidat/offres/${application.offerId}`}
                      className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm font-medium"
                    >
                      <i className="fas fa-eye mr-2"></i>Voir l'offre
                    </Link>
                    <button 
                      onClick={() => handleEditClick(application)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm"
                    >
                      <i className="fas fa-edit mr-2"></i>Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(application)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition duration-200 text-sm"
                    >
                      <i className="fas fa-trash mr-2"></i>Retirer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de modification */}
      {showEditModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Modifier la candidature</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleEditApplication}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                      Lettre de motivation
                    </label>
                    <textarea
                      id="coverLetter"
                      value={editForm.coverLetter}
                      onChange={(e) => setEditForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                      placeholder="Modifiez votre lettre de motivation..."
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
                    >
                      {processing ? 'Modification...' : 'Modifier'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Supprimer la candidature</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2 text-center">Êtes-vous sûr ?</h4>
                <p className="text-gray-600 text-center">
                  Cette action supprimera définitivement votre candidature pour l'offre "{selectedApplication.offerTitle}".
                  Cette action ne peut pas être annulée.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteApplication}
                  disabled={processing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
                >
                  {processing ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatureRecente;
