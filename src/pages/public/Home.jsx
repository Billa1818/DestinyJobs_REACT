import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import jobService from '../../services/jobService';
import consultationService from '../../services/consultationService';
import financementService from '../../services/financementService';
import bourseService from '../../services/bourseService';
import blogService from '../../services/blogService';
import HomeStatService from '../../services/HomeStatService';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

const Home = () => {
    const { isAuthenticated } = useAuth();

    // États pour les données dynamiques
    const [latestJobs, setLatestJobs] = useState([]);
    const [latestConsultations, setLatestConsultations] = useState([]);
    const [latestFinancements, setLatestFinancements] = useState([]);
    const [latestBourses, setLatestBourses] = useState([]);
    const [latestBlogPosts, setLatestBlogPosts] = useState([]);

    // États pour les statistiques publiques
    const [publicStats, setPublicStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [errorStats, setErrorStats] = useState(null);

    // États de chargement
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingConsultations, setLoadingConsultations] = useState(true);
    const [loadingFinancements, setLoadingFinancements] = useState(true);
    const [loadingBourses, setLoadingBourses] = useState(true);
    const [loadingBlog, setLoadingBlog] = useState(true);

    // États d'erreur
    const [errorJobs, setErrorJobs] = useState(null);
    const [errorConsultations, setErrorConsultations] = useState(null);
    const [errorFinancements, setErrorFinancements] = useState(null);
    const [errorBourses, setErrorBourses] = useState(null);
    const [errorBlog, setErrorBlog] = useState(null);

    // Récupérer les 3 dernières offres d'emploi
    const fetchLatestJobs = async () => {
        try {
            setLoadingJobs(true);
            setErrorJobs(null);

            const response = await jobService.getPublicJobOffers();
            const jobs = response.results || response || [];

            // Prendre les 3 plus récents avec statut PUBLISHED ou Approved
            const sortedJobs = jobs
                .filter(job => (job.status === 'PUBLISHED' || job.status === 'Approved') && !job.is_expired)
                .sort((a, b) => new Date(b.post_date || b.created_at) - new Date(a.post_date || a.created_at))
                .slice(0, 3);

            setLatestJobs(sortedJobs);
            console.log('✅ 3 dernières offres d\'emploi récupérées:', sortedJobs);

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des offres d\'emploi:', error);
            setErrorJobs('Impossible de charger les offres d\'emploi');
        } finally {
            setLoadingJobs(false);
        }
    };

    // Récupérer les 3 dernières consultations
    const fetchLatestConsultations = async () => {
        try {
            setLoadingConsultations(true);
            setErrorConsultations(null);

            const response = await consultationService.getPublicConsultationOffers();
            const consultations = response.results || response || [];

            // Prendre les 3 plus récents avec statut PUBLISHED ou Approved
            const sortedConsultations = consultations
                .filter(consultation => (consultation.status === 'PUBLISHED' || consultation.status === 'Approved') && !consultation.is_expired)
                .sort((a, b) => new Date(b.created_at || b.post_date) - new Date(a.created_at || a.post_date))
                .slice(0, 3);

            setLatestConsultations(sortedConsultations);
            console.log('✅ 3 dernières consultations récupérées:', sortedConsultations);

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des consultations:', error);
            setErrorConsultations('Impossible de charger les consultations');
        } finally {
            setLoadingConsultations(false);
        }
    };

    // Récupérer les 3 derniers financements
    const fetchLatestFinancements = async () => {
        try {
            setLoadingFinancements(true);
            setErrorFinancements(null);

            const response = await financementService.getPublicFundingOffers();
            const financements = response.results || response || [];

            // Prendre les 3 plus récents avec statut PUBLISHED ou Approved
            const sortedFinancements = financements
                .filter(financement => (financement.status === 'PUBLISHED' || financement.status === 'Approved') && !financement.is_expired)
                .sort((a, b) => new Date(b.created_at || b.post_date) - new Date(a.created_at || a.post_date))
                .slice(0, 3);

            setLatestFinancements(sortedFinancements);
            console.log('✅ 3 derniers financements récupérés:', sortedFinancements);

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des financements:', error);
            setErrorFinancements('Impossible de charger les financements');
        } finally {
            setLoadingFinancements(false);
        }
    };

    // Récupérer les statistiques publiques
    const fetchPublicStats = async () => {
        try {
            setLoadingStats(true);
            setErrorStats(null);

            const response = await HomeStatService.getPublicStats();
            const formattedStats = HomeStatService.formatStatsForDisplay(response);

            setPublicStats(formattedStats);
            console.log('✅ Statistiques publiques récupérées:', formattedStats);

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des statistiques publiques:', error);
            setErrorStats('Impossible de charger les statistiques');
            // Utiliser les statistiques par défaut en cas d'erreur
            setPublicStats(HomeStatService.getDefaultStats());
        } finally {
            setLoadingStats(false);
        }
    };

    // Récupérer les 3 dernières bourses
    const fetchLatestBourses = async () => {
        try {
            setLoadingBourses(true);
            setErrorBourses(null);

            const response = await bourseService.getPublicScholarships();
            const bourses = response.results || response || [];

            // Prendre les 3 plus récents avec statut PUBLISHED ou Approved
            const sortedBourses = bourses
                .filter(bourse => (bourse.status === 'PUBLISHED' || bourse.status === 'Approved') && !bourse.is_expired)
                .sort((a, b) => new Date(b.created_at || b.post_date) - new Date(a.created_at || a.post_date))
                .slice(0, 3);

            setLatestBourses(sortedBourses);
            console.log('✅ 3 dernières bourses récupérées:', sortedBourses);

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des bourses:', error);
            setErrorBourses('Impossible de charger les bourses');
        } finally {
            setLoadingBourses(false);
        }
    };

    // Récupérer les 3 derniers articles de blog
    const fetchLatestBlogPosts = async () => {
        try {
            setLoadingBlog(true);
            setErrorBlog(null);

            const response = await blogService.getPublicBlogPosts();
            const posts = response.results || response || [];

            // Prendre les 3 plus récents par date de publication
            const sortedPosts = posts
                .filter(post => post.status === 'PUBLISHED')
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 3);

            setLatestBlogPosts(sortedPosts);
            console.log('✅ 3 derniers articles de blog récupérés:', sortedPosts);

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des articles de blog:', error);
            setErrorBlog('Impossible de charger les articles de blog');
        } finally {
            setLoadingBlog(false);
        }
    };

    // Charger toutes les données au montage du composant
    useEffect(() => {
        fetchLatestJobs();
        fetchLatestConsultations();
        fetchLatestFinancements();
        fetchLatestBourses();
        fetchLatestBlogPosts();
        fetchPublicStats(); // Ajout de la récupération des statistiques
    }, []);

    // Fonction utilitaire pour formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Date non précisée';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Il y a 1 jour';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
        if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;

        return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
    };

    // Fonction pour obtenir l'URL de l'image
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://via.placeholder.com/60x60';

        if (imageUrl.startsWith('http')) return imageUrl;
        if (imageUrl.startsWith('/media/')) return buildImageUrl(imageUrl);

        return 'https://via.placeholder.com/60x60';
    };

    // Fonction pour formater les données des offres d'emploi comme dans Jobs.jsx
    const formatJobOfferData = (apiJob) => {
        const isAdminOnly = apiJob.is_admin_only || false;
        const logoUrl = isAdminOnly ? apiJob.admin_company_logo : apiJob.recruiter?.logo;

        const logo = logoUrl
            ? (logoUrl.startsWith('http')
                ? logoUrl
                : buildImageUrl(logoUrl))
            : "https://via.placeholder.com/60x60";

        return {
            id: apiJob.id,
            title: apiJob.title || apiJob.position_name || 'Titre non disponible',
            company: isAdminOnly ? 'Entreprise' : (apiJob.recruiter?.company_name || 'Entreprise non spécifiée'),
            location: apiJob.location || 'Localisation non spécifiée',
            contract: apiJob.contract_type || 'Type non spécifié',
            salary: apiJob.salary_min && apiJob.salary_max
                ? `${apiJob.salary_min.toLocaleString()} - ${apiJob.salary_max.toLocaleString()} FCFA`
                : apiJob.salary_min
                    ? `À partir de ${apiJob.salary_min.toLocaleString()} FCFA`
                    : 'Salaire non spécifié',
            experience: apiJob.experience_required || 'Expérience non spécifiée',
            postedDate: apiJob.post_date ? new Date(apiJob.post_date).toLocaleDateString('fr-FR') : null,
            description: apiJob.description || 'Description non disponible',
            logo: logo,
            is_admin_only: isAdminOnly
        };
    };

    // Fonction pour formater les données des bourses d'études
    const formatScholarshipData = (scholarship) => {
        return {
            id: scholarship.id,
            title: scholarship.title || 'Titre non disponible',
            organization: scholarship.organization_name || 'Organisation non spécifiée',
            amount: scholarship.scholarship_amount ? `${scholarship.scholarship_amount.toLocaleString()} FCFA` : 'Montant non spécifié',
            level: scholarship.required_level || 'Niveau non spécifié',
            duration: scholarship.duration || 'Durée non précisée',
            country: scholarship.country_region || 'Localisation non précisée',
            description: scholarship.description || scholarship.eligibility_criteria || 'Description non disponible',
            benefits: scholarship.benefits_coverage || 'Avantages non précisés'
        };
    };

    // Fonction pour formater les données des offres de financement
    const formatFundingOfferData = (funding) => {
        const isAdminOnly = funding.is_admin_only || false;
        const logoUrl = isAdminOnly ? funding.admin_company_logo : funding.company_logo;

        const logo = logoUrl
            ? (logoUrl.startsWith('http')
                ? logoUrl
                : buildImageUrl(logoUrl))
            : "https://via.placeholder.com/60x60";

        return {
            id: funding.id,
            title: funding.title || 'Titre non disponible',
            organization: isAdminOnly ? 'Entreprise' : (funding.organization_name || 'Organisation non spécifiée'),
            amount: funding.montant ? `${funding.montant.toLocaleString()} FCFA` : 'Montant non spécifié',
            duration: funding.project_duration || 'Durée non précisée',
            country: funding.country?.name || 'Localisation non précisée',
            description: funding.description || funding.objective || 'Description non disponible',
            logo: logo,
            is_admin_only: isAdminOnly
        };
    };

    // Fonction pour formater les données des offres de consultation
    const formatConsultationOfferData = (consultation) => {
        const isAdminOnly = consultation.is_admin_only || false;
        const logoUrl = isAdminOnly ? consultation.admin_company_logo : consultation.company_logo;

        const logo = logoUrl
            ? (logoUrl.startsWith('http')
                ? logoUrl
                : buildImageUrl(logoUrl))
            : "https://via.placeholder.com/60x60";

        return {
            id: consultation.id,
            title: consultation.title || 'Titre non disponible',
            organization: isAdminOnly ? 'Entreprise' : (consultation.company_details?.company_name || consultation.organization_name || 'Organisation non spécifiée'),
            location: consultation.country?.name || 'Localisation non précisée',
            description: consultation.description || 'Description non disponible',
            logo: logo,
            is_admin_only: isAdminOnly
        };
    };

    // Composant de chargement
    const LoadingCard = () => (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );

    // Composant d'erreur
    const ErrorCard = ({ message }) => (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <span className="text-red-700 text-sm">{message}</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white">
                <div className="text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                        Trouvez votre voie avec Destiny Jobs
                    </h1>
                    <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                        Découvrez des opportunités d'emploi, de formation, de financement et de consultation
                        pour faire avancer votre carrière et vos projets.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-lg"
                                >
                                    <i className="fas fa-user-plus mr-2"></i>
                                    Mon compte
                                </Link>
                                <Link
                                    to="/jobs"
                                    className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-lg"
                                >
                                    <i className="fas fa-search mr-2"></i>
                                    Voir les offres
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-lg"
                                >
                                    <i className="fas fa-user-plus mr-2"></i>
                                    Créer un compte
                                </Link>
                                <Link
                                    to="/jobs"
                                    className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-lg"
                                >
                                    <i className="fas fa-search mr-2"></i>
                                    Voir les offres
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="space-y-6">
                {/* Première ligne - 4 compteurs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loadingStats ? (
                        // Affichage de chargement - 4 premiers compteurs
                        Array(4).fill(null).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : errorStats ? (
                        // Affichage d'erreur avec 4 premières statistiques par défaut
                        [
                            { number: "0+", label: "Offres d'emploi", icon: "fas fa-briefcase", color: "text-blue-600" },
                            { number: "0+", label: "Bourses d'études", icon: "fas fa-graduation-cap", color: "text-purple-600" },
                            { number: "0+", label: "Financements", icon: "fas fa-money-bill-wave", color: "text-green-600" },
                            { number: "0+", label: "Consultations", icon: "fas fa-handshake", color: "text-fuchsia-600" }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))
                    ) : publicStats ? (
                        // Affichage des 4 premières vraies statistiques
                        [
                            {
                                number: HomeStatService.formatNumber(publicStats.offers.jobOffers),
                                label: "Offres d'emploi",
                                icon: "fas fa-briefcase",
                                color: "text-blue-600"
                            },
                            {
                                number: HomeStatService.formatNumber(publicStats.offers.scholarshipOffers),
                                label: "Bourses d'études",
                                icon: "fas fa-graduation-cap",
                                color: "text-purple-600"
                            },
                            {
                                number: HomeStatService.formatNumber(publicStats.offers.fundingOffers),
                                label: "Financements",
                                icon: "fas fa-money-bill-wave",
                                color: "text-green-600"
                            },
                            {
                                number: HomeStatService.formatNumber(publicStats.offers.consultationOffers),
                                label: "Consultations",
                                icon: "fas fa-handshake",
                                color: "text-fuchsia-600"
                            }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))
                    ) : (
                        // Fallback avec 4 premières statistiques par défaut
                        [
                            { number: "0+", label: "Offres d'emploi", icon: "fas fa-briefcase", color: "text-blue-600" },
                            { number: "0+", label: "Bourses d'études", icon: "fas fa-graduation-cap", color: "text-purple-600" },
                            { number: "0+", label: "Financements", icon: "fas fa-money-bill-wave", color: "text-green-600" },
                            { number: "0+", label: "Consultations", icon: "fas fa-handshake", color: "text-fuchsia-600" }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))
                    )}
                </div>

                {/* Deuxième ligne - 4 compteurs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {loadingStats ? (
                        // Affichage de chargement - 4 derniers compteurs
                        Array(4).fill(null).map((_, index) => (
                            <div key={`bottom-${index}`} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : errorStats ? (
                        // Affichage d'erreur avec 4 dernières statistiques par défaut
                        [
                            { number: "0+", label: "Total utilisateurs", icon: "fas fa-users", color: "text-indigo-600" },
                            { number: "0+", label: "Recruteurs", icon: "fas fa-user-tie", color: "text-orange-600" },
                            { number: "0+", label: "Candidats", icon: "fas fa-user-graduate", color: "text-teal-600" },
                            { number: "0+", label: "Prestataires", icon: "fas fa-user-cog", color: "text-red-600" }
                        ].map((stat, index) => (
                            <div key={`bottom-${index}`} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))
                    ) : publicStats ? (
                        // Affichage des 4 dernières vraies statistiques
                        [
                            {
                                number: HomeStatService.formatNumber(publicStats.users.total),
                                label: "Total utilisateurs",
                                icon: "fas fa-users",
                                color: "text-indigo-600"
                            },
                            {
                                number: HomeStatService.formatNumber(publicStats.users.recruiters),
                                label: "Recruteurs",
                                icon: "fas fa-user-tie",
                                color: "text-orange-600"
                            },
                            {
                                number: HomeStatService.formatNumber(publicStats.users.candidates),
                                label: "Candidats",
                                icon: "fas fa-user-graduate",
                                color: "text-teal-600"
                            },
                            {
                                number: HomeStatService.formatNumber(publicStats.users.providers),
                                label: "Prestataires",
                                icon: "fas fa-user-cog",
                                color: "text-red-600"
                            }
                        ].map((stat, index) => (
                            <div key={`bottom-${index}`} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))
                    ) : (
                        // Fallback avec 4 dernières statistiques par défaut
                        [
                            { number: "0+", label: "Total utilisateurs", icon: "fas fa-users", color: "text-indigo-600" },
                            { number: "0+", label: "Recruteurs", icon: "fas fa-user-tie", color: "text-orange-600" },
                            { number: "0+", label: "Candidats", icon: "fas fa-user-graduate", color: "text-teal-600" },
                            { number: "0+", label: "Prestataires", icon: "fas fa-user-cog", color: "text-red-600" }
                        ].map((stat, index) => (
                            <div key={`bottom-${index}`} className="bg-white rounded-lg p-4 shadow-sm text-center">
                                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Offres par catégorie */}
            {[
                {
                    key: 'emplois',
                    title: "Offres d'emploi",
                    icon: "fas fa-briefcase",
                    color: "bg-blue-500",
                    link: "/jobs",
                    data: latestJobs,
                    loading: loadingJobs,
                    error: errorJobs
                },
                {
                    key: 'bourses',
                    title: "Bourses d'études",
                    icon: "fas fa-graduation-cap",
                    color: "bg-green-500",
                    link: "/bourses",
                    data: latestBourses,
                    loading: loadingBourses,
                    error: errorBourses
                },
                {
                    key: 'financements',
                    title: "Financements",
                    icon: "fas fa-money-bill-wave",
                    color: "bg-purple-500",
                    link: "/financements",
                    data: latestFinancements,
                    loading: loadingFinancements,
                    error: errorFinancements
                },
                {
                    key: 'consultations',
                    title: "Consultations",
                    icon: "fas fa-handshake",
                    color: "bg-orange-500",
                    link: "/consultations",
                    data: latestConsultations,
                    loading: loadingConsultations,
                    error: errorConsultations
                }
            ].map((category) => (
                <div key={category.key} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            <i className={`${category.icon} ${category.color} text-white p-2 rounded-lg mr-3`}></i>
                            {category.title}
                        </h2>
                        <Link
                            to={category.link}
                            className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                        >
                            Voir toutes les offres
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {category.loading ? (
                            // Affichage de chargement
                            Array(3).fill(null).map((_, index) => (
                                <LoadingCard key={index} />
                            ))
                        ) : category.error ? (
                            // Affichage d'erreur
                            Array(3).fill(null).map((_, index) => (
                                <ErrorCard key={index} message={category.error} />
                            ))
                        ) : category.data.length === 0 ? (
                            // Aucune donnée
                            <div className="col-span-3 text-center py-8 text-gray-500">
                                <i className="fas fa-inbox text-4xl mb-4 opacity-50"></i>
                                <p>Aucune offre disponible pour le moment</p>
                            </div>
                        ) : (
                            // Affichage des données
                            category.data.map((offer) => {
                                // Formater les offres selon leur type
                                let displayOffer;
                                if (category.key === 'emplois') {
                                    displayOffer = formatJobOfferData(offer);
                                } else if (category.key === 'bourses') {
                                    displayOffer = formatScholarshipData(offer);
                                } else if (category.key === 'financements') {
                                    displayOffer = formatFundingOfferData(offer);
                                } else if (category.key === 'consultations') {
                                    displayOffer = formatConsultationOfferData(offer);
                                } else {
                                    displayOffer = offer;
                                }

                                return (
                                    <div key={offer.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-start space-x-3 mb-3">
                                            {/* Logo */}
                                            <div className="flex-shrink-0">
                                                {(category.key === 'emplois' || category.key === 'financements' || category.key === 'consultations') ? (
                                                    <>
                                                        {displayOffer.logo ? (
                                                            <img
                                                                src={displayOffer.logo}
                                                                alt={displayOffer.organization}
                                                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 bg-white"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center ${displayOffer.logo ? 'hidden' : 'flex'}`}>
                                                            <i className={`${category.key === 'financements' ? 'fas fa-coins' : category.key === 'consultations' ? 'fas fa-handshake' : 'fas fa-building'} text-white text-lg`}></i>
                                                        </div>
                                                    </>
                                                ) : category.key === 'bourses' ? (
                                                    <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                                        <i className="fas fa-graduation-cap text-white text-lg"></i>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={getImageUrl(offer.recruiter?.logo || offer.company?.logo || offer.institution?.logo)}
                                                        alt="Logo"
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                )}
                                            </div>

                                            {/* Contenu */}
                                            <div className="flex-1 min-w-0">
                                                {/* Titre */}
                                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                                                    <Link to={`${category.link}/${offer.id}`} className="hover:text-fuchsia-600">
                                                        {displayOffer.title || offer.title}
                                                    </Link>
                                                </h3>

                                                {/* Organisation/Entreprise */}
                                                <p className="text-xs text-gray-600 mb-2">
                                                    {category.key === 'emplois'
                                                        ? displayOffer.company
                                                        : (displayOffer.organization || offer.recruiter?.company_name || offer.company?.name || offer.company_details?.company_name || offer.institution?.name || 'Non spécifié')
                                                    }
                                                </p>

                                                {/* Aperçu de la description */}
                                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                                    {(displayOffer.description || offer.description || offer.details || '')
                                                        .substring(0, 120) + '...'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Informations supplémentaires */}
                                        <div className="space-y-1 text-xs text-gray-600 mb-3">
                                            {category.key === 'emplois' && (
                                                <>
                                                    {displayOffer.location && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.location}</span>
                                                        </div>
                                                    )}
                                                    {displayOffer.salary && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-money-bill-wave mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.salary}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {category.key === 'bourses' && (
                                                <>
                                                    {displayOffer.amount && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-coins mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.amount}</span>
                                                        </div>
                                                    )}
                                                    {displayOffer.level && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-user-graduate mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.level}</span>
                                                        </div>
                                                    )}
                                                    {displayOffer.duration && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-clock mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.duration}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {category.key === 'financements' && (
                                                <>
                                                    {displayOffer.amount && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-coins mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.amount}</span>
                                                        </div>
                                                    )}
                                                    {displayOffer.duration && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-clock mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.duration}</span>
                                                        </div>
                                                    )}
                                                    {displayOffer.country && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.country}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {category.key === 'consultations' && (
                                                <>
                                                    {displayOffer.location && (
                                                        <div className="flex items-center">
                                                            <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                                                            <span>{displayOffer.location}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Date et bouton */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">{formatDate(offer.created_at)}</span>
                                            <Link
                                                to={`${category.link}/${offer.id}`}
                                                className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-lg hover:bg-fuchsia-200 transition duration-200 text-xs font-medium"
                                            >
                                                Voir plus
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ))}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
                <p className="text-xl mb-6 opacity-90">
                    Rejoignez notre communauté et accédez à toutes nos opportunités
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-lg"
                            >
                                <i className="fas fa-user-plus mr-2"></i>
                                Mon compte
                            </Link>
                            <Link
                                to="/abonnements"
                                className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-lg"
                            >
                                <i className="fas fa-crown mr-2"></i>
                                Voir nos abonnements
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/signup"
                                className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-lg"
                            >
                                <i className="fas fa-user-plus mr-2"></i>
                                Créer un compte gratuit
                            </Link>
                            <Link
                                to="/abonnements"
                                className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-lg"
                            >
                                <i className="fas fa-crown mr-2"></i>
                                Voir nos abonnements
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Blog Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        <i className="fas fa-newspaper text-fuchsia-600 mr-3"></i>
                        Derniers articles du blog
                    </h2>
                    <Link
                        to="/blog"
                        className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                    >
                        Voir tous les articles
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loadingBlog ? (
                        // Affichage de chargement
                        Array(3).fill(null).map((_, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="animate-pulse">
                                    <div className="w-full h-32 bg-gray-200"></div>
                                    <div className="p-4">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : errorBlog ? (
                        // Affichage d'erreur
                        Array(3).fill(null).map((_, index) => (
                            <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                                <div className="flex items-center">
                                    <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                                    <span className="text-red-700 text-sm">{errorBlog}</span>
                                </div>
                            </div>
                        ))
                    ) : latestBlogPosts.length === 0 ? (
                        // Aucun article
                        <div className="col-span-3 text-center py-8 text-gray-500">
                            <i className="fas fa-newspaper text-4xl mb-4 opacity-50"></i>
                            <p>Aucun article disponible pour le moment</p>
                        </div>
                    ) : (
                        // Affichage des articles
                        latestBlogPosts.map((article) => (
                            <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                                {/* Image conditionnelle avec fallback */}
                                {article.featured_image ? (
                                    <img
                                        src={getImageUrl(article.featured_image)}
                                        alt={article.title}
                                        className="w-full h-32 object-cover"
                                        onError={(e) => {
                                            // En cas d'erreur de chargement, remplacer par l'icône
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                {/* Fallback icône quand pas d'image */}
                                <div
                                    className={`w-full h-32 flex items-center justify-center ${article.featured_image ? 'hidden' : 'flex'}`}
                                    style={{ display: article.featured_image ? 'none' : 'flex' }}
                                >
                                    <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 w-full h-full flex items-center justify-center">
                                        <i className="fas fa-newspaper text-white text-4xl opacity-80"></i>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {article.excerpt || article.content?.substring(0, 100) + '...'}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{article.author?.username || article.author?.first_name || 'Auteur inconnu'}</span>
                                        <span>{formatDate(article.created_at)}</span>
                                    </div>
                                    <Link
                                        to={`/blog/article/${article.id}`}
                                        className="text-fuchsia-600 hover:text-fuchsia-800 text-sm font-medium mt-3 inline-block"
                                    >
                                        Lire la suite →
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home; 