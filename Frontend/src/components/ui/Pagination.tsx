import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange, showFirstLast = true, showPrevNext = true, maxVisiblePages = 5, className = '' }) => {
  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      else startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const visiblePages = getVisiblePages();

  const PageButton = ({ page, isActive = false, disabled = false, children, ...props }) => (
    <Button
      onClick={() => !disabled && onPageChange(page)}
      disabled={disabled}
      variant={isActive ? 'primary' : 'outline'}
      size="sm"
      className="first:rounded-l-md last:rounded-r-md -ml-px first:ml-0"
      {...props}
    >
      {children}
    </Button>
  );

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <Button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Anterior
        </Button>
        <Button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Próxima
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Mostrando página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
        </p>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {showFirstLast && currentPage > 1 && <PageButton page={1}>1</PageButton>}
          {showPrevNext && (
            <PageButton page={currentPage - 1} disabled={currentPage === 1}>
              <ChevronLeft className="h-5 w-5" />
            </PageButton>
          )}
          {visiblePages.map((p) => (
            <PageButton key={p} page={p} isActive={p === currentPage}>
              {p}
            </PageButton>
          ))}
          {showPrevNext && (
            <PageButton page={currentPage + 1} disabled={currentPage === totalPages}>
              <ChevronRight className="h-5 w-5" />
            </PageButton>
          )}
          {showFirstLast && currentPage < totalPages && <PageButton page={totalPages}>{totalPages}</PageButton>}
        </nav>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  className: PropTypes.string,
};

export default Pagination;
