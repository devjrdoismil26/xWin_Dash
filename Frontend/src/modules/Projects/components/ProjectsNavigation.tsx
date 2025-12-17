import React from 'react';
import { LayoutGrid, Sparkles, Home, ChevronLeft, ChevronRight, Plus, Search, Filter, Settings, Users, BarChart3, Workflow, Mail, MessageSquare, Globe, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import { ProjectCore } from '../types/projectsTypes';

interface ProjectsNavigationProps {
  projects: ProjectCore[];
  currentProject: ProjectCore | null;
  activeView: 'dashboard' | 'universe' | 'project';
  sidebarOpen: boolean;
  onNavigateToProject?: (e: any) => void;
  onNavigateToUniverse??: (e: any) => void;
  onNavigateToDashboard??: (e: any) => void;
  onToggleSidebar??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ProjectsNavigation: React.FC<ProjectsNavigationProps> = ({ projects,
  currentProject,
  activeView,
  sidebarOpen,
  onNavigateToProject,
  onNavigateToUniverse,
  onNavigateToDashboard,
  onToggleSidebar
   }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const [filterMode, setFilterMode] = React.useState<'all' | 'normal' | 'universe'>('all');

  // Filter projects based on search and mode
  const filteredProjects = React.useMemo(() => {
    return (projects || []).filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // For now, we'll use a simple check - in real implementation, this would come from project data
      const projectMode = (project as { mode?: string }).mode || 'normal';
      const matchesFilter = filterMode === 'all' || projectMode === filterMode;
      
      return matchesSearch && matchesFilter;
    });

  }, [projects, searchTerm, filterMode]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'archived': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    } ;

  const getModeIcon = (mode: string) => {
    return mode === 'universe' ? 
      <Sparkles className="w-4 h-4 text-purple-500" /> : 
      <LayoutGrid className="w-4 h-4 text-blue-500" />;};

  const getModuleIcon = (module: string) => {
    const icons: Record<string, React.ReactNode> = {
      leads: <Users className="w-3 h-3" />,
      workflows: <Workflow className="w-3 h-3" />,
      email: <Mail className="w-3 h-3" />,
      social: <MessageSquare className="w-3 h-3" />,
      analytics: <BarChart3 className="w-3 h-3" />,
      settings: <Settings className="w-3 h-3" />};

    return icons[module] || <Globe className="w-3 h-3" />;};

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className="{sidebarOpen && (">$2</div>
            <div className=" ">$2</div><LayoutGrid className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white" />
                Projects
              </h2>
      </div>
    </>
  )}
          <Button
            variant="ghost"
            size="sm"
            onClick={ onToggleSidebar }
            className="p-2" />
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

      {/* Navigation Menu */}
      <div className="{/* Dashboard */}">$2</div>
        <button
          onClick={ onNavigateToDashboard }
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200",
            activeView === 'dashboard'
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          ) } />
          <Home className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Dashboard</span>}
        </button>

        {/* Universe */}
        <button
          onClick={ onNavigateToUniverse }
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200",
            activeView === 'universe'
              ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          ) } />
          <Sparkles className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Universe</span>}
        </button>
      </div>

      {/* Search and Filters */}
      {sidebarOpen && (
        <div className="{/* Search */}">$2</div>
          <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={ searchTerm }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value) }
              className="pl-10" />
          </div>

          {/* Filter Buttons */}
          <div className=" ">$2</div><Button
              variant={ filterMode === 'all' ? 'default' : 'outline' }
              size="sm"
              onClick={ () => setFilterMode('all') }
              className="flex-1"
            >
              All
            </Button>
            <Button
              variant={ filterMode === 'normal' ? 'default' : 'outline' }
              size="sm"
              onClick={ () => setFilterMode('normal') }
              className="flex-1"
            >
              <LayoutGrid className="w-3 h-3 mr-1" />
              Normal
            </Button>
            <Button
              variant={ filterMode === 'universe' ? 'default' : 'outline' }
              size="sm"
              onClick={ () => setFilterMode('universe') }
              className="flex-1"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Universe
            </Button>
      </div>
    </>
  )}

      {/* Projects List */}
      <div className="{sidebarOpen ? (">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-sm font-medium text-slate-700 dark:text-slate-300" />
                Projects ({filteredProjects.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="p-1" />
                <Plus className="w-4 h-4" /></Button></div>

            {filteredProjects.length === 0 ? (
              <div className=" ">$2</div><LayoutGrid className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400" />
                  {searchTerm || filterMode !== 'all' 
                    ? 'No projects found'
                    : 'No projects yet'
                  }
                </p>
      </div>
    </>
  ) : (
              <div className="{(filteredProjects || []).map((project: unknown) => (">$2</div>
                  <button
                    key={ project.id }
                    onClick={ () => onNavigateToProject(project) }
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-all duration-200 border",
                      currentProject?.id === project.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                    )  }>
                    <div className=" ">$2</div><div className="{getModeIcon((project as { mode?: string }).mode || 'normal')}">$2</div>
                        <span className="{project.name}">$2</span>
                        </span></div><div className="{getStatusIcon(project.status)}">$2</div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            (project as { mode?: string } ).mode === 'universe'
                              ? "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                              : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                          )} />
                          {(project as any).mode === 'universe' ? 'Universe' : 'Normal'}
                        </Badge>
                      </div>

                    {project.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2" />
                        {project.description}
                      </p>
                    )}

                    {/* Modules */}
                    {(project as { modules?: string[] }).modules && (project as { modules?: string[] }).modules.length > 0 && (
                      <div className="{((project as { modules?: string[] }).modules || []).slice(0, 3).map((module: string) => (">$2</div>
                          <div
                            key={ module }
                            className="flex items-center space-x-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs">
           
        </div>{getModuleIcon(module)}
                            <span className="capitalize">{module}</span>
      </div>
    </>
  ))}
                        {((project as { modules?: string[] }).modules || []).length > 3 && (
                          <div className="+{((project as { modules?: string[] }).modules || []).length - 3}">$2</div>
    </div>
  )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Collapsed sidebar - show only icons
          <div className=" ">$2</div><div className=" ">$2</div><Button
                variant="ghost"
                size="sm"
                className="p-2" />
                <Plus className="w-4 h-4" /></Button></div>
            
            {filteredProjects.slice(0, 8).map((project: unknown) => (
              <button
                key={ project.id }
                onClick={ () => onNavigateToProject(project) }
                className={cn(
                  "w-full p-2 rounded-lg transition-colors duration-200",
                  currentProject?.id === project.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700"
                )} title={ project.name  }>
                {getModeIcon((project as any).mode || 'normal')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {sidebarOpen && (
        <div className=" ">$2</div><Button
            variant="ghost"
            size="sm"
            className="w-full justify-start" />
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
      </div>
    </>
  )}
    </div>);};

export default ProjectsNavigation;
