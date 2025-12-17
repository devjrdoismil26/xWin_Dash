import React from 'react';
import { RefreshCw, Download, Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface DashboardHeaderProps {
  onRefresh??: (e: any) => void;
  onExport???: (e: any) => void;
  refreshing: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh,
  onExport,
  refreshing
   }) => {
  return (
            <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights em tempo real</p></div><div className=" ">$2</div><Button onClick={onRefresh} disabled={ refreshing } />
          <RefreshCw className={refreshing ? 'animate-spin' : ''} / />
          Atualizar
        </Button>
        
        {onExport && (
          <Button onClick={onExport} variant="outline" />
            <Download / />
            Exportar
          </Button>
        )}
        
        <Button variant="outline" />
          <Settings / /></Button></div>);};
