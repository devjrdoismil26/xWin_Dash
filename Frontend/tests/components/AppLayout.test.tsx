import { render } from '@testing-library/react';
import { AppLayout } from '@/layouts/AppLayout';
import { BrowserRouter } from 'react-router-dom';

describe('AppLayout', () => {
  it('should render layout structure', () => {
    const { container } = render(
      <BrowserRouter>
        <AppLayout>
          <div>Content</div>
        </AppLayout>
      </BrowserRouter>
    );
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByText } = render(
      <BrowserRouter>
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      </BrowserRouter>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should include navigation', () => {
    const { container } = render(
      <BrowserRouter>
        <AppLayout>
          <div>Content</div>
        </AppLayout>
      </BrowserRouter>
    );
    expect(container.querySelector('nav')).toBeInTheDocument();
  });
});
