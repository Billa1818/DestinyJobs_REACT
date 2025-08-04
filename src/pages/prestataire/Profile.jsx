import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PrestataireProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Marie',
    lastName: 'Prestataire',
    email: 'marie.prestataire@email.com',
    phone: '+229 90 12 34 56',
    location: 'Cotonou, Bénin',
    bio: 'Consultante en développement web et formation avec 8 ans d\'expérience...',
    experience: '8 ans',
    education: 'Master en Informatique',
    skills: ['React', 'Node.js', 'MongoDB', 'Formation', 'Consultation'],
    services: ['Développement Web', 'Formation', 'Consultation'],
    languages: ['Français', 'Anglais'],
    availability: 'Disponible'
  });

  const [activeTab, setActiveTab] = useState('personal');

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
                <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
              </div>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200">
                <i className="fas fa-save mr-2"></i>Sauvegarder
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'personal' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Informations personnelles
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'professional' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-briefcase mr-2"></i>Profil professionnel
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'services' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-tools mr-2"></i>Mes services
              </button>
            </div>
          </div>

          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-user mr-2 text-orange-600"></i>
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows="4"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Professional Information */}
          {activeTab === 'professional' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-briefcase mr-2 text-orange-600"></i>
                Profil professionnel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
                  <input
                    type="text"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
                  <input
                    type="text"
                    value={profileData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langues</label>
                  <input
                    type="text"
                    value={profileData.languages.join(', ')}
                    onChange={(e) => handleInputChange('languages', e.target.value.split(', '))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                  <select
                    value={profileData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Disponible</option>
                    <option>Partiellement disponible</option>
                    <option>Non disponible</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Services */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-tools mr-2 text-orange-600"></i>
                Mes services
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Compétences</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center">
                      {skill}
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter une compétence..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSkillAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      handleSkillAdd(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Types de services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.services.map((service, index) => (
                    <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <i className="fas fa-check text-green-600 mr-3"></i>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Profile Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">MP</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h3>
              <p className="text-gray-600">Consultante en développement</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.location}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.experience} d'expérience</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-star text-gray-400 mr-3"></i>
                <span className="text-gray-700">4.8/5 (24 avis)</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.availability}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Link to="/prestataire/services" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-briefcase text-orange-600 mr-3"></i>
                <span className="text-gray-700">Gérer mes services</span>
              </Link>
              <Link to="/consultation" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-search text-orange-600 mr-3"></i>
                <span className="text-gray-700">Rechercher des consultations</span>
              </Link>
              <Link to="/prestataire/candidatures" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-paper-plane text-orange-600 mr-3"></i>
                <span className="text-gray-700">Mes candidatures</span>
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projets complétés</span>
                <span className="font-semibold text-gray-900">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux de satisfaction</span>
                <span className="font-semibold text-gray-900">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenus 2024</span>
                <span className="font-semibold text-gray-900">2.5M FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Clients satisfaits</span>
                <span className="font-semibold text-gray-900">38</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrestataireProfile; 