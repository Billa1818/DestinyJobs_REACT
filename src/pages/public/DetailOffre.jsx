import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ShareModal from '../../components/ShareModal';

const DetailOffre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Données simulées de l'offre
  const offre = {
    id: id || 1,
    title: "Développeur Full Stack React/Node.js",
    company: "TechCorp Solutions",
    location: "Cotonou, Bénin",
    type: "CDI",
    salary: "800,000 - 1,200,000 FCFA",
    experience: "3-5 ans",
    education: "Bac+4/5",
    postedDate: "15 Janvier 2024",
    deadline: "15 Février 2024",
    description: `
      <p>Nous recherchons un développeur Full Stack passionné pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants et participerez au développement de solutions web modernes.</p>
      
      <h3>Missions principales :</h3>
      <ul>
        <li>Développer des applications web avec React.js et Node.js</li>
        <li>Concevoir et implémenter des APIs RESTful</li>
        <li>Optimiser les performances des applications</li>
        <li>Collaborer avec l'équipe design et produit</li>
        <li>Participer aux revues de code et à la documentation</li>
      </ul>
      
      <h3>Profil recherché :</h3>
      <ul>
        <li>3-5 ans d'expérience en développement web</li>
        <li>Maîtrise de React.js, Node.js, et JavaScript/TypeScript</li>
        <li>Connaissance des bases de données (MongoDB, PostgreSQL)</li>
        <li>Expérience avec les outils de versioning (Git)</li>
        <li>Capacité à travailler en équipe et à communiquer efficacement</li>
      </ul>
      
      <h3>Avantages :</h3>
      <ul>
        <li>Environnement de travail flexible (remote possible)</li>
        <li>Formation continue et développement des compétences</li>
        <li>Mutuelle santé et prévoyance</li>
        <li>Équipement de travail fourni</li>
        <li>Événements d'entreprise et team building</li>
      </ul>
    `,
    requirements: [
      "Maîtrise de React.js et Node.js",
      "Connaissance des bases de données",
      "Expérience avec Git et les méthodologies agiles",
      "Capacité d'apprentissage et d'adaptation",
      "Excellentes compétences en communication"
    ],
    benefits: [
      "Salaire attractif avec bonus de performance",
      "Télétravail possible",
      "Formation continue",
      "Mutuelle santé",
      "Équipement fourni"
    ],
    companyInfo: {
      name: "TechCorp Solutions",
      description: "Entreprise leader dans le développement de solutions digitales innovantes au Bénin. Nous créons des applications web et mobiles qui transforment les entreprises.",
      logo: "https://via.placeholder.com/100x100",
      website: "https://techcorp.bj",
      employees: "50-100 employés",
      founded: "2018",
      industry: "Technologie"
    },
    contact: {
      email: "recrutement@techcorp.bj",
      phone: "+229 21 30 45 67",
      address: "Zone 4, Cotonou, Bénin"
    }
  };

  const handleApply = () => {
    if (!isLoggedIn) {
      setShowShareModal(true);
      return;
    }
    // Rediriger vers la page d'analyse IA publique
    navigate(`/ia-compatibility/${id}/emploi`);
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour sauvegarder une offre.');
      return;
    }
    alert('Offre sauvegardée dans vos favoris !');
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
              <Link to="/jobs" className="text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                Offres d'emploi
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span className="text-sm font-medium text-gray-500">Détail de l'offre</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header de l'offre */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <img src={offre.companyInfo.logo} alt={offre.company} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{offre.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="flex items-center">
                    <i className="fas fa-building mr-2"></i>
                    {offre.company}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {offre.location}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-2"></i>
                    {offre.type}
                  </span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-medium">
                    {offre.salary}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {offre.experience}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {offre.education}
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
              Description du poste
            </h2>
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: offre.description }}
            />
          </div>

          {/* Exigences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <i className="fas fa-list-check text-fuchsia-600 mr-2"></i>
              Exigences
            </h2>
            <ul className="space-y-2">
              {offre.requirements.map((req, index) => (
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
              {offre.benefits.map((benefit, index) => (
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
                <span className="text-gray-600">Type de contrat</span>
                <span className="font-medium">{offre.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salaire</span>
                <span className="font-medium">{offre.salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expérience</span>
                <span className="font-medium">{offre.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Formation</span>
                <span className="font-medium">{offre.education}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date limite</span>
                <span className="font-medium text-red-600">{offre.deadline}</span>
              </div>
            </div>
          </div>

          {/* Entreprise */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-building text-fuchsia-600 mr-2"></i>
              À propos de l'entreprise
            </h3>
            <div className="space-y-3">
              <img src={offre.companyInfo.logo} alt={offre.companyInfo.name} className="w-16 h-16 rounded-lg object-cover" />
              <h4 className="font-semibold text-gray-900">{offre.companyInfo.name}</h4>
              <p className="text-sm text-gray-600">{offre.companyInfo.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Secteur</span>
                  <span>{offre.companyInfo.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effectifs</span>
                  <span>{offre.companyInfo.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créée en</span>
                  <span>{offre.companyInfo.founded}</span>
                </div>
              </div>
              <a 
                href={offre.companyInfo.website} 
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
                <span className="text-sm">{offre.contact.email}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-gray-400 mr-3"></i>
                <span className="text-sm">{offre.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                <span className="text-sm">{offre.contact.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offres similaires */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <i className="fas fa-briefcase text-fuchsia-600 mr-2"></i>
          Offres similaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-gray-900 mb-2">Développeur Frontend React</h3>
              <p className="text-sm text-gray-600 mb-2">Digital Solutions</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Cotonou</span>
                <span className="text-fuchsia-600 font-medium">600,000 FCFA</span>
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
        title={`Postuler à ${offre.title}`}
      />
    </div>
  );
};

export default DetailOffre; 