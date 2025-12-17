import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@/shared/components/ui/Table';
import Button from '@/shared/components/ui/Button';
import { TableRow } from '@/shared/components/ui/TableComponents';
import { TableBody } from '@/shared/components/ui/TableComponents';
import { TableHead } from '@/shared/components/ui/TableComponents';
import { TableCell } from '@/shared/components/ui/TableComponents';
const EmailTemplateTable: React.FC<{templates?: string, onEdit, onDelete}> = ({ templates = [] as unknown[], onEdit, onDelete    }) => { return (
        <>
      <Table />
      <TableHead />
        <TableRow />
          <TableCell as="th">Nome</TableCell>
          <TableCell as="th">Assunto</TableCell>
          <TableCell as="th">Categoria</TableCell>
          <TableCell as="th" className="text-right">Ações</TableCell></TableRow></TableHead>
      <TableBody />
        {(templates || []).map((t: unknown) => (
          <TableRow key={t.id ?? t.name } />
            <TableCell>{t.name ?? '—'}</TableCell>
            <TableCell>{t.subject ?? '—'}</TableCell>
            <TableCell>{t.category ?? '—'}</TableCell>
            <TableCell className="text-right space-x-2" />
              <Button size="sm" variant="outline" onClick={ () => onEdit?.(t) }>Editar</Button>
              <Button size="sm" variant="destructive" onClick={ () => onDelete?.(t) }>Excluir</Button></TableCell></TableRow>
        ))}
        {templates.length === 0 && (
          <TableRow />
            <TableCell colSpan={4} className="text-center text-gray-500 py-4">Nenhum template encontrado</TableCell>
      </TableRow>
    </>
  )}
      </TableBody>
    </Table>);};

EmailTemplateTable.propTypes = {
  templates: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,};

export default EmailTemplateTable;
