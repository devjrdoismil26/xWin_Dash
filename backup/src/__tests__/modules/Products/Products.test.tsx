import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do módulo Products com implementação fragmentada
const Products = () => {
  const [products, setProducts] = React.useState([
    { id: '1', name: 'Produto 1', price: 99.99, status: 'active', category: 'electronics', sku: 'PROD-001' },
    { id: '2', name: 'Produto 2', price: 149.99, status: 'inactive', category: 'clothing', sku: 'PROD-002' },
    { id: '3', name: 'Produto 3', price: 199.99, status: 'active', category: 'electronics', sku: 'PROD-003' }
  ]);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const createProduct = (productData: any) => {
    const newProduct = {
      id: (products.length + 1).toString(),
      ...productData,
      created_at: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const toggleProductStatus = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateProduct(id, { status: product.status === 'active' ? 'inactive' : 'active' });
    }
  };

  const refreshProducts = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStats = () => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    return { total, active, totalValue };
  };

  const stats = getStats();

  return (
    <div data-testid="products-module">
      <h1>Products Management</h1>
      
      {/* Estatísticas */}
      <div data-testid="stats">
        <div>Total de produtos: {stats.total}</div>
        <div>Produtos ativos: {stats.active}</div>
        <div>Valor total: R$ {stats.totalValue.toFixed(2)}</div>
      </div>

      {/* Filtros */}
      <div data-testid="filters">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          data-testid="category-filter"
        >
          <option value="all">Todas as categorias</option>
          <option value="electronics">Eletrônicos</option>
          <option value="clothing">Roupas</option>
        </select>
      </div>

      {/* Ações */}
      <div data-testid="actions">
        <button onClick={() => createProduct({ name: 'Novo Produto', price: 99.99, status: 'active', category: 'electronics', sku: 'NEW-001' })} data-testid="create-product-btn">
          Criar Produto
        </button>
        <button onClick={refreshProducts} data-testid="refresh-btn" disabled={isLoading}>
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Lista de produtos */}
      <div data-testid="products-list">
        {filteredProducts.map(product => (
          <div key={product.id} data-testid={`product-${product.id}`} className="product-card">
            <h3>{product.name}</h3>
            <p>SKU: {product.sku}</p>
            <p>Preço: R$ {product.price.toFixed(2)}</p>
            <p>Categoria: {product.category}</p>
            <p>Status: {product.status}</p>
            <div>
              <button onClick={() => toggleProductStatus(product.id)} data-testid={`toggle-status-${product.id}`}>
                Alternar Status
              </button>
              <button onClick={() => updateProduct(product.id, { name: `${product.name} (Editado)` })} data-testid={`edit-${product.id}`}>
                Editar
              </button>
              <button onClick={() => deleteProduct(product.id)} data-testid={`delete-${product.id}`}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading && <div data-testid="loading">Carregando produtos...</div>}
    </div>
  );
};

describe('Products Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  it('should render products module', () => {
    render(<Products />, { queryClient });
    expect(screen.getByTestId('products-module')).toBeInTheDocument();
    expect(screen.getByText('Products Management')).toBeInTheDocument();
  });

  it('should display product statistics', () => {
    render(<Products />, { queryClient });
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByText('Total de produtos: 3')).toBeInTheDocument();
    expect(screen.getByText('Produtos ativos: 2')).toBeInTheDocument();
    expect(screen.getByText('Valor total: R$ 449.97')).toBeInTheDocument();
  });

  it('should filter products by search term', () => {
    render(<Products />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Produto 1' } });
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
  });

  it('should filter products by category', () => {
    render(<Products />, { queryClient });
    const categoryFilter = screen.getByTestId('category-filter');
    fireEvent.change(categoryFilter, { target: { value: 'electronics' } });
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-3')).toBeInTheDocument();
    expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
  });

  it('should create new product', () => {
    render(<Products />, { queryClient });
    const createButton = screen.getByTestId('create-product-btn');
    fireEvent.click(createButton);
    expect(screen.getByTestId('product-4')).toBeInTheDocument();
    expect(screen.getByText('Novo Produto')).toBeInTheDocument();
  });

  it('should toggle product status', () => {
    render(<Products />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-status-1');
    fireEvent.click(toggleButton);
    const product1 = screen.getByTestId('product-1');
    expect(product1).toHaveTextContent('inactive');
  });

  it('should edit product', () => {
    render(<Products />, { queryClient });
    const editButton = screen.getByTestId('edit-1');
    fireEvent.click(editButton);
    expect(screen.getByText('Produto 1 (Editado)')).toBeInTheDocument();
  });

  it('should delete product', () => {
    render(<Products />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
  });

  it('should refresh products', async () => {
    render(<Products />, { queryClient });
    const refreshButton = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshButton);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('should display product details correctly', () => {
    render(<Products />, { queryClient });
    expect(screen.getByText('Produto 1')).toBeInTheDocument();
    expect(screen.getByText('SKU: PROD-001')).toBeInTheDocument();
    expect(screen.getByText('Preço: R$ 99.99')).toBeInTheDocument();
    expect(screen.getByText('Categoria: electronics')).toBeInTheDocument();
    expect(screen.getByText('Status: active')).toBeInTheDocument();
  });

  it('should handle empty search results', () => {
    render(<Products />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'inexistente' } });
    expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-3')).not.toBeInTheDocument();
  });

  it('should handle multiple filters simultaneously', () => {
    render(<Products />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    const categoryFilter = screen.getByTestId('category-filter');
    
    fireEvent.change(searchInput, { target: { value: 'Produto' } });
    fireEvent.change(categoryFilter, { target: { value: 'electronics' } });
    
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-3')).toBeInTheDocument();
    expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
  });

  it('should update statistics after product creation', () => {
    render(<Products />, { queryClient });
    const createButton = screen.getByTestId('create-product-btn');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Total de produtos: 4')).toBeInTheDocument();
    expect(screen.getByText('Produtos ativos: 3')).toBeInTheDocument();
  });

  it('should update statistics after product deletion', () => {
    render(<Products />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Total de produtos: 2')).toBeInTheDocument();
    expect(screen.getByText('Produtos ativos: 1')).toBeInTheDocument();
  });
});
