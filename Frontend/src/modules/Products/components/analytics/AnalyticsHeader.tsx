import React from 'react';
import Button from '@/shared/components/ui/Button';
import { RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsHeaderProps {
  type: 'products' | 'landing-pages' | 'forms';
  loading?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  onRefresh???: (e: any) => void;
  onExport???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ type, loading, showRefresh, showExport, onRefresh, onExport
   }) => {
  const titles = {
    products: 'Product Analytics',
    'landing-pages': 'Landing Page Analytics',
    forms: 'Form Analytics'};

  return (
            <div className=" ">$2</div><div>
           
        </div><h2 className="text-2xl font-bold text-gray-900">{titles[type]}</h2>
        <p className="text-gray-600 mt-1">Performance insights for the last 30 days</p></div><div className="{showRefresh && (">$2</div>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={ loading } />
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} / />
            Refresh
          </Button>
        )}
        { showExport && (
          <Button variant="outline" size="sm" onClick={onExport } />
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>);};
