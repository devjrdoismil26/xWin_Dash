import React from 'react';
import { Table } from '@/shared/components/ui/Table';
const AuraStatsDetailsTable = ({ items = [] as unknown[] }) => {
  const columns = [
    { key: 'metric', label: 'Métrica' },
    { key: 'value', label: 'Valor' },
    { key: 'date', label: 'Data', render: (r: unknown) => new Date(r.date).toLocaleString('pt-BR') },
  ];
  return <Table columns={columns} data={items} emptyMessage="Sem dados" />;};

export default AuraStatsDetailsTable;
