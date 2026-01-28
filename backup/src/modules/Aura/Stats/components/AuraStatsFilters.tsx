import React from 'react';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/select';
const AuraStatsFilters = ({ values = {}, onChange, onApply }) => (
  <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg">
    <div className="grid gap-1">
      <label className="text-xs text-gray-600">Período</label>
      <Select value={values.period || 'last_30_days'} onChange={(e) => onChange?.('period', e.target.value)}>
        <option value="last_7_days">Últimos 7 dias</option>
        <option value="last_30_days">Últimos 30 dias</option>
        <option value="last_90_days">Últimos 90 dias</option>
      </Select>
    </div>
    <Button variant="outline" onClick={onApply}>Aplicar</Button>
  </div>
);
export default AuraStatsFilters;
