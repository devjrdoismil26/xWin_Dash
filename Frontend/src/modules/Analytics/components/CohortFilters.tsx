import React from 'react';
import Select from '@/shared/components/ui/Select';

export const CohortFilters: React.FC<{ filters: unknown; onChange?: (e: any) => void }> = ({ filters, onChange }) => (
  <div className=" ">$2</div><Select value={filters.period || '30d'} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...filters, period: e.target.value })}>
      <option value="7d">7 dias</option>
      <option value="30d">30 dias</option></Select></div>);
