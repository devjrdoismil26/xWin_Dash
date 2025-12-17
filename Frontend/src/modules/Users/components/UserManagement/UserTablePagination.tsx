import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const UserTablePagination: React.FC<UserTablePaginationProps> = ({ currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange
   }) => {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
            <div className=" ">$2</div><p className="text-sm text-gray-600" />
        Mostrando {startItem} a {endItem} de {totalItems} usuários
      </p>
      
      <div className=" ">$2</div><Button
          variant="outline"
          size="sm"
          onClick={ () => onPageChange(currentPage - 1) }
          disabled={ currentPage === 1  }>
          <ChevronLeft className="h-4 w-4" /></Button><span className="Página {currentPage} de {totalPages}">$2</span>
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={ () => onPageChange(currentPage + 1) }
          disabled={ currentPage === totalPages  }>
          <ChevronRight className="h-4 w-4" /></Button></div>);};
