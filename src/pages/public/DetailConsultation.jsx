import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const DetailConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyForm, setApplyForm] = useState({
    proposal: '',
    portfolio: '',
    experience: ''
  });

  useEffect(() => {
    fetchConsultationDetails();
  }, [id]);

  const fetchConsultationDetails = async () => {
    try {
      const consultationData = await dataService.getConsultationById(id);
      setConsultation(consultationData);
    } catch (error) {
      setError('Erreur lors du chargement de la consultation');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/consultations/${id}` } });
      return;
    }

    setApplying(true);
    try {
      const applicationData = {
        userId: user.id,
        consultationId: parseInt(id),
        proposal: applyForm.proposal,
        portfolio: applyForm.portfolio,
        experience: applyForm.experience,
        appliedAt: new Date().toISOString(),
        status: 'en_attente'
      };

      await dataService.submitConsultationApplication(applicationData);
      setShowApplyModal(false);
      setApplyForm({ proposal: '', portfolio: '', experience: '' });
      navigate('/prestataire/candidatures-recentes');
    } catch (error) {
      setError('Erreur lors de la candidature');
      console.error('Erreur:', error);
    } finally {
      setApplying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Consultation non trouvée</h2>
        <p className="text-gray-600 mb-4">La consultation que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link 
          to="/consultations"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Voir toutes les consultations
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{consultation.title}</h1>
            <p className="text-fuchsia-600 font-medium text-lg">{consultation.client}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link 
              to="/prestataire/consultations"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>Retour
            </Link>
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-paper-plane mr-2"></i>Postuler
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-handshake text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{consultation.title}</h2>
                    <p className="text-purple-600 font-medium">{consultation.client}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-building mr-2"></i>
                    <span>{consultation.client}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-clock mr-2"></i>
                    <span>{consultation.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    <span>Publié le {formatDate(consultation.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="px-3 py-1 text-sm font-medium rounded-full text-green-600 bg-green-100">
                  Actif
                </span>
                <button className="text-gray-400 hover:text-fuchsia-600">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
            </div>

            {/* Consultation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">{consultation.budget}</div>
                <div className="text-sm text-gray-600">Budget</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{consultation.duration}</div>
                <div className="text-sm text-gray-600">Durée</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {consultation.applications || 0}
                </div>
                <div className="text-sm text-gray-600">Propositions</div>
              </div>
            </div>
          </div>

          {/* Mission Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
              Description de la mission
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">{consultation.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {consultation.requirements && consultation.requirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-list-check mr-2 text-fuchsia-600"></i>
                Compétences requises
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {consultation.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Deliverables */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-tasks mr-2 text-fuchsia-600"></i>
              Livrables attendus
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="fas fa-check text-fuchsia-600 text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Rapport détaillé</h4>
                  <p className="text-sm text-gray-600">Documentation complète du projet</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="fas fa-check text-fuchsia-600 text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Présentation</h4>
                  <p className="text-sm text-gray-600">Présentation des résultats</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="fas fa-check text-fuchsia-600 text-xs"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Code source</h4>
                  <p className="text-sm text-gray-600">Code commenté et documenté</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-building mr-2 text-fuchsia-600"></i>
              À propos du client
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Client</span>
                <p className="text-gray-900">{consultation.client}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Budget</span>
                <p className="text-gray-900">{consultation.budget}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Durée</span>
                <p className="text-gray-900">{consultation.duration}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Type de projet</span>
                <p className="text-gray-900">Développement web</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
              >
                <i className="fas fa-paper-plane mr-2"></i>Postuler maintenant
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <i className="fas fa-heart mr-2"></i>Ajouter aux favoris
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <i className="fas fa-share mr-2"></i>Partager
              </button>
            </div>
          </div>

          {/* Similar Consultations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-handshake mr-2 text-fuchsia-600"></i>
              Consultations similaires
            </h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <h4 className="font-medium text-gray-900">Développement d'application mobile</h4>
                <p className="text-sm text-gray-600">StartupTech</p>
                <p className="text-xs text-gray-500">400K - 600K FCFA</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <h4 className="font-medium text-gray-900">Site e-commerce</h4>
                <p className="text-sm text-gray-600">EcomPro</p>
                <p className="text-xs text-gray-500">300K - 500K FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Postuler à cette consultation</h3>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {!isAuthenticated ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-user-lock text-fuchsia-600 text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Connexion requise</h4>
                  <p className="text-gray-600 mb-4">Vous devez être connecté pour postuler à cette consultation.</p>
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium block text-center"
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium block text-center"
                    >
                      Créer un compte
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApply}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
                        Proposition technique *
                      </label>
                      <textarea
                        id="proposal"
                        name="proposal"
                        required
                        rows={6}
                        value={applyForm.proposal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                        placeholder="Décrivez votre approche technique et méthodologie pour ce projet..."
                      />
                    </div>

                    <div>
                      <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio/Expériences similaires
                      </label>
                      <textarea
                        id="portfolio"
                        name="portfolio"
                        rows={3}
                        value={applyForm.portfolio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                        placeholder="Décrivez vos projets similaires et expériences..."
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                        Expérience dans le domaine
                      </label>
                      <textarea
                        id="experience"
                        name="experience"
                        rows={3}
                        value={applyForm.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                        placeholder="Décrivez votre expérience dans ce domaine..."
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowApplyModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={applying}
                        className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
                      >
                        {applying ? 'Envoi...' : 'Envoyer la proposition'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailConsultation; 