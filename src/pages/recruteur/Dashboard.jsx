import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardService from '../../services/DashboardService';
import RecruteurNotificationService from '../../services/RecruteurNotificationService';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formatage des dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Charger les notifications récentes
  const loadRecentNotifications = async () => {
    try {
      console.log('🔔 Chargement des notifications récentes pour le dashboard...');
      const response = await RecruteurNotificationService.getNotifications({}, 1, 5); // 5 dernières notifications
      
      console.log('✅ Notifications récentes reçues:', response);
      
      // Adapter la structure de réponse selon la nouvelle API
      const notificationsData = response.notifications || response.results || [];
      setNotifications(notificationsData);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notifications récentes:', error);
      setNotifications([]);
    }
  };

  // Charger le dashboard complet
  const loadDashboard = async () => {
    try {
      setLoading(true);
      console.log('🚀 Chargement du tableau de bord complet...');
      
      const data = await DashboardService.getDashboardData();
      console.log('✅ Tableau de bord chargé avec succès:', data);
      
      setDashboardData(data);
      
      // Charger les notifications séparément avec le service dédié
      await loadRecentNotifications();
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement du tableau de bord:', error);
      setError('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboard();
  }, []);

  // Formatage des nombres
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('fr-FR');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-xl font-semibold mb-2">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Erreur
        </div>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-600 text-xl font-semibold">
          <i className="fas fa-info-circle mr-2"></i>
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  // Extraire les données du dashboard
  const { 
    applicationStats, 
    jobOffers, 
    fundingOffers, 
    consultationOffers, 
    scholarships, 
    recentApplications
  } = dashboardData;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Vue d'ensemble de vos activités de recrutement</p>
        </div>



        {/* Statistiques des Candidatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <i className="fas fa-users text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Candidatures</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(applicationStats?.total_applications || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <i className="fas fa-clock text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(applicationStats?.pending_applications || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <i className="fas fa-check-circle text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Présélectionnés</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(applicationStats?.shortlisted_applications || 0)}
                </p>
              </div>
            </div>
          </div>



          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <i className="fas fa-times-circle text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refusées</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatNumber(applicationStats?.rejected_applications || 0)}
                </p>
              </div>
            </div>
          </div>


        </div>


        {/* Mes Offres */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Offres d'Emploi */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mes Offres d'Emploi</h2>
              <Link to="/recruteur/gestion-offre" className="text-orange-600 hover:text-orange-700 text-sm">
                Voir tout
              </Link>
            </div>
            {jobOffers?.results && jobOffers.results.length > 0 ? (
              <div className="space-y-4">
                {jobOffers.results.slice(0, 2).map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{offer.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="inline-flex items-center">
                            <i className="fas fa-id-badge mr-1"></i>{offer.contract_type}
                          </span>
                          <span className="inline-flex items-center">
                            <i className="fas fa-briefcase mr-1"></i>{offer.work_mode}
                          </span>
                          {offer.location && (
                            <span className="inline-flex items-center">
                              <i className="fas fa-map-marker-alt mr-1"></i>{offer.location}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="inline-flex items-center">
                            <i className="fas fa-money-bill-wave mr-1"></i>{offer.salary_range}
                          </span>
                          {typeof offer.days_until_closing === 'number' && (
                            <span className="inline-flex items-center">
                              <i className="fas fa-hourglass-half mr-1"></i>{offer.days_until_closing} j
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-600 whitespace-nowrap">
                          <i className="fas fa-user-check mr-1"></i>{formatNumber(offer.applications_count || 0)}
                          <span className="mx-2">·</span>
                          <i className="fas fa-eye mr-1"></i>{formatNumber(offer.views_count || 0)}
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            offer.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            offer.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <Link to={`/recruteur/postulations-offres?offre=${offer.id}`} className="text-orange-600 hover:text-orange-700">Candidatures</Link>
                      <Link to={`/public/detail-offre/${offer.id}`} className="text-gray-600 hover:text-gray-800">Voir</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune offre d'emploi créée</p>
            )}
          </div>

          {/* Offres de Consultation */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mes Consultations</h2>
              <Link to="/recruteur/gestion-consultation" className="text-orange-600 hover:text-orange-700 text-sm">
                Voir tout
              </Link>
            </div>
            {consultationOffers?.results && consultationOffers.results.length > 0 ? (
              <div className="space-y-4">
                {consultationOffers.results.slice(0, 2).map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{offer.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="inline-flex items-center">
                            <i className="fas fa-search mr-1"></i>{offer.consultation_type?.name || 'Consultation'}
                          </span>
                          <span className="inline-flex items-center">
                            <i className="fas fa-clock mr-1"></i>{offer.estimated_duration} j
                          </span>
                          {offer.delivery_mode && (
                            <span className="inline-flex items-center">
                              <i className="fas fa-globe mr-1"></i>{offer.delivery_mode}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="inline-flex items-center">
                            <i className="fas fa-money-bill-wave mr-1"></i>{offer.pricing_type} - {offer.price} FCFA
                          </span>
                          {offer.end_date && (
                            <span className="inline-flex items-center">
                              <i className="fas fa-calendar-times mr-1"></i>Fin: {formatDate(offer.end_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-600 whitespace-nowrap">
                          <i className="fas fa-user-check mr-1"></i>{formatNumber(offer.applications_count || 0)}
                          <span className="mx-2">·</span>
                          <i className="fas fa-eye mr-1"></i>{formatNumber(offer.views_count || 0)}
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            offer.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            offer.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <Link to={`/recruteur/postulations-consultations?consultation=${offer.id}`} className="text-orange-600 hover:text-orange-700">Candidatures</Link>
                      <Link to={`/public/detail-consultation/${offer.id}`} className="text-gray-600 hover:text-gray-800">Voir</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune consultation créée</p>
            )}
          </div>

          {/* Offres de Financement */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mes Financements</h2>
              <Link to="/recruteur/gestion-financement" className="text-orange-600 hover:text-orange-700 text-sm">
                Voir tout
              </Link>
            </div>
            {fundingOffers?.results && fundingOffers.results.length > 0 ? (
              <div className="space-y-4">
                {fundingOffers.results.slice(0, 2).map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{offer.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="inline-flex items-center">
                            <i className="fas fa-chart-line mr-1"></i>{offer.sector?.name || 'Secteur'}
                          </span>
                          <span className="inline-flex items-center">
                            <i className="fas fa-target mr-1"></i>{offer.target?.name || 'Cible'}
                          </span>
                          {offer.geographic_zone && (
                            <span className="inline-flex items-center">
                              <i className="fas fa-map mr-1"></i>{offer.geographic_zone}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span className="inline-flex items-center">
                            <i className="fas fa-money-bill-wave mr-1"></i>{offer.min_amount} - {offer.max_amount} FCFA
                          </span>
                          {offer.application_deadline && (
                            <span className="inline-flex items-center">
                              <i className="fas fa-calendar-times mr-1"></i>Fin: {formatDate(offer.application_deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-600 whitespace-nowrap">
                          <i className="fas fa-user-check mr-1"></i>{formatNumber(offer.applications_count || 0)}
                          <span className="mx-2">·</span>
                          <i className="fas fa-eye mr-1"></i>{formatNumber(offer.views_count || 0)}
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            offer.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            offer.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <Link to={`/recruteur/postulations-financements?financement=${offer.id}`} className="text-orange-600 hover:text-orange-700">Candidatures</Link>
                      <Link to={`/public/detail-financement/${offer.id}`} className="text-gray-600 hover:text-gray-800">Voir</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun financement créé</p>
            )}
          </div>
        </div>
        {/* Notifications Récentes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Notifications Récentes</h2>
            <Link to="/recruteur/notifications" className="text-orange-600 hover:text-orange-700 text-sm">
              Voir tout
            </Link>
          </div>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const meta = notification.metadata || {};
                const metaEntries = Object.entries(meta).slice(0, 2);
                const priorityClass = notification.priority === 'HIGH'
                  ? 'bg-red-100 text-red-800'
                  : notification.priority === 'URGENT'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800';
                
                // Fonction pour marquer comme lu
                const handleMarkAsRead = async (id) => {
                  try {
                    await RecruteurNotificationService.markAsRead([id]);
                    // Mettre à jour l'état local
                    setNotifications(notifications.map(n => 
                      n.id === id ? { ...n, is_read: true } : n
                    ));
                  } catch (error) {
                    console.error('Erreur lors du marquage comme lu:', error);
                  }
                };
                
                return (
                  <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                    notification.is_read ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="pr-4 flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {notification.notification_type_display || notification.notification_type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${priorityClass}`}>
                            {notification.priority_display || notification.priority}
                          </span>
                          {notification.delivery_method_display && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {notification.delivery_method_display}
                            </span>
                          )}
                          {notification.is_read ? (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Lu
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Non lu
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right whitespace-nowrap text-xs text-gray-500">
                          {notification.time_since_created || formatDate(notification.created_at)}
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                            title="Marquer comme lu"
                          >
                            <i className="fas fa-check mr-1"></i>Marquer lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucune notification</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 