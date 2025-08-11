import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ShareModal from '../../components/ShareModal';

const DetailBourse = () => {
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Données simulées de la bourse
  const bourse = {
    id: id || 1,
    title: "Bourse Excellence France",
    institution: "Ambassade de France au Bénin",
    location: "France",
    amount: "15,000€",
    duration: "2 ans",
    deadline: "15 mars 2024",
    coverage: "100%",
    description: `
      <p>Le programme de bourses d'excellence de l'Ambassade de France au Bénin vise à soutenir les étudiants béninois les plus méritants dans leurs études supérieures en France. Cette bourse couvre l'intégralité des frais de scolarité, l'hébergement et une allocation mensuelle.</p>
      
      <h3>Avantages de la bourse :</h3>
      <ul>
        <li>Frais de scolarité entièrement pris en charge</li>
        <li>Hébergement en résidence universitaire</li>
        <li>Allocation mensuelle de 1,200€</li>
        <li>Assurance santé complète</li>
        <li>Formation linguistique intensive</li>
        <li>Accompagnement administratif</li>
      </ul>
      
      <h3>Critères d'éligibilité :</h3>
      <ul>
        <li>Être de nationalité béninoise</li>
        <li>Avoir un excellent dossier académique</li>
        <li>Maîtriser le français (niveau B2 minimum)</li>
        <li>Avoir un projet d'études cohérent</li>
        <li>Être âgé de moins de 25 ans</li>
      </ul>
    `,
    requirements: [
      "Nationalité béninoise",
      "Excellent dossier académique",
      "Maîtrise du français (B2 minimum)",
      "Projet d'études cohérent",
      "Âge maximum 25 ans"
    ],
    benefits: [
      "Frais de scolarité pris en charge",
      "Hébergement en résidence universitaire",
      "Allocation mensuelle de 1,200€",
      "Assurance santé complète",
      "Formation linguistique intensive"
    ],
    institutionInfo: {
      name: "Ambassade de France au Bénin",
      description: "L'Ambassade de France au Bénin soutient l'excellence académique et favorise les échanges universitaires entre la France et le Bénin.",
      logo: "https://via.placeholder.com/100x100",
      website: "https://bj.ambafrance.org",
      contact: "cooperation.culturelle@ambafrance-bj.org"
    }
  };

  const handleApply = () => {
    setShowShareModal(true);
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour sauvegarder une bourse.');
      return;
    }
    alert('Bourse sauvegardée dans vos favoris !');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-fuchsia-600">
              <i className="fas fa-home mr-2"></i>
              Accueil
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <Link to="/bourses" className="text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                Bourses
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span className="text-sm font-medium text-gray-500">Détail de la bourse</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header de la bourse */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-blue-600 text-2xl"></i>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{bourse.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="flex items-center">
                    <i className="fas fa-university mr-2"></i>
                    {bourse.institution}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {bourse.location}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-calendar mr-2"></i>
                    {bourse.deadline}
                  </span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {bourse.amount}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {bourse.duration}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {bourse.coverage} couverture
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col space-y-3 mt-4 lg:mt-0 lg:ml-6">
            <button
              onClick={handleApply}
              className="bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Postuler maintenant
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-heart mr-2"></i>
                Sauvegarder
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-share mr-2"></i>
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-file-alt text-fuchsia-600 mr-2"></i>
              Description de la bourse
            </h2>
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: bourse.description }}
            />
          </div>

          {/* Critères d'éligibilité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-list-check text-fuchsia-600 mr-2"></i>
              Critères d'éligibilité
            </h2>
            <ul className="space-y-2">
              {bourse.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Avantages */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-gift text-fuchsia-600 mr-2"></i>
              Avantages
            </h2>
            <ul className="space-y-2">
              {bourse.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-star text-yellow-500 mt-1 mr-3 flex-shrink-0"></i>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations rapides */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-info-circle text-fuchsia-600 mr-2"></i>
              Informations rapides
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant</span>
                <span className="font-medium">{bourse.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée</span>
                <span className="font-medium">{bourse.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Couverture</span>
                <span className="font-medium">{bourse.coverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date limite</span>
                <span className="font-medium text-red-600">{bourse.deadline}</span>
              </div>
            </div>
          </div>

          {/* Institution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-university text-fuchsia-600 mr-2"></i>
              À propos de l'institution
            </h3>
            <div className="space-y-3">
              <img src={bourse.institutionInfo.logo} alt={bourse.institutionInfo.name} className="w-16 h-16 rounded-lg object-cover" />
              <h4 className="font-semibold text-gray-900">{bourse.institutionInfo.name}</h4>
              <p className="text-sm text-gray-600">{bourse.institutionInfo.description}</p>
              <a 
                href={`mailto:${bourse.institutionInfo.contact}`}
                className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-800 text-sm"
              >
                <i className="fas fa-envelope mr-2"></i>
                Contacter l'institution
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bourses similaires */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <i className="fas fa-graduation-cap text-fuchsia-600 mr-2"></i>
          Bourses similaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">Bourse Master Allemagne</h3>
              <p className="text-sm text-gray-600 mb-2">DAAD</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Allemagne</span>
                <span className="text-fuchsia-600 font-medium">12,000€</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de partage */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        isLoggedIn={isLoggedIn}
        title={`Postuler à ${bourse.title}`}
      />
    </div>
  );
};

export default DetailBourse; 