/**
 * Dropdown de sele??o de projetos
 *
 * @description
 * Dropdown interativo para sele??o de projetos com lista de projetos dispon?veis,
 * indica??o de projeto ativo e links para gerenciar projetos.
 *
 * @module layouts/components/ProjectSelector/ProjectDropdown
 * @since 1.0.0
 */

import React from "react";
import { ChevronsUpDown, PlusCircle, ExternalLink } from 'lucide-react';
import Button from "@/shared/components/ui/Button";
import Dropdown from "@/shared/components/ui/Dropdown";
import Badge from "@/shared/components/ui/Badge";
import { cn } from '@/lib/utils';

/**
 * Interface de projeto
 *
 * @interface Project
 * @property {string | number} id - ID ?nico do projeto
 * @property {string} name - Nome do projeto
 * @property {string} [description] - Descri??o opcional do projeto
 * @property {'active' | 'inactive' | 'archived'} [status] - Status do projeto
 * @property {string} [created_at] - Data de cria??o do projeto
 */
interface Project {
  id: string | number;
  name: string;
  description?: string;
  status?: "active" | "inactive" | "archived";
  created_at?: string; }

/**
 * Props do componente ProjectDropdown
 *
 * @interface ProjectDropdownProps
 * @property {Project[]} projects - Lista de projetos dispon?veis
 * @property {Project | null} [activeProject] - Projeto atualmente selecionado
 * @property {string} activeLabel - Label para exibir no trigger do dropdown
 * @property {'sm' | 'md' | 'lg'} size - Tamanho do bot?o trigger
 * @property {(project: Project) => void} onSwitchProject - Callback quando projeto ? selecionado
 */
interface ProjectDropdownProps {
  projects: Project[];
  activeProject?: Project | null;
  activeLabel: string;
  size: "sm" | "md" | "lg";
  onSwitchProject?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({ projects,
  activeProject,
  activeLabel,
  size,
  onSwitchProject,
   }) => {
  return (
        <>
      <Dropdown />
      <Dropdown.Trigger asChild />
        <Button
          variant="outline"
          size={ size }
          className="flex items-center gap-2 min-w-0" />
          <span className="truncate max-w-32 text-left">{activeLabel}</span>
          <ChevronsUpDown className="w-4 h-4 flex-shrink-0" /></Button></Dropdown.Trigger>
      <Dropdown.Content align="start" className="w-64" />
        <div className="Projetos ({projects.length})">$2</div>
        </div>
        {(projects || []).map((project: unknown) => (
          <Dropdown.Item
            key={ project.id }
            onClick={ () => onSwitchProject(project) }
            className={cn(
              "flex items-center justify-between",
              activeProject?.id === project.id &&
                "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
            )  }>
            <div className=" ">$2</div><div className="font-medium truncate">{project.name}</div>
              {project.description && (
                <div className="{project.description}">$2</div>
    </div>
  )}
            </div>
            {activeProject?.id === project.id && (
              <Badge variant="primary" className="ml-2 text-xs" />
                Ativo
              </Badge>
            )}
          </Dropdown.Item>
        ))}
        <Dropdown.Divider / />
        <Dropdown.Link
          href="/projects"
          className="flex items-center justify-between" />
          <span>Ver Todos</span>
          <ExternalLink className="w-4 h-4" />
        </Dropdown.Link>
        <Dropdown.Link
          href="/projects/create"
          className="flex items-center justify-between" />
          <span>Criar Novo</span>
          <PlusCircle className="w-4 h-4" />
        </Dropdown.Link>
      </Dropdown.Content>
    </Dropdown>);};

export default ProjectDropdown;
