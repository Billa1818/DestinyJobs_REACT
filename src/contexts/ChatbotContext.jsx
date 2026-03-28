import React, { createContext, useContext, useState, useEffect } from 'react';
import chatbotService from '../services/chatbotService';

// Créer le contexte du chatbot
const ChatbotContext = createContext({});

// Hook personnalisé pour utiliser le contexte du chatbot
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot doit être utilisé dans un ChatbotProvider');
  }
  return context;
};

// Provider du contexte du chatbot
export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // Historique des messages
  const [sessionId, setSessionId] = useState(null); // ID de la session actuelle
  const [sessions, setSessions] = useState([]); // Liste des sessions
  const [isOpen, setIsOpen] = useState(false); // Widget ouvert/fermé
  const [loading, setLoading] = useState(false); // En cours d'envoi
  const [error, setError] = useState(null); // Message d'erreur
  const [isInitialized, setIsInitialized] = useState(false); // Contexte initialisé

  // Initialiser le contexte au chargement
  useEffect(() => {
    initializeChatbot();
  }, []);

  /**
   * Initialise le chatbot - charge la session et les messages du localStorage
   */
  const initializeChatbot = () => {
    try {
      // Charger la session depuis le localStorage
      const savedSessionId = localStorage.getItem('chatbot_session_id');
      const savedMessages = localStorage.getItem('chatbot_messages');

      if (savedSessionId) {
        setSessionId(savedSessionId);
      }

      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.warn('Impossible de charger les messages sauvegardés', e);
        }
      }

      setIsInitialized(true);
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du chatbot:', err);
      setIsInitialized(true);
    }
  };

  /**
   * Crée une nouvelle session
   */
  const startNewSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await chatbotService.createSession('New Chat');

      if (result.success) {
        const newSessionId = result.data.id;
        setSessionId(newSessionId);
        setMessages([]);

        // Ajouter à la liste des sessions
        setSessions((prev) => [result.data, ...prev]);

        // Sauvegarder dans localStorage
        localStorage.setItem('chatbot_session_id', newSessionId);
        localStorage.setItem('chatbot_messages', JSON.stringify([]));

        return newSessionId;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      console.error('Erreur création session:', err);
      setError('Erreur lors de la création de la session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Envoie un message au chatbot
   * @param {string} content - Contenu du message à envoyer
   */
  const sendMessage = async (content) => {
    if (!content.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Créer une nouvelle session si nécessaire
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await startNewSession();
        if (!currentSessionId) {
          setError('Impossible de créer une session');
          return;
        }
      }

      // Envoyer le message au backend
      const result = await chatbotService.sendMessage(currentSessionId, content);

      if (result.success) {
        // Backend retourne user_message et assistant_message
        const userMsg = result.data.user_message;
        const assistantMsg = result.data.assistant_message;

        const updatedMessages = [
          ...messages,
          {
            id: userMsg.id,
            role: userMsg.role,
            content: userMsg.content,
            timestamp: userMsg.created_at,
            tokens_used: userMsg.tokens_used,
            processing_time: userMsg.processing_time,
          },
          {
            id: assistantMsg.id,
            role: assistantMsg.role,
            content: assistantMsg.content,
            timestamp: assistantMsg.created_at,
            tokens_used: assistantMsg.tokens_used,
            processing_time: assistantMsg.processing_time,
          },
        ];

        setMessages(updatedMessages);
        // Sauvegarder dans localStorage
        localStorage.setItem('chatbot_messages', JSON.stringify(updatedMessages));
      } else {
        // Ajouter un message d'erreur
        const errorMessage = {
          id: `error-${Date.now()}`,
          role: 'error',
          content: result.error,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        setError(result.error);
      }
    } catch (err) {
      console.error('Erreur envoi message:', err);
      const errorMsg = err.message || 'Erreur lors de l\'envoi du message';
      setError(errorMsg);

      // Ajouter le message d'erreur
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'error',
        content: errorMsg,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charge les messages d'une session existante
   */
  const loadSession = async (loadSessionId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await chatbotService.getSession(loadSessionId);

      if (result.success) {
        setSessionId(loadSessionId);
        // Backend retourne les messages dans result.data.messages
        const loadedMessages = (result.data.messages || []).map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at,
          tokens_used: msg.tokens_used,
          processing_time: msg.processing_time,
          user_rating: msg.user_rating,
          user_feedback: msg.user_feedback,
        }));

        setMessages(loadedMessages);
        localStorage.setItem('chatbot_session_id', loadSessionId);
        localStorage.setItem('chatbot_messages', JSON.stringify(loadedMessages));
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Erreur chargement session:', err);
      setError('Erreur lors du chargement de la session');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charge la liste des sessions de l'utilisateur
   */
  const loadSessions = async () => {
    try {
      const result = await chatbotService.getSessions();

      if (result.success) {
        // Backend retourne un tableau de sessions ou { results: [...] } selon DRF
        const sessionList = Array.isArray(result.data) ? result.data : result.data.results || [];
        setSessions(sessionList);
      } else {
        console.error('Erreur récupération sessions:', result.error);
      }
    } catch (err) {
      console.error('Erreur chargement sessions:', err);
    }
  };

  /**
   * Efface la session courante et réinitialise le chat
   */
  const clearHistory = async () => {
    try {
      setLoading(true);
      // Supprimer la session du backend
      if (sessionId) {
        await chatbotService.deleteSession(sessionId);
      }

      // Réinitialiser localement
      setMessages([]);
      setSessionId(null);
      setError(null);

      // Nettoyer le localStorage
      localStorage.removeItem('chatbot_session_id');
      localStorage.removeItem('chatbot_messages');

      // Créer une nouvelle session
      await startNewSession();
    } catch (err) {
      console.error('Erreur lors de la suppression de la session:', err);
      setError('Erreur lors de la suppression de la session');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Évalue un message de l'assistant
   */
  const rateMessage = async (messageId, rating, feedback = '') => {
    try {
      const result = await chatbotService.rateMessage(messageId, rating, feedback);

      if (result.success) {
        // Mettre à jour le message dans l'état local
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  user_rating: rating,
                  user_feedback: feedback,
                }
              : msg
          )
        );
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Erreur évaluation message:', err);
      setError('Erreur lors de l\'évaluation du message');
    }
  };

  /**
   * Toggle l'ouverture/fermeture du widget
   */
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  const value = {
    // State
    messages,
    sessionId,
    sessions,
    isOpen,
    loading,
    error,
    isInitialized,

    // Methods
    sendMessage,
    clearHistory,
    toggleChatbot,
    startNewSession,
    loadSession,
    loadSessions,
    rateMessage,
    setIsOpen,
    setError,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;
