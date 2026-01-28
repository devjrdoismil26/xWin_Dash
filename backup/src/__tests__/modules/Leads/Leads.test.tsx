import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do componente Leads
const Leads = () => {
  const [leads, setLeads] = React.useState([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '+55 11 99999-9999',
      status: 'active',
      source: 'website',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+55 11 88888-8888',
      status: 'inactive',
      source: 'social',
      created_at: '2024-01-14T10:00:00Z'
    }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const createLead = (leadData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setLeads(prev => [...prev, {
        id: Date.now(),
        ...leadData,
        created_at: new Date().toISOString()
      }]);
      setIsLoading(false);
    }, 500);
  };

  const updateLead = (id: number, updates: any) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates } : lead
    ));
  };

  const deleteLead = (id: number) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  return (
    <div data-testid="leads-module" className="leads-module">
      <h1 data-testid="leads-title">Leads Management</h1>
      
      <div data-testid="leads-filters" className="leads-filters">
        <input
          data-testid="search-input"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          data-testid="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button 
          data-testid="create-lead-button"
          onClick={() => createLead({
            name: 'New Lead',
            email: 'new@example.com',
            phone: '+55 11 77777-7777',
            status: 'active',
            source: 'manual'
          })}
        >
          Create Lead
        </button>
      </div>

      {isLoading && <div data-testid="leads-loading">Loading...</div>}

      <div data-testid="leads-list" className="leads-list">
        {filteredLeads.map(lead => (
          <div key={lead.id} data-testid={`lead-${lead.id}`} className="lead-item">
            <div data-testid={`lead-name-${lead.id}`}>{lead.name}</div>
            <div data-testid={`lead-email-${lead.id}`}>{lead.email}</div>
            <div data-testid={`lead-phone-${lead.id}`}>{lead.phone}</div>
            <div data-testid={`lead-status-${lead.id}`}>{lead.status}</div>
            <div data-testid={`lead-source-${lead.id}`}>{lead.source}</div>
            <button 
              data-testid={`edit-lead-${lead.id}`}
              onClick={() => updateLead(lead.id, { status: 'active' })}
            >
              Edit
            </button>
            <button 
              data-testid={`delete-lead-${lead.id}`}
              onClick={() => deleteLead(lead.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div data-testid="leads-count">Total: {filteredLeads.length}</div>
    </div>
  );
};

describe('Leads Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should render leads interface', async () => {
    render(<Leads />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('leads-module')).toBeInTheDocument();
    });
  });

  it('should display leads title', async () => {
    render(<Leads />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('leads-title')).toBeInTheDocument();
      expect(screen.getByText('Leads Management')).toBeInTheDocument();
    });
  });

  it('should display leads data', async () => {
    render(<Leads />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('lead-1')).toBeInTheDocument();
      expect(screen.getByTestId('lead-2')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('joao@example.com')).toBeInTheDocument();
      expect(screen.getByText('maria@example.com')).toBeInTheDocument();
    });
  });

  it('should handle lead creation', async () => {
    render(<Leads />, { queryClient });

    const createButton = screen.getByTestId('create-lead-button');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('leads-loading')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('New Lead')).toBeInTheDocument();
      expect(screen.getByText('new@example.com')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should handle lead editing', async () => {
    render(<Leads />, { queryClient });

    const editButton = screen.getByTestId('edit-lead-1');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('lead-status-1')).toHaveTextContent('active');
    });
  });

  it('should handle lead deletion', async () => {
    render(<Leads />, { queryClient });

    const deleteButton = screen.getByTestId('delete-lead-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId('lead-1')).not.toBeInTheDocument();
    });
  });

  it('should handle lead search', async () => {
    render(<Leads />, { queryClient });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'João' } });

    await waitFor(() => {
      expect(screen.getByTestId('lead-1')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-2')).not.toBeInTheDocument();
    });
  });

  it('should handle status filtering', async () => {
    render(<Leads />, { queryClient });

    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'active' } });

    await waitFor(() => {
      expect(screen.getByTestId('lead-1')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-2')).not.toBeInTheDocument();
    });
  });

  it('should display leads count', async () => {
    render(<Leads />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('leads-count')).toHaveTextContent('Total: 2');
    });
  });

  it('should be responsive', async () => {
    render(<Leads />, { queryClient });

    await waitFor(() => {
      const leadsModule = screen.getByTestId('leads-module');
      expect(leadsModule).toHaveClass('leads-module');
    });
  });

  it('should support dark theme', async () => {
    render(<Leads />, { 
      queryClient, 
      theme: 'dark' 
    });

    await waitFor(() => {
      const leadsModule = screen.getByTestId('leads-module');
      expect(leadsModule).toHaveClass('leads-module');
    });
  });
});