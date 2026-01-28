import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { BarChart3, TrendingUp, Activity, Filter, Download, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
const AnalyticsBlock = ({ data, isConnectable = true }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 24580,
    sessions: 12340,
    bounceRate: 34.2,
    avgSession: '2:45',
    topPages: [
      { page: '/home', views: 8420 },
      { page: '/products', views: 5230 },
      { page: '/about', views: 3120 }
    ]
  });
  const runAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAnalyticsData(prev => ({
        ...prev,
        pageViews: prev.pageViews + Math.floor(Math.random() * 1000),
        sessions: prev.sessions + Math.floor(Math.random() * 500)
      }));
      setIsProcessing(false);
    }, 2000);
  };
  return (
    <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all">
      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="data-in" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="insights-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle 
        type="source" 
        position={Position.Top} 
        id="reports-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-purple-500 rounded text-white">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Analytics Engine</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Data insights & metrics</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Badge variant="secondary" className={`text-xs ${data?.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              {data?.connected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
            <div className="text-purple-600 dark:text-purple-400 font-medium">Page Views</div>
            <div className="text-lg font-bold text-purple-800 dark:text-purple-300">{analyticsData.pageViews.toLocaleString()}</div>
          </div>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="text-blue-600 dark:text-blue-400 font-medium">Sessions</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-300">{analyticsData.sessions.toLocaleString()}</div>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <div className="text-orange-600 dark:text-orange-400 font-medium">Bounce Rate</div>
            <div className="text-lg font-bold text-orange-800 dark:text-orange-300">{analyticsData.bounceRate}%</div>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="text-green-600 dark:text-green-400 font-medium">Avg Session</div>
            <div className="text-lg font-bold text-green-800 dark:text-green-300">{analyticsData.avgSession}</div>
          </div>
        </div>
        {/* Top Pages */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Top Pages</div>
          {analyticsData.topPages.map((page, index) => (
            <div key={index} className="flex justify-between items-center p-1 bg-gray-50 dark:bg-gray-700 rounded text-xs">
              <span className="text-gray-700 dark:text-gray-300 truncate">{page.page}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{page.views.toLocaleString()}</span>
            </div>
          ))}
        </div>
        {/* Actions */}
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={runAnalysis}
            disabled={isProcessing}
            className="flex-1 text-xs"
          >
            {isProcessing ? (
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Activity className="w-3 h-3 mr-1" />
            )}
            {isProcessing ? 'Processing...' : 'Analyze'}
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Download className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Filter className="w-3 h-3" />
          </Button>
        </div>
      </div>
      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
export default AnalyticsBlock;
