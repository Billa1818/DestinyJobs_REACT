<!-- Main Content Area - Plans d'abonnement -->
<main class="flex-1 py-8 sm:py-12 lg:py-16">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <!-- Header Section -->
        <div class="text-center mb-12 lg:mb-16">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Choisissez votre <span class="text-fuchsia-600">plan d'abonnement</span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Accédez aux meilleures opportunités d'emploi en Afrique avec nos plans flexibles adaptés à vos besoins
            </p>
            
            <!-- Toggle Switch -->
            <div class="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8">
                <button onclick="toggleBilling('monthly')" id="monthly-btn" class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white text-fuchsia-600 shadow-sm">
                    Mensuel
                </button>
                <button onclick="toggleBilling('yearly')" id="yearly-btn" class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900">
                    Annuel
                    <span class="ml-1 bg-fuchsia-600 text-white text-xs px-2 py-1 rounded-full">-20%</span>
                </button>
            </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            <!-- Plan Gratuit -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8 relative hover:shadow-xl transition-shadow duration-300">
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                        <i class="fas fa-seedling text-gray-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Plan Gratuit</h3>
                    <p class="text-gray-600 text-sm">Parfait pour débuter votre recherche</p>
                </div>
                
                <div class="text-center mb-6">
                    <div class="flex items-baseline justify-center">
                        <span class="text-4xl font-bold text-gray-900">0</span>
                        <span class="text-lg text-gray-600 ml-1">FCFA</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">Toujours gratuit</p>
                </div>

                <ul class="space-y-3 mb-8">
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>5 candidatures par mois</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Accès aux offres publiques</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>CV basique</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Support par email</span>
                    </li>
                    <li class="flex items-center text-sm text-gray-400">
                        <i class="fas fa-times text-gray-300 mr-3"></i>
                        <span>Offres premium</span>
                    </li>
                    <li class="flex items-center text-sm text-gray-400">
                        <i class="fas fa-times text-gray-300 mr-3"></i>
                        <span>Consultation carrière</span>
                    </li>
                </ul>

                <button class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
                    Plan actuel
                </button>
            </div>

            <!-- Plan Premium -->
            <div class="bg-white rounded-2xl shadow-xl border-2 border-fuchsia-600 p-6 lg:p-8 relative transform scale-105 hover:shadow-2xl transition-all duration-300">
                <!-- Badge Popular -->
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span class="bg-fuchsia-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Le plus populaire
                    </span>
                </div>
                
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-fuchsia-100 rounded-full mb-4">
                        <i class="fas fa-rocket text-fuchsia-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Plan Premium</h3>
                    <p class="text-gray-600 text-sm">Pour les chercheurs d'emploi sérieux</p>
                </div>
                
                <div class="text-center mb-6">
                    <div class="flex items-baseline justify-center">
                        <span class="text-4xl font-bold text-gray-900" id="premium-monthly-price">9,900</span>
                        <span class="text-4xl font-bold text-gray-900 hidden" id="premium-yearly-price">7,920</span>
                        <span class="text-lg text-gray-600 ml-1">FCFA</span>
                        <span class="text-sm text-gray-500 ml-1" id="premium-period">/mois</span>
                    </div>
                    <div class="text-sm text-gray-500 mt-1">
                        <span id="premium-total-monthly" class="">Soit 9,900 FCFA/mois</span>
                        <span id="premium-total-yearly" class="hidden">Soit 95,040 FCFA/an (économisez 23,760 FCFA)</span>
                    </div>
                </div>

                <ul class="space-y-3 mb-8">
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Candidatures illimitées</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Accès aux offres premium</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>CV professionnel personnalisé</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Alertes emploi prioritaires</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Visibilité profil augmentée</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Support prioritaire</span>
                    </li>
                </ul>

                <button class="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-fuchsia-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                    Choisir Premium
                </button>
            </div>

            <!-- Plan Entreprise -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8 relative hover:shadow-xl transition-shadow duration-300">
                <div class="text-center mb-6">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                        <i class="fas fa-building text-blue-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Plan Entreprise</h3>
                    <p class="text-gray-600 text-sm">Solution complète pour recruteurs</p>
                </div>
                
                <div class="text-center mb-6">
                    <div class="flex items-baseline justify-center">
                        <span class="text-4xl font-bold text-gray-900" id="enterprise-monthly-price">29,900</span>
                        <span class="text-4xl font-bold text-gray-900 hidden" id="enterprise-yearly-price">23,920</span>
                        <span class="text-lg text-gray-600 ml-1">FCFA</span>
                        <span class="text-sm text-gray-500 ml-1" id="enterprise-period">/mois</span>
                    </div>
                    <div class="text-sm text-gray-500 mt-1">
                        <span id="enterprise-total-monthly" class="">Soit 29,900 FCFA/mois</span>
                        <span id="enterprise-total-yearly" class="hidden">Soit 287,040 FCFA/an (économisez 71,760 FCFA)</span>
                    </div>
                </div>

                <ul class="space-y-3 mb-8">
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Publication d'offres illimitée</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Base de données talents</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Outils de filtrage avancés</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Tableau de bord analytique</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Support dédié</span>
                    </li>
                    <li class="flex items-center text-sm">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        <span>Formation équipe RH</span>
                    </li>
                </ul>

                <button class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                    Contacter commercial
                </button>
            </div>
        </div>

        <!-- Features Comparison Table -->
        <div class="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-12">
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-8">Comparaison détaillée des fonctionnalités</h3>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-4 px-2 text-gray-900 font-semibold">Fonctionnalités</th>
                            <th class="text-center py-4 px-2 text-gray-900 font-semibold">Gratuit</th>
                            <th class="text-center py-4 px-2 text-fuchsia-600 font-semibold">Premium</th>
                            <th class="text-center py-4 px-2 text-blue-600 font-semibold">Entreprise</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr>
                            <td class="py-4 px-2 text-gray-700">Candidatures par mois</td>
                            <td class="py-4 px-2 text-center text-gray-600">5</td>
                            <td class="py-4 px-2 text-center text-fuchsia-600 font-semibold">Illimitées</td>
                            <td class="py-4 px-2 text-center text-blue-600 font-semibold">N/A</td>
                        </tr>
                        <tr>
                            <td class="py-4 px-2 text-gray-700">Accès offres premium</td>
                            <td class="py-4 px-2 text-center"><i class="fas fa-times text-gray-300"></i></td>
                            <td class="py-4 px-2 text-center"><i class="fas fa-check text-green-500"></i></td>
                            <td class="py-4 px-2 text-center"><i class="fas fa-check text-green-500"></i></td>
                        </tr>
                        <tr>
                            <td class="py-4 px-2 text-gray-700">CV professionnel</td>
                            <td class="py-4 px-2 text-center text-gray-600">Basique</td>
                            <td class="py-4 px-2 text-center text-fuchsia-600 font-semibold">Personnalisé</td>
                            <td class="py-4 px-2 text-center text-blue-600 font-semibold">Équipe</td>
                        </tr>
                        <tr>
                            <td class="py-4 px-2 text-gray-700">Consultation carrière</td>
                            <td class="py-4 px-2 text-center"><i class="fas fa-times text-gray-300"></i></td>
                            <td class="py-4 px-2 text-center text-fuchsia-600">1h/mois</td>
                            <td class="py-4 px-2 text-center text-blue-600 font-semibold">Illimitées</td>
                        </tr>
                        <tr>
                            <td class="py-4 px-2 text-gray-700">Publication d'offres</td>
                            <td class="py-4 px-2 text-center"><i class="fas fa-times text-gray-300"></i></td>
                            <td class="py-4 px-2 text-center"><i class="fas fa-times text-gray-300"></i></td>
                            <td class="py-4 px-2 text-center text-blue-600 font-semibold">Illimitées</td>
                        </tr>
                        <tr>
                            <td class="py-4 px-2 text-gray-700">Support</td>
                            <td class="py-4 px-2 text-center text-gray-600">Email</td>
                            <td class="py-4 px-2 text-center text-fuchsia-600">Prioritaire</td>
                            <td class="py-4 px-2 text-center text-blue-600 font-semibold">Dédié</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- FAQ Section -->
        <div class="bg-gray-50 rounded-2xl p-6 lg:p-8 mb-12">
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-8">Questions fréquemment posées</h3>
            
            <div class="max-w-3xl mx-auto space-y-4">
                <div class="bg-white rounded-lg shadow-sm">
                    <button onclick="toggleFAQ('faq1')" class="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <span class="font-medium text-gray-900">Puis-je changer de plan à tout moment ?</span>
                        <i class="fas fa-chevron-down transform transition-transform" id="faq1-icon"></i>
                    </button>
                    <div id="faq1" class="hidden px-6 pb-4 text-gray-600">
                        Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prennent effet immédiatement et votre facturation sera ajustée au prorata.
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm">
                    <button onclick="toggleFAQ('faq2')" class="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <span class="font-medium text-gray-900">Y a-t-il une période d'essai gratuite ?</span>
                        <i class="fas fa-chevron-down transform transition-transform" id="faq2-icon"></i>
                    </button>
                    <div id="faq2" class="hidden px-6 pb-4 text-gray-600">
                        Nous offrons une garantie de remboursement de 30 jours sur tous nos plans payants. Vous pouvez également commencer avec notre plan gratuit pour tester la plateforme.
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm">
                    <button onclick="toggleFAQ('faq3')" class="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <span class="font-medium text-gray-900">Quels moyens de paiement acceptez-vous ?</span>
                        <i class="fas fa-chevron-down transform transition-transform" id="faq3-icon"></i>
                    </button>
                    <div id="faq3" class="hidden px-6 pb-4 text-gray-600">
                        Nous acceptons les cartes de crédit/débit, Mobile Money (MTN, Moov, Orange), et les virements bancaires pour les entreprises.
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm">
                    <button onclick="toggleFAQ('faq4')" class="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <span class="font-medium text-gray-900">Les prix sont-ils les mêmes dans tous les pays ?</span>
                        <i class="fas fa-chevron-down transform transition-transform" id="faq4-icon"></i>
                    </button>
                    <div id="faq4" class="hidden px-6 pb-4 text-gray-600">
                        Nos prix sont adaptés aux marchés locaux africains. Les tarifs peuvent varier selon votre pays de résidence pour rester accessibles et compétitifs.
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 class="text-2xl lg:text-3xl font-bold mb-4">Prêt à transformer votre carrière ?</h3>
            <p class="text-lg mb-6 opacity-90">Rejoignez des milliers de professionnels qui ont trouvé leur emploi de rêve avec Destiny Jobs</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button class="bg-white text-fuchsia-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                    Commencer gratuitement
                </button>
                <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-fuchsia-600 transition-colors duration-200">
                    Parler à un expert
                </button>
            </div>
        </div>
    </div>
</main>