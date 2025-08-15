import React from 'react';

const PlanAbonnement = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choisissez votre <span className="text-fuchsia-600">plan d'abonnement</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Accédez aux meilleures opportunités d'emploi en Afrique avec nos plans flexibles adaptés à vos besoins
          </p>
          
          {/* Toggle Switch */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white text-fuchsia-600 shadow-sm">
              Mensuel
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900">
              Annuel
              <span className="ml-1 bg-fuchsia-600 text-white text-xs px-2 py-1 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Plan Gratuit */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8 relative hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-seedling text-gray-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Gratuit</h3>
              <p className="text-gray-600 text-sm">Parfait pour débuter votre recherche</p>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">0</span>
                <span className="text-lg text-gray-600 ml-1">FCFA</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Toujours gratuit</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>5 candidatures par mois</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Accès aux offres publiques</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>CV basique</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Support par email</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <i className="fas fa-times text-gray-300 mr-3"></i>
                <span>Offres premium</span>
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <i className="fas fa-times text-gray-300 mr-3"></i>
                <span>Consultation carrière</span>
              </li>
            </ul>

            <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
              Plan actuel
            </button>
          </div>

          {/* Plan Premium */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-fuchsia-600 p-6 lg:p-8 relative transform scale-105 hover:shadow-2xl transition-all duration-300">
            {/* Badge Popular */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-fuchsia-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Le plus populaire
              </span>
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-fuchsia-100 rounded-full mb-4">
                <i className="fas fa-rocket text-fuchsia-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Premium</h3>
              <p className="text-gray-600 text-sm">Pour les chercheurs d'emploi sérieux</p>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">9,900</span>
                <span className="text-lg text-gray-600 ml-1">FCFA</span>
                <span className="text-sm text-gray-500 ml-1">/mois</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Soit 9,900 FCFA/mois
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Candidatures illimitées</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Accès aux offres premium</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>CV professionnel personnalisé</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Alertes emploi prioritaires</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Visibilité profil augmentée</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Support prioritaire</span>
              </li>
            </ul>

            <button className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-fuchsia-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Choisir Premium
            </button>
          </div>

          {/* Plan Entreprise */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8 relative hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <i className="fas fa-building text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Entreprise</h3>
              <p className="text-gray-600 text-sm">Solution complète pour recruteurs</p>
            </div>
            
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">29,900</span>
                <span className="text-lg text-gray-600 ml-1">FCFA</span>
                <span className="text-sm text-gray-500 ml-1">/mois</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Soit 29,900 FCFA/mois
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Publication d'offres illimitée</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Base de données talents</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Outils de filtrage avancés</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Tableau de bord analytique</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Support dédié</span>
              </li>
              <li className="flex items-center text-sm">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Formation équipe RH</span>
              </li>
            </ul>

            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
              Contacter commercial
            </button>
          </div>
        </div>

        {/* Features Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Comparaison détaillée des fonctionnalités</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-2 text-gray-900 font-semibold">Fonctionnalités</th>
                  <th className="text-center py-4 px-2 text-gray-900 font-semibold">Gratuit</th>
                  <th className="text-center py-4 px-2 text-fuchsia-600 font-semibold">Premium</th>
                  <th className="text-center py-4 px-2 text-blue-600 font-semibold">Entreprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-2 text-gray-700">Candidatures par mois</td>
                  <td className="py-4 px-2 text-center text-gray-600">5</td>
                  <td className="py-4 px-2 text-center text-fuchsia-600 font-semibold">Illimitées</td>
                  <td className="py-4 px-2 text-center text-blue-600 font-semibold">N/A</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 text-gray-700">Accès offres premium</td>
                  <td className="py-4 px-2 text-center"><i className="fas fa-times text-gray-300"></i></td>
                  <td className="py-4 px-2 text-center"><i className="fas fa-check text-green-500"></i></td>
                  <td className="py-4 px-2 text-center"><i className="fas fa-check text-green-500"></i></td>
                </tr>
                <tr>
                  <td className="py-4 px-2 text-gray-700">CV professionnel</td>
                  <td className="py-4 px-2 text-center text-gray-600">Basique</td>
                  <td className="py-4 px-2 text-center text-fuchsia-600 font-semibold">Personnalisé</td>
                  <td className="py-4 px-2 text-center text-blue-600 font-semibold">Équipe</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 text-gray-700">Consultation carrière</td>
                  <td className="py-4 px-2 text-center"><i className="fas fa-times text-gray-300"></i></td>
                  <td className="py-4 px-2 text-center text-fuchsia-600">1h/mois</td>
                  <td className="py-4 px-2 text-center text-blue-600 font-semibold">Illimitées</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 text-gray-700">Publication d'offres</td>
                  <td className="py-4 px-2 text-center"><i className="fas fa-times text-gray-300"></i></td>
                  <td className="py-4 px-2 text-center"><i className="fas fa-times text-gray-300"></i></td>
                  <td className="py-4 px-2 text-center text-blue-600 font-semibold">Illimitées</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 text-gray-700">Support</td>
                  <td className="py-4 px-2 text-center text-gray-600">Email</td>
                  <td className="py-4 px-2 text-center text-fuchsia-600">Prioritaire</td>
                  <td className="py-4 px-2 text-center text-blue-600 font-semibold">Dédié</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Questions fréquemment posées</h3>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              <button className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Puis-je changer de plan à tout moment ?</span>
                <i className="fas fa-chevron-down transform transition-transform"></i>
              </button>
              <div className="hidden px-6 pb-4 text-gray-600">
                Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prennent effet immédiatement et votre facturation sera ajustée au prorata.
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <button className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Y a-t-il une période d'essai gratuite ?</span>
                <i className="fas fa-chevron-down transform transition-transform"></i>
              </button>
              <div className="hidden px-6 pb-4 text-gray-600">
                Nous offrons une garantie de remboursement de 30 jours sur tous nos plans payants. Vous pouvez également commencer avec notre plan gratuit pour tester la plateforme.
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <button className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Quels moyens de paiement acceptez-vous ?</span>
                <i className="fas fa-chevron-down transform transition-transform"></i>
              </button>
              <div className="hidden px-6 pb-4 text-gray-600">
                Nous acceptons les cartes de crédit/débit, Mobile Money (MTN, Moov, Orange), et les virements bancaires pour les entreprises.
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <button className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">Les prix sont-ils les mêmes dans tous les pays ?</span>
                <i className="fas fa-chevron-down transform transition-transform"></i>
              </button>
              <div className="hidden px-6 pb-4 text-gray-600">
                Nos prix sont adaptés aux marchés locaux africains. Les tarifs peuvent varier selon votre pays de résidence pour rester accessibles et compétitifs.
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">Prêt à transformer votre carrière ?</h3>
          <p className="text-lg mb-6 opacity-90">Rejoignez des milliers de professionnels qui ont trouvé leur emploi de rêve avec Destiny Jobs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Commencer gratuitement
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-fuchsia-600 transition-colors duration-200">
              Parler à un expert
            </button>
          </div>
        </div>
    </div>
  );
};

export default PlanAbonnement;