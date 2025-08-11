import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CandidatureCard from '../../components/CandidatureCard';

const PostulationFinancements = () => {
  const { financementId } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    montant: '',
    secteur: ''
  });

  // Données simulées du financement
  const [financement, setFinancement] = useState({
    id: financementId,
    titre: 'Financement Innovation Tech',
    entreprise: 'Banque de Développement',
    montant: '50,000,000 FCFA',
    secteur: 'Technologie',
    description: 'Financement pour projets innovants dans le secteur technologique...',
    dateCreation: '2024-01-10',
    dateExpiration: '2024-02-10',
    type: 'Prêt à taux préférentiel'
  });

  // Données simulées des postulations
  const [postulations, setPostulations] = useState([
    {
      id: 1,
      nom: 'Amina Kone',
      email: 'amina.kone@email.com',
      telephone: '+229 90 12 34 56',
      avatar: 'AK',
      experience: '3 ans',
      formation: 'Master en Entrepreneuriat',
      localisation: 'Cotonou, Bénin',
      statut: 'nouvelle',
      dateCandidature: '2024-01-15',
      montantDemande: '25,000,000 FCFA',
      secteur: 'E-commerce',
      scoreCompatibilite: 88,
      projet: 'Plateforme de vente en ligne innovante',
      businessPlan: 'business_plan_amina.pdf',
      derniereActivite: 'Il y a 2 heures',
      cv: true,
      lettre: true,
      competences: ['E-commerce', 'Développement web', 'Marketing digital']
    },
    {
      id: 2,
      nom: 'Marc Dossou',
      email: 'marc.dossou@email.com',
      telephone: '+229 91 23 45 67',
      avatar: 'MD',
      experience: '5 ans',
      formation: 'MBA en Finance',
      localisation: 'Porto-Novo, Bénin',
      statut: 'en_cours',
      dateCandidature: '2024-01-14',
      montantDemande: '35,000,000 FCFA',
      secteur: 'Fintech',
      scoreCompatibilite: 92,
      projet: 'Application mobile de paiement',
      businessPlan: 'business_plan_marc.pdf',
      derniereActivite: 'Il y a 1 jour',
      cv: true,
      lettre: true,
      competences: ['Fintech', 'Développement mobile', 'Blockchain']
    },
    {
      id: 3,
      nom: 'Fatou Diallo',
      email: 'fatou.diallo@email.com',
      telephone: '+229 92 34 56 78',
      avatar: 'FD',
      experience: '2 ans',
      formation: 'Licence en Informatique',
      localisation: 'Abomey-Calavi, Bénin',
      statut: 'entretien',
      dateCandidature: '2024-01-13',
      montantDemande: '15,000,000 FCFA',
      secteur: 'Éducation',
      scoreCompatibilite: 78,
      projet: 'Plateforme d\'apprentissage en ligne',
      businessPlan: 'business_plan_fatou.pdf',
      derniereActivite: 'Il y a 3 jours',
      cv: true,
      lettre: false,
      competences: ['Éducation', 'Développement web', 'E-learning']
    },
    {
      id: 4,
      nom: 'Kofi Mensah',
      email: 'kofi.mensah@email.com',
      telephone: '+229 93 45 67 89',
      avatar: 'KM',
      experience: '4 ans',
      formation: 'Ingénieur en Télécommunications',
      localisation: 'Parakou, Bénin',
      statut: 'refusee',
      dateCandidature: '2024-01-12',
      montantDemande: '45,000,000 FCFA',
      secteur: 'Télécommunications',
      scoreCompatibilite: 65,
      projet: 'Réseau de fibre optique rural',
      businessPlan: 'business_plan_kofi.pdf',
      derniereActivite: 'Il y a 5 jours',
      cv: true,
      lettre: true,
      competences: ['Télécommunications', 'Infrastructure', 'Fibre optique']
    }
  ]);

  const [filteredPostulations, setFilteredPostulations] = useState(postulations);
  const [selectedPostulation, setSelectedPostulation] = useState(null);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'nouvelle': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'entretien': return 'bg-purple-100 text-purple-800';
      case 'acceptee': return 'bg-green-100 text-green-800';
      case 'refusee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'nouvelle': return 'Nouvelle';
      case 'en_cours': return 'En cours';
      case 'entretien': return 'Entretien';
      case 'acceptee': return 'Acceptée';
      case 'refusee': return 'Refusée';
      default: return statut;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updatePostulationStatus = (postulationId, newStatus) => {
    setPostulations(prev => 
      prev.map(p => p.id === postulationId ? { ...p, statut: newStatus } : p)
    );
    setFilteredPostulations(prev => 
      prev.map(p => p.id === postulationId ? { ...p, statut: newStatus } : p)
    );
  };

  const applyFilters = () => {
    let filtered = postulations;

    if (filters.search) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.projet.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(p => p.statut === filters.status);
    }

    if (filters.secteur) {
      filtered = filtered.filter(p => p.secteur === filters.secteur);
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter(p => p.statut === activeTab);
    }

    setFilteredPostulations(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, activeTab]);

  const tabs = [
    { id: 'all', label: 'Toutes', count: postulations.length },
    { id: 'nouvelle', label: 'Nouvelles', count: postulations.filter(p => p.statut === 'nouvelle').length },
    { id: 'en_cours', label: 'En cours', count: postulations.filter(p => p.statut === 'en_cours').length },
    { id: 'entretien', label: 'Entretien', count: postulations.filter(p => p.statut === 'entretien').length },
    { id: 'acceptee', label: 'Acceptées', count: postulations.filter(p => p.statut === 'acceptee').length },
    { id: 'refusee', label: 'Refusées', count: postulations.filter(p => p.statut === 'refusee').length }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Postulations - {financement.titre}
              </h1>
              <p className="text-gray-600">
                {filteredPostulations.length} postulation(s) trouvée(s)
              </p>
            </div>
            <Link
              to="/recruteur/postulations-financements"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              ← Retour
            </Link>
          </div>
        </div>

        {/* Financement Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails du Financement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <p className="text-sm text-gray-900">{financement.titre}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant</label>
              <p className="text-sm text-gray-900">{financement.montant}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secteur</label>
              <p className="text-sm text-gray-900">{financement.secteur}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-900">{financement.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
              <p className="text-sm text-gray-900">{new Date(financement.dateExpiration).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entreprise</label>
              <p className="text-sm text-gray-900">{financement.entreprise}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                placeholder="Nom, email, projet..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="nouvelle">Nouvelle</option>
                <option value="en_cours">En cours</option>
                <option value="entretien">Entretien</option>
                <option value="acceptee">Acceptée</option>
                <option value="refusee">Refusée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secteur
              </label>
              <select
                name="secteur"
                value={filters.secteur}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les secteurs</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Fintech">Fintech</option>
                <option value="Éducation">Éducation</option>
                <option value="Télécommunications">Télécommunications</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ search: '', status: '', montant: '', secteur: '' });
                  setActiveTab('all');
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des candidatures */}
        <div className="space-y-4">
          {filteredPostulations.map((postulation) => (
            <CandidatureCard
              key={postulation.id}
              candidature={postulation}
              type="financement"
              onViewDetails={(id) => setSelectedPostulation(postulation)}
              onViewCV={(id) => console.log('Voir CV', id)}
              onViewBusinessPlan={(id) => console.log('Voir Business Plan', id)}
              onViewCompatibility={(id) => console.log('Voir Compatibilité', id)}
              onContact={(id) => console.log('Contacter', id)}
              onAddNote={(id) => console.log('Ajouter note', id)}
              onApprove={(id) => updatePostulationStatus(id, 'en_cours')}
              onReject={(id) => updatePostulationStatus(id, 'refusee')}
            />
          ))}
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
                  <p className="text-sm text-gray-900">{selectedPostulation.nom}</p>
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
                  <label className="block text-sm font-medium text-gray-700">Projet</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.projet}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Secteur</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.secteur}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant demandé</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.montantDemande}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Score de compatibilité</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.scoreCompatibilite}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Formation</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.formation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expérience</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.experience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Plan</label>
                  <p className="text-sm text-gray-900">{selectedPostulation.businessPlan}</p>
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

export default PostulationFinancements; 