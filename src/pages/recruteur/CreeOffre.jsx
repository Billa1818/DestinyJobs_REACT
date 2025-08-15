import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

const CreeOffre = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentOffre, setCurrentOffre] = useState(null); // Nouvel état pour l'offre en cours d'édition
  
  // États pour les listes de référence
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  // État du formulaire basé sur l'API
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    category: '',
    contract_type: '',
    experience_required: '',
    work_mode: '',
    salary_type: '',
    salary_min: '',
    salary_max: '',
    location: '',
    company_size: '',
    profile_sought: '',
    additional_info: '',
    application_deadline: '',
    position_name: '',
    cv_required: true,
    motivation_letter_required: false,
    is_urgent: false,
    country: null,
    region: null
  });

  // Vérifier si on est en mode édition
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editParam = searchParams.get('edit');
    
    if (editParam) {
      setIsEditing(true);
      setEditId(editParam);
      // Charger les données de l'offre à modifier
      fetchJobOffer(editParam);
    }
  }, [location.search]);

  // Charger les départements au montage du composant
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Charger les catégories quand un département est sélectionné
  useEffect(() => {
    if (selectedDepartment) {
      fetchCategories(selectedDepartment);
    }
  }, [selectedDepartment]);

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Récupérer les départements
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/jobs/departments/');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      // Erreur réseau
    }
  };

  // Récupérer les catégories d'un département
  const fetchCategories = async (departmentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/jobs/categories/?department=${departmentId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      // Erreur réseau
    }
  };

  // Récupérer une offre d'emploi pour l'édition
  const fetchJobOffer = async (jobId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer le token d'authentification
      const token = authService.getAccessToken();
      if (!token) {
        setError('Token d\'authentification manquant. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/jobs/job-offers/${jobId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const jobData = await response.json();
        
        // Vérifier si l'offre est modifiable selon la documentation
        const editableStatuses = ['DRAFT', 'PENDING_APPROVAL', 'REJECTED', 'APPROVED', 'PUBLISHED'];
        const isEditable = editableStatuses.includes(jobData.status);
        
        if (!isEditable) {
          setError(`Cette offre ne peut pas être modifiée car son statut est "${jobData.status}". Seules les offres en brouillon, en attente d'approbation, refusées, approuvées ou publiées peuvent être modifiées.`);
          return;
        }

        // Vérifier que l'utilisateur est bien le créateur de l'offre
        if (jobData.recruiter?.user?.id !== user.id) {
          setError('Vous n\'êtes pas autorisé à modifier cette offre.');
          return;
        }

        // Stocker les informations de l'offre pour l'affichage
        setCurrentOffre(jobData);
        
        // Afficher un avertissement pour les offres approuvées
        if (jobData.status === 'APPROVED' || jobData.status === 'PUBLISHED') {
          setSuccessMessage(`Mode édition activé pour l'offre "${jobData.title}". ⚠️ Attention : Toute modification nécessitera une nouvelle approbation.`);
        } else {
          setSuccessMessage(`Mode édition activé pour l'offre "${jobData.title}"`);
        }
        
        // Mettre à jour le formulaire avec les données de l'offre
        setFormData({
          title: jobData.title || '',
          description: jobData.description || '',
          department: jobData.department?.id || jobData.department || '',
          category: jobData.category?.id || jobData.category || '',
          contract_type: jobData.contract_type || '',
          experience_required: jobData.experience_required || '',
          work_mode: jobData.work_mode || '',
          salary_type: jobData.salary_type || '',
          salary_min: jobData.salary_min || '',
          salary_max: jobData.salary_max || '',
          location: jobData.location || '',
          company_size: jobData.company_size || '',
          profile_sought: jobData.profile_sought || '',
          additional_info: jobData.additional_info || '',
          application_deadline: jobData.application_deadline || '',
          position_name: jobData.position_name || '',
          cv_required: jobData.cv_required ?? true,
          motivation_letter_required: jobData.motivation_letter_required ?? false,
          is_urgent: jobData.is_urgent ?? false,
          country: jobData.country?.id || jobData.country || null,
          region: jobData.region?.id || jobData.region || null
        });
        
        // Mettre à jour le département sélectionné pour charger les catégories
        const departmentId = jobData.department?.id || jobData.department;
        if (departmentId) {
          setSelectedDepartment(departmentId);
        }
        
      } else if (response.status === 403) {
        setError('Vous n\'êtes pas autorisé à modifier cette offre. Seul le créateur peut la modifier.');
      } else if (response.status === 404) {
        setError('Offre non trouvée. Elle a peut-être été supprimée.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setError('Erreur de connexion lors du chargement de l\'offre. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'department') {
      setSelectedDepartment(value);
      setFormData(prev => ({ ...prev, [name]: value, category: '' }));
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Préparer les données pour l'API
      const apiData = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        department: parseInt(formData.department),
        category: parseInt(formData.category)
      };

      // Utiliser les bons endpoints selon la documentation
      const url = isEditing 
        ? `http://localhost:8000/api/jobs/job-offers/${editId}/`
        : 'http://localhost:8000/api/jobs/job-offers/';
      
      // Utiliser PATCH pour la modification (recommandé selon la documentation)
      const method = isEditing ? 'PATCH' : 'POST';
      
      // Récupérer le token d'authentification via authService
      const token = authService.getAccessToken();
      
      if (!token) {
        setError('Token d\'authentification manquant. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      if (response.ok) {
        const result = await response.json();
        
        setSuccessMessage(
          isEditing 
            ? `Offre d'emploi "${result.title}" modifiée avec succès ! Statut: ${result.status}` 
            : 'Offre d\'emploi créée avec succès !'
        );
        
        // Rediriger après un délai
        setTimeout(() => {
          navigate('/recruteur/gestion-offres', { replace: true });
        }, 2000);
    } else {
        // Gérer les erreurs selon la documentation
        const errorData = await response.json();
        
        if (response.status === 403) {
          setError('Vous n\'êtes pas autorisé à modifier cette offre. Seul le créateur peut la modifier.');
        } else if (response.status === 400) {
          // Gérer les erreurs de validation
          const validationErrors = [];
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              validationErrors.push(`${field}: ${errorData[field].join(', ')}`);
            } else {
              validationErrors.push(`${field}: ${errorData[field]}`);
            }
          });
          setError(`Erreurs de validation: ${validationErrors.join(' | ')}`);
        } else if (response.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 404) {
          setError('Offre non trouvée. Elle a peut-être été supprimée.');
        } else {
        setError(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/recruteur/gestion-offres', { replace: true });
  };

  if (loading && isEditing) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-fuchsia-600 mb-4"></i>
          <p className="text-gray-600">Chargement de l'offre...</p>
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
              <i className={`${isEditing ? 'fas fa-edit' : 'fas fa-plus-circle'} mr-2 text-fuchsia-600`}></i>
              {isEditing ? 'Modifier une offre d\'emploi' : 'Créer une offre d\'emploi'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {isEditing ? 'Modifiez votre offre existante' : 'Publiez votre offre et trouvez le candidat idéal'}
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

      {/* Informations sur l'offre en cours d'édition */}
      {isEditing && currentOffre && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-info-circle text-blue-400"></i>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Modification de l'offre : {currentOffre.title}
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Statut actuel :</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    currentOffre.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                    currentOffre.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                    currentOffre.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    currentOffre.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    currentOffre.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentOffre.status === 'DRAFT' ? 'Brouillon' :
                     currentOffre.status === 'PENDING_APPROVAL' ? 'En attente d\'approbation' :
                     currentOffre.status === 'REJECTED' ? 'Refusée' :
                     currentOffre.status === 'APPROVED' ? 'Approuvée' :
                     currentOffre.status === 'PUBLISHED' ? 'Publiée' :
                     currentOffre.status}
                  </span>
                </p>
                <p><strong>Créée le :</strong> {new Date(currentOffre.created_at).toLocaleDateString('fr-FR')}</p>
                {currentOffre.updated_at && (
                  <p><strong>Dernière modification :</strong> {new Date(currentOffre.updated_at).toLocaleDateString('fr-FR')}</p>
                )}
                
                {/* Message d'avertissement pour les offres approuvées */}
                {(currentOffre.status === 'APPROVED' || currentOffre.status === 'PUBLISHED') && (
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
                  {currentOffre.status === 'DRAFT' ? 'Vous pouvez modifier cette offre à tout moment.' :
                   currentOffre.status === 'PENDING_APPROVAL' ? 'Modifiez cette offre si nécessaire, elle sera re-soumise pour approbation.' :
                   currentOffre.status === 'REJECTED' ? 'Corrigez cette offre selon les commentaires, elle sera re-soumise pour approbation.' :
                   currentOffre.status === 'APPROVED' ? 'Cette offre est approuvée. Toute modification nécessitera une nouvelle approbation.' :
                   currentOffre.status === 'PUBLISHED' ? 'Cette offre est publiée. Toute modification nécessitera une nouvelle approbation.' :
                   'Cette offre peut être modifiée.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                        Informations générales
                    </h2>
                    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du poste <span className="text-red-500">*</span>
                            </label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Ex: Développeur Full Stack Senior"
              />
                        </div>
                        
                        <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Département <span className="text-red-500">*</span>
                            </label>
              <select 
                id="department" 
                name="department" 
                required
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                                <option value="">Sélectionner un département</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
                            </select>
                        </div>
                        
                        <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie <span className="text-red-500">*</span>
                            </label>
              <select 
                id="category" 
                name="category" 
                required
                value={formData.category}
                onChange={handleInputChange}
                disabled={!selectedDepartment}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 disabled:bg-gray-100"
              >
                <option value="">{selectedDepartment ? 'Choisir une catégorie' : 'Sélectionnez d\'abord un département'}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="position_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du poste
              </label>
              <input 
                type="text" 
                id="position_name" 
                name="position_name" 
                value={formData.position_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Ex: Développeur Python"
              />
                        </div>
                    </div>
                </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-clipboard-list mr-2 text-green-600"></i>
                        Détails du poste
                    </h2>
                    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
              <label htmlFor="contract_type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat <span className="text-red-500">*</span>
                            </label>
              <select 
                id="contract_type" 
                name="contract_type" 
                required
                value={formData.contract_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                                <option value="">Sélectionner</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="STAGE">Stage</option>
                <option value="FREELANCE">Freelance</option>
                <option value="TEMPS_PARTIEL">Temps partiel</option>
                            </select>
                        </div>
                        
                        <div>
              <label htmlFor="experience_required" className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'expérience
                            </label>
              <select 
                id="experience_required" 
                name="experience_required"
                value={formData.experience_required}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Sélectionner</option>
                <option value="JUNIOR">Junior (0-2 ans)</option>
                <option value="INTERMEDIATE">Intermédiaire (3-5 ans)</option>
                <option value="SENIOR">Senior (6-10 ans)</option>
                <option value="EXPERT">Expert (10+ ans)</option>
                            </select>
                </div>

                        <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Localisation <span className="text-red-500">*</span>
                            </label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Ex: Dakar, Sénégal"
              />
                        </div>
                        
            <div>
              <label htmlFor="work_mode" className="block text-sm font-medium text-gray-700 mb-2">
                Mode de travail
              </label>
              <select 
                id="work_mode" 
                name="work_mode"
                value={formData.work_mode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Sélectionner</option>
                <option value="PRESENTIEL">Présentiel</option>
                <option value="REMOTE">Télétravail</option>
                <option value="HYBRIDE">Hybride</option>
              </select>
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-money-bill-wave mr-2 text-green-600"></i>
            Informations salariales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label htmlFor="salary_type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de salaire
              </label>
              <select 
                id="salary_type" 
                name="salary_type"
                value={formData.salary_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Sélectionner</option>
                <option value="NON_PRECISE">Non précisé</option>
                <option value="FOURCHETTE">Fourchette</option>
                <option value="FIXE">Salaire fixe</option>
                <option value="NEGOCIATION">À négociation</option>
              </select>
            </div>

            <div>
              <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 mb-2">
                Salaire minimum
              </label>
              <input 
                type="number" 
                id="salary_min" 
                name="salary_min" 
                value={formData.salary_min}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Montant en FCFA"
              />
            </div>

            <div>
              <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-2">
                Salaire maximum
                            </label>
              <input 
                type="number" 
                id="salary_max" 
                name="salary_max" 
                value={formData.salary_max}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Montant en FCFA"
              />
                        </div>
                        </div>
                    </div>
                    
        {/* Description and Requirements */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-file-alt mr-2 text-purple-600"></i>
            Description et exigences
                    </h2>
                    
          <div className="space-y-4 sm:space-y-6">
                        <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description du poste <span className="text-red-500">*</span>
                            </label>
              <textarea 
                id="description" 
                name="description" 
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Décrivez le poste, les responsabilités, les missions..."
              />
                        </div>
                        
                        <div>
              <label htmlFor="profile_sought" className="block text-sm font-medium text-gray-700 mb-2">
                Profil recherché
                            </label>
              <textarea 
                id="profile_sought" 
                name="profile_sought" 
                rows={3}
                value={formData.profile_sought}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Compétences, qualités, expérience recherchées..."
              />
                        </div>
                        
                        <div>
              <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-2">
                Informations supplémentaires
                            </label>
              <textarea 
                id="additional_info" 
                name="additional_info" 
                rows={3}
                value={formData.additional_info}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Avantages, conditions particulières, notes..."
              />
                        </div>
                    </div>
                </div>

        {/* Application Settings */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-cog mr-2 text-orange-600"></i>
                        Paramètres de candidature
                    </h2>
                    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
              <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-2">
                                Date limite de candidature
                            </label>
              <input 
                type="datetime-local" 
                id="application_deadline" 
                name="application_deadline" 
                value={formData.application_deadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              />
                        </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="cv_required" 
                  name="cv_required" 
                  checked={formData.cv_required}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="cv_required" className="ml-2 block text-sm text-gray-900">
                  CV requis
                </label>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="motivation_letter_required" 
                  name="motivation_letter_required" 
                  checked={formData.motivation_letter_required}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="motivation_letter_required" className="ml-2 block text-sm text-gray-900">
                  Lettre de motivation requise
                </label>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="is_urgent" 
                  name="is_urgent" 
                  checked={formData.is_urgent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="is_urgent" className="ml-2 block text-sm text-gray-900">
                  Offre urgente
                </label>
              </div>
            </div>
                        </div>
                    </div>
                    
        {/* Form Actions */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {isEditing ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                <span>
                  <i className={`${isEditing ? 'fas fa-save' : 'fas fa-plus'} mr-2`}></i>
                  {isEditing ? 'Modifier l\'offre' : 'Créer l\'offre'}
                </span>
              )}
                        </button>
                    </div>
        </div>
      </form>
    </div>
  );
};

export default CreeOffre;