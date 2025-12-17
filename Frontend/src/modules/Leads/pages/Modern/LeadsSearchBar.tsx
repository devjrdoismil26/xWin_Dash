import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';

interface LeadsSearchBarProps {
  searchTerm: string;
  onSearchChange?: (e: any) => void;
  showFilters: boolean;
  onToggleFilters??: (e: any) => void;
  resultsCount?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsSearchBar: React.FC<LeadsSearchBarProps> = ({ searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  resultsCount
   }) => {
  return (
        <>
      <Card className="p-4" />
      <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar leads..."
            value={ searchTerm }
            onChange={ (e: unknown) => onSearchChange(e.target.value) }
            className="pl-10" /></div><Button
          variant={ showFilters ? 'default' : 'outline' }
          size="sm"
          onClick={ onToggleFilters } />
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>

        {resultsCount !== undefined && (
          <div className="{resultsCount} resultado(s)">$2</div>
    </div>
  )}
      </div>
    </Card>);};
