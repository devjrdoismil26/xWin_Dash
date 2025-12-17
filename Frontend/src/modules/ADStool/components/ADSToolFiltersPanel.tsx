import React from 'react';
import Card from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Search, X } from 'lucide-react';

interface ADSToolFiltersPanelProps {
  filters: unknown;
  onFiltersChange?: (e: any) => void;
  onClear??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ADSToolFiltersPanel: React.FC<ADSToolFiltersPanelProps> = ({ filters,
  onFiltersChange,
  onClear,
   }) => {
  return (
        <>
      <Card title="Filtros" />
      <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar campanhas..."
            value={ filters.search || '' }
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10" /></div><select
          value={ filters.platform || 'all' }
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFiltersChange({ ...filters, platform: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">Todas as plataformas</option>
          <option value="google">Google Ads</option>
          <option value="linkedin">LinkedIn Ads</option>
          <option value="facebook">Facebook Ads</option></select><select
          value={ filters.status || 'all' }
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFiltersChange({ ...filters, status: e.target.value })}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativas</option>
          <option value="paused">Pausadas</option>
          <option value="completed">Concluídas</option>
          <option value="draft">Rascunho</option></select><Input
          type="date"
          value={ filters.date || '' }
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFiltersChange({ ...filters, date: e.target.value })} /></div><div className=" ">$2</div><Button variant="outline" onClick={ onClear } />
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
        <Button onClick={() => {} >
          Aplicar Filtros
        </Button></div></Card>);};
