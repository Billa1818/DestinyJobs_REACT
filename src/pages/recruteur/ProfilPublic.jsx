import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

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
  
  // État pour l'affichage des offres
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [showAllFinancements, setShowAllFinancements] = useState(false);
  const [showAllBourses, setShowAllBourses] = useState(false);
  const [showAllConsultations, setShowAllConsultations] = useState(false);

  // Récupérer l'ID de l'entreprise depuis l'URL
  const companyId = id;

  // Fonction pour extraire les offres du profil
  const extractOffersFromProfile = () => {
    if (profile?.published_offers?.job_offers) {
      setActiveOffers(profile.published_offers.job_offers);
    }
  };

  // Fonction pour extraire les financements du profil
  const extractFinancementsFromProfile = () => {
    if (profile?.published_offers?.funding_offers) {
      setActiveFinancements(profile.published_offers.funding_offers);
    }
  };

  // Fonction pour extraire les bourses du profil
  const extractBourcesFromProfile = () => {
    if (profile?.published_offers?.scholarships) {
      setActiveBourses(profile.published_offers.scholarships);
    }
  };

  // Fonction pour extraire les consultations du profil
  const extractConsultationsFromProfile = () => {
    if (profile?.published_offers?.consultation_offers) {
      setActiveConsultations(profile.published_offers.consultation_offers);
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
    if (profile) {
      extractOffersFromProfile();
      extractFinancementsFromProfile();
      extractBourcesFromProfile();
      extractConsultationsFromProfile();
    }
  }, [profile]);

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
      return buildImageUrl(imageUrl);
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
        <LoadingSpinner 
          variant="page" 
          size="xl" 
          text="Chargement du profil..."
        />
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
          
          <div className="relative">
            {/* Image de couverture */}
            <div className="h-32 bg-white border-b border-gray-100">
                                    </div>
                                    
            {/* Logo et informations principales */}
            <div className="relative px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center space-x-6">
                  {/* Logo de l'entreprise */}
                  <div className="w-28 h-28 bg-gray-100 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                    {profile.logo ? (
                      <img 
                        src={getCorrectImageUrl(profile.logo)} 
                        alt={`Logo ${profile.company_name}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                       <i className="fas fa-building text-4xl text-gray-400"></i>
                    )}
                                    </div>
                                    
                  {/* Informations principales */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.company_name}
                    </h1>
                    {profile.sector && (
                      <p className="text-lg text-fuchsia-600 font-medium mb-1">
                        {profile.sector}
                      </p>
                    )}
                    {profile.company_size && (
                      <p className="text-sm text-gray-600">
                        {formatCompanySize(profile.company_size)}
                      </p>
                    )}
                                        </div>
                                    </div>
                                    
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAuthenticated && user?.user_type === 'CANDIDAT' && (
                    <button className="bg-fuchsia-600 text-white px-6 py-2.5 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium text-sm">
                      <i className="fas fa-briefcase mr-2"></i>
                      Voir les offres
                    </button>
                  )}
                  <Link 
                    to="/" 
                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition duration-200 font-medium text-center text-sm"
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
                                
              {activeOffers.length > 0 ? (
                <div className="space-y-4">
                  {activeOffers.slice(0, showAllOffers ? activeOffers.length : 2).map((offer) => (
                    <Link key={offer.id} to={`/jobs/${offer.id}`} className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-fuchsia-300 transition duration-200 bg-white">
                      <div className="flex items-start space-x-3">
                        {/* Logo entreprise */}
                        <div className="flex-shrink-0">
                          {offer.recruiter?.logo ? (
                            <img
                              src={getCorrectImageUrl(offer.recruiter.logo)}
                              alt={offer.recruiter?.company_name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center ${offer.recruiter?.logo ? 'hidden' : 'flex'}`}>
                            <i className="fas fa-building text-white text-lg"></i>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{offer.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{offer.description}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {offer.contract_type && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                {offer.contract_type}
                              </span>
                            )}
                            {offer.experience_required && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                {offer.experience_required}
                              </span>
                            )}
                            {offer.work_mode && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                {offer.work_mode}
                              </span>
                            )}
                            {offer.is_urgent && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                <i className="fas fa-exclamation-circle mr-1"></i>Urgent
                              </span>
                            )}
                          </div>

                          {/* Meta info */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {offer.location && (
                              <span><i className="fas fa-map-marker-alt mr-1"></i>{offer.location}</span>
                            )}
                            {offer.salary_range && (
                              <span><i className="fas fa-money-bill-wave mr-1"></i>{offer.salary_range}</span>
                            )}
                          </div>
                        </div>

                        {/* Badge expired */}
                        {offer.is_expired && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              Expirée
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                  </div>
                  ) : (
                  <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-briefcase text-4xl mb-3 text-gray-300"></i>
                  <p>Aucune offre d'emploi active pour le moment</p>
                  </div>
                  )}
                  
                  {/* Bouton Voir plus */}
                  {activeOffers.length > 2 && (
                  <div className="mt-4 text-center">
                  <button 
                  onClick={() => setShowAllOffers(!showAllOffers)}
                  className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                  >
                  {showAllOffers ? 'Voir moins' : 'Voir plus'}
                  </button>
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
              
              {activeFinancements.length > 0 ? (
                  <div className="space-y-4">
                    {activeFinancements.slice(0, showAllFinancements ? activeFinancements.length : 2).map((financement) => (
                     <Link key={financement.id} to={`/financements/${financement.id}`} className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-fuchsia-300 transition duration-200 bg-white">
                       <div className="flex items-start space-x-3">
                         {/* Logo */}
                         <div className="flex-shrink-0">
                           {financement.company_logo ? (
                             <img
                               src={getCorrectImageUrl(financement.company_logo)}
                               alt="Logo financement"
                               className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                               onError={(e) => {
                                 e.target.style.display = 'none';
                                 e.target.nextSibling.style.display = 'flex';
                               }}
                             />
                           ) : null}
                           <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center ${financement.company_logo ? 'hidden' : 'flex'}`}>
                             <i className="fas fa-money-bill-wave text-white text-lg"></i>
                           </div>
                         </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{financement.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{financement.objective}</p>
                          
                          {/* Montant badge */}
                          {financement.montant && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200 mb-2">
                              <i className="fas fa-euro-sign mr-1"></i>{parseFloat(financement.montant).toLocaleString()} €
                            </span>
                          )}

                          {/* Meta info */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {financement.project_duration && (
                              <span><i className="fas fa-calendar mr-1"></i>Durée: {financement.project_duration} mois</span>
                            )}
                          </div>
                        </div>

                        {/* Badge expired */}
                        {financement.is_expired && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              Expirée
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                  </div>
                  ) : (
                  <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-money-bill-wave text-4xl mb-3 text-gray-300"></i>
                  <p>Aucun financement disponible pour le moment</p>
                  </div>
                  )}
                  
                  {/* Bouton Voir plus */}
                  {activeFinancements.length > 2 && (
                  <div className="mt-4 text-center">
                  <button 
                   onClick={() => setShowAllFinancements(!showAllFinancements)}
                   className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                  >
                   {showAllFinancements ? 'Voir moins' : 'Voir plus'}
                  </button>
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
                                
              {activeBourses.length > 0 ? (
                <div className="space-y-4">
                  {activeBourses.slice(0, showAllBourses ? activeBourses.length : 2).map((bourse) => (
                    <Link key={bourse.id} to={`/bourses/${bourse.id}`} className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-fuchsia-300 transition duration-200 bg-white">
                      <div className="flex items-start space-x-3">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <i className="fas fa-graduation-cap text-white text-lg"></i>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{bourse.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{bourse.description}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {bourse.scholarship_amount && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                <i className="fas fa-euro-sign mr-1"></i>{parseFloat(bourse.scholarship_amount).toLocaleString()} €
                              </span>
                            )}
                            {bourse.required_level && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                {bourse.required_level}
                              </span>
                            )}
                            {bourse.duration && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                <i className="fas fa-calendar mr-1"></i>{bourse.duration} ans
                              </span>
                            )}
                            {bourse.full_funding && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                Financement complet
                              </span>
                            )}
                          </div>

                          {/* Meta info */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {bourse.organization_name && (
                              <span><i className="fas fa-university mr-1"></i>{bourse.organization_name}</span>
                            )}
                          </div>
                        </div>

                        {/* Badge expired */}
                        {bourse.is_expired && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              Expirée
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-graduation-cap text-4xl mb-3 text-gray-300"></i>
                  <p>Aucune bourse disponible pour le moment</p>
                </div>
              )}
              
              {/* Bouton Voir plus */}
              {activeBourses.length > 2 && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setShowAllBourses(!showAllBourses)}
                    className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                  >
                    {showAllBourses ? 'Voir moins' : 'Voir plus'}
                  </button>
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
              
              {activeConsultations.length > 0 ? (
                <div className="space-y-4">
                  {activeConsultations.slice(0, showAllConsultations ? activeConsultations.length : 2).map((consultation) => (
                    <Link key={consultation.id} to={`/consultations/${consultation.id}`} className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-fuchsia-300 transition duration-200 bg-white">
                      <div className="flex items-start space-x-3">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          {consultation.company_logo ? (
                            <img
                              src={getCorrectImageUrl(consultation.company_logo)}
                              alt={consultation.company_details?.company_name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center ${consultation.company_logo ? 'hidden' : 'flex'}`}>
                            <i className="fas fa-comments text-white text-lg"></i>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{consultation.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{consultation.description}</p>
                          
                          {/* Meta info */}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {consultation.company_details?.company_name && (
                              <span><i className="fas fa-building mr-1"></i>{consultation.company_details.company_name}</span>
                            )}
                            {consultation.country && (
                              <span><i className="fas fa-map-marker-alt mr-1"></i>{consultation.country.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-comments text-4xl mb-3 text-gray-300"></i>
                  <p>Aucune consultation en cours pour le moment</p>
                </div>
              )}
              
              {/* Bouton Voir plus */}
              {activeConsultations.length > 2 && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setShowAllConsultations(!showAllConsultations)}
                    className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                  >
                    {showAllConsultations ? 'Voir moins' : 'Voir plus'}
                  </button>
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
