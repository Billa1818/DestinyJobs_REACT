import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';

const CreeFinancement = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuth();
    
    // États pour les données de référence
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    
    // États du formulaire - aligné avec la documentation API
    const [formData, setFormData] = useState({
        title: '',
        objective: '',
        eligibility_criteria: '',
        countries_covered: '',
        project_duration: '',
        contact_email: '',
        organization_name: '',
        more_info_source: '',
        montant: '',
        contact_info: '',
        date_limite: '',
        is_external_application: false,
        external_application_url: '',
        company_website_url: '',
        country_id: '',
        region_id: ''
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
        if (formData.country_id) {
            loadRegions(formData.country_id);
        }
    }, [formData.country_id]);

    // Charger toutes les données de référence
    const loadReferenceData = async () => {
        try {
            setLoading(true);
            
            const countriesData = await consultationService.getCountries();
            setCountries(countriesData);
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
                objective: fundingData.objective || '',
                eligibility_criteria: fundingData.eligibility_criteria || '',
                countries_covered: fundingData.countries_covered || '',
                project_duration: fundingData.project_duration || '',
                contact_email: fundingData.contact_email || '',
                organization_name: fundingData.organization_name || '',
                more_info_source: fundingData.more_info_source || '',
                montant: fundingData.montant?.toString() || '',
                contact_info: fundingData.contact_info || '',
                date_limite: fundingData.date_limite ? 
                    fundingData.date_limite.slice(0, 19) : '',
                is_external_application: fundingData.is_external_application || false,
                external_application_url: fundingData.external_application_url || '',
                company_website_url: fundingData.company_website_url || '',
                country_id: fundingData.country?.id?.toString() || '',
                region_id: fundingData.region?.id?.toString() || ''
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

    // Valider le formulaire
    const validateForm = () => {
        const requiredFields = [
            'title',
            'objective',
            'eligibility_criteria',
            'countries_covered',
            'project_duration',
            'contact_email',
            'organization_name',
            'more_info_source',
            'contact_info',
            'company_website_url',
            'date_limite'
        ];

        for (let field of requiredFields) {
            if (!formData[field]) {
                return `Le champ "${field}" est obligatoire`;
            }
        }

        // Valider email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.contact_email)) {
            return 'L\'email de contact n\'est pas valide';
        }

        // Valider URL de la plateforme
        try {
            new URL(formData.company_website_url);
        } catch (e) {
            return 'L\'URL de la plateforme n\'est pas valide';
        }

        // Si application externe, l'URL est obligatoire
        if (formData.is_external_application && !formData.external_application_url) {
            return 'L\'URL de candidature externe est obligatoire';
        }

        if (formData.is_external_application && formData.external_application_url) {
            try {
                new URL(formData.external_application_url);
            } catch (e) {
                return 'L\'URL de candidature externe n\'est pas valide';
            }
        }

        return null;
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Valider le formulaire
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            // Préparer les données pour l'API
            const apiData = {
                title: formData.title,
                objective: formData.objective,
                eligibility_criteria: formData.eligibility_criteria,
                countries_covered: formData.countries_covered,
                project_duration: formData.project_duration,
                contact_email: formData.contact_email,
                organization_name: formData.organization_name,
                more_info_source: formData.more_info_source,
                montant: formData.montant ? parseFloat(formData.montant) : null,
                contact_info: formData.contact_info,
                date_limite: formData.date_limite ? new Date(formData.date_limite).toISOString() : null,
                is_external_application: formData.is_external_application,
                external_application_url: formData.is_external_application ? formData.external_application_url : null,
                company_website_url: formData.company_website_url,
                country_id: formData.country_id ? parseInt(formData.country_id) : null,
                region_id: formData.region_id ? parseInt(formData.region_id) : null
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
                                                    Attention : Offre déjà approuvée
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
                                maxLength="200"
                                required 
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: Financement PME - Secteur Technologie" 
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nom de l'organisation <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="organization_name" 
                                name="organization_name" 
                                maxLength="200"
                                required
                                value={formData.organization_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: FondFrance" 
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
                                Objectif du financement <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                id="objective" 
                                name="objective" 
                                rows="3" 
                                required
                                value={formData.objective}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Décrivez l'objectif principal du financement..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Détails du financement */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-calculator mr-2 text-green-600"></i>
                        Détails du financement
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-2">
                                Montant (euros)
                            </label>
                            <input 
                                type="number" 
                                id="montant" 
                                name="montant" 
                                min="0"
                                step="0.01"
                                value={formData.montant}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: 50000.00" 
                            />
                        </div>

                        <div>
                            <label htmlFor="project_duration" className="block text-sm font-medium text-gray-700 mb-2">
                                Durée du projet <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="project_duration" 
                                name="project_duration" 
                                maxLength="100"
                                required
                                value={formData.project_duration}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: 12 mois" 
                            />
                        </div>
                    </div>
                </div>

                {/* Critères et conditions */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-file-alt mr-2 text-indigo-600"></i>
                        Critères et conditions
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="eligibility_criteria" className="block text-sm font-medium text-gray-700 mb-2">
                                Critères d'éligibilité <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                id="eligibility_criteria" 
                                name="eligibility_criteria" 
                                rows="4" 
                                required
                                value={formData.eligibility_criteria}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: Startups moins de 3 ans, secteur IT, chiffre d'affaires minimum..."
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="countries_covered" className="block text-sm font-medium text-gray-700 mb-2">
                                Pays couverts <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="countries_covered" 
                                name="countries_covered" 
                                maxLength="500"
                                required
                                value={formData.countries_covered}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: France, Belgique, Suisse" 
                            />
                        </div>
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
                            <label htmlFor="country_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Pays
                            </label>
                            <select 
                                id="country_id" 
                                name="country_id"
                                value={formData.country_id}
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
                            <label htmlFor="region_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Région
                            </label>
                            <select 
                                id="region_id" 
                                name="region_id"
                                value={formData.region_id}
                                onChange={handleInputChange}
                                disabled={!formData.country_id}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 disabled:bg-gray-100"
                            >
                                <option value="">{formData.country_id ? 'Sélectionner une région' : 'Sélectionnez d\'abord un pays'}</option>
                                {regions.map(region => (
                                    <option key={region.id} value={region.id}>{region.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Informations de contact et source */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-envelope mr-2 text-orange-600"></i>
                        Informations de contact
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email de contact <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="contact_email" 
                                name="contact_email" 
                                required
                                value={formData.contact_email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="contact@example.com" 
                            />
                        </div>

                        <div>
                            <label htmlFor="company_website_url" className="block text-sm font-medium text-gray-700 mb-2">
                                URL de la plateforme/site <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="url" 
                                id="company_website_url" 
                                name="company_website_url" 
                                required
                                value={formData.company_website_url}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="https://www.company.com" 
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
                                Informations de contact détaillées <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                id="contact_info" 
                                name="contact_info" 
                                rows="2" 
                                required
                                value={formData.contact_info}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Tel: +33 1 23 45 67 89, Email: contact@example.com"
                            ></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="more_info_source" className="block text-sm font-medium text-gray-700 mb-2">
                                Source d'informations supplémentaires <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="url" 
                                id="more_info_source" 
                                name="more_info_source" 
                                maxLength="200"
                                required
                                value={formData.more_info_source}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="https://www.example.com" 
                            />
                        </div>
                    </div>
                </div>

                {/* Candidature */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-cog mr-2 text-orange-600"></i>
                        Candidature
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="md:col-span-2">
                            <label className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="is_external_application" 
                                    name="is_external_application"
                                    checked={formData.is_external_application}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" 
                                />
                                <span className="ml-2 text-sm text-gray-700">Candidature externe</span>
                            </label>
                        </div>

                        {formData.is_external_application && (
                            <div className="md:col-span-2">
                                <label htmlFor="external_application_url" className="block text-sm font-medium text-gray-700 mb-2">
                                    URL de candidature externe <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="url" 
                                    id="external_application_url" 
                                    name="external_application_url" 
                                    value={formData.external_application_url}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                    placeholder="https://apply.example.com" 
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="date_limite" className="block text-sm font-medium text-gray-700 mb-2">
                                Date limite de candidature <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="datetime-local" 
                                id="date_limite" 
                                name="date_limite"
                                required
                                value={formData.date_limite}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500" 
                            />
                        </div>
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
                                    {isEditing ? 'Mettre à jour le financement' : 'Créer le financement'}
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

export default CreeFinancement;
