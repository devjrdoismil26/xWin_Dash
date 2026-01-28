import React from 'react';
import PropTypes from 'prop-types';
import { Link, usePage } from '@inertiajs/react';

const NavLink = ({ href, children, active, className = '', activeClassName = 'bg-blue-100 text-blue-900', inactiveClassName = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', ...props }) => {
  const { url } = usePage();
  const isActive = active !== undefined ? active : url === href;
  const combinedClassName = `inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeClassName : inactiveClassName} ${className}`.trim();

  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  inactiveClassName: PropTypes.string,
};

export default NavLink;
