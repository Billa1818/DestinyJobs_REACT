import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DiffusionOpportunites = () => {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [currentFacturePlan, setCurrentFacturePlan] = useState(null);

  // Plans d'abonnement
  const plans = [
    {
      id: 'gratuit',
      name: 'Gratuit',
      price: 0,
      originalPrice: 0,
      description: 'Parfait pour commencer',
      features: [
        '5 offres par mois',
        'Accès aux offres de base',
        'Notifications par email',
        'Support communautaire',
        'Profil de base'
      ],
      limitations: [
        'Pas de mise en avant',
        'Pas d\'analytics avancés',
        'Pas de support prioritaire'
      ],
      color: 'bg-gray-500',
      popular: false,
      badge: null
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 29,
      originalPrice: 39,
      description: 'Pour les petites entreprises',
      features: [
        '25 offres par mois',
        'Mise en avant des offres',
        'Analytics de base',
        'Support par email',
        'Profil optimisé',
        'Diffusion ciblée',
        'Statistiques de vues'
      ],
      limitations: [
        'Pas de support téléphonique',
        'Analytics limités'
      ],
      color: 'bg-blue-500',
      popular: false,
      badge: null
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      originalPrice: 99,
      description: 'Pour les entreprises en croissance',
      features: [
        '100 offres par mois',
        'Mise en avant prioritaire',
        'Analytics avancés',
        'Support téléphonique',
        'Profil premium',
        'Diffusion multi-canal',
        'Statistiques détaillées',
        'API d\'intégration',
        'Formulaires personnalisés',
        'Gestion des candidatures'
      ],
      limitations: [
        'Pas de support dédié',
        'Pas de formation personnalisée'
      ],
      color: 'bg-orange-500',
      popular: true,
      badge: 'Populaire'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 199,
      originalPrice: 249,
      description: 'Pour les grandes entreprises',
      features: [
        'Offres illimitées',
        'Mise en avant maximale',
        'Analytics complets',
        'Support dédié 24/7',
        'Profil enterprise',
        'Diffusion multi-canal avancée',
        'Statistiques en temps réel',
        'API complète',
        'Formulaires sur mesure',
        'Gestion avancée des candidatures',
        'Formation personnalisée',
        'Consultant RH dédié',
        'Intégrations tierces',
        'Rapports personnalisés',
        'White-label disponible'
      ],
      limitations: [],
      color: 'bg-purple-600',
      popular: false,
      badge: 'Enterprise'
    }
  ];

  // Calculer les prix selon le cycle de facturation
  const getPlanPrice = (plan) => {
    if (billingCycle === 'yearly') {
      const yearlyPrice = plan.price * 12 * 0.8; // 20% de réduction annuelle
      return Math.round(yearlyPrice);
    }
    return plan.price;
  };

  // Obtenir le plan sélectionné
  const currentPlan = plans.find(plan => plan.id === selectedPlan);

  // Afficher la facture proforma
  const showFacture = (plan) => {
    setCurrentFacturePlan(plan);
    setShowFactureModal(true);
  };

  // Fermer la modal
  const closeFactureModal = () => {
    setShowFactureModal(false);
    setCurrentFacturePlan(null);
  };

  // Télécharger la facture PDF
  const downloadFacturePDF = (plan) => {
    // Simulation de génération et téléchargement du PDF
    const factureData = generateFactureData(plan);
    console.log('Téléchargement facture PDF:', factureData);
    
    // Ici vous pouvez intégrer une vraie bibliothèque de génération PDF
    // comme jsPDF, PDFKit, ou appeler votre API backend
    
    // Pour l'instant, on simule le téléchargement
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(factureData, null, 2))}`;
    link.download = `Facture_Proforma_${plan.name}_${Date.now()}.txt`;
    link.click();
  };

  // Générer les données de la facture
  const generateFactureData = (plan) => {
    const now = new Date();
    const factureNumber = `PRO-${plan.id.toUpperCase()}-${now.getTime().toString().slice(-6)}`;
    
    return {
      numero: factureNumber,
      date: now.toLocaleDateString('fr-FR'),
      client: 'À définir',
      validite: '30 jours',
      plan: plan.name,
      description: plan.description,
      prix: getPlanPrice(plan),
      cycle: billingCycle,
      fonctionnalites: plan.features,
      limitations: plan.limitations,
      total: getPlanPrice(plan),
      conditions: [
        'Facture valable 30 jours',
        'Paiement à réception de facture',
        'Résiliation possible à tout moment',
        'Support selon le plan choisi'
      ]
    };
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plans de Diffusion d'Opportunités
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins de diffusion 
            d'offres d'emploi, bourses et financements
          </p>
        </div>

        {/* Cycle de facturation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Facturation mensuelle
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Facturation annuelle
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans d'abonnement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${
                selectedPlan === plan.id
                  ? 'border-orange-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              } ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}
            >
              {/* Badge populaire */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Badge enterprise */}
              {plan.badge === 'Enterprise' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* En-tête du plan */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  
                  {/* Prix */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {getPlanPrice(plan) === 0 ? 'Gratuit' : `$${getPlanPrice(plan)}`}
                      </span>
                      {getPlanPrice(plan) > 0 && (
                        <span className="text-gray-600 ml-2">
                          /{billingCycle === 'yearly' ? 'an' : 'mois'}
                        </span>
                      )}
                    </div>
                    
                    {/* Prix original barré pour l'annuel */}
                    {billingCycle === 'yearly' && plan.price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="line-through">${plan.originalPrice * 12}/an</span>
                        <span className="text-green-600 ml-2">Économisez ${(plan.originalPrice * 12) - getPlanPrice(plan)}/an</span>
                      </div>
                    )}
                    
                    {/* Prix mensuel barré pour l'annuel */}
                    {billingCycle === 'yearly' && plan.price > 0 && (
                      <div className="text-xs text-gray-500">
                        Équivaut à ${Math.round(getPlanPrice(plan) / 12)}/mois
                      </div>
                    )}
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Inclus :</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Non inclus :</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <i className="fas fa-times text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="space-y-3">
                  {/* Bouton de sélection */}
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
                      selectedPlan === plan.id
                        ? 'bg-orange-600 text-white'
                        : plan.id === 'gratuit'
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : `${plan.color.replace('bg-', 'bg-')} text-white hover:opacity-90`
                    }`}
                  >
                    {selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-check mr-2"></i>
                        Plan sélectionné
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        {plan.id === 'gratuit' ? 'Commencer gratuitement' : 'Choisir ce plan'}
                      </span>
                    )}
                  </button>

                  {/* Bouton facture proforma */}
                  <button
                    onClick={() => showFacture(plan)}
                    className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-file-invoice mr-2"></i>
                    Voir Facture Proforma
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Facture Proforma */}
        {showFactureModal && currentFacturePlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* En-tête de la modal */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Facture Proforma - {currentFacturePlan.name}
                    </h2>
                    <p className="text-gray-600">
                      Plan de diffusion d'opportunités
                    </p>
                  </div>
                  <button
                    onClick={closeFactureModal}
                    className="text-gray-400 hover:text-gray-600 transition duration-200"
                  >
                    <i className="fas fa-times text-2xl"></i>
                  </button>
                </div>
              </div>

              {/* Contenu de la facture */}
              <div className="p-6">
                {/* Informations de la facture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Informations de la facture</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">N° Facture:</span>
                        <span className="font-medium">PRO-{currentFacturePlan.id.toUpperCase()}-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client:</span>
                        <span className="font-medium">À définir</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Validité:</span>
                        <span className="font-medium">30 jours</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Détails du plan</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{currentFacturePlan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Description:</span>
                        <span className="font-medium">{currentFacturePlan.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cycle:</span>
                        <span className="font-medium capitalize">{billingCycle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix:</span>
                        <span className="font-bold text-lg">
                          {getPlanPrice(currentFacturePlan) === 0 ? 'Gratuit' : `$${getPlanPrice(currentFacturePlan)}`}
                          {getPlanPrice(currentFacturePlan) > 0 && (
                            <span className="text-sm text-gray-600 ml-1">
                              /{billingCycle === 'yearly' ? 'an' : 'mois'}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fonctionnalités et limitations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités incluses</h3>
                    <div className="space-y-2">
                      {currentFacturePlan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <i className="fas fa-check text-green-500 mt-1 mr-2 flex-shrink-0"></i>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentFacturePlan.limitations.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Non inclus</h3>
                      <div className="space-y-2">
                        {currentFacturePlan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start">
                            <i className="fas fa-times text-red-500 mt-1 mr-2 flex-shrink-0"></i>
                            <span className="text-sm text-gray-700">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculs et total */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Calculs et total</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-medium">
                        {getPlanPrice(currentFacturePlan) === 0 ? 'Gratuit' : `$${getPlanPrice(currentFacturePlan)}`}
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && currentFacturePlan.price > 0 && (
                      <>
                        <div className="flex justify-between text-green-600">
                          <span>Réduction annuelle (20%):</span>
                          <span className="font-medium">
                            -${Math.round((currentFacturePlan.originalPrice * 12) * 0.2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Économies totales:</span>
                          <span className="font-medium">
                            ${(currentFacturePlan.originalPrice * 12) - getPlanPrice(currentFacturePlan)}/an
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="font-semibold text-gray-900 text-lg">Total:</span>
                      <span className="font-bold text-2xl text-gray-900">
                        {getPlanPrice(currentFacturePlan) === 0 ? 'Gratuit' : `$${getPlanPrice(currentFacturePlan)}`}
                        {getPlanPrice(currentFacturePlan) > 0 && (
                          <span className="text-sm text-gray-600 ml-1">
                            /{billingCycle === 'yearly' ? 'an' : 'mois'}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3">Conditions</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-4">
                    <li>Facture valable 30 jours</li>
                    <li>Paiement à réception de facture</li>
                    <li>Résiliation possible à tout moment</li>
                    <li>Support selon le plan choisi</li>
                    {billingCycle === 'yearly' && currentFacturePlan.price > 0 && (
                      <li>Engagement annuel avec réduction de 20%</li>
                    )}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => downloadFacturePDF(currentFacturePlan)}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Télécharger PDF
                  </button>
                  
                  <button
                    onClick={closeFactureModal}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section FAQ */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Questions fréquentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-gray-600 text-sm">
                Oui, vous pouvez passer à un plan supérieur à tout moment. 
                Le changement de plan inférieur prendra effet au prochain cycle de facturation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Y a-t-il des frais de résiliation ?
              </h3>
              <p className="text-gray-600 text-sm">
                Non, aucun frais de résiliation. Vous pouvez annuler votre abonnement 
                à tout moment sans pénalité.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Les offres non utilisées sont-elles reportées ?
              </h3>
              <p className="text-gray-600 text-sm">
                Non, les offres non utilisées ne sont pas reportées au mois suivant. 
                Chaque mois, votre quota se renouvelle.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Le support est-il disponible 24/7 ?
              </h3>
              <p className="text-gray-600 text-sm">
                Le support 24/7 est disponible uniquement avec le plan Premium. 
                Les autres plans bénéficient d'un support aux heures ouvrables.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Prêt à diffuser vos opportunités ?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Commencez dès aujourd'hui avec le plan qui vous convient le mieux
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                // Logique pour commencer l'abonnement
                console.log('Commencer abonnement:', selectedPlan);
              }}
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
            >
              <i className="fas fa-rocket mr-2"></i>
              Commencer maintenant
            </button>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition duration-200"
            >
              <i className="fas fa-envelope mr-2"></i>
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiffusionOpportunites; 