import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreeBourse = () => {
  const [formData, setFormData] = useState({
    titre: '',
    montant: '',
    duree: '',
    niveau: '',
    domaine: '',
    description: '',
    criteres: '',
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
    console.log('Creating scholarship:', formData);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
                <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-graduation-cap mr-2 text-green-600"></i>
              Créer une bourse d'études
                    </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Publiez une bourse pour soutenir les étudiants
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
                Titre de la bourse <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Bourse d'excellence en Informatique"
              />
        </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant (FCFA) <span className="text-red-500">*</span>
                        </label>
              <input 
                type="number" 
                name="montant"
                value={formData.montant}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: 500000"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Sélectionner</option>
                <option value="1">1 an</option>
                <option value="2">2 ans</option>
                <option value="3">3 ans</option>
                <option value="4">4 ans</option>
                        </select>
                    </div>
                    
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'études <span className="text-red-500">*</span>
                        </label>
              <select 
                name="niveau"
                value={formData.niveau}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                            <option value="">Sélectionner</option>
                <option value="licence">Licence</option>
                <option value="master">Master</option>
                            <option value="doctorat">Doctorat</option>
                        </select>
                    </div>
                    
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine d'études <span className="text-red-500">*</span>
                        </label>
              <select 
                name="domaine"
                value={formData.domaine}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                            <option value="">Sélectionner</option>
                <option value="informatique">Informatique</option>
                            <option value="ingenierie">Ingénierie</option>
                <option value="medecine">Médecine</option>
                            <option value="droit">Droit</option>
                <option value="economie">Économie</option>
                            <option value="autres">Autres</option>
                        </select>
                    </div>
                </div>
            </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description et critères</h2>
          <div className="space-y-4">
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de la bourse <span className="text-red-500">*</span>
                        </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Décrivez la bourse, ses objectifs, les conditions..."
              />
                    </div>
                    
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Critères d'éligibilité <span className="text-red-500">*</span>
                        </label>
              <textarea 
                name="criteres"
                value={formData.criteres}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Listez les critères d'éligibilité..."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
                    </div>
                </div>
            </div>

        {/* Form Actions */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/recruteur/gestion-bourses"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 text-center"
            >
              Annuler
            </Link>
            <button 
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
              <i className="fas fa-paper-plane mr-2"></i>
                        Publier la bourse
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
};

export default CreeBourse;