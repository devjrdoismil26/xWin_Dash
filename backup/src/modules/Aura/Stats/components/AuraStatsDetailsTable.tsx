import React from 'react';
import { Table } from '@/components/ui/Table';
const AuraStatsDetailsTable = ({ items = [] }) => {
  const columns = [
    { key: 'metric', label: 'Métrica' },
    { key: 'value', label: 'Valor' },
    { key: 'date', label: 'Data', render: (r) => new Date(r.date).toLocaleString('pt-BR') },
  ];
  return <Table columns={columns} data={items} emptyMessage="Sem dados" />;
};
export default AuraStatsDetailsTable;
