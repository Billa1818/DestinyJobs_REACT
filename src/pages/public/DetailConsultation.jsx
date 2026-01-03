import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';
import ShareModal from '../../components/ShareModal';
import SavedOfferButton from '../../components/SavedOfferButton';
import LoadingSpinner from '../../components/LoadingSpinner';

const DetailConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Vérifier si l'utilisateur connecté est le recruteur de cette consultation
  const isRecruiterOfThisConsultation = isAuthenticated && user && consultation?.recruiter?.id === user.id;

  // Vérifier si la consultation est accessible publiquement
  const isPubliclyAccessible = consultation ? (consultation.status === 'APPROVED' || consultation.status === 'PUBLISHED') : false;

  // Vérifier si la consultation est en attente d'approbation
  const isPendingApproval = consultation ? consultation.status === 'PENDING_APPROVAL' : false;

  // Vérifier si la consultation est un brouillon
  const isDraft = consultation ? consultation.status === 'DRAFT' : false;

  // Vérifier si la consultation est rejetée
  const isRejected = consultation ? consultation.status === 'REJECTED' : false;

  useEffect(() => {
    loadConsultationDetail();
  }, [id]);

  const loadConsultationDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const consultationData = await consultationService.getPublicConsultationDetail(id);
      setConsultation(consultationData);
    } catch (error) {
      console.error('Erreur lors du chargement de la consultation:', error);
      
      // Gérer spécifiquement l'erreur 403 (Forbidden) - Accès refusé
      if (error.response && error.response.status === 403) {
        navigate('/404', { replace: true });
        return;
      }
      
      // Gérer le cas spécifique de l'API qui retourne un message d'erreur dans le corps
      if (error.response?.data?.error === "Cette consultation n'est pas disponible") {
        navigate('/404', { replace: true });
        return;
      }
      
      // Gérer l'erreur 404 (Not Found) - Consultation inexistante
      if (error.response && error.response.status === 404) {
        console.log('🔍 Consultation non trouvée (404) - Redirection vers 404');
        navigate('/404', { replace: true });
        return;
      }
      
      setError('Erreur lors du chargement de la consultation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    // Si c'est une consultation admin_only, rediriger vers site_url
    if (consultation?.is_admin_only && consultation?.site_url) {
      window.open(consultation.site_url, '_blank');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    navigate(`/ia-compatibility/${id}/consultation`);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner variant="page" size="lg" text="Chargement de la consultation..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
            <h3 className="text-lg font-medium text-red-800 mb-2">Erreur</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/consultations"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              Retour aux consultations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!consultation || !consultation.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner variant="page" size="lg" text="Chargement des données de la consultation..." />
      </div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'Publiée';
      case 'DRAFT': return 'Brouillon';
      case 'PENDING_APPROVAL': return 'En attente d\'approbation';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Refusée';
      case 'EXPIRED': return 'Expirée';
      case 'CLOSED': return 'Fermée';
      default: return status || 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'EXPIRED': return 'bg-orange-100 text-orange-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PUBLISHED': return 'fa-eye';
      case 'DRAFT': return 'fa-file-alt';
      case 'PENDING_APPROVAL': return 'fa-clock';
      case 'APPROVED': return 'fa-check-circle';
      case 'REJECTED': return 'fa-times-circle';
      case 'EXPIRED': return 'fa-calendar-times';
      case 'CLOSED': return 'fa-times';
      default: return 'fa-info-circle';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la consultation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{consultation.title}</h1>
              
              {/* Informations de l'entreprise en header */}
              {consultation.company_details && (
                <div className="flex items-center mb-4">
                  {consultation.company_logo && (
                    <div className="mr-3">
                      <img 
                        src={consultation.company_logo}
                        alt={consultation.company_details.company_name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{consultation.company_details.company_name}</h2>
                    {consultation.region && consultation.country && (
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {consultation.region.name}, {consultation.country.name}
                      </p>
                    )}
                  </div>
                </div>
              )}
                
              <div className="flex flex-wrap gap-2 mb-4">
                {consultation.region && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {consultation.region.name}
                  </span>
                )}
                {consultation.country && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {consultation.country.name}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {consultation.created_at && (
                  <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {new Date(consultation.created_at).toLocaleDateString('fr-FR')}</span>
                )}
                {consultation.updated_at && (
                  <span><i className="fas fa-calendar-edit mr-1"></i>Modifiée le {new Date(consultation.updated_at).toLocaleDateString('fr-FR')}</span>
                )}
            </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:ml-6">
              {/* Bouton Postuler - visible uniquement pour les consultations publiques et non créateur */}
              {!isRecruiterOfThisConsultation && isPubliclyAccessible && (
                <button
                  onClick={handleApply}
                  className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                >
                  <i className={`mr-2 ${consultation?.is_admin_only ? 'fas fa-external-link-alt' : 'fas fa-paper-plane'}`}></i>
                  {consultation?.is_admin_only ? 'Postuler sur le site' : 'Postuler maintenant'}
                </button>
              )}
              
              {/* Bouton Éditer - visible uniquement pour l'auteur de la consultation */}
              {isRecruiterOfThisConsultation && (
                <button
                  onClick={() => navigate(`/recruteur/creer-consultation?edit=${id}`)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Éditer la consultation
                </button>
              )}
              
              {/* Bouton Sauvegarder - visible uniquement pour les consultations publiques et non créateur */}
              {!isRecruiterOfThisConsultation && isPubliclyAccessible && (
                <SavedOfferButton
                  offerId={id}
                  offerType="CONSULTATION"
                  className="w-full px-6 py-3 border rounded-lg font-medium"
                />
              )}
              
              {/* Bouton Partager - toujours visible */}
              <button
                onClick={handleShare}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                <i className="fas fa-share mr-2"></i>
                Partager
              </button>
              
              {/* Messages informatifs selon le statut et les permissions */}
              {isRecruiterOfThisConsultation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-700">
                    <i className="fas fa-info-circle mr-1"></i>
                    Vous consultez votre propre consultation
                  </p>
                </div>
              )}
              
              {/* Message pour consultations en attente d'approbation (visiteurs) */}
              {!isRecruiterOfThisConsultation && isPendingApproval && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-700">
                    <i className="fas fa-clock mr-1"></i>
                    Cette consultation est en attente d'approbation
                  </p>
                </div>
              )}
              
              {/* Message pour consultations brouillon (visiteurs) */}
              {!isRecruiterOfThisConsultation && isDraft && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-700">
                    <i className="fas fa-file-alt mr-1"></i>
                    Cette consultation est en cours de rédaction
                  </p>
                </div>
              )}
              
              {/* Message pour consultations rejetées (visiteurs) */}
              {!isRecruiterOfThisConsultation && isRejected && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-red-700">
                    <i className="fas fa-times-circle mr-1"></i>
                    Cette consultation a été rejetée
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statut de la consultation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statut de la consultation</h2>
              <div className="space-y-4">
                {/* Badge de statut */}
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    <i className={`fas ${getStatusIcon(consultation.status)} mr-2`}></i>
                    {getStatusText(consultation.status)}
                  </span>
                </div>

                {/* Informations supplémentaires selon le statut */}
                {isPendingApproval && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>En attente d'approbation :</strong> Cette consultation est en cours de validation par notre équipe. 
                      {isRecruiterOfThisConsultation ? ' Vous recevrez une notification dès qu\'elle sera approuvée.' : ' Elle sera visible publiquement une fois approuvée.'}
                    </p>
                  </div>
                )}
                
                {isDraft && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>Brouillon :</strong> Cette consultation est en cours de rédaction et n'est pas encore soumise pour approbation.
                      {isRecruiterOfThisConsultation ? ' Vous pouvez continuer à l\'éditer avant de la soumettre.' : ''}
                    </p>
                  </div>
                )}
                
                {isRejected && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>Rejetée :</strong> Cette consultation n'a pas été approuvée par notre équipe.
                      {isRecruiterOfThisConsultation ? ' Vous pouvez la modifier et la soumettre à nouveau.' : ''}
                    </p>
                  </div>
                )}
                
                {isPubliclyAccessible && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <i className="fas fa-check-circle mr-2"></i>
                      <strong>Consultation active :</strong> Cette consultation est visible publiquement et les prestataires peuvent postuler.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description du projet */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du projet</h2>
              <div className="prose max-w-none text-gray-600">
                {consultation.description ? (
                  <p>{consultation.description}</p>
                ) : (
                  <p>Aucune description disponible pour cette consultation.</p>
                )}
              </div>
            </div>

            {/* Documents */}
            {consultation.documents_url && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
                <a 
                  href={consultation.documents_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
                >
                  <i className="fas fa-download mr-2"></i>
                  Télécharger les documents
                </a>
              </div>
            )}
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* À propos de l'entreprise */}
            {consultation.company_details && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de l'entreprise</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {consultation.company_logo && (
                      <img
                        src={consultation.company_logo}
                        alt={consultation.company_details.company_name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {consultation.company_details.company_name}
                      </h4>
                      {consultation.company_details.sector && (
                        <p className="text-sm text-gray-600">{consultation.company_details.sector}</p>
                      )}
                    </div>
                  </div>
                  
                  {consultation.company_details.description && (
                    <p className="text-sm text-gray-700">{consultation.company_details.description}</p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {consultation.company_details.company_size && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taille :</span>
                        <span className="text-gray-900 font-medium">{consultation.company_details.company_size}</span>
                      </div>
                    )}
                    {consultation.company_details.website && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Site web :</span>
                        <a 
                          href={consultation.company_details.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                        >
                          Visiter
                        </a>
                      </div>
                    )}
                    {consultation.country && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pays :</span>
                        <span className="text-gray-900 font-medium">
                          {consultation.country.name}
                        </span>
                      </div>
                    )}
                    {consultation.region && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Région :</span>
                        <span className="text-gray-900 font-medium">
                          {consultation.region.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Informations du recruteur */}
                  {consultation.recruiter && (
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Recruteur</h5>
                      <div className="text-sm text-gray-600">
                        <p>{consultation.recruiter.first_name} {consultation.recruiter.last_name}</p>
                        <p className="text-xs text-gray-500">
                          Membre depuis {new Date(consultation.recruiter.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Date limite */}
            {consultation.application_deadline && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date limite</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {new Date(consultation.application_deadline).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-500">Date limite de candidature</div>
                </div>
              </div>
            )}

            {/* Informations de contact */}
            {consultation.recruiter && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
                <div className="space-y-3">
                  {consultation.recruiter.email && (
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-envelope text-gray-400"></i>
                      <span className="text-gray-700">{consultation.recruiter.email}</span>
                    </div>
                  )}
                  {consultation.recruiter.phone && (
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-phone text-gray-400"></i>
                      <span className="text-gray-700">{consultation.recruiter.phone}</span>
                    </div>
                  )}
                  {consultation.recruiter.first_name && consultation.recruiter.last_name && (
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-user text-gray-400"></i>
                      <span className="text-gray-700">
                        {consultation.recruiter.first_name} {consultation.recruiter.last_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de partage */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={consultation?.title}
        url={window.location.href}
      />
    </div>
  );
};

export default DetailConsultation;
