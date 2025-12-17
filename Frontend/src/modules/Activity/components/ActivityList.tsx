/**
 * Lista de atividades do módulo Activity
 *
 * @description
 * Componente para exibir lista de atividades com paginação, seleção múltipla
 * e badges informativos. Suporta diferentes tipos de atividades com ícones
 * e cores específicas.
 *
 * @module modules/Activity/components/ActivityList
 * @since 1.0.0
 */

import React from 'react';
import { ActivityLog } from '../types';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { User, Calendar, Database, Eye, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getLogType } from '../utils/activityHelpers';
import { formatLogDescription, formatTimestamp } from '../utils/activityFormatters';
import { ACTIVITY_BADGE_VARIANTS } from '../utils/activityConstants';

/**
 * Props do componente ActivityList
 *
 * @interface ActivityListProps
 * @property {ActivityLog[]} logs - Lista de logs de atividades
 * @property {boolean} loading - Se está carregando dados
 * @property {string[]} selectedIds - IDs dos logs selecionados
 * @property {(id: string) => void} onLogSelect - Callback ao selecionar log
 * @property {string} [className] - Classes CSS adicionais
 */
interface ActivityListProps {
  logs: ActivityLog[];
  loading: boolean;
  selectedIds: string[];
  onLogSelect?: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ActivityList
 *
 * @description
 * Renderiza lista de atividades com cards informativos, badges de tipo,
 * ícones contextuais e seleção múltipla. Exibe loading spinner quando necessário.
 *
 * @param {ActivityListProps} props - Props do componente
 * @returns {JSX.Element} Lista de atividades
 */
export const ActivityList: React.FC<ActivityListProps> = ({ logs,
  loading,
  selectedIds,
  onLogSelect,
  className
   }) => {
  const getActivityIcon = (logName: string) => {
    const iconName = getLogIcon(logName);

    const iconProps = { className: "h-4 w-4"};

    switch (iconName) { case 'User':
        return <User {...iconProps } />;
      case 'UserPlus':
        return <CheckCircle { ...iconProps } />;
      case 'UserEdit':
        return <CheckCircle { ...iconProps } />;
      case 'UserMinus':
        return <AlertTriangle { ...iconProps } />;
      case 'Mail':
        return <Activity { ...iconProps } />;
      case 'Shield':
        return <AlertTriangle { ...iconProps } />;
      case 'Settings':
        return <Activity { ...iconProps } />;
      case 'Globe':
        return <Activity { ...iconProps } />;
      case 'AlertTriangle':
        return <AlertTriangle { ...iconProps } />;
      default:
        return <Activity { ...iconProps } />;
    } ;

  const getActivityColor = (logName: string) => {
    return getLogColor(logName);};

  const getActivityText = (logName: string) => {
    const type = getLogType(logName);

    const texts = {
      'login': 'Login',
      'logout': 'Logout',
      'create': 'Criação',
      'update': 'Atualização',
      'delete': 'Exclusão',
      'email': 'Email',
      'security': 'Segurança',
      'settings': 'Configurações',
      'api': 'API',
      'error': 'Erro',
      'activity': 'Atividade'};

    return texts[type] || type;};

  if (loading) {
    return (
        <>
      <Card className={`backdrop-blur-xl bg-white/10 border-white/20 ${className} `} />
      <Card.Content className="p-6" />
          <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></Card.Content>
      </Card>);

  }

  return (
        <>
      <Card className={`backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 ${className} `} />
      <Card.Header />
        <Card.Title className="text-gray-900 dark:text-white" />
          Atividades ({logs.length})
        </Card.Title>
        <Card.Description className="text-gray-600 dark:text-gray-300" />
          Histórico completo de ações no sistema
        </Card.Description>
      </Card.Header>
      <Card.Content />
        <div className="{(logs || []).map((log: unknown) => {">$2</div>
            const type = getLogType(log.log_name);

            const color = getActivityColor(log.log_name);

            const isSelected = selectedIds.includes(log.id);

            return (
        <>
      <div 
                key={ log.id }
                className={`flex items-start gap-4 p-4 border border-white/20 rounded-lg hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/5 hover:bg-white/10 ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
                } `}>
      </div>{/* Selection Checkbox */}
                <div className=" ">$2</div><Checkbox
                    checked={ isSelected }
                    onCheckedChange={ () => onLogSelect(log.id) }
                    className="backdrop-blur-sm" />
                </div>

                {/* Activity Icon */}
                <div className={`p-2 rounded-lg backdrop-blur-sm ${
                  type === 'error' ? 'bg-red-500/20' :
                  type === 'security' ? 'bg-yellow-500/20' :
                  type === 'create' ? 'bg-green-500/20' :
                  type === 'update' ? 'bg-blue-500/20' :
                  type === 'delete' ? 'bg-red-500/20' :
                  'bg-gray-500/20'
                } `}>
           
        </div>{getActivityIcon(log.log_name)}
                </div>

                {/* Activity Content */}
                <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><div className=" ">$2</div><h3 className="font-semibold text-gray-900 dark:text-white" />
                          {formatLogDescription(log)}
                        </h3>
                        <Badge variant={color as 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' | 'primary' | 'info'} size="sm" />
                          {getActivityText(log.log_name)}
                        </Badge></div><div className=" ">$2</div><span className=" ">$2</span><User className="h-3 w-3" />
                          {log.causer_type || 'Sistema'}
                        </span>
                        <span className=" ">$2</span><Calendar className="h-3 w-3" />
                          {formatTimestamp(log.created_at)}
                        </span>
                        {log.subject_type && (
                          <span className=" ">$2</span><Database className="h-3 w-3" />
                            {log.subject_type.replace('App\\Models\\', '')}
                          </span>
                        )}
                      </div>
                    <div className=" ">$2</div><Tooltip content="Ver detalhes da atividade" />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="backdrop-blur-sm bg-white/10 hover:bg-white/20" />
                          <Eye className="h-4 w-4" /></Button></Tooltip>
                    </div>
                  
                  {/* Properties */}
                  {log.properties && Object.keys(log.properties).length > 0 && (
                    <div className=" ">$2</div><p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" />
                        Detalhes:
                      </p>
                      <div className=" ">$2</div><pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300" />
                          {JSON.stringify(log.properties, null, 2)}
                        </pre>
      </div>
    </>
  )}
                </div>);

          })}
        </div>
      </Card.Content>
    </Card>);};

export default ActivityList;
