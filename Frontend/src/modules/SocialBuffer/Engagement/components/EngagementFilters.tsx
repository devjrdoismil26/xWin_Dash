import React from 'react';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
const EngagementFilters = ({ filters = {} as any, onChange }) => (
  <div className=" ">$2</div><Input placeholder="Buscar" value={filters.q || ''} onChange={(e: unknown) => onChange?.({ ...filters, q: e.target.value })} />
    <Select value={filters.type || ''} onChange={(e: unknown) => onChange?.({ ...filters, type: e.target.value })}>
      <option value="">Todos</option>
      <option value="comment">Comentários</option>
      <option value="like">Curtidas</option></Select></div>);

export default EngagementFilters;
