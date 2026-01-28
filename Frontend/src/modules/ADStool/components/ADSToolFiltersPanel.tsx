import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Search } from 'lucide-react';

interface ADSToolFiltersPanelProps {
  filters: {
    search?: string;
    platform?: string;
    status?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClear?: () => void;
}

export const ADSToolFiltersPanel: React.FC<ADSToolFiltersPanelProps> = ({ 
  filters,
  onFiltersChange,
  onClear,
}) => {
  return (
    <Card title="Filtros">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar campanhas..."
            value={filters.search || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Plataforma</label>
          <select
            value={filters.platform || 'all'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFiltersChange({ ...filters, platform: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas</option>
            <option value="google">Google Ads</option>
            <option value="facebook">Facebook Ads</option>
            <option value="instagram">Instagram Ads</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFiltersChange({ ...filters, status: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="active">Ativo</option>
            <option value="paused">Pausado</option>
            <option value="ended">Finalizado</option>
          </select>
        </div>

        {onClear && (
          <Button 
            variant="outline" 
            onClick={onClear}
            className="w-full"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ADSToolFiltersPanel;
