import React from 'react';
import { Select } from '@/components/ui/select';
import { DashboardPeriodSelectorProps } from '../types';
const DashboardPeriodSelector: React.FC<DashboardPeriodSelectorProps> = ({ 
  selectedPeriod, 
  onPeriodChange, 
  periods 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">Período:</label>
      <Select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value)}
        className="min-w-[150px]"
      >
        {periods.map((period) => (
          <option key={period} value={period}>
            {period}
          </option>
        ))}
      </Select>
    </div>
  );
};
export default DashboardPeriodSelector;
