import React from 'react';
import { Eye, Edit2, Trash2, BarChart3 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  status: 'draft' | 'published' | 'archived';
  images: string[];
  performance: {
    views: number;
  conversions: number;
  revenue: number;
  rating: number; };

}

interface ProductCatalogGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onView?: (e: any) => void;
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  onAnalytics?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductCatalogGrid: React.FC<ProductCatalogGridProps> = ({ products,
  viewMode,
  onView,
  onEdit,
  onDelete,
  onAnalytics
   }) => {
  if (products.length === 0) {
    return (
              <div className=" ">$2</div><p className="text-gray-500">Nenhum produto encontrado</p>
      </div>);

  }

  if (viewMode === 'list') {
    return (
              <div className="{products.map((product: unknown) => (">$2</div>
          <div key={product.id} className="bg-white p-4 rounded-lg border flex items-center gap-4">
           
        </div><img
              src={ product.images[0] || '/placeholder.png' }
              alt={ product.name }
              className="w-16 h-16 object-cover rounded"
            / />
            <div className=" ">$2</div><h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p></div><div className=" ">$2</div><div className="font-bold">R$ {product.price.toFixed(2)}</div>
              <div className="text-sm text-gray-600">{product.performance.views} visualizações</div>
            <div className=" ">$2</div><button onClick={() => onView(product.id)} className="p-2 hover:bg-gray-100 rounded">
                <Eye className="w-4 h-4" /></button><button onClick={() => onEdit(product.id)} className="p-2 hover:bg-gray-100 rounded">
                <Edit2 className="w-4 h-4" /></button><button onClick={() => onAnalytics(product.id)} className="p-2 hover:bg-gray-100 rounded">
                <BarChart3 className="w-4 h-4" /></button><button onClick={() => onDelete(product.id)} className="p-2 hover:bg-red-50 text-red-500 rounded">
                <Trash2 className="w-4 h-4" /></button></div>
        ))}
      </div>);

  }

  return (
            <div className="{products.map((product: unknown) => (">$2</div>
        <div key={product.id} className="bg-white rounded-lg border overflow-hidden group">
           
        </div><div className=" ">$2</div><img
              src={ product.images[0] || '/placeholder.png' }
              alt={ product.name }
              className="w-full h-full object-cover"
            / />
            <div className=" ">$2</div><button onClick={() => onView(product.id)} className="p-2 bg-white rounded-full">
                <Eye className="w-4 h-4" /></button><button onClick={() => onEdit(product.id)} className="p-2 bg-white rounded-full">
                <Edit2 className="w-4 h-4" /></button><button onClick={() => onAnalytics(product.id)} className="p-2 bg-white rounded-full">
                <BarChart3 className="w-4 h-4" /></button><button onClick={() => onDelete(product.id)} className="p-2 bg-white rounded-full text-red-500">
                <Trash2 className="w-4 h-4" /></button></div>
          <div className=" ">$2</div><h3 className="font-semibold mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <div className=" ">$2</div><div>
           
        </div><div className="font-bold">R$ {product.price.toFixed(2)}</div>
                {product.originalPrice && (
                  <div className="R$ {product.originalPrice.toFixed(2)}">$2</div>
    </div>
  )}
              </div>
              <div className="{product.performance.views} views">$2</div>
              </div>
    </div>
  ))}
    </div>);};
