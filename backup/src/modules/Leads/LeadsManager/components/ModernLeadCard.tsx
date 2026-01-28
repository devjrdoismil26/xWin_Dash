// ========================================
// COMPONENTES MODERNIZADOS - LEADS
// ========================================
import React, { useState, useCallback } from 'react';
import {
  User,
  Mail,
  Phone,
  MessageCircle,
  Star,
  Tag,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Lead, LEAD_STATUSES, LEAD_ORIGINS, ACTIVITY_TYPES } from '../types';
interface ModernLeadCardProps {
  lead: Lead;
  onView?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onUpdateScore?: (lead: Lead, score: number) => void;
  onUpdateStatus?: (lead: Lead, status: string) => void;
  onRecordActivity?: (lead: Lead, activity: string) => void;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}
const ModernLeadCard: React.FC<ModernLeadCardProps> = ({
  lead,
  onView,
  onEdit,
  onDelete,
  onUpdateScore,
  onUpdateStatus,
  onRecordActivity,
  className,
  compact = false,
  showActions = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const getStatusConfig = useCallback((status: string) => {
    return LEAD_STATUSES[status as keyof typeof LEAD_STATUSES] || {
      label: status,
      color: 'gray',
      description: ''
    };
  }, []);
  const getOriginConfig = useCallback((origin: string) => {
    return LEAD_ORIGINS[origin as keyof typeof LEAD_ORIGINS] || {
      label: origin,
      icon: '❓',
      description: ''
    };
  }, []);
  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 20) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  }, []);
  const getScoreIcon = useCallback((score: number) => {
    if (score >= 80) return <TrendingUp className="w-3 h-3" />;
    if (score >= 60) return <TrendingUp className="w-3 h-3" />;
    if (score >= 40) return <Minus className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  }, []);
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR');
  }, []);
  const handleQuickAction = useCallback((action: string) => {
    onRecordActivity?.(lead, action);
    setShowQuickActions(false);
  }, [lead, onRecordActivity]);
  const statusConfig = getStatusConfig(lead.status);
  const originConfig = getOriginConfig(lead.origin);
  const scoreColor = getScoreColor(lead.score);
  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 hover:shadow-lg border-l-4",
        `border-l-${statusConfig.color}-500`,
        isHovered && "shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {lead.name}
              </h3>
              {lead.company && (
                <span className="text-sm text-gray-500 truncate">
                  • {lead.company}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-3 h-3" />
              <span className="truncate">{lead.email}</span>
            </div>
          </div>
          {showActions && (
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView?.(lead)}
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(lead)}
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                {showQuickActions && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                    <div className="py-1">
                      <button
                        onClick={() => handleQuickAction('email_sent')}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Mail className="w-3 h-3" />
                        Enviar Email
                      </button>
                      <button
                        onClick={() => handleQuickAction('call_made')}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Phone className="w-3 h-3" />
                        Registrar Ligação
                      </button>
                      <button
                        onClick={() => handleQuickAction('meeting_scheduled')}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Calendar className="w-3 h-3" />
                        Agendar Reunião
                      </button>
                      <button
                        onClick={() => handleQuickAction('follow_up')}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Zap className="w-3 h-3" />
                        Follow-up
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => onDelete?.(lead)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Contact Info */}
        {!compact && (
          <div className="space-y-2 mb-3">
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.whatsapp && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle className="w-3 h-3" />
                <span>{lead.whatsapp}</span>
              </div>
            )}
          </div>
        )}
        {/* Status and Score */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                statusConfig.color === 'blue' && 'bg-blue-100 text-blue-700',
                statusConfig.color === 'yellow' && 'bg-yellow-100 text-yellow-700',
                statusConfig.color === 'green' && 'bg-green-100 text-green-700',
                statusConfig.color === 'orange' && 'bg-orange-100 text-orange-700',
                statusConfig.color === 'purple' && 'bg-purple-100 text-purple-700',
                statusConfig.color === 'emerald' && 'bg-emerald-100 text-emerald-700',
                statusConfig.color === 'red' && 'bg-red-100 text-red-700',
                statusConfig.color === 'gray' && 'bg-gray-100 text-gray-700'
              )}
            >
              {statusConfig.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {originConfig.icon} {originConfig.label}
            </Badge>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
            scoreColor
          )}>
            {getScoreIcon(lead.score)}
            <span>{lead.score}</span>
          </div>
        </div>
        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {lead.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag.name}
              </Badge>
            ))}
            {lead.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lead.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        {/* Metrics */}
        {!compact && (
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>{lead.interactions_count || 0} interações</span>
            </div>
            {lead.emails_sent && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{lead.emails_sent} emails</span>
              </div>
            )}
            {lead.lifetime_value && (
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>R$ {lead.lifetime_value.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Criado {formatDate(lead.created_at)}</span>
          </div>
          {lead.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{lead.assigned_to.name}</span>
            </div>
          )}
        </div>
        {/* Quick Status Update */}
        {isHovered && showActions && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              {Object.entries(LEAD_STATUSES).slice(0, 4).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus?.(lead, status)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors",
                    status === lead.status 
                      ? `bg-${config.color}-500 text-white border-${config.color}-500`
                      : `bg-white text-${config.color}-500 border-${config.color}-300 hover:bg-${config.color}-50`
                  )}
                  title={config.label}
                >
                  {config.label.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
export default ModernLeadCard;
