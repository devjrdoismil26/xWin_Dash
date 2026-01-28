import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
const AIHistoryFilters = React.memo(function AIHistoryFilters({ filterValues = {}, onFilterChange, onApplyFilters, onClearFilters }) {
  return (
    <div className="flex items-center flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      <Select 
        value={filterValues.type || ''} 
        onChange={(value) => onFilterChange?.('type', value)}
        options={[
          { value: '', label: 'Todos os tipos' },
          { value: 'chat', label: 'Chat' },
          { value: 'generation', label: 'Geração' },
          { value: 'analysis', label: 'Análise' }
        ]}
      />
      <Input type="date" value={filterValues.date || ''} onChange={(e) => onFilterChange?.('date', e.target.value)} placeholder="Filtrar por data" />
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onApplyFilters}><Search className="w-4 h-4 mr-1" /> Aplicar</Button>
        <Button variant="outline" onClick={onClearFilters}><X className="w-4 h-4 mr-1" /> Limpar</Button>
      </div>
    </div>
  );
});
export default AIHistoryFilters;
