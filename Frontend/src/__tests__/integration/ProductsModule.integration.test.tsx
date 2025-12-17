import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductsModule } from '@/modules/Products';
import { productsAPI } from '@/api/products';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/api/products');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={ queryClient } />
      {children}
    </QueryClientProvider>);};

describe('Products Module Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should display products list', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 99.90, stock: 10, status: 'active' },
      { id: '2', name: 'Product 2', price: 149.90, stock: 5, status: 'active' },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    render(<ProductsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();

      expect(screen.getByText('Product 2')).toBeInTheDocument();

    });

  });

  it('should create a new product', async () => {
    vi.mocked(productsAPI.getProducts).mockResolvedValue([]);

    vi.mocked(productsAPI.createProduct).mockResolvedValue({
      id: '3',
      name: 'New Product',
      sku: 'PRD-001',
      price: 199.90,
      stock: 20,
      status: 'active',
    });

    const user = userEvent.setup();

    render(<ProductsModule />, { wrapper: createWrapper() });

    const createButton = await screen.findByRole('button', { name: /create product/i });

    await user.click(createButton);

    await user.type(screen.getByLabelText(/name/i), 'New Product');

    await user.type(screen.getByLabelText(/sku/i), 'PRD-001');

    await user.type(screen.getByLabelText(/price/i), '199.90');

    await user.type(screen.getByLabelText(/stock/i), '20');

    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(productsAPI.createProduct).toHaveBeenCalledWith({
        name: 'New Product',
        sku: 'PRD-001',
        price: 199.90,
        stock: 20,
      });

    });

  });

  it('should update product stock', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', stock: 10 },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    vi.mocked(productsAPI.updateStock).mockResolvedValue({
      id: '1',
      name: 'Product 1',
      stock: 20,
    });

    const user = userEvent.setup();

    render(<ProductsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();

    });

    const stockButton = screen.getByRole('button', { name: /update stock/i });

    await user.click(stockButton);

    const quantityInput = screen.getByLabelText(/quantity/i);

    await user.type(quantityInput, '10');

    const addButton = screen.getByRole('button', { name: /add/i });

    await user.click(addButton);

    await waitFor(() => {
      expect(productsAPI.updateStock).toHaveBeenCalledWith('1', 10, 'add');

    });

  });

  it('should filter products by status', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', status: 'active' },
      { id: '2', name: 'Product 2', status: 'inactive' },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    const user = userEvent.setup();

    render(<ProductsModule />, { wrapper: createWrapper() });

    const filterSelect = await screen.findByLabelText(/status/i);

    await user.selectOptions(filterSelect, 'active');

    await waitFor(() => {
      expect(productsAPI.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' }));

    });

  });

  it('should search products by name', async () => {
    const mockProducts = [
      { id: '1', name: 'Laptop', price: 999.90 },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    const user = userEvent.setup();

    render(<ProductsModule />, { wrapper: createWrapper() });

    const searchInput = await screen.findByPlaceholderText(/search/i);

    await user.type(searchInput, 'Laptop');

    await waitFor(() => {
      expect(productsAPI.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Laptop' }));

    });

  });

  it('should display low stock warning', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', stock: 2, min_stock: 5 },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    render(<ProductsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/low stock/i)).toBeInTheDocument();

    });

  });

  it('should calculate total inventory value', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100, stock: 10 },
      { id: '2', name: 'Product 2', price: 50, stock: 20 },
    ];

    vi.mocked(productsAPI.getProducts).mockResolvedValue(mockProducts);

    render(<ProductsModule />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/total value.*2000/i)).toBeInTheDocument();

    });

  });

});
