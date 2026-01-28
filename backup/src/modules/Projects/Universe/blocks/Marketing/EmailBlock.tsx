import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Mail, 
  Users, 
  Send, 
  BarChart3, 
  Settings, 
  Play, 
  Pause, 
  Eye,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import BaseBlock from '../../components/Base/BaseBlock';
import { BaseBlockProps } from '../../types/blocks';
interface EmailBlockData {
  id?: string;
  label: string;
  description?: string;
  campaign: {
    name: string;
    subject: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
    recipients: number;
    sent: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    scheduledAt?: string;
  };
  metrics: {
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;
  };
}
interface EmailBlockProps extends BaseBlockProps {
  data: EmailBlockData;
}
const EmailBlock: React.FC<EmailBlockProps> = ({ 
  data, 
  isConnectable = true,
  isSelected = false,
  onUpdate,
  onDelete,
  onConfigure
}) => {
  const [campaign, setCampaign] = useState(data.campaign);
  const [metrics, setMetrics] = useState(data.metrics);
  const [isSending, setIsSending] = useState(false);
  // Simulate real-time metrics updates
  useEffect(() => {
    if (campaign.status === 'sending') {
      const interval = setInterval(() => {
        setCampaign(prev => {
          if (prev.sent < prev.recipients) {
            const newSent = Math.min(prev.sent + Math.floor(Math.random() * 5), prev.recipients);
            const newOpened = Math.floor(newSent * (metrics.openRate / 100));
            const newClicked = Math.floor(newOpened * (metrics.clickRate / 100));
            return {
              ...prev,
              sent: newSent,
              opened: newOpened,
              clicked: newClicked,
            };
          } else {
            setIsSending(false);
            return { ...prev, status: 'sent' as const };
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [campaign.status, campaign.recipients, campaign.sent, metrics.openRate, metrics.clickRate]);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-3 h-3 text-gray-500" />;
      case 'scheduled': return <Clock className="w-3 h-3 text-blue-500" />;
      case 'sending': return <Send className="w-3 h-3 text-yellow-500 animate-pulse" />;
      case 'sent': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'paused': return <Pause className="w-3 h-3 text-orange-500" />;
      default: return <Mail className="w-3 h-3 text-gray-500" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'sending': return 'bg-yellow-100 text-yellow-700';
      case 'sent': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  const handleSend = () => {
    setIsSending(true);
    setCampaign(prev => ({ ...prev, status: 'sending' }));
  };
  const handlePause = () => {
    setIsSending(false);
    setCampaign(prev => ({ ...prev, status: 'paused' }));
  };
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  return (
    <BaseBlock
      id={data.id || 'email-marketing'}
      type="emailMarketing"
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
        id="audience-in" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="analytics-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="leads-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
      {/* Header Icon */}
      <div className="absolute top-3 left-3 p-1 bg-red-500 rounded text-white">
        <Mail className="w-4 h-4" />
      </div>
      {/* Campaign Info */}
      <div className="mt-8 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm text-gray-800 truncate">
            {campaign.name}
          </h4>
          <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
            {getStatusIcon(campaign.status)}
            <span className="ml-1 capitalize">{campaign.status}</span>
          </Badge>
        </div>
        <p className="text-xs text-gray-600 truncate">
          {campaign.subject}
        </p>
      </div>
      {/* Progress Bar for Sending */}
      {campaign.status === 'sending' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">Sending...</span>
            <span className="text-gray-700">
              {formatNumber(campaign.sent)} / {formatNumber(campaign.recipients)}
            </span>
          </div>
          <Progress 
            value={(campaign.sent / campaign.recipients) * 100} 
            className="h-2" 
          />
        </div>
      )}
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Recipients</span>
          </div>
          <p className="text-sm font-bold text-blue-800">
            {formatNumber(campaign.recipients)}
          </p>
        </div>
        <div className="p-2 bg-green-50 rounded-lg">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Opened</span>
          </div>
          <p className="text-sm font-bold text-green-800">
            {formatNumber(campaign.opened)}
          </p>
          <p className="text-xs text-green-600">
            {formatPercentage(metrics.openRate)}
          </p>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Clicked</span>
          </div>
          <p className="text-sm font-bold text-purple-800">
            {formatNumber(campaign.clicked)}
          </p>
          <p className="text-xs text-purple-600">
            {formatPercentage(metrics.clickRate)}
          </p>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Sent</span>
          </div>
          <p className="text-sm font-bold text-orange-800">
            {formatNumber(campaign.sent)}
          </p>
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-1">
        {campaign.status === 'draft' && (
          <Button 
            size="sm" 
            onClick={handleSend}
            className="flex-1 text-xs"
          >
            <Send className="w-3 h-3 mr-1" />
            Send
          </Button>
        )}
        {campaign.status === 'sending' && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={handlePause}
            className="flex-1 text-xs"
          >
            <Pause className="w-3 h-3 mr-1" />
            Pause
          </Button>
        )}
        {campaign.status === 'paused' && (
          <Button 
            size="sm" 
            onClick={handleSend}
            className="flex-1 text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            Resume
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
      {/* Scheduled indicator */}
      {campaign.scheduledAt && campaign.status === 'scheduled' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Scheduled for {new Date(campaign.scheduledAt).toLocaleString()}
        </div>
      )}
    </BaseBlock>
  );
};
export default EmailBlock;
