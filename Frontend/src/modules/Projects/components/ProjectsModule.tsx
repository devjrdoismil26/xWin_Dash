import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { useProjects } from '../hooks/useProjects';
import ProjectsDashboard from './ProjectsDashboard';
import ProjectsHeader from './ProjectsHeader';
import ProjectsNavigation from './ProjectsNavigation';
import UniverseInterface from '../Universe/UniverseInterface';
import { cn } from '@/lib/utils';

interface ProjectsModuleProps {
  auth?: string;
  initialProject?: string;
  initialView?: 'dashboard' | 'universe' | 'project';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ProjectsModule: React.FC<ProjectsModuleProps> = ({ auth,
  initialProject,
  initialView = 'dashboard'
   }) => {
  const {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    navigateToProject,
    navigateToUniverse,
    clearError
  } = useProjects();

  const [activeView, setActiveView] = useState<'dashboard' | 'universe' | 'project'>(initialView);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize with initial project if provided
  useEffect(() => {
    if (initialProject) {
      navigateToProject(initialProject);

      setActiveView('project');

    } , [initialProject, navigateToProject]);

  // Handle navigation
  const handleNavigateToProject = (project: unknown) => {
    navigateToProject(project);

    setActiveView('project');};

  const handleNavigateToUniverse = () => {
    navigateToUniverse();

    setActiveView('universe');};

  const handleNavigateToDashboard = () => {
    setActiveView('dashboard');};

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);};

  // Render loading state
  if (loading && projects.length === 0) { return (
        <>
      <AppLayout auth={auth } />
      <Head title="Projects - xWin Dash" / />
        <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></AppLayout>);

  }

  // Render error state
  if (error && projects.length === 0) { return (
        <>
      <AppLayout auth={auth } />
      <Head title="Projects - xWin Dash" / />
        <ErrorState
          title="Failed to load projects"
          message={ error }
          onRetry={() => {
            clearError();

            fetchProjects();

          } />
      </AppLayout>);

  }

  return (
        <>
      <PageTransition type="fade" duration={ 300 } />
      <AppLayout auth={ auth } />
        <Head title="Projects - xWin Dash" / />
        <div className="{/* Sidebar Navigation */}">$2</div>
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-80" : "w-16",
            "bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0"
          )  }>
        </div><ProjectsNavigation
              projects={ projects }
              currentProject={ currentProject }
              activeView={ activeView }
              sidebarOpen={ sidebarOpen }
              onNavigateToProject={ handleNavigateToProject }
              onNavigateToUniverse={ handleNavigateToUniverse }
              onNavigateToDashboard={ handleNavigateToDashboard }
              onToggleSidebar={ toggleSidebar }
            / />
          </div>

          {/* Main Content */}
          <div className="{/* Header */}">$2</div>
            <ProjectsHeader
              currentProject={ currentProject }
              activeView={ activeView }
              onNavigateToDashboard={ handleNavigateToDashboard }
              onNavigateToUniverse={ handleNavigateToUniverse }
              sidebarOpen={ sidebarOpen }
              onToggleSidebar={ toggleSidebar  }>
          {/* Content Area */}
            <div className="{activeView === 'dashboard' && (">$2</div>
      <ProjectsDashboard
                  projects={ projects }
                  onNavigateToProject={ handleNavigateToProject }
                  onNavigateToUniverse={ handleNavigateToUniverse }
                / />
    </>
  )}

              {activeView === 'universe' && (
                <UniverseInterface
                  auth={ auth }
                  onNavigateToProject={ handleNavigateToProject }
                  onNavigateToDashboard={ handleNavigateToDashboard }
                / />
              )}

              {activeView === 'project' && currentProject && (
                <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4" />
                        {currentProject.name}
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 mb-6" />
                        {currentProject.description}
                      </p>
                      
                      {/* Project content will be rendered here based on project mode */}
                      {currentProject.mode === 'universe' ? (
                        <div className=" ">$2</div><div className="text-purple-500 text-6xl mb-4">✨</div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" />
                            Universe Mode
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-6" />
                            This project is configured for Universe mode. Click below to access the advanced interface.
                          </p>
                          <button
                            onClick={ handleNavigateToUniverse }
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200" />
                            Open Universe Interface
                          </button>
      </div>
    </>
  ) : (
                        <div className=" ">$2</div><div className="text-blue-500 text-6xl mb-4">📊</div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" />
                            Normal Mode
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-6" />
                            This project is configured for normal mode. Access individual modules from the sidebar.
                          </p>
                          <div className="{currentProject.modules?.map((module: string) => (">$2</div>
                              <div
                                key={ module }
                                className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
           
        </div><h4 className="font-medium text-slate-900 dark:text-white capitalize" />
                                  {module}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1" />
                                  Access {module} functionality
                                </p>
      </div>
    </>
  ))}
                          </div>
                      )}
                    </div>
    </div>
  )}

              {activeView === 'project' && !currentProject && (
                <div className=" ">$2</div><div className=" ">$2</div><div className="text-slate-400 text-6xl mb-4">📁</div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" />
                      No Project Selected
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6" />
                      Select a project from the sidebar to view its details.
                    </p>
                    <button
                      onClick={ handleNavigateToDashboard }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200" />
                      Back to Dashboard
                    </button>
      </div>
    </>
  )}
            </div></div></AppLayout>
    </PageTransition>);};

export default ProjectsModule;
