import React from 'react';
import { Table } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';
interface ApiTokenTableProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ApiTokenTable = ({ tokens = [] as unknown[], onRevoke }) => (
  <Table />
    <TableHead />
      <TableRow />
        <TableCell as="th">Nome</TableCell>
        <TableCell as="th">Token</TableCell>
        <TableCell as="th" className="text-right">Ações</TableCell></TableRow></TableHead>
    <TableBody />
      { (tokens || []).map((t: unknown) => (
        <TableRow key={t.id } />
          <TableCell>{t.name}</TableCell>
          <TableCell className="font-mono text-xs">{t.token}</TableCell>
          <TableCell className="text-right" />
            <Button size="sm" variant="destructive" onClick={ () => onRevoke?.(t) }>Revogar</Button></TableCell></TableRow>
      ))}
      {tokens.length === 0 && (
        <TableRow />
          <TableCell colSpan={3} className="text-center text-gray-500 py-4">Nenhum token</TableCell>
      </TableRow>
    </>
  )}
    </TableBody>
  </Table>);

export default ApiTokenTable;
