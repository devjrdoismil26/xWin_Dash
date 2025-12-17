import React from 'react';
import { Menu, ChevronLeft, ChevronRight, Sparkles, LayoutGrid, Home, Settings, Bell, User, Search, Filter, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import { ProjectCore } from '../types/projectsTypes';

interface ProjectsHeaderProps {
  currentProject: ProjectCore | null;
  activeView: 'dashboard' | 'universe' | 'project';
  onNavigateToDashboard??: (e: any) => void;
  onNavigateToUniverse??: (e: any) => void;
  sidebarOpen: boolean;
  onToggleSidebar??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ currentProject,
  activeView,
  onNavigateToDashboard,
  onNavigateToUniverse,
  sidebarOpen,
  onToggleSidebar
   }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Projects Dashboard';
      case 'universe':
        return 'Universe Interface';
      case 'project':
        return currentProject?.name || 'Project Details';
      default:
        return 'Projects';
    } ;

  const getViewDescription = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Manage your projects and access the Universe';
      case 'universe':
        return 'Advanced drag & drop interface with AI and automation';
      case 'project':
        return currentProject?.description || 'View and manage project details';
      default:
        return '';
    } ;

  const getViewIcon = () => {
    switch (activeView) {
      case 'dashboard':
        return <Home className="w-6 h-6 text-blue-500" />;
      case 'universe':
        return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'project':
        return <LayoutGrid className="w-6 h-6 text-green-500" />;
      default:
        return <LayoutGrid className="w-6 h-6 text-slate-500" />;
    } ;

  return (
        <>
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4" />
      <div className="{/* Left Section */}">$2</div>
        <div className="{/* Sidebar Toggle */}">$2</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={ onToggleSidebar }
            className="p-2" />
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>

          {/* View Info */}
          <div className="{getViewIcon()}">$2</div>
            <div>
           
        </div><h1 className="text-xl font-semibold text-slate-900 dark:text-white" />
                {getViewTitle()}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400" />
                {getViewDescription()}
              </p>
            </div>

          {/* Project Mode Badge */}
          {currentProject && (
            <Badge
              variant="outline"
              className={cn(
                "ml-4",
                (currentProject as { mode?: string } ).mode === 'universe'
                  ? "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                  : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
              )} />
              {(currentProject as any).mode === 'universe' ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Universe Mode
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3 h-3 mr-1" />
                  Normal Mode
                </>
              )}
            </Badge>
          )}
        </div>

        {/* Center Section - Search */}
        <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search projects, tasks, or members..."
              value={ searchTerm }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value) }
              className="pl-10" />
          </div>

        {/* Right Section */}
        <div className="{/* Quick Navigation */}">$2</div>
          {activeView !== 'dashboard' && (
            <Button
              variant="outline"
              size="sm"
              onClick={ onNavigateToDashboard }
              className="hidden sm:flex" />
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          )}

          {activeView !== 'universe' && (
            <Button
              variant="outline"
              size="sm"
              onClick={ onNavigateToUniverse }
              className="hidden sm:flex border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20" />
              <Sparkles className="w-4 h-4 mr-2" />
              Universe
            </Button>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2" />
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center" />
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2" />
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2" />
            <User className="w-5 h-5" />
          </Button>

          {/* More Options */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2" />
            <MoreVertical className="w-5 h-5" /></Button></div>

      {/* Breadcrumb Navigation */}
      {activeView === 'project' && currentProject && (
        <div className=" ">$2</div><button
            onClick={ onNavigateToDashboard }
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" />
            Dashboard
          </button>
          <span className="text-slate-400">/</span>
          <span className="{currentProject.name}">$2</span>
          </span>
      </div>
    </>
  )}

      {/* View-specific Actions */}
      {activeView === 'project' && currentProject && (
        <div className="{(currentProject as any).mode === 'universe' ? (">$2</div>
            <Button
              onClick={ onNavigateToUniverse }
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" />
              <Sparkles className="w-4 h-4 mr-2" />
              Open Universe Interface
            </Button>
          ) : (
            <div className=" ">$2</div><Button variant="outline" size="sm" />
                <Settings className="w-4 h-4 mr-2" />
                Project Settings
              </Button>
              <Button variant="outline" size="sm" />
                <User className="w-4 h-4 mr-2" />
                Manage Members
              </Button>
              <Button variant="outline" size="sm" />
                <Filter className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
      </div>
    </>
  )}
        </div>
      )}
    </header>);};

export default ProjectsHeader;
