import React from 'react';
import { Card } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Search, X } from 'lucide-react';

interface ActivityFiltersPanelProps {
  filters: unknown;
  onFiltersChange?: (e: any) => void;
  onClear??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ActivityFiltersPanel: React.FC<ActivityFiltersPanelProps> = ({ filters,
  onFiltersChange,
  onClear,
   }) => {
  return (
        <>
      <Card title="Filtros" />
      <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={ filters.search || '' }
            onChange={(e: unknown) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10" /></div><select
          value={ filters.type || 'all' }
          onChange={(e: unknown) => onFiltersChange({ ...filters, type: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">Todos os tipos</option>
          <option value="info">Info</option>
          <option value="error">Erro</option>
          <option value="security">Segurança</option>
          <option value="success">Sucesso</option></select><select
          value={ filters.user || 'all' }
          onChange={(e: unknown) => onFiltersChange({ ...filters, user: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">Todos os usuários</option>
          <option value="system">Sistema</option>
          <option value="admin">Admin</option></select><Input
          type="date"
          value={ filters.date || '' }
          onChange={(e: unknown) => onFiltersChange({ ...filters, date: e.target.value })} /></div><div className=" ">$2</div><Button variant="outline" onClick={ onClear } />
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
        <Button onClick={ () => onApply?.(filters)  }>
          Aplicar Filtros
        </Button></div></Card>);};
