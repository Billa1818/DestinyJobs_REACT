import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './components/MessageManager';
import { PaymentProvider } from './contexts/PaymentContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import AuthErrorHandler from './components/auth/AuthErrorHandler';
import PaymentRequiredModal from './components/PaymentRequiredModal';
import AppRouter from './routers';

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <PaymentProvider>
          <ChatbotProvider>
            <AuthErrorHandler>
              <div className="App">
                <AppRouter />
                <PaymentRequiredModal />
              </div>
            </AuthErrorHandler>
          </ChatbotProvider>
        </PaymentProvider>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
