import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import consultationService from '../../services/consultationService';

const CreeConsultation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [consultationTypes, setConsultationTypes] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    consultation_type: '',
    expertise_sector: '',
    delivery_mode: '',
    estimated_duration: '',
    application_deadline: '',
    pricing_type: '',
    price: '',
    is_urgent: false,
    detailed_report_included: false,
    client_type: '',
    company_size: '',
    geographic_zone: '',
    description: '',
    objectives: '',
    methodology: '',
    deliverables: '',
    required_experience_years: '',
    max_concurrent_projects: '',
    contact_info: '',
    portfolio_required: false,
    on_site_presence_required: false,
    country: '',
    region: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConsultation, setCurrentConsultation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setIsEditing(true);
      loadConsultationForEdit(editId);
    }
  }, [searchParams]);

  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    if (formData.country) {
      loadRegions(formData.country);
    }
  }, [formData.country]);

  const loadReferenceData = async () => {
    try {
      setLoading(true);

      const [
        countriesData,
        consultationTypesData
      ] = await Promise.all([
        consultationService.getCountries(),
        consultationService.getConsultationTypes()
      ]);

      setCountries(countriesData);
      setConsultationTypes(consultationTypesData);
    } catch (error) {
      setError('Erreur lors du chargement des données de référence');
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async (countryId) => {
    try {
      const regionsData = await consultationService.getRegionsByCountry(countryId);
      setRegions(regionsData);
    } catch (error) {
      // Erreur réseau
    }
  };

  const loadConsultationForEdit = async (consultationId) => {
    try {
      setLoading(true);
      setError(null);

      const consultationData = await consultationService.getConsultationOfferDetail(consultationId);
      setCurrentConsultation(consultationData);

      setFormData({
        title: consultationData.title || '',
        consultation_type: consultationData.consultation_type?.id?.toString() || '',
        expertise_sector: consultationData.expertise_sector || '',
        delivery_mode: consultationData.delivery_mode || '',
        estimated_duration: consultationData.estimated_duration || '',
        application_deadline: consultationData.application_deadline || '',
        pricing_type: consultationData.pricing_type || '',
        price: consultationData.price?.toString() || '',
        is_urgent: consultationData.is_urgent || false,
        detailed_report_included: consultationData.detailed_report_included || false,
        client_type: consultationData.client_type || '',
        company_size: consultationData.company_size || '',
        geographic_zone: consultationData.geographic_zone || '',
        description: consultationData.description || '',
        objectives: consultationData.objectives || '',
        methodology: consultationData.methodology || '',
        deliverables: consultationData.deliverables || '',
        required_experience_years: consultationData.required_experience_years?.toString() || '',
        max_concurrent_projects: consultationData.max_concurrent_projects?.toString() || '',
        contact_info: consultationData.contact_info || '',
        portfolio_required: consultationData.portfolio_required || false,
        on_site_presence_required: consultationData.on_site_presence_required || false,
        country: consultationData.country?.id?.toString() || '',
        region: consultationData.region?.id?.toString() || ''
      });

      if (consultationData.country?.id) {
        loadRegions(consultationData.country.id);
      }

      setSuccessMessage(`Mode édition activé pour la consultation "${consultationData.title}"`);
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement de la consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        consultation_type: formData.consultation_type ? parseInt(formData.consultation_type) : null,
        required_experience_years: formData.required_experience_years ? parseInt(formData.required_experience_years) : null,
        max_concurrent_projects: formData.max_concurrent_projects ? parseInt(formData.max_concurrent_projects) : null,
        country: formData.country ? parseInt(formData.country) : null,
        region: formData.region ? parseInt(formData.region) : null,
        application_deadline: formData.application_deadline ? new Date(formData.application_deadline).toISOString().split('T')[0] : null,
      };

      if (isEditing && currentConsultation) {
        await consultationService.updateConsultationOffer(currentConsultation.id, apiData);
        setSuccessMessage('Offre de consultation mise à jour avec succès !');
      } else {
        await consultationService.createConsultationOffer(apiData);
        setSuccessMessage('Offre de consultation créée avec succès !');
      }

      setTimeout(() => {
        navigate('/recruteur/gestion-consultations', { replace: true });
      }, 2000);
    } catch (error) {
      setError(error.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recruteur/gestion-consultations', { replace: true });
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
              {isEditing ? 'Modifier une offre de consultation' : 'Créer une offre de consultation'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {isEditing
                ? 'Modifiez votre offre de consultation existante'
                : 'Proposez vos services de consultation aux entreprises'
              }
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-fuchsia-50 p-3 rounded-lg">
              <i className="fas fa-lightbulb text-2xl text-fuchsia-600"></i>
            </div>
          </div>
        </div>

        {isEditing && currentConsultation && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-info-circle text-blue-400"></i>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Modification de la consultation : {currentConsultation.title}
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Statut actuel :</strong>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      currentConsultation.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      currentConsultation.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                      currentConsultation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      currentConsultation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      currentConsultation.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {currentConsultation.status === 'DRAFT' ? 'Brouillon' :
                       currentConsultation.status === 'PENDING_APPROVAL' ? 'En attente d\'approbation' :
                       currentConsultation.status === 'REJECTED' ? 'Refusée' :
                       currentConsultation.status === 'APPROVED' ? 'Approuvée' :
                       currentConsultation.status === 'PUBLISHED' ? 'Publiée' :
                       currentConsultation.status}
                    </span>
                  </p>
                  <p><strong>Créée le :</strong> {new Date(currentConsultation.created_at).toLocaleDateString('fr-FR')}</p>
                  {currentConsultation.updated_at && (
                    <p><strong>Dernière modification :</strong> {new Date(currentConsultation.updated_at).toLocaleDateString('fr-FR')}</p>
                  )}

                  {(currentConsultation.status === 'APPROVED' || currentConsultation.status === 'PUBLISHED') && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start">
                        <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5 mr-2"></i>
                        <div>
                          <p className="text-sm font-medium text-yellow-800 mb-1">
                            ⚠️ Attention : Consultation déjà approuvée
                          </p>
                          <p className="text-xs text-yellow-700">
                            Si vous modifiez cette consultation, elle devra attendre une nouvelle approbation avant d'être republiée.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-blue-600 mt-2">
                    <i className="fas fa-lightbulb mr-1"></i>
                    {currentConsultation.status === 'DRAFT' ? 'Vous pouvez modifier cette consultation à tout moment.' :
                     currentConsultation.status === 'PENDING_APPROVAL' ? 'Modifiez cette consultation si nécessaire, elle sera re-soumise pour approbation.' :
                     currentConsultation.status === 'REJECTED' ? 'Corrigez cette consultation selon les commentaires, elle sera re-soumise pour approbation.' :
                     currentConsultation.status === 'APPROVED' ? 'Cette consultation est approuvée. Toute modification nécessitera une nouvelle approbation.' :
                     currentConsultation.status === 'PUBLISHED' ? 'Cette consultation est publiée. Toute modification nécessitera une nouvelle approbation.' :
                     'Cette consultation peut être modifiée.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-2 text-blue-600"></i>
              Informations générales
            </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la consultation <span className="text-red-500">*</span>
              </label>
                <input type="text" id="title" name="title" required
                       value={formData.title} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: Consultation en Stratégie Digitale" />
              </div>

              <div>
                <label htmlFor="consultation_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de consultation <span className="text-red-500">*</span>
                </label>
                <select id="consultation_type" name="consultation_type" required
                        value={formData.consultation_type} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option value="">Sélectionner un type</option>
                  {consultationTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="expertise_sector" className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'expertise <span className="text-red-500">*</span>
                </label>
                <input type="text" id="expertise_sector" name="expertise_sector" required
                       value={formData.expertise_sector} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: Transformation Digitale" />
              </div>

              <div>
                <label htmlFor="delivery_mode" className="block text-sm font-medium text-gray-700 mb-2">
                  Mode de livraison <span className="text-red-500">*</span>
                </label>
                <select id="delivery_mode" name="delivery_mode" required
                        value={formData.delivery_mode} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option value="">Sélectionner un mode</option>
                  <option value="REMOTE">À distance</option>
                  <option value="ON_SITE">Sur site</option>
                  <option value="HYBRID">Hybride</option>
                </select>
              </div>

              <div>
                <label htmlFor="estimated_duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Durée estimée <span className="text-red-500">*</span>
                </label>
                <input type="text" id="estimated_duration" name="estimated_duration" required
                       value={formData.estimated_duration} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: 3 mois" />
              </div>

              <div>
                <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Date limite d'application <span className="text-red-500">*</span>
                </label>
                <input type="date" id="application_deadline" name="application_deadline" required
                       value={formData.application_deadline ? formData.application_deadline.split('T')[0] : ''} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500" />
            </div>
            
            <div>
                <label htmlFor="pricing_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de tarification <span className="text-red-500">*</span>
              </label>
                <select id="pricing_type" name="pricing_type" required
                        value={formData.pricing_type} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option value="">Sélectionner un type</option>
                  <option value="HOURLY">À l'heure</option>
                  <option value="DAILY">À la journée</option>
                  <option value="PROJECT">Au projet</option>
              </select>
            </div>
            
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (FCFA) <span className="text-red-500">*</span>
                </label>
                <input type="number" id="price" name="price" required min="0"
                       value={formData.price} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: 1500000" />
              </div>

              <div>
                <label htmlFor="client_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de client <span className="text-red-500">*</span>
              </label>
                <select id="client_type" name="client_type" required
                        value={formData.client_type} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option value="">Sélectionner un type</option>
                  <option value="STARTUP">Startup</option>
                  <option value="SME">PME</option>
                  <option value="LARGE_CORP">Grande entreprise</option>
                  <option value="NGO">ONG</option>
                  <option value="GOVERNMENT">Gouvernement</option>
              </select>
            </div>
            
            <div>
                <label htmlFor="company_size" className="block text-sm font-medium text-gray-700 mb-2">
                  Taille de l'entreprise
                </label>
                <input type="text" id="company_size" name="company_size"
                       value={formData.company_size} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: 50-100 employés" />
              </div>

              <div>
                <label htmlFor="geographic_zone" className="block text-sm font-medium text-gray-700 mb-2">
                  Zone géographique
                </label>
                <input type="text" id="geographic_zone" name="geographic_zone"
                       value={formData.geographic_zone} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: Dakar, Thiès" />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Pays <span className="text-red-500">*</span>
              </label>
                <select id="country" name="country" required
                        value={formData.country} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
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
                <select id="region" name="region"
                        value={formData.region} onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option value="">Sélectionner une région</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-file-alt mr-2 text-green-600"></i>
              Détails de la consultation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée <span className="text-red-500">*</span>
                </label>
                <textarea id="description" name="description" required rows="4"
                          value={formData.description} onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                          placeholder="Décrivez en détail votre offre de consultation..." />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-2">
                  Objectifs <span className="text-red-500">*</span>
                </label>
                <textarea id="objectives" name="objectives" required rows="3"
                          value={formData.objectives} onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                          placeholder="Quels sont les objectifs de cette consultation ?" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                  Méthodologie <span className="text-red-500">*</span>
                </label>
                <textarea id="methodology" name="methodology" required rows="3"
                          value={formData.methodology} onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                          placeholder="Décrivez votre approche et méthodologie..." />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700 mb-2">
                  Livrables <span className="text-red-500">*</span>
                </label>
                <textarea id="deliverables" name="deliverables" required rows="3"
                          value={formData.deliverables} onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                          placeholder="Quels sont les livrables de cette consultation ?" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-cog mr-2 text-purple-600"></i>
              Exigences et conditions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
                <label htmlFor="required_experience_years" className="block text-sm font-medium text-gray-700 mb-2">
                  Années d'expérience requises
              </label>
                <input type="number" id="required_experience_years" name="required_experience_years" min="0"
                       value={formData.required_experience_years} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: 5" />
            </div>
            
            <div>
                <label htmlFor="max_concurrent_projects" className="block text-sm font-medium text-gray-700 mb-2">
                  Projets simultanés max
              </label>
                <input type="number" id="max_concurrent_projects" name="max_concurrent_projects" min="1"
                       value={formData.max_concurrent_projects} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: 3" />
            </div>
            
            <div>
                <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
                  Informations de contact <span className="text-red-500">*</span>
                </label>
                <input type="text" id="contact_info" name="contact_info" required
                       value={formData.contact_info} onChange={handleInputChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                       placeholder="Ex: contact@consulting.sn" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="is_urgent" name="is_urgent"
                       checked={formData.is_urgent} onChange={handleInputChange}
                       className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" />
                <label htmlFor="is_urgent" className="ml-2 block text-sm text-gray-900">
                  Consultation urgente
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="detailed_report_included" name="detailed_report_included"
                       checked={formData.detailed_report_included} onChange={handleInputChange}
                       className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" />
                <label htmlFor="detailed_report_included" className="ml-2 block text-sm text-gray-900">
                  Rapport détaillé inclus
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="portfolio_required" name="portfolio_required"
                       checked={formData.portfolio_required} onChange={handleInputChange}
                       className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" />
                <label htmlFor="portfolio_required" className="ml-2 block text-sm text-gray-900">
                  Portfolio requis
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="on_site_presence_required" name="on_site_presence_required"
                       checked={formData.on_site_presence_required} onChange={handleInputChange}
                       className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded" />
                <label htmlFor="on_site_presence_required" className="ml-2 block text-sm text-gray-900">
                  Présence sur site requise
              </label>
            </div>
          </div>
        </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </span>
              ) : (
                <span>{isEditing ? 'Mettre à jour' : 'Créer la consultation'}</span>
              )}
            </button>
          </div>
        </form>
        </div>
    </div>
  );
};

export default CreeConsultation;
