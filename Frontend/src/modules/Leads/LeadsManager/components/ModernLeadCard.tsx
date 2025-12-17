// ========================================
// COMPONENTES MODERNIZADOS - LEADS
// ========================================
import React, { useState, useCallback } from 'react';
import { User, Mail, Phone, MessageCircle, Star, Tag, Calendar, MoreVertical, Edit, Trash2, Eye, TrendingUp, TrendingDown, Minus, Clock, CheckCircle, AlertCircle, Zap, Target, Activity } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Card from '@/shared/components/ui/Card';
import { cn } from '@/lib/utils';
import { Lead, LEAD_STATUSES, LEAD_ORIGINS, ACTIVITY_TYPES } from '../types';
interface ModernLeadCardProps {
  lead: Lead;
  onView??: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onUpdateScore??: (e: any) => void;
  onUpdateStatus??: (e: any) => void;
  onRecordActivity??: (e: any) => void;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ModernLeadCard: React.FC<ModernLeadCardProps> = ({ lead,
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
      description: ''};

  }, []);

  const getOriginConfig = useCallback((origin: string) => {
    return LEAD_ORIGINS[origin as keyof typeof LEAD_ORIGINS] || {
      label: origin,
      icon: '❓',
      description: ''};

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
        `border-l-${statusConfig.color} -500`,
        isHovered && "shadow-md",
        className
      )}
      onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false)  }>
      <div className="{/* Header */}">$2</div>
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h3 className="font-semibold text-gray-900 truncate" />
                {lead.name}
              </h3>
              {lead.company && (
                <span className="• {lead.company}">$2</span>
      </span>
    </>
  )}
            </div>
            <div className=" ">$2</div><Mail className="w-3 h-3" />
              <span className="truncate">{lead.email}</span>
            </div>
          {showActions && (
            <div className=" ">$2</div><Button
                variant="ghost"
                size="sm"
                onClick={ () => onView?.(lead) }
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="w-4 h-4" /></Button><Button
                variant="ghost"
                size="sm"
                onClick={ () => onEdit?.(lead) }
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="w-4 h-4" /></Button><div className=" ">$2</div><Button
                  variant="ghost"
                  size="sm"
                  onClick={ () => setShowQuickActions(!showQuickActions) }
                  className="p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                {showQuickActions && (
                  <div className=" ">$2</div><div className=" ">$2</div><button
                        onClick={ () => handleQuickAction('email_sent') }
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Mail className="w-3 h-3" />
                        Enviar Email
                      </button>
                      <button
                        onClick={ () => handleQuickAction('call_made') }
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Phone className="w-3 h-3" />
                        Registrar Ligação
                      </button>
                      <button
                        onClick={ () => handleQuickAction('meeting_scheduled') }
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Calendar className="w-3 h-3" />
                        Agendar Reunião
                      </button>
                      <button
                        onClick={ () => handleQuickAction('follow_up') }
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Zap className="w-3 h-3" />
                        Follow-up
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={ () => onDelete?.(lead) }
                        className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
      </div>
    </>
  )}
              </div>
          )}
        </div>
        {/* Contact Info */}
        {!compact && (
          <div className="{lead.phone && (">$2</div>
              <div className=" ">$2</div><Phone className="w-3 h-3" />
                <span>{lead.phone}</span>
      </div>
    </>
  )}
            {lead.whatsapp && (
              <div className=" ">$2</div><MessageCircle className="w-3 h-3" />
                <span>{lead.whatsapp}</span>
      </div>
    </>
  )}
          </div>
        )}
        {/* Status and Score */}
        <div className=" ">$2</div><div className=" ">$2</div><Badge
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
              ) } />
              {statusConfig.label}
            </Badge>
            <Badge variant="outline" className="text-xs" />
              {originConfig.icon} {originConfig.label}
            </Badge></div><div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
            scoreColor
          )  }>
        </div>{getScoreIcon(lead.score)}
            <span>{lead.score}</span>
          </div>
        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="{lead.tags.slice(0, 3).map((tag: unknown, index: unknown) => (">$2</div>
              <Badge key={index} variant="outline" className="text-xs" />
                <Tag className="w-2 h-2 mr-1" />
                {tag.name}
              </Badge>
            ))}
            {lead.tags.length > 3 && (
              <Badge variant="outline" className="text-xs" />
                +{lead.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        {/* Metrics */}
        {!compact && (
          <div className=" ">$2</div><div className=" ">$2</div><Activity className="w-3 h-3" />
              <span>{lead.interactions_count || 0} interações</span>
            </div>
            {lead.emails_sent && (
              <div className=" ">$2</div><Mail className="w-3 h-3" />
                <span>{lead.emails_sent} emails</span>
      </div>
    </>
  )}
            {lead.lifetime_value && (
              <div className=" ">$2</div><Target className="w-3 h-3" />
                <span>R$ {lead.lifetime_value.toLocaleString()}</span>
      </div>
    </>
  )}
          </div>
        )}
        {/* Footer */}
        <div className=" ">$2</div><div className=" ">$2</div><Clock className="w-3 h-3" />
            <span>Criado {formatDate(lead.created_at)}</span>
          </div>
          {lead.assigned_to && (
            <div className=" ">$2</div><User className="w-3 h-3" />
              <span>{lead.assigned_to.name}</span>
      </div>
    </>
  )}
        </div>
        {/* Quick Status Update */}
        {isHovered && showActions && (
          <div className=" ">$2</div><div className="{Object.entries(LEAD_STATUSES).slice(0, 4).map(([status, config]) => (">$2</div>
                <button
                  key={ status }
                  onClick={ () => onUpdateStatus?.(lead, status) }
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors",
                    status === lead.status 
                      ? `bg-${config.color} -500 text-white border-${config.color}-500`
                      : `bg-white text-${config.color}-500 border-${config.color}-300 hover:bg-${config.color}-50`
                  )}
                  title={ config.label  }>
                  {config.label.charAt(0)}
                </button>
              ))}
            </div>
        )}
      </div>
    </Card>);};

export default ModernLeadCard;
