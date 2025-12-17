import React from 'react';
import { Plus, Search, Grid, List } from 'lucide-react';

interface ProductCatalogHeaderProps {
  searchTerm: string;
  onSearchChange?: (e: any) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange?: (e: any) => void;
  onCreateProduct??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductCatalogHeader: React.FC<ProductCatalogHeaderProps> = ({ searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onCreateProduct
   }) => {
  return (
            <div className=" ">$2</div><div>
           
        </div><h1 className="text-2xl font-bold">Catálogo de Produtos</h1>
        <p className="text-gray-600">Gerencie seus produtos e landing pages</p></div><div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={ searchTerm }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value) }
            placeholder="Buscar produtos..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64" /></div><div className=" ">$2</div><button
            onClick={ () => onViewModeChange('grid') }
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} `}
  >
            <Grid className="w-4 h-4" /></button><button
            onClick={ () => onViewModeChange('list') }
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} `}
  >
            <List className="w-4 h-4" /></button></div>

        <button
          onClick={ onCreateProduct }
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" />
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>);};
