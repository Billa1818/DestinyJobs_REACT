import React, { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment doit être utilisé dans PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('Vous devez souscrire à un plan pour accéder à cette fonctionnalité.');

  const triggerPaymentModal = (message = 'Vous devez souscrire à un plan pour accéder à cette fonctionnalité.') => {
    setPaymentMessage(message);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  // Écouter les événements d'erreur de paiement de l'interceptor API
  useEffect(() => {
    const handlePaymentError = (event) => {
      const message = event.detail?.message || 'Vous devez souscrire à un plan pour accéder à cette fonctionnalité.';
      triggerPaymentModal(message);
    };

    window.addEventListener('payment-required', handlePaymentError);

    return () => {
      window.removeEventListener('payment-required', handlePaymentError);
    };
  }, []);

  return (
    <PaymentContext.Provider value={{ showPaymentModal, paymentMessage, triggerPaymentModal, closePaymentModal }}>
      {children}
    </PaymentContext.Provider>
  );
};
