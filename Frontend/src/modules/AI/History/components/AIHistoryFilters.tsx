import React from 'react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Search, X } from 'lucide-react';
const AIHistoryFilters = React.memo(function AIHistoryFilters({ filterValues = {} as any, onFilterChange, onApplyFilters, onClearFilters }) {
  return (
            <div className=" ">$2</div><Select 
        value={ filterValues.type || '' }
        onChange={ (value: unknown) => onFilterChange?.('type', value) }
        options={[
          { value: '', label: 'Todos os tipos' },
          { value: 'chat', label: 'Chat' },
          { value: 'generation', label: 'Geração' },
          { value: 'analysis', label: 'Análise' }
        ]} />
      <Input type="date" value={filterValues.date || ''} onChange={(e: unknown) => onFilterChange?.('date', e.target.value)} placeholder="Filtrar por data" />
      <div className=" ">$2</div><Button variant="outline" onClick={ onApplyFilters }><Search className="w-4 h-4 mr-1" /> Aplicar</Button>
        <Button variant="outline" onClick={ onClearFilters }><X className="w-4 h-4 mr-1" /> Limpar</Button>
      </div>);

});

export default AIHistoryFilters;
