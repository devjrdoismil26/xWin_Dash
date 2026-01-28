import React from 'react';
import { Table } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
const SocialAccountTable = ({ accounts = [], onOpen }) => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell as="th">Rede</Table.Cell>
        <Table.Cell as="th">Conta</Table.Cell>
        <Table.Cell as="th" className="text-right">Ações</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {accounts.map((a) => (
        <Table.Row key={a.id}>
          <Table.Cell>{a.network}</Table.Cell>
          <Table.Cell>{a.name}</Table.Cell>
          <Table.Cell className="text-right">
            <Button size="sm" variant="outline" onClick={() => onOpen?.(a)}>Abrir</Button>
          </Table.Cell>
        </Table.Row>
      ))}
      {accounts.length === 0 && (
        <Table.Row>
          <Table.Cell colSpan={3} className="text-center text-gray-500 py-4">Nenhuma conta</Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table>
);
export default SocialAccountTable;
