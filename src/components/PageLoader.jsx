import React from 'react';
import Loader from './Loader';

const PageLoader = ({ 
  text = 'Chargement de la page...', 
  size = 'lg',
  color = 'fuchsia',
  className = 'min-h-screen bg-gray-50'
}) => {
  return (
    <div className={className}>
      <Loader 
        size={size} 
        color={color} 
        text={text} 
        showText={true}
        className="py-20"
      />
    </div>
  );
};

export default PageLoader; 