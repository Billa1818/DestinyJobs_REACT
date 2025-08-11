import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../MessageManager';
import { profileService } from '../../services/profileService';
import BaseSettings from './BaseSettings';

const CandidateSettings = () => {
  const { user } = useAuth();
  const { success, error } = useMessage();
  
  const [candidateProfile, setCandidateProfile] = useState({
    about: '',
    yearsExperience: 0,
    technologies: '',
    professionalExperience: '',
    education: '',
    skills: '',
    achievements: '',
    country: '',
    region: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  // Charger le profil candidat au montage
  useEffect(() => {
    if (user) {
      loadCandidateProfile();
    }
  }, [user]);

  const loadCandidateProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getCandidateProfile();
      
      setCandidateProfile({
        about: profile.about || '',
        yearsExperience: profile.years_experience || 0,
        technologies: profile.technologies || '',
        professionalExperience: profile.professional_experience || '',
        education: profile.education || '',
        skills: profile.skills || '',
        achievements: profile.achievements || '',
        country: profile.country?.name || '',
        region: profile.region?.name || ''
      });
      
      if (profile.image) {
        setPreviewImage(profile.image);
      }
    } catch (err) {
      error('Erreur', 'Impossible de charger le profil candidat');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setCandidateProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSaveCandidateProfile = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('about', candidateProfile.about);
      formData.append('years_experience', candidateProfile.yearsExperience);
      formData.append('technologies', candidateProfile.technologies);
      formData.append('professional_experience', candidateProfile.professionalExperience);
      formData.append('education', candidateProfile.education);
      formData.append('skills', candidateProfile.skills);
      formData.append('achievements', candidateProfile.achievements);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      await profileService.updateCandidateProfile(formData);
      success('Succès', 'Profil candidat mis à jour avec succès');
      
      // Réinitialiser les fichiers
      setImageFile(null);
      setCvFile(null);
    } catch (err) {
      error('Erreur', 'Impossible de mettre à jour le profil candidat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseSettings userType="CANDIDAT">
      {/* Onglet Profil Candidat spécifique */}
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          <i className="fas fa-graduation-cap mr-2 text-fuchsia-600"></i>
          Profil Candidat
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo de profil */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fas fa-user text-gray-400 text-2xl"></i>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* CV */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">CV</label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                />
                <p className="text-xs text-gray-500 mt-1">PDF, DOC ou DOCX. Max 10MB.</p>
              </div>
              {cvFile && (
                <span className="text-sm text-green-600 font-medium">
                  <i className="fas fa-check mr-1"></i>
                  {cvFile.name}
                </span>
              )}
            </div>
          </div>

          {/* À propos */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">À propos</label>
            <textarea
              rows={4}
              value={candidateProfile.about}
              onChange={(e) => handleProfileChange('about', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Décrivez votre parcours professionnel et vos objectifs..."
            />
          </div>

          {/* Années d'expérience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
            <select
              value={candidateProfile.yearsExperience}
              onChange={(e) => handleProfileChange('yearsExperience', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value={0}>Débutant (0-1 an)</option>
              <option value={1}>1 an</option>
              <option value={2}>2 ans</option>
              <option value={3}>3 ans</option>
              <option value={4}>4 ans</option>
              <option value={5}>5 ans</option>
              <option value={6}>6-10 ans</option>
              <option value={11}>Plus de 10 ans</option>
            </select>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies maîtrisées</label>
            <input
              type="text"
              value={candidateProfile.technologies}
              onChange={(e) => handleProfileChange('technologies', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ex: Python, Django, React, PostgreSQL"
            />
          </div>

          {/* Expérience professionnelle */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expérience professionnelle</label>
            <textarea
              rows={3}
              value={candidateProfile.professionalExperience}
              onChange={(e) => handleProfileChange('professionalExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Décrivez votre expérience professionnelle..."
            />
          </div>

          {/* Formation */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
            <input
              type="text"
              value={candidateProfile.education}
              onChange={(e) => handleProfileChange('education', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ex: Master en Informatique - Université de Paris"
            />
          </div>

          {/* Compétences */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Compétences</label>
            <textarea
              rows={3}
              value={candidateProfile.skills}
              onChange={(e) => handleProfileChange('skills', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Listez vos compétences principales..."
            />
          </div>

          {/* Réalisations */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Réalisations</label>
            <textarea
              rows={3}
              value={candidateProfile.achievements}
              onChange={(e) => handleProfileChange('achievements', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Décrivez vos réalisations importantes, certifications, projets..."
            />
          </div>

          {/* Localisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <input
              type="text"
              value={candidateProfile.country}
              onChange={(e) => handleProfileChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ex: France"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
            <input
              type="text"
              value={candidateProfile.region}
              onChange={(e) => handleProfileChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ex: Île-de-France"
            />
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveCandidateProfile}
            disabled={loading}
            className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-save mr-2"></i>
            {loading ? 'Sauvegarde...' : 'Sauvegarder le profil candidat'}
          </button>
        </div>
      </div>
    </BaseSettings>
  );
};

export default CandidateSettings; 