import React from 'react';
import { RefreshCw, Download } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface AnalyticsHeaderProps {
  onRefresh??: (e: any) => void;
  onExport??: (e: any) => void;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ onRefresh,
  onExport,
  loading
   }) => {
  return (
            <div className=" ">$2</div><div>
           
        </div><h1 className="text-2xl font-bold">Analytics Avançado</h1>
        <p className="text-sm text-gray-600">Análise detalhada de métricas</p></div><div className=" ">$2</div><Button variant="outline" size="sm" onClick={onRefresh} disabled={ loading } />
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} `} / /></Button><Button variant="outline" size="sm" onClick={ onExport } />
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>);};
