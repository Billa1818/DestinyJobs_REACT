import React from 'react';
import { Link } from 'react-router-dom';

const Profil = () => {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-user text-2xl sm:text-3xl text-white"></i>
                </div>
                <button className="absolute -bottom-1 -right-1 bg-white text-fuchsia-600 rounded-full p-2 hover:bg-gray-100 transition duration-200">
                  <i className="fas fa-camera text-xs"></i>
                </button>
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold mb-1">Jean Dupont</h1>
                <p className="text-fuchsia-100 mb-2">Développeur Full Stack | 5 ans d'expérience</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="flex items-center bg-white/20 px-2 py-1 rounded">
                    <i className="fas fa-map-marker-alt mr-1"></i>Cotonou, Bénin
                  </span>
                  <span className="flex items-center bg-white/20 px-2 py-1 rounded">
                    <i className="fas fa-envelope mr-1"></i>jean.dupont@email.com
                  </span>
                  <span className="flex items-center bg-white/20 px-2 py-1 rounded">
                    <i className="fas fa-phone mr-1"></i>+229 XX XX XX XX
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/candidat/editer-profil" className="bg-white text-fuchsia-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-200">
                <i className="fas fa-edit mr-2"></i>Modifier profil
              </Link>
              <button className="bg-fuchsia-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-fuchsia-900 transition duration-200">
                <i className="fas fa-download mr-2"></i>Télécharger CV
              </button>
              <button className="bg-transparent border border-white text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition duration-200">
                <i className="fas fa-share mr-2"></i>Partager profil
              </button>
            </div>
          </div>

          {/* Profile Completion Alert */}
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-orange-400"></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-orange-700">
                  Votre profil est complété à <strong>75%</strong>. Ajoutez une photo et vos compétences pour améliorer votre visibilité.
                </p>
              </div>
              <button className="text-orange-400 hover:text-orange-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-user-circle mr-2 text-fuchsia-600"></i>
                À propos
              </h3>
              <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
                <i className="fas fa-edit"></i>
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Développeur Full Stack passionné avec 5 ans d'expérience dans le développement d'applications web modernes. 
                Expertise en React, Node.js, et Python. Toujours à la recherche de nouveaux défis techniques et 
                d'opportunités pour contribuer à des projets innovants. Fort d'une expérience en startup et en entreprise, 
                je maîtrise les méthodologies agiles et le travail en équipe.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-fuchsia-600">5+</div>
                  <div className="text-sm text-gray-500">Années d'expérience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-500">Projets réalisés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-500">Technologies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-500">Langues parlées</div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
                Expérience professionnelle
              </h3>
              <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-fuchsia-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Développeur Full Stack Senior</h4>
                    <p className="text-sm text-gray-600">TechCorp • Cotonou, Bénin</p>
                  </div>
                  <span className="text-sm text-gray-500">2022 - Présent</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Développement d'applications web modernes avec React, Node.js et MongoDB. 
                  Gestion d'équipe de 3 développeurs et mise en place de bonnes pratiques.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded">Node.js</span>
                  <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded">MongoDB</span>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Développeur Frontend</h4>
                    <p className="text-sm text-gray-600">StartupBJ • Porto-Novo, Bénin</p>
                  </div>
                  <span className="text-sm text-gray-500">2020 - 2022</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Développement d'interfaces utilisateur avec Vue.js et intégration d'APIs REST.
                  Collaboration avec l'équipe design pour créer des expériences utilisateur optimales.
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Vue.js</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">JavaScript</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">CSS3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-graduation-cap mr-2 text-fuchsia-600"></i>
                Formation
              </h3>
              <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Master en Informatique</h4>
                    <p className="text-sm text-gray-600">Université d'Abomey-Calavi • Bénin</p>
                  </div>
                  <span className="text-sm text-gray-500">2018 - 2020</span>
                </div>
                <p className="text-sm text-gray-700">
                  Spécialisation en développement web et applications mobiles. 
                  Mémoire sur l'optimisation des performances web.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Licence en Informatique</h4>
                    <p className="text-sm text-gray-600">Université d'Abomey-Calavi • Bénin</p>
                  </div>
                  <span className="text-sm text-gray-500">2015 - 2018</span>
                </div>
                <p className="text-sm text-gray-700">
                  Formation générale en informatique avec focus sur la programmation 
                  et les bases de données.
                </p>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-code mr-2 text-fuchsia-600"></i>
                Compétences
              </h3>
              <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Langages de programmation</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-800 text-sm rounded-full">JavaScript</span>
                  <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-800 text-sm rounded-full">Python</span>
                  <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-800 text-sm rounded-full">PHP</span>
                  <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-800 text-sm rounded-full">Java</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Frameworks & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">React</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Vue.js</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Node.js</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Laravel</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Django</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bases de données</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">MySQL</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">MongoDB</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">PostgreSQL</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Redis</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Outils & Méthodologies</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Git</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Docker</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Agile</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">Scrum</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Profile Stats */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
              Statistiques du profil
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vues du profil</span>
                <span className="font-semibold text-fuchsia-600">48</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Candidatures envoyées</span>
                <span className="font-semibold text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Entretiens obtenus</span>
                <span className="font-semibold text-orange-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Offres sauvegardées</span>
                <span className="font-semibold text-purple-600">8</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-address-book mr-2 text-fuchsia-600"></i>
              Informations de contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="fas fa-envelope text-gray-400 mr-3"></i>
                <span className="text-gray-700">jean.dupont@email.com</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-gray-400 mr-3"></i>
                <span className="text-gray-700">+229 XX XX XX XX</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                <span className="text-gray-700">Cotonou, Bénin</span>
              </div>
              <div className="flex items-center">
                <i className="fab fa-linkedin text-gray-400 mr-3"></i>
                <span className="text-gray-700">linkedin.com/in/jeandupont</span>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-language mr-2 text-fuchsia-600"></i>
              Langues
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Français</span>
                <span className="text-sm text-gray-500">Langue maternelle</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Anglais</span>
                <span className="text-sm text-gray-500">Courant</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fon</span>
                <span className="text-sm text-gray-500">Intermédiaire</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profil;
