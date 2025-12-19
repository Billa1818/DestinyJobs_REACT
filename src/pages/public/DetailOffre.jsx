import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ShareModal from '../../components/ShareModal';
import SavedOfferButton from '../../components/SavedOfferButton';
import jobService from '../../services/jobService';
import { useAuth } from '../../contexts/AuthContext';

const DetailOffre = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [showShareModal, setShowShareModal] = useState(false);
    const [offre, setOffre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Vérifier si l'utilisateur connecté est le recruteur de cette offre
    const isRecruiterOfThisOffer = isAuthenticated && user && offre?.recruiter?.user?.id === user.id;

    // Vérifier si l'offre est accessible publiquement (seulement si offre existe)
    const isPubliclyAccessible = offre ? (offre.status === 'APPROVED' || offre.status === 'PUBLISHED') : false;

    // Vérifier si l'offre est en attente d'approbation (seulement si offre existe)
    const isPendingApproval = offre ? offre.status === 'PENDING_APPROVAL' : false;

    // Vérifier si l'offre est un brouillon (seulement si offre existe)
    const isDraft = offre ? offre.status === 'DRAFT' : false;

    // Vérifier si l'offre est rejetée (seulement si offre existe)
    const isRejected = offre ? offre.status === 'REJECTED' : false;

    // Logs de débogage pour l'authentification
    useEffect(() => {
        console.log('🔐 État d\'authentification:', {
            isAuthenticated,
            user: user ? { id: user.id, username: user.username } : null,
            offreId: offre?.id,
            recruiterUserId: offre?.recruiter?.user?.id,
            recruiterId: offre?.recruiter?.id
        });
    }, [isAuthenticated, user, offre]);

    // Charger les détails de l'offre depuis l'API
    useEffect(() => {
        const loadOffre = async () => {
            try {
                console.log('🔄 Début du chargement de l\'offre:', id);
                setLoading(true);
                setError(null);

                // Utiliser l'endpoint public pour récupérer les détails de l'offre
                const response = await jobService.getPublicJobOfferDetail(id);
                console.log('✅ Données reçues de l\'API:', response);
                setOffre(response);
            } catch (error) {
                console.error('❌ Erreur lors du chargement de l\'offre:', error);
                console.error('📊 Détails de l\'erreur:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message
                });

                // Gérer spécifiquement l'erreur 403 (Forbidden) - Accès refusé
                if (error.response && error.response.status === 403) {
                    console.log('🚫 Accès interdit (403) - Redirection vers 404');
                    // Rediriger vers la page 404 en cas d'accès interdit
                    // L'offre existe mais l'utilisateur n'a pas les permissions
                    navigate('/404', { replace: true });
                    return;
                }

                // Gérer le cas spécifique de l'API qui retourne un message d'erreur dans le corps
                if (error.response?.data?.error === "Cette offre n'est pas disponible") {
                    console.log('🚫 Offre non disponible - Redirection vers 404');
                    // C'est un cas d'accès interdit, rediriger vers 404
                    navigate('/404', { replace: true });
                    return;
                }

                // Gérer l'erreur 404 (Not Found) - Offre inexistante
                if (error.response && error.response.status === 404) {
                    console.log('🔍 Offre non trouvée (404) - Redirection vers 404');
                    // Rediriger vers la page 404 en cas d'offre inexistante
                    navigate('/404', { replace: true });
                    return;
                }

                // Gérer les autres erreurs
                setError(error.message || 'Erreur lors du chargement de l\'offre');
            } finally {
                setLoading(false);
                console.log('🏁 Chargement terminé');
            }
        };

        if (id) {
            loadOffre();
        }
    }, [id, navigate]);

    const handleApply = () => {
        // Si c'est une offre admin_only, rediriger vers site_url
        if (offre?.is_admin_only && offre?.site_url) {
            window.open(offre.site_url, '_blank');
            return;
        }

        if (!isAuthenticated) {
            setShowShareModal(true);
            return;
        }
        // Rediriger vers la page d'analyse IA publique
        navigate(`/ia-compatibility/${id}/emploi`);
    };



    const handleShare = () => {
        setShowShareModal(true);
    };

    // Fonction pour formater le salaire
    const formatSalary = (salaryType, salaryMin, salaryMax) => {
        if (!salaryType || salaryType === 'NON_PRECISE') return 'À négocier';
        if (salaryType === 'FIXE') return `${salaryMin ? salaryMin.toLocaleString() : '0'} FCFA`;
        if (salaryType === 'FOURCHETTE') {
            if (salaryMin && salaryMax) {
                return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} FCFA`;
            }
            return salaryMin ? `${salaryMin.toLocaleString()}+ FCFA` : 'À négocier';
        }
        return 'À négocier';
    };

    // Fonction pour formater l'expérience
    const formatExperience = (experience) => {
        switch (experience) {
            case 'JUNIOR': return '0-2 ans';
            case 'INTERMEDIATE': return '3-5 ans';
            case 'SENIOR': return '6-10 ans';
            case 'EXPERT': return '10+ ans';
            default: return experience || 'Non précisé';
        }
    };

    // Fonction pour formater le mode de travail
    const formatWorkMode = (workMode) => {
        switch (workMode) {
            case 'PRESENTIEL': return 'Présentiel';
            case 'REMOTE': return 'Télétravail';
            case 'HYBRIDE': return 'Hybride';
            default: return workMode || 'Non précisé';
        }
    };

    // Fonction pour formater le type de contrat
    const formatContractType = (contractType) => {
        switch (contractType) {
            case 'CDI': return 'CDI';
            case 'CDD': return 'CDD';
            case 'STAGE': return 'Stage';
            case 'FREELANCE': return 'Freelance';
            case 'TEMPS_PARTIEL': return 'Temps partiel';
            default: return contractType || 'Non précisé';
        }
    };

    // Fonction pour formater la taille de l'entreprise
    const formatCompanySize = (size) => {
        switch (size) {
            case 'STARTUP': return 'Startup (1-10 employés)';
            case 'SME': return 'PME (11-250 employés)';
            case 'LARGE': return 'Grande entreprise (250+ employés)';
            case 'MULTINATIONAL': return 'Multinationale';
            default: return size || 'Non précisé';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de l'offre...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link
                        to="/jobs"
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                    >
                        Retour aux offres
                    </Link>
                </div>
            </div>
        );
    }

    // Vérification supplémentaire pour éviter le rendu prématuré
    if (!offre || !offre.id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des données de l'offre...</p>
                </div>
            </div>
        );
    }

    if (!offre) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Offre non trouvée</h3>
                    <p className="text-gray-600 mb-4">L'offre que vous recherchez n'existe pas ou n'est plus disponible.</p>
                    <Link
                        to="/jobs"
                        className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200"
                    >
                        Retour aux offres
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header de l'offre */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{offre.title}</h1>

                            {/* Informations de l'entreprise en header - Masqué si admin_only */}
                            {offre.recruiter && !offre.is_admin_only && (
                                <div className="flex items-center mb-4">
                                    {offre.recruiter.logo && (
                                        <div className="mr-3">
                                            <img
                                                src={`http://localhost:8000${offre.recruiter.logo}`}
                                                alt={offre.recruiter.company_name}
                                                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                                                onError={(e) => {
                                                    console.error('Erreur de chargement du logo:', e.target.src);
                                                    e.target.style.display = 'none';
                                                }}
                                                onLoad={() => {
                                                    console.log('Logo chargé avec succès:', offre.recruiter.logo);
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{offre.recruiter.company_name}</h2>
                                        {offre.recruiter.region && offre.recruiter.country && (
                                            <p className="text-sm text-gray-600">
                                                <i className="fas fa-map-marker-alt mr-1"></i>
                                                {offre.recruiter.region.name}, {offre.recruiter.country.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {formatContractType(offre.contract_type)}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {formatExperience(offre.experience_required)}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                    {formatWorkMode(offre.work_mode)}
                                </span>
                                {offre.location && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                        {offre.location}
                                    </span>
                                )}
                            </div>

                            <div className="text-lg text-gray-600 mb-4">
                                Salaire : {formatSalary(offre.salary_type, offre.salary_min, offre.salary_max)}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                {offre.post_date && (
                                    <span><i className="fas fa-calendar-plus mr-1"></i>Publiée le {new Date(offre.post_date).toLocaleDateString('fr-FR')}</span>
                                )}
                                {offre.closing_date && (
                                    <span><i className="fas fa-calendar-times mr-1"></i>Expire le {new Date(offre.closing_date).toLocaleDateString('fr-FR')}</span>
                                )}

                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:ml-6">
                            {/* Bouton Postuler - visible uniquement pour les offres publiques et non créateur */}
                            {!isRecruiterOfThisOffer && isPubliclyAccessible && (
                                <button
                                    onClick={handleApply}
                                    className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                                >
                                    <i className={`mr-2 ${offre?.is_admin_only ? 'fas fa-external-link-alt' : 'fas fa-paper-plane'}`}></i>
                                    {offre?.is_admin_only ? 'Postuler sur le site' : 'Postuler maintenant'}
                                </button>
                            )}

                            {/* Bouton Éditer - visible uniquement pour l'auteur de l'offre */}
                            {isRecruiterOfThisOffer && (
                                <button
                                    onClick={() => navigate(`/recruteur/creer-offre?edit=${id}`)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                                >
                                    <i className="fas fa-edit mr-2"></i>
                                    Éditer l'offre
                                </button>
                            )}

                            {/* Bouton Ajouter aux favoris - visible uniquement pour les offres publiques et non créateur */}
                            {!isRecruiterOfThisOffer && isPubliclyAccessible && (
                                <SavedOfferButton
                                    offerId={id}
                                    offerType="JOB"
                                    className="px-6 py-3 rounded-lg"
                                />
                            )}

                            {/* Bouton Partager - toujours visible */}
                            <button
                                onClick={handleShare}
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                            >
                                <i className="fas fa-share mr-2"></i>
                                Partager
                            </button>

                            {/* Messages informatifs selon le statut et les permissions */}
                            {isRecruiterOfThisOffer && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                    <p className="text-sm text-blue-700">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        Vous consultez votre propre offre
                                    </p>
                                </div>
                            )}

                            {/* Message pour offres en attente d'approbation (visiteurs) */}
                            {!isRecruiterOfThisOffer && isPendingApproval && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                                    <p className="text-sm text-yellow-700">
                                        <i className="fas fa-clock mr-1"></i>
                                        Cette offre est en attente d'approbation
                                    </p>
                                </div>
                            )}

                            {/* Message pour offres brouillon (visiteurs) */}
                            {!isRecruiterOfThisOffer && isDraft && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                    <p className="text-sm text-gray-700">
                                        <i className="fas fa-file-alt mr-1"></i>
                                        Cette offre est en cours de rédaction
                                    </p>
                                </div>
                            )}

                            {/* Message pour offres rejetées (visiteurs) */}
                            {!isRecruiterOfThisOffer && isRejected && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                    <p className="text-sm text-red-700">
                                        <i className="fas fa-times-circle mr-1"></i>
                                        Cette offre a été rejetée
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Statut de l'offre - visible pour tous */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statut de l'offre</h2>
                            <div className="space-y-4">
                                {/* Badge de statut */}
                                <div className="flex items-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${offre.status === 'APPROVED'
                                            ? 'bg-green-100 text-green-800'
                                            : offre.status === 'PENDING_APPROVAL'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : offre.status === 'PUBLISHED'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : offre.status === 'DRAFT'
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : offre.status === 'REJECTED'
                                                            ? 'bg-red-100 text-red-800'
                                                            : offre.status === 'EXPIRED'
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        <i className={`fas mr-2 ${offre.status === 'APPROVED' ? 'fa-check-circle' :
                                                offre.status === 'PENDING_APPROVAL' ? 'fa-clock' :
                                                    offre.status === 'PUBLISHED' ? 'fa-eye' :
                                                        offre.status === 'DRAFT' ? 'fa-file-alt' :
                                                            offre.status === 'REJECTED' ? 'fa-times-circle' :
                                                                offre.status === 'EXPIRED' ? 'fa-calendar-times' :
                                                                    'fa-info-circle'
                                            }`}></i>
                                        {offre.status === 'APPROVED' ? 'Approuvée' :
                                            offre.status === 'PENDING_APPROVAL' ? 'En attente d\'approbation' :
                                                offre.status === 'PUBLISHED' ? 'Publiée' :
                                                    offre.status === 'DRAFT' ? 'Brouillon' :
                                                        offre.status === 'REJECTED' ? 'Rejetée' :
                                                            offre.status === 'EXPIRED' ? 'Expirée' :
                                                                offre.status || 'Statut inconnu'}
                                    </span>
                                </div>

                                {/* Informations supplémentaires selon le statut */}
                                {isPendingApproval && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <p className="text-sm text-yellow-700">
                                            <i className="fas fa-info-circle mr-2"></i>
                                            <strong>En attente d'approbation :</strong> Cette offre est en cours de validation par notre équipe.
                                            {isRecruiterOfThisOffer ? ' Vous recevrez une notification dès qu\'elle sera approuvée.' : ' Elle sera visible publiquement une fois approuvée.'}
                                        </p>
                                    </div>
                                )}

                                {isDraft && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <p className="text-sm text-gray-700">
                                            <i className="fas fa-info-circle mr-2"></i>
                                            <strong>Brouillon :</strong> Cette offre est en cours de rédaction et n'est pas encore soumise pour approbation.
                                            {isRecruiterOfThisOffer ? ' Vous pouvez continuer à l\'éditer avant de la soumettre.' : ''}
                                        </p>
                                    </div>
                                )}

                                {isRejected && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-sm text-red-700">
                                            <i className="fas fa-info-circle mr-2"></i>
                                            <strong>Rejetée :</strong> Cette offre n'a pas été approuvée par notre équipe.
                                            {isRecruiterOfThisOffer ? ' Vous pouvez la modifier et la soumettre à nouveau.' : ''}
                                        </p>
                                    </div>
                                )}

                                {isPubliclyAccessible && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-700">
                                            <i className="fas fa-check-circle mr-2"></i>
                                            <strong>Offre active :</strong> Cette offre est visible publiquement et les candidats peuvent postuler.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description du poste */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du poste</h2>
                            <div className="prose max-w-none text-gray-600">
                                {offre.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: offre.description }} />
                                ) : (
                                    <p>Aucune description disponible pour cette offre.</p>
                                )}
                            </div>
                        </div>

                        {/* Profil recherché */}
                        {offre.profile_sought && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil recherché</h2>
                                <div className="prose max-w-none text-gray-600">
                                    <p>{offre.profile_sought}</p>
                                </div>
                            </div>
                        )}

                        {/* Informations complémentaires */}
                        {offre.additional_info && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations complémentaires</h2>
                                <div className="prose max-w-none text-gray-600">
                                    <p>{offre.additional_info}</p>
                                </div>
                            </div>
                        )}

                        {/* Exigences */}
                        {offre.cv_required || offre.motivation_letter_required ? (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents requis</h2>
                                <ul className="space-y-2 text-gray-600">
                                    {offre.cv_required && (
                                        <li className="flex items-center">
                                            <i className="fas fa-check text-green-500 mr-2"></i>
                                            CV obligatoire
                                        </li>
                                    )}
                                    {offre.motivation_letter_required && (
                                        <li className="flex items-center">
                                            <i className="fas fa-check text-green-500 mr-2"></i>
                                            Lettre de motivation obligatoire
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ) : null}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* À propos de l'entreprise - Masqué si admin_only */}
                        {offre.recruiter && !offre.is_admin_only && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de l'entreprise</h3>
                                <div className="space-y-4">
                                    {/* Logo et nom */}
                                    <div className="flex items-center">
                                        {offre.recruiter.logo ? (
                                            <div className="mr-3">
                                                <img
                                                    src={`http://localhost:8000${offre.recruiter.logo}`}
                                                    alt={offre.recruiter.company_name}
                                                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                                                    onError={(e) => {
                                                        console.error('Erreur de chargement du logo sidebar:', e.target.src);
                                                        e.target.style.display = 'none';
                                                    }}
                                                    onLoad={() => {
                                                        console.log('Logo sidebar chargé avec succès:', offre.recruiter.logo);
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center mr-3">
                                                <i className="fas fa-building text-gray-400 text-2xl"></i>
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{offre.recruiter.company_name}</h4>
                                            {offre.recruiter.sector && (
                                                <p className="text-sm text-gray-600">{offre.recruiter.sector}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description de l'entreprise */}
                                    {offre.recruiter.description && (
                                        <div>
                                            <p className="text-sm text-gray-600">{offre.recruiter.description}</p>
                                        </div>
                                    )}

                                    {/* Informations détaillées */}
                                    <div className="space-y-3 text-sm">
                                        {offre.recruiter.company_size && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Taille :</span>
                                                <span className="font-medium text-gray-900">{formatCompanySize(offre.recruiter.company_size)}</span>
                                            </div>
                                        )}
                                        {offre.recruiter.country && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Pays :</span>
                                                <span className="font-medium text-gray-900">{offre.recruiter.country.name}</span>
                                            </div>
                                        )}
                                        {offre.recruiter.region && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Région :</span>
                                                <span className="font-medium text-gray-900">{offre.recruiter.region.name}</span>
                                            </div>
                                        )}
                                        {offre.recruiter.website && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Site web :</span>
                                                <a
                                                    href={offre.recruiter.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                                                >
                                                    Visiter
                                                </a>
                                            </div>
                                        )}

                                        {/* Lien vers le profil public du recruteur */}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Profil :</span>
                                            <Link
                                                to={`/recruteur/profil-public/${offre.recruiter.user.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                            >
                                                <i className="fas fa-user mr-1"></i>
                                                Voir le profil du recruteur
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Informations du recruteur */}
                                    {offre.recruiter.user && (
                                        <div className="pt-3 border-t border-gray-200">
                                            <h5 className="font-medium text-gray-900 mb-2">Recruteur</h5>
                                            <div className="text-sm text-gray-600">
                                                <p>{offre.recruiter.user.first_name} {offre.recruiter.user.last_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Membre depuis {new Date(offre.recruiter.user.created_at).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Informations de l'offre */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'offre</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                {offre.department && (
                                    <div>
                                        <span className="font-medium text-gray-900">Département :</span>
                                        <p>{offre.department.name}</p>
                                    </div>
                                )}
                                {offre.category && (
                                    <div>
                                        <span className="font-medium text-gray-900">Catégorie :</span>
                                        <p>{offre.category.name}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium text-gray-900">Type de contrat :</span>
                                    <p>{formatContractType(offre.contract_type)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Expérience :</span>
                                    <p>{formatExperience(offre.experience_required)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900">Mode de travail :</span>
                                    <p>{formatWorkMode(offre.work_mode)}</p>
                                </div>
                                {offre.location && (
                                    <div>
                                        <span className="font-medium text-gray-900">Localisation :</span>
                                        <p>{offre.location}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date limite */}
                        {offre.application_deadline && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date limite</h3>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {new Date(offre.application_deadline).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="text-sm text-gray-500">Date limite de candidature</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de partage */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title={offre?.title}
                url={window.location.href}
            />
        </div>
    );
};

export default DetailOffre; 