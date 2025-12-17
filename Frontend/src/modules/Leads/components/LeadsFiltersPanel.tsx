import React from 'react';
import { Input, Select, Button } from '@/shared/components/ui';
import { LeadFilters } from '../types';

interface LeadsFiltersPanelProps {
  filters: LeadFilters;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export const LeadsFiltersPanel: React.FC<LeadsFiltersPanelProps> = ({ filters, onChange    }) => {
  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'new', label: 'Novo' },
    { value: 'contacted', label: 'Contatado' },
    { value: 'qualified', label: 'Qualificado' },
    { value: 'converted', label: 'Convertido' },
    { value: 'lost', label: 'Perdido' }
  ];

  const originOptions = [
    { value: '', label: 'Todas as Origens' },
    { value: 'website', label: 'Website' },
    { value: 'social', label: 'Redes Sociais' },
    { value: 'email', label: 'Email' },
    { value: 'referral', label: 'Indicação' },
    { value: 'other', label: 'Outro' }
  ];

  return (
            <div className=" ">$2</div><Input
        label="Buscar"
        placeholder="Nome, email ou empresa..."
        value={ filters.search || '' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, search: e.target.value })} />
      
      <Select
        label="Status"
        options={ statusOptions }
        value={ filters.status || '' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, status: e.target.value })} />
      
      <Select
        label="Origem"
        options={ originOptions }
        value={ filters.origin || '' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, origin: e.target.value })} />

      <Input
        label="Score Mínimo"
        type="number"
        min="0"
        max="100"
        value={ filters.min_score || '' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, min_score: parseInt(e.target.value) || undefined })} />

      <Input
        label="Data Inicial"
        type="date"
        value={ filters.start_date || '' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, start_date: e.target.value })} />

      <Input
        label="Data Final"
        type="date"
        value={ filters.end_date || '' }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, end_date: e.target.value })} />

      <div className=" ">$2</div><Button variant="secondary" onClick={() => onChange({})}>
          Limpar Filtros
        </Button>
        <Button variant="primary" />
          Aplicar Filtros
        </Button>
      </div>);};
