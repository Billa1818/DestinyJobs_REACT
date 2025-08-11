import React from 'react';

const TermePolitiqueConfidentialite = () => {
  return (
    {/* Main Content Area */}
    <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          <nav className="flex mb-4 sm:mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-xs sm:text-sm">
              <li className="inline-flex items-center">
                <a href="#" className="inline-flex items-center font-medium text-gray-700 hover:text-fuchsia-600 transition-colors">
                  <i className="fas fa-home mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Accueil</span>
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-gray-400 mx-1 sm:mx-2 text-xs"></i>
                  <span className="font-medium text-gray-500 line-clamp-1">Conditions d'utilisation et Politique de confidentialité</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <i className="fas fa-shield-alt text-fuchsia-600 text-lg sm:text-xl md:text-2xl lg:text-3xl"></i>
              <span className="leading-tight">Conditions d'utilisation & Politique de confidentialité</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Dernière mise à jour : 25 juin 2025</p>
          </div>

          {/* Navigation tabs */}
          <div className="flex flex-col sm:flex-row bg-gray-50 rounded-lg p-1 mb-6 sm:mb-8 gap-1 sm:gap-0">
            <button className="flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 bg-fuchsia-600 text-white">
              <i className="fas fa-file-contract mr-1 sm:mr-2"></i>
              <span className="hidden xs:inline">Conditions d'utilisation</span>
              <span className="xs:hidden">Conditions</span>
            </button>
            <button className="flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 text-gray-600 hover:text-fuchsia-600">
              <i className="fas fa-user-shield mr-1 sm:mr-2"></i>
              <span className="hidden xs:inline">Politique de confidentialité</span>
              <span className="xs:hidden">Confidentialité</span>
            </button>
          </div>

          {/* Terms Section */}
          <div className="section-content">
            <div className="prose max-w-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
                <i className="fas fa-file-contract text-fuchsia-600"></i>
                <span>Conditions d'utilisation</span>
              </h2>

              <div className="bg-fuchsia-50 border-l-4 border-fuchsia-500 p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-shrink-0 self-center sm:self-start">
                    <i className="fas fa-info-circle text-fuchsia-500 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-fuchsia-900 text-center sm:text-left">Bienvenue sur Destiny Jobs</h3>
                    <p className="mt-2 text-sm sm:text-base text-fuchsia-700 text-center sm:text-left">
                      En utilisant notre plateforme, vous acceptez ces conditions d'utilisation. Veuillez les lire attentivement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <section>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex flex-col xs:flex-row items-center xs:items-start gap-2 xs:gap-3">
                    <span className="bg-fuchsia-100 text-fuchsia-800 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">1</span>
                    <span className="text-center xs:text-left">Acceptation des conditions</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                    En accédant et en utilisant la plateforme Destiny Jobs, vous acceptez d'être lié par ces conditions d'utilisation. 
                    Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 ml-2 sm:ml-4 text-sm sm:text-base">
                    <li>Ces conditions s'appliquent à tous les utilisateurs de la plateforme</li>
                    <li>Nous nous réservons le droit de modifier ces conditions à tout moment</li>
                    <li>Les modifications seront communiquées par email ou notification sur la plateforme</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex flex-col xs:flex-row items-center xs:items-start gap-2 xs:gap-3">
                    <span className="bg-fuchsia-100 text-fuchsia-800 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">2</span>
                    <span className="text-center xs:text-left">Utilisation de la plateforme</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                    Destiny Jobs est une plateforme de mise en relation entre candidats, recruteurs et prestataires de services au Bénin.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-3 sm:mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Utilisation autorisée :</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <li>Recherche et candidature à des offres d'emploi légitimes</li>
                      <li>Publication d'offres d'emploi conformes à la législation</li>
                      <li>Réseautage professionnel respectueux</li>
                      <li>Accès aux formations et ressources éducatives</li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermePolitiqueConfidentialite;