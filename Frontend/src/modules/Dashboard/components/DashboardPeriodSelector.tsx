/**
 * @module modules/Dashboard/components/DashboardPeriodSelector
 * @description
 * Componente seletor de período do dashboard.
 * 
 * Permite selecionar o período de análise dos dados:
 * - Hoje, Ontem
 * - Últimos 7, 30, 90, 365 dias
 * 
 * @example
 * ```typescript
 * <DashboardPeriodSelector
 *   selectedPeriod="30days"
 *   onPeriodChange={ (period: unknown) =>  }
 *   periods={ ['today', '7days', '30days', '90days'] }
 * />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Select from '@/shared/components/ui/Select';
import { DashboardPeriodSelectorProps } from '../types';
const DashboardPeriodSelector: React.FC<DashboardPeriodSelectorProps> = ({ selectedPeriod, 
  onPeriodChange, 
  periods 
   }) => {
  return (
            <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Período:</label>
      <Select
        value={ selectedPeriod }
        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onPeriodChange(e.target.value) }
        className="min-w-[150px]"
      >
        {(periods || []).map((period: unknown) => (
          <option key={period} value={ period } />
            {period}
          </option>
        ))}
      </Select>
    </div>);};

export default DashboardPeriodSelector;
