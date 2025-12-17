import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductsPage } from '@/modules/Products/pages/ProductsPage';
import { api } from '@/services/api';

jest.mock('@/services/api');

describe('Integration - Product CRUD Flow', () => {
  it('should create, read, update, delete product', async () => {
    const mockProduct = { id: '1', name: 'Test Product', price: 100, stock: 10 };
    
    // Read
    api.get.mockResolvedValue({ data: [mockProduct] });
    const { getByText, getByRole, getByLabelText } = render(
      <BrowserRouter>
        <ProductsPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(getByText('Test Product')).toBeInTheDocument();
    });
    
    // Create
    api.post.mockResolvedValue({ data: { id: '2', name: 'New Product', price: 200, stock: 20 } });
    fireEvent.click(getByRole('button', { name: /new product/i }));
    fireEvent.change(getByLabelText(/name/i), { target: { value: 'New Product' } });
    fireEvent.change(getByLabelText(/price/i), { target: { value: '200' } });
    fireEvent.click(getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
    
    // Update
    api.put.mockResolvedValue({ data: { ...mockProduct, name: 'Updated Product' } });
    fireEvent.click(getByRole('button', { name: /edit/i }));
    fireEvent.change(getByLabelText(/name/i), { target: { value: 'Updated Product' } });
    fireEvent.click(getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });
    
    // Delete
    api.delete.mockResolvedValue({ data: { success: true } });
    fireEvent.click(getByRole('button', { name: /delete/i }));
    fireEvent.click(getByRole('button', { name: /confirm/i }));
    
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalled();
    });
  });
});
