/**
 * Componente Table - Sistema de Tabela Modular
 *
 * @description
 * Sistema completo de componentes de tabela modulares e reutilizáveis. Fornece
 * componentes `Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow` e
 * `TableCell` para construir tabelas estilizadas e acessíveis.
 *
 * Funcionalidades principais:
 * - Tabela wrapper com scroll automático
 * - Header, body e células estilizadas
 * - Suporte a seleção de linhas
 * - Hover states e transições suaves
 * - Layout responsivo
 * - Suporte completo a dark mode
 * - Acessibilidade (ARIA, keyboard navigation)
 *
 * @module components/ui/Table
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/shared/components/ui/Table';
 *
 * <Table />
 *   <TableHeader />
 *     <TableRow />
 *       <TableHead>Nome</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody />
 *     <TableRow />
 *       <TableCell>João</TableCell>
 *       <TableCell>joao@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */

import React from "react";
import { cn } from '@/lib/utils';

/**
 * Coluna de tabela com dados
 */
export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode | string | number;
  className?: string;
}

/**
 * Props do componente Table
 *
 * @description
 * Propriedades que podem ser passadas para o componente Table.
 * Estende todas as propriedades de table HTML padrão.
 *
 * @interface TableProps
 * @extends React.HTMLAttributes<HTMLTableElement />
 * @property {React.ReactNode} [children] - Conteúdo da tabela (TableHeader, TableBody, etc.)
 * @property {TableColumn[]} [columns] - Colunas da tabela (modo data-driven)
 * @property {unknown[]} [data] - Dados da tabela (modo data-driven)
 * @property {string} [emptyMessage] - Mensagem quando não há dados
 * @property {(item: unknown) => void} [onRowClick] - Callback ao clicar em linha
 */
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
  columns?: TableColumn[];
  data?: string[];
  emptyMessage?: string;
  onRowClick??: (e: any) => void;
}

/**
 * Props do componente TableHeader
 *
 * @description
 * Propriedades que podem ser passadas para o componente TableHeader.
 * Estende todas as propriedades de thead HTML padrão.
 *
 * @interface TableHeaderProps
 * @extends React.HTMLAttributes<HTMLTableSectionElement />
 * @property {React.ReactNode} children - Conteúdo do header (TableRow com TableHead)
 */
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

/**
 * Props do componente TableBody
 *
 * @description
 * Propriedades que podem ser passadas para o componente TableBody.
 * Estende todas as propriedades de tbody HTML padrão.
 *
 * @interface TableBodyProps
 * @extends React.HTMLAttributes<HTMLTableSectionElement />
 * @property {React.ReactNode} children - Conteúdo do body (TableRow com TableCell)
 */
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

/**
 * Props do componente TableRow
 *
 * @description
 * Propriedades que podem ser passadas para o componente TableRow.
 * Estende todas as propriedades de tr HTML padrão.
 *
 * @interface TableRowProps
 * @extends React.HTMLAttributes<HTMLTableRowElement />
 * @property {React.ReactNode} children - Conteúdo da linha (TableHead ou TableCell)
 */
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

/**
 * Props do componente TableHead
 *
 * @description
 * Propriedades que podem ser passadas para o componente TableHead.
 * Estende todas as propriedades de th HTML padrão.
 *
 * @interface TableHeadProps
 * @extends React.HTMLAttributes<HTMLTableCellElement />
 * @property {React.ReactNode} children - Conteúdo do cabeçalho da célula
 */
interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

/**
 * Props do componente TableCell
 *
 * @description
 * Propriedades que podem ser passadas para o componente TableCell.
 * Estende todas as propriedades de td HTML padrão.
 *
 * @interface TableCellProps
 * @extends React.HTMLAttributes<HTMLTableCellElement />
 * @property {React.ReactNode} children - Conteúdo da célula
 */
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

/**
 * Componente Table
 *
 * @description
 * Renderiza um wrapper de tabela com scroll automático. Fornece a estrutura
 * base para todos os componentes de tabela. Suporta dois modos:
 * 1. Modo declarativo: usando TableHeader, TableBody, etc. como children
 * 2. Modo data-driven: usando props columns e data
 *
 * @component
 * @param {React.Ref<HTMLTableElement>} ref - Referência para o elemento table
 * @param {TableProps} props - Props do componente
 * @returns {JSX.Element} Wrapper de tabela com scroll
 */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, columns, data, emptyMessage, onRowClick, ...props }, ref) => {
    // Modo data-driven
    if (columns && data !== undefined) {
      return (
                <div className=" ">$2</div><table
            ref={ ref }
            className={cn("w-full caption-bottom text-sm", className)} { ...props } />
            <TableHeader />
              <TableRow />
                {columns.map((column: unknown) => (
                  <TableHead key={column.key} className={column.className } />
                    {column.label}
                  </TableHead>
                ))}
              </TableRow></TableHeader><TableBody />
              {data.length === 0 ? (
                <TableRow />
                  <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500" />
                    {emptyMessage || "Nenhum dado encontrado"}
                  </TableCell>
      </TableRow>
    </>
  ) : (
                (data as any).map((item: unknown, index: unknown) => (
                  <TableRow
                    key={ index }
                    onClick={ () => onRowClick?.(item) }
                    className={onRowClick ? "cursor-pointer" : ""  }>
                    {columns.map((column: unknown) => (
                      <TableCell key={column.key} className={column.className } />
                        {column.render ? column.render(item, index) : (item as Record<string, any>)[column.key] as React.ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody></table></div>);

    }

    // Modo declarativo
    return (
              <div className=" ">$2</div><table
          ref={ ref }
          className={cn("w-full caption-bottom text-sm", className)} { ...props } />
          {children}
        </table>
      </div>);

  },);

Table.displayName = "Table";

/**
 * Componente TableHeader
 *
 * @description
 * Renderiza o cabeçalho da tabela (thead). Deve conter TableRow com TableHead.
 *
 * @component
 * @param {React.Ref<HTMLTableSectionElement>} ref - Referência para o elemento thead
 * @param {TableHeaderProps} props - Props do componente
 * @returns {JSX.Element} Cabeçalho da tabela
 */
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} / />
  ),);

TableHeader.displayName = "TableHeader";

/**
 * Componente TableBody
 *
 * @description
 * Renderiza o corpo da tabela (tbody). Deve conter TableRow com TableCell.
 *
 * @component
 * @param {React.Ref<HTMLTableSectionElement>} ref - Referência para o elemento tbody
 * @param {TableBodyProps} props - Props do componente
 * @returns {JSX.Element} Corpo da tabela
 */
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ ref }
      className={cn("[&_tr:last-child]:border-0", className)} {...props}
    / />
  ),);

TableBody.displayName = "TableBody";

/**
 * Componente TableRow
 *
 * @description
 * Renderiza uma linha da tabela (tr). Suporta estados de hover e seleção.
 *
 * @component
 * @param {React.Ref<HTMLTableRowElement>} ref - Referência para o elemento tr
 * @param {TableRowProps} props - Props do componente
 * @returns {JSX.Element} Linha da tabela
 */
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ ref }
      className={cn(
        "border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50",
        className,
      )} {...props}
    / />
  ),);

TableRow.displayName = "TableRow";

/**
 * Componente TableHead
 *
 * @description
 * Renderiza uma célula de cabeçalho da tabela (th). Usado dentro de TableRow
 * dentro de TableHeader.
 *
 * @component
 * @param {React.Ref<HTMLTableCellElement>} ref - Referência para o elemento th
 * @param {TableHeadProps} props - Props do componente
 * @returns {JSX.Element} Célula de cabeçalho da tabela
 */
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ ref }
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
        className,
      )} {...props}
    / />
  ),);

TableHead.displayName = "TableHead";

/**
 * Componente TableCell
 *
 * @description
 * Renderiza uma célula da tabela (td).
 *
 * @component
 * @param {React.Ref<HTMLTableCellElement>} ref - Referência para o elemento td
 * @param {TableCellProps} props - Props do componente
 * @returns {JSX.Element} Componente de célula da tabela
 */
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ ref }
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className,
      )} {...props}
    / />
  ),);

TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };

export default Table;
