/**
 * Componente Pagination - Sistema de Paginação
 *
 * @description
 * Componente de paginação completo com suporte a navegação entre páginas,
 * exibição de range de páginas visíveis, botões de primeira/última página
 * e anterior/próxima. Otimizado para responsividade (mobile/desktop).
 *
 * Funcionalidades principais:
 * - Navegação por páginas individuais
 * - Botões de primeira/última página (opcional)
 * - Botões anterior/próxima (opcional)
 * - Range de páginas visíveis configurável
 * - Layout responsivo (mobile/desktop)
 * - Estados disabled para navegação inválida
 * - Animações e transições suaves
 *
 * @module components/ui/Pagination
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Pagination from '@/shared/components/ui/Pagination';
 *
 * <Pagination
 *   currentPage={ page }
 *   totalPages={ total }
 *   onPageChange={ (page: unknown) => setPage(page) }
 *   maxVisiblePages={ 7 }
 * />
 * ```
 */

import React from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from "./Button";

/**
 * Props do componente Pagination
 *
 * @description
 * Propriedades que podem ser passadas para o componente Pagination.
 *
 * @interface PaginationProps
 * @property {number} currentPage - Página atual (começa em 1)
 * @property {number} totalPages - Total de páginas
 * @property {(page: number) => void} onPageChange - Callback quando página muda
 * @property {boolean} [showFirstLast=true] - Mostrar botões de primeira/última página
 * @property {boolean} [showPrevNext=true] - Mostrar botões anterior/próxima
 * @property {number} [maxVisiblePages=5] - Número máximo de páginas visíveis
 * @property {string} [className=''] - Classes CSS adicionais
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (e: any) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente Pagination
 *
 * @description
 * Renderiza um sistema de paginação completo com navegação entre páginas.
 *
 * @component
 * @param {PaginationProps} props - Props do componente
 * @returns {JSX.Element} Componente de paginação
 */
const Pagination: React.FC<PaginationProps> = ({ currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = "",
   }) => {
  const getVisiblePages = () => {
    const pages = [] as unknown[];
    const half = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - half);

    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1)
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      else startPage = Math.max(1, endPage - maxVisiblePages + 1);

    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return pages;};

  const visiblePages = getVisiblePages();

  /**
   * Componente interno PageButton
   *
   * @description
   * Botão de página individual usado na paginação. Renderiza um botão
   * estilizado com variantes para página ativa/inativa.
   *
   * @component
   * @param {Object} props - Props do botão
   * @param {number} props.page - Número da página
   * @param {boolean} [props.isActive=false] - Se a página está ativa
   * @param {boolean} [props.disabled=false] - Se o botão está desabilitado
   * @param {React.ReactNode} props.children - Conteúdo do botão
   * @param {Record<string, any>} ...props - Props adicionais passadas para Button
   * @returns {JSX.Element} Botão de página estilizado
   */
  const PageButton = ({
    page,
    isActive = false,
    disabled = false,
    children,
    ...props
  }: {
    page: number;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <Button
      onClick={ () => !disabled && onPageChange(page) }
      disabled={ disabled }
      variant={ isActive ? "primary" : "outline" }
      size="sm"
      className="first:rounded-l-md last:rounded-r-md -ml-px first:ml-0"
      { ...props }>
      {children}
    </Button>);

  return (
        <>
      <div className={`flex items-center justify-between ${className} `}>
      </div><div className=" ">$2</div><Button
          onClick={ () => onPageChange(Math.max(1, currentPage - 1)) }
          disabled={ currentPage === 1 }
          variant="outline"
          size="sm"
        >
          Anterior
        </Button>
        <Button
          onClick={ () => onPageChange(Math.min(totalPages, currentPage + 1)) }
          disabled={ currentPage === totalPages }
          variant="outline"
          size="sm"
        >
          Próxima
        </Button></div><div className=" ">$2</div><p className="text-sm text-gray-700" />
          Mostrando página <span className="font-medium">{currentPage}</span> de{" "}
          <span className="font-medium">{totalPages}</span></p><nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination" />
          {showFirstLast && currentPage > 1 && (
            <PageButton page={ 1 }>1</PageButton>
          )}
          {showPrevNext && (
            <PageButton page={currentPage - 1} disabled={ currentPage === 1 } />
              <ChevronLeft className="h-5 w-5" />
            </PageButton>
          )}
          {(visiblePages || []).map((p: unknown) => (
            <PageButton key={p} page={p} isActive={ p === currentPage } />
              {p}
            </PageButton>
          ))}
          {showPrevNext && (
            <PageButton
              page={ currentPage + 1 }
              disabled={ currentPage === totalPages } />
              <ChevronRight className="h-5 w-5" />
            </PageButton>
          )}
          {showFirstLast && currentPage < totalPages && (
            <PageButton page={ totalPages }>{totalPages}</PageButton>
          )}
        </nav>
      </div>);};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  className: PropTypes.string,};

export default Pagination;
