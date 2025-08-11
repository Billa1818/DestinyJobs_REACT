import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { MessageProvider } from './components/MessageManager';
import AuthErrorHandler from './components/auth/AuthErrorHandler';
import AppRouter from './routers';

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <AuthErrorHandler>
          <div className="App">
            <AppRouter />
          </div>
        </AuthErrorHandler>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
