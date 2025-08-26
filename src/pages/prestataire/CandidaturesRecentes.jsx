import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidaturesRecentes = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [candidatures] = useState([
    {
      id: 1,
      title: 'Développement d\'application mobile',
      client: 'TechStart Bénin',
      status: 'En attente',
      date: 'Il y a 2 jours',
      budget: '500K FCFA',
      type: 'Développement',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Formation en marketing digital',
      client: 'Digital Academy',
      status: 'Acceptée',
      date: 'Il y a 1 semaine',
      budget: '800K FCFA',
      type: 'Formation',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Audit de sécurité informatique',
      client: 'Banque du Bénin',
      status: 'En cours',
      date: 'Il y a 3 jours',
      budget: '1.2M FCFA',
      type: 'Consultation',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Design d\'identité visuelle',
      client: 'StartupBJ',
      status: 'Refusée',
      date: 'Il y a 1 semaine',
      budget: '300K FCFA',
      type: 'Design',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Formation équipe commerciale',
      client: 'Retail Plus',
      status: 'En attente',
      date: 'Il y a 5 jours',
      budget: '600K FCFA',
      type: 'Formation',
      priority: 'medium'
    }
  ]);

  const filteredCandidatures = candidatures.filter(candidature => {
    const matchesSearch = candidature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidature.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || candidature.status.toLowerCase().includes(activeTab);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Acceptée':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refusée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Élevée';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Faible';
      default:
        return 'Normale';
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>
            <p className="text-gray-600 mt-1">Suivez l'état de vos candidatures aux consultations</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>Trier par date</option>
              <option>Trier par statut</option>
              <option>Trier par budget</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'all' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Toutes ({candidatures.length})
          </button>
          <button
            onClick={() => setActiveTab('en attente')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'en attente' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            En attente ({candidatures.filter(c => c.status === 'En attente').length})
          </button>
          <button
            onClick={() => setActiveTab('acceptée')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'acceptée' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Acceptées ({candidatures.filter(c => c.status === 'Acceptée').length})
          </button>
          <button
            onClick={() => setActiveTab('en cours')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'en cours' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            En cours ({candidatures.filter(c => c.status === 'En cours').length})
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <i className="fas fa-paper-plane text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{candidatures.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <i className="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{candidatures.filter(c => c.status === 'En attente').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
              <p className="text-2xl font-bold text-gray-900">{candidatures.filter(c => c.status === 'Acceptée').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <i className="fas fa-money-bill-wave text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus potentiels</p>
              <p className="text-2xl font-bold text-gray-900">3.4M FCFA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidatures List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes candidatures emploi</h2>
        </div>
        <div className="p-6">
          {filteredCandidatures.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature trouvée</h3>
              <p className="text-gray-600">Aucune candidature ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCandidatures.map((candidature) => (
                <div key={candidature.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="fas fa-briefcase text-orange-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 cursor-pointer">
                            <Link to={`/prestataire/consultation/${candidature.id}`}>
                              {candidature.title}
                            </Link>
                          </h3>
                          <p className="text-orange-600 font-medium">{candidature.client}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <i className="fas fa-calendar mr-2"></i>
                          <span>{candidature.date}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-money-bill mr-2"></i>
                          <span>{candidature.budget}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-tag mr-2"></i>
                          <span>{candidature.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidature.status)}`}>
                          {candidature.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(candidature.priority)}`}>
                          {getPriorityText(candidature.priority)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-orange-600">
                          <i className="fas fa-heart"></i>
                        </button>
                        <button className="text-gray-400 hover:text-orange-600">
                          <i className="fas fa-share"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <Link 
                        to={`/prestataire/consultation/${candidature.id}`}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        Voir détails →
                      </Link>
                      {candidature.status === 'En attente' && (
                        <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                          Annuler
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {candidature.status === 'Acceptée' && (
                        <Link 
                          to={`/prestataire/projet/${candidature.id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                        >
                          Commencer
                        </Link>
                      )}
                      {candidature.status === 'En cours' && (
                        <Link 
                          to={`/prestataire/projet/${candidature.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                        >
                          Continuer
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
            <i className="fas fa-chevron-left mr-1"></i>
            Précédent
          </button>
          <button className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm">1</button>
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">2</button>
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">3</button>
          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
            Suivant
            <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </nav>
      </div>
    </main>
  );
};

export default CandidaturesRecentes; 