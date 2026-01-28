class AnalyticsValidationService {
  validatePeriod(period: string): boolean {
    const validPeriods = ['1d', '7d', '30d', '90d', '1y'];
    return validPeriods.includes(period);
  }

  validateDateRange(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end && start <= new Date();
  }

  validateMetricType(type: string): boolean {
    const validTypes = ['views', 'users', 'sessions', 'conversion'];
    return validTypes.includes(type);
  }

  validateReportData(data: Record<string, unknown>): boolean {
    return data && typeof data === 'object' && 'id' in data && 'name' in data;
  }
}

export default new AnalyticsValidationService();