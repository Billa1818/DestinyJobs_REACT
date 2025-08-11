import React, { useState } from 'react';

const SocialLinksSection = () => {
  const [socialLinks] = useState([
    {
      id: 1,
      platform: "LinkedIn",
      url: "https://linkedin.com/in/jeandupont",
      username: "jeandupont",
      icon: "fab fa-linkedin",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      verified: true
    },
    {
      id: 2,
      platform: "GitHub",
      url: "https://github.com/jeandupont",
      username: "jeandupont",
      icon: "fab fa-github",
      color: "text-gray-800",
      bgColor: "bg-gray-100",
      verified: true
    },
    {
      id: 3,
      platform: "Portfolio",
      url: "https://jeandupont.dev",
      username: "jeandupont.dev",
      icon: "fas fa-globe",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      verified: true
    },
    {
      id: 4,
      platform: "Twitter",
      url: "https://twitter.com/jeandupont",
      username: "@jeandupont",
      icon: "fab fa-twitter",
      color: "text-blue-400",
      bgColor: "bg-blue-100",
      verified: false
    },
    {
      id: 5,
      platform: "Medium",
      url: "https://medium.com/@jeandupont",
      username: "@jeandupont",
      icon: "fab fa-medium",
      color: "text-green-600",
      bgColor: "bg-green-100",
      verified: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'fab fa-linkedin';
      case 'github':
        return 'fab fa-github';
      case 'twitter':
        return 'fab fa-twitter';
      case 'medium':
        return 'fab fa-medium';
      case 'portfolio':
        return 'fas fa-globe';
      case 'youtube':
        return 'fab fa-youtube';
      case 'instagram':
        return 'fab fa-instagram';
      default:
        return 'fas fa-link';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'text-blue-600';
      case 'github':
        return 'text-gray-800';
      case 'twitter':
        return 'text-blue-400';
      case 'medium':
        return 'text-green-600';
      case 'portfolio':
        return 'text-purple-600';
      case 'youtube':
        return 'text-red-600';
      case 'instagram':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-share-alt mr-2 text-fuchsia-600"></i>
          Réseaux sociaux & Liens
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-gray-400 hover:text-fuchsia-600 transition duration-200"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      {/* Add New Link Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-3">Ajouter un nouveau lien</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
              <option>LinkedIn</option>
              <option>GitHub</option>
              <option>Twitter</option>
              <option>Medium</option>
              <option>Portfolio</option>
              <option>Autre</option>
            </select>
            <input 
              type="text" 
              placeholder="Nom d'utilisateur"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
            <input 
              type="url" 
              placeholder="URL complète"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-700 transition duration-200">
              Ajouter
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${link.bgColor}`}>
                  <i className={`${link.icon} ${link.color} text-lg`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{link.platform}</h4>
                  <p className="text-sm text-gray-600">{link.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {link.verified && (
                  <span className="text-blue-600" title="Vérifié">
                    <i className="fas fa-check-circle"></i>
                  </span>
                )}
                <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-fuchsia-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-external-link-alt mr-1"></i>Visiter
              </a>
              <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition duration-200">
                <i className="fas fa-edit"></i>
              </button>
              <button className="bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition duration-200">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-3">
          Ajoutez vos réseaux sociaux et liens professionnels pour améliorer votre visibilité
        </p>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-transparent border border-fuchsia-600 text-fuchsia-600 px-6 py-2 rounded-lg hover:bg-fuchsia-600 hover:text-white transition duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          {showAddForm ? 'Fermer' : 'Ajouter un lien'}
        </button>
      </div>
    </div>
  );
};

export default SocialLinksSection; 