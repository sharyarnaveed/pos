import React from 'react';

const Spinner = ({ size = 'medium', color = '#07484A', className = '' }) => {
  // Define size classes
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Combine classes
  const spinnerClasses = `
    ${sizeClasses[size] || sizeClasses.medium}
    animate-spin rounded-full
    border-4
    border-t-transparent
    ${className}
  `;

  return (
    <div className="flex items-center justify-center">
      <div 
        className={spinnerClasses}
        style={{ borderColor: `${color} transparent transparent transparent` }}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;