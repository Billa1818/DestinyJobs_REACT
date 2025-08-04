import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const GestionFinancement = () => {
  const { user } = useAuth();
  const [financements, setFinancements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFinancements, setSelectedFinancements] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    type: '',
    sector: ''
  });

  useEffect(() => {
    fetchFinancements();
  }, [user]);

  const fetchFinancements = async () => {
    try {
      setLoading(true);
      const financementsData = await dataService.getFinancements({ recruiterId: user.id });
      setFinancements(financementsData);
    } catch (error) {
      setError('Erreur lors du chargement des financements');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFinancement = async (financementId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce financement ? Cette action est irréversible.')) {
      try {
        await dataService.deleteFinancement(financementId);
        setFinancements(financements.filter(f => f.id !== financementId));
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleStatus = async (financementId, currentStatus) => {
    try {
      const newStatus = currentStatus ? false : true;
      await dataService.updateFinancement(financementId, { isActive: newStatus });
      setFinancements(financements.map(f => 
        f.id === financementId ? { ...f, isActive: newStatus } : f
      ));
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDuplicateFinancement = async (financementId) => {
    try {
      const originalFinancement = financements.find(f => f.id === financementId);
      if (!originalFinancement) return;

      const duplicatedFinancement = {
        ...originalFinancement,
        title: `${originalFinancement.title} (Copie)`,
        isActive: false,
        applications: 0,
        createdAt: new Date().toISOString()
      };

      delete duplicatedFinancement.id;
      const newFinancement = await dataService.createFinancement(duplicatedFinancement);
      setFinancements([...financements, newFinancement]);
    } catch (error) {
      setError('Erreur lors de la duplication');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedFinancements.length === 0) return;

    try {
      const promises = selectedFinancements.map(financementId => {
        switch (bulkAction) {
          case 'activate':
            return dataService.updateFinancement(financementId, { isActive: true });
          case 'deactivate':
            return dataService.updateFinancement(financementId, { isActive: false });
          case 'delete':
            return dataService.deleteFinancement(financementId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      if (bulkAction === 'delete') {
        setFinancements(financements.filter(f => !selectedFinancements.includes(f.id)));
      } else {
        setFinancements(financements.map(f => 
          selectedFinancements.includes(f.id) 
            ? { ...f, isActive: bulkAction === 'activate' }
            : f
        ));
      }
      
      setSelectedFinancements([]);
      setBulkAction('');
    } catch (error) {
      setError('Erreur lors de l\'action en lot');
    }
  };

  const handleSelectAll = () => {
    if (selectedFinancements.length === filteredFinancements.length) {
      setSelectedFinancements([]);
    } else {
      setSelectedFinancements(filteredFinancements.map(f => f.id));
    }
  };

  const handleSelectFinancement = (financementId) => {
    setSelectedFinancements(prev => 
      prev.includes(financementId) 
        ? prev.filter(id => id !== financementId)
        : [...prev, financementId]
    );
  };

  const filteredFinancements = financements.filter(financement => {
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && financement.isActive) ||
      (filters.status === 'inactive' && !financement.isActive);
    
    const matchesSearch = !filters.search || 
      financement.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      financement.institution.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = !filters.type || financement.type === filters.type;
    const matchesSector = !filters.sector || financement.sector === filters.sector;

    return matchesStatus && matchesSearch && matchesType && matchesSector;
  });

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getTypeColor = (type) => {
    const colors = {
      'microcredit': 'bg-blue-100 text-blue-800',
      'pret_bancaire': 'bg-green-100 text-green-800',
      'subvention': 'bg-purple-100 text-purple-800',
      'capital_risque': 'bg-orange-100 text-orange-800',
      'crowdfunding': 'bg-pink-100 text-pink-800',
      'bourse': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeText = (type) => {
    const types = {
      'microcredit': 'Microcrédit',
      'pret_bancaire': 'Prêt bancaire',
      'subvention': 'Subvention',
      'capital_risque': 'Capital risque',
      'crowdfunding': 'Financement participatif',
      'bourse': 'Bourse'
    };
    return types[type] || type;
  };

  const stats = {
    total: financements.length,
    active: financements.filter(f => f.isActive).length,
    inactive: financements.filter(f => !f.isActive).length,
    totalApplications: financements.reduce((sum, f) => sum + (f.applications || 0), 0)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des financements</h1>
            <p className="text-gray-600">Gérez vos offres de financement publiées</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/recruteur/creer-financement"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer un financement
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
              <i className="fas fa-hand-holding-usd text-fuchsia-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total financements</p>
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
              <p className="text-sm text-gray-500">Financements actifs</p>
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
              <p className="text-sm text-gray-500">Financements inactifs</p>
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
              placeholder="Titre ou institution..."
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
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="microcredit">Microcrédit</option>
              <option value="pret_bancaire">Prêt bancaire</option>
              <option value="subvention">Subvention</option>
              <option value="capital_risque">Capital risque</option>
              <option value="crowdfunding">Financement participatif</option>
              <option value="bourse">Bourse</option>
            </select>
          </div>
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
              Secteur
            </label>
            <select
              id="sector"
              value={filters.sector}
              onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les secteurs</option>
              <option value="agriculture">Agriculture</option>
              <option value="technologie">Technologie</option>
              <option value="sante">Santé</option>
              <option value="education">Éducation</option>
              <option value="commerce">Commerce</option>
              <option value="industrie">Industrie</option>
              <option value="services">Services</option>
              <option value="artisanat">Artisanat</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', search: '', type: '', sector: '' })}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFinancements.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedFinancements.length} financement(s) sélectionné(s)
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
              onClick={() => setSelectedFinancements([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Financements List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="fas fa-hand-holding-usd mr-2 text-fuchsia-600"></i>
              Financements ({filteredFinancements.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                {selectedFinancements.length === filteredFinancements.length ? 'Désélectionner tout' : 'Sélectionner tout'}
              </button>
            </div>
          </div>
        </div>

        {filteredFinancements.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-hand-holding-usd text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun financement trouvé</h3>
            <p className="text-gray-600 mb-4">
              {financements.length === 0 
                ? "Vous n'avez pas encore créé de financements."
                : "Aucun financement ne correspond à vos critères de recherche."
              }
            </p>
            <Link 
              to="/recruteur/creer-financement"
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer votre premier financement
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFinancements.map((financement) => (
              <div key={financement.id} className="p-6 hover:bg-gray-50 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedFinancements.includes(financement.id)}
                        onChange={() => handleSelectFinancement(financement.id)}
                        className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{financement.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(financement.isActive)}`}>
                        {getStatusText(financement.isActive)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(financement.type)}`}>
                        {getTypeText(financement.type)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <i className="fas fa-building mr-2 text-fuchsia-600"></i>
                        <span>{financement.institution}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
                        <span>{financement.geographicZone}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2 text-fuchsia-600"></i>
                        <span>{financement.applications || 0} candidature(s)</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="fas fa-money-bill-wave mr-2 text-fuchsia-600"></i>
                        <span>{financement.minAmount?.toLocaleString()} - {financement.maxAmount?.toLocaleString()} FCFA</span>
                      </div>
                      {financement.interestRate && (
                        <div className="flex items-center">
                          <i className="fas fa-percentage mr-2 text-fuchsia-600"></i>
                          <span>{financement.interestRate}% taux d'intérêt</span>
                        </div>
                      )}
                      {financement.sector && (
                        <div className="flex items-center">
                          <i className="fas fa-industry mr-2 text-fuchsia-600"></i>
                          <span>{financement.sector}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/recruteur/postulations-financements/${financement.id}`}
                      className="px-3 py-1 text-sm text-fuchsia-600 hover:text-fuchsia-800 border border-fuchsia-300 rounded hover:bg-fuchsia-50 transition duration-200"
                      title="Voir les candidatures"
                    >
                      <i className="fas fa-eye mr-1"></i>Voir
                    </Link>
                    <Link
                      to={`/recruteur/modifier-financement/${financement.id}`}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition duration-200"
                      title="Modifier le financement"
                    >
                      <i className="fas fa-edit mr-1"></i>Modifier
                    </Link>
                    <button
                      onClick={() => handleDuplicateFinancement(financement.id)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition duration-200"
                      title="Dupliquer le financement"
                    >
                      <i className="fas fa-copy mr-1"></i>Dupliquer
                    </button>
                    <button
                      onClick={() => handleToggleStatus(financement.id, financement.isActive)}
                      className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                        financement.isActive
                          ? 'text-red-600 border-red-300 hover:bg-red-50'
                          : 'text-green-600 border-green-300 hover:bg-green-50'
                      }`}
                      title={financement.isActive ? 'Désactiver le financement' : 'Activer le financement'}
                    >
                      <i className={`fas ${financement.isActive ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                      {financement.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDeleteFinancement(financement.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition duration-200"
                      title="Supprimer le financement"
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

export default GestionFinancement;