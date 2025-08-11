import React, { useState } from 'react';

const AchievementsSection = () => {
  const [achievements] = useState([
    {
      id: 1,
      title: "Prix du Meilleur Développeur",
      organization: "Tech Awards Bénin",
      date: "2023",
      description: "Récompensé pour l'excellence technique et l'innovation dans le développement d'applications web",
      category: "Reconnaissance",
      icon: "fas fa-trophy",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      id: 2,
      title: "Speaker à la Conférence Tech",
      organization: "DevFest Cotonou",
      date: "2023",
      description: "Présentation sur 'L'avenir du développement web avec React et les nouvelles technologies'",
      category: "Conférence",
      icon: "fas fa-microphone",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: 3,
      title: "Publication d'article technique",
      organization: "Medium Tech",
      date: "2022",
      description: "Article sur 'Les bonnes pratiques de développement avec Node.js en production'",
      category: "Publication",
      icon: "fas fa-pen-fancy",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: 4,
      title: "Mentor de jeunes développeurs",
      organization: "Code Club Bénin",
      date: "2022-2023",
      description: "Formation et accompagnement de 15 jeunes développeurs dans l'apprentissage de React et Node.js",
      category: "Mentorat",
      icon: "fas fa-users",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: 5,
      title: "Contribution open source",
      organization: "GitHub",
      date: "2021-2023",
      description: "Plus de 50 contributions à des projets open source populaires dans l'écosystème JavaScript",
      category: "Open Source",
      icon: "fab fa-github",
      color: "text-gray-800",
      bgColor: "bg-gray-100"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Reconnaissance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Conférence':
        return 'bg-blue-100 text-blue-800';
      case 'Publication':
        return 'bg-green-100 text-green-800';
      case 'Mentorat':
        return 'bg-purple-100 text-purple-800';
      case 'Open Source':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-fuchsia-100 text-fuchsia-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-star mr-2 text-fuchsia-600"></i>
          Réalisations & Accomplissements
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-gray-400 hover:text-fuchsia-600 transition duration-200"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      {/* Add New Achievement Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-3">Ajouter une réalisation</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              type="text" 
              placeholder="Titre de la réalisation"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
            <input 
              type="text" 
              placeholder="Organisation"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
            <input 
              type="text" 
              placeholder="Année"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
              <option>Reconnaissance</option>
              <option>Conférence</option>
              <option>Publication</option>
              <option>Mentorat</option>
              <option>Open Source</option>
              <option>Autre</option>
            </select>
          </div>
          <textarea 
            placeholder="Description de la réalisation..."
            rows={3}
            className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
          />
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
      
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.bgColor}`}>
                <i className={`${achievement.icon} ${achievement.color} text-lg`}></i>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.organization}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </span>
                    <span className="text-sm text-gray-500">{achievement.date}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{achievement.description}</p>
                
                <div className="flex space-x-2">
                  <button className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded text-sm hover:bg-fuchsia-200 transition duration-200">
                    <i className="fas fa-eye mr-1"></i>Voir détails
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition duration-200">
                    <i className="fas fa-edit mr-1"></i>Modifier
                  </button>
                  <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition duration-200">
                    <i className="fas fa-trash mr-1"></i>Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-3">
          Mettez en avant vos réalisations, prix, publications et contributions pour impressionner les recruteurs
        </p>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-transparent border border-fuchsia-600 text-fuchsia-600 px-6 py-2 rounded-lg hover:bg-fuchsia-600 hover:text-white transition duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          {showAddForm ? 'Fermer' : 'Ajouter une réalisation'}
        </button>
      </div>
    </div>
  );
};

export default AchievementsSection; 