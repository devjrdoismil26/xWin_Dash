/**
 * @module AuraStatsFilters
 * @description Componente de filtros para estatísticas do Aura.
 * 
 * Este componente permite filtrar estatísticas por período (7 dias, 30 dias, 90 dias).
 * Fornece um botão para aplicar os filtros selecionados.
 * 
 * @example
 * ```tsx
 * <AuraStatsFilters
 *   values={ period: 'last_30_days' } *   onChange={ (key: unknown, value: unknown) =>  }
 *   onApply={ () =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';

/**
 * Tipo para períodos de filtro disponíveis
 */
type PeriodFilter = 'last_7_days' | 'last_30_days' | 'last_90_days';

/**
 * Interface para os valores dos filtros
 * 
 * @interface FilterValues
 * @property {PeriodFilter} [period] - Período selecionado
 */
interface FilterValues {
  /** Período selecionado para filtrar estatísticas */
  period?: PeriodFilter; }

/**
 * Interface para as propriedades do componente AuraStatsFilters
 * 
 * @interface AuraStatsFiltersProps
 * @property {FilterValues} [values] - Valores atuais dos filtros
 * @property {(key: string, value: string) => void} [onChange] - Callback chamado quando um filtro é alterado
 * @property {() => void} [onApply] - Callback chamado quando o botão "Aplicar" é clicado
 */
interface AuraStatsFiltersProps {
  /** Valores atuais dos filtros */
values?: FilterValues;
  /** Callback chamado quando um filtro é alterado (recebe a chave e o novo valor) */
onChange?: (e: any) => void;
  /** Callback chamado quando o botão "Aplicar" é clicado */
onApply???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

/**
 * Componente de filtros para estatísticas do Aura
 * 
 * @param {AuraStatsFiltersProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const AuraStatsFilters: React.FC<AuraStatsFiltersProps> = ({ values = {} as any, onChange, onApply }) => (
  <div className=" ">$2</div><div className=" ">$2</div><label className="text-xs text-gray-600">Período</label>
      <Select 
        value={ values.period || 'last_30_days' }
        onChange={ (value: unknown) => onChange?.('period', value) }
        options={[
          { value: 'last_7_days', label: 'Últimos 7 dias' },
          { value: 'last_30_days', label: 'Últimos 30 dias' },
          { value: 'last_90_days', label: 'Últimos 90 dias' }
        ]} /></div><Button variant="outline" onClick={ onApply }>Aplicar</Button>
  </div>);

export default AuraStatsFilters;
