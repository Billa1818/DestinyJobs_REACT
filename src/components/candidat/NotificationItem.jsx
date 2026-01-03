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

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${
      notification.isRead ? 'bg-white' : 'bg-fuchsia-50'
    }`}>
      <div className="flex items-start space-x-4">
        {/* Checkbox de sélection */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(notification.id)}
          className="mt-1 h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
        />
        
        {/* Contenu de la notification */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h3>
              
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              
              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                {notification.createdAt && (
                  <span>
                    <i className="fas fa-clock mr-1"></i>
                    {formatDate(notification.createdAt)}
                  </span>
                )}
                {notification.readAt && (
                  <span>
                    <i className="fas fa-check mr-1"></i>
                    Lu le {formatDate(notification.readAt)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead([notification.id])}
                className="text-fuchsia-600 hover:text-fuchsia-700 text-xs font-medium ml-4 whitespace-nowrap"
              >
                <i className="fas fa-check mr-1"></i>Marquer comme lu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
