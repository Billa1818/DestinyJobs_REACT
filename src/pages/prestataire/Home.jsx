import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const PrestataireHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      candidatures: 0,
      offresConsultees: 0,
      favoris: 0,
      revenus: '0 FCFA'
    },
    recentApplications: [],
    upcomingProjects: [],
    availableConsultations: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les candidatures récentes de l'utilisateur
        const userApplications = await dataService.getUserApplications(user.id);
        
        // Récupérer les consultations disponibles
        const consultations = await dataService.getConsultations({ isActive: true });
        
        // Récupérer les offres d'emploi (pour les prestataires qui cherchent aussi des emplois)
        const offers = await dataService.getOffers({ isActive: true });
        
        // Calculer les statistiques
        const stats = {
          candidatures: userApplications.length,
          offresConsultees: consultations.length + offers.length,
          favoris: Math.floor(Math.random() * 15) + 5, // Simulation
          revenus: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}M FCFA` // Simulation
        };

        // Préparer les candidatures récentes
        const recentApplications = userApplications
          .slice(0, 3)
          .map(app => {
            const consultation = consultations.find(c => c.id === app.consultationId);
            const offer = offers.find(o => o.id === app.offerId);
            
            return {
              id: app.id,
              title: consultation?.title || offer?.title || 'Offre supprimée',
              client: consultation?.client || offer?.company || 'Client inconnu',
              status: app.status,
              date: new Date(app.appliedAt).toLocaleDateString('fr-FR'),
              montant: consultation?.budget || offer?.salary || 'Non précisé'
            };
          });

        // Préparer les projets à venir (simulation basée sur les candidatures acceptées)
        const upcomingProjects = userApplications
          .filter(app => app.status === 'acceptée')
          .slice(0, 2)
          .map((app, index) => {
            const consultation = consultations.find(c => c.id === app.consultationId);
            const offer = offers.find(o => o.id === app.offerId);
            
            return {
              id: app.id,
              title: consultation?.title || offer?.title || `Projet ${index + 1}`,
              client: consultation?.client || offer?.company || 'Client',
              date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
              status: 'Confirmé'
            };
          });

        // Préparer les consultations disponibles
        const availableConsultations = consultations
          .filter(consultation => consultation.isActive)
          .slice(0, 3)
          .map(consultation => ({
            id: consultation.id,
            title: consultation.title,
            client: consultation.client,
            budget: consultation.budget,
            duration: consultation.duration,
            description: consultation.description,
            requirements: consultation.requirements || []
          }));

        setDashboardData({
          stats,
          recentApplications,
          upcomingProjects,
          availableConsultations
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
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">Bienvenue, {user?.firstName || 'Prestataire'}</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200">
              <i className="fas fa-plus mr-2"></i>Nouveau service
            </button>
            <button className="border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition duration-200">
              <i className="fas fa-search mr-2"></i>Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="fas fa-paper-plane text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Candidatures</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.candidatures}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="fas fa-eye text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offres consultées</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.offresConsultees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <i className="fas fa-heart text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Favoris</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.favoris}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <i className="fas fa-money-bill-wave text-orange-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus 2024</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.revenus}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Candidatures récentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentApplications.length > 0 ? (
                dashboardData.recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{application.title}</h3>
                      <p className="text-sm text-gray-600">{application.client}</p>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span>{application.date}</span>
                        <span className="text-orange-600 font-medium">{application.montant}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.status === 'acceptée' ? 'bg-green-100 text-green-800' :
                        application.status === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status === 'acceptée' ? 'Acceptée' :
                         application.status === 'en_cours' ? 'En cours' :
                         application.status === 'en_attente' ? 'En attente' : application.status}
                      </span>
                      <Link to={`/prestataire/candidature/${application.id}`} className="text-orange-600 hover:text-orange-700">
                        <i className="fas fa-external-link-alt"></i>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-4"></i>
                  <p>Aucune candidature récente</p>
                  <Link to="/consultation" className="text-orange-600 hover:text-orange-700 mt-2 inline-block">
                    Découvrir des consultations
                  </Link>
                </div>
              )}
            </div>
            <div className="mt-6">
              <Link to="/prestataire/candidatures" className="text-orange-600 hover:text-orange-700 font-medium">
                Voir toutes les candidatures →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Projects */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Projets à venir</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.upcomingProjects.length > 0 ? (
                dashboardData.upcomingProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.client}</p>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span><i className="fas fa-calendar mr-1"></i>{project.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Confirmé' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-calendar text-4xl mb-4"></i>
                  <p>Aucun projet à venir</p>
                  <p className="text-sm">Les projets confirmés apparaîtront ici</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <Link to="/prestataire/projets" className="text-orange-600 hover:text-orange-700 font-medium">
                Voir tous les projets →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Available Consultations */}
      {dashboardData.availableConsultations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Consultations disponibles</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.availableConsultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition duration-200">
                  <h3 className="font-medium text-gray-900 mb-2">{consultation.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{consultation.client}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p><i className="fas fa-money-bill mr-1"></i>{consultation.budget}</p>
                    <p><i className="fas fa-clock mr-1"></i>{consultation.duration}</p>
                  </div>
                  <div className="mt-3">
                    <Link 
                      to={`/consultation/${consultation.id}`}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      Voir les détails →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/consultation" className="text-orange-600 hover:text-orange-700 font-medium">
                Voir toutes les consultations →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/consultation" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <i className="fas fa-search text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Rechercher des consultations</h3>
              <p className="text-sm text-gray-600">Trouver de nouvelles opportunités</p>
            </div>
          </Link>

          <Link to="/prestataire/services" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <i className="fas fa-briefcase text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Gérer mon portfolio</h3>
              <p className="text-sm text-gray-600">Mettre à jour mes services</p>
            </div>
          </Link>

          <Link to="/prestataire/profile" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <i className="fas fa-user text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Mon profil</h3>
              <p className="text-sm text-gray-600">Modifier mes informations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrestataireHome; 