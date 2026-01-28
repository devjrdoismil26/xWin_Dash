import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

// Context para compartilhar estado do dropdown
const DropdownContext = createContext({
  open: false,
  setOpen: () => {},
  toggleOpen: () => {}
});

// Hook para usar o contexto
const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
};

// Componente principal do Dropdown
const Dropdown = ({ children, align = 'left', width = 'auto', className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleOpen = () => setOpen(prev => !prev);

  const alignmentClasses = { 
    left: 'left-0', 
    right: 'right-0', 
    center: 'left-1/2 transform -translate-x-1/2',
    start: 'left-0'
  };
  const widthClasses = { 
    auto: 'w-auto', 
    sm: 'w-48', 
    md: 'w-56', 
    lg: 'w-64', 
    xl: 'w-72', 
    full: 'w-full' 
  };

  return (
    <DropdownContext.Provider value={{ open, setOpen, toggleOpen }}>
      <div ref={ref} className={`relative inline-block text-left ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

// Trigger component
const DropdownTrigger = ({ children, asChild = false, className = '' }) => {
  const { toggleOpen } = useDropdown();
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        toggleOpen();
      }
    });
  }

  return (
    <button
      type="button"
      className={`inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none ${className}`}
      onClick={toggleOpen}
    >
      {children}
    </button>
  );
};

// Content component
const DropdownContent = ({ children, align = 'left', width = 'auto', className = '' }) => {
  const { open } = useDropdown();
  
  const alignmentClasses = { 
    left: 'left-0', 
    right: 'right-0', 
    center: 'left-1/2 transform -translate-x-1/2',
    start: 'left-0'
  };
  const widthClasses = { 
    auto: 'w-auto', 
    sm: 'w-48', 
    md: 'w-56', 
    lg: 'w-64', 
    xl: 'w-72', 
    full: 'w-full' 
  };

  if (!open) return null;

  return (
    <div className={`absolute z-50 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600 ${alignmentClasses[align]} ${widthClasses[width]} ${className}`}>
      <div className="py-1">{children}</div>
    </div>
  );
};

// Item component
const DropdownItem = ({ children, onClick, disabled = false, className = '', href, method = 'get', as = 'button' }) => {
  const { setOpen } = useDropdown();
  
  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    setOpen(false);
  };

  if (href) {
    return (
      <a
        href={href}
        className={`block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Link component (alias for Item with href)
const DropdownLink = ({ children, href, className = '', ...props }) => (
  <DropdownItem href={href} className={className} {...props}>
    {children}
  </DropdownItem>
);

// Divider component
const DropdownDivider = ({ className = '' }) => (
  <div className={`my-1 h-px bg-gray-200 dark:bg-gray-600 ${className}`} />
);

// Adicionar subcomponentes ao Dropdown principal
Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Link = DropdownLink;
Dropdown.Divider = DropdownDivider;

// PropTypes
Dropdown.propTypes = { 
  children: PropTypes.node, 
  align: PropTypes.oneOf(['left', 'right', 'center', 'start']), 
  width: PropTypes.oneOf(['auto', 'sm', 'md', 'lg', 'xl', 'full']), 
  className: PropTypes.string 
};

DropdownTrigger.propTypes = { 
  children: PropTypes.node.isRequired, 
  asChild: PropTypes.bool,
  className: PropTypes.string 
};

DropdownContent.propTypes = { 
  children: PropTypes.node, 
  align: PropTypes.oneOf(['left', 'right', 'center', 'start']), 
  width: PropTypes.oneOf(['auto', 'sm', 'md', 'lg', 'xl', 'full']), 
  className: PropTypes.string 
};

DropdownItem.propTypes = { 
  children: PropTypes.node, 
  onClick: PropTypes.func, 
  disabled: PropTypes.bool, 
  className: PropTypes.string,
  href: PropTypes.string,
  method: PropTypes.string,
  as: PropTypes.string
};

DropdownLink.propTypes = { 
  children: PropTypes.node, 
  href: PropTypes.string.isRequired,
  className: PropTypes.string 
};

DropdownDivider.propTypes = { 
  className: PropTypes.string 
};

export default Dropdown;
