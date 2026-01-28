import React from 'react';
import { LoadingSpinner } from './LoadingStates.tsx';

const GlobalLoader = ({ show = true, text = 'Carregando...', className = '', backdrop = true }) => {
  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`} role="status" aria-live="polite">
      {backdrop && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative flex items-center space-x-3 bg-white rounded-lg shadow-lg px-4 py-3">
        <div>
          <LoadingSpinner size="md" />
        </div>
        {text && <span className="text-gray-700">{text}</span>}
      </div>
    </div>
  );
};

export default React.memo(GlobalLoader);
