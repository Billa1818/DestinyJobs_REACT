import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProviderProfilService from '../../services/ProviderProfilService';

const PrestataireProfile = () => {
  const navigate = useNavigate();
  
  // États pour les données du profil
  const [profileData, setProfileData] = useState({
    provider_type: 'INDIVIDUAL',
    specializations: '',
    hourly_rate: '',
    daily_rate: '',
    availability: 'AVAILABLE',
    years_experience: '',
    completed_projects: '',
    country: { id: 1, name: 'Bénin' },
    region: { id: 1, name: 'Littoral' },
    organization_name: '',
    organization_description: '',
    organization_website: '',
    organization_address: '',
    organization_contact_email: '',
    organization_contact_phone: '',
    team_size: ''
  });

  // États pour les fichiers
  const [files, setFiles] = useState({
    image: null,
    cv: null,
    portfolio: null,
    organization_logo: null
  });

  // État pour les fichiers marqués pour suppression
  const [filesToDelete, setFilesToDelete] = useState(new Set());

  // États pour l'interface
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // États pour les pays et régions
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);

  // État pour les informations de l'utilisateur
  const [userProfile, setUserProfile] = useState(null);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);

  // Charger le profil au montage du composant
  useEffect(() => {
    loadProfile();
    loadCountries();
    loadUserProfile();
  }, []);

  // Charger le profil utilisateur depuis l'API
  const loadUserProfile = async () => {
    try {
      setLoadingUserProfile(true);
      const userData = await ProviderProfilService.getUserProfile();
      setUserProfile(userData);
    } catch (err) {
      console.error('Erreur lors du chargement du profil utilisateur:', err);
      setError('Erreur lors du chargement du profil utilisateur');
    } finally {
      setLoadingUserProfile(false);
    }
  };

  // Charger le profil depuis l'API
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await ProviderProfilService.getProviderProfile();
      const formattedData = ProviderProfilService.formatProfileForDisplay(data);
      setProfileData(formattedData);
      
      // Charger les fichiers existants dans l'état files
      loadExistingFiles(formattedData);
      
      // Charger la localisation actuelle si disponible
      try {
        const locationData = await ProviderProfilService.getCurrentLocation();
        if (locationData.country && locationData.region) {
          setProfileData(prev => ({
            ...prev,
            country: locationData.country,
            region: locationData.region
          }));
          
          // Charger les régions pour ce pays
          await loadRegions(locationData.country.id);
        }
      } catch (locationErr) {
        console.log('Localisation non disponible, utilisation des valeurs par défaut');
      }
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  // Charger les pays depuis l'API
  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const countriesData = await ProviderProfilService.getCountries();
      setCountries(countriesData);
      
      // Charger les régions pour le pays par défaut si disponible
      if (countriesData.length > 0) {
        await loadRegions(countriesData[0].id);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des pays:', err);
      setError('Erreur lors du chargement des pays');
    } finally {
      setLoadingCountries(false);
    }
  };

  // Charger les régions pour un pays donné
  const loadRegions = async (countryId) => {
    try {
      setLoadingRegions(true);
      const regionsData = await ProviderProfilService.getRegions(countryId);
      setRegions(regionsData);
    } catch (err) {
      console.error('Erreur lors du chargement des régions:', err);
      setError('Erreur lors du chargement des régions');
    } finally {
      setLoadingRegions(false);
    }
  };

  // Charger les fichiers existants depuis profileData
  const loadExistingFiles = (profileData) => {
    const existingFiles = {};
    
    console.log('🔄 Chargement des fichiers existants depuis:', profileData);
    
    // Vérifier chaque champ de fichier et construire l'URL complète
    if (profileData.image) {
      // Construire l'URL complète si elle est relative
      const imageUrl = profileData.image.startsWith('http') 
        ? profileData.image 
        : `http://localhost:8000${profileData.image}`;
      existingFiles.image = imageUrl;
      console.log('📸 Image existante chargée:', imageUrl);
    }
    
    if (profileData.cv) {
      const cvUrl = profileData.cv.startsWith('http') 
        ? profileData.cv 
        : `http://localhost:8000${profileData.cv}`;
      existingFiles.cv = cvUrl;
      console.log('📄 CV existant chargé:', cvUrl);
    }
    
    if (profileData.portfolio) {
      const portfolioUrl = profileData.portfolio.startsWith('http') 
        ? profileData.portfolio 
        : `http://localhost:8000${profileData.portfolio}`;
      existingFiles.portfolio = portfolioUrl;
      console.log('📁 Portfolio existant chargé:', portfolioUrl);
    }
    
    if (profileData.organization_logo) {
      const logoUrl = profileData.organization_logo.startsWith('http') 
        ? profileData.organization_logo 
        : `http://localhost:8000${profileData.organization_logo}`;
      existingFiles.organization_logo = logoUrl;
      console.log('🏢 Logo organisation existant chargé:', logoUrl);
    }
    
    setFiles(existingFiles);
    console.log('📁 État final des fichiers:', existingFiles);
  };

  // Gérer les changements de champs textuels
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Si le pays change, charger les régions correspondantes
    if (field === 'country' && value && value.id) {
      loadRegions(value.id);
      // Réinitialiser la région sélectionnée
      setProfileData(prev => ({ ...prev, region: null }));
    }
  };

  // Gérer les changements de fichiers
  const handleFileChange = (field, file) => {
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  // Obtenir les informations spécialisées selon le type de prestataire
  const getSpecializedInfo = () => {
    if (profileData.provider_type === 'ORGANIZATION') {
      return {
        teamSize: profileData.team_size || 0,
        specializations: profileData.specializations || 'Non spécifié',
        organizationWebsite: profileData.organization_website || null
      };
    } else {
      return {
        specializations: profileData.specializations || 'Non spécifié',
        technologies: profileData.technologies || 'Non spécifié'
      };
    }
  };

  // Obtenir le statut de disponibilité avec couleurs
  const getAvailabilityStatus = () => {
    const availability = profileData.availability;
    if (availability === 'AVAILABLE') {
      return { text: 'Disponible', color: 'text-green-600', bgColor: 'bg-green-100', icon: 'fas fa-check-circle' };
    } else if (availability === 'BUSY') {
      return { text: 'Occupé', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: 'fas fa-clock' };
    } else if (availability === 'UNAVAILABLE') {
      return { text: 'Indisponible', color: 'text-red-600', bgColor: 'bg-red-100', icon: 'fas fa-times-circle' };
    } else {
      return { text: 'Non défini', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: 'fas fa-question-circle' };
    }
  };

  // Obtenir les couleurs appropriées selon le type de prestataire
  const getProviderColors = () => {
    if (profileData.provider_type === 'ORGANIZATION') {
      return {
        gradient: 'from-blue-500 to-indigo-600',
        border: 'border-blue-200',
        icon: 'text-blue-600'
      };
    } else {
      return {
        gradient: 'from-orange-500 to-purple-600',
        border: 'border-orange-200',
        icon: 'text-orange-600'
      };
    }
  };

  // Obtenir l'icône appropriée selon le type de prestataire
  const getProviderIcon = () => {
    if (profileData.provider_type === 'ORGANIZATION') {
      return 'fas fa-building';
    } else {
      return 'fas fa-user';
    }
  };

  // Obtenir la description du prestataire
  const getDisplayDescription = () => {
    if (profileData.provider_type === 'ORGANIZATION') {
      return profileData.organization_description || 'Aucune description disponible';
    } else {
      return profileData.about || 'Aucune description disponible';
    }
  };

  // Obtenir les informations de contact de l'utilisateur
  const getUserContactInfo = () => {
    const userInfo = getUserInfo();
    if (!userInfo) return null;
    
    return {
      email: userInfo.email,
      phone: userInfo.phone,
      username: userInfo.username
    };
  };

  // Obtenir le statut de vérification de l'utilisateur
  const getUserVerificationStatus = () => {
    const userInfo = getUserInfo();
    if (!userInfo) return null;
    
    return {
      isApproved: userInfo.isApproved,
      emailVerified: userInfo.emailVerified,
      statusColor: userInfo.isApproved ? 'text-green-600' : 'text-orange-600',
      statusText: userInfo.isApproved ? 'Approuvé' : 'En attente d\'approbation',
      emailColor: userInfo.emailVerified ? 'text-green-600' : 'text-red-600',
      emailText: userInfo.emailVerified ? 'Email vérifié' : 'Email non vérifié'
    };
  };

  // Obtenir les informations de l'utilisateur
  const getUserInfo = () => {
    if (userProfile) {
      return {
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        username: userProfile.username || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        isApproved: userProfile.is_approved || false,
        emailVerified: userProfile.email_verified || false,
        userType: userProfile.user_type || '',
        lastActivity: userProfile.last_activity || '',
        createdAt: userProfile.created_at || '',
        updatedAt: userProfile.updated_at || ''
      };
    }
    return null;
  };

  // Obtenir l'image de profil de l'utilisateur
  const getUserProfileImage = () => {
    // Vérifier d'abord si c'est un prestataire individuel avec une photo
    if (profileData.provider_type === 'INDIVIDUAL' && getFilePreview('image')) {
      return getFilePreview('image');
    }
    
    // Vérifier si l'utilisateur a une image de profil dans ses données utilisateur
    if (profileData.user?.image) {
      return {
        url: profileData.user.image.startsWith('http') 
          ? profileData.user.image 
          : `http://localhost:8000${profileData.user.image}`,
        type: 'image/jpeg',
        isUserImage: true
      };
    }
    
    return null;
  };

  // Obtenir le nom d'affichage du prestataire
  const getDisplayName = () => {
    if (profileData.provider_type === 'ORGANIZATION') {
      return profileData.organization_name || 'Organisation';
    } else {
      const userInfo = getUserInfo();
      if (userInfo && (userInfo.firstName || userInfo.lastName)) {
        return `${userInfo.firstName} ${userInfo.lastName}`.trim();
      } else if (userInfo && userInfo.username) {
        return userInfo.username;
      }
      return 'Profil Individuel';
    }
  };

  // Obtenir des statistiques sur les fichiers
  const getFileStats = () => {
    const fields = ['image', 'cv', 'portfolio', 'organization_logo'];
    let totalFiles = 0;
    let totalSize = 0;
    let fileTypes = new Set();

    fields.forEach(field => {
      const preview = getFilePreview(field);
      if (preview) {
        totalFiles++;
        if (preview.size) {
          totalSize += preview.size;
        }
        fileTypes.add(preview.type);
      }
    });

    return {
      totalFiles,
      totalSize: formatFileSize(totalSize),
      fileTypes: Array.from(fileTypes).length
    };
  };

  // Obtenir un résumé des compétences pour les prestataires individuels
  const getIndividualSkillsSummary = () => {
    if (profileData.provider_type !== 'INDIVIDUAL') {
      return null;
    }
    
    // Construire un résumé des compétences à partir des données disponibles
    const skills = [];
    
    if (profileData.specializations) {
      skills.push(profileData.specializations);
    }
    
    if (profileData.technologies) {
      skills.push(profileData.technologies);
    }
    
    if (profileData.skills && Array.isArray(profileData.skills)) {
      skills.push(profileData.skills.join(', '));
    }
    
    if (profileData.expertise_areas) {
      skills.push(profileData.expertise_areas);
    }
    
    // Retourner le résumé des compétences ou null si aucune compétence
    return skills.length > 0 ? skills.join(' • ') : null;
  };

  // Demander l'envoi d'un email de vérification
  const requestEmailVerification = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const result = await ProviderProfilService.requestEmailVerification();
      setSuccess(result.message || 'Email de vérification envoyé. Veuillez vérifier votre boîte de réception.');
      
        // Recharger le profil pour mettre à jour le statut
        setTimeout(() => {
          loadProfile();
        loadUserProfile(); // Recharger aussi le profil utilisateur
        }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la demande de vérification:', error);
      if (error.response?.status === 401) {
        setError('Erreur d\'authentification. Veuillez vous reconnecter.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Erreur lors de la demande de vérification. Veuillez réessayer.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Obtenir des informations sur le type de fichier
  const getFileTypeInfo = (fileType) => {
    if (fileType.startsWith('image/')) {
      return { icon: 'fas fa-image', color: 'text-green-600', bgColor: 'bg-green-100', action: 'Voir l\'image' };
    } else if (fileType === 'application/pdf') {
      return { icon: 'fas fa-file-pdf', color: 'text-red-600', bgColor: 'bg-red-100', action: 'Voir le PDF' };
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return { icon: 'fas fa-file-word', color: 'text-blue-600', bgColor: 'bg-blue-100', action: 'Télécharger' };
    } else {
      return { icon: 'fas fa-file', color: 'text-gray-600', bgColor: 'bg-gray-100', action: 'Voir le fichier' };
    }
  };

  // Visualiser un fichier
  const handleViewFile = (field) => {
    try {
      const filePreview = getFilePreview(field);
      if (!filePreview) {
        setError(`Aucun fichier à visualiser pour ${field}`);
        return;
      }

      console.log(`🔍 Visualisation du fichier ${field}:`, filePreview);

      // Déterminer le type de fichier et agir en conséquence
      if (filePreview.type.startsWith('image/')) {
        // Pour les images, ouvrir dans un nouvel onglet
        window.open(filePreview.url, '_blank');
      } else if (filePreview.type === 'application/pdf') {
        // Pour les PDF, ouvrir dans un nouvel onglet
        window.open(filePreview.url, '_blank');
      } else if (filePreview.type.includes('word') || filePreview.type.includes('document')) {
        // Pour les documents Word, proposer le téléchargement
        const link = document.createElement('a');
        link.href = filePreview.url;
        link.download = filePreview.fullName || filePreview.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSuccess(`Téléchargement de ${filePreview.fullName || filePreview.name} lancé !`);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        // Pour les autres types, ouvrir dans un nouvel onglet
        window.open(filePreview.url, '_blank');
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la visualisation du fichier ${field}:`, error);
      setError(`Erreur lors de la visualisation du fichier ${field}. Veuillez réessayer.`);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Supprimer un fichier
  const handleFileRemove = async (field) => {
    try {
      console.log(`🗑️ Suppression du fichier ${field}`);
      
      // Vérifier si c'est un fichier existant sur le serveur
      const existingFile = files[field];
      
      if (existingFile) {
        // Marquer le fichier pour suppression
        setFilesToDelete(prev => new Set([...prev, field]));
        
        // Supprimer visuellement le fichier
        setFiles(prev => ({ ...prev, [field]: null }));
        
        // Mettre à jour aussi profileData
        setProfileData(prev => ({ ...prev, [field]: null }));
        
        console.log(`✅ Fichier ${field} marqué pour suppression`);
        
        // Afficher un message de succès
        setSuccess(`Fichier ${field} supprimé ! Sauvegardez pour confirmer la suppression.`);
        setTimeout(() => setSuccess(false), 3000);
      }
      
      // Réinitialiser l'input file
      const fileInput = document.querySelector(`input[type="file"][data-field="${field}"]`);
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du fichier ${field}:`, error);
      setError(`Erreur lors de la suppression du fichier ${field}. Veuillez réessayer.`);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Fonction pour tronquer le nom de fichier
  const truncateFileName = (fileName, maxLength = 5) => {
    if (!fileName) return '';
    if (fileName.length <= maxLength) return fileName;
    
    const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    const extension = fileName.split('.').pop();
    
    if (nameWithoutExtension.length <= maxLength) {
      return `${nameWithoutExtension}.${extension}`;
    }
    
    return `${nameWithoutExtension.substring(0, maxLength)}...${extension ? '.' + extension : ''}`;
  };

  // Obtenir l'aperçu d'un fichier (vérifie d'abord les nouveaux, puis les existants)
  const getFilePreview = (field) => {
    console.log(`🔍 Recherche de fichier pour ${field}:`);
    console.log(`  - Nouveau fichier (files):`, files[field]);
    console.log(`  - Fichier existant (profileData):`, profileData[field]);
    
    // Vérifier d'abord les nouveaux fichiers sélectionnés
    const newFile = files[field];
    if (newFile && newFile instanceof File) {
      console.log(`  ✅ Nouveau fichier trouvé: ${newFile.name}`);
      return {
        name: truncateFileName(newFile.name, 5),
        fullName: newFile.name, // Garder le nom complet pour référence
        size: newFile.size,
        type: newFile.type,
        isNew: true,
        url: URL.createObjectURL(newFile)
      };
    }
    
    // Vérifier ensuite les fichiers existants dans files (chargés depuis l'API)
    const existingFile = files[field];
    if (existingFile && typeof existingFile === 'string' && existingFile.startsWith('http')) {
      console.log(`  ✅ Fichier existant trouvé: ${existingFile}`);
      
      // Déterminer le type MIME basé sur l'extension
      const fileName = existingFile.split('/').pop() || 'Document';
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      let mimeType = 'application/octet-stream';
      if (extension === 'pdf') {
        mimeType = 'application/pdf';
      } else if (['doc', 'docx'].includes(extension)) {
        mimeType = 'application/msword';
      } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
        mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
      }
      
      return {
        name: truncateFileName(fileName, 5),
        fullName: fileName, // Garder le nom complet pour référence
        size: null,
        type: mimeType,
        isNew: false,
        url: existingFile,
        isExisting: true
      };
    }
    
    console.log(`  ❌ Aucun fichier trouvé pour ${field}`);
    return null;
  };

  // Vérifier si un fichier existe (nouveau ou existant)
  const hasFile = (field) => {
    return getFilePreview(field) !== null;
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Obtenir l'icône du type de fichier
  const getFileIcon = (fileName, fileType) => {
    if (fileType && fileType.startsWith('image/')) {
      return 'fas fa-image text-blue-500';
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fas fa-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-blue-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fas fa-image text-green-500';
      default:
        return 'fas fa-file text-gray-500';
    }
  };

  // Mettre à jour la localisation séparément
  const updateLocation = async () => {
    if (!profileData.country || !profileData.region) {
      return; // Pas de mise à jour si pas de pays/région sélectionnés
    }
    
    try {
      const locationData = {
        country_id: profileData.country.id,
        region_id: profileData.region.id
      };
      
      await ProviderProfilService.updateLocation(locationData);
      console.log('📍 Localisation mise à jour avec succès');
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour de la localisation:', err);
      // Ne pas bloquer la sauvegarde du profil pour une erreur de localisation
    }
  };

  // Sauvegarder le profil
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Valider les données
      const validation = ProviderProfilService.validateProfileData(profileData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Préparer les données pour l'envoi
      const formData = ProviderProfilService.prepareProfileData(profileData, files);

      // Ajouter les champs de suppression de fichiers
      if (filesToDelete.size > 0) {
        console.log('🗑️ Fichiers marqués pour suppression:', Array.from(filesToDelete));
        filesToDelete.forEach(field => {
          // Ajouter un champ vide pour indiquer la suppression
          formData.append(field, '');
          console.log(`🗑️ Champ ${field} marqué pour suppression`);
        });
      }

      // Envoyer à l'API
      const result = await ProviderProfilService.updateProviderProfile(formData);
      console.log('✅ Profil mis à jour avec succès:', result);

      // Mettre à jour la localisation séparément
      await updateLocation();

      // Vider la liste des fichiers à supprimer
      setFilesToDelete(new Set());

      setSuccess(true);
      
      // Recharger le profil pour afficher les fichiers mis à jour
      setTimeout(async () => {
        try {
          console.log('🔄 Rechargement du profil après sauvegarde...');
          await loadProfile();
          setSuccess(false);
        } catch (err) {
          console.error('❌ Erreur lors du rechargement:', err);
        }
      }, 1000);
      
    } catch (err) {
      console.error('❌ Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  // Fonction de débogage pour afficher l'état des fichiers
  const debugFiles = () => {
    console.log('🐛 DEBUG - État des fichiers:');
    console.log('📁 files state:', files);
    console.log('📊 profileData:', profileData);
    
    Object.keys(files).forEach(field => {
      const preview = getFilePreview(field);
      console.log(`🔍 ${field}:`, {
        hasFile: !!files[field],
        hasPreview: !!preview,
        preview: preview
      });
    });
  };

  // Appeler le débogage à chaque rendu pour voir l'état
  useEffect(() => {
    if (!loading) {
      debugFiles();
    }
  }, [files, profileData, loading]);

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:px-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
                <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 disabled:opacity-50"
              >
                <i className="fas fa-save mr-2"></i>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>

            {/* Messages de succès/erreur */}
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

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-red-400"></i>
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
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'personal' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Informations personnelles
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'professional' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-briefcase mr-2"></i>Profil professionnel
              </button>
              <button
                onClick={() => setActiveTab('organization')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'organization' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-building mr-2"></i>Organisation
              </button>
            </div>
          </div>

          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-user mr-2 text-orange-600"></i>
                Informations personnelles
              </h2>
              

              
              {/* Informations de base de l'utilisateur */}
              {loadingUserProfile ? (
                <div className="mb-8 text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des informations utilisateur...</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={userProfile?.first_name || ''}
                    onChange={(e) => {
                      if (userProfile) {
                        setUserProfile(prev => ({ ...prev, first_name: e.target.value }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Votre prénom"
                    readOnly={!userProfile}
                  />
                </div>

                {/* Nom de famille */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    value={userProfile?.last_name || ''}
                    onChange={(e) => {
                      if (userProfile) {
                        setUserProfile(prev => ({ ...prev, last_name: e.target.value }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Votre nom de famille"
                    readOnly={!userProfile}
                  />
                </div>

                {/* Nom d'utilisateur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur *
                  </label>
                  <input
                    type="text"
                    value={userProfile?.username || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Votre nom d'utilisateur"
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Ce champ ne peut pas être modifié</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={userProfile?.email || ''}
                      onChange={(e) => {
                        if (userProfile && userProfile.email_verified) {
                          setUserProfile(prev => ({ ...prev, email: e.target.value }));
                        }
                      }}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        userProfile?.email_verified 
                          ? 'border-gray-300 bg-white' 
                          : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`}
                      placeholder="votre.email@exemple.com"
                      readOnly={!userProfile || !userProfile?.email_verified}
                      disabled={!userProfile || !userProfile?.email_verified}
                    />
                    {!userProfile?.email_verified && (
                      <button
                        onClick={requestEmailVerification}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 text-sm whitespace-nowrap"
                        title="Demander la vérification de l'email"
                      >
                        <i className="fas fa-envelope mr-2"></i>
                        {saving ? 'Envoi...' : 'Vérifier'}
                      </button>
                    )}
                  </div>
                  {!userProfile?.email_verified && (
                    <p className="text-xs text-orange-600 mt-1">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      Email non vérifié - Le champ est désactivé jusqu'à la vérification
                    </p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={userProfile?.phone || ''}
                    onChange={(e) => {
                      if (userProfile) {
                        setUserProfile(prev => ({ ...prev, phone: e.target.value }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+229 90 12 34 56"
                    readOnly={!userProfile}
                  />

                </div>

                {/* Type de compte (lecture seule) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de compte
                  </label>
                  <input
                    type="text"
                    value={userProfile?.user_type || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Ce champ ne peut pas être modifié</p>
                </div>
              </div>
              )}
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  <i className="fas fa-briefcase mr-2 text-blue-600"></i>
                  Informations professionnelles
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type de prestataire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de prestataire *
                  </label>
                  <select
                    value={profileData.provider_type}
                    onChange={(e) => handleInputChange('provider_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="INDIVIDUAL">Individuel</option>
                    <option value="ORGANIZATION">Organisation</option>
                  </select>
                </div>

                {/* Disponibilité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilité *
                  </label>
                  <select
                    value={profileData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="BUSY">Occupé</option>
                    <option value="UNAVAILABLE">Non disponible</option>
                  </select>
                </div>

                {/* Photo de profil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('image', e.target.files[0])}
                    data-field="image"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  
                  {/* Aperçu de la photo */}
                  {getFilePreview('image') && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-image text-orange-600 text-lg"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900" 
                               title={getFilePreview('image').fullName || getFilePreview('image').name}>
                              {getFilePreview('image').name}
                            </p>
                            {getFilePreview('image').size && (
                              <p className="text-xs text-gray-500">
                                {formatFileSize(getFilePreview('image').size)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const fileInfo = getFileTypeInfo(getFilePreview('image').type);
                            return (
                              <button
                                onClick={() => handleViewFile('image')}
                                className={`${fileInfo.color} hover:opacity-80 p-2 rounded-lg ${fileInfo.bgColor} transition-all duration-200`}
                                title={fileInfo.action}
                              >
                                <i className={`${fileInfo.icon} text-sm`}></i>
                              </button>
                            );
                          })()}
                          <button
                            onClick={() => handleFileRemove('image')}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-200"
                            title="Supprimer"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* Prévisualisation de l'image */}
                      {getFilePreview('image').type.startsWith('image/') && (
                        <div className="mt-3">
                          <img
                            src={getFilePreview('image').url}
                            alt="Aperçu"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('cv', e.target.files[0])}
                    data-field="cv"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  
                  {/* Aperçu du CV */}
                  {getFilePreview('cv') && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className={getFileIcon(getFilePreview('cv').name, getFilePreview('cv').type)}></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900"
                               title={getFilePreview('cv').fullName || getFilePreview('cv').name}>
                              {getFilePreview('cv').name}
                            </p>
                            {getFilePreview('cv').size && (
                              <p className="text-xs text-gray-500">
                                {formatFileSize(getFilePreview('cv').size)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewFile('cv')}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Voir le CV"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleFileRemove('cv')}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Supprimer"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Portfolio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('portfolio', e.target.files[0])}
                    data-field="portfolio"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  
                  {/* Aperçu du portfolio */}
                  {getFilePreview('portfolio') && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className={getFileIcon(getFilePreview('portfolio').name, getFilePreview('portfolio').type)}></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900"
                               title={getFilePreview('portfolio').fullName || getFilePreview('portfolio').name}>
                              {getFilePreview('portfolio').name}
                            </p>
                            {getFilePreview('portfolio').size && (
                              <p className="text-xs text-gray-500">
                                {formatFileSize(getFilePreview('portfolio').size)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const fileInfo = getFileTypeInfo(getFilePreview('portfolio').type);
                            return (
                              <button
                                onClick={() => handleViewFile('portfolio')}
                                className={`${fileInfo.color} hover:opacity-80 p-2 rounded-lg ${fileInfo.bgColor} transition-all duration-200`}
                                title={fileInfo.action}
                              >
                                <i className={`${fileInfo.icon} text-sm`}></i>
                              </button>
                            );
                          })()}
                          <button
                            onClick={() => handleFileRemove('portfolio')}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-200"
                            title="Supprimer"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Professional Information */}
          {activeTab === 'professional' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-briefcase mr-2 text-orange-600"></i>
                Profil professionnel
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Spécialisations */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialisations *
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.specializations}
                    onChange={(e) => handleInputChange('specializations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ex: Développement Web, Python, Django, React, Formation..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Séparez vos spécialisations par des virgules
                  </p>
                </div>

                {/* Taux horaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux horaire (FCFA) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={profileData.hourly_rate}
                    onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="50.00"
                  />
                </div>

                {/* Taux journalier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux journalier (FCFA) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={profileData.daily_rate}
                    onChange={(e) => handleInputChange('daily_rate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="400.00"
                  />
                </div>

                {/* Années d'expérience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Années d'expérience *
                  </label>
                  <input
                    type="number"
                    value={profileData.years_experience}
                    onChange={(e) => handleInputChange('years_experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>

                {/* Projets complétés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projets complétés
                  </label>
                  <input
                    type="number"
                    value={profileData.completed_projects}
                    onChange={(e) => handleInputChange('completed_projects', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="25"
                  />
                </div>

                {/* Pays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <select
                    value={profileData.country?.id || ''}
                    onChange={(e) => handleInputChange('country', { id: parseInt(e.target.value), name: e.target.options[e.target.selectedIndex].text })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={loadingCountries}
                  >
                    {loadingCountries ? (
                      <option>Chargement des pays...</option>
                    ) : countries.length > 0 ? (
                      countries.map(country => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))
                    ) : (
                      <option>Aucun pays disponible</option>
                    )}
                  </select>
                  {loadingCountries && (
                    <div className="mt-1 text-xs text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-1"></i>
                      Chargement des pays...
                    </div>
                  )}
                  {!loadingCountries && countries.length === 0 && (
                    <div className="mt-1 text-xs text-red-500">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      Erreur lors du chargement des pays
                    </div>
                  )}
                </div>

                {/* Région */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Région
                  </label>
                  <select
                    value={profileData.region?.id || ''}
                    onChange={(e) => handleInputChange('region', { id: parseInt(e.target.value), name: e.target.options[e.target.selectedIndex].text })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={loadingRegions || !profileData.country}
                  >
                    {!profileData.country ? (
                      <option>Sélectionnez d'abord un pays</option>
                    ) : loadingRegions ? (
                      <option>Chargement des régions...</option>
                    ) : regions.length > 0 ? (
                      regions.map(region => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))
                    ) : (
                      <option>Aucune région disponible</option>
                    )}
                  </select>
                  {loadingRegions && (
                    <div className="mt-1 text-xs text-gray-500">
                      <i className="fas fa-spinner fa-spin mr-1"></i>
                      Chargement des régions...
                </div>
                  )}
                  {!loadingRegions && regions.length === 0 && profileData.country && (
                    <div className="mt-1 text-xs text-red-500">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      Erreur lors du chargement des régions
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Organization Information */}
          {activeTab === 'organization' && profileData.provider_type === 'ORGANIZATION' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-building mr-2 text-orange-600"></i>
                Informations de l'organisation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom de l'organisation */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'organisation *
                  </label>
                  <input
                    type="text"
                    value={profileData.organization_name}
                    onChange={(e) => handleInputChange('organization_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ma Société SARL"
                  />
                </div>

                {/* Description de l'organisation */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description de l'organisation *
                  </label>
                  <textarea
                    rows={4}
                    value={profileData.organization_description}
                    onChange={(e) => handleInputChange('organization_description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Décrivez votre organisation, ses activités, sa mission..."
                  />
                </div>

                {/* Site web */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={profileData.organization_website}
                    onChange={(e) => handleInputChange('organization_website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://masociete.com"
                  />
                </div>

                {/* Taille de l'équipe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l'équipe *
                  </label>
                  <input
                    type="number"
                    value={profileData.team_size}
                    onChange={(e) => handleInputChange('team_size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>

                {/* Adresse */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={profileData.organization_address}
                    onChange={(e) => handleInputChange('organization_address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="123 Rue de la Paix, Cotonou"
                  />
                </div>

                {/* Email de contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={profileData.organization_contact_email}
                    onChange={(e) => handleInputChange('organization_contact_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="contact@masociete.com"
                  />
                </div>

                {/* Téléphone de contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone de contact
                  </label>
                  <input
                    type="tel"
                    value={profileData.organization_contact_phone}
                    onChange={(e) => handleInputChange('organization_contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+229 90 12 34 56"
                  />
                </div>

                {/* Logo de l'organisation */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de l'organisation
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('organization_logo', e.target.files[0])}
                    data-field="organization_logo"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  
                  {/* Aperçu du logo */}
                  {getFilePreview('organization_logo') && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-image text-green-600 text-lg"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900"
                               title={getFilePreview('organization_logo').fullName || getFilePreview('organization_logo').name}>
                              {getFilePreview('organization_logo').name}
                            </p>
                            {getFilePreview('organization_logo').size && (
                              <p className="text-xs text-gray-500">
                                {formatFileSize(getFilePreview('organization_logo').size)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const fileInfo = getFileTypeInfo(getFilePreview('organization_logo').type);
                            return (
                              <button
                                onClick={() => handleViewFile('organization_logo')}
                                className={`${fileInfo.color} hover:opacity-80 p-2 rounded-lg ${fileInfo.bgColor} transition-all duration-200`}
                                title={fileInfo.action}
                              >
                                <i className={`${fileInfo.icon} text-sm`}></i>
                              </button>
                            );
                          })()}
                          <button
                            onClick={() => handleFileRemove('organization_logo')}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-200"
                            title="Supprimer"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* Prévisualisation du logo */}
                      {getFilePreview('organization_logo').type.startsWith('image/') && (
                        <div className="mt-3">
                          <img
                            src={getFilePreview('organization_logo').url}
                            alt="Aperçu du logo"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Message si pas d'organisation */}
          {activeTab === 'organization' && profileData.provider_type === 'INDIVIDUAL' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center py-8">
                <i className="fas fa-user text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profil individuel</h3>
                <p className="text-gray-600">
                  Vous avez sélectionné le type "Individuel". Les informations d'organisation ne sont pas nécessaires.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Profile Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="text-center mb-6">
              {/* Affichage dynamique : Logo organisation ou Photo de profil individuel */}
              {profileData.provider_type === 'ORGANIZATION' && getFilePreview('organization_logo') ? (
                // Logo de l'organisation
                <div className="w-24 h-24 mx-auto mb-4">
                  <img
                    src={getFilePreview('organization_logo').url}
                    alt="Logo de l'organisation"
                    className={`w-24 h-24 object-cover rounded-full border-4 ${getProviderColors().border} shadow-lg`}
                  />
                </div>
              ) : getUserProfileImage() ? (
                // Photo de profil de l'utilisateur (individuel ou utilisateur)
                <div className="w-24 h-24 mx-auto mb-4">
                  <img
                    src={getUserProfileImage().url}
                    alt="Photo de profil"
                    className={`w-24 h-24 object-cover rounded-full border-4 ${getProviderColors().border} shadow-lg`}
                  />
                </div>
              ) : (
                // Fallback avec icône
                <div className={`w-24 h-24 bg-gradient-to-r ${getProviderColors().border} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${getProviderIcon()} text-white text-2xl`}></i>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900">
                {getDisplayName()}
              </h3>
              <p className="text-gray-600">
                {profileData.provider_type === 'ORGANIZATION' ? 'Organisation' : 'Individuel'}
              </p>
              <p className="text-sm text-gray-500 mt-2 px-4">
                {getDisplayDescription()}
              </p>
              
              {/* Statuts de vérification de l'utilisateur */}
              {loadingUserProfile ? (
                <div className="mt-3">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                    <span className="text-xs text-gray-500">Chargement des informations...</span>
                  </div>
                </div>
              ) : getUserVerificationStatus() ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <i className={`fas fa-user-check ${getUserVerificationStatus().statusColor} mr-2`}></i>
                      <span className="text-xs text-gray-600">{getUserVerificationStatus().statusText}</span>
                    </div>
                    <div className="flex items-center">
                      <i className={`fas fa-envelope ${getUserVerificationStatus().emailColor} mr-2`}></i>
                      <span className="text-xs text-gray-600">{getUserVerificationStatus().emailText}</span>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Informations de contact de l'utilisateur */}
              {getUserContactInfo() && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center justify-center">
                      <i className="fas fa-at text-gray-400 mr-2"></i>
                      <span>{getUserContactInfo().email}</span>
                    </div>
                    {getUserContactInfo().phone && (
                      <div className="flex items-center justify-center">
                        <i className="fas fa-phone text-gray-400 mr-2"></i>
                        <span>{getUserContactInfo().phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Compétences du prestataire individuel */}
              {getIndividualSkillsSummary() && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Compétences principales</div>
                    <div className="text-sm text-gray-700 font-medium px-2">
                      {getIndividualSkillsSummary()}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 ${getAvailabilityStatus().bgColor} rounded-full flex items-center justify-center mr-3`}>
                  <i className={`${getAvailabilityStatus().icon} ${getAvailabilityStatus().color} text-sm`}></i>
                </div>
                <span className="text-gray-700">{getAvailabilityStatus().text}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.years_experience || 0} ans d'expérience</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.completed_projects || 0} projets complétés</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-money-bill text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.hourly_rate || 0} FCFA/h</span>
              </div>
              
              {/* Informations spécialisées selon le type */}
              {profileData.provider_type === 'ORGANIZATION' && (
                <>
                  <div className="flex items-center">
                    <i className="fas fa-users text-gray-400 mr-3"></i>
                    <span className="text-gray-700">{getSpecializedInfo().teamSize} membres d'équipe</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-globe text-gray-400 mr-3"></i>
                    <span className="text-gray-700">
                      {getSpecializedInfo().organizationWebsite ? (
                        <a 
                          href={getSpecializedInfo().organizationWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Site web
                        </a>
                      ) : (
                        'Aucun site web'
                      )}
                    </span>
                  </div>
                </>
              )}
              
              <div className="flex items-center">
                <i className="fas fa-tags text-gray-400 mr-3"></i>
                <span className="text-gray-700 text-sm">
                  {getSpecializedInfo().specializations}
                </span>
              </div>
            </div>
          </div>



          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Link to="/prestataire/services" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-briefcase text-orange-600 mr-3"></i>
                <span className="text-gray-700">Gérer mes services</span>
              </Link>
              <Link to="/consultation" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-search text-orange-600 mr-3"></i>
                <span className="text-gray-700">Rechercher des consultations</span>
              </Link>
              <Link to="/prestataire/candidatures" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-paper-plane text-orange-600 mr-3"></i>
                <span className="text-gray-700">Mes candidatures</span>
              </Link>
            </div>
          </div>


          {/* Statistics */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projets complétés</span>
                <span className="font-semibold text-gray-900">{profileData.completed_projects || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Années d'expérience</span>
                <span className="font-semibold text-gray-900">{profileData.years_experience || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux horaire</span>
                <span className="font-semibold text-gray-900">{profileData.hourly_rate || 0} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux journalier</span>
                <span className="font-semibold text-gray-900">{profileData.daily_rate || 0} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrestataireProfile; 