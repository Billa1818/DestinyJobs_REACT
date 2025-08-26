import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PlanAbonnement = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('decouverte');
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [currentFacturePlan, setCurrentFacturePlan] = useState(null);

  const plans = {
    decouverte: {
      name: "Pack Découverte",
      subtitle: "Démarrage de carrière",
      description: "Parfait pour débuter votre parcours professionnel",
      icon: "fas fa-rocket",
      color: "bg-blue-500",
      badge: "Offre de lancement",
      price: "30 000",
      currency: "FCFA",
      features: [
        "Élaboration d'un plan de carrière individualisé",
        "Coaching carrière (1 séance de 1h)",
        "Élaboration ou refonte du CV + lettre de motivation"
      ],
      popular: false,
      highlight: false
    },
    boost: {
      name: "Pack Boost Standard",
      subtitle: "Carrière en action",
      description: "Pour accélérer votre progression professionnelle",
      icon: "fas fa-star",
      color: "bg-fuchsia-500",
      badge: "Populaire",
      price: "50 000",
      currency: "FCFA",
      features: [
        "Tout du Pack Découverte",
        "Préparation à l'entretien d'embauche (simulation + conseils)",
        "Coaching carrière avancé (2 séances supplémentaires)",
        "Accès à des modèles de CV & LM professionnels"
      ],
      popular: true,
      highlight: true
    },
    premium: {
      name: "Pack Premium",
      subtitle: "Objectif emploi ou promotion",
      description: "La solution complète pour réussir votre carrière",
      icon: "fas fa-crown",
      color: "bg-purple-500",
      badge: "Premium",
      price: "75 000",
      currency: "FCFA",
      features: [
        "Tout du Pack Boost Standard",
        "Soft skills & compétences clés pour réussir sa carrière",
        "Réussir son intégration professionnelle",
        "Spiritualité et emploi : concilier foi et carrière",
        "Coaching carrière premium (jusqu'à 5 séances)"
      ],
      popular: false,
      highlight: false
    },
    surmesure: {
      name: "Pack Sur Mesure",
      subtitle: "À la carte",
      description: "Personnalisez selon vos besoins spécifiques",
      icon: "fas fa-puzzle-piece",
      color: "bg-green-500",
      badge: "Flexible",
      price: "À partir de 10 000",
      currency: "FCFA",
      features: [
        "Vous choisissez vos modules selon vos besoins",
        "Élaboration de CV ou LM seuls",
        "Préparation à l'entretien",
        "1 ou plusieurs séances de coaching ciblé",
        "Audit de présence professionnelle en ligne (LinkedIn, etc.)"
      ],
      popular: false,
      highlight: false
    },
    cvlm: {
      name: "CV & Lettre de Motivation",
      subtitle: "Pack essentiel",
      description: "Uniquement pour vos documents de candidature",
      icon: "fas fa-file-alt",
      color: "bg-orange-500",
      badge: "Essentiel",
      price: "15 000",
      currency: "FCFA",
      features: [
        "Création ou amélioration d'un CV professionnel",
        "Rédaction ou amélioration d'une lettre de motivation"
      ],
      popular: false,
      highlight: false
    }
  };

  const servicesComplementaires = [
    {
      name: "Audit LinkedIn",
      description: "Analyse, recommandations, modèle de profil optimisé",
      icon: "fab fa-linkedin",
      price: "5 000",
      currency: "FCFA"
    },
    {
      name: "Bilan d'orientation pro rapide",
      description: "Pour les indécis sur leur parcours professionnel",
      icon: "fas fa-compass",
      price: "8 000",
      currency: "FCFA"
    }
  ];

  // Afficher la facture proforma
  const showFacture = (planKey) => {
    console.log('showFacture appelé avec:', planKey);
    console.log('Plan sélectionné:', plans[planKey]);
    setCurrentFacturePlan({ key: planKey, ...plans[planKey] });
    setShowFactureModal(true);
    console.log('Modal ouverte, showFactureModal:', true);
  };

  // Fermer la modal
  const closeFactureModal = () => {
    console.log('closeFactureModal appelé');
    setShowFactureModal(false);
    setCurrentFacturePlan(null);
    console.log('Modal fermée, showFactureModal:', false);
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
    const factureNumber = `PRO-${plan.key.toUpperCase()}-${now.getTime().toString().slice(-6)}`;
    
    return {
      numero: factureNumber,
      date: now.toLocaleDateString('fr-FR'),
      client: 'À définir',
      validite: '30 jours',
      plan: plan.name,
      subtitle: plan.subtitle,
      description: plan.description,
      prix: plan.price,
      currency: plan.currency,
      fonctionnalites: plan.features,
      total: plan.price,
      conditions: [
        'Facture valable 30 jours',
        'Paiement à réception de facture',
        'Résiliation possible à tout moment',
        'Support selon le plan choisi',
        'Programme personnalisé selon vos besoins'
      ]
    };
  };

  const handleSubscribe = (planKey) => {
    // Rediriger vers la page de paiement avec le plan sélectionné
    navigate(`/paiement/${planKey}`);
  };

  const handleContact = () => {
    // Rediriger vers la page de contact
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full text-white mb-6">
            <i className="fas fa-graduation-cap text-3xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Programme <span className="text-fuchsia-600">Boost Careers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Développez votre carrière avec nos programmes personnalisés. 
            Du démarrage à l'excellence professionnelle, nous vous accompagnons à chaque étape.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key}
              className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.highlight ? 'border-fuchsia-500 ring-4 ring-fuchsia-100' : 'border-gray-200'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap ${
                  plan.popular ? 'bg-fuchsia-600' : 
                  plan.badge === 'Offre de lancement' ? 'bg-green-600' :
                  plan.badge === 'Premium' ? 'bg-purple-600' :
                  plan.badge === 'Flexible' ? 'bg-green-600' :
                  'bg-orange-600'
                }`}>
                  <i className={`mr-1.5 ${
                    plan.popular ? 'fas fa-star' :
                    plan.badge === 'Offre de lancement' ? 'fas fa-fire' :
                    plan.badge === 'Premium' ? 'fas fa-crown' :
                    plan.badge === 'Flexible' ? 'fas fa-magic' :
                    'fas fa-check'
                  }`}></i>
                  {plan.badge === 'Offre de lancement' ? 'Lancement' : plan.badge}
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${plan.color} text-white mb-6`}>
                    <i className={`${plan.icon} text-3xl`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-fuchsia-600 font-semibold mb-2">{plan.subtitle}</p>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price} <span className="text-lg text-gray-600">{plan.currency}</span>
                  </div>
                  {key === 'surmesure' && (
                    <p className="text-sm text-gray-500">par module</p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4 text-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Ce qui est inclus :
                  </h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(key)}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition duration-200 ${
                      plan.highlight 
                        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:from-fuchsia-700 hover:to-purple-700 shadow-lg' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    {key === 'surmesure' ? 'Nous contacter' : 'Choisir ce pack'}
                  </button>

                  {/* Bouton facture proforma */}
                  <button
                    onClick={() => showFacture(key)}
                    className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200 flex items-center justify-center"
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
                      {currentFacturePlan.subtitle} - {currentFacturePlan.description}
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
                        <span className="font-medium">PRO-{currentFacturePlan.key.toUpperCase()}-{Date.now().toString().slice(-6)}</span>
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
                    <h3 className="font-semibold text-gray-900 mb-3">Détails du pack</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pack:</span>
                        <span className="font-medium">{currentFacturePlan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sous-titre:</span>
                        <span className="font-medium">{currentFacturePlan.subtitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Description:</span>
                        <span className="font-medium">{currentFacturePlan.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix:</span>
                        <span className="font-bold text-lg">
                          {currentFacturePlan.price} {currentFacturePlan.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fonctionnalités incluses */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Fonctionnalités incluses</h3>
                  <div className="space-y-3">
                    {currentFacturePlan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-3 flex-shrink-0"></i>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculs et total */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Calculs et total</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-medium">
                        {currentFacturePlan.price} {currentFacturePlan.currency}
                      </span>
                    </div>
                    
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="font-semibold text-gray-900 text-lg">Total:</span>
                      <span className="font-bold text-2xl text-gray-900">
                        {currentFacturePlan.price} {currentFacturePlan.currency}
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
                    <li>Programme personnalisé selon vos besoins</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => downloadFacturePDF(currentFacturePlan)}
                    className="bg-fuchsia-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-fuchsia-700 transition duration-200 flex items-center justify-center"
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

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à booster votre carrière ?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Rejoignez des centaines de professionnels qui ont transformé leur carrière grâce à nos programmes personnalisés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSubscribe('boost')}
              className="bg-white text-fuchsia-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-200 font-semibold text-lg shadow-lg"
            >
              <i className="fas fa-rocket mr-2"></i>
              Commencer maintenant
            </button>
            <button
              onClick={handleContact}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-semibold text-lg"
            >
              <i className="fas fa-phone mr-2"></i>
              Nous contacter
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>
            <i className="fas fa-shield-alt mr-2"></i>
            Tous nos programmes sont garantis et personnalisés selon vos besoins
          </p>
          <p className="mt-2">
            <i className="fas fa-globe mr-2"></i>
            Programme en ligne disponible partout en Afrique de l'Ouest
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanAbonnement; 