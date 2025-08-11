import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Paiement = () => {
  const { plan } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const plans = {
    premium: {
      name: "Premium",
      monthlyPrice: 15000,
      yearlyPrice: 150000,
      description: "Pour les professionnels actifs"
    },
    business: {
      name: "Business",
      monthlyPrice: 45000,
      yearlyPrice: 450000,
      description: "Pour les entreprises et consultants"
    },
    enterprise: {
      name: "Enterprise",
      monthlyPrice: 150000,
      yearlyPrice: 1500000,
      description: "Solution sur mesure"
    }
  };

  const selectedPlan = plans[plan] || plans.premium;
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simuler le traitement du paiement
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    alert('Paiement traité avec succès ! Votre abonnement est maintenant actif.');
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-credit-card text-fuchsia-600 mr-3"></i>
            Finaliser votre abonnement
          </h1>
          <p className="text-gray-600">
            Complétez votre paiement pour activer votre plan {selectedPlan.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de paiement */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Informations de paiement
          </h2>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Plan sélectionné */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedPlan.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {billingCycle === 'monthly' 
                      ? `${selectedPlan.monthlyPrice.toLocaleString()} FCFA/mois`
                      : `${selectedPlan.yearlyPrice.toLocaleString()} FCFA/an`
                    }
                  </div>
                  <div className="text-sm text-gray-500">
                    {billingCycle === 'yearly' && (
                      <span className="text-green-600">Économisez 25%</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Toggle billing cycle */}
              <div className="flex items-center justify-center space-x-4 mt-4">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Mensuel
                </span>
                <button
                  type="button"
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 ${
                    billingCycle === 'yearly' ? 'bg-fuchsia-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annuel
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    -25%
                  </span>
                </span>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthode de paiement</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-fuchsia-600 focus:ring-fuchsia-500"
                  />
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-credit-card text-gray-600"></i>
                    <span className="text-gray-700">Carte bancaire</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-fuchsia-600 focus:ring-fuchsia-500"
                  />
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-mobile-alt text-gray-600"></i>
                    <span className="text-gray-700">Paiement mobile (Moov Money, MTN)</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-fuchsia-600 focus:ring-fuchsia-500"
                  />
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-university text-gray-600"></i>
                    <span className="text-gray-700">Virement bancaire</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Informations de la carte */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Bouton de paiement */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-lock mr-2"></i>
                  Payer {billingCycle === 'monthly' 
                    ? `${selectedPlan.monthlyPrice.toLocaleString()} FCFA`
                    : `${selectedPlan.yearlyPrice.toLocaleString()} FCFA`
                  }
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résumé */}
        <div className="space-y-6">
          {/* Résumé de la commande */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de votre commande</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan {selectedPlan.name}</span>
                <span className="font-medium">{billingCycle === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prix</span>
                <span className="font-medium">
                  {billingCycle === 'monthly' 
                    ? `${selectedPlan.monthlyPrice.toLocaleString()} FCFA`
                    : `${selectedPlan.yearlyPrice.toLocaleString()} FCFA`
                  }
                </span>
              </div>
              
              {billingCycle === 'yearly' && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Économie</span>
                  <span className="font-medium">
                    {Math.round((selectedPlan.monthlyPrice * 12 - selectedPlan.yearlyPrice) / 1000)}k FCFA
                  </span>
                </div>
              )}
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>
                  {billingCycle === 'monthly' 
                    ? `${selectedPlan.monthlyPrice.toLocaleString()} FCFA`
                    : `${selectedPlan.yearlyPrice.toLocaleString()} FCFA`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <i className="fas fa-shield-alt text-green-600 mt-1"></i>
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Paiement sécurisé</h3>
                <p className="text-sm text-green-800">
                  Vos informations de paiement sont protégées par un chiffrement SSL de niveau bancaire. 
                  Nous ne stockons jamais vos données de carte.
                </p>
              </div>
            </div>
          </div>

          {/* Garantie */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <i className="fas fa-undo text-blue-600 mt-1"></i>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Garantie de remboursement</h3>
                <p className="text-sm text-blue-800">
                  Si vous n'êtes pas satisfait, nous vous remboursons dans les 30 jours suivant votre achat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paiement; 