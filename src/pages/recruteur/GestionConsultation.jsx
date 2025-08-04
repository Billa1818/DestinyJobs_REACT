import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const GestionConsultation = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConsultations, setSelectedConsultations] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    domaine: '',
    duree: ''
  });

  useEffect(() => {
    fetchConsultations();
  }, [user]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const consultationsData = await dataService.getConsultations({ recruiterId: user.id });
      setConsultations(consultationsData);
    } catch (error) {
      setError('Erreur lors du chargement des consultations');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConsultation = async (consultationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action est irréversible.')) {
      try {
        await dataService.deleteConsultation(consultationId);
        setConsultations(consultations.filter(c => c.id !== consultationId));
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleStatus = async (consultationId, currentStatus) => {
    try {
      const newStatus = currentStatus ? false : true;
      await dataService.updateConsultation(consultationId, { isActive: newStatus });
      setConsultations(consultations.map(c => 
        c.id === consultationId ? { ...c, isActive: newStatus } : c
      ));
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDuplicateConsultation = async (consultationId) => {
    try {
      const originalConsultation = consultations.find(c => c.id === consultationId);
      if (!originalConsultation) return;

      const duplicatedConsultation = {
        ...originalConsultation,
        titre: `${originalConsultation.titre} (Copie)`,
        isActive: false,
        applications: 0,
        createdAt: new Date().toISOString()
      };

      delete duplicatedConsultation.id;
      const newConsultation = await dataService.createConsultation(duplicatedConsultation);
      setConsultations([...consultations, newConsultation]);
    } catch (error) {
      setError('Erreur lors de la duplication');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedConsultations.length === 0) return;

    try {
      const promises = selectedConsultations.map(consultationId => {
        switch (bulkAction) {
          case 'activate':
            return dataService.updateConsultation(consultationId, { isActive: true });
          case 'deactivate':
            return dataService.updateConsultation(consultationId, { isActive: false });
          case 'delete':
            return dataService.deleteConsultation(consultationId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      if (bulkAction === 'delete') {
        setConsultations(consultations.filter(c => !selectedConsultations.includes(c.id)));
      } else {
        setConsultations(consultations.map(c => 
          selectedConsultations.includes(c.id) 
            ? { ...c, isActive: bulkAction === 'activate' }
            : c
        ));
      }
      
      setSelectedConsultations([]);
      setBulkAction('');
    } catch (error) {
      setError('Erreur lors de l\'action en lot');
    }
  };

  const handleSelectAll = () => {
    if (selectedConsultations.length === filteredConsultations.length) {
      setSelectedConsultations([]);
    } else {
      setSelectedConsultations(filteredConsultations.map(c => c.id));
    }
  };

  const handleSelectConsultation = (consultationId) => {
    setSelectedConsultations(prev => 
      prev.includes(consultationId) 
        ? prev.filter(id => id !== consultationId)
        : [...prev, consultationId]
    );
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && consultation.isActive) ||
      (filters.status === 'inactive' && !consultation.isActive);
    
    const matchesSearch = !filters.search || 
      consultation.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
      consultation.domaine.toLowerCase().includes(filters.search.toLowerCase());

    const matchesDomaine = !filters.domaine || consultation.domaine === filters.domaine;
    const matchesDuree = !filters.duree || consultation.duree === filters.duree;

    return matchesStatus && matchesSearch && matchesDomaine && matchesDuree;
  });

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getDomaineColor = (domaine) => {
    const colors = {
      'strategie': 'bg-blue-100 text-blue-800',
      'marketing': 'bg-purple-100 text-purple-800',
      'finance': 'bg-green-100 text-green-800',
      'technologie': 'bg-orange-100 text-orange-800',
      'rh': 'bg-pink-100 text-pink-800',
      'autres': 'bg-gray-100 text-gray-800'
    };
    return colors[domaine] || 'bg-gray-100 text-gray-800';
  };

  const getDomaineText = (domaine) => {
    const domaines = {
      'strategie': 'Stratégie',
      'marketing': 'Marketing',
      'finance': 'Finance',
      'technologie': 'Technologie',
      'rh': 'Ressources Humaines',
      'autres': 'Autres'
    };
    return domaines[domaine] || domaine;
  };

  const getDureeText = (duree) => {
    const durees = {
      '1-mois': '1 mois',
      '3-mois': '3 mois',
      '6-mois': '6 mois',
      '1-an': '1 an',
      'ponctuel': 'Ponctuel'
    };
    return durees[duree] || duree;
  };

  const stats = {
    total: consultations.length,
    active: consultations.filter(c => c.isActive).length,
    inactive: consultations.filter(c => !c.isActive).length,
    totalApplications: consultations.reduce((sum, c) => sum + (c.applications || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des consultations</h1>
            <p className="text-gray-600">Gérez vos missions de consultation publiées</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/recruteur/creer-consultation"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer une consultation
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-fuchsia-100 rounded-lg">
              <i className="fas fa-handshake text-fuchsia-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total consultations</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-check-circle text-green-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Consultations actives</p>
              <p className="text-lg font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <i className="fas fa-pause-circle text-red-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Consultations inactives</p>
              <p className="text-lg font-semibold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-users text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Candidatures</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Titre ou domaine..."
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
          <div>
            <label htmlFor="domaine" className="block text-sm font-medium text-gray-700 mb-2">
              Domaine
            </label>
            <select
              id="domaine"
              value={filters.domaine}
              onChange={(e) => setFilters(prev => ({ ...prev, domaine: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les domaines</option>
              <option value="strategie">Stratégie</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="technologie">Technologie</option>
              <option value="rh">Ressources Humaines</option>
              <option value="autres">Autres</option>
            </select>
          </div>
          <div>
            <label htmlFor="duree" className="block text-sm font-medium text-gray-700 mb-2">
              Durée
            </label>
            <select
              id="duree"
              value={filters.duree}
              onChange={(e) => setFilters(prev => ({ ...prev, duree: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Toutes les durées</option>
              <option value="1-mois">1 mois</option>
              <option value="3-mois">3 mois</option>
              <option value="6-mois">6 mois</option>
              <option value="1-an">1 an</option>
              <option value="ponctuel">Ponctuel</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', search: '', domaine: '', duree: '' })}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedConsultations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedConsultations.length} consultation(s) sélectionnée(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-blue-300 rounded text-sm"
              >
                <option value="">Actions en lot</option>
                <option value="activate">Activer</option>
                <option value="deactivate">Désactiver</option>
                <option value="delete">Supprimer</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Appliquer
              </button>
            </div>
            <button
              onClick={() => setSelectedConsultations([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Consultations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="fas fa-handshake mr-2 text-fuchsia-600"></i>
              Consultations ({filteredConsultations.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                {selectedConsultations.length === filteredConsultations.length ? 'Désélectionner tout' : 'Sélectionner tout'}
              </button>
            </div>
          </div>
        </div>

        {filteredConsultations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-handshake text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation trouvée</h3>
            <p className="text-gray-600 mb-4">
              {consultations.length === 0 
                ? "Vous n'avez pas encore créé de consultations."
                : "Aucune consultation ne correspond à vos critères de recherche."
              }
            </p>
            <Link 
              to="/recruteur/creer-consultation"
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer votre première consultation
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="p-6 hover:bg-gray-50 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedConsultations.includes(consultation.id)}
                        onChange={() => handleSelectConsultation(consultation.id)}
                        className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{consultation.titre}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.isActive)}`}>
                        {getStatusText(consultation.isActive)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDomaineColor(consultation.domaine)}`}>
                        {getDomaineText(consultation.domaine)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
                        <span>{getDureeText(consultation.duree)}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-money-bill-wave mr-2 text-fuchsia-600"></i>
                        <span>{consultation.budget?.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2 text-fuchsia-600"></i>
                        <span>{consultation.applications || 0} candidature(s)</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
                        <span>{consultation.localisation}</span>
                      </div>
                      {consultation.dateLimite && (
                        <div className="flex items-center">
                          <i className="fas fa-calendar mr-2 text-fuchsia-600"></i>
                          <span>Limite: {new Date(consultation.dateLimite).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/recruteur/postulations-consultations/${consultation.id}`}
                      className="px-3 py-1 text-sm text-fuchsia-600 hover:text-fuchsia-800 border border-fuchsia-300 rounded hover:bg-fuchsia-50 transition duration-200"
                      title="Voir les candidatures"
                    >
                      <i className="fas fa-eye mr-1"></i>Voir
                    </Link>
                    <Link
                      to={`/recruteur/modifier-consultation/${consultation.id}`}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition duration-200"
                      title="Modifier la consultation"
                    >
                      <i className="fas fa-edit mr-1"></i>Modifier
                    </Link>
                    <button
                      onClick={() => handleDuplicateConsultation(consultation.id)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition duration-200"
                      title="Dupliquer la consultation"
                    >
                      <i className="fas fa-copy mr-1"></i>Dupliquer
                    </button>
                    <button
                      onClick={() => handleToggleStatus(consultation.id, consultation.isActive)}
                      className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                        consultation.isActive
                          ? 'text-red-600 border-red-300 hover:bg-red-50'
                          : 'text-green-600 border-green-300 hover:bg-green-50'
                      }`}
                      title={consultation.isActive ? 'Désactiver la consultation' : 'Activer la consultation'}
                    >
                      <i className={`fas ${consultation.isActive ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                      {consultation.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDeleteConsultation(consultation.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition duration-200"
                      title="Supprimer la consultation"
                    >
                      <i className="fas fa-trash mr-1"></i>Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionConsultation;