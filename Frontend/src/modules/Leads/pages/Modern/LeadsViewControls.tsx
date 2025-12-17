import React from 'react';
import { Grid, List, BarChart3 } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

export type ViewMode = 'grid' | 'list' | 'analytics';

interface LeadsViewControlsProps {
  viewMode: ViewMode;
  onViewModeChange?: (e: any) => void;
  selectedCount: number;
  onBulkExport???: (e: any) => void;
  onBulkDelete???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsViewControls: React.FC<LeadsViewControlsProps> = ({ viewMode,
  onViewModeChange,
  selectedCount,
  onBulkExport,
  onBulkDelete
   }) => {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><Button
          variant={ viewMode === 'grid' ? 'default' : 'outline' }
          size="sm"
          onClick={ () => onViewModeChange('grid')  }>
          <Grid className="w-4 h-4" /></Button><Button
          variant={ viewMode === 'list' ? 'default' : 'outline' }
          size="sm"
          onClick={ () => onViewModeChange('list')  }>
          <List className="w-4 h-4" /></Button><Button
          variant={ viewMode === 'analytics' ? 'default' : 'outline' }
          size="sm"
          onClick={ () => onViewModeChange('analytics')  }>
          <BarChart3 className="w-4 h-4" /></Button></div>

      {selectedCount > 0 && (
        <div className=" ">$2</div><span className="{selectedCount} selecionado(s)">$2</span>
          </span>
          { onBulkExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport } />
              Exportar
            </Button>
          )}
          {onBulkDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={ onBulkDelete }
              className="text-red-600 hover:text-red-700" />
              Remover
            </Button>
          )}
        </div>
      )}
    </div>);};
