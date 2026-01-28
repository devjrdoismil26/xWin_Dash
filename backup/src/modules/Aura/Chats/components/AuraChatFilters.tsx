import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
const AuraChatFilters = React.memo(function AuraChatFilters({ values = {}, onChange, onApply, onClear }) {
  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="grid gap-1">
        <label className="text-xs text-gray-600">Status</label>
        <Select 
          value={values.status || 'all'} 
          onChange={(value) => onChange?.('status', value)}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'open', label: 'Abertos' },
            { value: 'closed', label: 'Fechados' }
          ]}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-xs text-gray-600">Busca</label>
        <Input placeholder="Buscar..." value={values.query || ''} onChange={(e) => onChange?.('query', e.target.value)} />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" onClick={onApply}>Aplicar</Button>
        <Button variant="outline" onClick={onClear}>Limpar</Button>
      </div>
    </div>
  );
});
export default AuraChatFilters;
