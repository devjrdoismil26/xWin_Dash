import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumb } from '@/shared/components/ui/Breadcrumb';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Details' }
  ];

  it('should render breadcrumb items', () => { render(<Breadcrumb items={items } />);

    expect(screen.getByText('Home')).toBeInTheDocument();

    expect(screen.getByText('Products')).toBeInTheDocument();

    expect(screen.getByText('Details')).toBeInTheDocument();

  });

  it('should navigate on click', () => {
    const onNavigate = vi.fn();

    render(<Breadcrumb items={items} onNavigate={ onNavigate } />);

    fireEvent.click(screen.getByText('Home'));

    expect(onNavigate).toHaveBeenCalledWith('/');

  });

  it('should disable last item', () => { render(<Breadcrumb items={items } />);

    const lastItem = screen.getByText('Details');

    expect(lastItem.closest('a')).toBeNull();

  });

});
