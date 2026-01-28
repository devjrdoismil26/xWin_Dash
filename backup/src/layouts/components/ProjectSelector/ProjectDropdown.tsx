import React from 'react';
import { ChevronsUpDown, PlusCircle, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Project {
  id: string | number;
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
  created_at?: string;
}

interface ProjectDropdownProps {
  projects: Project[];
  activeProject?: Project | null;
  activeLabel: string;
  size: 'sm' | 'md' | 'lg';
  onSwitchProject: (project: Project) => void;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  projects,
  activeProject,
  activeLabel,
  size,
  onSwitchProject
}) => {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline" size={size} className="flex items-center gap-2 min-w-0">
          <span className="truncate max-w-32 text-left">{activeLabel}</span>
          <ChevronsUpDown className="w-4 h-4 flex-shrink-0" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content align="start" className="w-64">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-600">
          Projetos ({projects.length})
        </div>
        {projects.map((project) => (
          <Dropdown.Item 
            key={project.id} 
            onClick={() => onSwitchProject(project)}
            className={cn(
              "flex items-center justify-between",
              activeProject?.id === project.id && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{project.name}</div>
              {project.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {project.description}
                </div>
              )}
            </div>
            {activeProject?.id === project.id && (
              <Badge variant="primary" className="ml-2 text-xs">Ativo</Badge>
            )}
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.Link href="/projects" className="flex items-center justify-between">
          <span>Ver Todos</span>
          <ExternalLink className="w-4 h-4" />
        </Dropdown.Link>
        <Dropdown.Link href="/projects/create" className="flex items-center justify-between">
          <span>Criar Novo</span>
          <PlusCircle className="w-4 h-4" />
        </Dropdown.Link>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default ProjectDropdown;