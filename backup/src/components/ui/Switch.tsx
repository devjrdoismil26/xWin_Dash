import React from 'react';
import PropTypes from 'prop-types';
// ComponentSize is a type, not an import

const Switch = ({ checked, onChange, disabled = false, size = 'md', label, description, className = '' }) => {
  const sizeClasses = {
    sm: { switch: 'h-4 w-7', thumb: 'h-3 w-3', translate: 'translate-x-3' },
    md: { switch: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'translate-x-5' },
    lg: { switch: 'h-8 w-14', thumb: 'h-7 w-7', translate: 'translate-x-6' },
    xl: { switch: 'h-10 w-18', thumb: 'h-9 w-9', translate: 'translate-x-8' },
  };
  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${currentSize.switch}
        `}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
            checked ? currentSize.translate : 'translate-x-0'
          } ${currentSize.thumb}`}
        />
      </button>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>{label}</span>
          )}
          {description && (
            <p className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  label: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
};

export { Switch };
export default Switch;
