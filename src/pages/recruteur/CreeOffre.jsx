import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CreeOffre = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    category: '',
    contractType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    remoteWork: false,
    description: '',
    requirements: '',
    benefits: '',
    applicationDeadline: ''
  });

  // Vérifier si on est en mode édition
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editParam = searchParams.get('edit');
    
    if (editParam) {
      setIsEditing(true);
      setEditId(editParam);
      // Ici vous pourriez charger les données de l'offre à modifier
      console.log('Mode édition pour l\'offre:', editParam);
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      console.log('Updating job offer:', formData);
      // Ici vous ajouterez la logique de mise à jour d'offre
    } else {
      console.log('Creating job offer:', formData);
      // Ici vous ajouterez la logique de création d'offre
    }
    // Rediriger vers la page de gestion des offres
    navigate('/recruteur/gestion-offres', { replace: true });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/recruteur/gestion-offres', { replace: true });
  };

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
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du poste <span className="text-red-500">*</span>
                            </label>
              <input 
                type="text" 
                id="jobTitle" 
                name="jobTitle" 
                required 
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Ex: Développeur Full Stack Senior"
              />
                        </div>
                        
                        <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                Département/Service
                            </label>
              <select 
                id="department" 
                name="department" 
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                                <option value="">Sélectionner un département</option>
                                <option value="it">Informatique</option>
                                <option value="marketing">Marketing</option>
                                <option value="sales">Ventes</option>
                                <option value="hr">Ressources Humaines</option>
                                <option value="finance">Finance</option>
                                <option value="operations">Opérations</option>
                                <option value="other">Autre</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                                <option value="">Choisir une catégorie</option>
                                <option value="emploi">Emploi/Jobs</option>
                                <option value="consultation">Consultation</option>
                                <option value="stage">Stage</option>
                                <option value="freelance">Freelance</option>
                            </select>
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
              <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat <span className="text-red-500">*</span>
                            </label>
              <select 
                id="contractType" 
                name="contractType" 
                required
                value={formData.contractType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                                <option value="">Sélectionner</option>
                                <option value="cdi">CDI</option>
                                <option value="cdd">CDD</option>
                                <option value="stage">Stage</option>
                                <option value="freelance">Freelance</option>
                                <option value="temps_partiel">Temps partiel</option>
                            </select>
                        </div>
                        
                        <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'expérience
                            </label>
              <select 
                id="experienceLevel" 
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Sélectionner</option>
                <option value="debutant">Débutant (0-2 ans)</option>
                                <option value="intermediaire">Intermédiaire (3-5 ans)</option>
                <option value="senior">Senior (6-10 ans)</option>
                <option value="expert">Expert (10+ ans)</option>
                            </select>
                        </div>
                        
                        <div>
              <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                Salaire minimum (FCFA)
                            </label>
              <input 
                type="number" 
                id="salaryMin" 
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Ex: 150000"
              />
                        </div>
                        
                        <div>
              <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                Salaire maximum (FCFA)
                            </label>
              <input 
                type="number" 
                id="salaryMax" 
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Ex: 300000"
              />
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
                placeholder="Ex: Cotonou, Bénin"
              />
                        </div>
                        
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remoteWork" 
                name="remoteWork"
                checked={formData.remoteWork}
                onChange={handleInputChange}
                className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
              />
              <label htmlFor="remoteWork" className="ml-2 block text-sm text-gray-700">
                Télétravail possible
                            </label>
                        </div>
                        </div>
                    </div>
                    
        {/* Job Description */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-file-alt mr-2 text-purple-600"></i>
                        Description du poste
                    </h2>
                    
          <div className="space-y-4">
                        <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description du poste <span className="text-red-500">*</span>
                            </label>
              <textarea 
                id="description" 
                name="description" 
                rows="6" 
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Décrivez les missions principales, les responsabilités..."
              />
                        </div>
                        
                        <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Compétences et exigences
                            </label>
              <textarea 
                id="requirements" 
                name="requirements" 
                rows="4"
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Listez les compétences requises, diplômes, expériences..."
              />
                        </div>
                        
                        <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Avantages et bénéfices
                            </label>
              <textarea 
                id="benefits" 
                name="benefits" 
                rows="3"
                value={formData.benefits}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Avantages sociaux, formations, perspectives d'évolution..."
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
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                                Date limite de candidature
                            </label>
              <input 
                type="date" 
                id="applicationDeadline" 
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              />
                        </div>
                        </div>
                    </div>
                    
        {/* Form Actions */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button 
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 text-center"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-paper-plane mr-2"></i>
                            Publier l'offre
                        </button>
                    </div>
        </div>
      </form>
    </div>
  );
};

export default CreeOffre;