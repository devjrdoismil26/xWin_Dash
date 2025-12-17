import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { BarChart3, Users, DollarSign, TrendingUp, Settings, Eye, RefreshCw, Activity, Zap } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Progress from '@/shared/components/ui/Progress';
import BaseBlock from '@/shared/components/Base/BaseBlock';
import { BaseBlockProps } from '@/types/blocks';
import { DashboardBlockData } from '@/types/blocks';
interface DashboardBlockProps extends BaseBlockProps {
  data: DashboardBlockData;
}
const DashboardBlock: React.FC<DashboardBlockProps> = ({ data, 
  isConnectable = true,
  isSelected = false,
  onUpdate,
  onDelete,
  onConfigure
   }) => {
  const [metrics, setMetrics] = useState(data.metrics);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    if (data.autoRefresh) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          users: prev.users + Math.floor(Math.random() * 10 - 5),
          revenue: prev.revenue + Math.floor(Math.random() * 100 - 50),
          conversion: Math.max(0, prev.conversion + (Math.random() * 0.2 - 0.1)),
          growth: Math.max(0, prev.growth + (Math.random() * 2 - 1)),
        }));

        setLastUpdate(new Date());

      }, (data as any).refreshInterval * 1000);

      return () => clearInterval(interval);

    } , [data.autoRefresh, (data as any).refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMetrics(prev => ({
      users: prev.users + Math.floor(Math.random() * 20),
      revenue: prev.revenue + Math.floor(Math.random() * 200),
      conversion: Math.max(0, prev.conversion + (Math.random() * 0.5 - 0.25)),
      growth: Math.max(0, prev.growth + (Math.random() * 5 - 2.5)),
    }));

    setLastUpdate(new Date());

    setIsRefreshing(false);};

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);};

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);};

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';};

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-3 h-3" />;
    if (value < 0) return <TrendingUp className="w-3 h-3 rotate-180" />;
    return <Activity className="w-3 h-3" />;};

  return (
            <BaseBlock
      id={ data.id || 'dashboard' }
      type="dashboard"
      data={ data }
      isConnectable={ isConnectable }
      isSelected={ isSelected }
      onUpdate={ onUpdate }
      onDelete={ onDelete }
      onConfigure={ onConfigure } />
      {/* Handles */}
      <Handle 
        type="target" 
        position={ Position.Left }
        id="data-in" 
        isConnectable={ isConnectable }
        className="w-3 h-3 bg-blue-500"
      / />
      <Handle 
        type="source" 
        position={ Position.Right }
        id="data-out" 
        isConnectable={ isConnectable }
        className="w-3 h-3 bg-green-500"
      / />
      <Handle 
        type="source" 
        position={ Position.Bottom }
        id="analytics-out" 
        isConnectable={ isConnectable }
        className="w-3 h-3 bg-purple-500"
     >
          {/* Header Icon */}
      <div className=" ">$2</div><BarChart3 className="w-4 h-4" />
      </div>
      {/* Metrics Grid */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Users</span></div><p className="text-lg font-bold text-blue-800" />
            {formatNumber(metrics.users)}
          </p>
          <div className="{getGrowthIcon(metrics.growth)}">$2</div>
            <span className={getGrowthColor(metrics.growth)  }>
        </span>{metrics.growth > 0 ? '+' : ''}{metrics.growth.toFixed(1)}%
            </span></div><div className=" ">$2</div><div className=" ">$2</div><DollarSign className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Revenue</span></div><p className="text-lg font-bold text-green-800" />
            {formatCurrency(metrics.revenue)}
          </p>
          <div className="{getGrowthIcon(metrics.growth)}">$2</div>
            <span className={getGrowthColor(metrics.growth)  }>
        </span>{metrics.growth > 0 ? '+' : ''}{metrics.growth.toFixed(1)}%
            </span></div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Conversion</span></div><p className="text-lg font-bold text-orange-800" />
            {metrics.conversion.toFixed(1)}%
          </p>
          <Progress value={metrics.conversion} className="h-1 mt-1" /></div><div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="w-3 h-3 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Growth</span></div><p className="text-lg font-bold text-purple-800" />
            {metrics.growth > 0 ? '+' : ''}{metrics.growth.toFixed(1)}%
          </p>
          <div className="{getGrowthIcon(metrics.growth)}">$2</div>
            <span className={getGrowthColor(metrics.growth)  }>
        </span>{metrics.growth > 0 ? 'Growing' : metrics.growth < 0 ? 'Declining' : 'Stable'}
            </span></div></div>
      {/* Status and Actions */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Badge variant="secondary" className="text-xs bg-green-100 text-green-700" />
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <span className="Updated {lastUpdate.toLocaleTimeString()}">$2</span>
            </span></div><Button 
            size="sm" 
            variant="ghost" 
            onClick={ handleRefresh }
            disabled={ isRefreshing }
            className="p-1" />
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''} `} / /></Button></div>
      {/* Auto-refresh indicator */}
      {data.autoRefresh && (
        <div className=" ">$2</div><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse">
          )}
        </div>
    </BaseBlock>);};

export default DashboardBlock;
