import api from './api';

class LocationService {
  // Récupérer la liste de tous les pays
  static async getCountries() {
    try {
      const response = await api.get('/api/auth/countries/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      throw error;
    }
  }

  // Récupérer la liste des régions d'un pays spécifique
  static async getRegionsByCountry(countryId) {
    try {
      const response = await api.get(`/api/auth/countries/${countryId}/regions/`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des régions du pays ${countryId}:`, error);
      throw error;
    }
  }

  // Récupérer un pays par ID
  static async getCountryById(countryId) {
    try {
      const countries = await this.getCountries();
      return countries.find(country => country.id === countryId);
    } catch (error) {
      console.error(`Erreur lors de la récupération du pays ${countryId}:`, error);
      return null;
    }
  }

  // Récupérer une région par ID
  static async getRegionById(countryId, regionId) {
    try {
      const regions = await this.getRegionsByCountry(countryId);
      return regions.find(region => region.id === regionId);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la région ${regionId}:`, error);
      return null;
    }
  }

  // Formater les données pour l'affichage
  static formatCountryForDisplay(country) {
    if (!country) return null;
    return {
      id: country.id,
      name: country.name,
      code: country.code,
      displayName: `${country.name} (${country.code})`
    };
  }

  static formatRegionForDisplay(region) {
    if (!region) return null;
    return {
      id: region.id,
      name: region.name,
      country: region.country,
      displayName: `${region.name}, ${region.country?.name || ''}`
    };
  }
}

export default LocationService; 