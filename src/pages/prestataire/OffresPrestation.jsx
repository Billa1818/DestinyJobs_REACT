import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OffresPrestation = () => {
  const [filters, setFilters] = useState({
    categorie: '',
    localisation: '',
    budget: '',
    search: ''
  });

  const [offres, setOffres] = useState([
    {
      id: 1,
      titre: 'Développement d\'application mobile',
      entreprise: 'Tech Solutions SARL',
      description: 'Nous recherchons un développeur mobile expérimenté pour créer une application iOS et Android pour notre startup.',
      categorie: 'Développement',
      localisation: 'Cotonou',
      budget: '500,000 - 800,000 FCFA',
      delai: '2 mois',
      datePublication: '2024-01-15',
      candidatures: 12,
      statut: 'active',
      competences: ['React Native', 'Flutter', 'API REST', 'Firebase'],
      type: 'Projet complet'
    },
    {
      id: 2,
      titre: 'Design de site web e-commerce',
      entreprise: 'E-Commerce Plus',
      description: 'Création d\'un design moderne et responsive pour notre plateforme de vente en ligne.',
      categorie: 'Design',
      localisation: 'Porto-Novo',
      budget: '300,000 - 500,000 FCFA',
      delai: '3 semaines',
      datePublication: '2024-01-14',
      candidatures: 8,
      statut: 'active',
      competences: ['UI/UX Design', 'Figma', 'Adobe XD', 'Responsive Design'],
      type: 'Design uniquement'
    },
    {
      id: 3,
      titre: 'Consultation en marketing digital',
      entreprise: 'Marketing Pro',
      description: 'Accompagnement stratégique pour améliorer notre présence en ligne et nos campagnes publicitaires.',
      categorie: 'Marketing',
      localisation: 'Cotonou',
      budget: '400,000 - 600,000 FCFA',
      delai: '1 mois',
      datePublication: '2024-01-13',
      candidatures: 15,
      statut: 'active',
      competences: ['SEO', 'Google Ads', 'Facebook Ads', 'Analytics'],
      type: 'Consultation'
    },
    {
      id: 4,
      titre: 'Maintenance système informatique',
      entreprise: 'IT Services',
      description: 'Maintenance et optimisation de notre infrastructure informatique existante.',
      categorie: 'Maintenance',
      localisation: 'Abomey-Calavi',
      budget: '250,000 - 400,000 FCFA',
      delai: 'Ongoing',
      datePublication: '2024-01-12',
      candidatures: 6,
      statut: 'active',
      competences: ['Linux', 'Windows Server', 'Réseau', 'Sécurité'],
      type: 'Maintenance continue'
    },
    {
      id: 5,
      titre: 'Formation équipe développement',
      entreprise: 'Digital Academy',
      description: 'Formation de notre équipe aux nouvelles technologies de développement web.',
      categorie: 'Formation',
      localisation: 'Cotonou',
      budget: '600,000 - 900,000 FCFA',
      delai: '2 semaines',
      datePublication: '2024-01-11',
      candidatures: 4,
      statut: 'active',
      competences: ['React', 'Node.js', 'MongoDB', 'DevOps'],
      type: 'Formation'
    }
  ]);

  const [filteredOffres, setFilteredOffres] = useState(offres);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = offres;

    if (filters.categorie) {
      filtered = filtered.filter(o => o.categorie === filters.categorie);
    }
    if (filters.localisation) {
      filtered = filtered.filter(o => o.localisation === filters.localisation);
    }
    if (filters.search) {
      filtered = filtered.filter(o => 
        o.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
        o.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        o.entreprise.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredOffres(filtered);
  };

  const resetFilters = () => {
    setFilters({
      categorie: '',
      localisation: '',
      budget: '',
      search: ''
    });
    setFilteredOffres(offres);
  };

  const postuler = (offreId) => {
    console.log('Postulation pour l\'offre:', offreId);
    // Ici on ajouterait la logique pour postuler
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'active': return 'Active';
      case 'pending': return 'En attente';
      case 'closed': return 'Fermée';
      default: return 'Inconnu';
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Offres de prestation</h1>
          <p className="text-gray-600">Découvrez les opportunités de prestation disponibles</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Titre, description, entreprise..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="categorie"
                value={filters.categorie}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                <option value="Développement">Développement</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Formation">Formation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
              <select
                name="localisation"
                value={filters.localisation}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Toutes les localisations</option>
                <option value="Cotonou">Cotonou</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <i className="fas fa-briefcase text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total offres</p>
                <p className="text-2xl font-bold text-gray-900">{offres.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {offres.filter(o => o.statut === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <i className="fas fa-users text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Candidatures moyennes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(offres.reduce((acc, o) => acc + o.candidatures, 0) / offres.length)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <i className="fas fa-money-bill-wave text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Budget moyen</p>
                <p className="text-2xl font-bold text-gray-900">450K FCFA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="space-y-6">
          {filteredOffres.map((offre) => (
            <div key={offre.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{offre.titre}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(offre.statut)}`}>
                      {getStatutText(offre.statut)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{offre.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span><i className="fas fa-building mr-1"></i>{offre.entreprise}</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>{offre.localisation}</span>
                    <span><i className="fas fa-money-bill mr-1"></i>{offre.budget}</span>
                    <span><i className="fas fa-clock mr-1"></i>{offre.delai}</span>
                    <span><i className="fas fa-users mr-1"></i>{offre.candidatures} candidatures</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-sm text-gray-500">{offre.type}</span>
                  <button
                    onClick={() => postuler(offre.id)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-200"
                  >
                    Postuler
                  </button>
                </div>
              </div>

              {/* Compétences requises */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Compétences requises :</h4>
                <div className="flex flex-wrap gap-2">
                  {offre.competences.map((competence, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      {competence}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Publiée le {new Date(offre.datePublication).toLocaleDateString('fr-FR')}
                </span>
                <div className="flex space-x-2">
                  <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    <i className="fas fa-heart mr-1"></i>Favoris
                  </button>
                  <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    <i className="fas fa-share mr-1"></i>Partager
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOffres.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffresPrestation; 