import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Breadcrumb */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                <i className="fas fa-home mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                Accueil
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <i className="fas fa-chevron-right text-gray-400 mx-1 sm:mx-2 text-xs"></i>
                <span className="text-xs sm:text-sm font-medium text-gray-500">À propos</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-fuchsia-600 via-fuchsia-700 to-purple-800 rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-24 text-center text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              À propos de Destiny Jobs
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90 px-2">
              Votre partenaire de confiance pour connecter les talents aux opportunités au Bénin
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-fuchsia-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-0">
                <i className="fas fa-bullseye text-white text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 sm:ml-4">Notre Mission</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
              Chez Destiny Jobs, nous croyons que chaque personne mérite de trouver sa voie professionnelle. 
              Notre mission est de révolutionner le marché de l'emploi au Bénin en créant un écosystème 
              dynamique qui facilite la rencontre entre les talents et les opportunités.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2 sm:mr-3 text-sm sm:text-base flex-shrink-0"></i>
                <span className="text-sm sm:text-base text-gray-700">Démocratiser l'accès à l'emploi pour tous les Béninois</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2 sm:mr-3 text-sm sm:text-base flex-shrink-0"></i>
                <span className="text-sm sm:text-base text-gray-700">Accompagner les entreprises dans leur recrutement</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2 sm:mr-3 text-sm sm:text-base flex-shrink-0"></i>
                <span className="text-sm sm:text-base text-gray-700">Promouvoir le développement économique local</span>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="bg-gradient-to-br from-fuchsia-100 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-fuchsia-600 mb-1 sm:mb-2">2,543</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">Offres d'emploi</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">12,897</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">Candidats inscrits</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">456</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">Entreprises partenaires</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">89%</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">Taux de satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Values */}
        <section className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              <i className="fas fa-eye text-fuchsia-600 mr-2 sm:mr-3"></i>
              Notre Vision & Nos Valeurs
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Construire l'avenir professionnel du Bénin en nous appuyant sur des valeurs fortes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-handshake text-white text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Intégrité</h3>
              <p className="text-sm sm:text-base text-gray-600">Nous agissons avec transparence et honnêteté dans toutes nos interactions.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-rocket text-white text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Innovation</h3>
              <p className="text-sm sm:text-base text-gray-600">Nous développons constamment de nouvelles solutions pour améliorer l'expérience utilisateur.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-users text-white text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Inclusion</h3>
              <p className="text-sm sm:text-base text-gray-600">Nous croyons en l'égalité des chances pour tous, sans discrimination.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-heart text-white text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Excellence</h3>
              <p className="text-sm sm:text-base text-gray-600">Nous nous efforçons d'offrir la meilleure qualité de service à nos utilisateurs.</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section>
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              <i className="fas fa-cogs text-fuchsia-600 mr-2 sm:mr-3"></i>
              Nos Services
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Une gamme complète de services pour répondre à tous vos besoins professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-fuchsia-600">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-fuchsia-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="fas fa-briefcase text-fuchsia-600 text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Emplois & Jobs</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Accédez à des milliers d'offres d'emploi dans tous les secteurs d'activité au Bénin.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Recherche avancée</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Alertes emploi</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Candidature express</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-green-600">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="fas fa-graduation-cap text-green-600 text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Formations</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Développez vos compétences avec nos formations professionnelles certifiantes.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Formations en ligne</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Certificats reconnus</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Accompagnement personnalisé</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-purple-600">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="fas fa-hand-holding-usd text-purple-600 text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Financements</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Obtenez un financement pour vos projets professionnels ou entrepreneuriaux.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Microcrédits</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Prêts étudiants</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Capital startup</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-orange-600">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="fas fa-user-tie text-orange-600 text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Consultation</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Bénéficiez de conseils personnalisés pour votre carrière et votre développement professionnel.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Coaching carrière</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Optimisation CV</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Préparation entretiens</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-red-600">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="fas fa-award text-red-600 text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Bourses d'études</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Découvrez les opportunités de bourses d'études au Bénin et à l'international.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Bourses nationales</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Bourses internationales</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Aide au dossier</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-600 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <i className="fas fa-building text-indigo-600 text-lg sm:text-xl lg:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Solutions RH</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Accompagnement complet des entreprises dans leur gestion des ressources humaines.
              </p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Recrutement</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Formation RH</li>
                <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 text-xs"></i>Évaluation talents</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-fuchsia-600 to-purple-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Prêt à commencer votre journey avec nous ?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2">
            Rejoignez des milliers de professionnels qui font confiance à Destiny Jobs pour développer leur carrière
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
            <Link 
              to="/signup" 
              className="bg-white text-fuchsia-600 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 text-sm sm:text-base"
            >
              Créer un compte candidat
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 