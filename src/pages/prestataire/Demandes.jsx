import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const Demandes = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDemandes();
    }
  }, [user]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      // Récupérer les candidatures du prestataire pour les consultations
      const applications = await dataService.getUserApplications(user.id);
      console.log('Candidatures récupérées:', applications);
      
      // Filtrer pour ne garder que les candidatures de consultations
      const consultationApplications = applications.filter(app => app.consultationId);
      setDemandes(consultationApplications);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const filteredDemandes = demandes.filter(demande => {
    // Pour les demandes de consultation, on utilise les champs de la base de données
    const matchesSearch = demande.proposal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.consultationId?.toString().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || demande.status?.toLowerCase() === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const sortedDemandes = [...filteredDemandes].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    } else if (sortBy === 'budget') {
      return (b.proposedBudget || 0) - (a.proposedBudget || 0);
    } else if (sortBy === 'priorite') {
      // Pour l'instant, on trie par statut
      return a.status?.localeCompare(b.status) || 0;
    }
    return 0;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'acceptée': return 'bg-green-100 text-green-800';
      case 'refusée': return 'bg-red-100 text-red-800';
      case 'terminée': return 'bg-gray-100 text-gray-800';
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
    enAttente: demandes.filter(d => d.status === 'en_attente').length,
    enCours: demandes.filter(d => d.status === 'en_cours').length,
    acceptees: demandes.filter(d => d.status === 'acceptée').length,
    refusees: demandes.filter(d => d.status === 'refusée').length,
    terminees: demandes.filter(d => d.status === 'terminée').length
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
            {['all', 'en_attente', 'en_cours', 'acceptée', 'refusée', 'terminée'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'all' ? 'Toutes' : 
                 tab === 'en_attente' ? 'En attente' :
                 tab === 'en_cours' ? 'En cours' :
                 tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demandes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-spinner fa-spin text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chargement des demandes...</h3>
            <p className="text-gray-600 mb-4">
              Nous récupérons vos demandes de consultation.
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-400 mb-4">
              <i className="fas fa-exclamation-triangle text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={fetchDemandes}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Réessayer
            </button>
          </div>
        ) : sortedDemandes.length === 0 ? (
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
                          Consultation #{demande.consultationId}
                        </h3>
                        <p className="text-gray-600 mb-2">Proposition soumise</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(demande.status)}`}>
                          {demande.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-money-bill-wave mr-2 text-green-500"></i>
                        Budget: {demande.proposedBudget} FCFA
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-clock mr-2 text-blue-500"></i>
                        Délai: {demande.timeline}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-calendar-plus mr-2 text-purple-500"></i>
                        Postulé le {new Date(demande.appliedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{demande.proposal}</p>

                    {demande.methodology && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Méthodologie :</h4>
                        <p className="text-gray-700 text-sm">{demande.methodology}</p>
                      </div>
                    )}

                    {demande.experience && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Expérience :</h4>
                        <p className="text-gray-700 text-sm">{demande.experience}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Les compétences ne sont pas disponibles dans les données d'application */}
                      {/* {demande.competences && demande.competences.map((competence, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {competence}
                        </span>
                      ))} */}
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <i className="fas fa-history mr-1"></i>
                      Dernière activité : {new Date(demande.appliedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Link
                      to={`/prestataire/consultation/${demande.consultationId}`}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Voir consultation
                    </Link>
                    {demande.status === 'en_attente' && (
                      <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        <i className="fas fa-clock mr-2"></i>
                        En attente
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
