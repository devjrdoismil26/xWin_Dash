import { useState, useCallback } from 'react';

export const useADStoolAdvanced = () => {
  const [campaigns, setCampaigns] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);

    try {
      // API call
    } finally {
      setLoading(false);

    } , []);

  return { campaigns, loading, fetchCampaigns};
};

export default useADStoolAdvanced;
