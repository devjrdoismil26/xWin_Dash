import { describe, it, expect, beforeEach } from 'vitest';

// Mock leads store
const createLeadsStore = () => {
  let leads = [];
  
  return {
    getLeads: () => leads,
    addLead: (lead) => {
      leads.push({ ...lead, id: Date.now() });
    },
    removeLead: (id) => {
      leads = leads.filter(lead => lead.id !== id);
    },
    updateLead: (id, updates) => {
      leads = leads.map(lead => 
        lead.id === id ? { ...lead, ...updates } : lead
      );
    },
    clearLeads: () => {
      leads = [];
    }
  };
};

describe('Leads Store', () => {
  let store;

  beforeEach(() => {
    store = createLeadsStore();
  });

  it('should initialize with empty leads', () => {
    expect(store.getLeads()).toEqual([]);
  });

  it('should add a lead', () => {
    const lead = { name: 'John Doe', email: 'john@example.com' };
    store.addLead(lead);
    
    const leads = store.getLeads();
    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject(lead);
    expect(leads[0]).toHaveProperty('id');
  });

  it('should remove a lead', () => {
    const lead = { name: 'John Doe', email: 'john@example.com' };
    store.addLead(lead);
    
    const leads = store.getLeads();
    const leadId = leads[0].id;
    
    store.removeLead(leadId);
    expect(store.getLeads()).toHaveLength(0);
  });

  it('should update a lead', () => {
    const lead = { name: 'John Doe', email: 'john@example.com' };
    store.addLead(lead);
    
    const leads = store.getLeads();
    const leadId = leads[0].id;
    
    store.updateLead(leadId, { name: 'Jane Doe' });
    
    const updatedLeads = store.getLeads();
    expect(updatedLeads[0].name).toBe('Jane Doe');
    expect(updatedLeads[0].email).toBe('john@example.com');
  });
});
