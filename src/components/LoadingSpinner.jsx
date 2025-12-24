import React from 'react';

/**
 * Composant LoadingSpinner unifié pour toute l'application
 * Utilise le même style partout avec différentes tailles
 * 
 * @param {string} size - Taille du spinner: 'xs', 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} variant - Variante: 'full' (fullscreen), 'inline' (inline), 'page' (page loader) (default: 'inline')
 * @param {string} text - Texte optionnel à afficher
 * @param {string} className - Classes CSS additionnelles
 */
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'inline',
  text = null,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const containerClasses = {
    inline: 'flex items-center justify-center',
    page: 'flex items-center justify-center flex-1 w-full',
    full: 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
  };

  const spinner = (
    <div className={`${containerClasses[variant]} ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <div className={`${sizeClasses[size]} border-fuchsia-200 border-t-fuchsia-600 rounded-full animate-spin`}></div>
        {text && (
          <p className="mt-3 text-sm text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );

  return spinner;
};

export default LoadingSpinner;
