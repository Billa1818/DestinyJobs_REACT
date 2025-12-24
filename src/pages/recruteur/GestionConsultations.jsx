import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';
import LoadingSpinner from '../../components/LoadingSpinner';

const GestionConsultations = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les offres de consultation au montage
  useEffect(() => {
    loadConsultations();
  }, []);

  // Charger les offres de consultation
  const loadConsultations = async () => {
    try {
      setLoading(true);
      const data = await consultationService.getMyConsultationOffers();
      setConsultations(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      setError('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une offre
  const handleDelete = async (offerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        setLoading(true);
        await consultationService.deleteConsultationOffer(offerId);
        loadConsultations();
      } catch (error) {
        setError('Erreur lors de la suppression de l\'offre');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filtrer les offres
  const filteredConsultations = consultations.filter(consultation => {
    if (filter === 'all') return true;
    return consultation.status === filter;
  });

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le label du statut
  const getStatusLabel = (status) => {
    switch (status) {
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
      default:
        return status;
    }
  };

  if (loading && !consultations.length) {
    return (
      <LoadingSpinner 
        variant="page" 
        size="lg" 
        text="Chargement des offres..."
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-handshake mr-2 text-fuchsia-600"></i>
              Gestion des offres de consultation
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez et suivez vos offres de consultation
            </p>
          </div>
          <button
            onClick={() => navigate('/recruteur/creer-consultation')}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200 flex items-center justify-center whitespace-nowrap"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvelle offre
          </button>
        </div>
      </div>

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

      {/* Filtres */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md transition duration-200 ${
                filter === status
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tous' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des offres */}
      {filteredConsultations.length === 0 ? (
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <i className="fas fa-inbox text-3xl text-gray-400 mb-4 block"></i>
          <p className="text-gray-600">
            {consultations.length === 0
              ? 'Aucune offre de consultation créée. '
              : 'Aucune offre ne correspond au filtre sélectionné.'}
            <button
              onClick={() => navigate('/recruteur/creer-consultation')}
              className="text-fuchsia-600 hover:text-fuchsia-700 font-medium ml-1"
            >
              Créer une offre
            </button>
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredConsultations.map(consultation => (
            <div key={consultation.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {consultation.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {consultation.description}
                      </p>

                      {/* Informations supplémentaires */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        {consultation.country && (
                          <span>
                            <i className="fas fa-map-marker-alt mr-1 text-gray-400"></i>
                            {consultation.country.name}
                            {consultation.region && ` - ${consultation.region.name}`}
                          </span>
                        )}
                        <span>
                          <i className="fas fa-calendar mr-1 text-gray-400"></i>
                          {new Date(consultation.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {/* Statut */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(consultation.status)}`}>
                      {getStatusLabel(consultation.status)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:flex-col">
                  <button
                    onClick={() => navigate(`/recruteur/consultation/${consultation.id}`)}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition duration-200 flex items-center justify-center text-sm"
                  >
                    <i className="fas fa-eye mr-1"></i>
                    Voir
                  </button>
                  <button
                    onClick={() => navigate(`/recruteur/modifier-consultation?edit=${consultation.id}`)}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition duration-200 flex items-center justify-center text-sm"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(consultation.id)}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition duration-200 flex items-center justify-center text-sm"
                  >
                    <i className="fas fa-trash mr-1"></i>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestionConsultations;
