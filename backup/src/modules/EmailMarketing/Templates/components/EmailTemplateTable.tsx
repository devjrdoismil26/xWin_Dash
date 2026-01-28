import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
const EmailTemplateTable: React.FC<{templates?: any, onEdit, onDelete}> = ({ templates = [], onEdit, onDelete }) => {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Cell as="th">Nome</Table.Cell>
          <Table.Cell as="th">Assunto</Table.Cell>
          <Table.Cell as="th">Categoria</Table.Cell>
          <Table.Cell as="th" className="text-right">Ações</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {templates.map((t) => (
          <Table.Row key={t.id ?? t.name}>
            <Table.Cell>{t.name ?? '—'}</Table.Cell>
            <Table.Cell>{t.subject ?? '—'}</Table.Cell>
            <Table.Cell>{t.category ?? '—'}</Table.Cell>
            <Table.Cell className="text-right space-x-2">
              <Button size="sm" variant="outline" onClick={() => onEdit?.(t)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete?.(t)}>Excluir</Button>
            </Table.Cell>
          </Table.Row>
        ))}
        {templates.length === 0 && (
          <Table.Row>
            <Table.Cell colSpan={4} className="text-center text-gray-500 py-4">Nenhum template encontrado</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};
EmailTemplateTable.propTypes = {
  templates: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
export default EmailTemplateTable;
