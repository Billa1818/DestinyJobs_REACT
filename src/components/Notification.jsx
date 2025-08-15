import React, { useEffect } from 'react';

const Notification = ({ 
  type = 'info', 
  message, 
  isVisible, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'error':
        return 'fas fa-exclamation-circle text-red-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'info':
      default:
        return 'fas fa-info-circle text-blue-500';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg p-4 shadow-lg transition-all duration-300 ${getNotificationStyles()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className={`${getIcon()} text-lg`}></i>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification; 