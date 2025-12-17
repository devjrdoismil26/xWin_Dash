import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { IntegrationList } from '@/modules/Integrations/components/IntegrationList';

describe('IntegrationList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render integration list', async () => {
    render(<IntegrationList />);
    
    await waitFor(() => {
      expect(screen.getByText(/integrations/i)).toBeInTheDocument();
    });
  });

  it('should display available integrations', async () => {
    render(<IntegrationList />);
    
    await waitFor(() => {
      expect(screen.getByText(/connect/i)).toBeInTheDocument();
    });
  });

  it('should allow connecting new integration', async () => {
    render(<IntegrationList />);
    
    const connectButton = screen.getByRole('button', { name: /connect/i });
    expect(connectButton).toBeInTheDocument();
  });

  it('should display integration status', async () => {
    render(<IntegrationList />);
    
    // Test status display
    await waitFor(() => {
      expect(screen.queryByText(/active|inactive|connected/i)).toBeInTheDocument();
    });
  });
});
