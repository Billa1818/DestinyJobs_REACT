import React, { useState } from 'react';

const AvailabilitySection = () => {
  const [availability, setAvailability] = useState({
    status: 'available', // available, not-available, open-to-opportunities
    startDate: '',
    noticePeriod: '2-weeks',
    workType: ['full-time', 'remote'],
    locations: ['Cotonou', 'Porto-Novo', 'Remote'],
    salary: {
      min: 500000,
      max: 800000,
      currency: 'XOF'
    },
    timezone: 'Africa/Lagos',
    languages: ['Français', 'Anglais', 'Fon']
  });

  const [showEditForm, setShowEditForm] = useState(false);

  const statusOptions = [
    { value: 'available', label: 'Disponible immédiatement', color: 'bg-green-100 text-green-800', icon: 'fas fa-check-circle' },
    { value: 'not-available', label: 'Non disponible', color: 'bg-red-100 text-red-800', icon: 'fas fa-times-circle' },
    { value: 'open-to-opportunities', label: 'Ouvert aux opportunités', color: 'bg-blue-100 text-blue-800', icon: 'fas fa-eye' }
  ];

  const noticePeriodOptions = [
    { value: 'immediate', label: 'Immédiat' },
    { value: '1-week', label: '1 semaine' },
    { value: '2-weeks', label: '2 semaines' },
    { value: '1-month', label: '1 mois' },
    { value: '2-months', label: '2 mois' },
    { value: '3-months', label: '3 mois' }
  ];

  const workTypeOptions = [
    { value: 'full-time', label: 'Temps plein', icon: 'fas fa-clock' },
    { value: 'part-time', label: 'Temps partiel', icon: 'fas fa-clock' },
    { value: 'contract', label: 'Contrat', icon: 'fas fa-file-contract' },
    { value: 'freelance', label: 'Freelance', icon: 'fas fa-user-tie' },
    { value: 'internship', label: 'Stage', icon: 'fas fa-graduation-cap' }
  ];

  const locationOptions = [
    'Cotonou', 'Porto-Novo', 'Parakou', 'Abomey', 'Natitingou', 'Remote', 'Hybride'
  ];

  const timezoneOptions = [
    { value: 'Africa/Lagos', label: 'Afrique de l\'Ouest (GMT+1)' },
    { value: 'Europe/Paris', label: 'Europe (GMT+1/+2)' },
    { value: 'America/New_York', label: 'Amérique (GMT-5/-4)' },
    { value: 'Asia/Tokyo', label: 'Asie (GMT+9)' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'workType') {
        const newWorkTypes = checked 
          ? [...availability.workType, value]
          : availability.workType.filter(type => type !== value);
        setAvailability(prev => ({ ...prev, workType: newWorkTypes }));
      } else if (name === 'locations') {
        const newLocations = checked 
          ? [...availability.locations, value]
          : availability.locations.filter(loc => loc !== value);
        setAvailability(prev => ({ ...prev, locations: newLocations }));
      }
    } else if (name === 'salary.min' || name === 'salary.max') {
      const field = name.split('.')[1];
      setAvailability(prev => ({
        ...prev,
        salary: { ...prev.salary, [field]: parseInt(value) }
      }));
    } else {
      setAvailability(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowEditForm(false);
    // Ici vous pouvez ajouter la logique pour sauvegarder les données
    console.log('Nouvelle disponibilité:', availability);
  };

  const getStatusInfo = () => {
    const status = statusOptions.find(s => s.value === availability.status);
    return status || statusOptions[0];
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-calendar-check mr-2 text-fuchsia-600"></i>
          Disponibilité & Préférences
        </h3>
        <button 
          onClick={() => setShowEditForm(!showEditForm)}
          className="text-gray-400 hover:text-fuchsia-600 transition duration-200"
        >
          <i className="fas fa-edit"></i>
        </button>
      </div>

      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo().color}`}>
            <i className={`${getStatusInfo().icon} mr-2`}></i>
            {getStatusInfo().label}
          </span>
          {availability.startDate && (
            <span className="text-sm text-gray-600">
              <i className="fas fa-calendar mr-1"></i>
              Disponible à partir du {new Date(availability.startDate).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Délai de préavis</div>
            <div className="font-medium">
              {noticePeriodOptions.find(p => p.value === availability.noticePeriod)?.label}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Type de travail</div>
            <div className="flex flex-wrap gap-1">
              {availability.workType.map(type => {
                const option = workTypeOptions.find(w => w.value === type);
                return (
                  <span key={type} className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded">
                    <i className={`${option?.icon} mr-1`}></i>
                    {option?.label}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Localisation</div>
            <div className="flex flex-wrap gap-1">
              {availability.locations.map(location => (
                <span key={location} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {location}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Salary Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Fourchette salariale</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Fourchette</span>
            <span className="text-sm text-gray-500">{availability.salary.currency}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Minimum</div>
              <div className="font-semibold text-gray-900">{formatSalary(availability.salary.min)}</div>
            </div>
            <div className="text-gray-400">-</div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Maximum</div>
              <div className="font-semibold text-gray-900">{formatSalary(availability.salary.max)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Fuseau horaire</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <i className="fas fa-clock text-gray-400 mr-2"></i>
              <span>{timezoneOptions.find(t => t.value === availability.timezone)?.label}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Langues de travail</h4>
          <div className="flex flex-wrap gap-2">
            {availability.languages.map(lang => (
              <span key={lang} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Modifier la disponibilité</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut de disponibilité</label>
              <select 
                name="status"
                value={availability.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Start Date and Notice Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de disponibilité</label>
                <input 
                  type="date"
                  name="startDate"
                  value={availability.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Délai de préavis</label>
                <select 
                  name="noticePeriod"
                  value={availability.noticePeriod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  {noticePeriodOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Work Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de travail</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {workTypeOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      name="workType"
                      value={option.value}
                      checked={availability.workType.includes(option.value)}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisations acceptées</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {locationOptions.map(location => (
                  <label key={location} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      name="locations"
                      value={location}
                      checked={availability.locations.includes(location)}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fourchette salariale ({availability.salary.currency})</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                  <input 
                    type="number"
                    name="salary.min"
                    value={availability.salary.min}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                  <input 
                    type="number"
                    name="salary.max"
                    value={availability.salary.max}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Timezone and Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
                <select 
                  name="timezone"
                  value={availability.timezone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  {timezoneOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Langues de travail</label>
                <input 
                  type="text"
                  name="languages"
                  value={availability.languages.join(', ')}
                  onChange={(e) => setAvailability(prev => ({
                    ...prev,
                    languages: e.target.value.split(',').map(lang => lang.trim()).filter(Boolean)
                  }))}
                  placeholder="Français, Anglais, Fon"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button 
                type="submit"
                className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
              >
                Sauvegarder
              </button>
              <button 
                type="button"
                onClick={() => setShowEditForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-lightbulb text-blue-500 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Conseils pour votre disponibilité</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Mettez à jour régulièrement votre statut de disponibilité</li>
              <li>• Soyez précis sur vos préférences de localisation et de travail</li>
              <li>• Indiquez un délai de préavis réaliste</li>
              <li>• Définissez une fourchette salariale compétitive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySection; 