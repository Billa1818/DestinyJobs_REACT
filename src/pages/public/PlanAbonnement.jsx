import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PlanAbonnement = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedTier, setSelectedTier] = useState('basic');

  const plans = {
    basic: {
      name: "Basique",
      description: "Parfait pour commencer",
      icon: "fas fa-user",
      color: "bg-blue-500",
      features: [
        "Accès aux offres d'emploi",
        "Postulation illimitée",
        "Profil candidat basique",
        "Notifications par email",
        "Support par email"
      ],
      limitations: [
        "Pas d'accès aux consultations",
        "Pas de messagerie",
        "Pas de statistiques avancées"
      ]
    },
    premium: {
      name: "Premium",
      description: "Pour les professionnels actifs",
      icon: "fas fa-star",
      color: "bg-fuchsia-500",
      features: [
        "Tout du plan Basique",
        "Accès aux consultations",
        "Messagerie avec recruteurs",
        "Statistiques de candidature",
        "CV premium avec template",
        "Support prioritaire",
        "Formations en ligne"
      ],
      limitations: [
        "Pas de création d'offres",
        "Pas de gestion d'entreprise"
      ]
    },
    business: {
      name: "Business",
      description: "Pour les entreprises et consultants",
      icon: "fas fa-building",
      color: "bg-purple-500",
      features: [
        "Tout du plan Premium",
        "Création d'offres d'emploi",
        "Gestion d'entreprise",
        "Tableau de bord avancé",
        "Analytics détaillées",
        "Support téléphonique",
        "Formation personnalisée",
        "API d'intégration"
      ],
      limitations: [
        "Pas de fonctionnalités personnalisées",
        "Pas de support dédié"
      ]
    },
    enterprise: {
      name: "Enterprise",
      description: "Solution sur mesure",
      icon: "fas fa-crown",
      color: "bg-yellow-500",
      features: [
        "Tout du plan Business",
        "Fonctionnalités personnalisées",
        "Support dédié 24/7",
        "Intégration sur mesure",
        "Formation sur site",
        "SLA garanti",
        "Migration de données",
        "Audit de sécurité"
      ],
      limitations: []
    }
  };

  const pricing = {
    monthly: {
      basic: { price: 0, originalPrice: 0 },
      premium: { price: 15000, originalPrice: 20000 },
      business: { price: 45000, originalPrice: 60000 },
      enterprise: { price: 150000, originalPrice: 200000 }
    },
    yearly: {
      basic: { price: 0, originalPrice: 0 },
      premium: { price: 150000, originalPrice: 240000 },
      business: { price: 450000, originalPrice: 720000 },
      enterprise: { price: 1500000, originalPrice: 2400000 }
    }
  };

  const handleSubscribe = (plan) => {
    if (plan === 'basic') {
      // Rediriger vers l'inscription gratuite
      window.location.href = '/signup';
    } else {
      // Rediriger vers la page de paiement
      window.location.href = `/paiement/${plan}`;
    }
  };

  const currentPricing = pricing[selectedPlan];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <i className="fas fa-crown text-fuchsia-600 mr-3"></i>
            Plans d'abonnement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choisissez le plan qui correspond le mieux à vos besoins. 
            Commencez gratuitement et évoluez selon vos objectifs.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${selectedPlan === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 ${
                selectedPlan === 'yearly' ? 'bg-fuchsia-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  selectedPlan === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${selectedPlan === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Annuel
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                -25%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(plans).map(([key, plan]) => (
          <div 
            key={key}
            className={`relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
              selectedTier === key ? 'border-fuchsia-500 shadow-lg' : 'border-gray-200'
            }`}
          >
            {/* Popular Badge */}
            {key === 'premium' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-fuchsia-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  <i className="fas fa-star mr-1"></i>
                  Populaire
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${plan.color} text-white mb-4`}>
                  <i className={`${plan.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                {key === 'basic' ? (
                  <div className="text-3xl font-bold text-gray-900">Gratuit</div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {currentPricing[key].price.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-gray-500">
                      par {selectedPlan === 'monthly' ? 'mois' : 'an'}
                    </div>
                    {currentPricing[key].originalPrice > currentPricing[key].price && (
                      <div className="text-sm text-gray-400 line-through mt-1">
                        {currentPricing[key].originalPrice.toLocaleString()} FCFA
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Inclus :</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 mb-3 mt-4">Non inclus :</h4>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fas fa-times text-red-500 mt-1 mr-3 flex-shrink-0"></i>
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(key)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  key === 'premium' 
                    ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-700' 
                    : key === 'basic'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {key === 'basic' ? 'Commencer gratuitement' : 'Choisir ce plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Questions fréquentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Puis-je changer de plan à tout moment ?</h3>
              <p className="text-gray-600 text-sm">Oui, vous pouvez mettre à jour ou rétrograder votre plan à tout moment. Les changements prennent effet immédiatement.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Y a-t-il des frais de résiliation ?</h3>
              <p className="text-gray-600 text-sm">Non, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Les paiements sont-ils sécurisés ?</h3>
              <p className="text-gray-600 text-sm">Oui, nous utilisons des technologies de paiement sécurisées et conformes aux standards internationaux.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Quels moyens de paiement acceptez-vous ?</h3>
              <p className="text-gray-600 text-sm">Nous acceptons les cartes bancaires, les virements bancaires et les paiements mobiles (Moov Money, MTN Mobile Money).</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Proposez-vous un essai gratuit ?</h3>
              <p className="text-gray-600 text-sm">Oui, le plan Basique est entièrement gratuit. Pour les autres plans, nous proposons un essai de 7 jours.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Comment obtenir de l'aide ?</h3>
              <p className="text-gray-600 text-sm">Notre équipe support est disponible par email, chat et téléphone selon votre plan d'abonnement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-lg mb-6 opacity-90">
          Rejoignez des milliers d'utilisateurs qui ont trouvé leur voie grâce à notre plateforme
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Commencer gratuitement
          </Link>
          <Link 
            to="/contact" 
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanAbonnement; 