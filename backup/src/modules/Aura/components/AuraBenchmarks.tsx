import React from 'react';
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge"
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useAuraBenchmarks } from '../hooks/useAuraAdvanced';

export const AuraBenchmarks: React.FC = () => {
  const { benchmarks, loading, error } = useAuraBenchmarks();

  if (loading) return <div>Loading benchmarks...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'text-green-600';
    if (percentile >= 75) return 'text-blue-600';
    if (percentile >= 50) return 'text-yellow-600';
    if (percentile >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPercentileIcon = (percentile: number) => {
    if (percentile >= 90) return <Award className="w-4 h-4 text-green-600" />;
    if (percentile >= 75) return <CheckCircle className="w-4 h-4 text-blue-600" />;
    if (percentile >= 50) return <Target className="w-4 h-4 text-yellow-600" />;
    if (percentile >= 25) return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('excellent') || recommendation.toLowerCase().includes('great')) {
      return 'text-green-600';
    }
    if (recommendation.toLowerCase().includes('good') || recommendation.toLowerCase().includes('improve')) {
      return 'text-blue-600';
    }
    if (recommendation.toLowerCase().includes('poor') || recommendation.toLowerCase().includes('critical')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'response_time': return <Target className="w-4 h-4" />;
      case 'engagement_rate': return <BarChart3 className="w-4 h-4" />;
      case 'conversion_rate': return <PieChart className="w-4 h-4" />;
      case 'satisfaction_score': return <Award className="w-4 h-4" />;
      case 'error_rate': return <AlertTriangle className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'response_time': return 'Response Time';
      case 'engagement_rate': return 'Engagement Rate';
      case 'conversion_rate': return 'Conversion Rate';
      case 'satisfaction_score': return 'Satisfaction Score';
      case 'error_rate': return 'Error Rate';
      case 'message_count': return 'Message Count';
      case 'user_retention': return 'User Retention';
      case 'cost_per_acquisition': return 'Cost Per Acquisition';
      default: return metric;
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'response_time': return 'seconds';
      case 'engagement_rate': return '%';
      case 'conversion_rate': return '%';
      case 'satisfaction_score': return '/5';
      case 'error_rate': return '%';
      case 'message_count': return 'messages';
      case 'user_retention': return '%';
      case 'cost_per_acquisition': return '$';
      default: return '';
    }
  };

  const formatMetricValue = (metric: string, value: number) => {
    const unit = getMetricUnit(metric);
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === '/5') return `${value.toFixed(1)}/5`;
    if (unit === '$') return `$${value.toFixed(2)}`;
    if (unit === 'seconds') return `${value.toFixed(1)}s`;
    return formatNumber(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Industry Benchmarks</h2>
        <Badge variant="outline" className="text-sm">
          Compared to industry standards
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {benchmarks?.map((benchmark) => (
              <Card key={benchmark.metric}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getMetricIcon(benchmark.metric)}
                      <Card.Title className="text-lg">
                        {getMetricLabel(benchmark.metric)}
                      </Card.Title>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPercentileIcon(benchmark.percentile)}
                      <Badge variant="outline" className={getPercentileColor(benchmark.percentile)}>
                        {benchmark.percentile}th percentile
                      </Badge>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Your Value</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.yourValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Industry Average</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.industryAverage)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Performance</div>
                        <div className="text-2xl font-bold">
                          {benchmark.yourValue > benchmark.industryAverage ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="w-5 h-5" />
                              {((benchmark.yourValue / benchmark.industryAverage - 1) * 100).toFixed(1)}%
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <TrendingDown className="w-5 h-5" />
                              {((1 - benchmark.yourValue / benchmark.industryAverage) * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Performance vs Industry</div>
                      <Progress 
                        value={benchmark.percentile} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0th percentile</span>
                        <span>50th percentile</span>
                        <span>100th percentile</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Recommendation</div>
                      <div className={`text-sm ${getRecommendationColor(benchmark.recommendation)}`}>
                        {benchmark.recommendation}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4">
            {benchmarks?.filter(b => 
              b.metric.toLowerCase().includes('response') || 
              b.metric.toLowerCase().includes('error') ||
              b.metric.toLowerCase().includes('satisfaction')
            ).map((benchmark) => (
              <Card key={benchmark.metric}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getMetricIcon(benchmark.metric)}
                      <Card.Title className="text-lg">
                        {getMetricLabel(benchmark.metric)}
                      </Card.Title>
                    </div>
                    <Badge variant="outline" className={getPercentileColor(benchmark.percentile)}>
                      {benchmark.percentile}th percentile
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Your Value</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.yourValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Industry Average</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.industryAverage)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Performance vs Industry</div>
                      <Progress 
                        value={benchmark.percentile} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Recommendation</div>
                      <div className={`text-sm ${getRecommendationColor(benchmark.recommendation)}`}>
                        {benchmark.recommendation}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4">
            {benchmarks?.filter(b => 
              b.metric.toLowerCase().includes('engagement') || 
              b.metric.toLowerCase().includes('retention') ||
              b.metric.toLowerCase().includes('message')
            ).map((benchmark) => (
              <Card key={benchmark.metric}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getMetricIcon(benchmark.metric)}
                      <Card.Title className="text-lg">
                        {getMetricLabel(benchmark.metric)}
                      </Card.Title>
                    </div>
                    <Badge variant="outline" className={getPercentileColor(benchmark.percentile)}>
                      {benchmark.percentile}th percentile
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Your Value</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.yourValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Industry Average</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.industryAverage)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Performance vs Industry</div>
                      <Progress 
                        value={benchmark.percentile} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Recommendation</div>
                      <div className={`text-sm ${getRecommendationColor(benchmark.recommendation)}`}>
                        {benchmark.recommendation}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid gap-4">
            {benchmarks?.filter(b => 
              b.metric.toLowerCase().includes('conversion') || 
              b.metric.toLowerCase().includes('acquisition') ||
              b.metric.toLowerCase().includes('cost')
            ).map((benchmark) => (
              <Card key={benchmark.metric}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getMetricIcon(benchmark.metric)}
                      <Card.Title className="text-lg">
                        {getMetricLabel(benchmark.metric)}
                      </Card.Title>
                    </div>
                    <Badge variant="outline" className={getPercentileColor(benchmark.percentile)}>
                      {benchmark.percentile}th percentile
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Your Value</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.yourValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Industry Average</div>
                        <div className="text-2xl font-bold">
                          {formatMetricValue(benchmark.metric, benchmark.industryAverage)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Performance vs Industry</div>
                      <Progress 
                        value={benchmark.percentile} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Recommendation</div>
                      <div className={`text-sm ${getRecommendationColor(benchmark.recommendation)}`}>
                        {benchmark.recommendation}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
