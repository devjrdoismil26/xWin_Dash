import React from 'react';
import { Select } from '@/components/ui/select';
import { DashboardSelectorProps } from '../types';
const DashboardSelector: React.FC<DashboardSelectorProps> = ({ 
  selectedDashboard, 
  onDashboardChange, 
  dashboards 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">Dashboard:</label>
      <Select
        value={selectedDashboard}
        onChange={(e) => onDashboardChange(e.target.value)}
        className="min-w-[200px]"
      >
        {dashboards.map((dashboard) => (
          <option key={dashboard} value={dashboard}>
            {dashboard}
          </option>
        ))}
      </Select>
    </div>
  );
};
export default DashboardSelector;
