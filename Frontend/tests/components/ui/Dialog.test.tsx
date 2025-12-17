import { render, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/shared/components/ui/dialog';

describe('UI - Dialog', () => {
  it('should open dialog on trigger click', () => {
    const { getByRole, getByText } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );
    
    fireEvent.click(getByRole('button', { name: /open/i }));
    expect(getByText('Dialog Title')).toBeInTheDocument();
  });

  it('should close dialog on escape', () => {
    const { getByRole, queryByText } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    
    fireEvent.click(getByRole('button', { name: /open/i }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(queryByText('Title')).not.toBeInTheDocument();
  });
});
