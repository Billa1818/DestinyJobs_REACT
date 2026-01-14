import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanAbonnement = () => {
  const [selectedProfile, setSelectedProfile] = useState('candidat');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const navigate = useNavigate();

  // Configuration des plans
  const plansData = {
    candidat: {
      name: 'Candidat',
      icon: 'fas fa-user-tie',
      isRecruteur: false,
      plans: [
        {
          type: 'FREE',
          basePrice: 0,
          visibility: '10/100',
          avantages: [
            '1 candidature emploi/mois',
            '1 candidature financement/mois',
            'Profil de base',
            'Accès à la plateforme'
          ]
        },
        {
          type: 'STANDARD',
          basePrice: 30000,
          visibility: '60/100',
          avantages: [
            '3 candidatures emploi/mois',
            '3 candidatures financement/mois',
            'Profil amélioré',
            'Visibilité moyenne'
          ]
        },
        {
          type: 'PRO',
          basePrice: 30000,
          visibility: '90/100',
          avantages: [
            'Candidatures emploi illimitées',
            'Candidatures financement illimitées',
            'Profil premium',
            'Visibilité maximale'
          ]
        }
      ]
    },
    prestataire: {
      name: 'Prestataire',
      icon: 'fas fa-briefcase',
      isRecruteur: false,
      plans: [
        {
          type: 'FREE',
          basePrice: 0,
          visibility: '10/100',
          avantages: [
            '1 consultation/mois',
            'Profil de base',
            'Accès à la plateforme',
            'Visibilité minimale'
          ]
        },
        {
          type: 'STANDARD',
          basePrice: 30000,
          visibility: '60/100',
          avantages: [
            '3 consultations/mois',
            'Profil amélioré',
            'Visibilité moyenne',
            'Accès prioritaire'
          ]
        },
        {
          type: 'PRO',
          basePrice: 30000,
          visibility: '90/100',
          avantages: [
            'Consultations illimitées',
            'Profil premium',
            'Visibilité maximale',
            'Support prioritaire'
          ]
        }
      ]
    },
    recruteur: {
      name: 'Recruteur',
      icon: 'fas fa-building',
      isRecruteur: true,
      plans: [
        {
          type: 'FREE',
          basePrice: 0,
          avantages: [
            '1 offre emploi active',
            '1 offre financement active',
            '1 offre consultation active',
            'Profil de base'
          ]
        },
        {
          type: 'STANDARD',
          basePrice: 50000,
          avantages: [
            '3 offres emploi actives',
            '3 offres financement actives',
            '3 offres consultation actives',
            'Profil amélioré'
          ]
        },
        {
          type: 'PRO',
          basePrice: 75000,
          avantages: [
            'Offres emploi illimitées',
            'Offres financement illimitées',
            'Offres consultation illimitées',
            'Profil premium'
          ]
        }
      ]
    }
  };

  const durations = [
    { months: 1, label: '1 mois', discount: 0 },
    { months: 3, label: '3 mois', discount: 0 },
    { months: 6, label: '6 mois', discount: 5 },
    { months: 12, label: '12 mois', discount: 16.67 }
  ];

  const calculatePrice = (basePrice, months, discount) => {
    if (basePrice === 0) return 0;
    const totalPrice = basePrice * months;
    const discountedPrice = totalPrice * (1 - discount / 100);
    return Math.round(discountedPrice);
  };

  const currentPlans = plansData[selectedProfile].plans;
  const isRecruteur = plansData[selectedProfile].isRecruteur;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Plans d'Abonnement
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez le plan adapté à vos besoins
          </p>
        </div>

        {/* Profile Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(plansData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedProfile(key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                selectedProfile === key
                  ? 'bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <i className={data.icon}></i>
              {data.name}
            </button>
          ))}
        </div>

        {/* Duration Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {durations.map((duration) => (
            <button
              key={duration.months}
              onClick={() => setSelectedDuration(duration.months)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                selectedDuration === duration.months
                  ? 'bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {duration.label}
              {duration.discount > 0 && (
                <span className="ml-2 text-sm font-bold">
                  -{duration.discount.toFixed(2)}%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {currentPlans.map((plan, index) => {
            const duration = durations.find(d => d.months === selectedDuration);
            const monthlyPrice = plan.basePrice;
            const totalPrice = calculatePrice(monthlyPrice, duration.months, duration.discount);
            const pricePerMonth = duration.months > 1 ? Math.round(totalPrice / duration.months) : totalPrice;

            return (
              <div
                key={index}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.type === 'PRO' ? 'ring-2 ring-offset-2 ring-fuchsia-400 transform scale-105 md:scale-100' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.type === 'PRO' && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white py-2 text-center font-bold text-sm flex items-center justify-center gap-2">
                    <i className="fas fa-star"></i>
                    POPULAIRE
                  </div>
                )}

                <div className={`bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white pt-8 px-6 pb-6 ${plan.type === 'PRO' ? 'mt-8' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.type}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{totalPrice.toLocaleString('fr-FR')}</span>
                    <span className="ml-2 text-sm opacity-90">FCFA</span>
                  </div>
                  <p className="text-sm opacity-90 mt-2">
                    {duration.months === 1
                      ? '/mois'
                      : `${duration.months} mois (${pricePerMonth.toLocaleString('fr-FR')} FCFA/mois)`}
                  </p>
                </div>

                <div className="px-6 py-8">
                  {/* Visibilité - seulement pour non-recruteurs */}
                  {!isRecruteur && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-fuchsia-50 to-orange-50 rounded-lg border-l-4 border-fuchsia-500">
                      <p className="text-sm font-semibold text-fuchsia-700 mb-2 flex items-center gap-2">
                        <i className="fas fa-eye"></i>
                        Visibilité du Profil
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{plan.visibility}</p>
                    </div>
                  )}

                  {/* Avantages */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-check-circle text-fuchsia-600"></i>
                      Avantages
                    </h4>
                    <ul className="space-y-3">
                      {plan.avantages.map((avantage, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-br from-fuchsia-100 to-orange-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                            <i className="text-xs text-fuchsia-600 fas fa-check"></i>
                          </span>
                          <span className="text-gray-700 text-sm">{avantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      if (plan.basePrice === 0) {
                        navigate('/signup');
                      } else {
                        navigate('/plan-manager');
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      plan.type === 'PRO'
                        ? 'bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white hover:shadow-lg'
                        : plan.basePrice === 0
                        ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <i className={`fas ${plan.basePrice === 0 ? 'fa-rocket' : 'fa-shopping-cart'}`}></i>
                    {plan.basePrice === 0
                      ? 'Commencer Gratuitement'
                      : 'Souscrire Maintenant'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparatif Tableau */}
        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex items-center gap-3">
            <i className="fas fa-table text-xl"></i>
            <h2 className="text-2xl font-bold">Comparatif Complet</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Plan</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">1 mois</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">3 mois</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">6 mois</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">12 mois</th>
                </tr>
              </thead>
              <tbody>
                {currentPlans.map((plan, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{plan.type}</td>
                    {durations.map((duration) => {
                      const price = calculatePrice(plan.basePrice, duration.months, duration.discount);
                      return (
                        <td key={duration.months} className="px-6 py-4 text-gray-700">
                          {price === 0 ? (
                            <span className="font-semibold text-fuchsia-600 flex items-center gap-1">
                              <i className="fas fa-check"></i>
                              Gratuit
                            </span>
                          ) : (
                            <div>
                              <span className="font-semibold text-gray-900">
                                {price.toLocaleString('fr-FR')} FCFA
                              </span>
                              <p className="text-sm text-gray-500">
                                {Math.round(price / duration.months).toLocaleString('fr-FR')}/mois
                              </p>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 flex items-center justify-center gap-3">
            <i className="fas fa-circle-question text-fuchsia-600"></i>
            Questions Fréquentes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: 'Puis-je changer de plan à tout moment ?',
                answer: 'Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements seront facturés au prorata.'
              },
              {
                question: 'Y a-t-il une période d\'essai ?',
                answer: 'Le plan FREE est gratuit à vie. Vous pouvez l\'utiliser sans limite de temps pour tester la plateforme.'
              },
              {
                question: 'Que signifie la visibilité du profil ?',
                answer: 'La visibilité affecte la probabilité que votre profil soit découvert par d\'autres utilisateurs. Un score de 90/100 signifie une visibilité maximale.'
              },
              {
                question: 'Comment fonctionnent les réductions ?',
                answer: 'Les réductions s\'appliquent automatiquement : 5% pour 6 mois et 16.67% pour 12 mois.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-gradient-to-b from-fuchsia-600 to-orange-500">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="fas fa-lightbulb text-orange-500"></i>
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-16 bg-gradient-to-r from-fuchsia-600 to-orange-500 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <i className="fas fa-rocket"></i>
            Prêt à démarrer ?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Rejoignez des milliers d'utilisateurs qui font confiance à DestinyJobs
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-fuchsia-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center gap-2"
          >
            <i className="fas fa-user-plus"></i>
            Créer un compte gratuit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanAbonnement;
