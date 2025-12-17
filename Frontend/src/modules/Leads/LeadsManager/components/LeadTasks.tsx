/**
 * Componente LeadTasks
 *
 * @description
 * Componente para exibir e gerenciar tarefas de um lead específico.
 *
 * @module modules/Leads/LeadsManager/components/LeadTasks
 * @since 1.0.0
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, User } from 'lucide-react';
import { LeadTask } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Props do componente LeadTasks
 *
 * @interface LeadTasksProps
 * @property {LeadTask[]} tasks - Lista de tarefas do lead
 * @property {boolean} loading - Se está carregando
 * @property {number} leadId - ID do lead
 */
interface LeadTasksProps {
  tasks: LeadTask[];
  loading: boolean;
  leadId: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Mapeia status de tarefa para ícone e cor
 */
const getTaskStatusIcon = (status: LeadTask['status']) => {
  switch (status) {
    case 'completed':
      return { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400'};

    case 'in_progress':
      return { icon: Clock, color: 'text-blue-600 dark:text-blue-400'};

    case 'cancelled':
      return { icon: AlertCircle, color: 'text-red-600 dark:text-red-400'};

    default:
      return { icon: Circle, color: 'text-gray-400 dark:text-gray-500'};

  } ;

/**
 * Mapeia prioridade para cor do badge
 */
const getPriorityColor = (priority: LeadTask['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  } ;

/**
 * Componente LeadTasks
 *
 * @description
 * Exibe uma lista de tarefas do lead com opção de adicionar novas tarefas.
 *
 * @param {LeadTasksProps} props - Props do componente
 * @returns {JSX.Element} Componente de tarefas
 *
 * @example
 * ```tsx
 * <LeadTasks
 *   tasks={ tasks }
 *   loading={ false }
 *   leadId={ 123 }
 * / />
 * ```
 */
export const LeadTasks: React.FC<LeadTasksProps> = ({ tasks, loading, leadId    }) => {
  const handleAddTask = () => {};

  if (loading) {
    return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><LoadingSpinner size="md" / /></div></Card>);

  }

  return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center" />
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Tarefas
        </h3>
        <Button onClick={handleAddTask} variant="primary" size="sm" />
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Tarefa
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className=" ">$2</div><CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma tarefa encontrada</p>
      </div>
    </>
  ) : (
        <div className="{(tasks || []).map((task: unknown) => {">$2</div>
            const { icon: StatusIcon, color: statusColor } = getTaskStatusIcon(task.status);

            const priorityColor = getPriorityColor(task.priority);

            return (
        <>
      <div
                key={ task.id }
                className={cn(
                  'p-4 rounded-lg border',
                  task.status === 'completed'
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-75'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                )  }>
      </div><div className=" ">$2</div><div className=" ">$2</div><StatusIcon className={cn('w-5 h-5 mt-0.5', statusColor)} / />
                    <div className=" ">$2</div><h4
                        className={cn(
                          'font-medium',
                          task.status === 'completed'
                            ? 'text-gray-500 dark:text-gray-400 line-through'
                            : 'text-gray-900 dark:text-white'
                        ) } />
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                      )}
                    </div></div><div className=" ">$2</div><div className="{task.assigned_user && (">$2</div>
                      <div className=" ">$2</div><User className="w-3 h-3 mr-1" />
                        <span>{task.assigned_user.name}</span>
      </div>
    </>
  )}
                    {task.due_date && (
                      <div className=" ">$2</div><Clock className="w-3 h-3 mr-1" />
                        <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
      </div>
    </>
  )}
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded', priorityColor)  }>
        </span>{task.priority}
                  </span>
                </div>);

          })}
        </div>
      )}
    </Card>);};

export default LeadTasks;
