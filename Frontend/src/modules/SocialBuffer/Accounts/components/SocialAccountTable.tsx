import React from 'react';
import { Table } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';
const SocialAccountTable = ({ accounts = [] as unknown[], onOpen }) => (
  <Table />
    <TableHead />
      <TableRow />
        <TableCell as="th">Rede</TableCell>
        <TableCell as="th">Conta</TableCell>
        <TableCell as="th" className="text-right">Ações</TableCell></TableRow></TableHead>
    <TableBody />
      { (accounts || []).map((a: unknown) => (
        <TableRow key={a.id } />
          <TableCell>{a.network}</TableCell>
          <TableCell>{a.name}</TableCell>
          <TableCell className="text-right" />
            <Button size="sm" variant="outline" onClick={ () => onOpen?.(a) }>Abrir</Button></TableCell></TableRow>
      ))}
      {accounts.length === 0 && (
        <TableRow />
          <TableCell colSpan={3} className="text-center text-gray-500 py-4">Nenhuma conta</TableCell>
      </TableRow>
    </>
  )}
    </TableBody>
  </Table>);

export default SocialAccountTable;
