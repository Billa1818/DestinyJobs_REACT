import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import subscriptionService from '../../services/subscriptionService';

const PlanManager = () => {
  const { user } = useAuth();
  
  // État pour les abonnements et plans
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  // État pour les modales et chargement
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Charge toutes les données
   */
  const loadData = async () => {
    setLoading(true);
    try {
      // Charger en parallèle
      const [subscription, plans, payments, invoices] = await Promise.all([
        subscriptionService.getCurrentSubscription().catch(() => null),
        subscriptionService.getAvailablePlans(),
        subscriptionService.getPaymentHistory(),
        subscriptionService.getInvoices()
      ]);

      setCurrentSubscription(subscription);
      setAvailablePlans(plans || []);
      setPaymentHistory(payments || []);
      setInvoices(invoices || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Annule l'abonnement actuel
   */
  const handleCancelSubscription = async () => {
    setProcessingPayment(true);
    try {
      await subscriptionService.cancelSubscription();
      toast.success('Abonnement annulé avec succès');
      setShowCancelModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'annulation de l\'abonnement');
    } finally {
      setProcessingPayment(false);
    }
  };

  /**
   * Souscrire à un nouveau plan
   */
  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedDuration) {
      toast.error('Veuillez sélectionner un plan et une durée');
      return;
    }

    setProcessingPayment(true);
    try {
      const result = await subscriptionService.subscribe(
        selectedPlan.id,
        selectedDuration.id,
        selectedPlan.price === '0.00' ? 'FREE' : 'STRIPE'
      );

      if (selectedPlan.price === '0.00') {
        // Plan gratuit
        toast.success('Abonnement gratuit activé avec succès');
        setShowSubscribeModal(false);
        setSelectedPlan(null);
        setSelectedDuration(null);
        loadData();
      } else {
        // Paiement Stripe requis
        if (result.stripe_session_url) {
          window.location.href = result.stripe_session_url;
        } else {
          toast.error('Erreur: URL de paiement introuvable');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la souscription:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la souscription');
    } finally {
      setProcessingPayment(false);
    }
  };

  /**
   * Formatte une date au format français
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Formatte un montant en FCFA
   */
  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(numPrice);
  };

  /**
   * Vérifie si le plan actuel est FREE
   */
  const isFreePlan = () => {
    return currentSubscription?.plan_details?.plan_type === 'FREE' || currentSubscription?.plan_details?.price === '0.00';
  };

  /**
   * Obtient le badge de statut
   */
  const getStatusBadge = (status) => {
    const badges = {
      'ACTIVE': <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><i className="fas fa-check mr-1"></i>Actif</span>,
      'CANCELED': <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><i className="fas fa-times mr-1"></i>Annulé</span>,
      'PENDING': <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i className="fas fa-hourglass-half mr-1"></i>En attente</span>,
    };
    return badges[status] || <span className="text-xs text-gray-600">{status}</span>;
  };

  /**
   * Obtient le badge de statut de paiement
   */
  const getPaymentStatusBadge = (status) => {
    const badges = {
      'COMPLETED': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i className="fas fa-check mr-1"></i>Complété</span>,
      'PENDING': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><i className="fas fa-hourglass-half mr-1"></i>En attente</span>,
      'FAILED': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><i className="fas fa-times mr-1"></i>Échoué</span>,
      'REFUNDED': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i className="fas fa-undo mr-1"></i>Remboursé</span>,
    };
    return badges[status] || <span className="text-xs text-gray-600">{status}</span>;
  };

  /**
   * Obtient le badge de statut de facture
   */
  const getInvoiceStatusBadge = (status) => {
    const badges = {
      'DRAFT': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><i className="fas fa-file mr-1"></i>Brouillon</span>,
      'SENT': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i className="fas fa-paper-plane mr-1"></i>Envoyée</span>,
      'VIEWED': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><i className="fas fa-eye mr-1"></i>Consultée</span>,
      'PAID': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i className="fas fa-check mr-1"></i>Payée</span>,
      'CANCELLED': <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><i className="fas fa-times mr-1"></i>Annulée</span>,
    };
    return badges[status] || <span className="text-xs text-gray-600">{status}</span>;
  };

  return (
    <main className="flex-1 bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-layer-group text-fuchsia-600 mr-3"></i>
            Gestion des Abonnements
          </h1>
          <p className="text-gray-600 mt-2">Gérez votre plan d'abonnement et vos paiements</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'current'
                  ? 'border-fuchsia-600 text-fuchsia-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-check-circle mr-2"></i>Abonnement Actuel
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'plans'
                  ? 'border-fuchsia-600 text-fuchsia-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-star mr-2"></i>Tous les Plans
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-fuchsia-600 text-fuchsia-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-credit-card mr-2"></i>Paiements
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'invoices'
                  ? 'border-fuchsia-600 text-fuchsia-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-file-invoice mr-2"></i>Factures
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-12">
            <LoadingSpinner variant="inline" size="lg" text="Chargement de vos informations d'abonnement..." />
          </div>
        ) : (
        <>
        {/* Abonnement Actuel */}
        {activeTab === 'current' && (
          <div className="space-y-6">
            {currentSubscription ? (
              <>
                {/* Plan Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentSubscription.plan_details?.name}
                      </h2>
                      <p className="text-gray-600">{currentSubscription.plan_details?.description}</p>
                    </div>
                    <div>
                      {getStatusBadge(currentSubscription.status)}
                    </div>
                  </div>

                  {/* Details Grid - Masqué pour les plans FREE */}
                  {!isFreePlan() && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Prix mensuel</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(currentSubscription.plan_details?.price)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Date de début</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(currentSubscription.start_date)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Date d'expiration</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(currentSubscription.end_date)}
                        </p>
                      </div>
                      <div className="bg-fuchsia-50 rounded-lg p-4">
                        <p className="text-sm text-fuchsia-600 mb-1">Jours restants</p>
                        <p className="text-xl font-bold text-fuchsia-600">
                          {currentSubscription.days_remaining || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Auto-renewal info */}
                  {currentSubscription.is_auto_renew && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-800">
                        <i className="fas fa-refresh mr-2"></i>
                        Renouvellement automatique activé
                        {currentSubscription.renewal_date && (
                          <span> - Prochain renouvellement: {formatDate(currentSubscription.renewal_date)}</span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {currentSubscription.status === 'ACTIVE' && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowSubscribeModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors"
                      >
                        <i className="fas fa-arrow-up mr-2"></i>
                        Changer de plan
                      </button>
                      {/* Bouton Annuler caché pour les plans FREE */}
                      {!isFreePlan() && (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <i className="fas fa-times mr-2"></i>
                          Annuler l'abonnement
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun abonnement actif</h3>
                <p className="text-gray-600 mb-6">Vous n'avez pas encore d'abonnement. Explorez nos plans pour commencer.</p>
                <button
                  onClick={() => {
                    setActiveTab('plans');
                    setShowSubscribeModal(true);
                  }}
                  className="inline-flex items-center px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors"
                >
                  <i className="fas fa-star mr-2"></i>
                  Voir les plans
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tous les Plans */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-600 ml-2">/mois</span>
                    </div>
                  </div>

                  {/* Durations - Masqué pour les plans FREE */}
                  {plan.price !== '0.00' && plan.plan_type !== 'FREE' && (
                    <div className="p-6 space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Durées disponibles:</h4>
                      {plan.durations && plan.durations.length > 0 ? (
                        plan.durations.map((duration) => (
                          <button
                            key={duration.id}
                            onClick={() => {
                              setSelectedPlan(plan);
                              setSelectedDuration(duration);
                              setShowSubscribeModal(true);
                            }}
                            className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:border-fuchsia-600 hover:bg-fuchsia-50 transition-colors text-sm"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{duration.duration_months} mois</span>
                              <div className="text-right">
                                {duration.discount_percentage > 0 && (
                                  <span className="text-green-600 font-semibold mr-2">-{duration.discount_percentage}%</span>
                                )}
                                <span className="text-gray-900 font-semibold">{formatPrice(duration.discounted_price)}</span>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">Aucune durée disponible</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paiements */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {paymentHistory && paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.payment_method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getPaymentStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {payment.transaction_reference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                <p>Aucun paiement enregistré</p>
              </div>
            )}
          </div>
        )}

        {/* Factures */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {invoices && invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'émission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatPrice(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(invoice.issued_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getInvoiceStatusBadge(invoice.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                <p>Aucune facture enregistrée</p>
              </div>
            )}
            </div>
            )}
            </>
            )}
            </div>

            {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-red-100">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Annuler l'abonnement</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir annuler votre abonnement? Vous perdrez accès aux fonctionnalités premium à la fin de la période de facturation.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={processingPayment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {processingPayment ? 'Traitement...' : 'Confirmer l\'annulation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Modal */}
      {showSubscribeModal && selectedPlan && selectedDuration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la souscription</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold text-gray-900">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-semibold text-gray-900">{selectedDuration.duration_months} mois</span>
                </div>
                {selectedDuration.discount_percentage > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction:</span>
                    <span className="font-semibold">-{selectedDuration.discount_percentage}%</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-fuchsia-600 text-lg">
                    {formatPrice(selectedDuration.discounted_price)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSubscribeModal(false);
                    setSelectedPlan(null);
                    setSelectedDuration(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={processingPayment}
                  className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 disabled:opacity-50 transition-colors"
                >
                  {processingPayment ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PlanManager;
