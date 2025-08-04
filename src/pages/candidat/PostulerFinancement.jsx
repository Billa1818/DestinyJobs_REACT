import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const PostulerFinancement = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [financement, setFinancement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    requestedAmount: '',
    projectDuration: '',
    businessPlan: '',
    financialProjections: '',
    teamExperience: '',
    marketAnalysis: '',
    riskAssessment: '',
    expectedImpact: ''
  });

  useEffect(() => {
    fetchFinancement();
  }, [id]);

  const fetchFinancement = async () => {
    try {
      setLoading(true);
      const financementData = await dataService.getFinancementById(id);
      setFinancement(financementData);
    } catch (error) {
      setError('Erreur lors du chargement du financement');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté pour postuler');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const applicationData = {
        financementId: parseInt(id),
        userId: user.id,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        requestedAmount: parseFloat(formData.requestedAmount),
        projectDuration: formData.projectDuration,
        businessPlan: formData.businessPlan,
        financialProjections: formData.financialProjections,
        teamExperience: formData.teamExperience,
        marketAnalysis: formData.marketAnalysis,
        riskAssessment: formData.riskAssessment,
        expectedImpact: formData.expectedImpact,
        status: 'en_attente',
        appliedAt: new Date().toISOString()
      };

      await dataService.submitFinancementApplication(applicationData);
      
      // Rediriger vers la page de confirmation
      navigate('/candidat/candidature-recente', { 
        state: { 
          message: 'Votre candidature au financement a été soumise avec succès!' 
        } 
      });
    } catch (error) {
      setError('Erreur lors de la soumission de la candidature: ' + error.message);
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </main>
    );
  }

  if (error && !financement) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Link to="/candidat/financements" className="text-fuchsia-600 hover:text-fuchsia-700 mt-2 inline-block">
            Retour aux financements
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/candidat" className="hover:text-fuchsia-600 transition duration-200">Accueil</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/candidat/financements" className="hover:text-fuchsia-600 transition duration-200">Financements</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to={`/candidat/financements/${id}`} className="hover:text-fuchsia-600 transition duration-200">{financement?.title}</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900">Postuler</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <i className="fas fa-paper-plane mr-2 text-fuchsia-600"></i>
              Postuler au financement
            </h1>
            <p className="text-gray-600 mt-2">
              {financement?.title} - {financement?.type}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Project Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du projet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du projet *
                    </label>
                    <input
                      type="text"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Titre de votre projet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant demandé (FCFA) *
                    </label>
                    <input
                      type="number"
                      name="requestedAmount"
                      value={formData.requestedAmount}
                      onChange={handleInputChange}
                      required
                      min={financement?.minAmount || 0}
                      max={financement?.maxAmount || 10000000}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Montant en FCFA"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description du projet *
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Décrivez votre projet en détail..."
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée du projet *
                  </label>
                  <input
                    type="text"
                    name="projectDuration"
                    value={formData.projectDuration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Ex: 12 mois, 2 ans..."
                  />
                </div>
              </div>

              {/* Business Plan */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan d'affaires</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan d'affaires *
                  </label>
                  <textarea
                    name="businessPlan"
                    value={formData.businessPlan}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Décrivez votre modèle économique, votre stratégie de marché, votre plan de commercialisation..."
                  />
                </div>
              </div>

              {/* Financial Projections */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Projections financières</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projections financières *
                  </label>
                  <textarea
                    name="financialProjections"
                    value={formData.financialProjections}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Décrivez vos projections de revenus, coûts, rentabilité sur 3-5 ans..."
                  />
                </div>
              </div>

              {/* Team Experience */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipe et expérience</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expérience de l'équipe *
                  </label>
                  <textarea
                    name="teamExperience"
                    value={formData.teamExperience}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Décrivez l'expérience et les compétences de votre équipe..."
                  />
                </div>
              </div>

              {/* Market Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse de marché</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analyse de marché *
                  </label>
                  <textarea
                    name="marketAnalysis"
                    value={formData.marketAnalysis}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Décrivez votre marché cible, la concurrence, les opportunités..."
                  />
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Évaluation des risques</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Évaluation des risques *
                  </label>
                  <textarea
                    name="riskAssessment"
                    value={formData.riskAssessment}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Identifiez les principaux risques et vos stratégies de mitigation..."
                  />
                </div>
              </div>

              {/* Expected Impact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact attendu</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact attendu *
                  </label>
                  <textarea
                    name="expectedImpact"
                    value={formData.expectedImpact}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Décrivez l'impact social, économique, environnemental de votre projet..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <Link
                to={`/candidat/financements/${id}`}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Soumettre la candidature
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PostulerFinancement; 