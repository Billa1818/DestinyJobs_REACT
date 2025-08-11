import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Abonnements = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('15 Février 2024');

  const plans = {
    basic: {
      name: "Basique",
      description: "Plan gratuit",
      icon: "fas fa-user",
      color: "bg-blue-500",
      price: 0,
      status: "inactive"
    },
    premium: {
      name: "Premium",
      description: "Plan actuel",
      icon: "fas fa-star",
      color: "bg-fuchsia-500",
      price: 15000,
      status: "active"
    },
    business: {
      name: "Business",
      description: "Plan supérieur",
      icon: "fas fa-building",
      color: "bg-purple-500",
      price: 45000,
      status: "inactive"
    },
    enterprise: {
      name: "Enterprise",
      description: "Plan entreprise",
      icon: "fas fa-crown",
      color: "bg-yellow-500",
      price: 150000,
      status: "inactive"
    }
  };

  const currentPlanData = plans[currentPlan];

  const handleUpgrade = (plan) => {
    navigate(`/paiement/${plan}`);
  };

  const handleCancel = () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
      alert('Abonnement annulé. Vous continuerez à bénéficier de vos avantages jusqu\'à la fin de la période payée.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <i className="fas fa-crown text-fuchsia-600 mr-3"></i>
              Mon abonnement
            </h1>
            <p className="text-gray-600">Gérez votre plan d'abonnement et vos factures</p>
          </div>
          <Link 
            to="/abonnements" 
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            Voir tous les plans
          </Link>
        </div>
      </div>

      {/* Plan actuel */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Plan actuel</h2>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentPlanData.color} text-white`}>
                <i className={`${currentPlanData.icon} text-2xl`}></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentPlanData.name}</h3>
                <p className="text-gray-600">{currentPlanData.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="text-gray-500">
                    <i className="fas fa-calendar mr-1"></i>
                    Prochain paiement : {nextBillingDate}
                  </span>
                  <span className="text-gray-500">
                    <i className="fas fa-credit-card mr-1"></i>
                    {billingCycle === 'monthly' ? 'Facturation mensuelle' : 'Facturation annuelle'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {currentPlanData.price === 0 ? 'Gratuit' : `${currentPlanData.price.toLocaleString()} FCFA`}
              </div>
              <div className="text-sm text-gray-500">
                par {billingCycle === 'monthly' ? 'mois' : 'an'}
              </div>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mt-2">
                Actif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleUpgrade('business')}
          className="bg-fuchsia-600 text-white p-4 rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          <i className="fas fa-arrow-up text-xl mb-2"></i>
          <h3 className="font-semibold mb-1">Passer au plan Business</h3>
          <p className="text-sm opacity-90">Accédez à plus de fonctionnalités</p>
        </button>
        
        <button
          onClick={() => handleUpgrade('enterprise')}
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          <i className="fas fa-crown text-xl mb-2"></i>
          <h3 className="font-semibold mb-1">Plan Enterprise</h3>
          <p className="text-sm opacity-90">Solution sur mesure</p>
        </button>
        
        <button
          onClick={handleCancel}
          className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition duration-200"
        >
          <i className="fas fa-times text-xl mb-2"></i>
          <h3 className="font-semibold mb-1">Annuler l'abonnement</h3>
          <p className="text-sm opacity-90">Arrêter le renouvellement</p>
        </button>
      </div>

      {/* Historique des factures */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Historique des factures</h2>
        
        <div className="space-y-4">
          {[
            { id: 1, date: '15 Janvier 2024', amount: 15000, status: 'payé', description: 'Abonnement Premium - Janvier 2024' },
            { id: 2, date: '15 Décembre 2023', amount: 15000, status: 'payé', description: 'Abonnement Premium - Décembre 2023' },
            { id: 3, date: '15 Novembre 2023', amount: 15000, status: 'payé', description: 'Abonnement Premium - Novembre 2023' }
          ].map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-invoice text-gray-600"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{invoice.description}</h3>
                  <p className="text-sm text-gray-500">{invoice.date}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {invoice.amount.toLocaleString()} FCFA
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'payé' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-fuchsia-600 hover:text-fuchsia-800 font-medium">
            Voir toutes les factures
          </button>
        </div>
      </div>

      {/* Informations de paiement */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de paiement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Méthode de paiement</h3>
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-credit-card text-gray-600"></i>
              <div>
                <p className="font-medium text-gray-900">Carte bancaire</p>
                <p className="text-sm text-gray-500">**** **** **** 1234</p>
              </div>
              <button className="text-fuchsia-600 hover:text-fuchsia-800 text-sm">
                Modifier
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Informations de facturation</h3>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">Jean Dupont</p>
              <p className="text-sm text-gray-500">jean.dupont@email.com</p>
              <p className="text-sm text-gray-500">+229 21 30 45 67</p>
              <button className="text-fuchsia-600 hover:text-fuchsia-800 text-sm mt-2">
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Besoin d'aide ?</h2>
            <p className="opacity-90">Notre équipe support est là pour vous aider</p>
          </div>
          <div className="flex space-x-3">
            <Link 
              to="/contact" 
              className="bg-white text-fuchsia-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
            >
              <i className="fas fa-envelope mr-2"></i>
              Contact
            </Link>
            <button className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium">
              <i className="fas fa-question-circle mr-2"></i>
              FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Abonnements; 