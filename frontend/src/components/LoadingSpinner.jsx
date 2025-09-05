import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-2 border-travel-brown-600 border-t-transparent ${sizeClasses[size]} mx-auto`}></div>
        {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
