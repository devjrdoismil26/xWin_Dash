import { render } from '@testing-library/react';
import { PageLayout } from '@/layouts/PageLayout';

describe('PageLayout', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <PageLayout title="Test Page">
        <div>Content</div>
      </PageLayout>
    );
    expect(getByText('Test Page')).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByText } = render(
      <PageLayout title="Page">
        <div>Test Content</div>
      </PageLayout>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should render breadcrumbs', () => {
    const { container } = render(
      <PageLayout title="Page" breadcrumbs={[{ label: 'Home', path: '/' }]}>
        <div>Content</div>
      </PageLayout>
    );
    expect(container.querySelector('[data-testid="breadcrumbs"]')).toBeInTheDocument();
  });
});
