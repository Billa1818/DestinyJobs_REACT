import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';
import ShareModal from '../../components/ShareModal';
import SavedOfferButton from '../../components/SavedOfferButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

const DetailFinancement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [funding, setFunding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Vérifier si l'utilisateur connecté est le recruteur de ce financement
  const isRecruiterOfThisFunding = isAuthenticated && user && funding?.recruiter?.id === user.id;

  // Vérifier si le financement est accessible publiquement
  const isPubliclyAccessible = funding ? (funding.status === 'APPROVED' || funding.status === 'PUBLISHED') : false;

  // Vérifier si le financement est en attente d'approbation
  const isPendingApproval = funding ? funding.status === 'PENDING_APPROVAL' : false;

  // Vérifier si le financement est un brouillon
  const isDraft = funding ? funding.status === 'DRAFT' : false;

  // Vérifier si le financement est rejeté
  const isRejected = funding ? funding.status === 'REJECTED' : false;

  useEffect(() => {
    loadFundingDetail();
  }, [id]);

  const loadFundingDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fundingData = await consultationService.getFundingOfferDetail(id);
      setFunding(fundingData);
    } catch (error) {
      console.error('Erreur lors du chargement du financement:', error);
      
      if (error.response && error.response.status === 403) {
        navigate('/404', { replace: true });
        return;
      }
      
      if (error.response && error.response.status === 404) {
        console.log('Financement non trouvé (404) - Redirection vers 404');
        navigate('/404', { replace: true });
        return;
      }
      
      setError('Erreur lors du chargement de l\'offre de financement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de formatage
  const formatAmount = (amount) => {
    if (!amount) return 'À négocier';
    return new Intl.NumberFormat('fr-FR').format(parseFloat(amount)) + ' €';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non précisée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusText = (status) => {
    const statusMap = {
      'DRAFT': 'Brouillon',
      'PENDING_APPROVAL': 'En attente d\'approbation',
      'APPROVED': 'Approuvée',
      'PUBLISHED': 'Publiée',
      'REJECTED': 'Rejetée',
      'CLOSED': 'Fermée',
      'EXPIRED': 'Expirée'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'PUBLISHED': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'CLOSED': 'bg-gray-100 text-gray-800',
      'EXPIRED': 'bg-orange-100 text-orange-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Fonction helper pour obtenir le logo avec priorité
  const getLogoWithPriority = (fundingData) => {
    if (fundingData.is_admin_only) {
      // Priorité: admin_company_logo > company_logo > null
      if (fundingData.admin_company_logo) {
        return fundingData.admin_company_logo.startsWith('http') 
          ? fundingData.admin_company_logo 
          : buildImageUrl(fundingData.admin_company_logo);
      }
      if (fundingData.company_logo) {
        return fundingData.company_logo.startsWith('http') 
          ? fundingData.company_logo 
          : buildImageUrl(fundingData.company_logo);
      }
    } else {
      // Priorité: company_logo > admin_company_logo > null
      if (fundingData.company_logo) {
        return fundingData.company_logo.startsWith('http') 
          ? fundingData.company_logo 
          : buildImageUrl(fundingData.company_logo);
      }
      if (fundingData.admin_company_logo) {
        return fundingData.admin_company_logo.startsWith('http') 
          ? fundingData.admin_company_logo 
          : buildImageUrl(fundingData.admin_company_logo);
      }
    }
    return null;
  };

  const handleApply = () => {
    // Si c'est un financement admin_only, rediriger vers site_url
    if (funding?.is_admin_only && funding?.site_url) {
      window.open(funding.site_url, '_blank');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    navigate(`/ia-compatibility/${id}/financement`);
  };



  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner variant="page" size="lg" text="Chargement de l'offre de financement..." />
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
              to="/financements"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              Retour aux financements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!funding || !funding.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner variant="page" size="lg" text="Chargement des données du financement..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du financement */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{funding.title}</h1>
              
              {/* Information du recruteur en header */}
              {funding.recruiter && (
                <div className="flex items-center mb-4">
                  {(() => {
                    const logoUrl = getLogoWithPriority(funding);
                    return logoUrl ? (
                      <div className="mr-3">
                        <img 
                          src={logoUrl}
                          alt={funding.organization_name}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null;
                  })()}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{funding.organization_name}</h2>
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-user mr-1"></i>
                      {funding.recruiter.first_name} {funding.recruiter.last_name}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {funding.montant && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {formatAmount(funding.montant)}
                  </span>
                )}
                {funding.project_duration && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Durée: {funding.project_duration}
                  </span>
                )}
                {funding.country && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {funding.country.name}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {funding.created_at && (
                  <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {formatDate(funding.created_at)}</span>
                )}
                {funding.date_limite && (
                  <span><i className="fas fa-calendar-times mr-1"></i>Date limite : {formatDate(funding.date_limite)}</span>
                )}

              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:ml-6">
              {!isRecruiterOfThisFunding && isPubliclyAccessible && (
                <button
                  onClick={handleApply}
                  className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                >
                  <i className={`mr-2 ${funding?.is_admin_only ? 'fas fa-external-link-alt' : 'fas fa-paper-plane'}`}></i>
                  {funding?.is_admin_only ? 'Postuler sur le site' : 'Postuler maintenant'}
                </button>
              )}
              
              {isRecruiterOfThisFunding && (
                <button
                  onClick={() => navigate(`/recruteur/creer-financement?edit=${id}`)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Éditer le financement
                </button>
              )}
              
              {!isRecruiterOfThisFunding && isPubliclyAccessible && (
                <SavedOfferButton
                  offerId={id}
                  offerType="FUNDING"
                  className="px-6 py-3 rounded-lg"
                />
              )}
              
              <button
                onClick={handleShare}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                <i className="fas fa-share mr-2"></i>
                Partager
              </button>
              
              {isRecruiterOfThisFunding && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-700">
                    <i className="fas fa-info-circle mr-1"></i>
                    Vous consultez votre propre offre
                  </p>
                </div>
              )}
              
              {!isRecruiterOfThisFunding && isPendingApproval && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-700">
                    <i className="fas fa-clock mr-1"></i>
                    En attente d'approbation
                  </p>
                </div>
              )}
              
              {!isRecruiterOfThisFunding && isDraft && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-700">
                    <i className="fas fa-file-alt mr-1"></i>
                    En cours de rédaction
                  </p>
                </div>
              )}
              
              {!isRecruiterOfThisFunding && isRejected && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-red-700">
                    <i className="fas fa-times-circle mr-1"></i>
                    Offre rejetée
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
            {/* Statut du financement */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statut de l'offre</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(funding.status)}`}>
                    <i className={`fas mr-2 ${
                      funding.status === 'APPROVED' ? 'fa-check-circle' :
                      funding.status === 'PENDING_APPROVAL' ? 'fa-clock' :
                      funding.status === 'PUBLISHED' ? 'fa-eye' :
                      funding.status === 'DRAFT' ? 'fa-file-alt' :
                      funding.status === 'REJECTED' ? 'fa-times-circle' :
                      funding.status === 'EXPIRED' ? 'fa-calendar-times' :
                      'fa-info-circle'
                    }`}></i>
                    {getStatusText(funding.status)}
                  </span>
                </div>

                {isPendingApproval && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>En attente d'approbation :</strong> Cette offre est en cours de validation par notre équipe.
                    </p>
                  </div>
                )}
                
                {isDraft && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>Brouillon :</strong> Cette offre n'est pas encore soumise pour approbation.
                    </p>
                  </div>
                )}
                
                {isRejected && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>Rejetée :</strong> Cette offre n'a pas été approuvée par notre équipe.
                    </p>
                  </div>
                )}
                
                {isPubliclyAccessible && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <i className="fas fa-check-circle mr-2"></i>
                      <strong>Offre active :</strong> Cette offre est visible publiquement.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Objectif du financement */}
            {funding.objective && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Objectif</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{funding.objective}</p>
                </div>
              </div>
            )}

            {/* Critères d'éligibilité */}
            {funding.eligibility_criteria && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Critères d'éligibilité</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  <p>{funding.eligibility_criteria}</p>
                </div>
              </div>
            )}

            {/* Pays et régions couverts */}
            {funding.countries_covered && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pays et régions couverts</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{funding.countries_covered}</p>
                </div>
              </div>
            )}
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* À propos du recruteur */}
            {funding.recruiter && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos du recruteur</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{funding.recruiter.first_name} {funding.recruiter.last_name}</h4>
                    <p className="text-sm text-gray-600">{funding.recruiter.username}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {funding.recruiter.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email :</span>
                        <a 
                          href={`mailto:${funding.recruiter.email}`}
                          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                        >
                          {funding.recruiter.email}
                        </a>
                      </div>
                    )}
                    {funding.recruiter.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Téléphone :</span>
                        <a 
                          href={`tel:${funding.recruiter.phone}`}
                          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                        >
                          {funding.recruiter.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut :</span>
                      <span className="text-gray-900 font-medium">
                        {funding.recruiter.is_approved ? '✓ Approuvé' : 'En attente'}
                      </span>
                    </div>
                    {funding.recruiter.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Membre depuis :</span>
                        <span className="text-gray-900 font-medium">
                          {formatDate(funding.recruiter.created_at)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Lien vers le profil public */}
                  {funding.recruiter && funding.recruiter.id && (
                    <Link 
                      to={`/recruteur/profil-public/${funding.recruiter.id}`}
                      className="block w-full text-center mt-3 px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
                    >
                      <i className="fas fa-user mr-1"></i>
                      Voir le profil
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Détails du financement */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {funding.organization_name && (
                  <div>
                    <span className="font-medium text-gray-900">Organisation :</span>
                    <p>{funding.organization_name}</p>
                  </div>
                )}
                {funding.montant && (
                  <div>
                    <span className="font-medium text-gray-900">Montant :</span>
                    <p>{formatAmount(funding.montant)}</p>
                  </div>
                )}
                {funding.project_duration && (
                  <div>
                    <span className="font-medium text-gray-900">Durée du projet :</span>
                    <p>{funding.project_duration}</p>
                  </div>
                )}
                {funding.date_limite && (
                  <div>
                    <span className="font-medium text-gray-900">Date limite :</span>
                    <p>{formatDate(funding.date_limite)}</p>
                  </div>
                )}
                {funding.country && (
                  <div>
                    <span className="font-medium text-gray-900">Pays :</span>
                    <p>{funding.country.name}</p>
                  </div>
                )}
                {funding.region && (
                  <div>
                    <span className="font-medium text-gray-900">Région :</span>
                    <p>{funding.region.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informations de contact */}
            {funding.contact_info && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-envelope text-gray-400 mt-1"></i>
                    <div className="text-gray-700 whitespace-pre-wrap">{funding.contact_info}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Source d'informations */}
            {funding.more_info_source && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plus d'informations</h3>
                <a 
                  href={funding.more_info_source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Visiter le site
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de partage */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={funding?.title}
        url={window.location.href}
      />
    </div>
  );
};

export default DetailFinancement;
