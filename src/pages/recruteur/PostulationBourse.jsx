import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PostulationBourse = () => {
  const [filters, setFilters] = useState({
    bourse: '',
    statut: '',
    date: '',
    search: ''
  });

  const [postulations, setPostulations] = useState([
    {
      id: 1,
      candidat: 'Amina Kone',
      email: 'amina.kone@email.com',
      bourse: 'Bourse d\'excellence IT',
      statut: 'en-attente',
      datePostulation: '2024-01-15',
      montant: '500,000 FCFA',
      niveau: 'Master',
      specialite: 'Informatique',
      telephone: '+229 97 12 34 56',
      avatar: 'AK',
      documents: ['CV', 'Lettre de motivation', 'Relevés de notes'],
      notes: 'Candidat très prometteur avec un excellent dossier académique'
    },
    {
      id: 2,
      candidat: 'Marc Dossou',
      email: 'marc.dossou@email.com',
      bourse: 'Bourse entrepreneuriat',
      statut: 'accepte',
      datePostulation: '2024-01-14',
      montant: '750,000 FCFA',
      niveau: 'Licence',
      specialite: 'Gestion',
      telephone: '+229 96 87 65 43',
      avatar: 'MD',
      documents: ['CV', 'Business Plan', 'Recommandations'],
      notes: 'Projet entrepreneurial innovant avec un potentiel commercial élevé'
    },
    {
      id: 3,
      candidat: 'Fatou Diallo',
      email: 'fatou.diallo@email.com',
      bourse: 'Bourse recherche scientifique',
      statut: 'refuse',
      datePostulation: '2024-01-10',
      montant: '1,000,000 FCFA',
      niveau: 'Doctorat',
      specialite: 'Biologie',
      telephone: '+229 95 43 21 09',
      avatar: 'FD',
      documents: ['CV', 'Projet de recherche', 'Publications'],
      notes: 'Dossier incomplet, manque de publications récentes'
    },
    {
      id: 4,
      candidat: 'Kofi Mensah',
      email: 'kofi.mensah@email.com',
      bourse: 'Bourse d\'excellence IT',
      statut: 'en-attente',
      datePostulation: '2024-01-12',
      montant: '500,000 FCFA',
      niveau: 'Master',
      specialite: 'Intelligence Artificielle',
      telephone: '+229 94 56 78 90',
      avatar: 'KM',
      documents: ['CV', 'Lettre de motivation', 'Relevés de notes'],
      notes: 'Profil intéressant en IA, à approfondir'
    }
  ]);

  const [filteredPostulations, setFilteredPostulations] = useState(postulations);
  const [selectedPostulation, setSelectedPostulation] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = postulations;

    if (filters.bourse) {
      filtered = filtered.filter(p => p.bourse.includes(filters.bourse));
    }
    if (filters.statut) {
      filtered = filtered.filter(p => p.statut === filters.statut);
    }
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.candidat.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.specialite.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredPostulations(filtered);
  };

  const resetFilters = () => {
    setFilters({
      bourse: '',
      statut: '',
      date: '',
      search: ''
    });
    setFilteredPostulations(postulations);
  };

  const updateStatus = (id, newStatus) => {
    setPostulations(prev => 
      prev.map(p => p.id === id ? { ...p, statut: newStatus } : p)
    );
    setFilteredPostulations(prev => 
      prev.map(p => p.id === id ? { ...p, statut: newStatus } : p)
    );
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'accepte': return 'bg-green-100 text-green-800';
      case 'refuse': return 'bg-red-100 text-red-800';
      case 'en-attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'accepte': return 'Accepté';
      case 'refuse': return 'Refusé';
      case 'en-attente': return 'En attente';
      default: return statut;
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Postulations aux Bourses
          </h1>
          <p className="text-gray-600">
            Gérez les candidatures reçues pour vos bourses d'études
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bourse
              </label>
              <input
                type="text"
                name="bourse"
                value={filters.bourse}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rechercher par bourse..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="statut"
                value={filters.statut}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="en-attente">En attente</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom, email, spécialité..."
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{postulations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {postulations.filter(p => p.statut === 'en-attente').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {postulations.filter(p => p.statut === 'accepte').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refusées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {postulations.filter(p => p.statut === 'refuse').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Postulations List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des Postulations ({filteredPostulations.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bourse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPostulations.map((postulation) => (
                  <tr key={postulation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {postulation.avatar}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {postulation.candidat}
                          </div>
                          <div className="text-sm text-gray-500">
                            {postulation.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{postulation.bourse}</div>
                      <div className="text-sm text-gray-500">{postulation.niveau} - {postulation.specialite}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {postulation.montant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(postulation.statut)}`}>
                        {getStatusText(postulation.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(postulation.datePostulation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPostulation(postulation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir détails
                        </button>
                        {postulation.statut === 'en-attente' && (
                          <>
                            <button
                              onClick={() => updateStatus(postulation.id, 'accepte')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() => updateStatus(postulation.id, 'refuse')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for postulation details */}
      {selectedPostulation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Détails de la Postulation
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Candidat</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.candidat}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.telephone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bourse</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.bourse}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Niveau</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.niveau} - {selectedPostulation.specialite}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant demandé</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.montant}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Documents fournis</label>
                  <ul className="text-sm text-gray-900 list-disc list-inside">
                    {selectedPostulation.documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.notes}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedPostulation(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostulationBourse; 