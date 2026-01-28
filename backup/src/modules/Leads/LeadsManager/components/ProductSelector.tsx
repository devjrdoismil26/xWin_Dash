import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ProductSelectorProps, Product } from '../types/leadTypes';
const ProductSelector: React.FC<ProductSelectorProps> = ({ 
  products, 
  selectedProducts, 
  onProductsChange, 
  multiSelect = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleProductToggle = (productId: number) => {
    if (multiSelect) {
      const isSelected = selectedProducts.includes(productId);
      if (isSelected) {
        onProductsChange(selectedProducts.filter(id => id !== productId));
      } else {
        onProductsChange([...selectedProducts, productId]);
      }
    } else {
      onProductsChange([productId]);
    }
  };
  const handleSelectAll = () => {
    if (multiSelect) {
      const allSelected = filteredProducts.every(product => 
        selectedProducts.includes(product.id)
      );
      if (allSelected) {
        // Desmarcar todos os produtos filtrados
        const filteredIds = filteredProducts.map(p => p.id);
        onProductsChange(selectedProducts.filter(id => !filteredIds.includes(id)));
      } else {
        // Marcar todos os produtos filtrados
        const newSelected = [...new Set([...selectedProducts, ...filteredProducts.map(p => p.id)])];
        onProductsChange(newSelected);
      }
    }
  };
  const getSelectedProduct = (): Product | null => {
    if (!multiSelect && selectedProducts.length > 0) {
      return products.find(p => p.id === selectedProducts[0]) || null;
    }
    return null;
  };
  const formatPrice = (price?: number): string => {
    if (!price) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  if (!multiSelect) {
    const selectedProduct = getSelectedProduct();
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produto Selecionado
          </label>
          {selectedProduct ? (
            <div className="p-3 border rounded-lg bg-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                  {selectedProduct.description && (
                    <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {selectedProduct.category && (
                      <Badge variant="secondary">{selectedProduct.category}</Badge>
                    )}
                    <span className="text-sm text-gray-600">{formatPrice(selectedProduct.price)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onProductsChange([])}
                >
                  Remover
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              Nenhum produto selecionado
            </div>
          )}
        </div>
        <div>
          <Input
            label="Buscar Produtos"
            placeholder="Digite o nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductToggle(product.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedProducts.includes(product.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {product.category && (
                      <Badge variant="secondary">{product.category}</Badge>
                    )}
                    <span className="text-sm text-gray-600">{formatPrice(product.price)}</span>
                  </div>
                </div>
                {selectedProducts.includes(product.id) && (
                  <div className="text-blue-600">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Selecionar Produtos</h3>
          <p className="text-sm text-gray-600">
            {selectedProducts.length} de {products.length} produtos selecionados
          </p>
        </div>
        {filteredProducts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {filteredProducts.every(product => selectedProducts.includes(product.id))
              ? 'Desmarcar Todos'
              : 'Marcar Todos'
            }
          </Button>
        )}
      </div>
      {/* Busca */}
      <div>
        <Input
          label="Buscar Produtos"
          placeholder="Digite o nome, descrição ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Produtos Selecionados */}
      {selectedProducts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Produtos Selecionados</h4>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((productId) => {
              const product = products.find(p => p.id === productId);
              if (!product) return null;
              return (
                <Badge key={productId} variant="primary" className="pr-1">
                  {product.name}
                  <button
                    type="button"
                    onClick={() => handleProductToggle(productId)}
                    className="ml-1 text-current hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
      {/* Lista de Produtos */}
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum produto encontrado</p>
            {searchTerm && (
              <p className="text-sm">Tente ajustar os termos de busca</p>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductToggle(product.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedProducts.includes(product.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {product.category && (
                      <Badge variant="secondary">{product.category}</Badge>
                    )}
                    <span className="text-sm text-gray-600">{formatPrice(product.price)}</span>
                  </div>
                </div>
                {selectedProducts.includes(product.id) && (
                  <div className="text-blue-600">✓</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ProductSelector;
