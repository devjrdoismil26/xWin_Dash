import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Play, Pause, RefreshCw, Plus, Edit, Trash2, Filter, Download } from 'lucide-react';
import { useProjectTimelines } from '../ProjectsAdvanced/hooks/timelines/useProjectTimelines';
import { ProjectTimeline, ProjectTimelinePhase, ProjectTimelineTask, ProjectTimelineMilestone } from '../types/projectsTypes';

interface ProjectTimelineProps {
  projectId: string;
  onTimelineUpdate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId, 
  onTimelineUpdate 
   }) => {
  const {
    timeline,
    loading,
    error,
    getTimeline,
    updateTimeline
  } = useProjectTimeline();

  const [selectedView, setSelectedView] = useState<'phases' | 'tasks' | 'milestones'>('phases');

  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      getTimeline(projectId);

    } , [projectId, getTimeline]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800'};

    return colors[status] || colors.not_started;};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'on_hold':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    } ;

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'};

    return colors[priority] || colors.medium;};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });};

  const calculateProgress = (startDate: string, endDate: string, currentProgress: number) => {
    const start = new Date(startDate).getTime();

    const end = new Date(endDate).getTime();

    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end - start;
    const elapsed = now - start;
    const timeProgress = (elapsed / totalDuration) * 100;
    
    return Math.max(currentProgress, Math.min(timeProgress, 100));};

  if (loading && !timeline) {
    return (
              <div className=" ">$2</div><div className=" ">$2</div><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando timeline...</span>
        </div>);

  }

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Calendar className="w-6 h-6 text-blue-600" />
            <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900" />
                Timeline do Projeto
              </h3>
              <p className="text-sm text-gray-500" />
                Cronograma e marcos do projeto
              </p></div><div className=" ">$2</div><select
              value={ selectedView }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedView(e.target.value as 'timeline' | 'gantt' | 'calendar') }
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="phases">Fases</option>
              <option value="tasks">Tarefas</option>
              <option value="milestones">Marcos</option></select><button className="p-2 text-gray-400 hover:text-gray-600" />
              <Download className="w-4 h-4" /></button><button
              onClick={ () => projectId && getTimeline(projectId) }
              disabled={ loading }
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} `} / /></button></div>
      </div>

      {/* Content */}
      <div className="{!timeline ? (">$2</div>
          <div className=" ">$2</div><Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2" />
              Nenhuma timeline disponível
            </h4>
            <p className="text-gray-500" />
              A timeline será criada automaticamente quando o projeto for configurado
            </p>
      </div>
    </>
  ) : (
          <div className="{/* Timeline Overview */}">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Calendar className="w-5 h-5 text-blue-600" />
                  <span className="Total de Fases">$2</span>
                  </span></div><p className="text-2xl font-bold text-blue-900" />
                  {timeline.phases?.length || 0}
                </p></div><div className=" ">$2</div><div className=" ">$2</div><CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="Marcos Concluídos">$2</span>
                  </span></div><p className="text-2xl font-bold text-green-900" />
                  {timeline.milestones?.filter(m => m.completed).length || 0}
                </p></div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-5 h-5 text-purple-600" />
                  <span className="Tarefas Ativas">$2</span>
                  </span></div><p className="text-2xl font-bold text-purple-900" />
                  {timeline.tasks?.filter(t => t.status === 'in_progress').length || 0}
                </p></div><div className=" ">$2</div><div className=" ">$2</div><Clock className="w-5 h-5 text-orange-600" />
                  <span className="Progresso Geral">$2</span>
                  </span></div><p className="text-2xl font-bold text-orange-900" />
                  {Math.round(
                    timeline.phases?.reduce((acc: unknown, phase: unknown) => acc + phase.progress, 0) / 
                    (timeline.phases?.length || 1)
                  )}%
                </p>
              </div>

            {/* Timeline Content */}
            {selectedView === 'phases' && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Fases do Projeto
                </h4>
                <div className="{timeline.phases?.map((phase: unknown) => (">$2</div>
                    <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div 
                            className="w-4 h-4 rounded-full"
                            style={backgroundColor: phase.color } />
           
        </div><h5 className="text-sm font-medium text-gray-900" />
                            {phase.name}
                          </h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(phase.status)} `}>
           
        </span>{phase.status.replace('_', ' ')}
                          </span></div><div className="{getStatusIcon(phase.status)}">$2</div>
                          <span className="{phase.progress}%">$2</span>
                          </span></div><p className="text-sm text-gray-600 mb-3" />
                        {phase.description}
                      </p>

                      <div className=" ">$2</div><div className=" ">$2</div><span>Início: {formatDate(phase.start_date)}</span>
                          <span>Fim: {formatDate(phase.end_date)}</span></div><div className=" ">$2</div><div
                            className="h-2 rounded-full transition-all duration-300"
                            style={backgroundColor: phase.color,
                              width: `${phase.progress} %`
                            } / />
           
        </div></div>
                  ))}
                </div>
            )}

            {selectedView === 'tasks' && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Tarefas do Projeto
                </h4>
                <div className="{timeline.tasks?.map((task: unknown) => (">$2</div>
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><div className={`w-3 h-3 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        } `} />
           
        </div><div>
           
        </div><p className="text-sm font-medium text-gray-900" />
                            {task.name}
                          </p>
                          <p className="text-xs text-gray-500" />
                            {task.assigned_to_name || 'Não atribuído'}
                          </p></div><div className=" ">$2</div><span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)} `}>
           
        </span>{task.priority}
                        </span>
                        <span className="{formatDate(task.due_date)}">$2</span>
                        </span>
                        <span className="{task.progress}%">$2</span>
                        </span>
      </div>
    </>
  ))}
                </div>
            )}

            {selectedView === 'milestones' && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Marcos do Projeto
                </h4>
                <div className="{timeline.milestones?.map((milestone: unknown) => (">$2</div>
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><div 
                          className={`w-3 h-3 rounded-full ${
                            milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                          } `} />
           
        </div><div>
           
        </div><p className="text-sm font-medium text-gray-900" />
                            {milestone.name}
                          </p>
                          <p className="text-xs text-gray-500" />
                            {milestone.description}
                          </p></div><div className="{milestone.completed ? (">$2</div>
      <CheckCircle className="w-4 h-4 text-green-600" />
    </>
  ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="{formatDate(milestone.due_date)}">$2</span>
                        </span>
      </div>
    </>
  ))}
                </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className=" ">$2</div><p className="text-sm text-red-700">{error}</p>
      </div>
    </>
  )}
      </div>);};

export default ProjectTimeline;
