import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bourseService from '../../services/bourseService';
import NotFound from './NotFound';
import ShareModal from '../../components/ShareModal';

const DetailBourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bourse, setBourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    loadBourse();
  }, [id]);

  const loadBourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const bourseData = await bourseService.getPublicScholarshipDetail(id);
      setBourse(bourseData);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        // Rediriger vers la page 404 pour les erreurs d'accès
        navigate('/404');
        return;
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (bourse?.external_application_url) {
      window.open(bourse.external_application_url, '_blank');
    } else {
    setShowShareModal(true);
    }
  };

  const handleSave = () => {
    if (!user) {
      alert('Vous devez être connecté pour sauvegarder une bourse.');
      return;
    }
    alert('Bourse sauvegardée dans vos favoris !');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount) => {
    if (!amount) return 'Non spécifié';
    return `${parseFloat(amount).toLocaleString('fr-FR')}€`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED': return 'Approuvée';
      case 'PUBLISHED': return 'Publiée';
      case 'PENDING_APPROVAL': return 'En attente d\'approbation';
      case 'REJECTED': return 'Refusée';
      case 'DRAFT': return 'Brouillon';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la bourse...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  if (!bourse) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-fuchsia-600">
              <i className="fas fa-home mr-2"></i>
              Accueil
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <Link to="/bourses" className="text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                Bourses
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span className="text-sm font-medium text-gray-500">Détail de la bourse</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header de la bourse */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                {/* Image locale avec fallback robuste */}
                <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <i className="fas fa-graduation-cap text-white text-2xl"></i>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{bourse.title}</h1>
                
                {/* Statut de la bourse */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bourse.status)}`}>
                    <i className="fas fa-info-circle mr-2"></i>
                    {getStatusText(bourse.status)}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="flex items-center">
                    <i className="fas fa-university mr-2"></i>
                    {bourse.organization_name || 'Organisation non spécifiée'}
                  </span>
                  {bourse.country_region && (
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                      {bourse.country_region}
                  </span>
                  )}
                  {bourse.application_deadline && (
                  <span className="flex items-center">
                    <i className="fas fa-calendar mr-2"></i>
                      Date limite : {formatDate(bourse.application_deadline)}
                  </span>
                  )}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {bourse.scholarship_amount && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {formatAmount(bourse.scholarship_amount)}
                  </span>
                  )}
                  {bourse.duration && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {bourse.duration}
                  </span>
                  )}
                  {bourse.full_funding && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Financement complet
                    </span>
                  )}
                  {bourse.partial_funding && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      Financement partiel
                  </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col space-y-3 mt-4 lg:mt-0 lg:ml-6">
            {/* Bouton Postuler - affiché seulement si l'utilisateur n'est pas le créateur */}
            {(!user || (user.id !== bourse.recruiter?.user?.id && user.id !== bourse.recruiter?.id)) && (
            <button
              onClick={handleApply}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Postuler maintenant
            </button>
            )}
            
            {/* Bouton Éditer - affiché seulement pour le créateur */}
            {user && (user.id === bourse.recruiter?.user?.id || user.id === bourse.recruiter?.id) && (
              <Link
                to={`/recruteur/creer-bourse?edit=${bourse.id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-center"
              >
                <i className="fas fa-edit mr-2"></i>
                Éditer la bourse
              </Link>
            )}

            {/* Boutons secondaires */}
            <div className="flex space-x-2">
              {/* Bouton Partager - toujours affiché */}
              <button
                onClick={handleShare}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-share mr-2"></i>
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {bourse.description && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-file-alt text-fuchsia-600 mr-2"></i>
              Description de la bourse
            </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{bourse.description}</p>
              </div>
          </div>
          )}

          {/* Critères d'éligibilité */}
          {bourse.eligibility_criteria && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-list-check text-fuchsia-600 mr-2"></i>
              Critères d'éligibilité
            </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{bourse.eligibility_criteria}</p>
              </div>
            </div>
          )}

          {/* Processus de candidature */}
          {bourse.application_process && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <i className="fas fa-clipboard-list text-fuchsia-600 mr-2"></i>
                Processus de candidature
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{bourse.application_process}</p>
              </div>
          </div>
          )}

          {/* Couverture des avantages */}
          {bourse.benefits_coverage && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-gift text-fuchsia-600 mr-2"></i>
                Couverture des avantages
            </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{bourse.benefits_coverage}</p>
              </div>
          </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations rapides */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-info-circle text-fuchsia-600 mr-2"></i>
              Informations rapides
            </h3>
            <div className="space-y-3">
              {bourse.scholarship_amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Montant</span>
                  <span className="font-medium">{formatAmount(bourse.scholarship_amount)}</span>
              </div>
              )}
              {bourse.duration && (
              <div className="flex justify-between">
                <span className="text-gray-600">Durée</span>
                <span className="font-medium">{bourse.duration}</span>
              </div>
              )}
              {bourse.beneficiary_count && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre de bénéficiaires</span>
                  <span className="font-medium">{bourse.beneficiary_count}</span>
                </div>
              )}
              {bourse.application_deadline && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date limite</span>
                  <span className="font-medium text-red-600">{formatDate(bourse.application_deadline)}</span>
                </div>
              )}
              {bourse.start_date && (
              <div className="flex justify-between">
                  <span className="text-gray-600">Date de début</span>
                  <span className="font-medium">{formatDate(bourse.start_date)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Détails du financement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-money-bill-wave text-fuchsia-600 mr-2"></i>
              Détails du financement
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className={`fas fa-check-circle mr-2 ${bourse.full_funding ? 'text-green-500' : 'text-gray-400'}`}></i>
                <span className="text-sm">Financement complet</span>
              </div>
              <div className="flex items-center">
                <i className={`fas fa-check-circle mr-2 ${bourse.partial_funding ? 'text-green-500' : 'text-gray-400'}`}></i>
                <span className="text-sm">Financement partiel</span>
              </div>
              <div className="flex items-center">
                <i className={`fas fa-check-circle mr-2 ${bourse.accommodation_included ? 'text-green-500' : 'text-gray-400'}`}></i>
                <span className="text-sm">Logement inclus</span>
              </div>
              <div className="flex items-center">
                <i className={`fas fa-check-circle mr-2 ${bourse.travel_expenses_included ? 'text-green-500' : 'text-gray-400'}`}></i>
                <span className="text-sm">Frais de transport</span>
              </div>
            </div>
          </div>

          {/* Organisation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-university text-fuchsia-600 mr-2"></i>
              À propos de l'organisation
            </h3>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">{bourse.organization_name}</h4>
              {bourse.organization_type && (
                <p className="text-sm text-gray-600">{bourse.organization_type.name}</p>
              )}
              {bourse.contact_info && (
              <a 
                  href={`mailto:${bourse.contact_info}`}
                className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-800 text-sm"
              >
                <i className="fas fa-envelope mr-2"></i>
                  Contacter l'organisation
                </a>
              )}
              {bourse.official_website && (
                <a 
                  href={bourse.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-800 text-sm"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Site web officiel
                </a>
              )}
        </div>
      </div>

          {/* Informations de candidature */}
          {bourse.external_application_url && (
      <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                <i className="fas fa-external-link-alt text-fuchsia-600 mr-2"></i>
                Candidature
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Cette bourse utilise une plateforme externe pour les candidatures.
                </p>
                <a 
                  href={bourse.external_application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Postuler sur la plateforme
                </a>
                {bourse.external_platform_name && (
                  <p className="text-xs text-gray-500 text-center">
                    Plateforme : {bourse.external_platform_name}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de partage */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        isLoggedIn={!!user}
        title={`Postuler à ${bourse.title}`}
      />
    </div>
  );
};

export default DetailBourse; 