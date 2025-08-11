import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../MessageManager';
import { profileService } from '../../services/profileService';
import BaseSettings from './BaseSettings';

const RecruiterSettings = () => {
  const { user } = useAuth();
  const { success, error } = useMessage();
  
  const [recruiterProfile, setRecruiterProfile] = useState({
    companyName: '',
    companySize: '',
    industry: '',
    position: '',
    companyDescription: '',
    website: '',
    linkedin: '',
    recruitmentPreferences: {
      autoApprove: false,
      requireCoverLetter: true,
      requireReferences: false,
      notifyOnApplication: true
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState('');

  // Charger le profil recruteur au montage
  useEffect(() => {
    if (user) {
      loadRecruiterProfile();
    }
  }, [user]);

  const loadRecruiterProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getRecruiterProfile();
      
      setRecruiterProfile({
        companyName: profile.company_name || '',
        companySize: profile.company_size || '',
        industry: profile.industry || '',
        position: profile.position || '',
        companyDescription: profile.company_description || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        recruitmentPreferences: {
          autoApprove: profile.recruitment_preferences?.auto_approve || false,
          requireCoverLetter: profile.recruitment_preferences?.require_cover_letter !== false,
          requireReferences: profile.recruitment_preferences?.require_references || false,
          notifyOnApplication: profile.recruitment_preferences?.notify_on_application !== false
        }
      });
      
      if (profile.logo) {
        setPreviewLogo(profile.logo);
      }
    } catch (err) {
      error('Erreur', 'Impossible de charger le profil recruteur');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setRecruiterProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (preference, value) => {
    setRecruiterProfile(prev => ({
      ...prev,
      recruitmentPreferences: {
        ...prev.recruitmentPreferences,
        [preference]: value
      }
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRecruiterProfile = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('company_name', recruiterProfile.companyName);
      formData.append('company_size', recruiterProfile.companySize);
      formData.append('industry', recruiterProfile.industry);
      formData.append('position', recruiterProfile.position);
      formData.append('company_description', recruiterProfile.companyDescription);
      formData.append('website', recruiterProfile.website);
      formData.append('linkedin', recruiterProfile.linkedin);
      formData.append('recruitment_preferences', JSON.stringify(recruiterProfile.recruitmentPreferences));
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      await profileService.updateRecruiterProfile(formData);
      success('Succès', 'Profil recruteur mis à jour avec succès');
      
      // Réinitialiser le fichier
      setLogoFile(null);
    } catch (err) {
      error('Erreur', 'Impossible de mettre à jour le profil recruteur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseSettings userType="RECRUTEUR">
      {/* Onglet Profil Recruteur spécifique */}
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          <i className="fas fa-building mr-2 text-fuchsia-600"></i>
          Profil Entreprise
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo de l'entreprise */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'entreprise</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                {previewLogo ? (
                  <img 
                    src={previewLogo} 
                    alt="Logo entreprise" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-building text-gray-400 text-2xl"></i>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG ou GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Nom de l'entreprise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise *</label>
            <input
              type="text"
              value={recruiterProfile.companyName}
              onChange={(e) => handleProfileChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Nom de votre entreprise"
              required
            />
          </div>

          {/* Taille de l'entreprise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taille de l'entreprise</label>
            <select
              value={recruiterProfile.companySize}
              onChange={(e) => handleProfileChange('companySize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="1-10">1-10 employés</option>
              <option value="11-50">11-50 employés</option>
              <option value="51-200">51-200 employés</option>
              <option value="201-500">201-500 employés</option>
              <option value="501-1000">501-1000 employés</option>
              <option value="1000+">Plus de 1000 employés</option>
            </select>
          </div>

          {/* Secteur d'activité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
            <input
              type="text"
              value={recruiterProfile.industry}
              onChange={(e) => handleProfileChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ex: Technologie, Finance, Santé..."
            />
          </div>

          {/* Poste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Votre poste</label>
            <input
              type="text"
              value={recruiterProfile.position}
              onChange={(e) => handleProfileChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ex: Responsable RH, Recruteur..."
            />
          </div>

          {/* Description de l'entreprise */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description de l'entreprise</label>
            <textarea
              rows={4}
              value={recruiterProfile.companyDescription}
              onChange={(e) => handleProfileChange('companyDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Décrivez votre entreprise, sa mission, ses valeurs..."
            />
          </div>

          {/* Site web */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
            <input
              type="url"
              value={recruiterProfile.website}
              onChange={(e) => handleProfileChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="https://www.votreentreprise.com"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              value={recruiterProfile.linkedin}
              onChange={(e) => handleProfileChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/votreentreprise"
            />
          </div>
        </div>

        {/* Préférences de recrutement */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="fas fa-cog mr-2 text-fuchsia-600"></i>
            Préférences de recrutement
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Approbation automatique</h4>
                <p className="text-sm text-gray-600">Approuver automatiquement les candidatures</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={recruiterProfile.recruitmentPreferences.autoApprove}
                  onChange={(e) => handlePreferenceChange('autoApprove', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Lettre de motivation</h4>
                <p className="text-sm text-gray-600">Exiger une lettre de motivation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={recruiterProfile.recruitmentPreferences.requireCoverLetter}
                  onChange={(e) => handlePreferenceChange('requireCoverLetter', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Références</h4>
                <p className="text-sm text-gray-600">Demander des références</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={recruiterProfile.recruitmentPreferences.requireReferences}
                  onChange={(e) => handlePreferenceChange('requireReferences', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Notifications</h4>
                <p className="text-sm text-gray-600">Notifier sur nouvelle candidature</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={recruiterProfile.recruitmentPreferences.notifyOnApplication}
                  onChange={(e) => handlePreferenceChange('notifyOnApplication', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveRecruiterProfile}
            disabled={loading}
            className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-save mr-2"></i>
            {loading ? 'Sauvegarde...' : 'Sauvegarder le profil entreprise'}
          </button>
        </div>
      </div>
    </BaseSettings>
  );
};

export default RecruiterSettings; 