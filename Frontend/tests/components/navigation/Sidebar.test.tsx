import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from '@/shared/components/Navigation/Sidebar';

describe('Navigation - Sidebar', () => {
  const mockRoutes = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/products', label: 'Products', icon: 'box' },
  ];

  it('should render navigation items', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Sidebar routes={mockRoutes} />
      </BrowserRouter>
    );
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Products')).toBeInTheDocument();
  });

  it('should navigate on click', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Sidebar routes={mockRoutes} />
      </BrowserRouter>
    );
    
    fireEvent.click(getByText('Products'));
    expect(window.location.pathname).toBe('/products');
  });

  it('should collapse sidebar', () => {
    const { getByRole, container } = render(
      <BrowserRouter>
        <Sidebar routes={mockRoutes} collapsible />
      </BrowserRouter>
    );
    
    fireEvent.click(getByRole('button', { name: /collapse/i }));
    expect(container.firstChild).toHaveClass('collapsed');
  });
});
