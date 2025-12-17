import React from 'react';
import { Table } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';
const LeadCaptureFormsTable = ({ forms = [] as unknown[], onEdit }) => (
  <Table />
    <TableHead />
      <TableRow />
        <TableCell as="th">Nome</TableCell>
        <TableCell as="th">Status</TableCell>
        <TableCell as="th" className="text-right">Ações</TableCell></TableRow></TableHead>
    <TableBody />
      { (forms || []).map((f: unknown) => (
        <TableRow key={f.id } />
          <TableCell>{f.name}</TableCell>
          <TableCell>{f.status}</TableCell>
          <TableCell className="text-right" />
            <Button size="sm" variant="outline" onClick={ () => onEdit?.(f) }>Editar</Button></TableCell></TableRow>
      ))}
      {forms.length === 0 && (
        <TableRow />
          <TableCell colSpan={3} className="text-center text-gray-500 py-4">Nenhum formulário</TableCell>
      </TableRow>
    </>
  )}
    </TableBody>
  </Table>);

export default LeadCaptureFormsTable;
