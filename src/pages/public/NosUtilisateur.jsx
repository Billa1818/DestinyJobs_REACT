import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicUserSearchService from '../../services/PublicUserSearchService';
import { buildImageUrl } from '../../utils/urlHelper';

const NosUtilisateur = () => {
    // États pour les données
    const [users, setUsers] = useState([]);
    const [formattedUsers, setFormattedUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filtersApplied, setFiltersApplied] = useState({});

    // États pour l'interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [groupByType, setGroupByType] = useState(false);

    // États pour les filtres
    const [filters, setFilters] = useState(PublicUserSearchService.getDefaultFilters());

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // Charger les utilisateurs au montage du composant
    useEffect(() => {
        loadUsers();
    }, [currentPage, pageSize]);

    // Charger les utilisateurs depuis l'API
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const searchFilters = {
                ...filters,
                page: currentPage,
                page_size: pageSize
            };

            const response = await PublicUserSearchService.searchUsers(searchFilters);

            setUsers(response.results || []);
            setPagination(response.pagination || {});
            setFiltersApplied(response.filters_applied || {});

            // Formater les utilisateurs pour l'affichage
            const formatted = response.results?.map(user =>
                PublicUserSearchService.formatUserForDisplay(user)
            ).filter(user => user !== null) || [];

            setFormattedUsers(formatted);

            console.log('✅ Utilisateurs chargés:', formatted.length);

        } catch (error) {
            console.error('❌ Erreur lors du chargement des utilisateurs:', error);
            setError('Erreur lors du chargement des utilisateurs. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Appliquer les filtres
    const applyFilters = () => {
        setCurrentPage(1); // Retour à la première page
        loadUsers();
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        const defaultFilters = PublicUserSearchService.getDefaultFilters();
        setFilters(defaultFilters);
        setCurrentPage(1);
        setPageSize(20);
        // Charger avec les filtres par défaut
        setTimeout(() => loadUsers(), 100);
    };

    // Gérer le changement de page
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Gérer le changement de taille de page
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    // Gérer le changement de filtre
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Formater le nombre de résultats
    const formatResultsCount = () => {
        if (!pagination.total_count) return '0 résultat';
        if (pagination.total_count === 1) return '1 résultat';
        return `${pagination.total_count} résultats`;
    };

    // Rendu des filtres
    const renderFilters = () => (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    <i className="fas fa-filter mr-2 text-fuchsia-600"></i>
                    Filtres de recherche
                </h3>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                >
                    {showFilters ? 'Masquer' : 'Afficher'} les filtres
                </button>
            </div>

            {showFilters && (
                <div className="space-y-4">
                    {/* Première ligne de filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Type d'utilisateur */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type d'utilisateur
                            </label>
                            <select
                                value={filters.user_type}
                                onChange={(e) => handleFilterChange('user_type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            >
                                <option value="all">Tous les types</option>
                                <option value="CANDIDAT">Candidats</option>
                                <option value="PRESTATAIRE">Prestataires</option>
                                <option value="RECRUTEUR">Recruteurs</option>
                            </select>
                        </div>

                        {/* Recherche textuelle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recherche
                            </label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Nom, username, compétences..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>

                        {/* Compétences */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compétences
                            </label>
                            <input
                                type="text"
                                value={filters.skills}
                                onChange={(e) => handleFilterChange('skills', e.target.value)}
                                placeholder="Python, React, Marketing..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                    </div>

                    {/* Deuxième ligne de filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Expérience minimum */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expérience min (années)
                            </label>
                            <input
                                type="number"
                                value={filters.experience_min}
                                onChange={(e) => handleFilterChange('experience_min', e.target.value)}
                                placeholder="0"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>

                        {/* Expérience maximum */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expérience max (années)
                            </label>
                            <input
                                type="number"
                                value={filters.experience_max}
                                onChange={(e) => handleFilterChange('experience_max', e.target.value)}
                                placeholder="20"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>

                        {/* Disponibilité (pour prestataires) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Disponibilité
                            </label>
                            <select
                                value={filters.availability}
                                onChange={(e) => handleFilterChange('availability', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            >
                                <option value="">Toutes</option>
                                <option value="AVAILABLE">Disponible</option>
                                <option value="BUSY">Occupé</option>
                                <option value="UNAVAILABLE">Non disponible</option>
                            </select>
                        </div>

                        {/* Tarif horaire max (pour prestataires) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tarif max (FCFA/h)
                            </label>
                            <input
                                type="number"
                                value={filters.hourly_rate_max}
                                onChange={(e) => handleFilterChange('hourly_rate_max', e.target.value)}
                                placeholder="100"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                            />
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                        >
                            <i className="fas fa-undo mr-2"></i>
                            Réinitialiser
                        </button>

                        <button
                            onClick={applyFilters}
                            className="px-6 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
                        >
                            <i className="fas fa-search mr-2"></i>
                            Appliquer les filtres
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // Rendu de la pagination
    const renderPagination = () => {
        if (!pagination.total_pages || pagination.total_pages <= 1) return null;

        return (
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, pagination.total_count)} sur {pagination.total_count} résultats
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Sélecteur de taille de page */}
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                        <option value={10}>10 par page</option>
                        <option value={20}>20 par page</option>
                        <option value={50}>50 par page</option>
                    </select>

                    {/* Navigation des pages */}
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.has_previous}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.total_pages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= pagination.total_pages - 2) {
                                pageNum = pagination.total_pages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={`page-${i}-${pageNum}`}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum
                                        ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.has_next}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Obtenir l'URL de profil basée sur le type d'utilisateur et les données brutes
    const getProfileUrl = (user, rawUser) => {
        if (!rawUser) return `/profile/${user.id}`;

        const userType = rawUser.user_type;
        const userId = rawUser.profile?.user?.id;

        switch (userType) {
            case 'CANDIDAT':
                return userId ? `/profile/candidat/${userId}` : `/profile/${user.id}`;
            case 'PRESTATAIRE':
                return userId ? `/prestataire/profil-public/${userId}` : `/profile/${user.id}`;
            case 'RECRUTEUR':
                return userId ? `/entreprise/${userId}` : `/profile/${user.id}`;
            default:
                return `/profile/${user.id}`;
        }
    };

    // Modal pour afficher les détails d'un utilisateur
    const renderDetailModal = () => {
        if (!showDetailModal || !selectedUser) return null;

        const rawUser = users.find(u => {
            const userType = u.user_type;
            const userId = u.profile?.id;
            if (userType === 'PRESTATAIRE') return u.profile?.display_name === selectedUser.displayName;
            if (userType === 'CANDIDAT') return u.profile?.id === selectedUser.id;
            if (userType === 'RECRUTEUR') return u.profile?.id === selectedUser.id;
            return false;
        });

        const profileUrl = getProfileUrl(selectedUser, rawUser);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* En-tête du modal */}
                    <div className={`p-6 bg-gradient-to-r ${selectedUser.userType === 'CANDIDAT' ? 'from-blue-500 to-blue-600' :
                        selectedUser.userType === 'PRESTATAIRE' ? 'from-green-500 to-green-600' :
                            'from-orange-500 to-orange-600'
                        } text-white flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden`}>
                                {selectedUser.image ? (
                                    <img
                                        src={buildImageUrl(selectedUser.image)}
                                        alt={selectedUser.displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <i className={`${PublicUserSearchService.getUserTypeIcon(selectedUser.userType)} text-2xl`}></i>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{selectedUser.displayName}</h2>
                                <p className="text-white text-opacity-90">@{selectedUser.username}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="text-white hover:text-gray-200 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Contenu du modal */}
                    <div className="p-6 space-y-6">
                        {/* Informations de base */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600 font-medium">Type</p>
                                <p className="text-sm font-semibold mt-1">{selectedUser.userTypeDisplay}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600 font-medium">Localisation</p>
                                <p className="text-sm font-semibold mt-1">{selectedUser.location}</p>
                            </div>
                            {selectedUser.userType === 'PRESTATAIRE' && (
                                <>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-600 font-medium">Tarif/h</p>
                                        <p className="text-sm font-semibold mt-1 text-green-600">{selectedUser.hourlyRate}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-600 font-medium">Disponibilité</p>
                                        <p className={`text-sm font-semibold mt-1 ${selectedUser.availabilityColor}`}>{selectedUser.availability}</p>
                                    </div>
                                </>
                            )}
                            {selectedUser.userType === 'CANDIDAT' && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 font-medium">Expérience</p>
                                    <p className="text-sm font-semibold mt-1">{selectedUser.yearsExperience} ans</p>
                                </div>
                            )}
                            {selectedUser.userType === 'RECRUTEUR' && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 font-medium">Secteur</p>
                                    <p className="text-sm font-semibold mt-1">{selectedUser.sector}</p>
                                </div>
                            )}
                        </div>

                        {/* Détails spécifiques au type */}
                        {selectedUser.userType === 'PRESTATAIRE' && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Spécialisation</h3>
                                    <p className="text-gray-700">{selectedUser.specializations}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-600 font-medium">Expérience</p>
                                        <p className="text-lg font-bold text-blue-900 mt-1">{selectedUser.yearsExperience}</p>
                                        <p className="text-xs text-blue-700">années</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-green-600 font-medium">Projets</p>
                                        <p className="text-lg font-bold text-green-900 mt-1">{selectedUser.completedProjects}</p>
                                        <p className="text-xs text-green-700">complétés</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <p className="text-xs text-purple-600 font-medium">Type</p>
                                        <p className="text-lg font-bold text-purple-900 mt-1 capitalize">{selectedUser.providerType?.toLowerCase()}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedUser.userType === 'CANDIDAT' && (
                            <div className="space-y-4">
                                {selectedUser.about && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">À propos</h3>
                                        <p className="text-gray-700">{selectedUser.about}</p>
                                    </div>
                                )}
                                {selectedUser.skills && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Compétences</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {typeof selectedUser.skills === 'string'
                                                ? selectedUser.skills.split(',').map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                        {skill.trim()}
                                                    </span>
                                                ))
                                                : <span className="text-gray-600">Aucune compétence spécifiée</span>
                                            }
                                        </div>
                                    </div>
                                )}
                                {selectedUser.technologies && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Technologies</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {typeof selectedUser.technologies === 'string'
                                                ? selectedUser.technologies.split(',').map((tech, i) => (
                                                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                                        {tech.trim()}
                                                    </span>
                                                ))
                                                : <span className="text-gray-600">Aucune technologie spécifiée</span>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedUser.userType === 'RECRUTEUR' && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Entreprise</h3>
                                    <p className="text-gray-700 text-lg font-medium">{selectedUser.companyName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                        <p className="text-xs text-orange-600 font-medium">Secteur</p>
                                        <p className="text-sm font-semibold text-orange-900 mt-1">{selectedUser.sector}</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                        <p className="text-xs text-orange-600 font-medium">Taille</p>
                                        <p className="text-sm font-semibold text-orange-900 mt-1">{selectedUser.companySize || 'Non précisée'}</p>
                                    </div>
                                </div>
                                {selectedUser.website && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Site web</h3>
                                        <a href={selectedUser.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 break-all">
                                            {selectedUser.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dates */}
                        <div className="border-t border-gray-200 pt-4 text-xs text-gray-600">
                            <p>Membre depuis: {PublicUserSearchService.formatDate(selectedUser.createdAt)}</p>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                        >
                            Fermer
                        </button>
                        <Link
                            to={profileUrl}
                            className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition"
                        >
                            Voir le profil complet
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    // Rendu d'une carte utilisateur - Affichage linéaire
    const renderUserCard = (user) => (
        <div key={user.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Profil utilisateur */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden ${PublicUserSearchService.getUserTypeColor(user.userType)}`}>
                        {user.image ? (
                            <img
                                src={buildImageUrl(user.image)}
                                alt={user.displayName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <i className={`${PublicUserSearchService.getUserTypeIcon(user.userType)} text-xl`}></i>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{user.displayName}</h3>
                        <div className="flex items-center space-x-2 mt-1 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${PublicUserSearchService.getUserTypeColor(user.userType)} bg-opacity-10`}>
                                {user.userTypeDisplay}
                            </span>
                            {user.userType === 'PRESTATAIRE' && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.availabilityColor} bg-opacity-10`}>
                                    {user.availability}
                                </span>
                            )}
                            <span className="text-xs text-gray-500">
                                {user.location}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Informations principales */}
                <div className="hidden lg:flex items-center gap-6 flex-wrap">
                    {user.userType === 'PRESTATAIRE' && (
                        <>
                            <div className="text-center">
                                <span className="text-xs text-gray-600 block">Tarif/h</span>
                                <span className="font-medium text-green-600">{user.hourlyRate}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-xs text-gray-600 block">Expérience</span>
                                <span className="font-medium">{user.yearsExperience} ans</span>
                            </div>
                            <div className="text-center">
                                <span className="text-xs text-gray-600 block">Projets</span>
                                <span className="font-medium">{user.completedProjects}</span>
                            </div>
                        </>
                    )}

                    {user.userType === 'CANDIDAT' && (
                        <>
                            <div className="text-center">
                                <span className="text-xs text-gray-600 block">Expérience</span>
                                <span className="font-medium">{user.yearsExperience} ans</span>
                            </div>
                            {user.skills && (
                                <div className="text-center">
                                    <span className="text-xs text-gray-600 block">Compétences</span>
                                    <span className="font-medium text-sm">{typeof user.skills === 'string' ? user.skills.split(',')[0] : 'Voir profil'}</span>
                                </div>
                            )}
                        </>
                    )}

                    {user.userType === 'RECRUTEUR' && (
                        <>
                            <div className="text-center">
                                <span className="text-xs text-gray-600 block">Entreprise</span>
                                <span className="font-medium text-sm truncate">{user.companyName}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-xs text-gray-600 block">Secteur</span>
                                <span className="font-medium text-sm">{user.sector}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                        }}
                        className="px-4 py-2 border border-fuchsia-600 text-fuchsia-600 rounded-md hover:bg-fuchsia-50 transition duration-200 text-sm font-medium whitespace-nowrap"
                    >
                        <i className="fas fa-info-circle mr-1"></i>
                        Plus d'info
                    </button>

                    <Link
                        to={getProfileUrl(user, users.find(u => {
                            const userType = u.user_type;
                            if (userType === 'PRESTATAIRE') return u.profile?.display_name === user.displayName;
                            if (userType === 'CANDIDAT') return u.profile?.id === user.id;
                            if (userType === 'RECRUTEUR') return u.profile?.id === user.id;
                            return false;
                        }))}
                        className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200 text-sm font-medium whitespace-nowrap"
                    >
                        <i className="fas fa-eye mr-1"></i>
                        Profil
                    </Link>

                    {user.userType === 'PRESTATAIRE' && (
                        <Link
                            to={`/consultations?provider=${user.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium whitespace-nowrap"
                        >
                            <i className="fas fa-handshake mr-1"></i>
                            Contacter
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    // Grouper les utilisateurs par type
    const groupedUsers = () => {
        const groups = {
            CANDIDAT: [],
            PRESTATAIRE: [],
            RECRUTEUR: []
        };

        formattedUsers.forEach(user => {
            if (groups[user.userType]) {
                groups[user.userType].push(user);
            }
        });

        return groups;
    };

    // Rendu d'une section de type d'utilisateur
    const renderUserTypeSection = (type, users) => {
        if (users.length === 0) return null;

        const getTypeConfig = (type) => {
            switch (type) {
                case 'CANDIDAT':
                    return {
                        icon: 'fas fa-user-graduate',
                        bgColor: 'bg-blue-50',
                        borderStyle: 'border-l-4 border-blue-600',
                        titleColor: 'text-blue-900',
                        iconColor: 'text-blue-600',
                        textColor: 'text-blue-700',
                        title: 'Candidats',
                        description: 'Découvrez les talents en recherche d\'opportunités'
                    };
                case 'PRESTATAIRE':
                    return {
                        icon: 'fas fa-user-cog',
                        bgColor: 'bg-green-50',
                        borderStyle: 'border-l-4 border-green-600',
                        titleColor: 'text-green-900',
                        iconColor: 'text-green-600',
                        textColor: 'text-green-700',
                        title: 'Prestataires',
                        description: 'Trouvez des experts pour vos projets'
                    };
                case 'RECRUTEUR':
                    return {
                        icon: 'fas fa-user-tie',
                        bgColor: 'bg-orange-50',
                        borderStyle: 'border-l-4 border-orange-600',
                        titleColor: 'text-orange-900',
                        iconColor: 'text-orange-600',
                        textColor: 'text-orange-700',
                        title: 'Recruteurs',
                        description: 'Connectez-vous avec les recruteurs'
                    };
                default:
                    return null;
            }
        };

        const config = getTypeConfig(type);
        if (!config) return null;

        return (
            <div key={type} className="mb-8">
                <div className={`${config.bgColor} ${config.borderStyle} p-4 mb-4 rounded-r-lg`}>
                    <h2 className={`text-xl font-bold ${config.titleColor} flex items-center gap-2`}>
                        <i className={`${config.icon} ${config.iconColor}`}></i>
                        {config.title} ({users.length})
                    </h2>
                    <p className={`${config.textColor} text-sm mt-1`}>
                        {config.description}
                    </p>
                </div>
                <div className="space-y-4">
                    {users.map((user, index) => (
                        <div key={`${type}-${user.id}-${index}`}>
                            {renderUserCard(user)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Découvrez nos utilisateurs
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explorez notre communauté de professionnels, candidats et recruteurs.
                        Trouvez les talents qui correspondent à vos besoins ou découvrez de nouvelles opportunités.
                    </p>
                </div>

                {/* Filtres */}
                {renderFilters()}

                {/* Statistiques et actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="text-sm text-gray-600">
                        {loading ? 'Chargement...' : formatResultsCount()}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                            <span className="text-sm font-medium text-gray-700">Grouper par type:</span>
                            <button
                                onClick={() => setGroupByType(!groupByType)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${groupByType ? 'bg-fuchsia-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${groupByType ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="text-fuchsia-600 hover:text-fuchsia-800 font-medium whitespace-nowrap"
                        >
                            <i className="fas fa-filter mr-2"></i>
                            {showFilters ? 'Masquer' : 'Afficher'} les filtres
                        </button>
                    </div>
                </div>

                {/* Contenu principal */}
                {loading ? (
                    // Affichage de chargement
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6).fill(null).map((_, index) => (
                            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="animate-pulse">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Affichage d'erreur
                    <div className="text-center py-12">
                        <div className="text-red-500 text-6xl mb-4">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Erreur lors du chargement
                        </h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={loadUsers}
                            className="px-6 py-3 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
                        >
                            <i className="fas fa-redo mr-2"></i>
                            Réessayer
                        </button>
                    </div>
                ) : formattedUsers.length === 0 ? (
                    // Aucun résultat
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">
                            <i className="fas fa-search"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Aucun utilisateur trouvé
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-3 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
                        >
                            <i className="fas fa-undo mr-2"></i>
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    // Liste des utilisateurs
                    <>
                        {groupByType ? (
                            // Affichage groupé par type
                            <>
                                {renderUserTypeSection('CANDIDAT', groupedUsers().CANDIDAT)}
                                {renderUserTypeSection('PRESTATAIRE', groupedUsers().PRESTATAIRE)}
                                {renderUserTypeSection('RECRUTEUR', groupedUsers().RECRUTEUR)}

                                {/* Pagination */}
                                {renderPagination()}
                            </>
                        ) : (
                            // Affichage en liste
                            <>
                                <div className="space-y-4 mb-8">
                                    {formattedUsers.map((user, index) => (
                                        <div key={`user-${user.id}-${index}`}>
                                            {renderUserCard(user)}
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {renderPagination()}
                            </>
                        )}
                    </>
                )}

                {/* Modal de détails */}
                {renderDetailModal()}
            </div>
        </div>
    );
};

export default NosUtilisateur;
