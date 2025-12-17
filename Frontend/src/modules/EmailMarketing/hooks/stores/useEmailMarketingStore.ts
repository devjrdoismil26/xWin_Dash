import { useCampaignsStore } from './useCampaignsStore';
import { useTemplatesStore } from './useTemplatesStore';
import { useSegmentsStore } from './useSegmentsStore';
import { useSubscribersStore } from './useSubscribersStore';
import { useMetricsStore } from './useMetricsStore';

export const useEmailMarketingStore = () => {
  const campaigns = useCampaignsStore();

  const templates = useTemplatesStore();

  const segments = useSegmentsStore();

  const subscribers = useSubscribersStore();

  const metrics = useMetricsStore();

  return {
    campaigns,
    templates,
    segments,
    subscribers,
    metrics};
};

export { useCampaignsStore, useTemplatesStore, useSegmentsStore, useSubscribersStore, useMetricsStore };
