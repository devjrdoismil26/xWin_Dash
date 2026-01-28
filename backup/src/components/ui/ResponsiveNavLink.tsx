import React from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';

const ResponsiveNavLink = ({ href, children, active, className = '', activeClassName = 'border-blue-400 text-blue-700 bg-blue-50', inactiveClassName = 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300', ...props }) => {
  const { url } = usePage();
  const isActive = active !== undefined ? active : url === href;
  const combinedClassName = `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150 ${isActive ? activeClassName : inactiveClassName} ${className}`.trim();

  return (
    <Link to={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
};

ResponsiveNavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  inactiveClassName: PropTypes.string,
};

export default ResponsiveNavLink;
