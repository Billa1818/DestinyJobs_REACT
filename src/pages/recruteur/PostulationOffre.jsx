import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const PostulationOffre = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchOffersWithApplications();
  }, [user]);

  const fetchOffersWithApplications = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les offres du recruteur
      const offersData = await dataService.getOffersByRecruiter(user.id);
      
      // Pour chaque offre, récupérer les candidatures
      const offersWithApplications = await Promise.all(
        offersData.map(async (offer) => {
          const applications = await dataService.getApplicationsByOfferId(offer.id);
          return {
            ...offer,
            applications: applications || []
          };
        })
      );
      
      setOffers(offersWithApplications);
    } catch (error) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await dataService.updateApplicationStatus(applicationId, newStatus);
      setOffers(offers.map(offer => ({
        ...offer,
        applications: offer.applications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      })));
    } catch (error) {
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'text-yellow-600 bg-yellow-100';
      case 'examinee': return 'text-blue-600 bg-blue-100';
      case 'entretien': return 'text-purple-600 bg-purple-100';
      case 'acceptee': return 'text-green-600 bg-green-100';
      case 'refusee': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'examinee': return 'Examinée';
      case 'entretien': return 'Entretien';
      case 'acceptee': return 'Acceptée';
      case 'refusee': return 'Refusée';
      default: return 'Inconnu';
    }
  };

  const filteredApplications = offers.flatMap(offer => 
    offer.applications.filter(application => {
      const matchesStatus = !filters.status || application.status === filters.status;
      const matchesSearch = !filters.search || 
        application.candidateName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        application.email?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesSearch;
    })
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune offre trouvée</h2>
        <p className="text-gray-600 mb-4">Vous n'avez pas encore créé d'offres.</p>
        <Link 
          to="/recruteur/gestion-offres"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Créer une offre
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Candidatures reçues</h1>
            <p className="text-gray-600">Vue d'ensemble des candidatures reçues pour vos offres.</p>
          </div>
          <Link 
            to="/recruteur/gestion-offres"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i>Retour aux offres
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Offer Details */}
      {offers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vue d'ensemble des offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Nombre d'offres</span>
              <p className="text-gray-900">{offers.length}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Total candidatures</span>
              <p className="text-gray-900">{offers.reduce((sum, offer) => sum + offer.applications.length, 0)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Candidatures moyennes</span>
              <p className="text-gray-900">
                {offers.length > 0 
                  ? Math.round(offers.reduce((sum, offer) => sum + offer.applications.length, 0) / offers.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {offers.reduce((sum, offer) => sum + offer.applications.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {offers.reduce((sum, offer) => sum + offer.applications.filter(app => app.status === 'en_attente').length, 0)}
          </div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {offers.reduce((sum, offer) => sum + offer.applications.filter(app => app.status === 'examinee').length, 0)}
          </div>
          <div className="text-sm text-gray-600">Examinées</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {offers.reduce((sum, offer) => sum + offer.applications.filter(app => app.status === 'entretien').length, 0)}
          </div>
          <div className="text-sm text-gray-600">Entretiens</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {offers.reduce((sum, offer) => sum + offer.applications.filter(app => app.status === 'acceptee').length, 0)}
          </div>
          <div className="text-sm text-gray-600">Acceptées</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Nom ou email du candidat..."
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="examinee">Examinée</option>
              <option value="entretien">Entretien</option>
              <option value="acceptee">Acceptée</option>
              <option value="refusee">Refusée</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', search: '' })}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-users mr-2 text-fuchsia-600"></i>
            Candidatures ({filteredApplications.length})
          </h2>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
            <p className="text-gray-600">
              {offers.reduce((sum, offer) => sum + offer.applications.length, 0) === 0 
                ? "Aucune candidature reçue pour vos offres."
                : "Aucune candidature ne correspond à vos critères de recherche."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => {
              // Trouver l'offre correspondante
              const offer = offers.find(offer => 
                offer.applications.some(app => app.id === application.id)
              );
              
              return (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center">
                          <span className="text-fuchsia-600 font-semibold text-lg">
                            {application.candidateName?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.candidateName || 'Candidat'}
                          </h3>
                          <p className="text-gray-600">{application.email}</p>
                          {offer && (
                            <p className="text-sm text-gray-500 mt-1">
                              <i className="fas fa-briefcase mr-1"></i>
                              {offer.title}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <i className="fas fa-calendar mr-2 text-fuchsia-600"></i>
                          <span>Postulé le {formatDate(application.appliedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-file-alt mr-2 text-fuchsia-600"></i>
                          <span>Lettre de motivation</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-download mr-2 text-fuchsia-600"></i>
                          <span>CV disponible</span>
                        </div>
                      </div>

                      {application.coverLetter && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-3">
                          <h4 className="font-medium text-gray-900 mb-2">Lettre de motivation</h4>
                          <p className="text-gray-700 text-sm line-clamp-3">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(application.id, 'examinee')}
                          className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                            application.status === 'examinee'
                              ? 'text-blue-600 border-blue-300 bg-blue-50'
                              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <i className="fas fa-eye mr-1"></i>Examiner
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(application.id, 'entretien')}
                          className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                            application.status === 'entretien'
                              ? 'text-purple-600 border-purple-300 bg-purple-50'
                              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <i className="fas fa-calendar-check mr-1"></i>Entretien
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(application.id, 'acceptee')}
                          className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                            application.status === 'acceptee'
                              ? 'text-green-600 border-green-300 bg-green-50'
                              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <i className="fas fa-check mr-1"></i>Accepter
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(application.id, 'refusee')}
                          className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                            application.status === 'refusee'
                              ? 'text-red-600 border-red-300 bg-red-50'
                              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <i className="fas fa-times mr-1"></i>Refuser
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition duration-200">
                          <i className="fas fa-envelope mr-1"></i>Contacter
                        </button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition duration-200">
                          <i className="fas fa-eye mr-1"></i>Voir profil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostulationOffre;