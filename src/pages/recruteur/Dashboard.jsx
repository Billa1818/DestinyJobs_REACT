import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    offers: 0,
    applications: 0,
    interviews: 0,
    hires: 0
  });
  const [recentOffers, setRecentOffers] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les statistiques complètes du recruteur
        const recruiterStats = await dataService.getRecruiterStats(user.id);
        
        // Récupérer les offres du recruteur
        const offers = await dataService.getOffers({ recruiterId: user.id });
        
        // Récupérer les candidatures reçues
        const applications = await dataService.getReceivedApplications(user.id);
        
        // Calculer les statistiques détaillées
        const activeOffers = offers.filter(offer => offer.isActive).length;
        const totalApplications = applications.length;
        const interviewedApplications = applications.filter(app => app.status === 'entretien').length;
        const hiredApplications = applications.filter(app => app.status === 'embauché').length;
        
        setStats({
          offers: activeOffers,
          applications: totalApplications,
          interviews: interviewedApplications,
          hires: hiredApplications
        });
        
        // Offres récentes (limitées à 3)
        setRecentOffers(offers.slice(0, 3));
        
        // Candidatures récentes (limitées à 3)
        setRecentApplications(applications.slice(0, 3));
        
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const statsData = [
    {
      title: 'Offres actives',
      value: stats.offers.toString(),
      change: '+2',
      changeType: 'positive',
      icon: 'fas fa-briefcase',
      color: 'fuchsia'
    },
    {
      title: 'Candidatures reçues',
      value: stats.applications.toString(),
      change: '+15',
      changeType: 'positive',
      icon: 'fas fa-users',
      color: 'green'
    },
    {
      title: 'Entretiens planifiés',
      value: stats.interviews.toString(),
      change: '+3',
      changeType: 'positive',
      icon: 'fas fa-calendar-check',
      color: 'blue'
    },
    {
      title: 'Embauches réalisées',
      value: stats.hires.toString(),
      change: '+1',
      changeType: 'positive',
      icon: 'fas fa-user-check',
      color: 'purple'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'text-blue-600 bg-blue-100';
      case 'examinée': return 'text-purple-600 bg-purple-100';
      case 'entretien': return 'text-green-600 bg-green-100';
      case 'refusée': return 'text-red-600 bg-red-100';
      case 'embauché': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tableau de bord Recruteur</h1>
            <p className="text-gray-600">Bienvenue, {user?.firstName || 'Recruteur'} ! Gérez vos offres et candidatures</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <Link 
              to="/recruteur/creer-offre"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 text-center"
            >
              <i className="fas fa-plus mr-2"></i>Créer une offre
            </Link>
            <Link 
              to="/recruteur/creer-consultation"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-center"
            >
              <i className="fas fa-handshake mr-2"></i>Créer une consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} ce mois
                </p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-${stat.color}-600 text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Offers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
                Offres récentes
              </h2>
              <Link 
                to="/recruteur/gestion-offres"
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOffers.length > 0 ? (
                recentOffers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{offer.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{offer.location || 'Localisation non précisée'}</span>
                        <span className="text-sm text-gray-500">{offer.applications || 0} candidatures</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.isActive ? 'active' : 'pending')}`}>
                        {offer.isActive ? 'Active' : 'En attente'}
                      </span>
                      <Link 
                        to={`/recruteur/postulations-offres/${offer.id}`}
                        className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-briefcase text-4xl mb-4"></i>
                  <p>Aucune offre récente</p>
                  <Link to="/recruteur/creer-offre" className="text-fuchsia-600 hover:text-fuchsia-700 mt-2 inline-block">
                    Créer une offre
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-users mr-2 text-green-600"></i>
                Candidatures récentes
              </h2>
              <Link 
                to="/recruteur/candidatures"
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-fuchsia-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-fuchsia-600">
                          {application.candidateName ? application.candidateName.substring(0, 2).toUpperCase() : 'CA'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {application.candidateName || 'Candidat'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {application.offerTitle || 'Poste non précisé'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
                        {application.status === 'en_attente' ? 'Nouvelle' : 
                         application.status === 'examinée' ? 'Examinée' : 
                         application.status === 'entretien' ? 'Entretien' : 
                         application.status === 'refusée' ? 'Rejetée' : 
                         application.status === 'embauché' ? 'Embauché' : application.status}
                      </span>
                      <Link 
                        to={`/recruteur/candidatures/${application.id}`}
                        className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-users text-4xl mb-4"></i>
                  <p>Aucune candidature récente</p>
                  <p className="text-sm">Les candidatures apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-bolt mr-2 text-orange-600"></i>
            Actions rapides
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/recruteur/creer-offre"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-fuchsia-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-plus text-fuchsia-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Créer une offre</h3>
                <p className="text-sm text-gray-500">Publier une nouvelle offre</p>
              </div>
            </Link>
            
            <Link 
              to="/recruteur/creer-consultation"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-handshake text-blue-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Créer une consultation</h3>
                <p className="text-sm text-gray-500">Publier une consultation</p>
              </div>
            </Link>
            
            <Link 
              to="/recruteur/candidatures"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-users text-green-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Candidatures</h3>
                <p className="text-sm text-gray-500">Gérer les candidatures</p>
              </div>
            </Link>
            
            <Link 
              to="/recruteur/statistiques"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-purple-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Statistiques</h3>
                <p className="text-sm text-gray-500">Voir les performances</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 