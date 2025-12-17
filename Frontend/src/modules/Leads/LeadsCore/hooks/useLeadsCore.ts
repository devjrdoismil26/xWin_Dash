import { useState, useCallback } from 'react';
import { leadsCoreService } from '../services/leadsCoreService';

export const useLeadsCore = () => {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);

    try {
      const response = await leadsCoreService.getLeads(params);

      setLeads(response.data);

    } finally {
      setLoading(false);

    } , []);

  const createLead = useCallback(async (data: unknown) => {
    return leadsCoreService.createLead(data);

  }, []);

  const updateLead = useCallback(async (id: number, data: unknown) => {
    return leadsCoreService.updateLead(id, data);

  }, []);

  return { leads, loading, fetchLeads, createLead, updateLead};
};

export default useLeadsCore;
