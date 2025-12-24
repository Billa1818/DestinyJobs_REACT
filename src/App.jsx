import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './components/MessageManager';
import { PaymentProvider } from './contexts/PaymentContext';
import AuthErrorHandler from './components/auth/AuthErrorHandler';
import PaymentRequiredModal from './components/PaymentRequiredModal';
import AppRouter from './routers';

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <PaymentProvider>
          <AuthErrorHandler>
            <div className="App">
              <AppRouter />
              <PaymentRequiredModal />
            </div>
          </AuthErrorHandler>
        </PaymentProvider>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
