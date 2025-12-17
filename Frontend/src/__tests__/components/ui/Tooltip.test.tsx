import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tooltip } from '@/shared/components/ui/Tooltip';

describe('Tooltip', () => {
  it('should show tooltip on hover', async () => {
    render(
      <Tooltip content="Tooltip text" />
        <button>Hover me</button>
      </Tooltip>);

    const button = screen.getByText('Hover me');

    fireEvent.mouseEnter(button);

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeVisible();

    });

  });

  it('should hide tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip text" />
        <button>Hover me</button>
      </Tooltip>);

    const button = screen.getByText('Hover me');

    fireEvent.mouseEnter(button);

    fireEvent.mouseLeave(button);

    await waitFor(() => {
      expect(screen.queryByText('Tooltip text')).not.toBeVisible();

    });

  });

  it('should render in different positions', () => {
    const { rerender } = render(
      <Tooltip content="Text" position="top" />
        <button>Button</button>
      </Tooltip>);

    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <Tooltip content="Text" position="bottom" />
        <button>Button</button>
      </Tooltip>);

    expect(screen.getByRole('button')).toBeInTheDocument();

  });

});
