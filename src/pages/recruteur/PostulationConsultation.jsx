import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CandidatureCard from '../../components/CandidatureCard';

const PostulationConsultation = () => {
  const { consultationId } = useParams();
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  // Données des consultations
  const consultations = {
    1: {
      id: 1,
      titre: 'Audit Marketing Digital',
      description: 'Analyse complète de votre stratégie marketing digitale',
      budget: '500,000 - 1,500,000 FCFA',
      duree: '2-4 semaines',
      statut: 'active'
    },
    2: {
      id: 2,
      titre: 'Formation Gestion d\'Équipe',
      description: 'Formation en leadership et management d\'équipe',
      budget: '300,000 - 800,000 FCFA',
      duree: '1-2 semaines',
      statut: 'active'
    },
    3: {
      id: 3,
      titre: 'Conseil Stratégie Financière',
      description: 'Optimisation de votre stratégie financière',
      budget: '800,000 - 2,000,000 FCFA',
      duree: '3-6 semaines',
      statut: 'active'
    }
  };

  const consultation = consultations[consultationId];

  // Données simulées des candidatures par consultation
  const candidaturesParConsultation = {
    1: [ // Audit Marketing Digital
      {
        id: 1,
        nom: 'Jean-Baptiste KOUAME',
        email: 'jean.kouame@email.com',
        telephone: '+229 90 12 34 56',
        avatar: 'JK',
        experience: '5 ans',
        formation: 'Master en Marketing Digital',
        localisation: 'Cotonou, Bénin',
        statut: 'nouvelle',
        dateCandidature: '2024-01-15',
        scoreCompatibilite: 85,
        consultation: 'Audit Marketing Digital',
        tarif: '60K FCFA/jour',
        note: 4.8,
        cv: true,
        lettre: true,
        competences: ['Marketing Digital', 'SEO/SEA', 'Analytics', 'Stratégie']
      },
      {
        id: 4,
        nom: 'Fatou DIALLO',
        email: 'fatou.diallo@email.com',
        telephone: '+229 93 45 67 89',
        avatar: 'FD',
        experience: '3 ans',
        formation: 'Licence en Communication',
        localisation: 'Parakou, Bénin',
        statut: 'refusee',
        dateCandidature: '2024-01-12',
        scoreCompatibilite: 65,
        consultation: 'Audit Marketing Digital',
        tarif: '45K FCFA/jour',
        note: 4.2,
        cv: true,
        lettre: true,
        competences: ['Communication', 'Marketing', 'Réseaux sociaux']
      }
    ],
    2: [ // Formation Gestion d'Équipe
      {
        id: 2,
        nom: 'Marie-Claire ADJOVI',
        email: 'marie.adjovi@email.com',
        telephone: '+229 91 23 45 67',
        avatar: 'MA',
        experience: '8 ans',
        formation: 'MBA en Gestion',
        localisation: 'Porto-Novo, Bénin',
        statut: 'acceptee',
        dateCandidature: '2024-01-14',
        scoreCompatibilite: 92,
        consultation: 'Formation Gestion d\'Équipe',
        tarif: '80K FCFA/jour',
        note: 4.9,
        cv: true,
        lettre: true,
        competences: ['Gestion d\'équipe', 'Leadership', 'Formation', 'Coaching']
      },
      {
        id: 5,
        nom: 'Koffi ASANTE',
        email: 'koffi.asante@email.com',
        telephone: '+229 94 56 78 90',
        avatar: 'KA',
        experience: '10 ans',
        formation: 'Master en Management',
        localisation: 'Cotonou, Bénin',
        statut: 'entretien',
        dateCandidature: '2024-01-11',
        scoreCompatibilite: 88,
        consultation: 'Formation Gestion d\'Équipe',
        tarif: '90K FCFA/jour',
        note: 4.7,
        cv: true,
        lettre: true,
        competences: ['Management', 'Leadership', 'Formation', 'Coaching']
      }
    ],
    3: [ // Conseil Stratégie Financière
      {
        id: 3,
        nom: 'Pierre DOSSOU',
        email: 'pierre.dossou@email.com',
        telephone: '+229 92 34 56 78',
        avatar: 'PD',
        experience: '6 ans',
        formation: 'Master en Finance',
        localisation: 'Abomey-Calavi, Bénin',
        statut: 'entretien',
        dateCandidature: '2024-01-13',
        scoreCompatibilite: 78,
        consultation: 'Conseil Stratégie Financière',
        tarif: '75K FCFA/jour',
        note: 4.6,
        cv: true,
        lettre: false,
        competences: ['Finance', 'Stratégie', 'Audit', 'Conseil']
      },
      {
        id: 6,
        nom: 'Amina KONE',
        email: 'amina.kone@email.com',
        telephone: '+229 95 67 89 01',
        avatar: 'AK',
        experience: '12 ans',
        formation: 'MBA en Finance',
        localisation: 'Porto-Novo, Bénin',
        statut: 'nouvelle',
        dateCandidature: '2024-01-10',
        scoreCompatibilite: 95,
        consultation: 'Conseil Stratégie Financière',
        tarif: '120K FCFA/jour',
        note: 4.9,
        cv: true,
        lettre: true,
        competences: ['Finance', 'Stratégie', 'Audit', 'Conseil', 'CFA']
      }
    ]
  };

  const [candidatures, setCandidatures] = useState(candidaturesParConsultation[consultationId] || []);

  const [filteredCandidatures, setFilteredCandidatures] = useState(candidatures);

  // Fonctions JavaScript pour les interactions
  const viewCV = (id) => {
    const candidature = candidatures.find(c => c.id === id);
    setSelectedCandidate(candidature);
    setShowCVModal(true);
  };

  const closeCVModal = () => {
    setShowCVModal(false);
    setSelectedCandidate(null);
  };

  const acceptCandidate = (id) => {
    setCandidatures(prev => 
      prev.map(c => c.id === id ? { ...c, statut: 'acceptee' } : c)
    );
    setFilteredCandidatures(prev => 
      prev.map(c => c.id === id ? { ...c, statut: 'acceptee' } : c)
    );
  };

  const rejectCandidate = (id) => {
    setCandidatures(prev => 
      prev.map(c => c.id === id ? { ...c, statut: 'refusee' } : c)
    );
    setFilteredCandidatures(prev => 
      prev.map(c => c.id === id ? { ...c, statut: 'refusee' } : c)
    );
  };

  const scheduleInterview = (id) => {
    setCandidatures(prev => 
      prev.map(c => c.id === id ? { ...c, statut: 'entretien' } : c)
    );
    setFilteredCandidatures(prev => 
      prev.map(c => c.id === id ? { ...c, statut: 'entretien' } : c)
    );
  };

  const startProject = (id) => {
    alert('Démarrer le projet');
  };

  const contactCandidate = (id) => {
    alert('Contacter le candidat');
  };

  const rescheduleInterview = (id) => {
    alert('Reprogrammer entretien');
  };

  const acceptAfterInterview = (id) => {
    alert('Valider après entretien');
  };

  const archiveCandidate = (id) => {
    alert('Archiver candidat');
  };

  const downloadCV = () => {
    alert('Télécharger CV');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = candidatures;

    if (filters.search) {
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(c => c.statut === filters.status);
    }

    setFilteredCandidatures(filtered);
  };

  useEffect(() => {
    applyFilters();
    console.log('Candidatures:', candidatures);
    console.log('Filtered candidatures:', filteredCandidatures);
  }, [filters]);

  useEffect(() => {
    const nouvellesCandidatures = candidaturesParConsultation[consultationId] || [];
    setCandidatures(nouvellesCandidatures);
    setFilteredCandidatures(nouvellesCandidatures);
  }, [consultationId]);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-full">
          {/* Header Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  <i className="fas fa-users mr-2 text-destiny-gold"></i>
                  {consultation ? consultation.titre : 'Consultation non trouvée'}
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {consultation ? consultation.description : 'Consultation introuvable'}
                </p>
                {consultation && (
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span><i className="fas fa-money-bill mr-1"></i>Budget: {consultation.budget}</span>
                    <span><i className="fas fa-clock mr-1"></i>Durée: {consultation.duree}</span>
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <div className="bg-destiny-gold text-white px-4 py-2 rounded-lg">
                  <span className="font-semibold">{candidatures.length}</span> postulations
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select 
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                >
                  <option value="">Tous les statuts</option>
                  <option value="nouvelle">Nouvelle</option>
                  <option value="en_cours">En cours</option>
                  <option value="acceptee">Acceptée</option>
                  <option value="refusee">Refusée</option>
                  <option value="entretien">Entretien</option>
                </select>
              </div>

            </div>
          </div>

          {/* Liste des candidatures */}
          {!consultation ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consultation non trouvée</h3>
              <p className="text-gray-500">La consultation demandée n'existe pas</p>
            </div>
          ) : (
            <div className="space-y-4" id="postulationsList">
              {filteredCandidatures.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature trouvée</h3>
                  <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                filteredCandidatures.map((candidature) => (
                  <CandidatureCard
                    key={candidature.id}
                    candidature={candidature}
                    type="consultation"
                    onViewDetails={(id) => viewCV(id)}
                    onViewCV={(id) => viewCV(id)}
                    onViewLettre={(id) => console.log('Voir Lettre', id)}
                    onViewCompatibility={(id) => console.log('Voir Compatibilité', id)}
                    onContact={(id) => contactCandidate(id)}
                    onAddNote={(id) => console.log('Ajouter note', id)}
                    onApprove={(id) => acceptCandidate(id)}
                    onReject={(id) => rejectCandidate(id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">4</span> sur <span className="font-medium">24</span> postulations
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition duration-200">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="px-3 py-2 bg-destiny-gold text-white rounded-lg">1</button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">2</button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">3</button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Modal */}
      {showCVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto m-4 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-file-alt mr-2 text-blue-600"></i>
                CV - <span>{selectedCandidate?.name}</span>
              </h2>
              <button onClick={closeCVModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> <span>{selectedCandidate?.email}</span></p>
                    <p className="text-sm text-gray-600"><strong>Téléphone:</strong> <span>{selectedCandidate?.phone}</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Expérience:</strong> <span>{selectedCandidate?.experience}</span></p>
                    <p className="text-sm text-gray-600"><strong>Disponibilité:</strong> <span>{selectedCandidate?.availability}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button onClick={downloadCV} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                <i className="fas fa-download mr-2"></i>Télécharger PDF
              </button>
              <button onClick={closeCVModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PostulationConsultation;