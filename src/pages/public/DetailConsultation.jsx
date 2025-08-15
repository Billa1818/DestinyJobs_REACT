import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';
import ShareModal from '../../components/ShareModal';

const DetailConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Vérifier si l'utilisateur connecté est le recruteur de cette consultation
  const isRecruiterOfThisConsultation = isAuthenticated && user && consultation?.recruiter?.user?.id === user.id;

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
        // Rediriger vers la page 404 en cas de consultation inexistante
        navigate('/404', { replace: true });
        return;
      }
      
      setError('Erreur lors du chargement de la consultation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const getConsultationTypeText = (consultationType) => {
    if (!consultationType) return 'Non précisé';
    return consultationType.name || consultationType;
  };

  const getDeliveryModeText = (deliveryMode) => {
    switch (deliveryMode) {
      case 'ON_SITE': return 'Sur site';
      case 'REMOTE': return 'Télétravail';
      case 'HYBRID': return 'Hybride';
      default: return deliveryMode || 'Non précisé';
    }
  };

  const getClientTypeText = (clientType) => {
    switch (clientType) {
      case 'STARTUP': return 'Startup';
      case 'SME': return 'PME';
      case 'LARGE_CORP': return 'Grande entreprise';
      case 'NGO': return 'ONG';
      case 'GOVERNMENT': return 'Gouvernement';
      default: return clientType || 'Non précisé';
    }
  };

  const getPricingTypeText = (pricingType) => {
    switch (pricingType) {
      case 'HOURLY': return 'À l\'heure';
      case 'DAILY': return 'À la journée';
      case 'PROJECT': return 'Au projet';
      default: return pricingType || 'Non précisé';
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'À négocier';
    return new Intl.NumberFormat('fr-FR').format(parseFloat(price)) + ' FCFA';
  };

  const handleApply = () => {
    // Rediriger vers la page d'analyse IA publique
    navigate(`/ia-compatibility/${id}/consultation`);
  };

  const handleSave = () => {
    // Logique de sauvegarde
    alert('Consultation sauvegardée dans vos favoris !');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la consultation...</p>
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

  // Vérification supplémentaire pour éviter le rendu prématuré
  if (!consultation || !consultation.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données de la consultation...</p>
            </div>
            </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la consultation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between">
          <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{consultation.title}</h1>
              
              {/* Informations de l'entreprise en header */}
              {consultation.recruiter && (
                <div className="flex items-center mb-4">
                  {consultation.recruiter.logo && (
                    <div className="mr-3">
                      <img 
                        src={`http://localhost:8000${consultation.recruiter.logo}`}
                        alt={consultation.recruiter.company_name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                        onError={(e) => {
                          console.error('Erreur de chargement du logo:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Logo chargé avec succès:', consultation.recruiter.logo);
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{consultation.recruiter.company_name}</h2>
                    {consultation.recruiter.region && consultation.recruiter.country && (
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {consultation.recruiter.region.name}, {consultation.recruiter.country.name}
                      </p>
                    )}
                  </div>
                </div>
              )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full text-sm">
                  {getConsultationTypeText(consultation.consultation_type)}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {consultation.expertise_sector || 'Non précisé'}
                  </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {getDeliveryModeText(consultation.delivery_mode)}
                  </span>
                {consultation.client_type && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {getClientTypeText(consultation.client_type)}
                  </span>
                )}
              </div>
              
              <div className="text-lg text-gray-600 mb-4">
                Prix : {formatPrice(consultation.price)}
                </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {consultation.created_at && (
                  <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {new Date(consultation.created_at).toLocaleDateString('fr-FR')}</span>
                )}
                {consultation.application_deadline && (
                  <span><i className="fas fa-calendar-times mr-1"></i>Date limite : {new Date(consultation.application_deadline).toLocaleDateString('fr-FR')}</span>
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
              <i className="fas fa-paper-plane mr-2"></i>
              Postuler maintenant
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
            {/* Statut de la consultation - visible pour tous */}
          <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statut de la consultation</h2>
              <div className="space-y-4">
                {/* Badge de statut */}
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    consultation.status === 'APPROVED' 
                      ? 'bg-green-100 text-green-800' 
                      : consultation.status === 'PENDING_APPROVAL'
                      ? 'bg-yellow-100 text-yellow-800'
                      : consultation.status === 'PUBLISHED'
                      ? 'bg-blue-100 text-blue-800'
                      : consultation.status === 'DRAFT'
                      ? 'bg-gray-100 text-gray-800'
                      : consultation.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : consultation.status === 'EXPIRED'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <i className={`fas mr-2 ${
                      consultation.status === 'APPROVED' ? 'fa-check-circle' :
                      consultation.status === 'PENDING_APPROVAL' ? 'fa-clock' :
                      consultation.status === 'PUBLISHED' ? 'fa-eye' :
                      consultation.status === 'DRAFT' ? 'fa-file-alt' :
                      consultation.status === 'REJECTED' ? 'fa-times-circle' :
                      consultation.status === 'EXPIRED' ? 'fa-calendar-times' :
                      'fa-info-circle'
                    }`}></i>
                    {consultation.status === 'APPROVED' ? 'Approuvée' :
                     consultation.status === 'PENDING_APPROVAL' ? 'En attente d\'approbation' :
                     consultation.status === 'PUBLISHED' ? 'Publiée' :
                     consultation.status === 'DRAFT' ? 'Brouillon' :
                     consultation.status === 'REJECTED' ? 'Rejetée' :
                     consultation.status === 'EXPIRED' ? 'Expirée' :
                     consultation.status || 'Statut inconnu'}
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

            {/* Objectifs */}
            {consultation.objectives && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Objectifs</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{consultation.objectives}</p>
                </div>
              </div>
            )}

            {/* Méthodologie */}
            {consultation.methodology && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Méthodologie</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{consultation.methodology}</p>
                </div>
              </div>
            )}

            {/* Livrables */}
            {consultation.deliverables && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Livrables attendus</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{consultation.deliverables}</p>
                </div>
              </div>
            )}

            {/* Exigences et conditions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exigences et conditions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Portfolio requis</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    consultation.portfolio_required ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {consultation.portfolio_required ? 'Oui' : 'Non'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Présence sur site requise</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    consultation.on_site_presence_required ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {consultation.on_site_presence_required ? 'Oui' : 'Non'}
                  </span>
                </div>
                {consultation.detailed_report_included && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Rapport détaillé inclus</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Oui
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* À propos de l'entreprise */}
            {consultation.recruiter && (
          <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de l'entreprise</h3>
            <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {consultation.recruiter.logo && (
                      <img
                        src={`http://localhost:8000${consultation.recruiter.logo}`}
                        alt={`Logo ${consultation.recruiter.company_name || 'Entreprise'}`}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          console.error('Erreur de chargement du logo:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Logo chargé avec succès:', consultation.recruiter.logo);
                        }}
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {consultation.recruiter.company_name || 'Entreprise'}
                      </h4>
                      {consultation.recruiter.sector && (
                        <p className="text-sm text-gray-600">{consultation.recruiter.sector}</p>
                      )}
                    </div>
                  </div>
                  
                  {consultation.recruiter.description && (
                    <p className="text-sm text-gray-700">{consultation.recruiter.description}</p>
                  )}
                  
              <div className="space-y-2 text-sm">
                    {consultation.recruiter.company_size && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taille :</span>
                        <span className="text-gray-900 font-medium">{consultation.recruiter.company_size}</span>
                      </div>
                    )}
                    {consultation.recruiter.website && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Site web :</span>
                        <a 
                          href={consultation.recruiter.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                        >
                          Visiter
                        </a>
                      </div>
                    )}
                    {consultation.recruiter.country && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pays :</span>
                        <span className="text-gray-900 font-medium">
                          {consultation.recruiter.country.name}
                        </span>
                      </div>
                    )}
                    {consultation.recruiter.region && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Région :</span>
                        <span className="text-gray-900 font-medium">
                          {consultation.recruiter.region.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Lien vers le profil public du recruteur */}
                <div className="flex justify-between">
                      <span className="text-gray-600">Profil :</span>
                      <Link 
                        to={`/recruteur/profil-public/${consultation.recruiter.user.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <i className="fas fa-user mr-1"></i>
                        Voir le profil du recruteur
                      </Link>
                    </div>
                  </div>

                  {/* Informations du recruteur */}
                  {consultation.recruiter.user && (
                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Recruteur</h5>
                      <div className="text-sm text-gray-600">
                        <p>{consultation.recruiter.user.first_name} {consultation.recruiter.user.last_name}</p>
                        <p className="text-xs text-gray-500">
                          Membre depuis {new Date(consultation.recruiter.user.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informations de la consultation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la consultation</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {consultation.consultation_type && (
                  <div>
                    <span className="font-medium text-gray-900">Type de consultation :</span>
                    <p>{getConsultationTypeText(consultation.consultation_type)}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-900">Secteur d'expertise :</span>
                  <p>{consultation.expertise_sector || 'Non précisé'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Mode de livraison :</span>
                  <p>{getDeliveryModeText(consultation.delivery_mode)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Durée estimée :</span>
                  <p>{consultation.estimated_duration || 'Non précisé'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Type de tarification :</span>
                  <p>{getPricingTypeText(consultation.pricing_type)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Prix :</span>
                  <p>{formatPrice(consultation.price)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Expérience requise :</span>
                  <p>{consultation.required_experience_years || 'Non précisé'} ans</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Projets concurrents max :</span>
                  <p>{consultation.max_concurrent_projects || 'Non précisé'}</p>
                </div>
                {consultation.client_type && (
                  <div>
                    <span className="font-medium text-gray-900">Type de client :</span>
                    <p>{getClientTypeText(consultation.client_type)}</p>
                  </div>
                )}
                {consultation.geographic_zone && (
                  <div>
                    <span className="font-medium text-gray-900">Zone géographique :</span>
                    <p>{consultation.geographic_zone}</p>
                  </div>
                )}
                {consultation.country && (
                  <div>
                    <span className="font-medium text-gray-900">Pays :</span>
                    <p>{consultation.country.name}</p>
                  </div>
                )}
                {consultation.region && (
                  <div>
                    <span className="font-medium text-gray-900">Région :</span>
                    <p>{consultation.region.name}</p>
              </div>
                )}
            </div>
          </div>

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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-3">
                {consultation.contact_info && (
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-gray-400"></i>
                    <span className="text-gray-700">{consultation.contact_info}</span>
                  </div>
                )}
                {consultation.recruiter?.user?.first_name && consultation.recruiter?.user?.last_name && (
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-user text-gray-400"></i>
                    <span className="text-gray-700">
                      {consultation.recruiter.user.first_name} {consultation.recruiter.user.last_name}
                    </span>
              </div>
                )}
              </div>
            </div>
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