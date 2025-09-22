import React from 'react';
import { Grid3X3, List } from 'lucide-react';

const ViewToggle = ({ currentView, onViewChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange('card')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentView === 'card'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
        <span>Cards</span>
      </button>
      
      <button
        onClick={() => onViewChange('table')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentView === 'table'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        <List className="w-4 h-4" />
        <span>Table</span>
      </button>
    </div>
  );
};

export default ViewToggle;