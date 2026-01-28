export const ANALYTICS_PERIODS = {
  DAY: '1d',
  WEEK: '7d',
  MONTH: '30d',
  QUARTER: '90d',
  YEAR: '1y'
} as const;

export const ANALYTICS_METRICS = {
  VIEWS: 'views',
  USERS: 'users',
  SESSIONS: 'sessions',
  CONVERSION: 'conversion'
} as const;

export const ANALYTICS_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#6B7280'
} as const;

export const ANALYTICS_CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area'
} as const;