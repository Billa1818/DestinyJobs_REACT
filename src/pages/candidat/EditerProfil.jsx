import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EditerProfil = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+229 90 12 34 56',
    location: 'Cotonou, Bénin',
    bio: 'Développeur Full Stack passionné par les nouvelles technologies...',
    experience: '5 ans',
    education: 'Master en Informatique',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    languages: ['Français', 'Anglais'],
    availability: 'Immédiat'
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
                <h1 className="text-2xl font-bold text-gray-900">Modifier mon profil</h1>
                <p className="text-gray-600 mt-1">Mettez à jour vos informations personnelles et professionnelles</p>
              </div>
              <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200">
                <i className="fas fa-save mr-2"></i>Sauvegarder
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'personal' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Informations personnelles
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'professional' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-briefcase mr-2"></i>Profil professionnel
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'skills' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-tools mr-2"></i>Compétences
              </button>
            </div>
          </div>

          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-user mr-2 text-fuchsia-600"></i>
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Parlez-nous de vous..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Professional Information */}
          {activeTab === 'professional' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
                Profil professionnel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expérience</label>
                  <select
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  >
                    <option>0-1 an</option>
                    <option>1-3 ans</option>
                    <option>3-5 ans</option>
                    <option>5-10 ans</option>
                    <option>10+ ans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
                  <input
                    type="text"
                    value={profileData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                  <select
                    value={profileData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  >
                    <option>Immédiat</option>
                    <option>1 mois</option>
                    <option>2 mois</option>
                    <option>3 mois</option>
                    <option>À discuter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langues</label>
                  <input
                    type="text"
                    value={profileData.languages.join(', ')}
                    onChange={(e) => handleInputChange('languages', e.target.value.split(', '))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Français, Anglais..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-tools mr-2 text-fuchsia-600"></i>
                Compétences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ajouter une compétence</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ex: React, Python, Marketing..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
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
                      className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mes compétences</label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuchsia-100 text-fuchsia-800"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-2 text-fuchsia-600 hover:text-fuchsia-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Profile Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-eye mr-2 text-fuchsia-600"></i>
              Aperçu du profil
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-user text-fuchsia-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{profileData.firstName} {profileData.lastName}</h4>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expérience</span>
                  <span className="font-medium">{profileData.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Formation</span>
                  <span className="font-medium">{profileData.education}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Localisation</span>
                  <span className="font-medium">{profileData.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb mr-2 text-fuchsia-600"></i>
              Conseils
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Photo professionnelle</h4>
                  <p className="text-xs text-gray-600">Ajoutez une photo de qualité</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Bio complète</h4>
                  <p className="text-xs text-gray-600">Décrivez votre parcours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Compétences à jour</h4>
                  <p className="text-xs text-gray-600">Listez vos compétences clés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link to="/candidat/profil" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-eye text-fuchsia-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Voir mon profil</h4>
                  <p className="text-xs text-gray-500">Comment les autres me voient</p>
                </div>
              </Link>
              
              <Link to="/candidat/offre" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-search text-green-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Rechercher des emplois</h4>
                  <p className="text-xs text-gray-500">Trouvez de nouvelles opportunités</p>
                </div>
              </Link>
              
              <Link to="/candidat/parametre" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-cog text-purple-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Paramètres</h4>
                  <p className="text-xs text-gray-500">Gérer mes préférences</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditerProfil;