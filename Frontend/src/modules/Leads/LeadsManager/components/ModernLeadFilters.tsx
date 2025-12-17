import React from 'react';
import { FilterPanel } from './Filters/FilterPanel';

interface ModernLeadFiltersProps {
  filters: Record<string, any>;
  onApplyFilters?: (e: any) => void;
  onClearFilters??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ModernLeadFilters: React.FC<ModernLeadFiltersProps> = ({ filters, onApplyFilters    }) => {
  const handleChange = (key: string, value: unknown) => {
    onApplyFilters({ ...filters, [key]: value });};

  return <FilterPanel filters={filters} onChange={ handleChange } />;};

export default ModernLeadFilters;
