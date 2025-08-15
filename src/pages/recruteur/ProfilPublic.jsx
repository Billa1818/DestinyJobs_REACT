import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';

const ProfilPublic = () => {
  const { id } = useParams(); // Utiliser 'id' au lieu de 'userId'
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  
  // Nouvelles données dynamiques
  const [activeOffers, setActiveOffers] = useState([]);
  const [activeFinancements, setActiveFinancements] = useState([]);
  const [activeBourses, setActiveBourses] = useState([]);
  const [activeConsultations, setActiveConsultations] = useState([]);
  const [companyStats, setCompanyStats] = useState(null);
  const [loadingData, setLoadingData] = useState({
    offers: false,
    financements: false,
    bourses: false,
    consultations: false,
    stats: false
  });

  // Récupérer l'ID de l'entreprise depuis l'URL
  const companyId = id;

  // Fonction pour récupérer les offres actives
  const fetchActiveOffers = async () => {
    try {
      setLoadingData(prev => ({ ...prev, offers: true }));
      const response = await fetch(`/api/offres/?recruteur=${companyId}&statut=active&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setActiveOffers(data.results || data);
      }
    } catch (error) {
      console.log('Offres non disponibles:', error.message);
    } finally {
      setLoadingData(prev => ({ ...prev, offers: false }));
    }
  };

  // Fonction pour récupérer les financements actifs
  const fetchActiveFinancements = async () => {
    try {
      setLoadingData(prev => ({ ...prev, financements: true }));
      const response = await fetch(`/api/financements/?recruteur=${companyId}&statut=active&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setActiveFinancements(data.results || data);
      }
    } catch (error) {
      console.log('Financements non disponibles:', error.message);
    } finally {
      setLoadingData(prev => ({ ...prev, financements: false }));
    }
  };

  // Fonction pour récupérer les bourses actives
  const fetchActiveBourses = async () => {
    try {
      setLoadingData(prev => ({ ...prev, bourses: true }));
      const response = await fetch(`/api/bourses/?recruteur=${companyId}&statut=active&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setActiveBourses(data.results || data);
      }
    } catch (error) {
      console.log('Bourses non disponibles:', error.message);
    } finally {
      setLoadingData(prev => ({ ...prev, bourses: false }));
    }
  };

  // Fonction pour récupérer les consultations actives
  const fetchActiveConsultations = async () => {
    try {
      setLoadingData(prev => ({ ...prev, consultations: true }));
      const response = await fetch(`/api/consultations/?recruteur=${companyId}&statut=active&limit=5`);
      if (response.ok) {
        const data = await response.json();
        setActiveConsultations(data.results || data);
      }
    } catch (error) {
      console.log('Consultations non disponibles:', error.message);
    } finally {
      setLoadingData(prev => ({ ...prev, consultations: false }));
    }
  };

  // Fonction pour récupérer les statistiques de l'entreprise
  const fetchCompanyStats = async () => {
    try {
      setLoadingData(prev => ({ ...prev, stats: true }));
      // Calculer les statistiques à partir des données récupérées
      const totalOffers = activeOffers.length;
      const totalFinancements = activeFinancements.length;
      const totalBourses = activeBourses.length;
      const totalConsultations = activeConsultations.length;
      
      setCompanyStats({
        totalPublications: totalOffers + totalFinancements + totalBourses + totalConsultations,
        totalOffers,
        totalFinancements,
        totalBourses,
        totalConsultations,
        lastActivity: profile?.updated_at || new Date().toISOString()
      });
    } catch (error) {
      console.log('Statistiques non disponibles:', error.message);
    } finally {
      setLoadingData(prev => ({ ...prev, stats: false }));
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setAccessDenied(false);

        // Timeout de 10 secondes pour éviter le loader infini
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setLoading(false);
            setError('Délai d\'attente dépassé. L\'endpoint des profils publics recruteurs n\'est peut-être pas encore disponible.');
          }
        }, 10000);

        // Récupérer le profil public du recruteur
        const profileData = await profileService.getPublicRecruiterProfile(companyId);
        
        if (isMounted) {
          clearTimeout(timeoutId);
          setProfile(profileData);
        }

      } catch (serviceError) {
        console.error('Erreur du service:', serviceError);
        
        if (isMounted) {
          clearTimeout(timeoutId);
        }
        
        // Fallback vers fetch direct si le service échoue
        try {
          const response = await fetch(`/api/auth/public/recruiters/${companyId}/`);
          
          if (response.status === 200) {
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
              const profileData = await response.json();
              if (isMounted) {
                setProfile(profileData);
              }
            } else {
              if (isMounted) {
                setError('Format de réponse inattendu du serveur');
              }
            }
          } else if (response.status === 403) {
            if (isMounted) {
              setAccessDenied(true);
            }
          } else if (response.status === 404) {
            if (isMounted) {
              setError('Profil non trouvé');
            }
          } else {
            if (isMounted) {
              setError(`Erreur serveur: ${response.status}`);
            }
          }
        } catch (fetchError) {
          console.error('Erreur fetch:', fetchError);
          
          if (isMounted) {
            // Si l'endpoint n'existe pas encore, activer le mode démo
            if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError')) {
              console.log('🔄 Activation du mode démo car l\'endpoint n\'est pas disponible');
              setDemoMode(true);
              // Données de démonstration
              setProfile({
                company_name: 'TechCorp Solutions',
                logo: null,
                description: 'Entreprise leader dans le développement de solutions logicielles innovantes en Afrique de l\'Ouest. Nous nous spécialisons dans la création d\'applications web et mobiles, l\'intégration de systèmes et la transformation digitale des entreprises.',
                sector: 'Technologies de l\'information',
                company_size: 'MEDIUM',
                website: 'https://www.techcorp-solutions.com',
                address: '123 Avenue des Champs-Élysées, 75008 Paris, France',
                country: { name: 'France', code: 'FR' },
                region: { name: 'Île-de-France' },
                contact_email: 'contact@techcorp-solutions.com',
                contact_phone: '+33123456789',
                account_status: 'APPROVED'
              });
            } else {
              setError('Erreur de connexion au serveur');
            }
          }
        }
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    if (companyId) {
      // Permettre l'accès à tout le monde pour voir le profil public d'une entreprise
      fetchPublicProfile();
    } else {
      // Si pas d'ID d'entreprise, arrêter le loading
      setLoading(false);
      setError('ID de l\'entreprise manquant');
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [companyId]);

  // Charger les données dynamiques une fois le profil chargé
  useEffect(() => {
    if (profile && companyId) {
      fetchActiveOffers();
      fetchActiveFinancements();
      fetchActiveBourses();
      fetchActiveConsultations();
    }
  }, [profile, companyId]);

  // Mettre à jour les statistiques quand les données changent
  useEffect(() => {
    if (profile && (activeOffers.length > 0 || activeFinancements.length > 0 || activeBourses.length > 0 || activeConsultations.length > 0)) {
      fetchCompanyStats();
    }
  }, [activeOffers, activeFinancements, activeBourses, activeConsultations, profile]);

  // Fonction pour corriger l'URL de l'image
  const getCorrectImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http://localhost:8000')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/media/')) {
      return `http://localhost:8000${imageUrl}`;
    }
    
    return imageUrl;
  };

  // Fonction pour formater la taille de l'entreprise
  const formatCompanySize = (size) => {
    const sizeMap = {
      'STARTUP': 'Startup (1-10 employés)',
      'SMALL': 'Petite entreprise (11-50 employés)',
      'MEDIUM': 'Moyenne entreprise (51-200 employés)',
      'LARGE': 'Grande entreprise (201-500 employés)',
      'ENTERPRISE': 'Entreprise (500+ employés)'
    };
    return sizeMap[size] || size;
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour tronquer le texte
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-fuchsia-600 mb-4"></i>
          <p className="text-gray-600">Chargement du profil...</p>
                            </div>
                        </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                                    </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  // Retry après un court délai
                  setTimeout(() => {
                    if (companyId) {
                      const fetchPublicProfile = async () => {
                        try {
                          setLoading(true);
                          setError(null);
                          setAccessDenied(false);
                          
                          const profileData = await profileService.getPublicRecruiterProfile(companyId);
                          setProfile(profileData);
                        } catch (retryError) {
                          console.error('Erreur lors du retry:', retryError);
                          setError('Erreur lors de la nouvelle tentative');
                        } finally {
                          setLoading(false);
                        }
                      };
                      fetchPublicProfile();
                    }
                  }, 1000);
                }}
                className="w-full bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-redo mr-2"></i>
                Réessayer
              </button>
              
              <Link 
                to="/" 
                className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-home mr-2"></i>
                Retour à l'accueil
              </Link>
                                        </div>
                                    </div>
                                </div>
                                </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
                                <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <i className="fas fa-lock text-yellow-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Accès Refusé
            </h1>
            <p className="text-gray-600 mb-6">
              Ce profil n'est pas accessible publiquement.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-home mr-2"></i>
              Retour à l'accueil
            </Link>
                                </div>
                                </div>
                                </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
                                <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <i className="fas fa-user text-gray-400 text-2xl"></i>
                                </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Profil Non Trouvé
            </h1>
            <p className="text-gray-600 mb-6">
              Le profil demandé n'existe pas ou n'est plus disponible.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-home mr-2"></i>
              Retour à l'accueil
            </Link>
                            </div>
                        </div>
                    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Indicateur de mode démo */}
          {demoMode && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
              <div className="flex items-center justify-center text-yellow-800">
                <i className="fas fa-info-circle mr-2"></i>
                <span className="text-sm font-medium">
                  Mode démonstration - Données fictives (l'API n'est pas encore disponible)
                </span>
                                </div>
                            </div>
          )}
          
          <div className="relative">
            {/* Image de couverture */}
            <div className="h-48 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                    </div>
                                    
            {/* Logo et informations principales */}
            <div className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end space-x-4 -mt-16">
                  {/* Logo de l'entreprise */}
                  <div className="w-32 h-32 bg-white rounded-lg shadow-lg border-4 border-white flex items-center justify-center">
                    {profile.logo ? (
                      <img 
                        src={getCorrectImageUrl(profile.logo)} 
                        alt={`Logo ${profile.company_name}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <i className="fas fa-building text-4xl text-gray-400"></i>
                    )}
                                    </div>
                                    
                  {/* Informations principales */}
                  <div className="flex-1 mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold mb-2">
                      {profile.company_name}
                    </h1>
                    {profile.sector && (
                      <p className="text-xl opacity-90 mb-2">
                        {profile.sector}
                      </p>
                    )}
                    {profile.company_size && (
                      <p className="text-lg opacity-80">
                        {formatCompanySize(profile.company_size)}
                      </p>
                    )}
                                        </div>
                                    </div>
                                    
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                  {isAuthenticated && user?.user_type === 'CANDIDAT' && (
                    <button className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium">
                      <i className="fas fa-briefcase mr-2"></i>
                      Voir les offres
                    </button>
                  )}
                  <Link 
                    to="/" 
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium text-center"
                  >
                    <i className="fas fa-search mr-2"></i>
                    Voir d'autres entreprises
                  </Link>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description de l'entreprise */}
            {profile.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-info-circle text-fuchsia-600 mr-2"></i>
                  À propos de l'entreprise
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile.description}
                </p>
              </div>
            )}

            {/* NOUVELLE SECTION : Offres d'emploi actives */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="fas fa-briefcase text-fuchsia-600 mr-2"></i>
                  Offres d'emploi actives
                </h3>
                <Link 
                  to="/jobs" 
                  className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                >
                  Voir toutes →
                </Link>
                                </div>
                                
              {loadingData.offers ? (
                <div className="flex items-center justify-center py-8">
                  <i className="fas fa-spinner fa-spin text-fuchsia-600 text-xl"></i>
                  <span className="ml-2 text-gray-600">Chargement des offres...</span>
                </div>
              ) : activeOffers.length > 0 ? (
                                <div className="space-y-4">
                  {activeOffers.slice(0, 3).map((offer, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{offer.title || `Offre ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {truncateText(offer.description || 'Description non disponible', 80)}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {offer.location && (
                              <span><i className="fas fa-map-marker-alt mr-1"></i>{offer.location}</span>
                            )}
                            {offer.type_contrat && (
                              <span><i className="fas fa-file-contract mr-1"></i>{offer.type_contrat}</span>
                            )}
                            {offer.salary && (
                              <span><i className="fas fa-money-bill-wave mr-1"></i>{offer.salary}</span>
                            )}
                                            </div>
                                        </div>
                        <Link 
                          to={`/jobs/${offer.id || index}`}
                          className="ml-4 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-medium hover:bg-fuchsia-200 transition duration-200"
                        >
                          Voir
                        </Link>
                                        </div>
                                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-briefcase text-4xl mb-3 text-gray-300"></i>
                  <p>Aucune offre d'emploi active pour le moment</p>
                </div>
              )}
                                            </div>

            {/* NOUVELLE SECTION : Financements disponibles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="fas fa-money-bill-wave text-fuchsia-600 mr-2"></i>
                  Financements disponibles
                </h3>
                <Link 
                  to="/financements" 
                  className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                >
                  Voir tous →
                </Link>
                                        </div>
              
              {loadingData.financements ? (
                <div className="flex items-center justify-center py-8">
                  <i className="fas fa-spinner fa-spin text-fuchsia-600 text-xl"></i>
                  <span className="ml-2 text-gray-600">Chargement des financements...</span>
                                            </div>
              ) : activeFinancements.length > 0 ? (
                <div className="space-y-4">
                  {activeFinancements.slice(0, 3).map((financement, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{financement.title || `Financement ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {truncateText(financement.description || 'Description non disponible', 80)}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {financement.montant && (
                              <span><i className="fas fa-euro-sign mr-1"></i>{financement.montant}</span>
                            )}
                            {financement.type_financement && (
                              <span><i className="fas fa-tag mr-1"></i>{financement.type_financement}</span>
                            )}
                            {financement.secteur && (
                              <span><i className="fas fa-industry mr-1"></i>{financement.secteur}</span>
                            )}
                                        </div>
                                    </div>
                        <Link 
                          to={`/financements/${financement.id || index}`}
                          className="ml-4 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-medium hover:bg-fuchsia-200 transition duration-200"
                        >
                          Voir
                        </Link>
                                </div>
                            </div>
                  ))}
                                    </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-money-bill-wave text-4xl mb-3 text-gray-300"></i>
                  <p>Aucun financement disponible pour le moment</p>
                                    </div>
              )}
                                    </div>

            {/* NOUVELLE SECTION : Bourses actives */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="fas fa-graduation-cap text-fuchsia-600 mr-2"></i>
                  Bourses d'études
                </h3>
                <Link 
                  to="/bourses" 
                  className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                >
                  Voir toutes →
                </Link>
                                </div>
                                
              {loadingData.bourses ? (
                <div className="flex items-center justify-center py-8">
                  <i className="fas fa-spinner fa-spin text-fuchsia-600 text-xl"></i>
                  <span className="ml-2 text-gray-600">Chargement des bourses...</span>
                </div>
              ) : activeBourses.length > 0 ? (
                <div className="space-y-4">
                  {activeBourses.slice(0, 3).map((bourse, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{bourse.title || `Bourse ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {truncateText(bourse.description || 'Description non disponible', 80)}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {bourse.montant && (
                              <span><i className="fas fa-euro-sign mr-1"></i>{bourse.montant}</span>
                            )}
                            {bourse.type_bourse && (
                              <span><i className="fas fa-tag mr-1"></i>{bourse.type_bourse}</span>
                            )}
                            {bourse.domaine_etude && (
                              <span><i className="fas fa-book mr-1"></i>{bourse.domaine_etude}</span>
                            )}
                                        </div>
                                    </div>
                        <Link 
                          to={`/bourses/${bourse.id || index}`}
                          className="ml-4 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-medium hover:bg-fuchsia-200 transition duration-200"
                        >
                          Voir
                        </Link>
                                        </div>
                                    </div>
                  ))}
                                        </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-graduation-cap text-4xl mb-3 text-gray-300"></i>
                  <p>Aucune bourse disponible pour le moment</p>
                                    </div>
              )}
                                        </div>

            {/* NOUVELLE SECTION : Consultations en cours */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="fas fa-comments text-fuchsia-600 mr-2"></i>
                  Consultations en cours
                </h3>
                <Link 
                  to="/consultations" 
                  className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                >
                  Voir toutes →
                </Link>
                                    </div>
              
              {loadingData.consultations ? (
                <div className="flex items-center justify-center py-8">
                  <i className="fas fa-spinner fa-spin text-fuchsia-600 text-xl"></i>
                  <span className="ml-2 text-gray-600">Chargement des consultations...</span>
                                </div>
              ) : activeConsultations.length > 0 ? (
                <div className="space-y-4">
                  {activeConsultations.slice(0, 3).map((consultation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{consultation.title || `Consultation ${index + 1}`}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {truncateText(consultation.description || 'Description non disponible', 80)}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {consultation.budget && (
                              <span><i className="fas fa-euro-sign mr-1"></i>{consultation.budget}</span>
                            )}
                            {consultation.duree && (
                              <span><i className="fas fa-clock mr-1"></i>{consultation.duree}</span>
                            )}
                            {consultation.type_consultation && (
                              <span><i className="fas fa-tag mr-1"></i>{consultation.type_consultation}</span>
                            )}
                            </div>
                        </div>
                        <Link 
                          to={`/consultations/${consultation.id || index}`}
                          className="ml-4 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-medium hover:bg-fuchsia-200 transition duration-200"
                        >
                          Voir
                        </Link>
                                        </div>
                                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-comments text-4xl mb-3 text-gray-300"></i>
                  <p>Aucune consultation en cours pour le moment</p>
                                        </div>
              )}
                                    </div>
                                    
            {/* Informations de contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-address-book text-fuchsia-600 mr-2"></i>
                Informations de contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.address && (
                                    <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-gray-600"></i>
                    </div>
                                        <div>
                      <h4 className="font-medium text-gray-900 mb-1">Adresse</h4>
                      <p className="text-gray-600">{profile.address}</p>
                      {profile.country && (
                        <p className="text-sm text-gray-500 mt-1">
                          {profile.country.name}
                          {profile.region && `, ${profile.region.name}`}
                        </p>
                      )}
                                        </div>
                                    </div>
                )}
                                    
                {profile.contact_phone && (
                                    <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-phone text-gray-600"></i>
                    </div>
                                        <div>
                      <h4 className="font-medium text-gray-900 mb-1">Téléphone</h4>
                      <p className="text-gray-600">{profile.contact_phone}</p>
                                            </div>
                                        </div>
                )}
                                    
                {profile.contact_email && (
                                    <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-envelope text-gray-600"></i>
                    </div>
                                        <div>
                      <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">{profile.contact_email}</p>
                                        </div>
                                    </div>
                )}
                                    
                {profile.website && (
                                    <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-globe text-gray-600"></i>
                    </div>
                                        <div>
                      <h4 className="font-medium text-gray-900 mb-1">Site web</h4>
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-fuchsia-600 hover:text-fuchsia-700 transition duration-200"
                      >
                        {profile.website}
                      </a>
                    </div>
                  </div>
                )}
                                        </div>
                                    </div>
                                </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* NOUVELLE SECTION : Statistiques de l'entreprise */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-chart-bar text-fuchsia-600 mr-2"></i>
                Statistiques de l'entreprise
              </h3>
              
              {loadingData.stats ? (
                <div className="flex items-center justify-center py-4">
                  <i className="fas fa-spinner fa-spin text-fuchsia-600"></i>
                            </div>
              ) : companyStats ? (
                                <div className="space-y-4">
                  <div className="text-center p-4 bg-fuchsia-50 rounded-lg">
                    <div className="text-2xl font-bold text-fuchsia-600 mb-1">
                      {companyStats.totalPublications}
                                        </div>
                    <div className="text-sm text-gray-600">Publications totales</div>
                                    </div>
                                    
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600">
                        {companyStats.totalOffers}
                                        </div>
                      <div className="text-xs text-gray-600">Offres</div>
                                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">
                        {companyStats.totalFinancements}
                                </div>
                      <div className="text-xs text-gray-600">Financements</div>
                            </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600">
                        {companyStats.totalBourses}
                                        </div>
                      <div className="text-xs text-gray-600">Bourses</div>
                                        </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-semibold text-orange-600">
                        {companyStats.totalConsultations}
                                        </div>
                      <div className="text-xs text-gray-600">Consultations</div>
                                </div>
                            </div>

                  {companyStats.lastActivity && (
                    <div className="text-center text-xs text-gray-500 mt-3">
                      <i className="fas fa-clock mr-1"></i>
                      Dernière activité : {formatDate(companyStats.lastActivity)}
                    </div>
                  )}
                                        </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <i className="fas fa-chart-bar text-2xl mb-2 text-gray-300"></i>
                  <p className="text-sm">Aucune statistique disponible</p>
                                    </div>
              )}
                                </div>


                                
            {/* Informations supplémentaires */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-building text-fuchsia-600 mr-2"></i>
                Informations complémentaires
              </h3>
              <div className="space-y-4">
                {profile.sector && (
                                    <div>
                    <span className="text-sm font-medium text-gray-700">Secteur</span>
                    <p className="text-gray-900">{profile.sector}</p>
                                        </div>
                )}
                                    
                {profile.company_size && (
                                    <div>
                    <span className="text-sm font-medium text-gray-700">Taille</span>
                    <p className="text-gray-900">{formatCompanySize(profile.company_size)}</p>
                                        </div>
                )}
                                    
                {profile.country && (
                                    <div>
                    <span className="text-sm font-medium text-gray-700">Localisation</span>
                    <p className="text-gray-900">
                      {profile.country.name}
                      {profile.region && profile.region.name ? `, ${profile.region.name}` : ''}
                    </p>
                                        </div>
                )}
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
    );
};

export default ProfilPublic;
