import { useAnalyticsData } from './advanced/useAnalyticsData';
import { useAnalyticsMetrics } from './advanced/useAnalyticsMetrics';

export const useAnalyticsAdvanced = () => {
  const dataHook = useAnalyticsData();

  const metricsHook = useAnalyticsMetrics();

  return {
    ...dataHook,
    ...metricsHook};
};

export default useAnalyticsAdvanced;
