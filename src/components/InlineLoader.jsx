import React from 'react';
import Loader from './Loader';

const InlineLoader = ({ 
  size = 'sm', 
  color = 'fuchsia',
  className = ''
}) => {
  return (
    <Loader 
      size={size} 
      color={color} 
      showText={false}
      className={className}
    />
  );
};

export default InlineLoader; 