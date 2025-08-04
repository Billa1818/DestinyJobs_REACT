import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    recentApplications: [],
    recommendedJobs: [],
    stats: {
      candidatures: 0,
      vuesProfil: 0,
      entretiens: 0,
      favoris: 0
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les candidatures récentes de l'utilisateur
        const userApplications = await dataService.getUserApplications(user.id);
        
        // Récupérer les offres recommandées (toutes les offres actives)
        const allOffers = await dataService.getOffers({ isActive: true });
        
        // Récupérer les bourses disponibles
        const scholarships = await dataService.getScholarships({ isActive: true });
        
        // Calculer les statistiques
        const stats = {
          candidatures: userApplications.length,
          vuesProfil: Math.floor(Math.random() * 100) + 20, // Simulation
          entretiens: userApplications.filter(app => app.status === 'acceptée').length,
          favoris: Math.floor(Math.random() * 15) + 5 // Simulation
        };

        // Préparer les candidatures récentes avec les détails des offres
        const recentApplications = userApplications
          .slice(0, 3)
          .map(app => {
            const offer = allOffers.find(o => o.id === app.offerId);
            return {
              ...app,
              offerTitle: offer?.title || 'Offre supprimée',
              company: offer?.company || 'Entreprise inconnue',
              location: offer?.location || 'Localisation inconnue'
            };
          });

        // Préparer les emplois recommandés (offres récentes)
        const recommendedJobs = allOffers
          .filter(offer => offer.isActive)
          .slice(0, 5)
          .map(offer => ({
            id: offer.id,
            title: offer.title,
            company: offer.company,
            location: offer.location,
            salary: offer.salary,
            requirements: offer.requirements || [],
            createdAt: offer.createdAt
          }));

        setDashboardData({
          recentApplications,
          recommendedJobs,
          stats
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </main>
    );
  }

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
                  Bonjour {user?.firstName || 'Utilisateur'} ! 👋
                </h1>
                <p className="text-fuchsia-100 text-sm sm:text-base">Prêt à découvrir de nouvelles opportunités ?</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link to="/candidat/editer-profil" className="bg-white text-fuchsia-600 px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-200">
                  <i className="fas fa-edit mr-1 sm:mr-2"></i>Modifier profil
                </Link>
                <button className="bg-fuchsia-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium hover:bg-fuchsia-900 transition duration-200">
                  <i className="fas fa-upload mr-1 sm:mr-2"></i>Télécharger CV
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-fuchsia-100 rounded-lg">
                  <i className="fas fa-paper-plane text-fuchsia-600"></i>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-500">Candidatures</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{dashboardData.stats.candidatures}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <i className="fas fa-eye text-green-600"></i>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-500">Vues profil</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{dashboardData.stats.vuesProfil}</p>
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
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{dashboardData.stats.entretiens}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <i className="fas fa-bookmark text-purple-600"></i>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-gray-500">Favoris</p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{dashboardData.stats.favoris}</p>
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
              <span className="text-sm font-medium text-fuchsia-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3 sm:mb-4">
              <div className="bg-fuchsia-600 h-2 rounded-full progress-bar" style={{width: '75%'}}></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center text-sm">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span className="text-gray-700">Informations personnelles</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span className="text-gray-700">Expérience professionnelle</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-exclamation-circle text-orange-500 mr-2"></i>
                <span className="text-gray-700">Photo de profil</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-exclamation-circle text-orange-500 mr-2"></i>
                <span className="text-gray-700">Compétences</span>
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
              {dashboardData.recentApplications.length > 0 ? (
                dashboardData.recentApplications.map((application, index) => (
                  <div key={application.id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center mr-3">
                        <i className="fas fa-briefcase text-fuchsia-600"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{application.offerTitle}</h4>
                        <p className="text-sm text-gray-500">{application.company} • {application.location}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      application.status === 'acceptée' ? 'bg-green-100 text-green-800' :
                      application.status === 'refusée' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {application.status === 'acceptée' ? 'Acceptée' :
                       application.status === 'refusée' ? 'Refusée' :
                       application.status === 'en_attente' ? 'En attente' : 'En cours'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-4"></i>
                  <p>Aucune candidature récente</p>
                  <Link to="/candidat/offre" className="text-fuchsia-600 hover:text-fuchsia-700 mt-2 inline-block">
                    Découvrir des offres
                  </Link>
                </div>
              )}
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
              {dashboardData.recommendedJobs.length > 0 ? (
                dashboardData.recommendedJobs.map((job) => (
                  <div key={job.id} className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">{job.company} • {job.location}</p>
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{job.requirements.length - 3} autres
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-gray-600">
                          {job.createdAt && new Date(job.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })} • {job.salary || 'Salaire non précisé'}
                        </p>
                      </div>
                      <button className="text-fuchsia-600 hover:text-fuchsia-700">
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-search text-4xl mb-4"></i>
                  <p>Aucune offre disponible pour le moment</p>
                  <p className="text-sm">Les recruteurs publient régulièrement de nouvelles offres</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;