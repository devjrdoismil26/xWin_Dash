import React from 'react';
import { Filter } from 'lucide-react';

interface ProductCatalogFiltersProps {
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChange?: (e: any) => void;
  onStatusChange?: (e: any) => void;
  categories: Array<{ id: string;
  name: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
}

export const ProductCatalogFilters: React.FC<ProductCatalogFiltersProps> = ({ selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  categories
   }) => {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><Filter className="w-4 h-4" />
        <h3 className="font-semibold">Filtros</h3></div><div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Categoria</label>
          <select
            value={ selectedCategory }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onCategoryChange(e.target.value) }
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat: unknown) => (
              <option key={cat.id} value={ cat.id } />
                {cat.name}
              </option>
            ))}
          </select></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={ selectedStatus }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onStatusChange(e.target.value) }
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Todos os status</option>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option></select></div>

        <div>
           
        </div><label className="block text-sm font-medium mb-2">Ordenar por</label>
          <select className="w-full px-3 py-2 border rounded-lg" />
            <option value="recent">Mais recentes</option>
            <option value="name">Nome (A-Z)</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="views">Mais visualizados</option></select></div>
    </div>);};
