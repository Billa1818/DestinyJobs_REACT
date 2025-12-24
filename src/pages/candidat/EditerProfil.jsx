import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import profileService from '../../services/profileService';
import authService from '../../services/authService';

const EditerProfil = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [candidateProfile, setCandidateProfile] = useState({
    about: '',
    years_experience: 0,
    technologies: '',
    professional_experience: '',
    education: '',
    skills: '',
    achievements: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState({
    isVerified: false,
    isRequesting: false
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Récupérer le profil utilisateur de base
        const userData = await authService.getProfile();
        setProfileData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
        
        // Mettre à jour le statut de vérification de l'email
        setEmailVerificationStatus(prev => ({
          ...prev,
          isVerified: userData.email_verified || false
        }));
        
        // Récupérer le profil candidat détaillé
        const candidateData = await profileService.getCandidateProfile();
        console.log('📥 Données du profil candidat reçues:', candidateData);
        
        setCandidateProfile({
          about: candidateData.about || '',
          years_experience: candidateData.years_experience || 0,
          technologies: candidateData.technologies || '',
          professional_experience: candidateData.professional_experience || '',
          education: candidateData.education || '',
          skills: candidateData.skills || '',
          achievements: candidateData.achievements || '',
          cv: candidateData.cv || null,
          image: candidateData.image || null
  });
      } catch (err) {
        console.error('Erreur lors de la récupération du profil:', err);
        setError('Erreur lors de la récupération du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileChange = (field, value) => {
    // Empêcher la modification de l'email si celui-ci n'est pas vérifié
    if (field === 'email' && !emailVerificationStatus.isVerified) {
      return;
    }
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleCandidateProfileChange = (field, value) => {
    setCandidateProfile(prev => ({ ...prev, [field]: value }));
  };

  // Fonction pour demander la vérification d'email
  const handleRequestEmailVerification = async () => {
    try {
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: true }));
      
      await authService.requestEmailVerification();
      
      // Afficher un message de succès temporaire
      setTimeout(() => {
        setEmailVerificationStatus(prev => ({ ...prev, isRequesting: false }));
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la demande de vérification:', error);
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: false }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Mettre à jour le profil utilisateur de base
      await authService.updateProfile(profileData);
      
      // Mettre à jour le profil candidat avec multipart/form-data
      const formData = new FormData();
      
      // Ajouter seulement les champs textuels non vides et non null
      Object.keys(candidateProfile).forEach(key => {
        // Exclure les champs de fichiers
        if (key !== 'cv' && key !== 'image') {
          const value = candidateProfile[key];
          // Vérifier que la valeur n'est pas vide, null, ou undefined
          if (value !== '' && value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
      });
      
      // Ajouter les fichiers seulement s'ils existent et sont de vrais fichiers
      if (candidateProfile.cv instanceof File) {
        formData.append('cv', candidateProfile.cv);
      }
      
      if (candidateProfile.image instanceof File) {
        formData.append('image', candidateProfile.image);
      }
      
      // Debug: afficher le contenu du FormData
      console.log('📤 FormData contenu:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      await profileService.updateCandidateProfile(formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/candidat/profil');
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Modifier le profil</h1>
                <p className="text-gray-600 mt-1">Mettez à jour vos informations personnelles et professionnelles</p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  to="/candidat/profil"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  <i className="fas fa-times mr-2"></i>
                  Annuler
                </Link>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50"
                >
                  <i className="fas fa-save mr-2"></i>
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-green-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Profil mis à jour avec succès ! Redirection en cours...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-red-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'profile' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Profil de base
              </button>
              <button
                onClick={() => setActiveTab('candidate')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'candidate' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-briefcase mr-2"></i>Profil Candidat
              </button>

            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-12">
              <LoadingSpinner variant="inline" size="lg" text="Chargement de vos données..." />
            </div>
          ) : (
          <>
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-user mr-2 text-fuchsia-600"></i>
                Informations du profil
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => handleProfileChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => handleProfileChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!emailVerificationStatus.isVerified}
                      className={`w-full px-3 py-2 pr-12 border rounded-lg transition duration-200 ${
                        !emailVerificationStatus.isVerified 
                          ? 'border-red-300 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-red-300' 
                          : 'border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent'
                      }`}
                      title={!emailVerificationStatus.isVerified ? "L'email ne peut pas être modifié tant qu'il n'est pas vérifié" : ""}
                    required
                  />
                    {!emailVerificationStatus.isVerified && (
                      <button
                        type="button"
                        onClick={handleRequestEmailVerification}
                        disabled={emailVerificationStatus.isRequesting}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-md flex items-center justify-center transition duration-200 disabled:opacity-50"
                        title="Vérifier l'email"
                      >
                        {emailVerificationStatus.isRequesting ? (
                          <i className="fas fa-spinner fa-spin text-xs"></i>
                        ) : (
                          <i className="fas fa-envelope text-xs"></i>
                        )}
                      </button>
                    )}
                    {emailVerificationStatus.isVerified && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 text-white rounded-md flex items-center justify-center">
                        <i className="fas fa-check text-xs"></i>
                      </div>
                    )}
                  </div>
                  {!emailVerificationStatus.isVerified && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Email non vérifié. Le champ est désactivé. Cliquez sur le bouton rouge pour recevoir un lien de vérification.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Candidate Profile Settings */}
          {activeTab === 'candidate' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
                Profil Candidat
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">À propos</label>
                  <textarea
                    rows={4}
                    value={candidateProfile.about}
                    onChange={(e) => handleCandidateProfileChange('about', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Décrivez votre profil professionnel, vos objectifs de carrière..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Décrivez brièvement votre profil professionnel et vos objectifs
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={candidateProfile.years_experience}
                    onChange={(e) => handleCandidateProfileChange('years_experience', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nombre total d'années d'expérience professionnelle
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compétences</label>
                  <input
                    type="text"
                    value={candidateProfile.skills}
                    onChange={(e) => handleCandidateProfileChange('skills', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Développement web, APIs REST, Base de données, DevOps..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Séparez les compétences par des virgules
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expérience professionnelle</label>
                  <textarea
                    rows={3}
                    value={candidateProfile.professional_experience}
                    onChange={(e) => handleCandidateProfileChange('professional_experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Résumé de votre expérience professionnelle, postes occupés..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Résumé de votre parcours professionnel
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formation / Formation professionnelle</label>
                  <textarea
                    rows={3}
                    value={candidateProfile.education}
                    onChange={(e) => handleCandidateProfileChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Votre formation, diplômes, universités..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Votre parcours de formation et diplômes obtenus
                  </p>
                </div>

                

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  <input
                    type="text"
                    value={candidateProfile.technologies}
                    onChange={(e) => handleCandidateProfileChange('technologies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="React, Node.js, Python, MongoDB, Docker..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Séparez les technologies par des virgules
                  </p>
                </div>





                

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Réalisations</label>
                  <textarea
                    rows={3}
                    value={candidateProfile.achievements}
                    onChange={(e) => handleCandidateProfileChange('achievements', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    placeholder="Vos principales réalisations, projets, certifications..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vos réalisations importantes et certifications
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section CV et Photo */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-file-upload mr-2 text-blue-600"></i>
              Documents et Photos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CV Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (PDF, DOC, DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCandidateProfile(prev => ({ ...prev, cv: file }));
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                />
                {candidateProfile.cv && (
                  <p className="text-sm text-green-600 mt-1">
                    <i className="fas fa-check mr-1"></i>
                    {candidateProfile.cv instanceof File ? candidateProfile.cv.name : 'CV téléchargé'}
                  </p>
                )}
              </div>
              
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de profil (JPG, PNG)
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setCandidateProfile(prev => ({ ...prev, image: file }));
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                />
                {candidateProfile.image && (
                  <p className="text-sm text-green-600 mt-1">
                    <i className="fas fa-check mr-1"></i>
                    {candidateProfile.image instanceof File ? candidateProfile.image.name : 'Photo ajoutée'}
                  </p>
                )}
              </div>
              </div>
              </div>
              </>
              )}
              </div>

              {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Progress Indicator */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
              Progression du profil
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Profil de base</span>
                  <span className="font-medium text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Profil candidat</span>
                  <span className="font-medium text-fuchsia-600">
                    {(() => {
                      // Champs textuels du profil
                      const textFields = ['about', 'years_experience', 'technologies', 'professional_experience', 'education', 'skills', 'achievements'];
                      const filledTextFields = textFields.filter(field => candidateProfile[field] && candidateProfile[field] !== '');
                      
                      // Champs de fichiers (CV et photo)
                      const fileFields = ['cv', 'image'];
                      const filledFileFields = fileFields.filter(field => candidateProfile[field] && candidateProfile[field] !== '');
                      
                      // Debug logs
                      console.log('📊 Progression du profil:');
                      console.log('📝 Champs textuels remplis:', filledTextFields);
                      console.log('📁 Fichiers présents:', filledFileFields);
                      console.log('📊 candidateProfile:', candidateProfile);
                      
                      // Calcul de la progression : 70% pour les champs textuels + 30% pour les fichiers
                      const textProgress = (filledTextFields.length / textFields.length) * 70;
                      const fileProgress = (filledFileFields.length / fileFields.length) * 30;
                      
                      const totalProgress = Math.round(textProgress + fileProgress);
                      console.log('🎯 Progression calculée:', totalProgress, '% (Texte:', textProgress, '%, Fichiers:', fileProgress, '%)');
                      
                      return totalProgress;
                    })()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-fuchsia-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${(() => {
                        // Champs textuels du profil
                        const textFields = ['about', 'years_experience', 'technologies', 'professional_experience', 'education', 'skills', 'achievements'];
                        const filledTextFields = textFields.filter(field => candidateProfile[field] && candidateProfile[field] !== '');
                        
                        // Champs de fichiers (CV et photo)
                        const fileFields = ['cv', 'image'];
                        const filledFileFields = fileFields.filter(field => candidateProfile[field] && candidateProfile[field] !== '');
                        
                        // Calcul de la progression : 70% pour les champs textuels + 30% pour les fichiers
                        const textProgress = (filledTextFields.length / textFields.length) * 70;
                        const fileProgress = (filledFileFields.length / fileFields.length) * 30;
                        
                        return Math.round(textProgress + fileProgress);
                      })()}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb mr-2 text-yellow-600"></i>
              Conseils pour un profil optimal
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              {/* CV et Photo */}
              <div className="flex items-start space-x-2">
                <i className={`${candidateProfile.cv ? 'fas fa-check-circle text-green-500' : 'fas fa-exclamation-circle text-orange-500'} mt-1`}></i>
                <p>
                  {candidateProfile.cv ? 'CV téléchargé' : 'Téléchargez votre CV pour être visible'}
                </p>
                </div>
              <div className="flex items-start space-x-2">
                <i className={`${candidateProfile.image ? 'fas fa-check-circle text-green-500' : 'fas fa-exclamation-circle text-orange-500'} mt-1`}></i>
                <p>
                  {candidateProfile.image ? 'Photo de profil ajoutée' : 'Ajoutez une photo de profil professionnelle'}
                </p>
              </div>
              
              {/* Champs textuels */}
              <div className="flex items-start space-x-2">
                <i className={`${candidateProfile.about ? 'fas fa-check-circle text-green-500' : 'fas fa-exclamation-circle text-orange-500'} mt-1`}></i>
                <p>
                  {candidateProfile.about ? 'Description complète' : 'Rédigez une description de votre profil'}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <i className={`${candidateProfile.skills ? 'fas fa-check-circle text-green-500' : 'fas fa-exclamation-circle text-orange-500'} mt-1`}></i>
                <p>
                  {candidateProfile.skills ? 'Compétences renseignées' : 'Listez vos compétences principales'}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <i className={`${candidateProfile.technologies ? 'fas fa-check-circle text-green-500' : 'fas fa-exclamation-circle text-orange-500'} mt-1`}></i>
                <p>
                  {candidateProfile.technologies ? 'Technologies spécifiées' : 'Précisez vos technologies maîtrisées'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditerProfil;