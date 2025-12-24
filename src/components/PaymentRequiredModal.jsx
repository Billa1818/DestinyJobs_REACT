import React from 'react';
import { usePayment } from '../contexts/PaymentContext';

const PaymentRequiredModal = () => {
  const { showPaymentModal, paymentMessage, closePaymentModal } = usePayment();

  const handleGoToPlans = () => {
    closePaymentModal();
    window.location.href = '/plan-manager';
  };

  if (!showPaymentModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <i className="fas fa-lock text-yellow-600 text-xl"></i>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Accès limité</h3>
          </div>
          <p className="text-gray-600 mb-6">
            {paymentMessage}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closePaymentModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={handleGoToPlans}
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors flex items-center"
            >
              <i className="fas fa-layer-group mr-2"></i>
              Voir les plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequiredModal;
