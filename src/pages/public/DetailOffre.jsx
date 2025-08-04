import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const DetailOffre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyForm, setApplyForm] = useState({
    coverLetter: '',
    resume: null
  });

  useEffect(() => {
    fetchOfferDetails();
  }, [id]);

  const fetchOfferDetails = async () => {
    try {
      const offerData = await dataService.getOfferById(id);
      setOffer(offerData);
    } catch (error) {
      setError('Erreur lors du chargement de l\'offre');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    setApplying(true);
    try {
      const applicationData = {
        userId: user.id,
        offerId: parseInt(id),
        coverLetter: applyForm.coverLetter,
        appliedAt: new Date().toISOString(),
        status: 'en_attente'
      };

      await dataService.submitApplication(applicationData);
      setShowApplyModal(false);
      setApplyForm({ coverLetter: '', resume: null });
      // Rediriger vers la page de confirmation ou les candidatures
      navigate('/candidat/candidatures-recentes');
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

  if (!offer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Offre non trouvée</h2>
        <p className="text-gray-600 mb-4">L'offre que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link 
          to="/candidat/offres"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Voir toutes les offres
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
            <p className="text-fuchsia-600 font-medium text-lg">{offer.company}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link 
              to="/candidat/offres"
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
          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-briefcase text-fuchsia-600 text-xl"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{offer.title}</h2>
                    <p className="text-fuchsia-600 font-medium">{offer.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>{offer.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-clock mr-2"></i>
                    <span>{offer.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    <span>Publié le {formatDate(offer.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  offer.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {offer.isActive ? 'Actif' : 'Fermé'}
                </span>
                <button className="text-gray-400 hover:text-fuchsia-600">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
            </div>

            {/* Job Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {offer.salary && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{offer.salary}</div>
                  <div className="text-sm text-gray-600">Salaire</div>
                </div>
              )}
              {offer.experience && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">{offer.experience}</div>
                  <div className="text-sm text-gray-600">Expérience requise</div>
                </div>
              )}
              {offer.education && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{offer.education}</div>
                  <div className="text-sm text-gray-600">Niveau d'études</div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
              Description du poste
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">{offer.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {offer.requirements && offer.requirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-list-check mr-2 text-fuchsia-600"></i>
                Compétences requises
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {offer.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {offer.benefits && offer.benefits.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-gift mr-2 text-fuchsia-600"></i>
                Avantages et bénéfices
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {offer.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-building mr-2 text-fuchsia-600"></i>
              À propos de l'entreprise
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Entreprise</span>
                <p className="text-gray-900">{offer.company}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Localisation</span>
                <p className="text-gray-900">{offer.location}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Type de contrat</span>
                <p className="text-gray-900">{offer.type}</p>
              </div>
              {offer.salary && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Salaire</span>
                  <p className="text-gray-900">{offer.salary}</p>
                </div>
              )}
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

          {/* Similar Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
              Offres similaires
            </h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <h4 className="font-medium text-gray-900">Développeur Frontend</h4>
                <p className="text-sm text-gray-600">TechCorp Solutions</p>
                <p className="text-xs text-gray-500">Cotonou, Bénin</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <h4 className="font-medium text-gray-900">Chef de projet IT</h4>
                <p className="text-sm text-gray-600">InnovateHub</p>
                <p className="text-xs text-gray-500">Lomé, Togo</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Postuler à cette offre</h3>
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
                  <p className="text-gray-600 mb-4">Vous devez être connecté pour postuler à cette offre.</p>
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
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                        Lettre de motivation *
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        required
                        rows={6}
                        value={applyForm.coverLetter}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                        placeholder="Expliquez pourquoi vous êtes intéressé par ce poste et pourquoi vous seriez un bon candidat..."
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
                        {applying ? 'Envoi...' : 'Envoyer la candidature'}
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

export default DetailOffre; 