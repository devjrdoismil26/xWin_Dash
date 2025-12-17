import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Clock, CheckCircle, XCircle, AlertCircle, Zap, Users, Calendar, Target, Play, Pause, Square } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import { useWorkflows } from '../hooks/useWorkflows';
const WorkflowMetrics = ({ workflowId, timeRange = '7d' }) => {
  const {
    workflowMetrics,
    generalMetrics,
    systemPerformanceMetrics,
    loading,
    error,
    fetchWorkflowMetrics,
    fetchGeneralMetrics,
    fetchSystemPerformanceMetrics
  } = useWorkflows();

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    const params = { time_range: selectedTimeRange};

    if (workflowId) {
      fetchWorkflowMetrics(workflowId, params);

    } else {
      fetchGeneralMetrics(params);

    }
    fetchSystemPerformanceMetrics(params);

  }, [workflowId, selectedTimeRange]);

  const formatNumber = (num: unknown) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';};

  const formatDuration = (seconds: unknown) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;};

  const getTrendIcon = (trend: unknown) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;};

  const getTrendColor = (trend: unknown) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';};

  const metrics = workflowId ? workflowMetrics : generalMetrics;
  if (loading && !metrics) { return (
              <div className=" ">$2</div><div className="{[...Array(4)].map((_: unknown, i: unknown) => (">$2</div>
            <Card key={i } />
              <Card.Content className="p-4" />
                <div className=" ">$2</div><div className=" ">$2</div><div className="h-8 bg-gray-200 rounded w-1/2">
           
        </div></Card.Content>
      </Card>
    </>
  ))}
        </div>);

  }
  return (
            <div className="{/* Time Range Selector */}">$2</div>
      <div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900" />
          {workflowId ? 'Workflow Metrics' : 'General Metrics'}
        </h2>
        <select
          value={ selectedTimeRange }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedTimeRange(e.target.value) }
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option></select></div>
      {/* Key Metrics Cards */}
      <div className=" ">$2</div><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900" />
                  {formatNumber(metrics?.total_executions || 0)}
                </p>
                <div className="{getTrendIcon(metrics?.executions_trend || 0)}">$2</div>
                  <span className={`text-sm ${getTrendColor(metrics?.executions_trend || 0)} `}>
           
        </span>{Math.abs(metrics?.executions_trend || 0)}%
                  </span></div><Play className="h-8 w-8 text-blue-600" /></div></Card.Content></Card><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600" />
                  {Math.round(metrics?.success_rate || 0)}%
                </p>
                <div className="{getTrendIcon(metrics?.success_rate_trend || 0)}">$2</div>
                  <span className={`text-sm ${getTrendColor(metrics?.success_rate_trend || 0)} `}>
           
        </span>{Math.abs(metrics?.success_rate_trend || 0)}%
                  </span></div><CheckCircle className="h-8 w-8 text-green-600" /></div></Card.Content></Card><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900" />
                  {formatDuration(metrics?.avg_duration || 0)}
                </p>
                <div className="{getTrendIcon(metrics?.duration_trend || 0)}">$2</div>
                  <span className={`text-sm ${getTrendColor(metrics?.duration_trend || 0)} `}>
           
        </span>{Math.abs(metrics?.duration_trend || 0)}%
                  </span></div><Clock className="h-8 w-8 text-purple-600" /></div></Card.Content></Card><Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Failed Executions</p>
                <p className="text-2xl font-bold text-red-600" />
                  {formatNumber(metrics?.failed_executions || 0)}
                </p>
                <div className="{getTrendIcon(metrics?.failures_trend || 0)}">$2</div>
                  <span className={`text-sm ${getTrendColor(metrics?.failures_trend || 0)} `}>
           
        </span>{Math.abs(metrics?.failures_trend || 0)}%
                  </span></div><XCircle className="h-8 w-8 text-red-600" /></div></Card.Content></Card></div>
      {/* Detailed Metrics */}
      <div className="{/* Execution Status Distribution */}">$2</div>
        <Card />
          <Card.Header />
            <Card.Title>Execution Status</Card.Title>
          </Card.Header>
          <Card.Content />
            <div className="{metrics?.status_distribution?.map((status: unknown) => (">$2</div>
                <div key={status.status} className="flex items-center justify-between">
           
        </div><div className=" ">$2</div><div className={`w-3 h-3 rounded-full ${
                      status.status === 'completed' ? 'bg-green-500' :
                      status.status === 'failed' ? 'bg-red-500' :
                      status.status === 'running' ? 'bg-blue-500' :
                      status.status === 'pending' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    } `} />
           
        </div><span className="text-sm font-medium capitalize">{status.status}</span></div><div className=" ">$2</div><span className="text-sm text-gray-600">{status.count}</span>
                    <div className=" ">$2</div><div
                        className={`h-2 rounded-full ${
                          status.status === 'completed' ? 'bg-green-500' :
                          status.status === 'failed' ? 'bg-red-500' :
                          status.status === 'running' ? 'bg-blue-500' :
                          status.status === 'pending' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        } `}
                        style={width: `${(status.count / metrics?.total_executions) * 100} %` } / />
           
        </div></div>
              ))}
            </div>
          </Card.Content>
        </Card>
        {/* Performance Metrics */}
        <Card />
          <Card.Header />
            <Card.Title>Performance Metrics</Card.Title>
          </Card.Header>
          <Card.Content />
            <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm font-medium">Min Duration</span>
                <span className="{formatDuration(metrics?.min_duration || 0)}">$2</span>
                </span></div><div className=" ">$2</div><span className="text-sm font-medium">Max Duration</span>
                <span className="{formatDuration(metrics?.max_duration || 0)}">$2</span>
                </span></div><div className=" ">$2</div><span className="text-sm font-medium">P95 Duration</span>
                <span className="{formatDuration(metrics?.p95_duration || 0)}">$2</span>
                </span></div><div className=" ">$2</div><span className="text-sm font-medium">Throughput</span>
                <span className="{formatNumber(metrics?.throughput || 0)}/hour">$2</span>
                </span></div></Card.Content></Card></div>
      {/* System Performance */}
      {systemPerformanceMetrics && (
        <Card />
          <Card.Header />
            <Card.Title>System Performance</Card.Title>
          </Card.Header>
          <Card.Content />
            <div className=" ">$2</div><div className=" ">$2</div><div className="{formatNumber(systemPerformanceMetrics?.active_workflows || 0)}">$2</div>
                </div>
                <div className="text-sm text-gray-600">Active Workflows</div>
              <div className=" ">$2</div><div className="{formatNumber(systemPerformanceMetrics?.queue_size || 0)}">$2</div>
                </div>
                <div className="text-sm text-gray-600">Queue Size</div>
              <div className=" ">$2</div><div className="{Math.round(systemPerformanceMetrics?.cpu_usage || 0)}%">$2</div>
                </div>
                <div className="text-sm text-gray-600">CPU Usage</div></div></Card.Content>
      </Card>
    </>
  )}
      {/* Error Display */}
      {error && (
        <Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><AlertCircle size={16} / />
              <span>{error}</span></div></Card.Content>
      </Card>
    </>
  )}
    </div>);};

export default WorkflowMetrics;
