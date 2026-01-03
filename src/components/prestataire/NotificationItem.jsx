import React from 'react';

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onSelect, 
  isSelected 
}) => {
  const getNotificationIcon = (type) => {
    const iconMap = {
      'NEW_OFFER_MATCH': 'fas fa-briefcase',
      'APPLICATION_STATUS': 'fas fa-file-alt',
      'AI_SERVICE_UPDATE': 'fas fa-robot',
      'SUBSCRIPTION_EXPIRING': 'fas fa-credit-card',
      'SYSTEM_UPDATE': 'fas fa-cog',
      'MESSAGE_RECEIVED': 'fas fa-envelope',
      'BLOG_POST_PUBLISHED': 'fas fa-newspaper',
      'DAILY_DIGEST': 'fas fa-calendar-day',
      'WEEKLY_REPORT': 'fas fa-chart-line'
    };
    
    return iconMap[type] || 'fas fa-bell';
  };

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${
      notification.is_read ? 'bg-white' : 'bg-orange-50'
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
              <div className="flex items-center space-x-3 mb-2">
                <i className={`${getNotificationIcon(notification.notification_type)} text-orange-600`}></i>
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.priorityColor}`}>
                  {notification.priorityText}
                </span>
              </div>
              
              <p className="text-gray-700 mb-2">{notification.message}</p>
              
              <span className="text-sm text-gray-500">
                <i className="fas fa-clock mr-1"></i>
                {notification.timeAgo}
              </span>
            </div>
            
            {/* Actions */}
            {!notification.is_read && (
              <button
                onClick={() => onMarkAsRead([notification.id])}
                className="text-orange-600 hover:text-orange-700 text-xs font-medium ml-4 whitespace-nowrap"
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
