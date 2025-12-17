import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumbs } from '@/layouts/Breadcrumbs';

describe('Navigation - Breadcrumbs', () => {
  const mockItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Details', path: '/products/1' },
  ];

  it('should render breadcrumb items', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} />
      </BrowserRouter>
    );
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Products')).toBeInTheDocument();
    expect(getByText('Details')).toBeInTheDocument();
  });

  it('should navigate on click', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} />
      </BrowserRouter>
    );
    
    fireEvent.click(getByText('Products'));
    expect(window.location.pathname).toBe('/products');
  });

  it('should show separator', () => {
    const { container } = render(
      <BrowserRouter>
        <Breadcrumbs items={mockItems} />
      </BrowserRouter>
    );
    expect(container.textContent).toContain('/');
  });
});
