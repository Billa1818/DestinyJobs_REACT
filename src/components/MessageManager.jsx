import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Contexte pour les messages
const MessageContext = createContext();

// Hook personnalisé pour utiliser le gestionnaire de messages
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage doit être utilisé dans un MessageProvider');
  }
  return context;
};

// Composant de message individuel
const Message = ({ message, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  console.log('Message: Rendu du message:', message.id, 'Type:', message.type, 'Visible:', isVisible);

  React.useEffect(() => {
    console.log('Message: useEffect pour le message:', message.id);
    // Animation d'entrée
    const timer = setTimeout(() => {
      console.log('Message: Affichage du message:', message.id);
      setIsVisible(true);
    }, 10);
    
    // Auto-suppression après délai
    const autoRemove = setTimeout(() => {
      console.log('Message: Auto-suppression du message:', message.id);
      setIsVisible(false);
      setTimeout(() => onRemove(message.id), 300);
    }, message.duration || 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoRemove);
    };
  }, [message.id, message.duration, onRemove]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(message.id), 300);
  };

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeStyles = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`
        fixed top-20 right-4 z-[9999] max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        rounded-lg border p-4 shadow-lg
        ${getTypeStyles()}
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`
              ${message.type === 'success' ? 'text-green-400' : ''}
              ${message.type === 'error' ? 'text-red-400' : ''}
              ${message.type === 'warning' ? 'text-yellow-400' : ''}
              ${message.type === 'info' ? 'text-blue-400' : ''}
            `}>
              {getIcon()}
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message.title}</p>
            {message.message && (
              <p className="mt-1 text-sm opacity-90">{message.message}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleRemove}
              className={`
                inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${message.type === 'success' ? 'text-green-400 hover:bg-green-100 focus:ring-green-500' : ''}
                ${message.type === 'error' ? 'text-red-400 hover:bg-red-100 focus:ring-red-500' : ''}
                ${message.type === 'warning' ? 'text-yellow-400 hover:bg-yellow-100 focus:ring-yellow-500' : ''}
                ${message.type === 'info' ? 'text-blue-400 hover:bg-blue-100 focus:ring-blue-500' : ''}
              `}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant conteneur des messages
const MessageContainer = ({ messages, onRemove }) => {
  return createPortal(
    <div className="fixed top-20 right-0 z-[9999] p-4 space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onRemove={onRemove}
        />
      ))}
    </div>,
    document.body
  );
};

// Provider principal
export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((messageData) => {
    const id = Date.now() + Math.random();
    const message = {
      id,
      type: messageData.type || 'info',
      title: messageData.title || messageData.message || 'Message',
      message: messageData.message || messageData.title || '',
      duration: messageData.duration || 5000,
    };

    console.log('MessageManager: Ajout d\'un message:', message);
    setMessages(prev => {
      const newMessages = [...prev, message];
      console.log('MessageManager: Messages mis à jour:', newMessages);
      return newMessages;
    });
    return id;
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Méthodes de commodité
  const success = useCallback((title, message = '', duration) => {
    return addMessage({ type: 'success', title, message, duration });
  }, [addMessage]);

  const error = useCallback((title, message = '', duration) => {
    return addMessage({ type: 'error', title, message, duration });
  }, [addMessage]);

  const warning = useCallback((title, message = '', duration) => {
    return addMessage({ type: 'warning', title, message, duration });
  }, [addMessage]);

  const info = useCallback((title, message = '', duration) => {
    return addMessage({ type: 'info', title, message, duration });
  }, [addMessage]);

  const value = {
    addMessage,
    removeMessage,
    clearMessages,
    success,
    error,
    warning,
    info,
    messages,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
      <MessageContainer messages={messages} onRemove={removeMessage} />
    </MessageContext.Provider>
  );
};

export default MessageProvider; 