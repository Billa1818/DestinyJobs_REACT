import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
  // Données simulées des offres par catégorie
  const categories = {
    emplois: {
      title: "Offres d'emploi",
      icon: "fas fa-briefcase",
      color: "bg-blue-500",
      link: "/jobs",
      offers: [
        {
          id: 1,
          title: "Développeur Full Stack React/Node.js",
          company: "TechCorp Solutions",
          location: "Cotonou, Bénin",
          salary: "800,000 - 1,200,000 FCFA",
          type: "CDI",
          postedDate: "Il y a 2 jours",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 2,
          title: "Chef de projet digital",
          company: "Digital Agency Bénin",
          location: "Porto-Novo, Bénin",
          salary: "1,200,000 - 1,800,000 FCFA",
          type: "CDI",
          postedDate: "Il y a 3 jours",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 3,
          title: "Marketing Manager",
          company: "Innovation Hub",
          location: "Cotonou, Bénin",
          salary: "900,000 - 1,500,000 FCFA",
          type: "CDI",
          postedDate: "Il y a 5 jours",
          logo: "https://via.placeholder.com/60x60"
        }
      ]
    },
    bourses: {
      title: "Bourses d'études",
      icon: "fas fa-graduation-cap",
      color: "bg-green-500",
      link: "/bourses",
      offers: [
        {
          id: 1,
          title: "Bourse Master en Informatique",
          institution: "Université d'Abomey-Calavi",
          location: "Cotonou, Bénin",
          amount: "500,000 FCFA/an",
          duration: "2 ans",
          postedDate: "Il y a 1 jour",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 2,
          title: "Bourse Doctorat en Économie",
          institution: "Université de Parakou",
          location: "Parakou, Bénin",
          amount: "800,000 FCFA/an",
          duration: "3 ans",
          postedDate: "Il y a 4 jours",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 3,
          title: "Bourse Licence en Marketing",
          institution: "ESAE",
          location: "Cotonou, Bénin",
          amount: "300,000 FCFA/an",
          duration: "3 ans",
          postedDate: "Il y a 6 jours",
          logo: "https://via.placeholder.com/60x60"
        }
      ]
    },
    financements: {
      title: "Financements",
      icon: "fas fa-money-bill-wave",
      color: "bg-purple-500",
      link: "/financements",
      offers: [
        {
          id: 1,
          title: "Fonds d'investissement pour startups",
          institution: "Fonds National de Développement",
          location: "Bénin",
          amount: "5,000,000 - 50,000,000 FCFA",
          type: "Subvention",
          postedDate: "Il y a 2 jours",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 2,
          title: "Prêt PME à taux préférentiel",
          institution: "Banque de l'Habitat du Bénin",
          location: "Bénin",
          amount: "10,000,000 - 100,000,000 FCFA",
          type: "Prêt",
          postedDate: "Il y a 5 jours",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 3,
          title: "Microcrédit pour entrepreneurs",
          institution: "FECECAM",
          location: "Bénin",
          amount: "500,000 - 5,000,000 FCFA",
          type: "Microcrédit",
          postedDate: "Il y a 1 semaine",
          logo: "https://via.placeholder.com/60x60"
        }
      ]
    },
    consultations: {
      title: "Consultations",
      icon: "fas fa-handshake",
      color: "bg-orange-500",
      link: "/consultations",
      offers: [
        {
          id: 1,
          title: "Expertise en transformation digitale",
          client: "Innovation Hub Bénin",
          location: "Cotonou, Bénin",
          budget: "2,000,000 - 3,500,000 FCFA",
          duration: "3-6 mois",
          postedDate: "Il y a 1 jour",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 2,
          title: "Audit marketing digital",
          client: "Marketing Pro Bénin",
          location: "Porto-Novo, Bénin",
          budget: "1,500,000 - 2,500,000 FCFA",
          duration: "2-4 mois",
          postedDate: "Il y a 3 jours",
          logo: "https://via.placeholder.com/60x60"
        },
        {
          id: 3,
          title: "Optimisation des processus RH",
          client: "TechCorp Solutions",
          location: "Cotonou, Bénin",
          budget: "1,800,000 - 2,800,000 FCFA",
          duration: "4-6 mois",
          postedDate: "Il y a 5 jours",
          logo: "https://via.placeholder.com/60x60"
        }
      ]
    }
  };

  return (
      <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Trouvez votre voie avec Destiny Jobs
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Découvrez des opportunités d'emploi, de formation, de financement et de consultation 
            pour faire avancer votre carrière et vos projets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-lg"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Créer un compte
            </Link>
            <Link 
              to="/jobs" 
              className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-lg"
            >
              <i className="fas fa-search mr-2"></i>
              Voir les offres
            </Link>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { number: "2,500+", label: "Offres d'emploi", icon: "fas fa-briefcase" },
          { number: "150+", label: "Bourses d'études", icon: "fas fa-graduation-cap" },
          { number: "80+", label: "Financements", icon: "fas fa-money-bill-wave" },
          { number: "200+", label: "Consultations", icon: "fas fa-handshake" }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-fuchsia-600 mb-2">
              <i className={`${stat.icon} mr-2`}></i>
              {stat.number}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Offres par catégorie */}
      {Object.entries(categories).map(([key, category]) => (
        <div key={key} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.color} text-white`}>
                <i className={`${category.icon} text-xl`}></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
            </div>
            <Link 
              to={category.link}
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
            >
              Voir plus
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.offers.map((offer) => (
              <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-3">
                  <img src={offer.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {offer.company || offer.institution || offer.client}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                      <span className="flex items-center">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {offer.location}
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-clock mr-1"></i>
                        {offer.postedDate}
                      </span>
                    </div>
                    
                    {/* Informations spécifiques selon la catégorie */}
                    {key === 'emplois' && (
                      <div className="space-y-1">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {offer.salary}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          {offer.type}
                        </span>
                      </div>
                    )}
                    
                    {key === 'bourses' && (
                      <div className="space-y-1">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {offer.amount}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          {offer.duration}
                        </span>
                      </div>
                    )}
                    
                    {key === 'financements' && (
                      <div className="space-y-1">
                        <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {offer.amount}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          {offer.type}
                        </span>
                      </div>
                    )}
                    
                    {key === 'consultations' && (
                      <div className="space-y-1">
                        <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          {offer.budget}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          {offer.duration}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={`${category.link}/${offer.id}`}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-sm font-medium text-center block"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-xl mb-6 opacity-90">
          Rejoignez notre communauté et accédez à toutes nos opportunités
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-lg"
          >
            <i className="fas fa-user-plus mr-2"></i>
            Créer un compte gratuit
          </Link>
          <Link 
            to="/abonnements" 
            className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-lg"
          >
            <i className="fas fa-crown mr-2"></i>
            Voir nos abonnements
          </Link>
        </div>
      </div>

      {/* Blog Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            <i className="fas fa-newspaper text-fuchsia-600 mr-3"></i>
            Derniers articles du blog
          </h2>
          <Link 
            to="/blog"
            className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
          >
            Voir tous les articles
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 1,
              title: "Les meilleures pratiques de recrutement en 2024",
              excerpt: "Découvrez comment optimiser votre processus de recrutement...",
              author: "Marie Dupont",
              date: "15 Jan 2024",
              image: "https://via.placeholder.com/300x200"
            },
            {
              id: 2,
              title: "Comment réussir votre entretien d'embauche",
              excerpt: "Conseils pratiques pour impressionner vos recruteurs...",
              author: "Jean Martin",
              date: "12 Jan 2024",
              image: "https://via.placeholder.com/300x200"
            },
            {
              id: 3,
              title: "Les métiers du digital en pleine expansion",
              excerpt: "Focus sur les carrières les plus prometteuses...",
              author: "Sophie Laurent",
              date: "10 Jan 2024",
              image: "https://via.placeholder.com/300x200"
            }
          ].map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              <img src={article.image} alt={article.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
                <Link 
                  to={`/blog/article/${article.id}`}
                  className="text-fuchsia-600 hover:text-fuchsia-800 text-sm font-medium mt-3 inline-block"
                >
                  Lire la suite →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section de test des protections */}
      <section className="py-16">
        
      </section>
      </div>
  );
};

export default Home; 