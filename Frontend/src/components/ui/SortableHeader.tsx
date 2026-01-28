import React from 'react';
import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const SortableHeader = ({ children, sortKey, currentSort, onSort, className = '' }) => {
  const isActive = currentSort && currentSort.key === sortKey;

  const handleClick = () => {
    if (!onSort || !sortKey) return;
    let newDirection = 'asc';
    if (isActive) newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key: sortKey, direction: newDirection });
  };

  const getSortIcon = () => {
    if (!isActive) return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    if (currentSort.direction === 'asc') return <ChevronUp className="w-4 h-4 text-blue-600" />;
    if (currentSort.direction === 'desc') return <ChevronDown className="w-4 h-4 text-blue-600" />;
    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
  };

  return (
    <th onClick={handleClick} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none ${isActive ? 'bg-gray-50' : ''} ${className}`}>
      <div className="flex items-center space-x-1">
        <span className={isActive ? 'text-gray-900' : ''}>{children}</span>
        {getSortIcon()}
      </div>
    </th>
  );
};

SortableHeader.propTypes = { children: PropTypes.node.isRequired, sortKey: PropTypes.string, currentSort: PropTypes.shape({ key: PropTypes.string, direction: PropTypes.oneOf(['asc', 'desc']) }), onSort: PropTypes.func, className: PropTypes.string };

export default SortableHeader;
