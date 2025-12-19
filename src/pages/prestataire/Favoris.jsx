import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SavedOffersService from '../../services/SavedOffersService';

const Favoris = () => {
  const [savedOffers, setSavedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchSavedOffers();
  }, [page, activeTab]);

  const fetchSavedOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await SavedOffersService.getSavedOffersWithDetails(page);
      setSavedOffers(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
      setError('Impossible de charger vos favoris. Veuillez réessayer.');
      setSavedOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (savedOfferId) => {
    try {
      await SavedOffersService.removeSavedOffer(savedOfferId);
      setSavedOffers(savedOffers.filter(offer => offer.id !== savedOfferId));
      setTotalCount(totalCount - 1);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Impossible de supprimer cette offre. Veuillez réessayer.');
    }
  };

  const filteredOffers = activeTab === 'ALL' 
    ? savedOffers 
    : savedOffers.filter(offer => offer.offer_type === activeTab);

  const searchedOffers = filteredOffers.filter(offer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(offer.id).toLowerCase().includes(searchLower) ||
      offer.offer_type.toLowerCase().includes(searchLower) ||
      (offer.details?.title && offer.details.title.toLowerCase().includes(searchLower)) ||
      (offer.details?.position_name && offer.details.position_name.toLowerCase().includes(searchLower)) ||
      (offer.details?.description && offer.details.description.toLowerCase().includes(searchLower))
    );
  });

  const sortedOffers = [...searchedOffers].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.saved_at) - new Date(a.saved_at);
    }
    return 0;
  });

  const getOfferIcon = (offerType) => {
    switch (offerType) {
      case 'CONSULTATION':
        return 'fa-comments';
      default:
        return 'fa-star';
    }
  };

  const getOfferBgColor = (offerType) => {
    switch (offerType) {
      case 'CONSULTATION':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getOfferTextColor = (offerType) => {
    switch (offerType) {
      case 'CONSULTATION':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getOfferTypeLabel = (offerType) => {
    const labels = {
      'CONSULTATION': 'Consultation'
    };
    return labels[offerType] || offerType;
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Mes Favoris</h1>
            <p className="text-gray-600">
              {totalCount === 0 ? 'Vous n\'avez pas encore d\'offres favorites' : `${totalCount} offre${totalCount > 1 ? 's' : ''} sauvegardée${totalCount > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher dans vos favoris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="recent">Plus récents</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveTab('ALL'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({totalCount})
            </button>
            <button
              onClick={() => { setActiveTab('CONSULTATION'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'CONSULTATION'
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-comments"></i>
              Consultations
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="text-gray-600">Chargement des favoris...</span>
          </div>
        </div>
      )}

      {/* Favoris List */}
      <div className="space-y-4">
        {!loading && sortedOffers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-heart text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun favori trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Aucun favori ne correspond à votre recherche.' : 'Vous n\'avez pas encore ajouté d\'offres à vos favoris.'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Effacer la recherche
              </button>
            ) : (
              <Link
                to="/consultations"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <i className="fas fa-search mr-2"></i>
                Parcourir les offres
              </Link>
            )}
          </div>
        ) : (
          !loading && sortedOffers.map((offer) => {
            const details = offer.details;
            
            return (
              <div key={offer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 ${getOfferBgColor(offer.offer_type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <i className={`fas ${getOfferIcon(offer.offer_type)} ${getOfferTextColor(offer.offer_type)} text-lg`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Title and type */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {details?.title || details?.position_name || `Offre #${offer.offer_id.substring(0, 8)}`}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getOfferBgColor(offer.offer_type)} ${getOfferTextColor(offer.offer_type)}`}>
                              {getOfferTypeLabel(offer.offer_type)}
                            </span>
                          </div>
                          
                          {/* Description preview */}
                          {details?.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {details.description}
                            </p>
                          )}
                          
                          {/* Save date */}
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span>
                              <i className="fas fa-bookmark mr-1 text-gray-400"></i>
                              Sauvegardée le {new Date(offer.saved_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                            {details?.application_deadline && (
                              <span>
                                <i className="fas fa-calendar-alt mr-1 text-gray-400"></i>
                                Deadline: {new Date(details.application_deadline).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <Link
                        to={`/consultations/${offer.offer_id}`}
                        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-medium text-sm"
                      >
                        <i className="fas fa-eye mr-2"></i>
                        Voir détails
                      </Link>
                      <button
                        onClick={() => handleRemove(offer.id)}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-trash mr-2 text-red-500"></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && totalCount > 0 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <i className="fas fa-chevron-left mr-2"></i>Précédent
          </button>
          <span className="text-gray-600">
            Page {page}
          </span>
          <button
            disabled={page * 20 >= totalCount}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            Suivant<i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Favoris;