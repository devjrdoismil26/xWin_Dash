import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

const GlobalError = ({
  title = 'Ocorreu um erro',
  message = 'Algo deu errado. Por favor, tente novamente.',
  onRetry,
  onClose,
  retryLabel = 'Tentar novamente',
  closeLabel = 'Fechar',
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`} role="alert" aria-live="assertive">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-red-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              {closeLabel}
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
