import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  MessageCircle, 
  Users, 
  Send, 
  Settings, 
  Play, 
  Pause, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Activity,
  TrendingUp
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import BaseBlock from '../../components/Base/BaseBlock';
import { BaseBlockProps } from '../../types/blocks';
interface AuraBlockData {
  id?: string;
  label: string;
  description?: string;
  connection: {
    name: string;
    status: 'connected' | 'disconnected' | 'error';
    type: 'whatsapp' | 'telegram' | 'discord' | 'slack';
    lastActivity: string;
  };
  metrics: {
    totalMessages: number;
    activeChats: number;
    responseTime: number;
    satisfaction: number;
  };
  automation: {
    enabled: boolean;
    rules: number;
    responses: number;
  };
}
interface AuraBlockProps extends BaseBlockProps {
  data: AuraBlockData;
}
const AuraBlock: React.FC<AuraBlockProps> = ({ 
  data, 
  isConnectable = true,
  isSelected = false,
  onUpdate,
  onDelete,
  onConfigure
}) => {
  const [connection, setConnection] = useState(data.connection);
  const [metrics, setMetrics] = useState(data.metrics);
  const [automation, setAutomation] = useState(data.automation);
  const [isActive, setIsActive] = useState(connection.status === 'connected');
  // Simulate real-time metrics updates
  useEffect(() => {
    if (isActive && connection.status === 'connected') {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          totalMessages: prev.totalMessages + Math.floor(Math.random() * 3),
          activeChats: Math.max(0, prev.activeChats + Math.floor(Math.random() * 2 - 1)),
          responseTime: Math.max(0, prev.responseTime + (Math.random() * 0.5 - 0.25)),
          satisfaction: Math.min(100, Math.max(0, prev.satisfaction + (Math.random() * 2 - 1))),
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive, connection.status]);
  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return '💬';
      case 'telegram': return '✈️';
      case 'discord': return '🎮';
      case 'slack': return '💼';
      default: return '💬';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'disconnected': return <AlertCircle className="w-3 h-3 text-gray-500" />;
      case 'error': return <AlertCircle className="w-3 h-3 text-red-500" />;
      default: return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-700';
      case 'disconnected': return 'bg-gray-100 text-gray-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  const handleConnect = () => {
    setConnection(prev => ({ ...prev, status: 'connected' }));
    setIsActive(true);
  };
  const handleDisconnect = () => {
    setConnection(prev => ({ ...prev, status: 'disconnected' }));
    setIsActive(false);
  };
  const handleToggleAutomation = () => {
    setAutomation(prev => ({ ...prev, enabled: !prev.enabled }));
  };
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    return `${(seconds / 60).toFixed(1)}m`;
  };
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  return (
    <BaseBlock
      id={data.id || 'aura'}
      type="aura"
      data={data}
      isConnectable={isConnectable}
      isSelected={isSelected}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onConfigure={onConfigure}
    >
      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="message-in" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="response-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="analytics-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      {/* Header Icon */}
      <div className="absolute top-3 left-3 p-1 bg-green-500 rounded text-white">
        <MessageCircle className="w-4 h-4" />
      </div>
      {/* Connection Info */}
      <div className="mt-8 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getConnectionIcon(connection.type)}</span>
            <h4 className="font-medium text-sm text-gray-800">
              {connection.name}
            </h4>
          </div>
          <Badge className={`text-xs ${getStatusColor(connection.status)}`}>
            {getStatusIcon(connection.status)}
            <span className="ml-1 capitalize">{connection.status}</span>
          </Badge>
        </div>
        <p className="text-xs text-gray-600">
          Last activity: {new Date(connection.lastActivity).toLocaleTimeString()}
        </p>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Messages</span>
          </div>
          <p className="text-sm font-bold text-blue-800">
            {formatNumber(metrics.totalMessages)}
          </p>
        </div>
        <div className="p-2 bg-green-50 rounded-lg">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Active Chats</span>
          </div>
          <p className="text-sm font-bold text-green-800">
            {formatNumber(metrics.activeChats)}
          </p>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Response Time</span>
          </div>
          <p className="text-sm font-bold text-purple-800">
            {formatTime(metrics.responseTime)}
          </p>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Satisfaction</span>
          </div>
          <p className="text-sm font-bold text-orange-800">
            {formatPercentage(metrics.satisfaction)}
          </p>
        </div>
      </div>
      {/* Automation Status */}
      <div className="mb-3 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-600" />
            <span className="text-xs font-medium text-gray-700">Automation</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`text-xs ${automation.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
            >
              {automation.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleToggleAutomation}
              className="p-1"
            >
              {automation.enabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
          </div>
        </div>
        {automation.enabled && (
          <div className="mt-1 text-xs text-gray-600">
            {automation.rules} rules • {automation.responses} responses
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex gap-1">
        {connection.status === 'disconnected' && (
          <Button 
            size="sm" 
            onClick={handleConnect}
            className="flex-1 text-xs"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Connect
          </Button>
        )}
        {connection.status === 'connected' && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDisconnect}
            className="flex-1 text-xs"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Disconnect
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={onConfigure}
          className="text-xs"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>
      {/* Activity indicator */}
      {isActive && connection.status === 'connected' && (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </BaseBlock>
  );
};
export default AuraBlock;
