import React from 'react';

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onSelect, 
  isSelected 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTranslatedTitle = (type) => {
    switch (type) {
      case 'APPLICATION_STATUS':
        return 'Statut candidature';
      case 'AI_SERVICE_ERROR':
        return 'Erreur service IA';
      case 'AI_CREDIT_LOW':
        return 'Crédits IA faibles';
      case 'RECRUITER_ACCOUNT_PENDING':
        return 'Compte en attente';
      case 'RECRUITER_ACCOUNT_APPROVED':
        return 'Compte approuvé';
      case 'NEW_APPLICATION':
        return 'Nouvelle candidature';
      case 'CV_IMPROVEMENT_COMPLETE':
        return 'CV amélioré par IA';
      case 'ACCOUNTS_APPROVED':
        return 'Compte approuvé';
      case 'ACCOUNTS_PENDING':
        return 'Compte en attente';
      case 'ACCOUNTS_REJECTED':
        return 'Compte rejeté';
      case 'SYSTEM_UPDATE':
        return 'Mise à jour système';
      case 'NEW_OFFER_MATCH':
        return 'Nouvelle offre correspondante';
      case 'SUBSCRIPTION_UPDATE':
        return 'Mise à jour abonnement';
      case 'PAYMENT_SUCCESS':
        return 'Paiement réussi';
      case 'PAYMENT_FAILED':
        return 'Échec paiement';
      case 'MESSAGE_RECEIVED':
        return 'Message reçu';
      case 'REMINDER':
        return 'Rappel';
      case 'WELCOME':
        return 'Bienvenue';
      case 'SECURITY_ALERT':
        return 'Alerte sécurité';
      case 'MAINTENANCE':
        return 'Maintenance';
      default:
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors ${
      notification.is_read ? 'bg-white' : 'bg-blue-50'
    }`}>
      <div className="flex items-start space-x-4">
        {/* Checkbox de sélection */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(notification.id)}
          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        
        {/* Contenu de la notification */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  notification.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  notification.priority === 'URGENT' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {notification.priority_display || notification.priority}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {notification.notification_type_display || getTranslatedTitle(notification.notification_type)}
                </span>
                {notification.delivery_method_display && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {notification.delivery_method_display}
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {notification.title}
              </h3>
              
              <p className="text-gray-600 mb-3">
                {notification.message}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  <i className="fas fa-clock mr-1"></i>
                  {notification.time_since_created || formatDate(notification.created_at)}
                </span>
                {notification.read_at && (
                  <span>
                    <i className="fas fa-check mr-1"></i>
                    Lu le {formatDate(notification.read_at)}
                  </span>
                )}
                {notification.sent_at && (
                  <span>
                    <i className="fas fa-paper-plane mr-1"></i>
                    Envoyé le {formatDate(notification.sent_at)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              {!notification.is_read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  <i className="fas fa-check mr-1"></i>Marquer comme lu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
