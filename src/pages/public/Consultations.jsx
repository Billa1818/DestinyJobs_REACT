import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const consultationsData = await dataService.getConsultations({ isActive: true });
        setConsultations(consultationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des consultations:', error);
        setError('Erreur lors du chargement des consultations');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'Stratégie', label: 'Stratégie' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'RH', label: 'Ressources Humaines' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Technologie', label: 'Technologie' }
  ];

  const locations = [
    { value: '', label: 'Tous les lieux' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Porto-Novo', label: 'Porto-Novo' },
    { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
    { value: 'Parakou', label: 'Parakou' },
    { value: 'Remote', label: 'Télétravail' },
    { value: 'Hybride', label: 'Hybride' }
  ];

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || consultation.category === selectedCategory;
    const matchesLocation = !selectedLocation || consultation.location?.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des consultations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-handshake text-fuchsia-600 mr-3"></i>
            Consultations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez des opportunités de consultation et d'expertise dans divers domaines. 
            Trouvez des missions qui correspondent à vos compétences et à votre expérience.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher une consultation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
          
          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              {locations.map(location => (
                <option key={location.value} value={location.value}>{location.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Consultations disponibles ({filteredConsultations.length})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Trier par :</span>
              <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                <option>Plus récentes</option>
                <option>Budget élevé</option>
                <option>Durée courte</option>
              </select>
            </div>
          </div>

          {filteredConsultations.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune consultation trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-handshake text-fuchsia-600 text-xl"></i>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            <Link to={`/consultations/${consultation.id}`} className="hover:text-fuchsia-600 transition duration-200">
                              {consultation.title}
                            </Link>
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <i className="fas fa-building mr-2"></i>
                              {consultation.client}
                            </span>
                            <span className="flex items-center">
                              <i className="fas fa-map-marker-alt mr-2"></i>
                              {consultation.location || 'Non précisé'}
                            </span>
                            <span className="flex items-center">
                              <i className="fas fa-calendar mr-2"></i>
                              {consultation.createdAt ? new Date(consultation.createdAt).toLocaleDateString('fr-FR') : 'Date non précisée'}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{consultation.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-medium">
                              {consultation.budget || 'Budget non précisé'}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {consultation.duration || 'Durée non précisée'}
                            </span>
                            {consultation.requirements && consultation.requirements.length > 0 && (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {consultation.requirements.length} compétence(s) requise(s)
                              </span>
                            )}
                            {consultation.category && (
                              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                {consultation.category}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          {consultation.deadline && (
                            <span className="text-sm text-red-600 font-medium">
                              <i className="fas fa-clock mr-1"></i>
                              Limite : {new Date(consultation.deadline).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                          <Link 
                            to={`/consultations/${consultation.id}`}
                            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm font-medium"
                          >
                            Voir les détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Vous êtes consultant ?</h2>
        <p className="text-lg mb-6 opacity-90">
          Rejoignez notre plateforme et trouvez des missions qui correspondent à vos compétences
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Créer un compte consultant
          </Link>
          <Link 
            to="/contact" 
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Consultations; 