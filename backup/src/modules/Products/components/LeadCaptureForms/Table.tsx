import React from 'react';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
const LeadCaptureFormsTable = ({ forms = [], onEdit }) => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell as="th">Nome</Table.Cell>
        <Table.Cell as="th">Status</Table.Cell>
        <Table.Cell as="th" className="text-right">Ações</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {forms.map((f) => (
        <Table.Row key={f.id}>
          <Table.Cell>{f.name}</Table.Cell>
          <Table.Cell>{f.status}</Table.Cell>
          <Table.Cell className="text-right">
            <Button size="sm" variant="outline" onClick={() => onEdit?.(f)}>Editar</Button>
          </Table.Cell>
        </Table.Row>
      ))}
      {forms.length === 0 && (
        <Table.Row>
          <Table.Cell colSpan={3} className="text-center text-gray-500 py-4">Nenhum formulário</Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table>
);
export default LeadCaptureFormsTable;
