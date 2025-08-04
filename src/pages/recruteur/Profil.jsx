import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profil = () => {
  const [formData, setFormData] = useState({
    companyName: 'TechCorp Solutions',
    sector: 'Technologies de l\'information',
    size: '51-200 employés',
    yearFounded: '2015',
    description: 'TechCorp Solutions est une entreprise innovante spécialisée dans le développement de solutions technologiques pour les entreprises africaines. Nous accompagnons nos clients dans leur transformation digitale avec des solutions sur mesure.',
    address: '123 Avenue de la République\nQuartier Ganhi\nCotonou, Bénin',
    phone: '+229 21 30 45 67',
    email: 'contact@techcorp.bj',
    website: 'https://www.techcorp.bj'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    // Ici vous ajouterez la logique de sauvegarde
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profil de l'entreprise</h1>
            <p className="text-gray-600">Gérez les informations de votre entreprise et de votre équipe</p>
                </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link 
              to="/recruteur/profil-public"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              <i className="fas fa-eye mr-2"></i>Aperçu public
            </Link>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-save mr-2"></i>Sauvegarder
                    </button>
                </div>
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-building mr-2 text-fuchsia-600"></i>
                            Informations de l'entreprise
                        </h2>
                    </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise *</label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                            </div>
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité *</label>
                  <select 
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  >
                                    <option>Technologies de l'information</option>
                                    <option>Finance</option>
                                    <option>Santé</option>
                                    <option>Éducation</option>
                                    <option>Commerce</option>
                                </select>
                            </div>
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taille de l'entreprise</label>
                  <select 
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  >
                                    <option>1-10 employés</option>
                                    <option>11-50 employés</option>
                    <option>51-200 employés</option>
                                    <option>201-500 employés</option>
                                    <option>500+ employés</option>
                                </select>
                            </div>
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Année de création</label>
                  <input 
                    type="number" 
                    name="yearFounded"
                    value={formData.yearFounded}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                            </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description de l'entreprise</label>
                  <textarea 
                    rows="4" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500" 
                    placeholder="Décrivez votre entreprise, sa mission, ses valeurs..."
                  />
                            </div>
                        </div>
                    </div>
                </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-address-book mr-2 text-fuchsia-600"></i>
                            Informations de contact
                        </h2>
                    </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                  <textarea 
                    rows="3" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                            </div>
                <div className="space-y-4">
                                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone principal *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    />
                                </div>
                                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email principal *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    />
                                </div>
                            </div>
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                  <input 
                    type="url" 
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                            </div>
                        </div>
                    </div>
                </div>

          {/* Social Media Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-share-alt mr-2 text-fuchsia-600"></i>
                Réseaux sociaux
                        </h2>
                    </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/company/votre-entreprise"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                                    </div>
                                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input 
                    type="url" 
                    placeholder="https://facebook.com/votre-entreprise"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                                    </div>
                                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input 
                    type="url" 
                    placeholder="https://twitter.com/votre-entreprise"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                                    </div>
                                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input 
                    type="url" 
                    placeholder="https://instagram.com/votre-entreprise"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-image mr-2 text-fuchsia-600"></i>
                Logo de l'entreprise
                        </h2>
                    </div>
            <div className="p-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-building text-4xl text-gray-400"></i>
                </div>
                <button className="w-full px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200">
                  <i className="fas fa-upload mr-2"></i>Changer le logo
                            </button>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 2MB</p>
                        </div>
                    </div>
                </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
                Statistiques rapides
              </h2>
                    </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Offres publiées</span>
                  <span className="font-semibold text-fuchsia-600">12</span>
                                    </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Candidatures reçues</span>
                  <span className="font-semibold text-green-600">89</span>
                                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Entretiens planifiés</span>
                  <span className="font-semibold text-blue-600">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Embauches réalisées</span>
                  <span className="font-semibold text-purple-600">8</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Profil;