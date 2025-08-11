import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CandidatureCard from '../../components/CandidatureCard';

const PostulationOffres = () => {
  const { offreId } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    experience: '',
    location: ''
  });

  // Données simulées de l'offre
  const [offre, setOffre] = useState({
    id: offreId,
    titre: 'Développeur Full Stack Senior',
    entreprise: 'TechCorp Solutions',
    localisation: 'Cotonou, Bénin',
    typeContrat: 'CDI',
    salaire: '180K - 300K FCFA',
    description: 'Recherche développeur expérimenté pour rejoindre notre équipe tech...',
    dateCreation: '2024-01-10',
    dateExpiration: '2024-02-10'
  });

  // Données simulées des candidatures
  const [candidatures, setCandidatures] = useState([
    {
      id: 1,
      nom: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      telephone: '+229 90 12 34 56',
      avatar: 'JD',
      experience: '5 ans',
      formation: 'Master en Informatique',
      localisation: 'Cotonou, Bénin',
      statut: 'nouvelle',
      dateCandidature: '2024-01-15',
      scoreCompatibilite: 85,
      lettreMotivation: 'Je suis très intéressé par ce poste...',
      cv: 'cv_jean_dupont.pdf',
      derniereActivite: 'Il y a 2 heures',
      cv: true,
      lettre: true,
      competences: ['React', 'Node.js', 'MongoDB', 'TypeScript']
    },
    {
      id: 2,
      nom: 'Marie Martin',
      email: 'marie.martin@email.com',
      telephone: '+229 91 23 45 67',
      avatar: 'MM',
      experience: '3 ans',
      formation: 'Licence en Informatique',
      localisation: 'Porto-Novo, Bénin',
      statut: 'en_cours',
      dateCandidature: '2024-01-14',
      scoreCompatibilite: 72,
      lettreMotivation: 'Ayant travaillé sur des projets similaires...',
      cv: 'cv_marie_martin.pdf',
      derniereActivite: 'Il y a 1 jour',
      cv: true,
      lettre: true,
      competences: ['JavaScript', 'Vue.js', 'PHP', 'MySQL']
    },
    {
      id: 3,
      nom: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      telephone: '+229 92 34 56 78',
      avatar: 'PD',
      experience: '7 ans',
      formation: 'Ingénieur en Informatique',
      localisation: 'Abomey-Calavi, Bénin',
      statut: 'entretien',
      dateCandidature: '2024-01-13',
      scoreCompatibilite: 91,
      lettreMotivation: 'Mon expérience en développement full stack...',
      cv: 'cv_pierre_durand.pdf',
      derniereActivite: 'Il y a 3 jours',
      cv: true,
      lettre: true,
      competences: ['React', 'Node.js', 'Python', 'Docker', 'AWS']
    },
    {
      id: 4,
      nom: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      telephone: '+229 93 45 67 89',
      avatar: 'SB',
      experience: '2 ans',
      formation: 'DUT en Informatique',
      localisation: 'Parakou, Bénin',
      statut: 'refusee',
      dateCandidature: '2024-01-12',
      scoreCompatibilite: 45,
      lettreMotivation: 'Je souhaite rejoindre votre équipe...',
      cv: 'cv_sophie_bernard.pdf',
      derniereActivite: 'Il y a 5 jours',
      cv: true,
      lettre: false,
      competences: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 5,
      candidat: {
        nom: 'Lucas Petit',
        email: 'lucas.petit@email.com',
        telephone: '+229 94 56 78 90',
        photo: 'https://via.placeholder.com/50x50',
        experience: '4 ans',
        formation: 'Master en Développement Web',
        localisation: 'Cotonou, Bénin'
      },
      statut: 'acceptee',
      dateCandidature: '2024-01-11',
      scoreCompatibilite: 88,
      lettreMotivation: 'Passionné par les nouvelles technologies...',
      cv: 'cv_lucas_petit.pdf',
      derniereActivite: 'Il y a 1 semaine'
    }
  ]);

  const [filteredCandidatures, setFilteredCandidatures] = useState(candidatures);

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
      default: return 'Inconnu';
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

  const updateCandidatureStatus = (candidatureId, newStatus) => {
    setCandidatures(prev => prev.map(candidature => 
      candidature.id === candidatureId 
        ? { ...candidature, statut: newStatus }
        : candidature
    ));
  };

  useEffect(() => {
    let filtered = candidatures;

    // Filtre par statut
    if (activeTab !== 'all') {
      filtered = filtered.filter(candidature => candidature.statut === activeTab);
    }

    // Filtre par recherche
    if (filters.search) {
      filtered = filtered.filter(candidature => 
        candidature.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidature.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtre par statut spécifique
    if (filters.status) {
      filtered = filtered.filter(candidature => candidature.statut === filters.status);
    }

    // Filtre par localisation
    if (filters.location) {
      filtered = filtered.filter(candidature => 
        candidature.localisation.includes(filters.location)
      );
    }

    setFilteredCandidatures(filtered);
  }, [candidatures, activeTab, filters]);

  const stats = {
    total: candidatures.length,
    nouvelles: candidatures.filter(c => c.statut === 'nouvelle').length,
    enCours: candidatures.filter(c => c.statut === 'en_cours').length,
    entretiens: candidatures.filter(c => c.statut === 'entretien').length,
    acceptees: candidatures.filter(c => c.statut === 'acceptee').length,
    refusees: candidatures.filter(c => c.statut === 'refusee').length
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Link to="/recruteur/gestion-offres" className="text-fuchsia-600 hover:text-fuchsia-700 mr-2">
                <i className="fas fa-arrow-left"></i>
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Candidatures reçues
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              {offre.titre} - {offre.entreprise}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {stats.total} candidature{stats.total > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-fuchsia-600">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.nouvelles}</div>
            <div className="text-xs text-gray-500">Nouvelles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.enCours}</div>
            <div className="text-xs text-gray-500">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.entretiens}</div>
            <div className="text-xs text-gray-500">Entretiens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.acceptees}</div>
            <div className="text-xs text-gray-500">Acceptées</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher un candidat..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
            >
              <option value="">Tous les statuts</option>
              <option value="nouvelle">Nouvelles</option>
              <option value="en_cours">En cours</option>
              <option value="entretien">Entretiens</option>
              <option value="acceptee">Acceptées</option>
              <option value="refusee">Refusées</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select 
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
            >
              <option value="">Toutes les localisations</option>
              <option value="Cotonou">Cotonou</option>
              <option value="Porto-Novo">Porto-Novo</option>
              <option value="Abomey-Calavi">Abomey-Calavi</option>
              <option value="Parakou">Parakou</option>
            </select>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'all' 
                ? 'bg-white text-fuchsia-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Toutes ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('nouvelle')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'nouvelle' 
                ? 'bg-white text-fuchsia-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nouvelles ({stats.nouvelles})
          </button>
          <button
            onClick={() => setActiveTab('en_cours')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'en_cours' 
                ? 'bg-white text-fuchsia-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            En cours ({stats.enCours})
          </button>
          <button
            onClick={() => setActiveTab('entretien')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
              activeTab === 'entretien' 
                ? 'bg-white text-fuchsia-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Entretiens ({stats.entretiens})
          </button>
        </div>
      </div>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {filteredCandidatures.map((candidature) => (
          <CandidatureCard
            key={candidature.id}
            candidature={candidature}
            type="offre"
            onViewDetails={(id) => console.log('Voir détails', id)}
            onViewCV={(id) => console.log('Voir CV', id)}
            onViewLettre={(id) => console.log('Voir Lettre', id)}
            onViewCompatibility={(id) => console.log('Voir Compatibilité', id)}
            onContact={(id) => console.log('Contacter', id)}
            onAddNote={(id) => console.log('Ajouter note', id)}
            onApprove={(id) => updateCandidatureStatus(id, 'en_cours')}
            onReject={(id) => updateCandidatureStatus(id, 'refusee')}
          />
        ))}
      </div>

      {/* État vide */}
      {filteredCandidatures.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-users text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature trouvée</h3>
          <p className="text-gray-600">Aucune candidature ne correspond aux critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default PostulationOffres; 