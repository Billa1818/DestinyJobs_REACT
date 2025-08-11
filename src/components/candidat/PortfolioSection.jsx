import React, { useState } from 'react';

const PortfolioSection = () => {
  const [projects] = useState([
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Plateforme e-commerce complète avec gestion des produits, panier d'achat et système de paiement",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "https://via.placeholder.com/300x200/fuchsia-100/fuchsia-800?text=E-commerce",
      link: "https://github.com/jeandupont/ecommerce",
      demo: "https://demo-ecommerce.com",
      year: "2023"
    },
    {
      id: 2,
      title: "Application de Gestion des Tâches",
      description: "Application web et mobile pour la gestion collaborative des projets et tâches d'équipe",
      technologies: ["Vue.js", "Laravel", "MySQL", "PWA"],
      image: "https://via.placeholder.com/300x200/green-100/green-800?text=Task+Manager",
      link: "https://github.com/jeandupont/taskmanager",
      demo: "https://taskmanager-demo.com",
      year: "2022"
    },
    {
      id: 3,
      title: "API de Géolocalisation",
      description: "Service REST API pour la géolocalisation et le calcul d'itinéraires avec intégration OpenStreetMap",
      technologies: ["Python", "Django", "PostgreSQL", "Redis"],
      image: "https://via.placeholder.com/300x200/blue-100/blue-800?text=Geo+API",
      link: "https://github.com/jeandupont/geo-api",
      demo: "https://geo-api-demo.com",
      year: "2022"
    }
  ]);

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
          Portfolio & Projets réalisés
        </h3>
        <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-200">
            <div className="relative">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-fuchsia-600 text-white text-xs px-2 py-1 rounded">
                {project.year}
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-3 rounded text-sm hover:bg-gray-200 transition duration-200"
                >
                  <i className="fab fa-github mr-1"></i>Code
                </a>
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-fuchsia-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-fuchsia-700 transition duration-200"
                >
                  <i className="fas fa-external-link-alt mr-1"></i>Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-transparent border border-fuchsia-600 text-fuchsia-600 px-6 py-2 rounded-lg hover:bg-fuchsia-600 hover:text-white transition duration-200">
          <i className="fas fa-plus mr-2"></i>Ajouter un projet
        </button>
      </div>
    </div>
  );
};

export default PortfolioSection; 