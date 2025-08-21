import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';
import ShareModal from '../../components/ShareModal';

const DetailFinancement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [funding, setFunding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Vérifier si l'utilisateur connecté est le recruteur de ce financement
  const isRecruiterOfThisFunding = isAuthenticated && user && funding?.recruiter?.user?.id === user.id;

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
      
      // Gérer spécifiquement l'erreur 403 (Forbidden) - Accès refusé
      if (error.response && error.response.status === 403) {
        navigate('/404', { replace: true });
        return;
      }
      
      // Gérer l'erreur 404 (Not Found) - Financement inexistant
      if (error.response && error.response.status === 404) {
        console.log('🔍 Financement non trouvé (404) - Redirection vers 404');
        // Rediriger vers la page 404 en cas de financement inexistant
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
    return new Intl.NumberFormat('fr-FR').format(parseFloat(amount)) + ' FCFA';
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

  const getSectorText = (sector) => {
    if (!sector) return 'Non précisé';
    return sector.name || sector;
  };

  const getTargetText = (target) => {
    if (!target) return 'Non précisé';
    return target.name || target;
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login', { replace: true });
      return;
    }
    
    // Rediriger vers l'analyse de compatibilité IA
    navigate(`/ia-compatibility/${id}/financement`);
  };

  const handleSave = () => {
    // Logique de sauvegarde
    alert('Offre de financement sauvegardée dans vos favoris !');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'offre de financement...</p>
        </div>
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

  // Vérification supplémentaire pour éviter le rendu prématuré
  if (!funding || !funding.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données du financement...</p>
            </div>
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
              
              {/* Informations de l'entreprise en header */}
              {funding.recruiter && (
                <div className="flex items-center mb-4">
                  {funding.recruiter.logo && (
                    <div className="mr-3">
                      <img 
                        src={`http://localhost:8000${funding.recruiter.logo}`}
                        alt={funding.recruiter.company_name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                        onError={(e) => {
                          console.error('Erreur de chargement du logo:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Logo chargé avec succès:', funding.recruiter.logo);
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{funding.recruiter.company_name}</h2>
                    {funding.recruiter.region && funding.recruiter.country && (
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {funding.recruiter.region.name}, {funding.recruiter.country.name}
                      </p>
                    )}
              </div>
                </div>
              )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {getSectorText(funding.sector)}
                  </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {getTargetText(funding.target)}
                  </span>
                {funding.funding_type && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {funding.funding_type}
                  </span>
                )}
              </div>
              
              <div className="text-lg text-gray-600 mb-4">
                Montant : {formatAmount(funding.max_amount)}
                </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {funding.created_at && (
                  <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {formatDate(funding.created_at)}</span>
                )}
                {funding.application_deadline && (
                  <span><i className="fas fa-calendar-times mr-1"></i>Date limite : {formatDate(funding.application_deadline)}</span>
                )}
            </div>
          </div>
          
            {/* Boutons d'action */}
            <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:ml-6">
              {/* Bouton Postuler - visible uniquement pour les financements publics et non créateur */}
              {!isRecruiterOfThisFunding && isPubliclyAccessible && (
            <button
              onClick={handleApply}
              className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Postuler maintenant
            </button>
              )}
              
              {/* Bouton Éditer - visible uniquement pour l'auteur du financement */}
              {isRecruiterOfThisFunding && (
                <button
                  onClick={() => navigate(`/recruteur/creer-financement?edit=${id}`)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Éditer le financement
                </button>
              )}
              
              {/* Bouton Sauvegarder - visible uniquement pour les financements publics et non créateur */}
              {!isRecruiterOfThisFunding && isPubliclyAccessible && (
              <button
                onClick={handleSave}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                  <i className="fas fa-bookmark mr-2"></i>
                Sauvegarder
              </button>
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
              {isRecruiterOfThisFunding && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-700">
                    <i className="fas fa-info-circle mr-1"></i>
                    Vous consultez votre propre offre de financement
                  </p>
                </div>
              )}
              
              {/* Message pour financements en attente d'approbation (visiteurs) */}
              {!isRecruiterOfThisFunding && isPendingApproval && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-700">
                    <i className="fas fa-clock mr-1"></i>
                    Cette offre de financement est en attente d'approbation
                  </p>
                </div>
              )}
              
              {/* Message pour financements brouillon (visiteurs) */}
              {!isRecruiterOfThisFunding && isDraft && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-700">
                    <i className="fas fa-file-alt mr-1"></i>
                    Cette offre de financement est en cours de rédaction
                  </p>
                </div>
              )}
              
              {/* Message pour financements rejetés (visiteurs) */}
              {!isRecruiterOfThisFunding && isRejected && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-red-700">
                    <i className="fas fa-times-circle mr-1"></i>
                    Cette offre de financement a été rejetée
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
            {/* Statut du financement - visible pour tous */}
          <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statut de l'offre de financement</h2>
              <div className="space-y-4">
                {/* Badge de statut */}
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

                {/* Informations supplémentaires selon le statut */}
                {isPendingApproval && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>En attente d'approbation :</strong> Cette offre de financement est en cours de validation par notre équipe. 
                      {isRecruiterOfThisFunding ? ' Vous recevrez une notification dès qu\'elle sera approuvée.' : ' Elle sera visible publiquement une fois approuvée.'}
                    </p>
                  </div>
                )}
                
                {isDraft && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>Brouillon :</strong> Cette offre de financement est en cours de rédaction et n'est pas encore soumise pour approbation.
                      {isRecruiterOfThisFunding ? ' Vous pouvez continuer à l\'éditer avant de la soumettre.' : ''}
                    </p>
                  </div>
                )}
                
                {isRejected && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <strong>Rejetée :</strong> Cette offre de financement n'a pas été approuvée par notre équipe.
                      {isRecruiterOfThisFunding ? ' Vous pouvez la modifier et la soumettre à nouveau.' : ''}
                    </p>
          </div>
                )}
                
                {isPubliclyAccessible && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <i className="fas fa-check-circle mr-2"></i>
                      <strong>Offre active :</strong> Cette offre de financement est visible publiquement et les candidats peuvent postuler.
                    </p>
                  </div>
                )}
          </div>
        </div>

            {/* Description du financement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du financement</h2>
              <div className="prose max-w-none text-gray-600">
                {funding.description ? (
                  <p>{funding.description}</p>
                ) : (
                  <p>Aucune description disponible pour ce financement.</p>
                )}
              </div>
            </div>

            {/* Conditions d'éligibilité */}
            {funding.eligibility_conditions && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Conditions d'éligibilité</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{funding.eligibility_conditions}</p>
                </div>
              </div>
            )}

            {/* Processus de candidature */}
            {funding.application_process && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Processus de candidature</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{funding.application_process}</p>
                </div>
              </div>
            )}

            {/* Caractéristiques du financement */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Caractéristiques du financement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-900">Montant maximum :</span>
                  <p className="text-gray-600">{formatAmount(funding.max_amount)}</p>
                </div>
                {funding.annual_interest_rate && (
                  <div>
                    <span className="font-medium text-gray-900">Taux d'intérêt :</span>
                    <p className="text-gray-600">{funding.annual_interest_rate}%</p>
                  </div>
                )}
                {funding.repayment_duration && (
                  <div>
                    <span className="font-medium text-gray-900">Durée de remboursement :</span>
                    <p className="text-gray-600">{funding.repayment_duration}</p>
                  </div>
                )}
                {funding.max_applications && (
                  <div>
                    <span className="font-medium text-gray-900">Nombre max de candidatures :</span>
                    <p className="text-gray-600">{funding.max_applications}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-900">Garantie requise :</span>
                  <p className="text-gray-600">
                    {funding.no_guarantee ? 'Non' : 'Oui'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Période de grâce :</span>
                  <p className="text-gray-600">
                    {funding.grace_period_available ? 'Disponible' : 'Non disponible'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Business plan requis :</span>
                  <p className="text-gray-600">
                    {funding.business_plan_required ? 'Oui' : 'Non'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">États financiers requis :</span>
                  <p className="text-gray-600">
                    {funding.financial_statements_required ? 'Oui' : 'Non'}
                  </p>
              </div>
              </div>
            </div>
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* À propos de l'entreprise */}
            {funding.recruiter && (
          <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de l'entreprise</h3>
            <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {funding.recruiter.logo && (
                      <img
                        src={`http://localhost:8000${funding.recruiter.logo}`}
                        alt={`Logo ${funding.recruiter.company_name || 'Entreprise'}`}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          console.error('Erreur de chargement du logo:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Logo chargé avec succès:', funding.recruiter.logo);
                        }}
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {funding.recruiter.company_name || 'Entreprise'}
                      </h4>
                      {funding.recruiter.sector && (
                        <p className="text-sm text-gray-600">{funding.recruiter.sector}</p>
                      )}
                    </div>
                  </div>
                  
                  {funding.recruiter.description && (
                    <p className="text-sm text-gray-700">{funding.recruiter.description}</p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {funding.recruiter.company_size && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taille :</span>
                        <span className="text-gray-900 font-medium">{funding.recruiter.company_size}</span>
                      </div>
                    )}
                    {funding.recruiter.website && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Site web :</span>
                        <a 
                          href={funding.recruiter.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                        >
                          Visiter
              </a>
            </div>
                    )}
                    {funding.recruiter.country && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pays :</span>
                        <span className="text-gray-900 font-medium">
                          {funding.recruiter.country.name}
                        </span>
                      </div>
                    )}
                    {funding.recruiter.region && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Région :</span>
                        <span className="text-gray-900 font-medium">
                          {funding.recruiter.region.name}
                        </span>
          </div>
                    )}
                    
                    {/* Lien vers le profil public du recruteur */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profil :</span>
                      <Link 
                        to={`/recruteur/profil-public/${funding.recruiter.user.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <i className="fas fa-user mr-1"></i>
                        Voir le profil du recruteur
                      </Link>
        </div>
      </div>

                  {/* Informations du recruteur */}
                  {funding.recruiter.user && (
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Recruteur</h5>
                      <div className="text-sm text-gray-600">
                        <p>{funding.recruiter.user.first_name} {funding.recruiter.user.last_name}</p>
                        <p className="text-xs text-gray-500">
                          Membre depuis {new Date(funding.recruiter.user.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informations du financement */}
      <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du financement</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {funding.sector && (
                  <div>
                    <span className="font-medium text-gray-900">Secteur :</span>
                    <p>{getSectorText(funding.sector)}</p>
                  </div>
                )}
                {funding.target && (
                  <div>
                    <span className="font-medium text-gray-900">Cible :</span>
                    <p>{getTargetText(funding.target)}</p>
                  </div>
                )}
                {funding.funding_type && (
                  <div>
                    <span className="font-medium text-gray-900">Type de financement :</span>
                    <p>{funding.funding_type}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-900">Montant maximum :</span>
                  <p>{formatAmount(funding.max_amount)}</p>
                </div>
                {funding.annual_interest_rate && (
                  <div>
                    <span className="font-medium text-gray-900">Taux d'intérêt :</span>
                    <p>{funding.annual_interest_rate}%</p>
                  </div>
                )}
                {funding.repayment_duration && (
                  <div>
                    <span className="font-medium text-gray-900">Durée de remboursement :</span>
                    <p>{funding.repayment_duration}</p>
                  </div>
                )}
                {funding.max_applications && (
                  <div>
                    <span className="font-medium text-gray-900">Candidatures max :</span>
                    <p>{funding.max_applications}</p>
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

            {/* Date limite */}
            {funding.application_deadline && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date limite</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatDate(funding.application_deadline)}
                  </div>
                  <div className="text-sm text-gray-500">Date limite de candidature</div>
                </div>
              </div>
            )}

            {/* Informations de contact */}
            {funding.contact_info && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-gray-400"></i>
                    <span className="text-gray-700">{funding.contact_info}</span>
                  </div>
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
        title={funding?.title}
        url={window.location.href}
      />
    </div>
  );
};

export default DetailFinancement; 