import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SolutionRh = () => {
  // États pour les formulaires
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    poste: '',
    secteur: '',
    nombreEmployes: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Options de services RH
  const servicesRh = [
    {
      id: 'insertion',
      title: 'Appui à l\'insertion professionnelle',
      description: 'Accompagnement personnalisé pour l\'insertion professionnelle des candidats',
      icon: 'fas fa-user-plus',
      color: 'bg-blue-500'
    },
    {
      id: 'diffusion',
      title: 'Diffusion des offres humanitaires et développement international',
      description: 'Accès aux opportunités en Afrique dans le secteur humanitaire et du développement',
      icon: 'fas fa-globe-africa',
      color: 'bg-green-500'
    },
    {
      id: 'conseil',
      title: 'Conseil en politique et stratégie RH',
      description: 'Expertise en élaboration et mise en œuvre de stratégies RH',
      icon: 'fas fa-chart-line',
      color: 'bg-purple-500'
    },
    {
      id: 'recrutement',
      title: 'Recrutement et executive search',
      description: 'Recrutement de profils spécialisés et recherche de cadres dirigeants',
      icon: 'fas fa-search',
      color: 'bg-orange-500'
    },
    {
      id: 'gestion',
      title: 'Gestion du personnel et d\'intérim',
      description: 'Solutions complètes de gestion RH et services d\'intérim',
      icon: 'fas fa-users-cog',
      color: 'bg-red-500'
    },
    {
      id: 'etudes',
      title: 'Études et outils RH',
      description: 'Études de marché RH et outils de gestion des ressources humaines',
      icon: 'fas fa-tools',
      color: 'bg-indigo-500'
    },
    {
      id: 'marque',
      title: 'Conseil marque employeur et dialogue social',
      description: 'Développement de la marque employeur et amélioration du dialogue social',
      icon: 'fas fa-handshake',
      color: 'bg-teal-500'
    }
  ];

  // Gérer la sélection des services
  const toggleService = (serviceId) => {
    const newSelection = new Set(selectedServices);
    if (newSelection.has(serviceId)) {
      newSelection.delete(serviceId);
    } else {
      newSelection.add(serviceId);
    }
    setSelectedServices(newSelection);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedServices.size === 0) {
      setError('Veuillez sélectionner au moins un service');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulation d'envoi (remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        entreprise: '',
        poste: '',
        secteur: '',
        nombreEmployes: '',
        message: ''
      });
      setSelectedServices(new Set());
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi du formulaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solutions RH
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos solutions complètes en ressources humaines pour optimiser 
            la gestion de vos talents et développer votre organisation
          </p>
        </div>

        {/* Services disponibles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Nos Services RH
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesRh.map((service) => (
              <div
                key={service.id}
                className={`relative p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedServices.has(service.id)
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => toggleService(service.id)}
              >
                {/* Checkbox */}
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedServices.has(service.id)
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedServices.has(service.id) && (
                      <i className="fas fa-check text-white text-sm"></i>
                    )}
                  </div>
                </div>

                {/* Icône */}
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mb-4`}>
                  <i className={`${service.icon} text-white text-2xl`}></i>
                </div>

                {/* Contenu */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Demander un devis personnalisé
            </h2>
            <p className="text-gray-600">
              Remplissez ce formulaire pour recevoir une proposition adaptée à vos besoins
            </p>
          </div>

          {/* Message de succès */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Votre demande a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="votre.email@exemple.com"
                />
              </div>
              
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+229 XX XX XX XX"
                />
              </div>
            </div>

            {/* Informations entreprise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="entreprise" className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise *
                </label>
                <input
                  type="text"
                  id="entreprise"
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>
              
              <div>
                <label htmlFor="poste" className="block text-sm font-medium text-gray-700 mb-2">
                  Poste *
                </label>
                <input
                  type="text"
                  id="poste"
                  name="poste"
                  value={formData.poste}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Votre poste actuel"
                />
              </div>
            </div>

            {/* Secteur et taille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="secteur" className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité *
                </label>
                <select
                  id="secteur"
                  name="secteur"
                  value={formData.secteur}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un secteur</option>
                  <option value="technologie">Technologie</option>
                  <option value="sante">Santé</option>
                  <option value="education">Éducation</option>
                  <option value="finance">Finance</option>
                  <option value="commerce">Commerce</option>
                  <option value="industrie">Industrie</option>
                  <option value="services">Services</option>
                  <option value="humanitaire">Humanitaire</option>
                  <option value="developpement">Développement international</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="nombreEmployes" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'employés *
                </label>
                <select
                  id="nombreEmployes"
                  name="nombreEmployes"
                  value={formData.nombreEmployes}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une taille</option>
                  <option value="1-10">1-10 employés</option>
                  <option value="11-50">11-50 employés</option>
                  <option value="51-200">51-200 employés</option>
                  <option value="201-500">201-500 employés</option>
                  <option value="500+">Plus de 500 employés</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message / Besoins spécifiques
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Décrivez vos besoins spécifiques, vos objectifs ou toute information supplémentaire..."
              />
            </div>

            {/* Services sélectionnés */}
            {selectedServices.size > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Services sélectionnés ({selectedServices.size}) :
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedServices).map(serviceId => {
                    const service = servicesRh.find(s => s.id === serviceId);
                    return (
                      <span
                        key={serviceId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                      >
                        <i className={`${service.icon} mr-1`}></i>
                        {service.title}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || selectedServices.size === 0}
                className={`px-8 py-3 rounded-lg font-medium text-white transition duration-200 ${
                  loading || selectedServices.size === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-paper-plane mr-2"></i>
                    Demander un devis
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Section informations supplémentaires */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pourquoi choisir nos solutions RH ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-award text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expertise reconnue</h3>
              <p className="text-gray-600">
                Plus de 10 ans d'expérience dans le secteur RH en Afrique de l'Ouest
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Réseau étendu</h3>
              <p className="text-gray-600">
                Large réseau de professionnels et d'entreprises partenaires
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Réactivité</h3>
              <p className="text-gray-600">
                Réponse rapide et accompagnement personnalisé selon vos besoins
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Prêt à optimiser votre gestion RH ?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Contactez-nous dès aujourd'hui pour une consultation gratuite et personnalisée
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
            >
              <i className="fas fa-envelope mr-2"></i>
              Nous contacter
            </Link>
            <a
              href="tel:+22921304567"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
            >
              <i className="fas fa-phone mr-2"></i>
              +229 21 30 45 67
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SolutionRh;
