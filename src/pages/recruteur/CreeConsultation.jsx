import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';

const CreeConsultation = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    // États pour les données de référence
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);

    // États du formulaire
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        country: '',
        region: '',
        documents: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Vérifier l'authentification
    useEffect(() => {
        if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    // Charger les pays et consultation (si édition) au montage
    useEffect(() => {
        loadCountries();
        if (editId) {
            loadConsultationForEdit(editId);
        }
    }, [editId]);

    // Charger les régions quand un pays est sélectionné
    useEffect(() => {
        if (formData.country) {
            loadRegions(formData.country);
        }
    }, [formData.country]);

    // Charger la consultation pour édition
    const loadConsultationForEdit = async (consultationId) => {
        try {
            setLoading(true);
            const consultation = await consultationService.getConsultationOfferDetail(consultationId);
            setFormData({
                title: consultation.title || '',
                description: consultation.description || '',
                country: consultation.country?.id ? consultation.country.id.toString() : '',
                region: consultation.region?.id ? consultation.region.id.toString() : '',
                documents: null
            });
        } catch (error) {
            setError('Erreur lors du chargement de la consultation');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Charger les pays
    const loadCountries = async () => {
        try {
            setLoading(true);
            const countriesData = await consultationService.getCountries();
            setCountries(countriesData);
        } catch (error) {
            setError('Erreur lors du chargement des pays');
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

    // Gérer les changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Valider les champs requis
            if (!formData.title.trim()) {
                throw new Error('Le titre est obligatoire');
            }
            if (!formData.description.trim()) {
                throw new Error('La description est obligatoire');
            }

            // Préparer les données pour l'API
            const apiData = {
                title: formData.title,
                description: formData.description
            };

            if (formData.country) {
                apiData.country = parseInt(formData.country);
            }
            if (formData.region) {
                apiData.region = parseInt(formData.region);
            }

            if (editId) {
                // Mode édition
                if (formData.documents) {
                    const formDataWithFiles = new FormData();
                    formDataWithFiles.append('title', formData.title);
                    formDataWithFiles.append('description', formData.description);
                    if (formData.country) {
                        formDataWithFiles.append('country', parseInt(formData.country));
                    }
                    if (formData.region) {
                        formDataWithFiles.append('region', parseInt(formData.region));
                    }
                    formDataWithFiles.append('documents', formData.documents);
                    await consultationService.updateConsultationOfferWithFiles(editId, formDataWithFiles);
                } else {
                    await consultationService.updateConsultationOffer(editId, apiData);
                }
                setSuccessMessage('Offre de consultation mise à jour avec succès !');
            } else {
                // Mode création
                if (formData.documents) {
                    const formDataWithFiles = new FormData();
                    formDataWithFiles.append('title', formData.title);
                    formDataWithFiles.append('description', formData.description);
                    if (formData.country) {
                        formDataWithFiles.append('country', parseInt(formData.country));
                    }
                    if (formData.region) {
                        formDataWithFiles.append('region', parseInt(formData.region));
                    }
                    formDataWithFiles.append('documents', formData.documents);
                    await consultationService.createConsultationOfferWithFiles(formDataWithFiles);
                } else {
                    await consultationService.createConsultationOffer(apiData);
                }
                setSuccessMessage('Offre de consultation créée avec succès !');
            }

            // Rediriger après un délai
            setTimeout(() => {
                navigate('/recruteur/gestion-consultations', { replace: true });
            }, 2000);
        } catch (error) {
            setError(error.message || 'Erreur lors de la sauvegarde de l\'offre');
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
                            <i className="fas fa-handshake mr-2 text-fuchsia-600"></i>
                            {editId ? 'Modifier l\'offre de consultation' : 'Créer une offre de consultation'}
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            {editId ? 'Mettez à jour votre offre de consultation' : 'Proposez vos services de consultation aux clients qui en ont besoin'}
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="bg-fuchsia-50 p-3 rounded-lg">
                            <i className="fas fa-briefcase text-2xl text-fuchsia-600"></i>
                        </div>
                    </div>
                </div>
            </div>

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

                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Titre de la consultation <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                placeholder="Ex: Consultation Stratégie Marketing"
                            />
                        </div>

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
                                placeholder="Décrivez en détail votre offre de consultation, vos domaines d'expertise, les services proposés..."
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
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i className="fas fa-file-upload mr-2 text-indigo-600"></i>
                        Documents (optionnel)
                    </h2>

                    <div>
                        <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-2">
                            Joindre des documents
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-fuchsia-500 transition">
                            <input
                                type="file"
                                id="documents"
                                name="documents"
                                onChange={handleInputChange}
                                className="hidden"
                                accept="*/*"
                            />
                            <label htmlFor="documents" className="cursor-pointer">
                                <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2 block"></i>
                                <p className="text-sm text-gray-600">
                                    Cliquez pour sélectionner un fichier ou glissez-le ici
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.documents ? formData.documents.name : 'Aucun fichier sélectionné'}
                                </p>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions du formulaire */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/recruteur/gestion-consultations')}
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
                                    {editId ? 'Mise à jour en cours...' : 'Création en cours...'}
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    {editId ? 'Mettre à jour l\'offre' : 'Créer l\'offre de consultation'}
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                        <i className="fas fa-info-circle mr-1"></i>
                        Votre offre sera examinée par notre équipe avant publication (24-48h)
                    </p>
                </div>
            </form>
        </div>
    );
};

export default CreeConsultation;
