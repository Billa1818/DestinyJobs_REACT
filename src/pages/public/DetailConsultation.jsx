import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ShareModal from '../../components/ShareModal';

const DetailConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Données simulées de la consultation
  const consultation = {
    id: id || 1,
    title: "Expertise en transformation digitale pour PME",
    client: "Innovation Hub Bénin",
    location: "Cotonou, Bénin",
    type: "Consultation stratégique",
    budget: "2,000,000 - 3,500,000 FCFA",
    duration: "3-6 mois",
    experience: "5+ ans",
    postedDate: "12 Janvier 2024",
    deadline: "28 Janvier 2024",
    description: `
      <p>Nous recherchons un expert en transformation digitale pour accompagner notre PME dans sa transition numérique. Cette mission vise à moderniser nos processus et à améliorer notre efficacité opérationnelle.</p>
      
      <h3>Contexte du projet :</h3>
      <p>Notre entreprise, spécialisée dans le commerce de détail, souhaite digitaliser ses processus pour améliorer la gestion des stocks, la relation client et les ventes en ligne.</p>
      
      <h3>Objectifs de la mission :</h3>
      <ul>
        <li>Audit de l'existant et identification des besoins</li>
        <li>Définition d'une stratégie de transformation digitale</li>
        <li>Accompagnement dans la mise en œuvre des solutions</li>
        <li>Formation des équipes aux nouveaux outils</li>
        <li>Suivi et optimisation des processus</li>
      </ul>
      
      <h3>Livrables attendus :</h3>
      <ul>
        <li>Rapport d'audit détaillé</li>
        <li>Roadmap de transformation sur 12 mois</li>
        <li>Recommandations techniques et organisationnelles</li>
        <li>Plan de formation des équipes</li>
        <li>Accompagnement à la mise en œuvre</li>
      </ul>
    `,
    requirements: [
      "Expertise en transformation digitale",
      "Expérience avec les PME africaines",
      "Connaissance des outils de gestion",
      "Capacité de formation et d'accompagnement",
      "Excellentes compétences en communication"
    ],
    deliverables: [
      "Rapport d'audit complet",
      "Stratégie de transformation",
      "Plan de mise en œuvre",
      "Formation des équipes",
      "Suivi post-déploiement"
    ],
    clientInfo: {
      name: "Innovation Hub Bénin",
      description: "PME leader dans le commerce de détail au Bénin, spécialisée dans la vente de produits technologiques et accessoires. Nous servons plus de 10,000 clients par mois.",
      logo: "https://via.placeholder.com/100x100",
      website: "https://innovationhub.bj",
      employees: "25-50 employés",
      founded: "2015",
      industry: "Commerce de détail"
    },
    contact: {
      email: "consultation@innovationhub.bj",
      phone: "+229 21 45 67 89",
      address: "Zone 3, Cotonou, Bénin"
    }
  };

  const handleApply = () => {
    if (!isLoggedIn) {
      setShowShareModal(true);
      return;
    }
    // Rediriger vers la page d'analyse IA publique
    navigate(`/ia-compatibility/${id}/consultation`);
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour sauvegarder une consultation.');
      return;
    }
    alert('Consultation sauvegardée dans vos favoris !');
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
              <Link to="/consultations" className="text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                Consultations
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span className="text-sm font-medium text-gray-500">Détail de la consultation</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header de la consultation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <img src={consultation.clientInfo.logo} alt={consultation.client} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{consultation.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="flex items-center">
                    <i className="fas fa-building mr-2"></i>
                    {consultation.client}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {consultation.location}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-briefcase mr-2"></i>
                    {consultation.type}
                  </span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-medium">
                    {consultation.budget}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {consultation.duration}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {consultation.experience}
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
              Description de la mission
            </h2>
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: consultation.description }}
            />
          </div>

          {/* Exigences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-list-check text-fuchsia-600 mr-2"></i>
              Profil recherché
            </h2>
            <ul className="space-y-2">
              {consultation.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Livrables */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-tasks text-fuchsia-600 mr-2"></i>
              Livrables attendus
            </h2>
            <ul className="space-y-2">
              {consultation.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-clipboard-check text-blue-500 mt-1 mr-3 flex-shrink-0"></i>
                  <span className="text-gray-700">{deliverable}</span>
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
                <span className="text-gray-600">Type de mission</span>
                <span className="font-medium">{consultation.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget</span>
                <span className="font-medium">{consultation.budget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Durée</span>
                <span className="font-medium">{consultation.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expérience</span>
                <span className="font-medium">{consultation.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date limite</span>
                <span className="font-medium text-red-600">{consultation.deadline}</span>
              </div>
            </div>
          </div>

          {/* Client */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-user-tie text-fuchsia-600 mr-2"></i>
              À propos du client
            </h3>
            <div className="space-y-3">
              <img src={consultation.clientInfo.logo} alt={consultation.clientInfo.name} className="w-16 h-16 rounded-lg object-cover" />
              <h4 className="font-semibold text-gray-900">{consultation.clientInfo.name}</h4>
              <p className="text-sm text-gray-600">{consultation.clientInfo.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Secteur</span>
                  <span>{consultation.clientInfo.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effectifs</span>
                  <span>{consultation.clientInfo.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créée en</span>
                  <span>{consultation.clientInfo.founded}</span>
                </div>
              </div>
              <a 
                href={consultation.clientInfo.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-800 text-sm"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                Visiter le site web
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-envelope text-fuchsia-600 mr-2"></i>
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="fas fa-envelope text-gray-400 mr-3"></i>
                <span className="text-sm">{consultation.contact.email}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-gray-400 mr-3"></i>
                <span className="text-sm">{consultation.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                <span className="text-sm">{consultation.contact.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultations similaires */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <i className="fas fa-handshake text-fuchsia-600 mr-2"></i>
          Consultations similaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">Audit marketing digital</h3>
              <p className="text-sm text-gray-600 mb-2">Marketing Pro Bénin</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Cotonou</span>
                <span className="text-fuchsia-600 font-medium">1,500,000 FCFA</span>
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
        title={`Postuler à ${consultation.title}`}
      />
    </div>
  );
};

export default DetailConsultation; 