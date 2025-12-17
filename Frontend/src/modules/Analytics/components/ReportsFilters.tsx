import React from 'react';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Search } from 'lucide-react';

interface ReportsFiltersProps {
  filters: unknown;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export const ReportsFilters: React.FC<ReportsFiltersProps> = ({ filters, onChange    }) => {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={ filters.search || '' }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, search: e.target.value })}
          placeholder="Buscar relatórios..."
          className="pl-10" /></div><Select
        value={ filters.type || 'all' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, type: e.target.value })}
  >
        <option value="all">Todos os tipos</option>
        <option value="dashboard">Dashboard</option>
        <option value="report">Relatório</option>
        <option value="export">Exportação</option></Select><Select
        value={ filters.period || 'all' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, period: e.target.value })}
  >
        <option value="all">Todos os períodos</option>
        <option value="7d">Últimos 7 dias</option>
        <option value="30d">Últimos 30 dias</option>
        <option value="90d">Últimos 90 dias</option></Select></div>);};
