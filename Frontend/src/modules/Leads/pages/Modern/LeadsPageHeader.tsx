import React from 'react';
import { Plus, Download, Upload, RefreshCw } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface LeadsPageHeaderProps {
  onCreateLead??: (e: any) => void;
  onExport??: (e: any) => void;
  onImport??: (e: any) => void;
  onRefresh??: (e: any) => void;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsPageHeader: React.FC<LeadsPageHeaderProps> = ({ onCreateLead,
  onExport,
  onImport,
  onRefresh,
  loading = false
   }) => {
  return (
            <div className=" ">$2</div><div>
           
        </div><h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-600 mt-1" />
          Gerencie e acompanhe seus leads
        </p></div><div className=" ">$2</div><Button
          variant="outline"
          size="sm"
          onClick={ onRefresh }
          disabled={ loading } />
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} `} / /></Button><Button
          variant="outline"
          size="sm"
          onClick={ onImport } />
          <Upload className="w-4 h-4 mr-2" />
          Importar
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={ onExport } />
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>

        <Button
          onClick={ onCreateLead } />
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>);};
