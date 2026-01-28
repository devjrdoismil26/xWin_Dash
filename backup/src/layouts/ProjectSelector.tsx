import React, { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { UniverseButton, ProjectDropdown, EmptyProjectState } from './components/ProjectSelector';

interface Project {
  id: string | number;
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
  created_at?: string;
}

interface ProjectSelectorProps {
  projects?: Project[];
  activeProject?: Project | null;
  onSwitch?: (project: Project) => void;
  size?: 'sm' | 'md' | 'lg';
  showUniverseMode?: boolean;
  className?: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  projects = [], 
  activeProject, 
  onSwitch,
  size = 'sm',
  showUniverseMode = true,
  className = ''
}) => {
  const hasProjects = projects && projects.length > 0;

  const activeLabel = useMemo(() => (
    activeProject ? activeProject.name : 'Selecionar Projeto'
  ), [activeProject]);

  const switchProject = (project: Project) => {
    if (onSwitch) return onSwitch(project);
    
    // Usar a rota correta para trocar projeto
    router.post('/projects/switch', { project_id: project.id });
  };

  const openUniverseMode = () => {
    // Fallback para rota direta se ziggy-js não estiver disponível
    const universeUrl = '/universe/workspace-selector';
    router.visit(universeUrl);
  };

  if (!hasProjects) {
    return (
      <EmptyProjectState
        size={size}
        showUniverseMode={showUniverseMode}
        onOpenUniverseMode={openUniverseMode}
        className={className}
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ProjectDropdown
        projects={projects}
        activeProject={activeProject}
        activeLabel={activeLabel}
        size={size}
        onSwitchProject={switchProject}
      />

      {showUniverseMode && (
        <UniverseButton
          size={size}
          onClick={openUniverseMode}
        />
      )}
    </div>
  );
};

export default ProjectSelector;
