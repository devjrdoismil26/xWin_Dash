import React, { useMemo } from "react";
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import UniverseButton from "./UniverseButton";
import ProjectDropdown from "./ProjectDropdown";
import EmptyProjectState from "./EmptyProjectState";

interface Project {
  id: string | number;
  name: string;
  description?: string;
  status?: "active" | "inactive" | "archived";
  created_at?: string; }

interface ProjectSelectorProps {
  projects?: Project[];
  activeProject?: Project | null;
  onSwitch??: (e: any) => void;
  size?: "sm" | "md" | "lg";
  showUniverseMode?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ProjectSelector
 *
 * @description
 * Seletor de projetos com dropdown interativo e suporte a modo Universe.
 * Exibe estado vazio quando não há projetos disponíveis.
 */
const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects = [],
  activeProject,
  onSwitch,
  size = "sm",
  showUniverseMode = true,
  className = "",
   }) => {
  const hasProjects = projects && projects.length > 0;

  const activeLabel = useMemo(
    () => (activeProject ? activeProject.name : "Selecionar Projeto"),
    [activeProject],);

  const switchProject = (project: Project) => {
    if (onSwitch) return onSwitch(project);

    router.post("/projects/switch", { project_id: project.id });};

  const openUniverseMode = () => {
    const universeUrl = "/universe/workspace-selector";
    router.visit(universeUrl);};

  if (!hasProjects) {
    return (
              <EmptyProjectState
        size={ size }
        showUniverseMode={ showUniverseMode }
        onOpenUniverseMode={ openUniverseMode }
        className={className} / />);

  }

  return (
        <>
      <div className={cn("flex items-center gap-2", className)  }>
      </div><ProjectDropdown
        projects={ projects }
        activeProject={ activeProject }
        activeLabel={ activeLabel }
        size={ size }
        onSwitchProject={ switchProject  }>
          {showUniverseMode && (
        <UniverseButton size={size} onClick={openUniverseMode} / />
      )}
    </div>);};

export default ProjectSelector;
