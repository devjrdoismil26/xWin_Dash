import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyticsPreviewProps {
  data: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AnalyticsPreview: React.FC<AnalyticsPreviewProps> = ({ data    }) => {
  if (!data.name) {
    return (
              <div className=" ">$2</div><BarChart3 className="h-12 w-12 mb-4" />
        <p>Configure o relatório para ver a pré-visualização</p>
      </div>);

  }

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold text-white mb-2">{data.name}</h3>
        <p className="text-sm text-gray-400">Tipo: {data.type || 'dashboard'}</p>
        <p className="text-sm text-gray-400">Período: {data.period || '30d'}</p></div><div className=" ">$2</div><BarChart3 className="h-16 w-16 text-gray-600" />
      </div>);};
