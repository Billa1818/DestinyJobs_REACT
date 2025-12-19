import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';

const DetailConsultation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Charger le détail de l'offre
  useEffect(() => {
    if (id) {
      loadConsultationDetail();
    }
  }, [id]);

  const loadConsultationDetail = async () => {
    try {
      setLoading(true);
      const data = await consultationService.getConsultationOfferDetail(id);
      setConsultation(data);
    } catch (error) {
      setError('Erreur lors du chargement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400 text-2xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-red-800 mb-2">Erreur</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => navigate('/recruteur/gestion-consultations')}
              className="ml-4 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm text-center">
          <p className="text-gray-600">Offre non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {consultation.title}
            </h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
              {getStatusLabel(consultation.status)}
            </span>
          </div>
          <button
            onClick={() => navigate('/recruteur/gestion-consultations')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Retour
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Section principale */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-file-alt mr-2 text-blue-600"></i>
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {consultation.description}
            </p>
          </div>

          {/* Localisation */}
          {(consultation.country || consultation.region) && (
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-purple-600"></i>
                Localisation
              </h2>
              <div className="space-y-2">
                {consultation.country && (
                  <p className="text-gray-700">
                    <span className="font-medium">Pays :</span> {consultation.country.name}
                  </p>
                )}
                {consultation.region && (
                  <p className="text-gray-700">
                    <span className="font-medium">Région :</span> {consultation.region.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          {consultation.documents && (
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-file-download mr-2 text-indigo-600"></i>
                Documents
              </h2>
              <a
                href={consultation.documents}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
              >
                <i className="fas fa-download mr-2"></i>
                Télécharger le document
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Informations */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Créée le</p>
                <p className="text-gray-900 font-medium">
                  {new Date(consultation.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {consultation.updated_at && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dernière modification</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(consultation.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Statut</p>
                <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                  {getStatusLabel(consultation.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/recruteur/modifier-consultation?edit=${consultation.id}`)}
                className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition flex items-center justify-center"
              >
                <i className="fas fa-edit mr-2"></i>
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailConsultation;
