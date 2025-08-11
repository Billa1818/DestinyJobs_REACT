import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Demandes = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const [demandes] = useState([
    {
      id: 1,
      titre: 'Développement d\'application mobile',
      entreprise: 'TechCorp Solutions',
      localisation: 'Abidjan, Côte d\'Ivoire',
      budget: '500,000 - 800,000 FCFA',
      type: 'Développement',
      dateDemande: '2024-01-15',
      statut: 'En attente',
      priorite: 'Élevée',
      description: 'Création d\'une application mobile native pour la gestion de commandes...',
      competences: ['React Native', 'Node.js', 'MongoDB'],
      duree: '3-4 mois',
      derniereActivite: '2024-01-16'
    },
    {
      id: 2,
      titre: 'Design d\'identité visuelle',
      entreprise: 'Startup Innovante',
      localisation: 'Dakar, Sénégal',
      budget: '200,000 - 350,000 FCFA',
      type: 'Design',
      dateDemande: '2024-01-12',
      statut: 'En cours',
      priorite: 'Moyenne',
      description: 'Création complète de l\'identité visuelle d\'une startup tech...',
      competences: ['Adobe Creative Suite', 'Branding', 'UI/UX'],
      duree: '2-3 semaines',
      derniereActivite: '2024-01-14'
    },
    {
      id: 3,
      titre: 'Consultation en marketing digital',
      entreprise: 'E-commerce Plus',
      localisation: 'Lomé, Togo',
      budget: '300,000 - 500,000 FCFA',
      type: 'Marketing',
      dateDemande: '2024-01-10',
      statut: 'Acceptée',
      priorite: 'Faible',
      description: 'Stratégie de marketing digital pour une plateforme e-commerce...',
      competences: ['Google Ads', 'Facebook Ads', 'Analytics'],
      duree: '1-2 mois',
      derniereActivite: '2024-01-13'
    },
    {
      id: 4,
      titre: 'Formation en développement web',
      entreprise: 'Centre de Formation Tech',
      localisation: 'Ouagadougou, Burkina Faso',
      budget: '400,000 - 600,000 FCFA',
      type: 'Formation',
      dateDemande: '2024-01-08',
      statut: 'Refusée',
      priorite: 'Moyenne',
      description: 'Formation intensive en développement web pour 15 étudiants...',
      competences: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
      duree: '6 semaines',
      derniereActivite: '2024-01-11'
    },
    {
      id: 5,
      titre: 'Audit de sécurité informatique',
      entreprise: 'Banque Régionale',
      localisation: 'Bamako, Mali',
      budget: '800,000 - 1,200,000 FCFA',
      type: 'Sécurité',
      dateDemande: '2024-01-05',
      statut: 'Terminée',
      priorite: 'Élevée',
      description: 'Audit complet de sécurité pour une banque régionale...',
      competences: ['Cybersécurité', 'Pentesting', 'ISO 27001'],
      duree: '2-3 mois',
      derniereActivite: '2024-01-15'
    }
  ]);

  const filteredDemandes = demandes.filter(demande => {
    const matchesSearch = demande.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.localisation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || demande.statut.toLowerCase() === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const sortedDemandes = [...filteredDemandes].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.dateDemande) - new Date(a.dateDemande);
    } else if (sortBy === 'budget') {
      return parseInt(b.budget.split(' ')[0].replace(',', '')) - parseInt(a.budget.split(' ')[0].replace(',', ''));
    } else if (sortBy === 'priorite') {
      const prioriteOrder = { 'Élevée': 3, 'Moyenne': 2, 'Faible': 1 };
      return prioriteOrder[b.priorite] - prioriteOrder[a.priorite];
    }
    return 0;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Acceptée': return 'bg-green-100 text-green-800';
      case 'Refusée': return 'bg-red-100 text-red-800';
      case 'Terminée': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'Élevée': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Développement': return 'bg-blue-100 text-blue-800';
      case 'Design': return 'bg-purple-100 text-purple-800';
      case 'Marketing': return 'bg-green-100 text-green-800';
      case 'Formation': return 'bg-orange-100 text-orange-800';
      case 'Sécurité': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => d.statut === 'En attente').length,
    enCours: demandes.filter(d => d.statut === 'En cours').length,
    acceptees: demandes.filter(d => d.statut === 'Acceptée').length,
    refusees: demandes.filter(d => d.statut === 'Refusée').length,
    terminees: demandes.filter(d => d.statut === 'Terminée').length
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Mes Demandes</h1>
            <p className="text-gray-600">Suivez vos demandes de consultation et de services</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {sortedDemandes.length} demande{sortedDemandes.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-clipboard-list text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <i className="fas fa-clock text-yellow-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-lg font-semibold text-gray-900">{stats.enAttente}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-spinner text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-lg font-semibold text-gray-900">{stats.enCours}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-check text-green-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
              <p className="text-lg font-semibold text-gray-900">{stats.acceptees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <i className="fas fa-times text-red-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Refusées</p>
              <p className="text-lg font-semibold text-gray-900">{stats.refusees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <i className="fas fa-flag-checkered text-gray-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-lg font-semibold text-gray-900">{stats.terminees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher dans vos demandes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="recent">Plus récentes</option>
              <option value="budget">Budget élevé</option>
              <option value="priorite">Priorité</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'en attente', 'en cours', 'acceptée', 'refusée', 'terminée'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'all' ? 'Toutes' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demandes List */}
      <div className="space-y-4">
        {sortedDemandes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-clipboard-list text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Aucune demande ne correspond à votre recherche.' : 'Vous n\'avez pas encore de demandes de consultation.'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Effacer la recherche
              </button>
            ) : (
              <Link
                to="/prestataire/consultations"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <i className="fas fa-search mr-2"></i>
                Parcourir les consultations
              </Link>
            )}
          </div>
        ) : (
          sortedDemandes.map((demande) => (
            <div key={demande.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {demande.titre}
                        </h3>
                        <p className="text-gray-600 mb-2">{demande.entreprise}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(demande.type)}`}>
                          {demande.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(demande.statut)}`}>
                          {demande.statut}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioriteColor(demande.priorite)}`}>
                          {demande.priorite}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2 text-orange-500"></i>
                        {demande.localisation}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-money-bill-wave mr-2 text-green-500"></i>
                        {demande.budget}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-clock mr-2 text-blue-500"></i>
                        {demande.duree}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-calendar-plus mr-2 text-purple-500"></i>
                        Demandée le {new Date(demande.dateDemande).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{demande.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {demande.competences.map((competence, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {competence}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <i className="fas fa-history mr-1"></i>
                      Dernière activité : {new Date(demande.derniereActivite).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Link
                      to={`/prestataire/consultations/${demande.id}`}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Voir détails
                    </Link>
                    {demande.statut === 'En attente' && (
                      <button className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
                        <i className="fas fa-check mr-2"></i>
                        Accepter
                      </button>
                    )}
                    {demande.statut === 'En cours' && (
                      <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                        <i className="fas fa-comments mr-2"></i>
                        Contacter
                      </button>
                    )}
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <i className="fas fa-ellipsis-h mr-2"></i>
                      Plus d'actions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Demandes; 