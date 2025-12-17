import { Eye, Target, DollarSign, Users, MousePointer, Clock, BarChart3 } from 'lucide-react';

export const useAnalyticsData = (type: 'products' | 'landing-pages' | 'forms', data: unknown) => {
  const getMetricIcon = (metric: string) => {
    const icons: Record<string, any> = {
      views: Eye, conversions: Target, revenue: DollarSign,
      users: Users, clicks: MousePointer, time: Clock};

    return icons[metric] || BarChart3;};

  const getMetricColor = (metric: string) => {
    const colors: Record<string, string> = {
      views: 'text-blue-600 bg-blue-100', conversions: 'text-green-600 bg-green-100',
      revenue: 'text-purple-600 bg-purple-100', users: 'text-orange-600 bg-orange-100',
      clicks: 'text-pink-600 bg-pink-100', time: 'text-indigo-600 bg-indigo-100'};

    return colors[metric] || 'text-gray-600 bg-gray-100';};

  const getMetrics = () => {
    if (type === 'products') {
      return [
        { key: 'total_products', label: 'Total Products', value: data?.totalProducts || 0, trend: 'up' as const, change: 12 },
        { key: 'active_products', label: 'Active Products', value: data?.activeProducts || 0, trend: 'up' as const, change: 8 },
        { key: 'total_revenue', label: 'Total Revenue', value: data?.totalRevenue || 0, trend: 'up' as const, change: 15, format: 'currency' as const },
        { key: 'avg_price', label: 'Average Price', value: data?.avgPrice || 0, trend: 'stable' as const, change: 2, format: 'currency' as const }
      ];
    }
    if (type === 'landing-pages') {
      return [
        { key: 'total_pages', label: 'Total Pages', value: data?.totalPages || 0, trend: 'up' as const, change: 5 },
        { key: 'published_pages', label: 'Published Pages', value: data?.publishedPages || 0, trend: 'up' as const, change: 3 },
        { key: 'total_views', label: 'Total Views', value: data?.totalViews || 0, trend: 'up' as const, change: 25 },
        { key: 'conversion_rate', label: 'Avg Conversion Rate', value: data?.avgConversionRate || 0, trend: 'up' as const, change: 8, format: 'percentage' as const }
      ];
    }
    return [
      { key: 'total_forms', label: 'Total Forms', value: data?.totalForms || 0, trend: 'up' as const, change: 7 },
      { key: 'published_forms', label: 'Published Forms', value: data?.publishedForms || 0, trend: 'up' as const, change: 4 },
      { key: 'total_submissions', label: 'Total Submissions', value: data?.totalSubmissions || 0, trend: 'up' as const, change: 18 },
      { key: 'conversion_rate', label: 'Avg Conversion Rate', value: data?.avgConversionRate || 0, trend: 'up' as const, change: 12, format: 'percentage' as const }
    ];};

  const getTopPerformers = () => {
    if (type === 'products') {
      return [
        { name: 'Premium Widget', value: 1250, change: 15, trend: 'up' as const },
        { name: 'Basic Widget', value: 890, change: 8, trend: 'up' as const },
        { name: 'Deluxe Widget', value: 650, change: -3, trend: 'down' as const }
      ];
    }
    if (type === 'landing-pages') {
      return [
        { name: 'Homepage', value: 0.12, change: 25, trend: 'up' as const, format: 'percentage' as const },
        { name: 'Product Page', value: 0.08, change: 15, trend: 'up' as const, format: 'percentage' as const },
        { name: 'About Page', value: 0.05, change: -5, trend: 'down' as const, format: 'percentage' as const }
      ];
    }
    return [
      { name: 'Contact Form', value: 0.18, change: 20, trend: 'up' as const, format: 'percentage' as const },
      { name: 'Newsletter Signup', value: 0.15, change: 12, trend: 'up' as const, format: 'percentage' as const },
      { name: 'Lead Capture', value: 0.10, change: -2, trend: 'down' as const, format: 'percentage' as const }
    ];};

  return { getMetrics, getTopPerformers, getMetricIcon, getMetricColor};
};
