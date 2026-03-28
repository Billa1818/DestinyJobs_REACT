import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

const ChatbotWidget = () => {
  const { messages, isOpen, loading, error, sendMessage, clearHistory, toggleChatbot, isInitialized, rateMessage } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const [ratingMessageId, setRatingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && !loading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRate = (messageId, rating) => {
    rateMessage(messageId, rating, '');
    setRatingMessageId(null);
  };

  // Si le contexte n'est pas initialisé, afficher un bouton désactivé
  if (!isInitialized) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          disabled
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={toggleChatbot}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse"
            title="Ouvrir le chatbot"
            aria-label="Ouvrir le chatbot"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* Widget de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-24px)] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[600px] animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <div>
                <h2 className="font-semibold text-lg">Assistant IA</h2>
                <p className="text-xs text-blue-100">
                  {loading ? 'Composition...' : 'Prêt à vous aider'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleChatbot}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
              aria-label="Fermer le chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center py-8">
                <MessageCircle size={40} className="mb-2 opacity-50" />
                <p className="text-sm">Bienvenue! Posez-moi une question...</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[80%]">
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          msg.role === 'USER'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : msg.role === 'error'
                            ? 'bg-red-100 text-red-800 rounded-bl-none'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Rating buttons for assistant messages */}
                      {msg.role === 'ASSISTANT' && !msg.user_rating && ratingMessageId !== msg.id && (
                        <div className="flex gap-2 mt-1 text-gray-400 text-xs">
                          <button
                            onClick={() => handleRate(msg.id, 5)}
                            className="hover:text-green-500 transition-colors"
                            title="Bonne réponse"
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleRate(msg.id, 1)}
                            className="hover:text-red-500 transition-colors"
                            title="Mauvaise réponse"
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      )}

                      {/* Show rating confirmation */}
                      {msg.role === 'ASSISTANT' && msg.user_rating && (
                        <p className="text-xs text-green-600 mt-1">✓ Votre avis a été enregistré</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 rounded-bl-none flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-t border-red-200 p-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white space-y-2">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre question..."
                disabled={loading}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm disabled:bg-gray-100"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Envoyer"
                aria-label="Envoyer"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Actions */}
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-gray-900 p-1 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                Effacer l'historique
              </button>
            )}
          </div>
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;
