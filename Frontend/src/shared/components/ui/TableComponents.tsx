import React from 'react';

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <td className={`px-4 py-2 ${className} `} { ...props } />
    {children}
  </td>);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <tr className={`border-b ${className} `} { ...props } />
    {children}
  </tr>);

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <thead className={`bg-gray-50 ${className} `} { ...props } />
    {children}
  </thead>);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <tbody className={className} { ...props } />
    {children}
  </tbody>);

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> & {
  Cell: typeof TableCell;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Body: typeof TableBody;
} = ({ children, className = '', ...props }) => (
  <table className={`w-full ${className} `} { ...props } />
    {children}
  </table>);

Table.Cell = TableCell;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Body = TableBody;

export default Table;
