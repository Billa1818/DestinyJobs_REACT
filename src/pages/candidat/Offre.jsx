import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const Offre = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: ''
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const offersData = await dataService.getOffers({ isActive: true });
      setOffers(offersData);
    } catch (error) {
      setError('Erreur lors du chargement des offres');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = !filters.search || 
      offer.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      offer.company.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesLocation = !filters.location || 
      offer.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesType = !filters.type || offer.type === filters.type;
    
    const matchesExperience = !filters.experience || offer.experience === filters.experience;

    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Offres d'emploi</h1>
            <p className="text-gray-600">Découvrez les meilleures opportunités de carrière</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/candidat/candidatures-recentes"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-list mr-2"></i>Mes candidatures
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              placeholder="Titre ou entreprise..."
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <input
              type="text"
              id="location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ville ou région..."
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type de contrat
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="Temps plein">Temps plein</option>
              <option value="Temps partiel">Temps partiel</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
              Expérience
            </label>
            <select
              id="experience"
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous niveaux</option>
              <option value="Débutant">Débutant</option>
              <option value="1-2 ans">1-2 ans</option>
              <option value="3-5 ans">3-5 ans</option>
              <option value="5-7 ans">5-7 ans</option>
              <option value="7+ ans">7+ ans</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setFilters({ search: '', location: '', type: '', experience: '' })}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
            Offres disponibles ({filteredOffers.length})
          </h2>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-600 mb-4">
              {offers.length === 0 
                ? "Aucune offre d'emploi disponible pour le moment."
                : "Aucune offre ne correspond à vos critères de recherche."
              }
            </p>
            <button
              onClick={() => setFilters({ search: '', location: '', type: '', experience: '' })}
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              Voir toutes les offres
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="p-6 hover:bg-gray-50 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-briefcase text-fuchsia-600 text-xl"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-fuchsia-600">
                            <Link to={`/candidat/offres/${offer.id}`}>
                              {offer.title}
                            </Link>
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Actif
                          </span>
                        </div>
                        <p className="text-fuchsia-600 font-medium mb-2">{offer.company}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
                            <span>{offer.location}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
                            <span>{offer.type}</span>
                          </div>
                          {offer.salary && (
                            <div className="flex items-center">
                              <i className="fas fa-money-bill-wave mr-2 text-fuchsia-600"></i>
                              <span>{offer.salary}</span>
                            </div>
                          )}
                          {offer.experience && (
                            <div className="flex items-center">
                              <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
                              <span>{offer.experience}</span>
                            </div>
                          )}
                        </div>

                        {offer.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {offer.description.substring(0, 150)}...
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              <i className="fas fa-calendar mr-1"></i>
                              Publié le {formatDate(offer.createdAt)}
                            </span>
                            <span>
                              <i className="fas fa-users mr-1"></i>
                              {offer.applications || 0} candidature(s)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                                         <Link
                       to={`/candidat/offres/${offer.id}`}
                       className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm font-medium"
                     >
                       <i className="fas fa-eye mr-2"></i>Voir détails
                     </Link>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOffers.length > 0 && (
        <div className="mt-6 flex items-center justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
              <i className="fas fa-chevron-left mr-1"></i>Précédent
            </button>
            <button className="px-3 py-2 bg-fuchsia-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50">
              Suivant <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Offre;