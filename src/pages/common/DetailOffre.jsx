import React from 'react';
import { Link } from 'react-router-dom';

const DetailOffre = () => {
  return (
    <main className="flex-1 bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 py-4">
            <Link to="/candidat" className="hover:text-fuchsia-600 transition duration-200">Accueil</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link to="/candidat/offre" className="hover:text-fuchsia-600 transition duration-200">Offres d'emploi</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-gray-900">Développeur Full Stack</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Job Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-code text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Développeur Full Stack</h1>
                      <p className="text-blue-600 font-medium">TechCorp Solutions</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span>Cotonou, Bénin</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-clock mr-2"></i>
                      <span>Temps plein</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar mr-2"></i>
                      <span>Publié il y a 2 jours</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    Actif
                  </span>
                  <button className="text-gray-400 hover:text-fuchsia-600">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>

              {/* Job Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">800K - 1.2M</div>
                  <div className="text-sm text-gray-600">FCFA par mois</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">3-5 ans</div>
                  <div className="text-sm text-gray-600">Expérience requise</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Master</div>
                  <div className="text-sm text-gray-600">Niveau d'études</div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
                Description du poste
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe 
                  de développement. Vous serez responsable du développement d'applications web modernes 
                  et de la maintenance de nos systèmes existants.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vous travaillerez en étroite collaboration avec les équipes produit, design et QA 
                  pour créer des solutions innovantes et performantes.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Responsabilités :</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Développer des applications web complètes (frontend et backend)</li>
                  <li>Concevoir et implémenter des architectures scalables</li>
                  <li>Optimiser les performances des applications</li>
                  <li>Collaborer avec les équipes cross-fonctionnelles</li>
                  <li>Participer aux revues de code et à la documentation</li>
                </ul>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-check-circle mr-2 text-fuchsia-600"></i>
                Profil recherché
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Compétences techniques :</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Maîtrise de JavaScript/TypeScript</li>
                    <li>Expérience avec React, Vue.js ou Angular</li>
                    <li>Connaissance de Node.js et Express</li>
                    <li>Base de données SQL et NoSQL</li>
                    <li>Git et méthodologies Agile</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Expérience :</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Minimum 3 ans d'expérience en développement web</li>
                    <li>Projets d'applications web complexes</li>
                    <li>Travail en équipe et gestion de projet</li>
                    <li>Connaissance des bonnes pratiques de développement</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Qualités personnelles :</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Autonomie et capacité d'apprentissage</li>
                    <li>Esprit d'équipe et communication</li>
                    <li>Résolution de problèmes</li>
                    <li>Curiosité technologique</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-gift mr-2 text-fuchsia-600"></i>
                Avantages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <i className="fas fa-home text-green-600 mr-3"></i>
                  <div>
                    <h3 className="font-medium text-gray-900">Télétravail</h3>
                    <p className="text-sm text-gray-600">2 jours par semaine</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <i className="fas fa-graduation-cap text-blue-600 mr-3"></i>
                  <div>
                    <h3 className="font-medium text-gray-900">Formation</h3>
                    <p className="text-sm text-gray-600">Budget formation annuel</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <i className="fas fa-heart text-red-600 mr-3"></i>
                  <div>
                    <h3 className="font-medium text-gray-900">Santé</h3>
                    <p className="text-sm text-gray-600">Mutuelle complète</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <i className="fas fa-calendar-alt text-purple-600 mr-3"></i>
                  <div>
                    <h3 className="font-medium text-gray-900">Congés</h3>
                    <p className="text-sm text-gray-600">25 jours + RTT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Apply Button */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-paper-plane mr-2 text-fuchsia-600"></i>
                Postuler maintenant
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Soumettez votre candidature pour ce poste avant la date limite.
              </p>
              <button className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium">
                <i className="fas fa-edit mr-2"></i>Commencer ma candidature
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Temps estimé : 15-20 minutes
              </p>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-building mr-2 text-fuchsia-600"></i>
                À propos de l'entreprise
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                  <span className="text-gray-700 text-sm">Cotonou, Bénin</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-users text-gray-400 mr-3"></i>
                  <span className="text-gray-700 text-sm">50-100 employés</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-globe text-gray-400 mr-3"></i>
                  <span className="text-gray-700 text-sm">www.techcorp.bj</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-industry text-gray-400 mr-3"></i>
                  <span className="text-gray-700 text-sm">Technologie</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                TechCorp Solutions est une entreprise innovante spécialisée dans le développement 
                de solutions technologiques pour les entreprises africaines.
              </p>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-lightbulb mr-2 text-fuchsia-600"></i>
                Emplois similaires
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                  <h4 className="font-medium text-gray-900 text-sm">Développeur Frontend</h4>
                  <p className="text-xs text-gray-500 mb-2">Digital Solutions</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">600K FCFA</span>
                    <span className="text-xs text-gray-400">Il y a 1j</span>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                  <h4 className="font-medium text-gray-900 text-sm">Développeur Backend</h4>
                  <p className="text-xs text-gray-500 mb-2">InnovTech</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">900K FCFA</span>
                    <span className="text-xs text-gray-400">Il y a 3j</span>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                  <h4 className="font-medium text-gray-900 text-sm">DevOps Engineer</h4>
                  <p className="text-xs text-gray-500 mb-2">CloudTech</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">1.1M FCFA</span>
                    <span className="text-xs text-gray-400">Il y a 5j</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailOffre;