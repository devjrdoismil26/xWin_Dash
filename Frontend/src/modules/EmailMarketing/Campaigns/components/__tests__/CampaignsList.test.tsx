import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const CampaignsList = ({ campaigns, onEdit, onDelete, onSend }: unknown) => (
  <div>
           
        </div>{campaigns.length === 0 ? <p>No campaigns</p> : null}
    { campaigns.map((c: unknown) => (
      <div key={ c.id  }>
        </div><span>{c.name}</span>
        <button onClick={ () => onEdit(c.id) }>Edit</button>
        <button onClick={ () => onDelete(c.id) }>Delete</button>
        <button onClick={ () => onSend(c.id) }>Send</button>
      </div>
    </>
  ))}
  </div>);

describe('CampaignsList', () => {
  const mockCampaigns = [
    { id: 1, name: 'Campaign 1' },
    { id: 2, name: 'Campaign 2' },
  ];

  it('should render all campaigns', () => {
    render(<CampaignsList campaigns={mockCampaigns} onEdit={vi.fn()} onDelete={vi.fn()} onSend={ vi.fn() } />);

    expect(screen.getByText('Campaign 1')).toBeInTheDocument();

  });

  it('should show empty state', () => {
    render(<CampaignsList campaigns={[]} onEdit={vi.fn()} onDelete={vi.fn()} onSend={ vi.fn() } />);

    expect(screen.getByText('No campaigns')).toBeInTheDocument();

  });

  it('should call onEdit', () => {
    const onEdit = vi.fn();

    render(<CampaignsList campaigns={mockCampaigns} onEdit={onEdit} onDelete={vi.fn()} onSend={ vi.fn() } />);

    fireEvent.click(screen.getAllByText('Edit')[0]);

    expect(onEdit).toHaveBeenCalledWith(1);

  });

  it('should call onDelete', () => {
    const onDelete = vi.fn();

    render(<CampaignsList campaigns={mockCampaigns} onEdit={vi.fn()} onDelete={onDelete} onSend={ vi.fn() } />);

    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(onDelete).toHaveBeenCalledWith(1);

  });

  it('should call onSend', () => {
    const onSend = vi.fn();

    render(<CampaignsList campaigns={mockCampaigns} onEdit={vi.fn()} onDelete={vi.fn()} onSend={ onSend } />);

    fireEvent.click(screen.getAllByText('Send')[0]);

    expect(onSend).toHaveBeenCalledWith(1);

  });

});
