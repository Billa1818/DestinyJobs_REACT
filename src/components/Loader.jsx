import React from 'react';

const Loader = ({ 
  size = 'md', 
  color = 'fuchsia', 
  text = 'Chargement...', 
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    fuchsia: 'border-fuchsia-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin ${colorClasses[color]}`}></div>
      {showText && text && (
        <p className="mt-3 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

export default Loader; 