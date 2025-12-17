import React from 'react';
import Select from '@/shared/components/ui/Select';

export const AlertsFilters: React.FC<{ filters: unknown; onChange?: (e: any) => void }> = ({ filters, onChange }) => (
  <div className=" ">$2</div><Select value={filters.type || 'all'} onChange={(e: unknown) => onChange({ ...filters, type: e.target.value })}>
      <option value="all">Todos</option>
      <option value="error">Erros</option>
      <option value="warning">Avisos</option></Select></div>);
