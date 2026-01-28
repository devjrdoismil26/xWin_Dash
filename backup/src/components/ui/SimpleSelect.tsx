import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const SimpleSelect = ({ 
  value, 
  onChange, 
  children, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'bg-white text-gray-900',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

SimpleSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SimpleSelect;
