import React from 'react';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
const EngagementFilters = ({ filters = {}, onChange }) => (
  <div className="flex gap-2">
    <Input placeholder="Buscar" value={filters.q || ''} onChange={(e) => onChange?.({ ...filters, q: e.target.value })} />
    <Select value={filters.type || ''} onChange={(e) => onChange?.({ ...filters, type: e.target.value })}>
      <option value="">Todos</option>
      <option value="comment">Comentários</option>
      <option value="like">Curtidas</option>
    </Select>
  </div>
);
export default EngagementFilters;
