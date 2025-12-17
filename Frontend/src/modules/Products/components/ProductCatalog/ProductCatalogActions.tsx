import React from 'react';
import { Download, Upload, Copy, Trash2 } from 'lucide-react';

interface ProductCatalogActionsProps {
  selectedCount: number;
  onExport??: (e: any) => void;
  onImport??: (e: any) => void;
  onDuplicate??: (e: any) => void;
  onBulkDelete??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductCatalogActions: React.FC<ProductCatalogActionsProps> = ({ selectedCount,
  onExport,
  onImport,
  onDuplicate,
  onBulkDelete
   }) => {
  if (selectedCount === 0) {
    return (
              <div className=" ">$2</div><button
          onClick={ onExport }
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50" />
          <Download className="w-4 h-4" />
          Exportar
        </button>
        <button
          onClick={ onImport }
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50" />
          <Upload className="w-4 h-4" />
          Importar
        </button>
      </div>);

  }

  return (
            <div className=" ">$2</div><div className=" ">$2</div><span className="{selectedCount} produto(s) selecionado(s)">$2</span>
        </span>
        <div className=" ">$2</div><button
            onClick={ onDuplicate }
            className="flex items-center gap-2 px-3 py-1 text-sm bg-white border rounded-lg hover:bg-gray-50" />
            <Copy className="w-4 h-4" />
            Duplicar
          </button>
          <button
            onClick={ onBulkDelete }
            className="flex items-center gap-2 px-3 py-1 text-sm bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50" />
            <Trash2 className="w-4 h-4" />
            Excluir
          </button></div></div>);};
