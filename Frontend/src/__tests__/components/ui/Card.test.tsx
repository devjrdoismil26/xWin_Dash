import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';

describe('Card Component', () => {
  it('should render card with children', () => {
    render(
      <Card />
        <div>Card Content</div>
      </Card>);

    expect(screen.getByText('Card Content')).toBeInTheDocument();

  });

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>);

    expect(container.firstChild).toHaveClass('custom-class');

  });

  it('should render card header with title', () => {
    render(
      <Card />
        <CardHeader />
          <CardTitle>Test Title</CardTitle></CardHeader></Card>);

    expect(screen.getByText('Test Title')).toBeInTheDocument();

  });

  it('should render card content', () => {
    render(
      <Card />
        <CardContent />
          <p>Test content</p></CardContent></Card>);

    expect(screen.getByText('Test content')).toBeInTheDocument();

  });

  it('should handle click events', () => { const handleClick = vi.fn();

    render(
      <Card onClick={handleClick } />
        Clickable Card
      </Card>);

    const card = screen.getByText('Clickable Card').parentElement;
    card?.click();

    expect(handleClick).toHaveBeenCalledTimes(1);

  });

});
