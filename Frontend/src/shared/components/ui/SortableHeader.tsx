/**
 * Componente SortableHeader - Cabe?alho Orden?vel de Tabela
 *
 * @description
 * Componente de cabe?alho de tabela orden?vel com indicadores visuais de dire??o
 * de ordena??o (ascendente, descendente, n?o ordenado). Suporta clique para
 * alternar entre ordena??o ascendente, descendente e n?o ordenado.
 *
 * Funcionalidades principais:
 * - Indica??o visual do estado de ordena??o (asc, desc, none)
 * - Clique para alternar entre dire??es de ordena??o
 * - ?cones contextuais (ChevronUp, ChevronDown, ChevronsUpDown)
 * - Estado ativo/inativo visual
 * - Suporte completo a dark mode
 * - Acessibilidade (cursor pointer, hover states)
 *
 * @module components/ui/SortableHeader
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import SortableHeader from '@/shared/components/ui/SortableHeader';
 *
 * <SortableHeader
 *   sortKey="name"
 *   currentSort={ key: 'name', direction: 'asc' } *   onSort={ (sort: unknown) => setSort(sort) }
 * >
 *   Nome
 * </SortableHeader>
 * ```
 */

import React from "react";
import PropTypes from "prop-types";
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * Configura??o de ordena??o atual
 *
 * @description
 * Define a configura??o atual de ordena??o da tabela.
 *
 * @interface SortConfig
 * @property {string} key - Chave do campo ordenado
 * @property {'asc' | 'desc'} direction - Dire??o da ordena??o
 */
interface SortConfig {
  key: string;
  direction: "asc" | "desc"; }

/**
 * Props do componente SortableHeader
 *
 * @description
 * Propriedades que podem ser passadas para o componente SortableHeader.
 *
 * @interface SortableHeaderProps
 * @property {React.ReactNode} children - Conte?do do cabe?alho (texto do header)
 * @property {string} [sortKey] - Chave do campo para ordena??o (opcional)
 * @property {SortConfig} [currentSort] - Configura??o de ordena??o atual (opcional)
 * @property {(sort: SortConfig) => void} [onSort] - Callback ao alterar ordena??o (opcional)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey?: string;
  currentSort?: SortConfig;
  onSort??: (e: any) => void;
  className?: string; }

/**
 * Componente SortableHeader
 *
 * @description
 * Renderiza um cabe?alho de tabela orden?vel com indicadores visuais de
 * ordena??o e suporte a clique para alternar entre dire??es.
 *
 * @component
 * @param {SortableHeaderProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do do cabe?alho
 * @param {string} [props.sortKey] - Chave do campo para ordena??o
 * @param {SortConfig} [props.currentSort] - Configura??o de ordena??o atual
 * @param {(sort: SortConfig) => void} [props.onSort] - Callback ao alterar ordena??o
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Cabe?alho orden?vel de tabela
 */
const SortableHeader: React.FC<SortableHeaderProps> = ({ children,
  sortKey,
  currentSort,
  onSort,
  className = "",
   }) => {
  const isActive = currentSort && currentSort.key === sortKey;

  /**
   * Handler de clique para alternar ordena??o
   *
   * @description
   * Alterna entre ordena??o ascendente, descendente e n?o ordenado ao clicar
   * no cabe?alho. Se j? est? ordenado, inverte a dire??o; caso contr?rio,
   * inicia com ordena??o ascendente.
   */
  const handleClick = () => {
    if (!onSort || !sortKey) return;
    let newDirection: "asc" | "desc" = "asc";
    if (isActive && currentSort) {
      newDirection = currentSort.direction === "asc" ? "desc" : "asc";
    }
    onSort({ key: sortKey, direction: newDirection });};

  /**
   * Obt?m o ?cone apropriado para o estado de ordena??o
   *
   * @description
   * Retorna o ?cone correto baseado no estado atual de ordena??o:
   * - N?o ordenado: ChevronsUpDown (cinza)
   * - Ascendente: ChevronUp (azul)
   * - Descendente: ChevronDown (azul)
   *
   * @returns {JSX.Element} ?cone de ordena??o
   */
  const getSortIcon = () => {
    if (!isActive) return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    if (currentSort.direction === "asc")
      return <ChevronUp className="w-4 h-4 text-blue-600" />;
    if (currentSort.direction === "desc")
      return <ChevronDown className="w-4 h-4 text-blue-600" />;
    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;};

  return (
        <>
      <th
      onClick={ handleClick }
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none ${isActive ? "bg-gray-50" : ""} ${className}`} />
      <div className=" ">$2</div><span className={isActive ? "text-gray-900" : "" } >{children}</span>
        {getSortIcon()}
      </div>
    </th>);};

// Manter PropTypes para compatibilidade, mas TypeScript ? a fonte principal de verdade
SortableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  sortKey: PropTypes.string,
  currentSort: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
  onSort: PropTypes.func,
  className: PropTypes.string,};

export default SortableHeader;
