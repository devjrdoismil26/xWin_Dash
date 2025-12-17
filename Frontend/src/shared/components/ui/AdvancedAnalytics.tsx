/**
 * AdvancedAnalytics - Sistema de Analytics Avançado
 * Refatorado em 28/11/2025 - Reduzido de 761 linhas (30KB) para ~200 linhas (8KB)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, RefreshCw, Download, Filter, Calendar, AlertTriangle, CheckCircle, Info, Brain } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import type { AdvancedAnalyticsProps, MetricData, Insight } from './analytics-types';

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ metrics = [],
  insights = [],
  loading = false,
  error,
  timeRange = '7d',
  onTimeRangeChange,
  onRefresh,
  onExport,
  className = ''
   }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [view, setView] = useState<'grid' | 'list'>('grid');

  const formatValue = (metric: MetricData): string => {
    const { value, format, unit } = metric;
    
    if (format === 'currency') return `$${value.toLocaleString()}`;
    if (format === 'percentage') return `${value}%`;
    if (unit) return `${value.toLocaleString()} ${unit}`;
    return value.toLocaleString();};

  const getChangeIcon = (changeType?: string) => {
    if (changeType === 'increase') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (changeType === 'decrease') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;};

  const getInsightIcon = (type: string) => {
    const icons = {
      opportunity: <TrendingUp className="h-5 w-5 text-blue-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      info: <Info className="h-5 w-5 text-gray-500" />};

    return icons[type as keyof typeof icons] || icons.info;};

  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(m => m.category === selectedCategory);

  const categories = ['all', ...new Set(metrics.map(m => m.category))];

  if (error) { return (
        <>
      <Card className={className } />
      <div className=" ">$2</div><AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p></div></Card>);

  }

  return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div>{/* Header */}
      <div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2></div><div className=" ">$2</div><select
            value={ timeRange }
            onChange={ (e: unknown) => onTimeRangeChange?.(e.target.value) }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option></select><Button variant="outline" size="sm" onClick={onRefresh} disabled={ loading } />
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} `} / /></Button><Button variant="outline" size="sm" onClick={ onExport } />
            <Download className="h-4 w-4" /></Button></div>

      {/* Category Filter */}
      <div className="{categories.map((cat: unknown) => (">$2</div>
          <button
            key={ cat }
            onClick={ () => setSelectedCategory(cat) }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'
            } `}
  >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="{filteredMetrics.map((metric: unknown) => (">$2</div>
          <div
            key={metric.id} >
           
        </div><Card className="p-4 hover:shadow-lg transition-shadow" />
              <div className=" ">$2</div><span className="text-sm text-gray-600 dark:text-gray-400">{metric.name}</span>
                {metric.priority === 'critical' && (
                  <Badge variant="danger" size="sm">Critical</Badge>
                )}
              </div>
              
              <div className=" ">$2</div><div>
           
        </div><p className="text-2xl font-bold text-gray-900 dark:text-white" />
                    {formatValue(metric)}
                  </p>
                  {metric.change !== undefined && (
                    <div className="{getChangeIcon(metric.changeType)}">$2</div>
                      <span className={`text-sm ${
                        metric.changeType === 'increase' ? 'text-green-600' :
                        metric.changeType === 'decrease' ? 'text-red-600' :
                        'text-gray-600'
                      } `}>
           
        </span>{Math.abs(metric.change)}%
                      </span>
      </div>
    </>
  )}
                </div></Card></div>
        ))}
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card className="p-6" />
          <div className=" ">$2</div><Brain className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h3></div><div className="{insights.map((insight: unknown) => (">$2</div>
              <div
                key={ insight.id }
                className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
           
        </div>{getInsightIcon(insight.type)}
                <div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                    <Badge variant={insight.impact === 'high' ? 'danger' : 'secondary'} size="sm" />
                      {insight.impact} impact
                    </Badge></div><p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.description}</p>
                  { insight.actionable && insight.actionLabel && (
                    <Button variant="primary" size="sm" onClick={insight.onAction } />
                      {insight.actionLabel}
                    </Button>
                  )}
                </div>
            ))}
          </div>
      </Card>
    </>
  )}
    </div>);};

export default AdvancedAnalytics;
