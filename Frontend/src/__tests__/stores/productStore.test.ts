import { renderHook, act } from '@testing-library/react';
import { useProductStore } from '@/store/productStore';

describe('productStore', () => {
  beforeEach(() => {
    useProductStore.setState({ products: [], selectedProduct: null });

  });

  it('should add product', () => {
    const { result } = renderHook(() => useProductStore());

    const product = { id: '1', name: 'Product 1', price: 99.90, sku: 'SKU001'};

    act(() => {
      result.current.addProduct(product);

    });

    expect(result.current.products).toHaveLength(1);

    expect(result.current.products[0]).toEqual(product);

  });

  it('should update product stock', () => {
    const { result } = renderHook(() => useProductStore());

    act(() => {
      result.current.addProduct({ id: '1', name: 'P1', stock: 10 });

      result.current.updateStock('1', 5);

    });

    expect(result.current.products[0].stock).toBe(5);

  });

  it('should select product', () => {
    const { result } = renderHook(() => useProductStore());

    const product = { id: '1', name: 'Product 1'};

    act(() => {
      result.current.addProduct(product);

      result.current.selectProduct('1');

    });

    expect(result.current.selectedProduct).toEqual(product);

  });

});
