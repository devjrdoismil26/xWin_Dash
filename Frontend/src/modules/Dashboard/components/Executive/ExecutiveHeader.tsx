import React from 'react';
import { RefreshCw, Download, Settings, Filter } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';
import WorkspaceModeSelector from '@/modules/Universe/WorkspaceModeSelector';

interface ExecutiveHeaderProps {
  period: string;
  onPeriodChange?: (e: any) => void;
  onRefresh??: (e: any) => void;
  onExport??: (e: any) => void;
  isLoading: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({ period,
  onPeriodChange,
  onRefresh,
  onExport,
  isLoading
   }) => {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
            Executive Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" />
            Visão geral completa de todas as métricas e KPIs
          </p></div><div className=" ">$2</div><WorkspaceModeSelector / />
          <Select
            value={ period }
            onValueChange={ onPeriodChange }
            className="w-40" />
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option></Select><Button
            variant="outline"
            size="sm"
            onClick={ onRefresh }
            disabled={ isLoading } />
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''} `} / /></Button><Button
            variant="outline"
            size="sm"
            onClick={ onExport } />
            <Download className="w-4 h-4" /></Button><Button
            variant="outline"
            size="sm" />
            <Settings className="w-4 h-4" /></Button></div>
    </div>);};
