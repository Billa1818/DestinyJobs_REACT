import React, { useState, useEffect } from 'react';
import profileService from '../../services/profileService';

const LocationManager = ({ locationData, onLocationChange, countries, regions, onRegionsLoad }) => {
  const [localCountries, setLocalCountries] = useState(countries || []);
  const [localRegions, setLocalRegions] = useState(regions || []);

  useEffect(() => {
    if (!localCountries.length) {
      loadCountries();
    }
  }, []);

  useEffect(() => {
    if (locationData.country_id && !localRegions.length) {
      loadRegions(locationData.country_id);
    }
  }, [locationData.country_id]);

  const loadCountries = async () => {
    try {
      const countriesData = await profileService.getCountries();
      setLocalCountries(countriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    }
  };

  const loadRegions = async (countryId) => {
    try {
      const regionsData = await profileService.getRegions(countryId);
      setLocalRegions(regionsData);
      if (onRegionsLoad) {
        onRegionsLoad(regionsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des régions:', error);
      setLocalRegions([]);
    }
  };

  const handleCountryChange = (countryId) => {
    onLocationChange('country_id', countryId);
    onLocationChange('region_id', ''); // Réinitialiser la région
    setLocalRegions([]); // Vider les régions
    
    if (countryId) {
      loadRegions(countryId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pays */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pays <span className="text-red-500">*</span>
        </label>
        <select
          value={locationData.country_id || ''}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
        >
          <option value="">Sélectionner un pays</option>
          {localCountries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Région */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Région
        </label>
        <select
          value={locationData.region_id || ''}
          onChange={(e) => onLocationChange('region_id', e.target.value)}
          disabled={!locationData.country_id}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Sélectionner une région</option>
          {localRegions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ville et Code postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <input
            type="text"
            value={locationData.city || ''}
            onChange={(e) => onLocationChange('city', e.target.value)}
            placeholder="Ex: Paris"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code postal
          </label>
          <input
            type="text"
            value={locationData.postal_code || ''}
            onChange={(e) => onLocationChange('postal_code', e.target.value)}
            placeholder="Ex: 75001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse complète
        </label>
        <textarea
          value={locationData.address || ''}
          onChange={(e) => onLocationChange('address', e.target.value)}
          placeholder="Ex: 123 Rue de la Paix"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
        />
      </div>

      {/* Information */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Information</h3>
            <p className="text-sm text-blue-700">
              Votre localisation aide les recruteurs à mieux vous localiser et à vous proposer des opportunités pertinentes dans votre région.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManager; 