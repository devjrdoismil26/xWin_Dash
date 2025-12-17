import { renderHook, act } from '@testing-library/react';
import { useLeadStore } from '@/store/leadStore';

describe('leadStore', () => {
  beforeEach(() => {
    useLeadStore.setState({ leads: [], selectedLead: null, filters: {} );

  });

  it('should add lead', () => {
    const { result } = renderHook(() => useLeadStore());

    const lead = { id: '1', name: 'John Doe', email: 'john@test.com', status: 'new'};

    act(() => {
      result.current.addLead(lead);

    });

    expect(result.current.leads).toHaveLength(1);

    expect(result.current.leads[0]).toEqual(lead);

  });

  it('should update lead', () => {
    const { result } = renderHook(() => useLeadStore());

    act(() => {
      result.current.addLead({ id: '1', name: 'Old Name', status: 'new' });

      result.current.updateLead('1', { name: 'New Name' });

    });

    expect(result.current.leads[0].name).toBe('New Name');

  });

  it('should delete lead', () => {
    const { result } = renderHook(() => useLeadStore());

    act(() => {
      result.current.addLead({ id: '1', name: 'Lead 1' });

      result.current.addLead({ id: '2', name: 'Lead 2' });

      result.current.deleteLead('1');

    });

    expect(result.current.leads).toHaveLength(1);

    expect(result.current.leads[0].id).toBe('2');

  });

  it('should set filters', () => {
    const { result } = renderHook(() => useLeadStore());

    act(() => {
      result.current.setFilters({ status: 'qualified' });

    });

    expect(result.current.filters.status).toBe('qualified');

  });

});
