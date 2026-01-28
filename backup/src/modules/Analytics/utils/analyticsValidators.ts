export const validatePeriod = (period: string): boolean => {
  const validPeriods = ['1d', '7d', '30d', '90d', '1y'];
  return validPeriods.includes(period);
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end && start <= new Date();
};

export const validateMetricType = (type: string): boolean => {
  const validTypes = ['views', 'users', 'sessions', 'conversion'];
  return validTypes.includes(type);
};

export const validateReportData = (data: Record<string, unknown>): boolean => {
  return data && typeof data === 'object' && 'id' in data && 'name' in data;
};