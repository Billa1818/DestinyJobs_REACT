import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';

const CreeFinacement = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuth();
    
    // États pour les données de référence
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [fundingSectors, setFundingSectors] = useState([]);
    const [fundingTargets, setFundingTargets] = useState([]);
    const [jobFunctions, setJobFunctions] = useState([]);
    const [activitySectors, setActivitySectors] = useState([]);
    
    // États du formulaire
    const [formData, setFormData] = useState({
        title: '',
        sector: '',
        min_amount: '',
        max_amount: '',
        annual_interest_rate: '',
        repayment_duration: '',
        target: '',
        description: '',
        eligibility_conditions: '',
        application_process: '',
        application_deadline: '',
        max_applications: '',
        contact_info: '',
        no_guarantee: false,
        grace_period_available: false,
        geographic_zone: '',
        business_plan_required: false,
        financial_statements_required: false,
        country: '',
        region: '',
        job_function: '',
        activity_sector: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFunding, setCurrentFunding] = useState(null);

    // Vérifier l'authentification
    useEffect(() => {
        if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    // Vérifier si on est en mode édition
    useEffect(() => {
        const editId = searchParams.get('edit');
        if (editId) {
            setIsEditing(true);
            loadFundingForEdit(editId);
        }
    }, [searchParams]);

    // Charger les données de référence au montage
    useEffect(() => {
        loadReferenceData();
    }, []);

    // Charger les régions quand un pays est sélectionné
    useEffect(() => {
        if (formData.country) {
            loadRegions(formData.country);
        }
    }, [formData.country]);

    // Charger toutes les données de référence
    const loadReferenceData = async () => {
        try {
            setLoading(true);
            
            const [
                countriesData,
                fundingSectorsData,
                fundingTargetsData,
                jobFunctionsData,
                activitySectorsData
            ] = await Promise.all([
                consultationService.getCountries(),
                consultationService.getFundingSectors(),
                consultationService.getFundingTargets(),
                consultationService.getJobFunctions(),
                consultationService.getActivitySectors()
            ]);

            setCountries(countriesData);
            setFundingSectors(fundingSectorsData);
            setFundingTargets(fundingTargetsData);
            setJobFunctions(jobFunctionsData);
            setActivitySectors(activitySectorsData);
        } catch (error) {
            setError('Erreur lors du chargement des données de référence');
        } finally {
            setLoading(false);
        }
    };

    // Charger les régions d'un pays
    const loadRegions = async (countryId) => {
        try {
            const regionsData = await consultationService.getRegionsByCountry(countryId);
            setRegions(regionsData);
        } catch (error) {
            setError('Erreur lors du chargement des régions');
        }
    };

    // Charger une offre existante pour édition
    const loadFundingForEdit = async (fundingId) => {
        try {
            setLoading(true);
            setError(null);
            
            const fundingData = await consultationService.getFundingOfferDetail(fundingId);
            setCurrentFunding(fundingData);
            
            // Pré-remplir le formulaire avec les données existantes
            setFormData({
                title: fundingData.title || '',
                sector: fundingData.sector?.id?.toString() || '',
                min_amount: fundingData.min_amount?.toString() || '',
                max_amount: fundingData.max_amount?.toString() || '',
                annual_interest_rate: fundingData.annual_interest_rate?.toString() || '',
                repayment_duration: fundingData.repayment_duration || '',
                target: fundingData.target?.id?.toString() || '',
                description: fundingData.description || '',
                eligibility_conditions: fundingData.eligibility_conditions || '',
                application_process: fundingData.application_process || '',
                application_deadline: fundingData.application_deadline ? 
                    new Date(fundingData.application_deadline).toISOString().slice(0, 16) : '',
                max_applications: fundingData.max_applications?.toString() || '',
                contact_info: fundingData.contact_info || '',
                no_guarantee: fundingData.no_guarantee || false,
                grace_period_available: fundingData.grace_period_available || false,
                geographic_zone: fundingData.geographic_zone || '',
                business_plan_required: fundingData.business_plan_required || false,
                financial_statements_required: fundingData.financial_statements_required || false,
                country: fundingData.country?.id?.toString() || '',
                region: fundingData.region?.id?.toString() || '',
                job_function: fundingData.job_function?.id?.toString() || '',
                activity_sector: fundingData.activity_sector?.id?.toString() || ''
            });
            
            // Charger les régions si un pays est sélectionné
            if (fundingData.country?.id) {
                loadRegions(fundingData.country.id);
            }
            
            setSuccessMessage(`Mode édition activé pour l'offre "${fundingData.title}"`);
        } catch (error) {
            setError(error.message || 'Erreur lors du chargement de l\'offre');
        } finally {
            setLoading(false);
        }
    };

    // Gérer les changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Préparer les données pour l'API
            const apiData = {
                ...formData,
                min_amount: parseFloat(formData.min_amount),
                max_amount: parseFloat(formData.max_amount),
                annual_interest_rate: formData.annual_interest_rate ? parseFloat(formData.annual_interest_rate) : null,
                max_applications: formData.max_applications ? parseInt(formData.max_applications) : null,
                country: formData.country ? parseInt(formData.country) : null,
                region: formData.region ? parseInt(formData.region) : null,
                sector: parseInt(formData.sector),
                target: parseInt(formData.target),
                job_function: formData.job_function ? parseInt(formData.job_function) : null,
                activity_sector: formData.activity_sector ? parseInt(formData.activity_sector) : null
            };

            if (isEditing && currentFunding) {
                await consultationService.updateFundingOffer(currentFunding.id, apiData);
                setSuccessMessage('Offre de financement mise à jour avec succès !');
            } else {
                await consultationService.createFundingOffer(apiData);
                setSuccessMessage('Offre de financement créée avec succès !');
            }
            
            // Rediriger après un délai
            setTimeout(() => {
                navigate('/recruteur/gestion-financements', { replace: true });
            }, 2000);
        } catch (error) {
            setError(error.message || 'Erreur lors de la création de l\'offre');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !countries.length) {
        return (
            <div className="w-full flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
                        {/* Header Section */}
                        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                            <i className="fas fa-hand-holding-usd mr-2 text-fuchsia-600"></i>
                            {isEditing ? 'Modifier une offre de financement' : 'Créer une offre de financement'}
                                     </h1>
                                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            {isEditing 
                                ? 'Modifiez votre offre de financement existante'
                                : 'Proposez vos solutions de financement aux entrepreneurs et porteurs de projets'
                            }
                                    </p>
                                </div>
                                <div className="hidden sm:block">
                        <div className="bg-fuchsia-50 p-3 rounded-lg">
                            <i className="fas fa-coins text-2xl text-fuchsia-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informations de l'offre en cours d'édition */}
            {isEditing && currentFunding && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i className="fas fa-info-circle text-blue-400"></i>
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">
                                Modification de l'offre : {currentFunding.title}
                            </h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p><strong>Statut actuel :</strong>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        currentFunding.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                                        currentFunding.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                                        currentFunding.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                        currentFunding.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        currentFunding.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {currentFunding.status === 'DRAFT' ? 'Brouillon' :
                                         currentFunding.status === 'PENDING_APPROVAL' ? 'En attente d\'approbation' :
                                         currentFunding.status === 'REJECTED' ? 'Refusée' :
                                         currentFunding.status === 'APPROVED' ? 'Approuvée' :
                                         currentFunding.status === 'PUBLISHED' ? 'Publiée' :
                                         currentFunding.status}
                                        </span>
                                </p>
                                <p><strong>Créée le :</strong> {new Date(currentFunding.created_at).toLocaleDateString('fr-FR')}</p>
                                {currentFunding.updated_at && (
                                    <p><strong>Dernière modification :</strong> {new Date(currentFunding.updated_at).toLocaleDateString('fr-FR')}</p>
                                )}

                                {/* Message d'avertissement pour les offres approuvées */}
                                {(currentFunding.status === 'APPROVED' || currentFunding.status === 'PUBLISHED') && (
                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <div className="flex items-start">
                                            <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5 mr-2"></i>
                                            <div>
                                                <p className="text-sm font-medium text-yellow-800 mb-1">
                                                    ⚠️ Attention : Offre déjà approuvée
                                                </p>
                                                <p className="text-xs text-yellow-700">
                                                    Si vous modifiez cette offre, elle devra attendre une nouvelle approbation avant d'être republiée.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-blue-600 mt-2">
                                    <i className="fas fa-lightbulb mr-1"></i>
                                    {currentFunding.status === 'DRAFT' ? 'Vous pouvez modifier cette offre à tout moment.' :
                                     currentFunding.status === 'PENDING_APPROVAL' ? 'Modifiez cette offre si nécessaire, elle sera re-soumise pour approbation.' :
                                     currentFunding.status === 'REJECTED' ? 'Corrigez cette offre selon les commentaires, elle sera re-soumise pour approbation.' :
                                     currentFunding.status === 'APPROVED' ? 'Cette offre est approuvée. Toute modification nécessitera une nouvelle approbation.' :
                                     currentFunding.status === 'PUBLISHED' ? 'Cette offre est publiée. Toute modification nécessitera une nouvelle approbation.' :
                                     'Cette offre peut être modifiée.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages d'erreur et de succès */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i className="fas fa-exclamation-circle text-red-400"></i>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i className="fas fa-check-circle text-green-400"></i>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-800">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulaire de création */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Informations générales */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                                    Informations générales
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Titre du financement <span className="text-red-500">*</span>
                                        </label>
                            <input 
                                type="text" 
                                id="title" 
                                name="title" 
                                required 
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: Financement PME - Secteur Technologie" 
                            />
                                    </div>
                                    
                                    <div>
                            <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                                Secteur de financement <span className="text-red-500">*</span>
                                        </label>
                            <select 
                                id="sector" 
                                name="sector" 
                                required
                                value={formData.sector}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                            >
                                <option value="">Sélectionner un secteur</option>
                                {fundingSectors.map(sector => (
                                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                                ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                            <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
                                Public cible <span className="text-red-500">*</span>
                                        </label>
                            <select 
                                id="target" 
                                name="target" 
                                required
                                value={formData.target}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                            >
                                <option value="">Sélectionner</option>
                                {fundingTargets.map(target => (
                                    <option key={target.id} value={target.id}>{target.name}</option>
                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                {/* Détails financiers */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-calculator mr-2 text-green-600"></i>
                                    Détails financiers
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                            <label htmlFor="min_amount" className="block text-sm font-medium text-gray-700 mb-2">
                                            Montant minimum (FCFA) <span className="text-red-500">*</span>
                                        </label>
                            <input 
                                type="number" 
                                id="min_amount" 
                                name="min_amount" 
                                required 
                                min="0"
                                value={formData.min_amount}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: 5000000" 
                            />
                                    </div>
                                    
                                    <div>
                            <label htmlFor="max_amount" className="block text-sm font-medium text-gray-700 mb-2">
                                            Montant maximum (FCFA) <span className="text-red-500">*</span>
                                        </label>
                            <input 
                                type="number" 
                                id="max_amount" 
                                name="max_amount" 
                                required 
                                min="0"
                                value={formData.max_amount}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: 50000000" 
                            />
                                    </div>
                                    
                                    <div>
                            <label htmlFor="annual_interest_rate" className="block text-sm font-medium text-gray-700 mb-2">
                                            Taux d'intérêt (% annuel)
                                        </label>
                            <input 
                                type="number" 
                                id="annual_interest_rate" 
                                name="annual_interest_rate" 
                                min="0" 
                                max="100" 
                                step="0.1"
                                value={formData.annual_interest_rate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: 8.5" 
                            />
                                    </div>
                                    
                                    <div>
                            <label htmlFor="repayment_duration" className="block text-sm font-medium text-gray-700 mb-2">
                                Durée de remboursement <span className="text-red-500">*</span>
                                        </label>
                            <input 
                                type="text" 
                                id="repayment_duration" 
                                name="repayment_duration" 
                                required
                                value={formData.repayment_duration}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: 60 mois" 
                            />
                                    </div>
                                </div>
                                
                                <div className="mt-4 space-y-3">
                                    <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="no_guarantee" 
                                name="no_guarantee"
                                checked={formData.no_guarantee}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" 
                            />
                                        <span className="ml-2 text-sm text-gray-700">Sans garantie/caution</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="grace_period_available" 
                                name="grace_period_available"
                                checked={formData.grace_period_available}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" 
                            />
                                        <span className="ml-2 text-sm text-gray-700">Période de grâce disponible</span>
                                    </label>
                                </div>
                            </div>

                {/* Localisation */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-map-marker-alt mr-2 text-purple-600"></i>
                        Localisation
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                Pays
                                        </label>
                            <select 
                                id="country" 
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                            >
                                <option value="">Sélectionner un pays</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                                Région
                                        </label>
                            <select 
                                id="region" 
                                name="region"
                                value={formData.region}
                                onChange={handleInputChange}
                                disabled={!formData.country}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 disabled:bg-gray-100"
                            >
                                <option value="">{formData.country ? 'Sélectionner une région' : 'Sélectionnez d\'abord un pays'}</option>
                                {regions.map(region => (
                                    <option key={region.id} value={region.id}>{region.name}</option>
                                ))}
                            </select>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                            <label htmlFor="geographic_zone" className="block text-sm font-medium text-gray-700 mb-2">
                                Zone géographique
                            </label>
                            <input 
                                type="text" 
                                id="geographic_zone" 
                                name="geographic_zone"
                                value={formData.geographic_zone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: Dakar, Thiès, Saint-Louis" 
                            />
                        </div>
                    </div>
                </div>

                {/* Secteurs d'activité */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-briefcase mr-2 text-indigo-600"></i>
                        Secteurs d'activité
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="job_function" className="block text-sm font-medium text-gray-700 mb-2">
                                Fonction/Poste
                            </label>
                            <select 
                                id="job_function" 
                                name="job_function"
                                value={formData.job_function}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                            >
                                <option value="">Sélectionner</option>
                                {jobFunctions.map(func => (
                                    <option key={func.id} value={func.id}>{func.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="activity_sector" className="block text-sm font-medium text-gray-700 mb-2">
                                Secteur d'activité
                                        </label>
                            <select 
                                id="activity_sector" 
                                name="activity_sector"
                                value={formData.activity_sector}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                            >
                                <option value="">Sélectionner</option>
                                {activitySectors.map(sector => (
                                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                                ))}
                            </select>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-file-alt mr-2 text-indigo-600"></i>
                                    Description du financement
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Description détaillée <span className="text-red-500">*</span>
                                        </label>
                            <textarea 
                                id="description" 
                                name="description" 
                                rows="6" 
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                                  placeholder="Décrivez en détail votre offre de financement, ses avantages et spécificités..."></textarea>
                                    </div>
                                    
                                    <div>
                            <label htmlFor="eligibility_conditions" className="block text-sm font-medium text-gray-700 mb-2">
                                            Conditions d'éligibilité <span className="text-red-500">*</span>
                                        </label>
                            <textarea 
                                id="eligibility_conditions" 
                                name="eligibility_conditions" 
                                rows="4" 
                                required
                                value={formData.eligibility_conditions}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                                  placeholder="Listez les conditions requises, documents à fournir, critères de sélection..."></textarea>
                                    </div>
                                    
                                    <div>
                            <label htmlFor="application_process" className="block text-sm font-medium text-gray-700 mb-2">
                                Processus de candidature <span className="text-red-500">*</span>
                                        </label>
                            <textarea 
                                id="application_process" 
                                name="application_process" 
                                rows="3"
                                required
                                value={formData.application_process}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                                  placeholder="Expliquez les étapes de candidature, délais de traitement, modalités de sélection..."></textarea>
                                    </div>
                                </div>
                            </div>

                {/* Paramètres de candidature */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i className="fas fa-cog mr-2 text-orange-600"></i>
                                    Paramètres de candidature
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                            <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-2">
                                Date limite de candidature <span className="text-red-500">*</span>
                                        </label>
                            <input 
                                type="datetime-local" 
                                id="application_deadline" 
                                name="application_deadline"
                                required
                                value={formData.application_deadline}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500" />
                                    </div>
                                    
                                    <div>
                            <label htmlFor="max_applications" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre maximum de candidatures
                                        </label>
                            <input 
                                type="number" 
                                id="max_applications" 
                                name="max_applications" 
                                min="1"
                                value={formData.max_applications}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                               placeholder="Ex: 100" />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                            <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
                                            Informations de contact <span className="text-red-500">*</span>
                                        </label>
                            <textarea 
                                id="contact_info" 
                                name="contact_info" 
                                rows="2" 
                                required
                                value={formData.contact_info}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                                  placeholder="Email, téléphone, adresse physique pour les candidatures..."></textarea>
                                    </div>
                                </div>
                                
                                <div className="mt-4 space-y-3">
                                    <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="business_plan_required" 
                                name="business_plan_required"
                                checked={formData.business_plan_required}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">Plan d'affaires requis</span>
                                    </label>
                                    
                                    <label className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="financial_statements_required" 
                                name="financial_statements_required"
                                checked={formData.financial_statements_required}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" />
                                        <span className="ml-2 text-sm text-gray-700">États financiers requis</span>
                                    </label>
                                </div>
                            </div>

                {/* Actions du formulaire */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button 
                            type="button" 
                            onClick={() => navigate('/recruteur/gestion-financements')}
                            className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 flex items-center justify-center"
                        >
                            <i className="fas fa-times mr-2"></i>
                            Annuler
                                    </button>
                                    
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 sm:flex-initial px-6 py-3 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200 flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    {isEditing ? 'Modification en cours...' : 'Création en cours...'}
                                </>
                            ) : (
                                <>
                                    <i className={`${isEditing ? 'fas fa-save' : 'fas fa-paper-plane'} mr-2`}></i>
                                    {isEditing ? 'Mettre à jour le financement' : 'Publier le financement'}
                                </>
                            )}
                                    </button>
                                </div>
                                
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Votre offre de financement sera examinée par notre équipe avant publication (24-48h)
                                </p>
                            </div>
                        </form>
                    </div>
    );
};

export default CreeFinacement;
