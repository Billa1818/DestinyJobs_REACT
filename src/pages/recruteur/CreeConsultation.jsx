import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreeConsultation = () => {
  const [formData, setFormData] = useState({
    titre: '',
    domaine: '',
    duree: '',
    budget: '',
    localisation: '',
    description: '',
    competences: '',
    dateLimite: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating consultation:', formData);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-handshake mr-2 text-blue-600"></i>
              Créer une consultation
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Publiez une mission de consultation pour trouver des experts
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la consultation <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Consultant en Stratégie Digitale"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine <span className="text-red-500">*</span>
              </label>
              <select 
                name="domaine"
                value={formData.domaine}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="strategie">Stratégie</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="technologie">Technologie</option>
                <option value="rh">Ressources Humaines</option>
                <option value="autres">Autres</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée <span className="text-red-500">*</span>
              </label>
              <select 
                name="duree"
                value={formData.duree}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="1-mois">1 mois</option>
                <option value="3-mois">3 mois</option>
                <option value="6-mois">6 mois</option>
                <option value="1-an">1 an</option>
                <option value="ponctuel">Ponctuel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (FCFA) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 1000000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="localisation"
                value={formData.localisation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Cotonou, Remote, Hybride"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description et exigences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de la mission <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez la mission, les objectifs, le contexte..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences requises <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="competences"
                value={formData.competences}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Listez les compétences et expériences requises..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date limite de candidature <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="dateLimite"
                value={formData.dateLimite}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/recruteur/gestion-consultations"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 text-center"
            >
              Annuler
            </Link>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Publier la consultation
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreeConsultation;
