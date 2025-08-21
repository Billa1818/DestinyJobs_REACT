import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import scoreService from '../../services/scoreService';
import jobService from '../../services/jobService';
import consultationService from '../../services/consultationService';
import financementService from '../../services/financementService';
import bourseService from '../../services/bourseService';

const IACompatibilityCheck = () => {
  const { offerId, offerType } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [compatibilityScore, setCompatibilityScore] = useState(0);
  const [analysis, setAnalysis] = useState({});
  const [motivationLetter, setMotivationLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMotivationForm, setShowMotivationForm] = useState(false);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les détails de l'offre selon le type
  useEffect(() => {
    const loadOfferDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let offerData;
        
        switch (offerType) {
          case 'emploi':
            offerData = await jobService.getPublicJobOfferDetail(offerId);
            break;
          case 'consultation':
            offerData = await consultationService.getConsultationOfferDetail(offerId);
            break;
          case 'financement':
            offerData = await financementService.getFundingOfferDetail(offerId);
            break;
          case 'bourse':
            offerData = await bourseService.getScholarshipOfferDetail(offerId);
            break;
          default:
            throw new Error('Type d\'offre non reconnu');
        }
        
        setOffer(offerData);
        console.log('✅ Détails de l\'offre chargés:', offerData);
        
        // Effectuer l'analyse de compatibilité IA
        await performCompatibilityAnalysis();
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement de l\'offre:', error);
        setError(error.message || 'Erreur lors du chargement de l\'offre');
      } finally {
        setIsLoading(false);
      }
    };

    if (offerId && offerType && isAuthenticated && user) {
      loadOfferDetails();
    }
  }, [offerId, offerType, isAuthenticated, user]);

  // Effectuer l'analyse de compatibilité IA
  const performCompatibilityAnalysis = async () => {
    try {
      console.log('🔍 Début de l\'analyse de compatibilité IA...');
      
      // Utiliser la méthode unifiée avec conversion automatique du type
      const analysisResult = await scoreService.calculateCompatibility(user.id, offerId, offerType);
      
      console.log('✅ Analyse de compatibilité terminée:', analysisResult);
      
      // Mettre à jour l'état avec les résultats de l'analyse
      setCompatibilityScore(analysisResult.compatibility_score);
      setAnalysis({
        strengths: generateStrengths(analysisResult.detailed_scores, offerType),
        weaknesses: generateWeaknesses(analysisResult.detailed_scores, offerType),
        recommendations: generateRecommendations(analysisResult.detailed_scores, offerType),
        matchPercentage: scoreService.formatDetailedScores(analysisResult.detailed_scores, offerType),
        recommendation: analysisResult.recommendation,
        weights: analysisResult.weights || {},
        analysisDate: analysisResult.analysis_date,
        scoreSaved: analysisResult.score_saved
      });
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse de compatibilité:', error);
      
      // Gestion spécifique des erreurs de timeout
      if (error.message.includes('temps') || error.message.includes('timeout')) {
        setError('⏱️ L\'analyse IA prend plus de temps que prévu. Veuillez réessayer dans quelques instants.');
      } else if (error.message.includes('serveur') || error.message.includes('indisponible')) {
        setError('🔧 L\'analyse IA est temporairement indisponible. Veuillez réessayer plus tard.');
      } else {
        setError(error.message || 'Erreur lors de l\'analyse de compatibilité IA');
      }
    }
  };

  const handleSubmitApplication = async () => {
    if (!motivationLetter.trim()) {
      alert('Veuillez rédiger votre lettre de motivation');
      return;
    }

    setIsSubmitting(true);
    
    // Simulation de soumission
    setTimeout(() => {
      alert('Candidature envoyée avec succès !');
      navigate('/candidat/emploi-candidature');
      setIsSubmitting(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellente compatibilité';
    if (score >= 60) return 'Bonne compatibilité';
    return 'Compatibilité limitée';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analyse IA en cours...</h2>
          <p className="text-gray-600 mb-4">
            Vérification de votre compatibilité avec le poste
          </p>
          
          {/* Informations sur le processus */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Ce que fait l'IA en ce moment :
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Analyse de votre profil et compétences</li>
              <li>• Comparaison avec les exigences du poste</li>
              <li>• Calcul des scores de compatibilité</li>
              <li>• Génération des recommandations</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">
              ⏱️ L'analyse peut prendre 30 secondes à 2 minutes selon la complexité
            </p>
          </div>
          
          {/* Barre de progression simulée */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-fuchsia-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Analyse en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-robot text-fuchsia-600 mr-3"></i>
                Analyse IA - Compatibilité
              </h1>
              <p className="text-gray-600 mt-2">
                Analyse de votre profil pour le poste : <span className="font-semibold">{offer?.title}</span>
              </p>
            </div>
            <div className="text-right space-y-2">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getScoreColor(compatibilityScore)}`}>
                <i className="fas fa-chart-line mr-2"></i>
                Score : {compatibilityScore.toFixed(1)}%
              </div>
              {analysis.recommendation && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRecommendationColor(analysis.recommendation)}`}>
                  <i className="fas fa-thumbs-up mr-1"></i>
                  {getRecommendationText(analysis.recommendation)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score de compatibilité */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-percentage text-fuchsia-600 mr-2"></i>
                Score de compatibilité
              </h2>
              
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - compatibilityScore / 100)}`}
                      className={`${getScoreColor(compatibilityScore).split(' ')[0]}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(compatibilityScore).split(' ')[0]}`}>
                        {compatibilityScore}%
                      </div>
                      <div className="text-sm text-gray-600">{getScoreText(compatibilityScore)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails du score */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.matchPercentage?.skills || 85}%</div>
                  <div className="text-sm text-gray-600">Compétences</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.matchPercentage?.experience || 80}%</div>
                  <div className="text-sm text-gray-600">Expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.matchPercentage?.education || 90}%</div>
                  <div className="text-sm text-gray-600">Formation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.matchPercentage?.culture || 75}%</div>
                  <div className="text-sm text-gray-600">Culture</div>
                </div>
              </div>
            </div>

            {/* Forces et faiblesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Forces */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-thumbs-up text-green-600 mr-2"></i>
                  Vos forces
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths?.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-check-circle text-green-600 mt-1 mr-2"></i>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Faiblesses */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                  Points d'amélioration
                </h3>
                <ul className="space-y-2">
                  {analysis.weaknesses?.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-info-circle text-yellow-600 mt-1 mr-2"></i>
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommandations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-lightbulb text-fuchsia-600 mr-2"></i>
                Recommandations IA
              </h3>
              <div className="space-y-3">
                {analysis.recommendations?.map((rec, index) => (
                  <div key={index} className="flex items-start p-3 bg-fuchsia-50 rounded-lg">
                    <i className="fas fa-robot text-fuchsia-600 mt-1 mr-3"></i>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Détails de l'offre */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-briefcase text-blue-600 mr-2"></i>
                Détails de l'offre
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{offer?.title}</h4>
                  <p className="text-sm text-blue-600">{offer?.company}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>{offer?.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-money-bill mr-2"></i>
                  <span>{offer?.salary}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-paper-plane text-fuchsia-600 mr-2"></i>
                Postuler
              </h3>
              
              {compatibilityScore >= 60 ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle text-green-600 mr-2"></i>
                      <span className="text-sm font-medium text-green-800">
                        Compatibilité suffisante pour postuler
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowMotivationForm(true)}
                    className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Rédiger ma candidature
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                      <span className="text-sm font-medium text-yellow-800">
                        Compatibilité limitée - Améliorez votre profil
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowMotivationForm(true)}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition duration-200 font-medium"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Postuler quand même
                  </button>
                </div>
              )}
            </div>

            {/* Profil candidat */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-user text-green-600 mr-2"></i>
                Votre profil
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{user?.name}</h4>
                  <p className="text-sm text-gray-600">{user?.experience} d'expérience</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Compétences</h5>
                  <div className="flex flex-wrap gap-1">
                    {user?.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal lettre de motivation */}
        {showMotivationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    <i className="fas fa-edit text-fuchsia-600 mr-2"></i>
                    Lettre de motivation
                  </h2>
                  <button 
                    onClick={() => setShowMotivationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pourquoi êtes-vous intéressé par ce poste ?
                    </label>
                    <textarea
                      value={motivationLetter}
                      onChange={(e) => setMotivationLetter(e.target.value)}
                      placeholder="Rédigez votre lettre de motivation en expliquant pourquoi vous êtes le candidat idéal pour ce poste..."
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowMotivationForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting || !motivationLetter.trim()}
                      className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Envoyer ma candidature
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IACompatibilityCheck; 