import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../MessageManager';
import { profileService } from '../../services/profileService';
import BaseSettings from './BaseSettings';

const ProviderSettings = () => {
  const { user } = useAuth();
  const { success, error } = useMessage();
  
  const [providerProfile, setProviderProfile] = useState({
    providerType: 'individual', // individual ou organization
    companyName: '',
    companySize: '',
    industry: '',
    services: [],
    hourlyRate: '',
    availability: 'available', // available, busy, unavailable
    workingHours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '17:00', available: false },
      sunday: { start: '09:00', end: '17:00', available: false }
    },
    skills: '',
    experience: '',
    certifications: '',
    portfolio: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const availableServices = [
    'Développement web',
    'Développement mobile',
    'Design UI/UX',
    'Marketing digital',
    'Consulting',
    'Formation',
    'Maintenance',
    'Support technique',
    'Audit et conseil',
    'Intégration système'
  ];

  // Charger le profil prestataire au montage
  useEffect(() => {
    if (user) {
      loadProviderProfile();
    }
  }, [user]);

  const loadProviderProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProviderProfile();
      
      setProviderProfile({
        providerType: profile.provider_type || 'individual',
        companyName: profile.company_name || '',
        companySize: profile.company_size || '',
        industry: profile.industry || '',
        services: profile.services || [],
        hourlyRate: profile.hourly_rate || '',
        availability: profile.availability || 'available',
        workingHours: profile.working_hours || {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true },
          wednesday: { start: '09:00', end: '17:00', available: true },
          thursday: { start: '09:00', end: '17:00', available: true },
          friday: { start: '09:00', end: '17:00', available: true },
          saturday: { start: '09:00', end: '17:00', available: false },
          sunday: { start: '09:00', end: '17:00', available: false }
        },
        skills: profile.skills || '',
        experience: profile.experience || '',
        certifications: profile.certifications || '',
        portfolio: profile.portfolio || ''
      });
      
      if (profile.image) {
        setPreviewImage(profile.image);
      }
    } catch (err) {
      error('Erreur', 'Impossible de charger le profil prestataire');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProviderProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service) => {
    setProviderProfile(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleWorkingHourChange = (day, field, value) => {
    setProviderProfile(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
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

  const handleSaveProviderProfile = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('provider_type', providerProfile.providerType);
      formData.append('company_name', providerProfile.companyName);
      formData.append('company_size', providerProfile.companySize);
      formData.append('industry', providerProfile.industry);
      formData.append('services', JSON.stringify(providerProfile.services));
      formData.append('hourly_rate', providerProfile.hourlyRate);
      formData.append('availability', providerProfile.availability);
      formData.append('working_hours', JSON.stringify(providerProfile.workingHours));
      formData.append('skills', providerProfile.skills);
      formData.append('experience', providerProfile.experience);
      formData.append('certifications', providerProfile.certifications);
      formData.append('portfolio', providerProfile.portfolio);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await profileService.updateProviderProfile(formData);
      success('Succès', 'Profil prestataire mis à jour avec succès');
      
      // Réinitialiser le fichier
      setImageFile(null);
    } catch (err) {
      error('Erreur', 'Impossible de mettre à jour le profil prestataire');
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  return (
    <BaseSettings userType="PRESTATAIRE">
      {/* Onglet Profil Prestataire spécifique */}
      <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          <i className="fas fa-tools mr-2 text-fuchsia-600"></i>
          Profil Prestataire
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo de profil */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user-tie text-gray-400 text-2xl"></i>
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

          {/* Type de prestataire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de prestataire</label>
            <select
              value={providerProfile.providerType}
              onChange={(e) => handleProfileChange('providerType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="individual">Individuel</option>
              <option value="organization">Organisation</option>
            </select>
          </div>

          {/* Nom de l'entreprise (si organisation) */}
          {providerProfile.providerType === 'organization' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
              <input
                type="text"
                value={providerProfile.companyName}
                onChange={(e) => handleProfileChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Nom de votre entreprise"
              />
            </div>
          )}

          {/* Taille de l'entreprise (si organisation) */}
          {providerProfile.providerType === 'organization' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taille de l'entreprise</label>
              <select
                value={providerProfile.companySize}
                onChange={(e) => handleProfileChange('companySize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="1-5">1-5 employés</option>
                <option value="6-20">6-20 employés</option>
                <option value="21-50">21-50 employés</option>
                <option value="51-100">51-100 employés</option>
                <option value="100+">Plus de 100 employés</option>
              </select>
            </div>
          )}

          {/* Secteur d'activité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
            <input
              type="text"
              value={providerProfile.industry}
              onChange={(e) => handleProfileChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Ex: Technologie, Finance, Santé..."
            />
          </div>

          {/* Taux horaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taux horaire (€)</label>
            <input
              type="number"
              value={providerProfile.hourlyRate}
              onChange={(e) => handleProfileChange('hourlyRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="50"
              min="0"
            />
          </div>

          {/* Disponibilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
            <select
              value={providerProfile.availability}
              onChange={(e) => handleProfileChange('availability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="available">Disponible</option>
              <option value="busy">Occupé</option>
              <option value="unavailable">Indisponible</option>
            </select>
          </div>

          {/* Services proposés */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Services proposés</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableServices.map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={providerProfile.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Compétences */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Compétences</label>
            <textarea
              rows={3}
              value={providerProfile.skills}
              onChange={(e) => handleProfileChange('skills', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Listez vos compétences principales..."
            />
          </div>

          {/* Expérience */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expérience</label>
            <textarea
              rows={3}
              value={providerProfile.experience}
              onChange={(e) => handleProfileChange('experience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Décrivez votre expérience professionnelle..."
            />
          </div>

          {/* Certifications */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
            <textarea
              rows={3}
              value={providerProfile.certifications}
              onChange={(e) => handleProfileChange('certifications', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Listez vos certifications..."
            />
          </div>

          {/* Portfolio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
            <input
              type="url"
              value={providerProfile.portfolio}
              onChange={(e) => handleProfileChange('portfolio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="https://votre-portfolio.com"
            />
          </div>
        </div>

        {/* Horaires de travail */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
            Horaires de travail
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daysOfWeek.map(({ key, label }) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{label}</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={providerProfile.workingHours[key].available}
                      onChange={(e) => handleWorkingHourChange(key, 'available', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fuchsia-600"></div>
                  </label>
                </div>
                
                {providerProfile.workingHours[key].available && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Début</label>
                      <input
                        type="time"
                        value={providerProfile.workingHours[key].start}
                        onChange={(e) => handleWorkingHourChange(key, 'start', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Fin</label>
                      <input
                        type="time"
                        value={providerProfile.workingHours[key].end}
                        onChange={(e) => handleWorkingHourChange(key, 'end', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProviderProfile}
            disabled={loading}
            className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-save mr-2"></i>
            {loading ? 'Sauvegarde...' : 'Sauvegarder le profil prestataire'}
          </button>
        </div>
      </div>
    </BaseSettings>
  );
};

export default ProviderSettings; 