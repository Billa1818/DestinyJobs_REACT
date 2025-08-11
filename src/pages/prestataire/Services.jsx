import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([
    {
      id: 1,
      titre: 'Développement Web Full-Stack',
      description: 'Création d\'applications web complètes avec React, Node.js et MongoDB',
      prix: '150,000 FCFA',
      duree: '2-3 mois',
      competences: ['React', 'Node.js', 'MongoDB', 'Express'],
      statut: 'Actif',
      projets: 12,
      note: 4.8
    },
    {
      id: 2,
      titre: 'Développement Mobile',
      description: 'Applications mobiles natives et cross-platform',
      prix: '200,000 FCFA',
      duree: '3-4 mois',
      competences: ['React Native', 'Flutter', 'iOS', 'Android'],
      statut: 'Actif',
      projets: 8,
      note: 4.9
    },
    {
      id: 3,
      titre: 'Design UI/UX',
      description: 'Conception d\'interfaces utilisateur modernes et intuitives',
      prix: '80,000 FCFA',
      duree: '1-2 mois',
      competences: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      statut: 'En pause',
      projets: 15,
      note: 4.7
    }
  ]);

  const [competences] = useState([
    { nom: 'React', niveau: 90, categorie: 'Frontend' },
    { nom: 'Node.js', niveau: 85, categorie: 'Backend' },
    { nom: 'MongoDB', niveau: 80, categorie: 'Base de données' },
    { nom: 'React Native', niveau: 75, categorie: 'Mobile' },
    { nom: 'Figma', niveau: 70, categorie: 'Design' },
    { nom: 'Python', niveau: 65, categorie: 'Backend' }
  ]);

  const [projets] = useState([
    {
      id: 1,
      titre: 'E-commerce Platform',
      client: 'TechCorp Solutions',
      description: 'Plateforme e-commerce complète avec paiement en ligne',
      technologies: ['React', 'Node.js', 'Stripe'],
      date: '2024-01-15',
      statut: 'Terminé',
      revenus: '450,000 FCFA'
    },
    {
      id: 2,
      titre: 'App de Livraison',
      client: 'FastDelivery',
      description: 'Application mobile pour la livraison de repas',
      technologies: ['React Native', 'Firebase', 'Google Maps'],
      date: '2023-12-20',
      statut: 'En cours',
      revenus: '300,000 FCFA'
    },
    {
      id: 3,
      titre: 'Dashboard Analytics',
      client: 'DataViz Inc',
      description: 'Tableau de bord analytique avec visualisations',
      technologies: ['Vue.js', 'D3.js', 'Python'],
      date: '2023-11-10',
      statut: 'Terminé',
      revenus: '280,000 FCFA'
    }
  ]);

  const [tarifs] = useState([
    {
      type: 'Développement Web',
      tarifHoraire: '25,000 FCFA',
      tarifProjet: '150,000 - 500,000 FCFA',
      delai: '2-8 semaines'
    },
    {
      type: 'Développement Mobile',
      tarifHoraire: '30,000 FCFA',
      tarifProjet: '200,000 - 800,000 FCFA',
      delai: '3-12 semaines'
    },
    {
      type: 'Design UI/UX',
      tarifHoraire: '20,000 FCFA',
      tarifProjet: '80,000 - 300,000 FCFA',
      delai: '1-4 semaines'
    }
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Portfolio</h1>
          <p className="text-gray-600">Gérez vos services, compétences et projets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <i className="fas fa-briefcase text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Services Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{services.filter(s => s.statut === 'Actif').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-project-diagram text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projets Réalisés</p>
                <p className="text-2xl font-bold text-gray-900">{projets.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-star text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fas fa-money-bill-wave text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-gray-900">1.03M FCFA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mes Services
              </button>
              <button
                onClick={() => setActiveTab('competences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'competences'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Compétences
              </button>
              <button
                onClick={() => setActiveTab('projets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projets'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Projets
              </button>
              <button
                onClick={() => setActiveTab('tarifs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tarifs'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tarifs
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Mes Services</h2>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    <i className="fas fa-plus mr-2"></i>Ajouter un service
                  </button>
                </div>
                
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.titre}</h3>
                          <p className="text-gray-600 mb-3">{service.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {service.competences.map((comp, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            service.statut === 'Actif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.statut}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <i className="fas fa-edit"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Prix</p>
                          <p className="font-semibold text-gray-900">{service.prix}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Durée</p>
                          <p className="font-semibold text-gray-900">{service.duree}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Projets</p>
                          <p className="font-semibold text-gray-900">{service.projets}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Note</p>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-900 mr-1">{service.note}</span>
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compétences Tab */}
            {activeTab === 'competences' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Mes Compétences</h2>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    <i className="fas fa-plus mr-2"></i>Ajouter une compétence
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {competences.map((comp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-900">{comp.nom}</h3>
                        <span className="text-sm text-gray-500">{comp.categorie}</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Niveau</span>
                          <span>{comp.niveau}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${comp.niveau}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button className="text-orange-600 hover:text-orange-700 text-sm">
                          <i className="fas fa-edit mr-1"></i>Modifier
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm">
                          <i className="fas fa-trash mr-1"></i>Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projets Tab */}
            {activeTab === 'projets' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Mes Projets</h2>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    <i className="fas fa-plus mr-2"></i>Ajouter un projet
                  </button>
                </div>
                
                <div className="space-y-4">
                  {projets.map((projet) => (
                    <div key={projet.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{projet.titre}</h3>
                          <p className="text-gray-600 mb-3">{projet.description}</p>
                          <p className="text-sm text-gray-500 mb-3">Client: {projet.client}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {projet.technologies.map((tech, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            projet.statut === 'Terminé' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {projet.statut}
                          </span>
                          <p className="text-sm text-gray-500">{projet.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-500">Revenus: </span>
                          <span className="font-semibold text-gray-900">{projet.revenus}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-orange-600 hover:text-orange-700 text-sm">
                            <i className="fas fa-eye mr-1"></i>Voir
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 text-sm">
                            <i className="fas fa-edit mr-1"></i>Modifier
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tarifs Tab */}
            {activeTab === 'tarifs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Mes Tarifs</h2>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    <i className="fas fa-plus mr-2"></i>Ajouter un tarif
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tarifs.map((tarif, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{tarif.type}</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Tarif horaire</p>
                          <p className="font-semibold text-gray-900">{tarif.tarifHoraire}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tarif par projet</p>
                          <p className="font-semibold text-gray-900">{tarif.tarifProjet}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Délai moyen</p>
                          <p className="font-semibold text-gray-900">{tarif.delai}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="text-orange-600 hover:text-orange-700 text-sm">
                          <i className="fas fa-edit mr-1"></i>Modifier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 