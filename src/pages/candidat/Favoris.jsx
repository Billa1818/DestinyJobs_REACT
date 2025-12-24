import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import SavedOffersService from '../../services/SavedOffersService';

const Favoris = () => {
    const [savedOffers, setSavedOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchSavedOffers();
    }, [page, filterType]);

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

    const filteredOffers = filterType === 'ALL'
        ? savedOffers
        : savedOffers.filter(offer => offer.offer_type === filterType);

    const getOfferIcon = (offerType) => {
        switch (offerType) {
            case 'JOB':
                return 'fa-briefcase';
            case 'CONSULTATION':
                return 'fa-comments';
            case 'FUNDING':
                return 'fa-money-bill-wave';
            case 'SCHOLARSHIP':
                return 'fa-graduation-cap';
            default:
                return 'fa-star';
        }
    };

    const getOfferBgColor = (offerType) => {
        switch (offerType) {
            case 'JOB':
                return 'bg-fuchsia-100';
            case 'CONSULTATION':
                return 'bg-blue-100';
            case 'FUNDING':
                return 'bg-green-100';
            case 'SCHOLARSHIP':
                return 'bg-purple-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getOfferTextColor = (offerType) => {
        switch (offerType) {
            case 'JOB':
                return 'text-fuchsia-600';
            case 'CONSULTATION':
                return 'text-blue-600';
            case 'FUNDING':
                return 'text-green-600';
            case 'SCHOLARSHIP':
                return 'text-purple-600';
            default:
                return 'text-gray-600';
        }
    };

    const getOfferTypeLabel = (offerType) => {
        const labels = {
            'JOB': 'Emploi',
            'FUNDING': 'Financement',
            'SCHOLARSHIP': 'Bourse'
        };
        return labels[offerType] || offerType;
    };

    // Nouvelle fonction pour obtenir le lien de détail selon le type d'offre
    const getOfferDetailLink = (offerId, offerType) => {
        switch (offerType) {
            case 'JOB':
                return `/jobs/${offerId}`;
            case 'FUNDING':
                return `/financements/${offerId}`;
            case 'SCHOLARSHIP':
                return `/bourses/${offerId}`;
            default:
                return `/candidat/detail-offre?id=${offerId}&type=${offerType}`;
        }
    };

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Favoris</h1>
                <p className="text-gray-600">
                    {totalCount === 0 ? 'Vous n\'avez pas encore d\'offres favorites' : `${totalCount} offre${totalCount > 1 ? 's' : ''} sauvegardée${totalCount > 1 ? 's' : ''}`}
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => { setFilterType('ALL'); setPage(1); }}
                    className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${filterType === 'ALL'
                            ? 'bg-fuchsia-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-fuchsia-600'
                        }`}
                >
                    Tous ({totalCount})
                </button>
                {['JOB', 'FUNDING', 'SCHOLARSHIP'].map(type => (
                    <button
                        key={type}
                        onClick={() => { setFilterType(type); setPage(1); }}
                        className={`px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${filterType === type
                                ? 'bg-fuchsia-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-fuchsia-600'
                            }`}
                    >
                        <i className={`fas ${getOfferIcon(type)}`}></i>
                        {getOfferTypeLabel(type)}
                    </button>
                ))}
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
                <div className="py-12">
                    <LoadingSpinner variant="inline" size="lg" text="Chargement de vos favoris..." />
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredOffers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <i className="fas fa-heart text-gray-300 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Aucune offre favorite</h2>
                    <p className="text-gray-600 mb-6">
                        Vous n'avez pas encore sauvegardé d'offre de ce type
                    </p>
                    <Link
                        to="/jobs"
                        className="inline-block bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200"
                    >
                        <i className="fas fa-search mr-2"></i>Découvrir des offres
                    </Link>
                </div>
            )}

            {/* Saved Offers List */}
            {!loading && filteredOffers.length > 0 && (
                <div className="space-y-4">
                    {filteredOffers.map(offer => {
                        const details = offer.details;

                        return (
                            <div
                                key={offer.id}
                                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Header with icon and type */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-14 h-14 ${getOfferBgColor(offer.offer_type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <i className={`fas ${getOfferIcon(offer.offer_type)} ${getOfferTextColor(offer.offer_type)} text-lg`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {/* Title and type badge */}
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {details?.title || details?.position_name || `Offre #${offer.offer_id.substring(0, 8)}`}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getOfferBgColor(offer.offer_type)} ${getOfferTextColor(offer.offer_type)}`}>
                                                        {getOfferTypeLabel(offer.offer_type)}
                                                    </span>
                                                </div>

                                                {/* Company and location info - only for non-JOB offers */}
                                                {details && offer.offer_type !== 'JOB' && (
                                                  <div className="space-y-2 mb-3">
                                                    {details.recruiter?.company_name && (
                                                      <p className="text-sm text-gray-700 flex items-center gap-2">
                                                        <i className="fas fa-building text-gray-400 w-4"></i>
                                                        <span className="font-medium">{details.recruiter.company_name}</span>
                                                      </p>
                                                    )}
                                                    {details.location && (
                                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <i className="fas fa-map-marker-alt text-gray-400 w-4"></i>
                                                        {details.location}
                                                      </p>
                                                    )}
                                                    {details.contract_type && (
                                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <i className="fas fa-file-contract text-gray-400 w-4"></i>
                                                        {details.contract_type}
                                                      </p>
                                                    )}
                                                    {details.salary_min && (
                                                      <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                                                        <i className="fas fa-money-bill-wave text-green-400 w-4"></i>
                                                        {details.salary_min.toLocaleString()} - {details.salary_max?.toLocaleString() || 'N/A'} FCFA
                                                      </p>
                                                    )}
                                                    {details.work_mode && (
                                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                                        <i className="fas fa-laptop-house text-gray-400 w-4"></i>
                                                        {details.work_mode}
                                                      </p>
                                                    )}
                                                  </div>
                                                )}

                                                {/* Description preview */}
                                                {details?.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                        {details.description}
                                                    </p>
                                                )}

                                                {/* Dates and stats */}
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

                                        {/* Priority badges - only for non-JOB offers */}
                                        {details && offer.offer_type !== 'JOB' && (
                                          <div className="flex flex-wrap gap-2 mt-3">
                                            {details.is_urgent && (
                                              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                                                <i className="fas fa-exclamation-triangle mr-1"></i>Urgent
                                              </span>
                                            )}
                                            {details.is_sponsored && (
                                              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                                <i className="fas fa-star mr-1"></i>Sponsorisée
                                              </span>
                                            )}
                                          </div>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        <Link
                                            to={getOfferDetailLink(offer.offer_id, offer.offer_type)}
                                            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-fuchsia-700 transition duration-200 whitespace-nowrap text-center"
                                        >
                                            Voir l'offre
                                        </Link>
                                        <button
                                            onClick={() => handleRemove(offer.id)}
                                            className="text-red-500 hover:text-red-700 transition duration-200 px-3 py-2 hover:bg-red-50 rounded-lg text-sm font-medium"
                                            title="Supprimer des favoris"
                                        >
                                            <i className="fas fa-trash mr-1"></i>Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
        </main>
    );
};

export default Favoris;