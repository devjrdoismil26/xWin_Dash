import React from 'react';

interface InputErrorProps {
  message?: string;
  text?: string; // For backward compatibility
  className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, text, className = '' }) => {
  const errorMessage = message || text;
  if (!errorMessage) return null;
  return <p className={`text-sm text-red-600 mt-1 ${className}`}>{errorMessage}</p>;
};

export default InputError;
