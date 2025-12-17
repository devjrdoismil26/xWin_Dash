import { useState, useCallback } from 'react';
import { leadsManagerService } from '../services/leadsManagerService';

export const useLeadsManager = () => {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);

    try {
      const response = await leadsManagerService.getLeads(params);

      setLeads(response.data);

    } finally {
      setLoading(false);

    } , []);

  const createLead = useCallback(async (data: unknown) => {
    return leadsManagerService.createLead(data);

  }, []);

  const updateLead = useCallback(async (id: number, data: unknown) => {
    return leadsManagerService.updateLead(id, data);

  }, []);

  const deleteLead = useCallback(async (id: number) => {
    return leadsManagerService.deleteLead(id);

  }, []);

  return { leads, loading, fetchLeads, createLead, updateLead, deleteLead};
};

export default useLeadsManager;
