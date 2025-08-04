import React, { useState } from 'react';

const PostulationConsultation = () => {
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Fonctions JavaScript pour les interactions
  const viewCV = (id) => {
    setSelectedCandidate({
      id,
      name: `Candidat ${id}`,
      email: `candidat${id}@email.com`,
      phone: '+229 XX XX XX XX',
      experience: '5 ans',
      availability: 'Immédiate'
    });
    setShowCVModal(true);
  };

  const closeCVModal = () => {
    setShowCVModal(false);
    setSelectedCandidate(null);
  };

  const acceptCandidate = (id) => {
    alert('Candidat accepté');
  };

  const rejectCandidate = (id) => {
    alert('Candidat refusé');
  };

  const scheduleInterview = (id) => {
    alert('Planifier entretien');
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
                  Postulations Reçues
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Gérez les candidatures pour vos consultations
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="bg-destiny-gold text-white px-4 py-2 rounded-lg">
                  <span className="font-semibold">24</span> postulations
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
                    id="searchInput" 
                    placeholder="Rechercher un candidat..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select id="statusFilter" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
                  <option value="">Tous les statuts</option>
                  <option value="nouveau">Nouveau</option>
                  <option value="en-cours">En cours</option>
                  <option value="accepte">Accepté</option>
                  <option value="refuse">Refusé</option>
                  <option value="entretien">Entretien</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select id="consultationFilter" className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold">
                  <option value="">Toutes les consultations</option>
                  <option value="audit-marketing">Audit Marketing Digital</option>
                  <option value="formation-gestion">Formation Gestion d'Équipe</option>
                  <option value="conseil-finance">Conseil Stratégie Financière</option>
                </select>
              </div>
            </div>
          </div>

          {/* Postulations List */}
          <div className="space-y-4" id="postulationsList">
            {/* Postulation Card 1 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-blue-500 postulation-card" data-status="nouveau" data-consultation="audit-marketing">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-blue-600 text-lg"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Jean-Baptiste KOUAME</h3>
                        <p className="text-sm text-gray-600 mb-2">Expert Marketing Digital • 5 ans d'expérience</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Audit Marketing Digital</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Disponible immédiatement</span>
                        </div>
                        <p className="text-sm text-gray-600">Spécialisé en stratégie digitale, SEO/SEA et analytics. Expérience avec des PME et startups...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <i className="fas fa-clock text-xs mr-1"></i>Nouveau
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-destiny-gold">85%</div>
                      <div className="text-xs text-gray-500">Compatibilité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">5 ans</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">60K</div>
                      <div className="text-xs text-gray-500">FCFA/jour</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">4.8</div>
                      <div className="text-xs text-gray-500">Note moyenne</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Postulé le 22 juin 2025 • <i className="fas fa-envelope mr-1"></i>jean.kouame@email.com • <i className="fas fa-phone mr-1"></i>+229 XX XX XX XX
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(1)}>
                    <i className="fas fa-file-alt mr-1"></i>Voir CV
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => acceptCandidate(1)}>
                    <i className="fas fa-check mr-1"></i>Accepter
                  </button>
                  <button className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm" onClick={() => scheduleInterview(1)}>
                    <i className="fas fa-calendar mr-1"></i>Entretien
                  </button>
                  <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 text-sm" onClick={() => rejectCandidate(1)}>
                    <i className="fas fa-times mr-1"></i>Refuser
                  </button>
                </div>
              </div>
            </div>

            {/* Postulation Card 2 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-green-500 postulation-card" data-status="accepte" data-consultation="formation-gestion">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-pink-600 text-lg"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Marie ADJAHO</h3>
                        <p className="text-sm text-gray-600 mb-2">Coach en Management • 8 ans d'expérience</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Formation Gestion d'Équipe</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Certifiée PMP</span>
                        </div>
                        <p className="text-sm text-gray-600">Coach certifiée en leadership et gestion d'équipe. Formatrice expérimentée en soft skills...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <i className="fas fa-check text-xs mr-1"></i>Accepté
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-destiny-gold">92%</div>
                      <div className="text-xs text-gray-500">Compatibilité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">8 ans</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">75K</div>
                      <div className="text-xs text-gray-500">FCFA/jour</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">4.9</div>
                      <div className="text-xs text-gray-500">Note moyenne</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Postulé le 21 juin 2025 • <i className="fas fa-envelope mr-1"></i>marie.adjaho@email.com • <i className="fas fa-phone mr-1"></i>+229 XX XX XX XX
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(2)}>
                    <i className="fas fa-file-alt mr-1"></i>Voir CV
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => startProject(2)}>
                    <i className="fas fa-play mr-1"></i>Démarrer
                  </button>
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => contactCandidate(2)}>
                    <i className="fas fa-message mr-1"></i>Contacter
                  </button>
                </div>
              </div>
            </div>

            {/* Postulation Card 3 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-orange-500 postulation-card" data-status="entretien" data-consultation="conseil-finance">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-indigo-600 text-lg"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Koffi ASANTE</h3>
                        <p className="text-sm text-gray-600 mb-2">Consultant Financier Senior • 12 ans d'expérience</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">Conseil Stratégie Financière</span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">CFA Charterholder</span>
                        </div>
                        <p className="text-sm text-gray-600">Expert en analyse financière et stratégie d'entreprise. Spécialisé dans l'optimisation des coûts...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        <i className="fas fa-calendar text-xs mr-1"></i>Entretien
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-destiny-gold">88%</div>
                      <div className="text-xs text-gray-500">Compatibilité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">12 ans</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">110K</div>
                      <div className="text-xs text-gray-500">FCFA/jour</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">4.7</div>
                      <div className="text-xs text-gray-500">Note moyenne</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Postulé le 19 juin 2025 • <i className="fas fa-envelope mr-1"></i>koffi.asante@email.com • <i className="fas fa-phone mr-1"></i>+229 XX XX XX XX
                    </div>
                    <div className="text-xs text-orange-600 font-medium">
                      <i className="fas fa-clock mr-1"></i>Entretien prévu le 28 juin à 14h
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(3)}>
                    <i className="fas fa-file-alt mr-1"></i>Voir CV
                  </button>
                  <button className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm" onClick={() => rescheduleInterview(3)}>
                    <i className="fas fa-calendar-alt mr-1"></i>Reprogrammer
                  </button>
                  <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm" onClick={() => acceptAfterInterview(3)}>
                    <i className="fas fa-check mr-1"></i>Valider
                  </button>
                  <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 text-sm" onClick={() => rejectCandidate(3)}>
                    <i className="fas fa-times mr-1"></i>Refuser
                  </button>
                </div>
              </div>
            </div>

            {/* Postulation Card 4 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-red-500 postulation-card" data-status="refuse" data-consultation="audit-marketing">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-gray-600 text-lg"></i>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Paul TETE</h3>
                        <p className="text-sm text-gray-600 mb-2">Junior Marketing • 2 ans d'expérience</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Audit Marketing Digital</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Débutant</span>
                        </div>
                        <p className="text-sm text-gray-600">Expérience limitée en marketing digital. Profil junior ne correspondant pas aux exigences...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        <i className="fas fa-times text-xs mr-1"></i>Refusé
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 bg-gray-50 p-3 rounded-lg opacity-60">
                    <div className="text-center">
                      <div className="text-lg font-bold text-destiny-gold">45%</div>
                      <div className="text-xs text-gray-500">Compatibilité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">2 ans</div>
                      <div className="text-xs text-gray-500">Expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">35K</div>
                      <div className="text-xs text-gray-500">FCFA/jour</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">4.2</div>
                      <div className="text-xs text-gray-500">Note moyenne</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Postulé le 18 juin 2025 • Refusé le 20 juin 2025 • Motif: Expérience insuffisante
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm" onClick={() => viewCV(4)}>
                    <i className="fas fa-file-alt mr-1"></i>Voir CV
                  </button>
                  <button className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition duration-200 text-sm" onClick={() => archiveCandidate(4)}>
                    <i className="fas fa-archive mr-1"></i>Archiver
                  </button>
                </div>
              </div>
            </div>
          </div>

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