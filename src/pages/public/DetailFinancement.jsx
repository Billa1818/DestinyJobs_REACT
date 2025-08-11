import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ShareModal from '../../components/ShareModal';

const DetailFinancement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Données simulées du financement
  const financement = {
    id: id || 1,
    title: "Fonds d'Innovation pour Startups Tech",
    organization: "Banque de Développement de l'Afrique de l'Ouest",
    location: "Afrique de l'Ouest",
    amount: "50,000,000 FCFA",
    type: "Prêt à taux préférentiel",
    duration: "5 ans",
    deadline: "30 avril 2024",
    interest: "3%",
    description: `
      <p>Le Fonds d'Innovation pour Startups Tech vise à soutenir les entrepreneurs innovants dans le secteur technologique en Afrique de l'Ouest. Ce programme offre des prêts à taux préférentiel pour financer le développement et l'expansion des startups technologiques.</p>
      
      <h3>Objectifs du programme :</h3>
      <ul>
        <li>Soutenir l'innovation technologique en Afrique de l'Ouest</li>
        <li>Faciliter l'accès au financement pour les startups</li>
        <li>Promouvoir la création d'emplois dans le secteur tech</li>
        <li>Accélérer la transformation digitale de la région</li>
      </ul>
      
      <h3>Critères d'éligibilité :</h3>
      <ul>
        <li>Startup enregistrée dans un pays d'Afrique de l'Ouest</li>
        <li>Modèle économique innovant et viable</li>
        <li>Équipe expérimentée et compétente</li>
        <li>Potentiel de croissance et d'impact</li>
        <li>Plan d'affaires détaillé et réaliste</li>
      </ul>
    `,
    requirements: [
      "Startup enregistrée en Afrique de l'Ouest",
      "Modèle économique innovant",
      "Équipe expérimentée",
      "Potentiel de croissance",
      "Plan d'affaires détaillé"
    ],
    benefits: [
      "Prêt à taux préférentiel (3%)",
      "Durée de remboursement flexible",
      "Accompagnement technique et business",
      "Réseau de mentors et experts",
      "Accès aux marchés régionaux"
    ],
    organizationInfo: {
      name: "Banque de Développement de l'Afrique de l'Ouest",
      description: "Institution financière régionale dédiée au développement économique et social de l'Afrique de l'Ouest.",
      logo: "https://via.placeholder.com/100x100",
      website: "https://www.boade.org",
      contact: "innovation@boade.org"
    }
  };

  const handleApply = () => {
    if (!isLoggedIn) {
      setShowShareModal(true);
      return;
    }
    // Rediriger vers la page d'analyse IA publique
    navigate(`/ia-compatibility/${id}/financement`);
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour sauvegarder un financement.');
      return;
    }
    alert('Financement sauvegardé dans vos favoris !');
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
              <Link to="/financements" className="text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                Financements
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span className="text-sm font-medium text-gray-500">Détail du financement</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header du financement */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-coins text-green-600 text-2xl"></i>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{financement.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="flex items-center">
                    <i className="fas fa-building mr-2"></i>
                    {financement.organization}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {financement.location}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-calendar mr-2"></i>
                    {financement.deadline}
                  </span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {financement.amount}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {financement.type}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {financement.interest} taux
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
              Description du programme
            </h2>
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: financement.description }}
            />
          </div>

          {/* Critères d'éligibilité */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-list-check text-fuchsia-600 mr-2"></i>
              Critères d'éligibilité
            </h2>
            <ul className="space-y-2">
              {financement.requirements.map((req, index) => (
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
              {financement.benefits.map((benefit, index) => (
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
                <span className="font-medium">{financement.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{financement.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux d'intérêt</span>
                <span className="font-medium">{financement.interest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée</span>
                <span className="font-medium">{financement.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date limite</span>
                <span className="font-medium text-red-600">{financement.deadline}</span>
              </div>
            </div>
          </div>

          {/* Organisation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-building text-fuchsia-600 mr-2"></i>
              À propos de l'organisation
            </h3>
            <div className="space-y-3">
              <img src={financement.organizationInfo.logo} alt={financement.organizationInfo.name} className="w-16 h-16 rounded-lg object-cover" />
              <h4 className="font-semibold text-gray-900">{financement.organizationInfo.name}</h4>
              <p className="text-sm text-gray-600">{financement.organizationInfo.description}</p>
              <a 
                href={`mailto:${financement.organizationInfo.contact}`}
                className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-800 text-sm"
              >
                <i className="fas fa-envelope mr-2"></i>
                Contacter l'organisation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Financements similaires */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <i className="fas fa-coins text-fuchsia-600 mr-2"></i>
          Financements similaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">Fonds Innovation PME</h3>
              <p className="text-sm text-gray-600 mb-2">Banque Atlantique</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Bénin</span>
                <span className="text-fuchsia-600 font-medium">25,000,000 FCFA</span>
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
        title={`Postuler à ${financement.title}`}
      />
    </div>
  );
};

export default DetailFinancement; 