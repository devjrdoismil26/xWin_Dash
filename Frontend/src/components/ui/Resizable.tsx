import React from 'react';
import PropTypes from 'prop-types';

const Resizable = ({ children, direction = 'horizontal', defaultSize = 300, minSize = 200, maxSize = 800, onResize, className = '', ...props }) => {
  const [size, setSize] = React.useState(defaultSize);
  const [isResizing, setIsResizing] = React.useState(false);
  const containerRef = React.useRef(null);
  const startPos = React.useRef(0);
  const startSize = React.useRef(0);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    startPos.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSize.current = size;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    const delta = currentPos - startPos.current;
    const next = Math.min(Math.max(startSize.current + delta, minSize), maxSize);
    setSize(next);
    onResize?.(next);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const containerStyle = { [direction === 'horizontal' ? 'width' : 'height']: `${size}px` };
  const handleStyle = direction === 'horizontal' ? { cursor: 'col-resize', width: '4px', height: '100%' } : { cursor: 'row-resize', width: '100%', height: '4px' };

  return (
    <div ref={containerRef} className={`relative ${className}`} style={containerStyle} {...props}>
      {children}
      <div
        role="separator"
        aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
        onMouseDown={handleMouseDown}
        className={`absolute bg-gray-300 hover:bg-blue-500 transition-colors ${direction === 'horizontal' ? 'right-0 top-0' : 'bottom-0 left-0'}`}
        style={handleStyle}
      />
      {isResizing && <div className="absolute inset-0 cursor-ew-resize" />}
    </div>
  );
};

Resizable.propTypes = { children: PropTypes.node.isRequired, direction: PropTypes.oneOf(['horizontal', 'vertical']), defaultSize: PropTypes.number, minSize: PropTypes.number, maxSize: PropTypes.number, onResize: PropTypes.func, className: PropTypes.string };

export default Resizable;
