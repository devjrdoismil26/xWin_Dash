import React from 'react';
import Input from '@/shared/components/ui/Input';

interface FilterPanelProps {
  filters: Record<string, any>;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange    }) => { return (
            <div className=" ">$2</div><Input placeholder="Search..." onChange={(e: unknown) => onChange('search', e.target.value) } />
    </div>);};
