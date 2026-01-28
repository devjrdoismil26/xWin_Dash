import { Card } from "@/components/ui/Card";
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('Card', () => {
  it('renders card with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(
      <Card>
        <div>Card content</div>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Card content</div>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('renders card header when provided', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Content>Card content</Card.Content>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders card footer when provided', () => {
    render(
      <Card>
        <Card.Content>Card content</Card.Content>
        <Card.Footer>
          <button>Action</button>
        </Card.Footer>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    
    render(
      <Card onClick={handleClick}>
        <div>Clickable card</div>
      </Card>
    );

    fireEvent.click(screen.getByText('Clickable card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover effects when interactive', () => {
    const { container } = render(
      <Card interactive>
        <div>Interactive card</div>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass('cursor-pointer', 'transition-all', 'hover:shadow-md');
  });

  it('renders with different variants', () => {
    const { container: defaultContainer } = render(
      <Card variant="default">
        <div>Default card</div>
      </Card>
    );

    const { container: outlineContainer } = render(
      <Card variant="outline">
        <div>Outline card</div>
      </Card>
    );

    expect(defaultContainer.firstChild).toHaveClass('bg-card');
    expect(outlineContainer.firstChild).toHaveClass('border-2');
  });

  it('applies size variants correctly', () => {
    const { container: smContainer } = render(
      <Card size="sm">
        <div>Small card</div>
      </Card>
    );

    const { container: lgContainer } = render(
      <Card size="lg">
        <div>Large card</div>
      </Card>
    );

    expect(smContainer.firstChild).toHaveClass('p-3');
    expect(lgContainer.firstChild).toHaveClass('p-6');
  });

  it('renders loading state', () => {
    render(
      <Card loading>
        <div>Card content</div>
      </Card>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    const { container } = render(
      <Card disabled>
        <div>Disabled card</div>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
  });
});
