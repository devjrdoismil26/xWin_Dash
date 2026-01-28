import React from 'react';
import { Table } from '@/components/ui/Table';
const LinkHistoryTable = ({ items = [] }) => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell as="th">URL</Table.Cell>
        <Table.Cell as="th">Clicks</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {items.map((i) => (
        <Table.Row key={i.id}>
          <Table.Cell className="truncate max-w-[300px]">{i.url}</Table.Cell>
          <Table.Cell>{i.clicks}</Table.Cell>
        </Table.Row>
      ))}
      {items.length === 0 && (
        <Table.Row>
          <Table.Cell colSpan={2} className="text-center text-gray-500 py-4">Sem histórico</Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  </Table>
);
export default LinkHistoryTable;
