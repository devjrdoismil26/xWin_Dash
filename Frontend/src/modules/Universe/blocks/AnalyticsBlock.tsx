import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { BarChart3, TrendingUp, Activity, Filter, Download, RefreshCw } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
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

    }, 2000);};

  return (
            <div className="{/* Handles */}">$2</div>
      <Handle 
        type="target" 
        position={ Position.Left }
        id="data-in" 
        isConnectable={ isConnectable }
        className="w-3 h-3 bg-purple-500"
      / />
      <Handle 
        type="source" 
        position={ Position.Right }
        id="insights-out" 
        isConnectable={ isConnectable }
        className="w-3 h-3 bg-green-500"
      / />
      <Handle 
        type="source" 
        position={ Position.Top }
        id="reports-out" 
        isConnectable={ isConnectable }
        className="w-3 h-3 bg-blue-500"
     >
          {/* Header */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="w-4 h-4" /></div><div>
           
        </div><h3 className="font-semibold text-gray-800 dark:text-white">Analytics Engine</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Data insights & metrics</p></div><div className=" ">$2</div><Badge variant="secondary" className={`text-xs ${data?.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100'} `} />
              {data?.connected ? 'Connected' : 'Offline'}
            </Badge></div></div>
      {/* Content */}
      <div className="{/* Quick Stats */}">$2</div>
        <div className=" ">$2</div><div className=" ">$2</div><div className="text-purple-600 dark:text-purple-400 font-medium">Page Views</div>
            <div className="text-lg font-bold text-purple-800 dark:text-purple-300">{analyticsData.pageViews.toLocaleString()}</div>
          <div className=" ">$2</div><div className="text-blue-600 dark:text-blue-400 font-medium">Sessions</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-300">{analyticsData.sessions.toLocaleString()}</div>
          <div className=" ">$2</div><div className="text-orange-600 dark:text-orange-400 font-medium">Bounce Rate</div>
            <div className="text-lg font-bold text-orange-800 dark:text-orange-300">{analyticsData.bounceRate}%</div>
          <div className=" ">$2</div><div className="text-green-600 dark:text-green-400 font-medium">Avg Session</div>
            <div className="text-lg font-bold text-green-800 dark:text-green-300">{analyticsData.avgSession}</div>
        </div>
        {/* Top Pages */}
        <div className=" ">$2</div><div className="text-xs font-medium text-gray-600 dark:text-gray-400">Top Pages</div>
          {(analyticsData.topPages || []).map((page: unknown, index: unknown) => (
            <div key={index} className="flex justify-between items-center p-1 bg-gray-50 dark:bg-gray-700 rounded text-xs">
           
        </div><span className="text-gray-700 dark:text-gray-300 truncate">{page.page}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{page.views.toLocaleString()}</span>
      </div>
    </>
  ))}
        </div>
        {/* Actions */}
        <div className=" ">$2</div><Button 
            size="sm" 
            variant="outline" 
            onClick={ runAnalysis }
            disabled={ isProcessing }
            className="flex-1 text-xs" />
            {isProcessing ? (
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Activity className="w-3 h-3 mr-1" />
            )}
            {isProcessing ? 'Processing...' : 'Analyze'}
          </Button>
          <Button size="sm" variant="outline" className="text-xs" />
            <Download className="w-3 h-3" /></Button><Button size="sm" variant="outline" className="text-xs" />
            <Filter className="w-3 h-3" /></Button></div>
      {/* Processing Indicator */}
      {isProcessing && (
        <div className=" ">$2</div><div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse">
          )}
        </div>
    </div>);};

export default AnalyticsBlock;
