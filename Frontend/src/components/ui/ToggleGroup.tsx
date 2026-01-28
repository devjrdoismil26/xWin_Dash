import React from 'react';
import PropTypes from 'prop-types';

const ToggleGroup = ({ value, onValueChange, type = 'single', size = 'md', variant = 'default', className = '', children, ...props }) => {
  const sizeClasses = { sm: 'text-xs px-2 py-1', md: 'text-sm px-3 py-2', lg: 'text-base px-4 py-3' };
  const variantClasses = { default: 'border border-gray-300', outline: 'border-2 border-gray-300' };

  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group" {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        const isSelected = type === 'single' ? value === child.props.value : Array.isArray(value) && value.includes(child.props.value);

        return React.cloneElement(child, {
          size,
          variant,
          isSelected,
          isFirst,
          isLast,
          onToggle: (val) => {
            if (!onValueChange) return;
            if (type === 'single') onValueChange(val);
            else {
              const arr = Array.isArray(value) ? value.slice() : [];
              const idx = arr.indexOf(val);
              if (idx >= 0) arr.splice(idx, 1);
              else arr.push(val);
              onValueChange(arr);
            }
          },
          className: `${sizeClasses[size]} ${variantClasses[variant]} ${child.props.className || ''}`,
        });
      })}
    </div>
  );
};

const ToggleGroupItem = ({ value, children, disabled = false, className = '', isSelected, isFirst, isLast, onToggle, ...props }) => {
  const baseClasses = `relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`;
  const positionClasses = `${isFirst ? 'rounded-l-md' : ''} ${isLast ? 'rounded-r-md' : ''} ${!isFirst ? '-ml-px' : ''}`;
  const stateClasses = isSelected ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';

  return (
    <button type="button" onClick={() => onToggle?.(value)} disabled={disabled} className={`${baseClasses} ${positionClasses} ${stateClasses} border ${className}`} {...props}>
      {children}
    </button>
  );
};

ToggleGroup.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))]),
  onValueChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['single', 'multiple']),
  // size and variant are injected into className by parent and not used directly
  className: PropTypes.string,
  children: PropTypes.node,
};

ToggleGroupItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
};

export { ToggleGroupItem };
export default ToggleGroup;
