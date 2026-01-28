// ========================================
// PRODUCTS MODULE - MODERN ANALYTICS
// ========================================
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer, 
  Target, 
  DollarSign,
  Eye,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
interface ModernAnalyticsProps {
  type: 'products' | 'landing-pages' | 'forms';
  data: any;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onFilterChange?: (filters: any) => void;
  className?: string;
  showMetrics?: boolean;
  showCharts?: boolean;
  showTrends?: boolean;
  showComparisons?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  timeRange?: string;
}
export const ModernAnalytics: React.FC<ModernAnalyticsProps> = ({
  type,
  data,
  loading = false,
  onRefresh,
  onExport,
  onFilterChange,
  className,
  showMetrics = true,
  showCharts = true,
  showTrends = true,
  showComparisons = true,
  showExport = true,
  showRefresh = true,
  timeRange = 'last30days'
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(1) + '%';
  };
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };
  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'views':
        return <Eye className="w-5 h-5" />;
      case 'conversions':
        return <Target className="w-5 h-5" />;
      case 'revenue':
        return <DollarSign className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'clicks':
        return <MousePointer className="w-5 h-5" />;
      case 'time':
        return <Clock className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };
  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'views':
        return 'text-blue-600 bg-blue-100';
      case 'conversions':
        return 'text-green-600 bg-green-100';
      case 'revenue':
        return 'text-purple-600 bg-purple-100';
      case 'users':
        return 'text-orange-600 bg-orange-100';
      case 'clicks':
        return 'text-pink-600 bg-pink-100';
      case 'time':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  const getMetrics = () => {
    switch (type) {
      case 'products':
        return [
          { key: 'total_products', label: 'Total Products', value: data?.totalProducts || 0, trend: 'up' as const, change: 12 },
          { key: 'active_products', label: 'Active Products', value: data?.activeProducts || 0, trend: 'up' as const, change: 8 },
          { key: 'total_revenue', label: 'Total Revenue', value: data?.totalRevenue || 0, trend: 'up' as const, change: 15, format: 'currency' },
          { key: 'avg_price', label: 'Average Price', value: data?.avgPrice || 0, trend: 'stable' as const, change: 2, format: 'currency' }
        ];
      case 'landing-pages':
        return [
          { key: 'total_pages', label: 'Total Pages', value: data?.totalPages || 0, trend: 'up' as const, change: 5 },
          { key: 'published_pages', label: 'Published Pages', value: data?.publishedPages || 0, trend: 'up' as const, change: 3 },
          { key: 'total_views', label: 'Total Views', value: data?.totalViews || 0, trend: 'up' as const, change: 25 },
          { key: 'conversion_rate', label: 'Avg Conversion Rate', value: data?.avgConversionRate || 0, trend: 'up' as const, change: 8, format: 'percentage' }
        ];
      case 'forms':
        return [
          { key: 'total_forms', label: 'Total Forms', value: data?.totalForms || 0, trend: 'up' as const, change: 7 },
          { key: 'published_forms', label: 'Published Forms', value: data?.publishedForms || 0, trend: 'up' as const, change: 4 },
          { key: 'total_submissions', label: 'Total Submissions', value: data?.totalSubmissions || 0, trend: 'up' as const, change: 18 },
          { key: 'conversion_rate', label: 'Avg Conversion Rate', value: data?.avgConversionRate || 0, trend: 'up' as const, change: 12, format: 'percentage' }
        ];
      default:
        return [];
    }
  };
  const getChartData = () => {
    // Mock chart data - in real implementation, this would come from props
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Views',
          data: [120, 190, 300, 500, 200, 300],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: 'Conversions',
          data: [20, 30, 50, 80, 40, 60],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)'
        }
      ]
    };
  };
  const getTopPerformers = () => {
    switch (type) {
      case 'products':
        return [
          { name: 'Premium Widget', value: 1250, change: 15, trend: 'up' as const },
          { name: 'Basic Widget', value: 890, change: 8, trend: 'up' as const },
          { name: 'Deluxe Widget', value: 650, change: -3, trend: 'down' as const }
        ];
      case 'landing-pages':
        return [
          { name: 'Homepage', value: 0.12, change: 25, trend: 'up' as const, format: 'percentage' },
          { name: 'Product Page', value: 0.08, change: 15, trend: 'up' as const, format: 'percentage' },
          { name: 'About Page', value: 0.05, change: -5, trend: 'down' as const, format: 'percentage' }
        ];
      case 'forms':
        return [
          { name: 'Contact Form', value: 0.18, change: 20, trend: 'up' as const, format: 'percentage' },
          { name: 'Newsletter Signup', value: 0.15, change: 12, trend: 'up' as const, format: 'percentage' },
          { name: 'Lead Capture', value: 0.10, change: -2, trend: 'down' as const, format: 'percentage' }
        ];
      default:
        return [];
    }
  };
  const metrics = getMetrics();
  const chartData = getChartData();
  const topPerformers = getTopPerformers();
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'products' && 'Product Analytics'}
            {type === 'landing-pages' && 'Landing Page Analytics'}
            {type === 'forms' && 'Form Analytics'}
          </h2>
          <p className="text-gray-600 mt-1">
            Performance insights for the last 30 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
              Refresh
            </Button>
          )}
          {showExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>
      {/* Metrics Grid */}
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.key} className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', getMetricColor(metric.key))}>
                    {getMetricIcon(metric.key)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.format === 'currency' ? formatCurrency(metric.value) :
                       metric.format === 'percentage' ? formatPercentage(metric.value) :
                       formatNumber(metric.value)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={cn('text-sm font-medium', getTrendColor(metric.trend))}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">vs last period</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Charts */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <div className="flex items-center gap-2">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="line">Line</option>
                  <option value="bar">Bar</option>
                  <option value="area">Area</option>
                </select>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Using Chart.js or similar library</p>
              </div>
            </div>
          </Card>
          {/* Top Performers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {topPerformers.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.format === 'percentage' ? formatPercentage(item.value) :
                         item.format === 'currency' ? formatCurrency(item.value) :
                         formatNumber(item.value)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(item.trend)}
                    <span className={cn('text-sm font-medium', getTrendColor(item.trend))}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {/* Trends */}
      {showTrends && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trends & Insights</h3>
            <Badge variant="secondary">Last 30 days</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-900">Growth Trend</p>
              <p className="text-sm text-green-700">Consistent upward trajectory</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-900">User Engagement</p>
              <p className="text-sm text-blue-700">High interaction rates</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-purple-900">Conversion Rate</p>
              <p className="text-sm text-purple-700">Above industry average</p>
            </div>
          </div>
        </Card>
      )}
      {/* Comparisons */}
      {showComparisons && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Period Comparison</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">This Month</Badge>
              <Badge variant="outline">Last Month</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div key={metric.key} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getMetricIcon(metric.key)}
                  <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {metric.format === 'currency' ? formatCurrency(metric.value) :
                     metric.format === 'percentage' ? formatPercentage(metric.value) :
                     formatNumber(metric.value)}
                  </span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={cn('text-sm font-medium', getTrendColor(metric.trend))}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
