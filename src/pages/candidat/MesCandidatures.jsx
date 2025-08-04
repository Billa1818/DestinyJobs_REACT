import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const MesCandidatures = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchUserApplications();
  }, [user]);

  const fetchUserApplications = async () => {
    try {
      setLoading(true);
      const applicationsData = await dataService.getUserApplicationsByType(user.id, 'offer');
      setApplications(applicationsData);
    } catch (error) {
      setError('Erreur lors du chargement des candidatures');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
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

  const filteredApplications = applications.filter(application => {
    const matchesStatus = !filters.status || application.status === filters.status;
    const matchesSearch = !filters.search || 
      application.offerTitle?.toLowerCase().includes(filters.search.toLowerCase()) ||
      application.company?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mes candidatures</h1>
            <p className="text-gray-600">Suivez l'état de vos candidatures aux offres d'emploi</p>
          </div>
          <Link 
            to="/candidat/offres"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>Nouvelle candidature
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-file-alt text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-clock text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'en_attente').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user-tie text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Entretiens</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'entretien').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'acceptee').length}
              </p>
            </div>
          </div>
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
              placeholder="Titre du poste ou entreprise..."
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
            <i className="fas fa-list mr-2 text-fuchsia-600"></i>
            Candidatures ({filteredApplications.length})
          </h2>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-alt text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
            <p className="text-gray-600 mb-4">
              {applications.length === 0 
                ? "Vous n'avez pas encore postulé à des offres d'emploi."
                : "Aucune candidature ne correspond à vos critères de recherche."
              }
            </p>
            {applications.length === 0 && (
              <Link 
                to="/candidat/offres"
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
              >
                Découvrir les offres
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-briefcase text-fuchsia-600"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{application.offerTitle || 'Offre d\'emploi'}</h3>
                        <p className="text-sm text-gray-600">{application.company}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      <p className="mb-2">
                        <strong>Date de candidature :</strong> {new Date(application.appliedAt).toLocaleDateString('fr-FR')}
                      </p>
                      {application.expectedSalary && (
                        <p className="mb-2">
                          <strong>Salaire attendu :</strong> {application.expectedSalary.toLocaleString()} FCFA
                        </p>
                      )}
                      {application.availability && (
                        <p className="mb-2">
                          <strong>Disponibilité :</strong> {application.availability}
                        </p>
                      )}
                      {application.coverLetter && (
                        <p className="mb-2">
                          <strong>Lettre de motivation :</strong> {application.coverLetter.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/candidat/offres/${application.offerId}`}
                      className="px-3 py-1 text-sm text-fuchsia-600 hover:text-fuchsia-800 border border-fuchsia-300 rounded hover:bg-fuchsia-50 transition duration-200"
                    >
                      <i className="fas fa-eye mr-1"></i>Voir l'offre
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesCandidatures; 