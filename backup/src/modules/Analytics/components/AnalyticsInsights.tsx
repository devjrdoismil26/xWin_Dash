/**
 * Componente de insights inteligentes para Analytics
 * Análise de tendências, anomalias e recomendações baseadas em IA
 */
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Zap,
  Brain,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Filter,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsInsight } from '../types';

interface AnalyticsInsightsProps {
  insights?: AnalyticsInsight[];
  loading?: boolean;
  onInsightClick?: (insight: AnalyticsInsight) => void;
  onGenerateInsights?: () => void;
  className?: string;
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({
  insights = [],
  loading = false,
  onInsightClick,
  onGenerateInsights,
  className
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  // Mock data para demonstração
  const mockInsights: AnalyticsInsight[] = useMemo(() => [
    {
      id: '1',
      type: 'trend',
      title: 'Mobile Traffic Surge',
      description: 'Mobile traffic has increased by 35% over the last 7 days, indicating a shift in user behavior.',
      impact: 'high',
      confidence: 92,
      data: {
        current: 65,
        previous: 48,
        change: 35.4
      },
      recommendations: [
        'Optimize mobile page load speed',
        'Review mobile user experience',
        'Consider mobile-first design updates'
      ],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Unusual Bounce Rate Pattern',
      description: 'Bounce rate dropped significantly on Tuesday, which is unusual for this time period.',
      impact: 'medium',
      confidence: 78,
      data: {
        current: 28.5,
        previous: 42.3,
        change: -32.6
      },
      recommendations: [
        'Investigate Tuesday traffic sources',
        'Analyze content performance',
        'Check for external factors'
      ],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Conversion Rate Optimization',
      description: 'Landing page conversion rate is 15% below industry average. Significant improvement potential.',
      impact: 'high',
      confidence: 85,
      data: {
        current: 2.1,
        average: 2.5,
        potential: 3.2
      },
      recommendations: [
        'A/B test landing page headlines',
        'Optimize call-to-action buttons',
        'Reduce form fields',
        'Add social proof elements'
      ],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Traffic Source Dependency',
      description: '75% of traffic comes from a single source, creating vulnerability.',
      impact: 'high',
      confidence: 88,
      data: {
        primary_source: 'Google',
        percentage: 75,
        risk_level: 'high'
      },
      recommendations: [
        'Diversify traffic sources',
        'Invest in social media marketing',
        'Develop content marketing strategy',
        'Build email marketing campaigns'
      ],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      type: 'success',
      title: 'Page Load Speed Improvement',
      description: 'Average page load time improved by 40% after recent optimizations.',
      impact: 'medium',
      confidence: 95,
      data: {
        current: 1.2,
        previous: 2.0,
        improvement: 40
      },
      recommendations: [
        'Continue optimization efforts',
        'Monitor Core Web Vitals',
        'Apply similar optimizations to other pages'
      ],
      created_at: '2024-01-01T00:00:00Z'
    }
  ], []);

  const data = insights.length > 0 ? insights : mockInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'opportunity': return Target;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-100';
      case 'anomaly': return 'text-orange-600 bg-orange-100';
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-red-600 bg-red-100';
      case 'success': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredInsights = data.filter(insight => {
    const typeMatch = selectedType === 'all' || insight.type === selectedType;
    const impactMatch = selectedImpact === 'all' || insight.impact === selectedImpact;
    return typeMatch && impactMatch;
  });

  const insightsByType = useMemo(() => {
    return data.reduce((acc, insight) => {
      acc[insight.type] = (acc[insight.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  const insightsByImpact = useMemo(() => {
    return data.reduce((acc, insight) => {
      acc[insight.impact] = (acc[insight.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Generating insights...</span>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
            <Badge variant="outline" className="text-xs">
              {data.length} insights
            </Badge>
          </Card.Title>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateInsights}
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="trend">Trends</option>
              <option value="anomaly">Anomalies</option>
              <option value="opportunity">Opportunities</option>
              <option value="warning">Warnings</option>
              <option value="success">Success</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Impact</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>
        </div>
      </Card.Header>
      
      <Card.Content>
        {data.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Insights Available
            </h3>
            <p className="text-gray-600 mb-4">
              Generate AI-powered insights to discover trends and opportunities.
            </p>
            <Button onClick={onGenerateInsights}>
              <Zap className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">
                  {insightsByType.trend || 0}
                </div>
                <div className="text-sm text-blue-500">Trends</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-semibold text-orange-600">
                  {insightsByType.anomaly || 0}
                </div>
                <div className="text-sm text-orange-500">Anomalies</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">
                  {insightsByType.opportunity || 0}
                </div>
                <div className="text-sm text-green-500">Opportunities</div>
              </div>
              
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-semibold text-red-600">
                  {insightsByImpact.high || 0}
                </div>
                <div className="text-sm text-red-500">High Impact</div>
              </div>
            </div>
            
            {/* Insights List */}
            <div className="space-y-4">
              {filteredInsights.map((insight) => {
                const InsightIcon = getInsightIcon(insight.type);
                
                return (
                  <div
                    key={insight.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onInsightClick?.(insight)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn("p-2 rounded-lg", getInsightColor(insight.type))}>
                          <InsightIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{insight.title}</h3>
                            <Badge className={cn("text-xs", getImpactColor(insight.impact))}>
                              {insight.impact} impact
                            </Badge>
                            <div className={cn("text-xs", getConfidenceColor(insight.confidence))}>
                              {insight.confidence}% confidence
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">
                            {insight.description}
                          </p>
                          
                          {insight.recommendations && insight.recommendations.length > 0 && (
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium text-gray-700">Recommendations:</h4>
                              <ul className="space-y-1">
                                {insight.recommendations.slice(0, 3).map((rec, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                    {rec}
                                  </li>
                                ))}
                                {insight.recommendations.length > 3 && (
                                  <li className="text-sm text-gray-500">
                                    +{insight.recommendations.length - 3} more recommendations
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInsightClick?.(insight);
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredInsights.length === 0 && (
              <div className="text-center py-8">
                <Filter className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No insights match the selected filters.</p>
              </div>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AnalyticsInsights;