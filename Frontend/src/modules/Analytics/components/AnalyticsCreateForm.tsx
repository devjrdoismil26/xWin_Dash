import React from 'react';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';

interface AnalyticsCreateFormProps {
  data: unknown;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export const AnalyticsCreateForm: React.FC<AnalyticsCreateFormProps> = ({ data, onChange    }) => {
  return (
            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-300 mb-2">Nome do Relatório</label>
        <Input
          value={ data.name || '' }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, name: e.target.value })}
          placeholder="Ex: Relatório Mensal"
          className="w-full" /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
        <Select
          value={ data.type || 'dashboard' }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, type: e.target.value })}
          className="w-full"
        >
          <option value="dashboard">Dashboard</option>
          <option value="report">Relatório</option>
          <option value="export">Exportação</option></Select></div>

      <div>
           
        </div><label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
        <Select
          value={ data.period || '30d' }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, period: e.target.value })}
          className="w-full"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="custom">Personalizado</option></Select></div>

      <Button className="w-full">Criar Relatório</Button>
    </div>);};
