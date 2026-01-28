import React from 'react';
import PropTypes from 'prop-types';

export const ScrollArea = ({ children, className = '', maxHeight = '400px', showScrollbar = true, ...props }) => {
  const scrollbarClasses = showScrollbar ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400' : 'scrollbar-hide';
  return (
    <div className={`overflow-auto ${scrollbarClasses} ${className}`} style={{ maxHeight }} {...props}>
      {children}
    </div>
  );
};

ScrollArea.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string, maxHeight: PropTypes.string, showScrollbar: PropTypes.bool };

export const ScrollBar = () => null;

export default ScrollArea;
