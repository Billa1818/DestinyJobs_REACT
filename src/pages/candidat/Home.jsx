import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';

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
                <Link to="/candidat/profil" className="bg-fuchsia-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-fuchsia-900 transition duration-200">
                  <i className="fas fa-upload mr-1 sm:mr-2"></i>Gérer CV & Photo
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-fuchsia-100 rounded-lg">
                  <i className="fas fa-paper-plane text-fuchsia-600"></i>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-500">Total</p>
                  <div className="text-lg sm:text-xl font-semibold text-gray-900">
                    {loadingStats ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                    ) : (
                      '0'
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <i className="fas fa-eye text-green-600"></i>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-500">Consultées</p>
                  <div className="text-lg sm:text-xl font-semibold text-gray-900">
                    {loadingStats ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                    ) : (
                      '0'
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <i className="fas fa-comments text-orange-600"></i>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-500">Entretiens</p>
                  <div className="text-lg sm:text-xl font-semibold text-gray-900">
                    {loadingStats ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                    ) : (
                      '0'
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <i className="fas fa-bookmark text-purple-600"></i>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-500">Présélection</p>
                  <div className="text-lg sm:text-xl font-semibold text-gray-900">
                    {loadingStats ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                    ) : (
                      '0'
                    )}
                  </div>
                </div>
              </div>
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

          {/* Recent Applications */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
                Candidatures récentes
              </h3>
              <Link to="/candidat/candidature-recente" className="text-sm text-fuchsia-600 hover:text-fuchsia-700">
                Voir tout
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-briefcase text-fuchsia-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Développeur Full Stack</h4>
                    <p className="text-sm text-gray-500">TechCorp • Cotonou</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">En cours</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-chart-line text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Manager</h4>
                    <p className="text-sm text-gray-500">StartupBJ • Porto-Novo</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">En attente</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-calculator text-purple-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Comptable Senior</h4>
                    <p className="text-sm text-gray-500">Finance+ • Parakou</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Refusé</span>
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                <i className="fas fa-star mr-2 text-fuchsia-600"></i>
                Emplois recommandés
              </h3>
              <Link to="/candidat/offre" className="text-sm text-fuchsia-600 hover:text-fuchsia-700">
                Voir plus
              </Link>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Développeur React</h4>
                    <p className="text-sm text-gray-500 mb-2">Digital Solutions • Cotonou</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">React</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Node.js</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">MongoDB</span>
                    </div>
                    <p className="text-sm text-gray-600">Il y a 2h • 250k - 350k FCFA</p>
                  </div>
                  <button className="text-fuchsia-600 hover:text-fuchsia-700">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">UX/UI Designer</h4>
                    <p className="text-sm text-gray-500 mb-2">Creative Agency • Abomey-Calavi</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Figma</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Adobe XD</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Sketch</span>
                    </div>
                    <p className="text-sm text-gray-600">Il y a 4h • 200k - 300k FCFA</p>
                  </div>
                  <button className="text-gray-400 hover:text-fuchsia-600">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </main>
  );
};

export default Home;