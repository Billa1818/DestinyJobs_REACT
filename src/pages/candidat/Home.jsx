import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';
import CandidatHomeService from '../../services/CandidatHomeService';

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [stats, setStats] = useState({
    candidatures: 0,
    vuesProfil: 0,
    entretiens: 0,
    favoris: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 0,
    completedFields: [],
    incompleteFields: []
  });
  const [personalStats, setPersonalStats] = useState(null);
  // Nouvel état pour les statistiques des candidatures
  const [applicationStats, setApplicationStats] = useState(null);
  const [loadingApplicationStats, setLoadingApplicationStats] = useState(true);

  // Fonction pour récupérer les statistiques
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      
      // Récupérer les statistiques personnelles du profil
      try {
        const personalStatsData = await profileService.getPersonalStats();
        console.log('Statistiques personnelles:', personalStatsData);
        setPersonalStats(personalStatsData);
        setStatsError(null); // Effacer les erreurs précédentes
      } catch (error) {
        console.log('Statistiques personnelles non disponibles:', error);
        setStatsError('Impossible de charger les statistiques personnelles depuis l\'API');
      }

      // Récupérer les données du profil pour calculer la complétude
      try {
        const candidateProfile = await profileService.getCandidateProfile();
        const userProfile = await profileService.getProfile();
        
        // Combiner les données du profil
        const combinedProfile = {
          ...userProfile,
          ...candidateProfile
        };
        
        setProfileData(combinedProfile);
        
        // Calculer la complétude du profil
        const completion = calculateProfileCompletion(combinedProfile);
        setProfileCompletion(completion);
        
        console.log('Complétude du profil calculée:', completion);
      } catch (error) {
        console.log('Données du profil non disponibles:', error);
        setProfileCompletion({ percentage: 0, completedFields: [], incompleteFields: [] });
      }

      // Récupérer les statistiques des candidatures
      try {
        setLoadingApplicationStats(true);
        const applicationStatsData = await CandidatHomeService.getMyApplicationStats();
        console.log('Statistiques des candidatures:', applicationStatsData);
        
        // Formater les données pour l'affichage
        const formattedStats = CandidatHomeService.formatStatsForDisplay(applicationStatsData);
        setApplicationStats(formattedStats);
        
      } catch (error) {
        console.log('Statistiques des candidatures non disponibles:', error);
        setApplicationStats(null);
      } finally {
        setLoadingApplicationStats(false);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fonction pour calculer la complétude du profil
  const calculateProfileCompletion = (profile) => {
    if (!profile) return { percentage: 0, completedFields: [], incompleteFields: [] };

    const fields = [
      { key: 'personal_info', label: 'Informations personnelles', weight: 20, check: () => 
        profile.first_name && profile.last_name && profile.email && profile.phone
      },
      { key: 'candidate_profile', label: 'Profil candidat', weight: 20, check: () => 
        profile.about && profile.years_experience && profile.technologies
      },
      { key: 'skills', label: 'Compétences', weight: 15, check: () => 
        profile.skills && profile.skills.trim() !== ''
      },
      { key: 'experience', label: 'Expérience professionnelle', weight: 15, check: () => 
        profile.professional_experience && profile.professional_experience.trim() !== ''
      },
      { key: 'education', label: 'Formation', weight: 10, check: () => 
        profile.education && profile.education.trim() !== ''
      },
      { key: 'cv', label: 'CV', weight: 10, check: () => profile.cv && profile.cv !== ''
      },
      { key: 'image', label: 'Photo de profil', weight: 10, check: () => profile.image && profile.image !== ''
      }
    ];

    let totalWeight = 0;
    let completedWeight = 0;
    const completedFields = [];
    const incompleteFields = [];

    fields.forEach(field => {
      totalWeight += field.weight;
      if (field.check()) {
        completedWeight += field.weight;
        completedFields.push(field);
      } else {
        incompleteFields.push(field);
      }
    });

    const percentage = Math.round((completedWeight / totalWeight) * 100);

    return {
      percentage,
      completedFields,
      incompleteFields
    };
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">


      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-full">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex-1 mb-3 sm:mb-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">
                  Bonjour {user?.first_name || user?.username || 'Utilisateur'} ! 👋
                </h1>
                <p className="text-fuchsia-100 text-sm sm:text-base">Prêt à découvrir de nouvelles opportunités ?</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link to="/candidat/editer-profil" className="bg-white text-fuchsia-600 px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-200">
                  <i className="fas fa-edit mr-1 sm:mr-2"></i>Modifier profil
                </Link>

                <Link to={`/profile/candidat/${user?.id}`} className="bg-fuchsia-100 text-fuchsia-700 px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-fuchsia-200 transition duration-200">
                  <i className="fas fa-external-link-alt mr-1 sm:mr-2"></i>Voir profil public
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
              Statistiques des candidatures
            </h3>
            <button
              onClick={() => {
                setLoadingStats(true);
                setStatsError(null);
                fetchStats();
              }}
              disabled={loadingStats}
              className="text-sm text-fuchsia-600 hover:text-fuchsia-700 disabled:opacity-50 flex items-center"
            >
              <i className={`fas fa-sync-alt mr-1 ${loadingStats ? 'animate-spin' : ''}`}></i>
              Actualiser
            </button>
          </div>
          
          {/* Message d'erreur */}
          {statsError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <span className="text-sm text-red-700">{statsError}</span>
              </div>
            </div>
          )}
          {/* Statistiques des candidatures */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
                Mes Candidatures
              </h3>
              {applicationStats && (
                <span className="text-sm text-gray-500">
                  Dernière mise à jour: {new Date(applicationStats.generatedAt).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total des candidatures */}
              <div className="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 rounded-lg p-4 border border-fuchsia-200">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-fuchsia-500 rounded-lg">
                    <i className="fas fa-paper-plane text-white text-sm"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-fuchsia-700 font-medium">Total</p>
                    <div className="text-2xl font-bold text-fuchsia-800">
                      {loadingApplicationStats ? (
                        <div className="animate-pulse bg-fuchsia-200 h-8 w-12 rounded"></div>
                      ) : applicationStats ? (
                        applicationStats.total
                      ) : (
                        '0'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidatures en attente */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <i className="fas fa-clock text-white text-sm"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-700 font-medium">En attente</p>
                    <div className="text-2xl font-bold text-yellow-800">
                      {loadingApplicationStats ? (
                        <div className="animate-pulse bg-yellow-200 h-8 w-12 rounded"></div>
                      ) : applicationStats ? (
                        applicationStats.pending
                      ) : (
                        '0'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidatures consultées */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <i className="fas fa-eye text-white text-sm"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-700 font-medium">Consultées</p>
                    <div className="text-2xl font-bold text-blue-800">
                      {loadingApplicationStats ? (
                        <div className="animate-pulse bg-blue-200 h-8 w-12 rounded"></div>
                      ) : applicationStats ? (
                        applicationStats.viewed
                      ) : (
                        '0'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidatures présélectionnées */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <i className="fas fa-star text-white text-sm"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-700 font-medium">Présélection</p>
                    <div className="text-2xl font-bold text-green-800">
                      {loadingApplicationStats ? (
                        <div className="animate-pulse bg-green-200 h-8 w-12 rounded"></div>
                      ) : applicationStats ? (
                        applicationStats.shortlisted
                      ) : (
                        '0'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques détaillées */}
            {applicationStats && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Par type d'offre */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Par type d'offre</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Emploi</span>
                      <span className="text-sm font-medium text-gray-900">{applicationStats.job}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Financement de projets</span>
                      <span className="text-sm font-medium text-gray-900">{applicationStats.funding}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bourses d'études</span>
                      <span className="text-sm font-medium text-gray-900">{applicationStats.scholarship}</span>
                    </div>
                  </div>
                </div>

                {/* Par priorité */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Par priorité</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Haute</span>
                      <span className="text-sm font-medium text-red-600">{applicationStats.highPriority}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Normale</span>
                      <span className="text-sm font-medium text-blue-600">{applicationStats.normalPriority}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Basse</span>
                      <span className="text-sm font-medium text-gray-600">{applicationStats.lowPriority}</span>
                    </div>
                  </div>
                </div>

                {/* Taux de succès */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance</h4>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fuchsia-600 mb-1">
                      {applicationStats.successRate}%
                    </div>
                    <p className="text-xs text-gray-500">Taux de succès</p>
                    <div className="mt-2 text-xs text-gray-600">
                      {applicationStats.shortlisted + applicationStats.interview} sur {applicationStats.total} candidatures
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>





          {/* Actions rapides */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Mes candidatures emploi */}
              <Link 
                to="/candidat/emploi-candidature"
                className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg p-4 border border-blue-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="p-3 bg-blue-500 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform duration-200">
                    <i className="fas fa-briefcase text-white text-lg"></i>
                  </div>
                  <h4 className="font-semibold text-blue-800 mb-1">Mes candidatures</h4>
                  <p className="text-sm text-blue-600">Emploi</p>
                  {applicationStats && (
                    <div className="mt-2 text-xs text-blue-700">
                      {applicationStats.job} candidature{applicationStats.job > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Link>

              {/* Mes candidatures consultation */}
              <Link 
                to="/candidat/consultation-candidature"
                className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg p-4 border border-green-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="p-3 bg-green-500 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform duration-200">
                    <i className="fas fa-search text-white text-lg"></i>
                  </div>
                  <h4 className="font-semibold text-green-800 mb-1">Mes candidatures</h4>
                  <p className="text-sm text-green-600">Bourses d'études</p>
                  {applicationStats && (
                    <div className="mt-2 text-xs text-green-700">
                      {applicationStats.consultation} candidature{applicationStats.consultation > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Link>

              {/* Mes candidatures financement */}
              <Link 
                to="/candidat/financement-candidature"
                className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg p-4 border border-purple-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="p-3 bg-purple-500 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform duration-200">
                    <i className="fas fa-coins text-white text-lg"></i>
                  </div>
                  <h4 className="font-semibold text-purple-800 mb-1">Mes candidatures</h4>
                  <p className="text-sm text-purple-600">Financement de projets</p>
                  {applicationStats && (
                    <div className="mt-2 text-xs text-purple-700">
                      {applicationStats.funding} candidature{applicationStats.funding > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Link>

              {/* Rechercher des offres */}
              <Link 
                to="/jobs"
                className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg p-4 border border-orange-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="p-3 bg-orange-500 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform duration-200">
                    <i className="fas fa-plus text-white text-lg"></i>
                  </div>
                  <h4 className="font-semibold text-orange-800 mb-1">Rechercher</h4>
                  <p className="text-sm text-orange-600">Nouvelles offres</p>
                  <div className="mt-2 text-xs text-orange-700">
                    Postuler maintenant
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                <i className="fas fa-user-circle mr-2 text-fuchsia-600"></i>
                Complétude du profil
              </h3>
              <span className="text-sm font-medium text-fuchsia-600">
                {loadingStats ? (
                  <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                ) : (
                  `${profileCompletion.percentage}%`
                )}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3 sm:mb-4">
              <div 
                className="bg-fuchsia-600 h-2 rounded-full progress-bar transition-all duration-500" 
                style={{width: `${profileCompletion.percentage}%`}}
              ></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {loadingStats ? (
                // Affichage de chargement
                <>
                  <div className="flex items-center text-sm">
                    <div className="animate-pulse bg-gray-200 h-4 w-4 rounded mr-2"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="animate-pulse bg-gray-200 h-4 w-4 rounded mr-2"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                  </div>
              <div className="flex items-center text-sm">
                    <div className="animate-pulse bg-gray-200 h-4 w-4 rounded mr-2"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
              </div>
              <div className="flex items-center text-sm">
                    <div className="animate-pulse bg-gray-200 h-4 w-4 rounded mr-2"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                  </div>
                </>
              ) : (
                // Affichage basé sur les données calculées localement
                <>
                  <div className="flex items-center text-sm">
                    <i className={`fas ${profileData?.cv ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-orange-500'} mr-2`}></i>
                    <span className="text-gray-700">CV</span>
              </div>
              <div className="flex items-center text-sm">
                    <i className={`fas ${profileData?.image ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-orange-500'} mr-2`}></i>
                <span className="text-gray-700">Photo de profil</span>
              </div>
              <div className="flex items-center text-sm">
                    <i className={`fas ${profileData?.skills && profileData.skills.trim() !== '' ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-orange-500'} mr-2`}></i>
                <span className="text-gray-700">Compétences</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className={`fas ${profileData?.technologies && profileData.technologies.trim() !== '' ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-orange-500'} mr-2`}></i>
                    <span className="text-gray-700">Technologies</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className={`fas ${profileData?.years_experience > 0 ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-orange-500'} mr-2`}></i>
                    <span className="text-gray-700">Expérience</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className={`fas ${profileData?.country ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-orange-500'} mr-2`}></i>
                    <span className="text-gray-700">Localisation</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Conseils pour améliorer le profil */}
            {!loadingStats && profileData && profileCompletion.percentage < 100 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <i className="fas fa-lightbulb text-blue-600 mr-2 mt-0.5"></i>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Conseils pour un profil optimal :</p>
                    <ul className="list-disc list-inside space-y-1">
                      {!profileData.cv && <li>Ajoutez votre CV pour augmenter votre visibilité</li>}
                      {!profileData.image && <li>Ajoutez une photo de profil professionnelle</li>}
                      {(!profileData.skills || profileData.skills.trim() === '') && <li>Listez vos compétences principales</li>}
                      {(!profileData.technologies || profileData.technologies.trim() === '') && <li>Ajoutez les technologies que vous maîtrisez</li>}
                      {!profileData.years_experience && <li>Précisez vos années d'expérience</li>}
                      {!profileData.country && <li>Ajoutez votre localisation</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

      {/* CV et Documents */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            <i className="fas fa-file-alt mr-2 text-fuchsia-600"></i>
            CV et Documents
          </h3>
          <Link to="/candidat/profil" className="text-sm text-fuchsia-600 hover:text-fuchsia-700">
            Gérer
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center p-3 border border-gray-200 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-file-pdf text-red-600"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">CV</h4>
              <p className="text-sm text-gray-500">Document principal</p>
            </div>
            <Link to="/candidat/profil" className="text-fuchsia-600 hover:text-fuchsia-700">
              <i className="fas fa-edit"></i>
            </Link>
          </div>
          
          <div className="flex items-center p-3 border border-gray-200 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-image text-blue-600"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Photo de profil</h4>
              <p className="text-sm text-gray-500">Image personnelle</p>
            </div>
            <Link to="/candidat/profil" className="text-fuchsia-600 hover:text-fuchsia-700">
              <i className="fas fa-edit"></i>
            </Link>
          </div>
            </div>
          </div>



        </div>
      </div>
    </main>
  );
};

export default Home;