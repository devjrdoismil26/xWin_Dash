import { render } from '@testing-library/react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Alert } from '@/shared/components/ui/Alert';

describe('Component Snapshots', () => {
  it('should match Button snapshot', () => {
    const { container } = render(<Button>Click me</Button>);

    expect(container).toMatchSnapshot();

  });

  it('should match Card snapshot', () => {
    const { container } = render(
      <Card title="Test Card">Content</Card>);

    expect(container).toMatchSnapshot();

  });

  it('should match Badge snapshot', () => {
    const { container } = render(<Badge variant="success">Active</Badge>);

    expect(container).toMatchSnapshot();

  });

  it('should match Alert snapshot', () => {
    const { container } = render(<Alert variant="info">Info message</Alert>);

    expect(container).toMatchSnapshot();

  });

});
