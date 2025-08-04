import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const DetailBourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyForm, setApplyForm] = useState({
    motivation: '',
    academicRecord: ''
  });

  useEffect(() => {
    fetchScholarshipDetails();
  }, [id]);

  const fetchScholarshipDetails = async () => {
    try {
      const scholarshipData = await dataService.getScholarshipById(id);
      setScholarship(scholarshipData);
    } catch (error) {
      setError('Erreur lors du chargement de la bourse');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/bourses/${id}` } });
      return;
    }

    setApplying(true);
    try {
      const applicationData = {
        userId: user.id,
        scholarshipId: parseInt(id),
        motivation: applyForm.motivation,
        academicRecord: applyForm.academicRecord,
        appliedAt: new Date().toISOString(),
        status: 'en_attente'
      };

      await dataService.submitScholarshipApplication(applicationData);
      setShowApplyModal(false);
      setApplyForm({ motivation: '', academicRecord: '' });
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

  const isDeadlinePassed = () => {
    if (!scholarship?.deadline) return false;
    return new Date(scholarship.deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Bourse non trouvée</h2>
        <p className="text-gray-600 mb-4">La bourse que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link 
          to="/candidat/bourse"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Voir toutes les bourses
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{scholarship.title}</h1>
            <p className="text-fuchsia-600 font-medium text-lg">{scholarship.institution}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link 
              to="/candidat/bourse"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>Retour
            </Link>
            {!isDeadlinePassed() && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-paper-plane mr-2"></i>Postuler
              </button>
            )}
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
          {/* Scholarship Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-graduation-cap text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{scholarship.title}</h2>
                    <p className="text-green-600 font-medium">{scholarship.institution}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-university mr-2"></i>
                    <span>{scholarship.institution}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-clock mr-2"></i>
                    <span>{scholarship.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    <span>Publié le {formatDate(scholarship.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  isDeadlinePassed() ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
                }`}>
                  {isDeadlinePassed() ? 'Date limite dépassée' : 'Ouvert'}
                </span>
                <button className="text-gray-400 hover:text-fuchsia-600">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
            </div>

            {/* Scholarship Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{scholarship.amount}</div>
                <div className="text-sm text-gray-600">Montant de la bourse</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{scholarship.duration}</div>
                <div className="text-sm text-gray-600">Durée</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {scholarship.applications || 0}
                </div>
                <div className="text-sm text-gray-600">Candidatures</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
              Description de la bourse
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">{scholarship.description}</p>
            </div>
          </div>

          {/* Requirements */}
          {scholarship.requirements && scholarship.requirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-list-check mr-2 text-fuchsia-600"></i>
                Critères d'éligibilité
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {scholarship.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Process */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-clipboard-list mr-2 text-fuchsia-600"></i>
              Processus de candidature
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-medium text-fuchsia-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Vérifiez votre éligibilité</h4>
                  <p className="text-sm text-gray-600">Assurez-vous de répondre à tous les critères d'éligibilité</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-medium text-fuchsia-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Préparez vos documents</h4>
                  <p className="text-sm text-gray-600">CV, lettre de motivation, relevés de notes, etc.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-medium text-fuchsia-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Soumettez votre candidature</h4>
                  <p className="text-sm text-gray-600">Remplissez le formulaire en ligne avant la date limite</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Institution Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-university mr-2 text-fuchsia-600"></i>
              À propos de l'institution
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Institution</span>
                <p className="text-gray-900">{scholarship.institution}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Montant</span>
                <p className="text-gray-900">{scholarship.amount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Durée</span>
                <p className="text-gray-900">{scholarship.duration}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Date limite</span>
                <p className={`text-gray-900 ${isDeadlinePassed() ? 'text-red-600' : ''}`}>
                  {formatDate(scholarship.deadline)}
                </p>
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
              {!isDeadlinePassed() ? (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                >
                  <i className="fas fa-paper-plane mr-2"></i>Postuler maintenant
                </button>
              ) : (
                <div className="text-center py-3">
                  <p className="text-red-600 text-sm font-medium">Date limite dépassée</p>
                </div>
              )}
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <i className="fas fa-heart mr-2"></i>Ajouter aux favoris
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <i className="fas fa-share mr-2"></i>Partager
              </button>
            </div>
          </div>

          {/* Similar Scholarships */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-graduation-cap mr-2 text-fuchsia-600"></i>
              Bourses similaires
            </h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <h4 className="font-medium text-gray-900">Bourse Master en Informatique</h4>
                <p className="text-sm text-gray-600">Université de Lomé</p>
                <p className="text-xs text-gray-500">1.5M FCFA</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <h4 className="font-medium text-gray-900">Bourse Doctorat en Économie</h4>
                <p className="text-sm text-gray-600">Université de Cotonou</p>
                <p className="text-xs text-gray-500">2.5M FCFA</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Postuler à cette bourse</h3>
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
                  <p className="text-gray-600 mb-4">Vous devez être connecté pour postuler à cette bourse.</p>
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
                      <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                        Lettre de motivation *
                      </label>
                      <textarea
                        id="motivation"
                        name="motivation"
                        required
                        rows={6}
                        value={applyForm.motivation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                        placeholder="Expliquez votre motivation pour cette bourse et vos objectifs académiques..."
                      />
                    </div>

                    <div>
                      <label htmlFor="academicRecord" className="block text-sm font-medium text-gray-700 mb-2">
                        Relevés de notes
                      </label>
                      <textarea
                        id="academicRecord"
                        name="academicRecord"
                        rows={3}
                        value={applyForm.academicRecord}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                        placeholder="Décrivez brièvement votre parcours académique..."
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

export default DetailBourse; 