import React from 'react';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
const ApiTokenTable = ({ tokens = [], onRevoke }) => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell as="th">Nome</Table.Cell>
        <Table.Cell as="th">Token</Table.Cell>
        <Table.Cell as="th" className="text-right">Ações</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {tokens.map((t) => (
        <Table.Row key={t.id}>
          <Table.Cell>{t.name}</Table.Cell>
          <Table.Cell className="font-mono text-xs">{t.token}</Table.Cell>
          <Table.Cell className="text-right">
            <Button size="sm" variant="destructive" onClick={() => onRevoke?.(t)}>Revogar</Button>
          </Table.Cell>
        </Table.Row>
      ))}
      {tokens.length === 0 && (
        <Table.Row>
          <Table.Cell colSpan={3} className="text-center text-gray-500 py-4">Nenhum token</Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table>
);
export default ApiTokenTable;
