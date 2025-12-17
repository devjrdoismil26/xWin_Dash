/**
 * @module modules/Dashboard/components/DashboardSelector
 * @description
 * Componente seletor de dashboard.
 * 
 * Permite alternar entre diferentes dashboards dispon?veis.
 * 
 * @example
 * ```typescript
 * <DashboardSelector
 *   selectedDashboard="main"
 *   onDashboardChange={ (dashboard: unknown) =>  }
 *   dashboards={ ['main', 'executive', 'analytics'] }
 * />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Select from '@/shared/components/ui/Select';
import { DashboardSelectorProps } from '../types';
const DashboardSelector: React.FC<DashboardSelectorProps> = ({ selectedDashboard, 
  onDashboardChange, 
  dashboards 
   }) => {
  return (
            <div className=" ">$2</div><label className="text-sm font-medium text-gray-700">Dashboard:</label>
      <Select
        value={ selectedDashboard }
        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onDashboardChange(e.target.value) }
        className="min-w-[200px]"
      >
        {(dashboards || []).map((dashboard: unknown) => (
          <option key={dashboard} value={ dashboard } />
            {dashboard}
          </option>
        ))}
      </Select>
    </div>);};

export default DashboardSelector;
