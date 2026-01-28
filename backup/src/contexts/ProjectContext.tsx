import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
  mode: 'normal' | 'universe';
  modules: string[];
  lastActivity: string;
  statistics: {
    leads: number;
    workflows: number;
    campaigns: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  projectMode: 'normal' | 'universe' | null;
  setProjectMode: (mode: 'normal' | 'universe' | null) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshProjects: () => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectMode, setProjectMode] = useState<'normal' | 'universe' | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar projeto ativo do localStorage
  useEffect(() => {
    const savedProject = localStorage.getItem('activeProject');
    const savedMode = localStorage.getItem('projectMode');
    
    if (savedProject) {
      try {
        setActiveProject(JSON.parse(savedProject));
      } catch (error) {
        console.error('Error parsing saved project:', error);
        localStorage.removeItem('activeProject');
      }
    }
    
    if (savedMode && (savedMode === 'normal' || savedMode === 'universe')) {
      setProjectMode(savedMode);
    }
  }, []);

  // Salvar projeto ativo no localStorage
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem('activeProject', JSON.stringify(activeProject));
    } else {
      localStorage.removeItem('activeProject');
    }
  }, [activeProject]);

  // Salvar modo do projeto no localStorage
  useEffect(() => {
    if (projectMode) {
      localStorage.setItem('projectMode', projectMode);
    } else {
      localStorage.removeItem('projectMode');
    }
  }, [projectMode]);

  // Função para atualizar a lista de projetos
  const refreshProjects = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Em produção, isso seria uma chamada para a API
      // const response = await fetch('/api/projects');
      // const data = await response.json();
      // setProjects(data);
      
      // Mock data por enquanto
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'E-commerce Store',
          description: 'Loja online com automação completa',
          status: 'active',
          mode: 'universe',
          modules: ['leads', 'workflows', 'email', 'social'],
          lastActivity: '2024-01-15T10:30:00Z',
          statistics: {
            leads: 1250,
            workflows: 8,
            campaigns: 12,
            revenue: 45000
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'SaaS Platform',
          description: 'Plataforma SaaS com funil de conversão',
          status: 'active',
          mode: 'normal',
          modules: ['leads', 'email', 'analytics'],
          lastActivity: '2024-01-14T15:45:00Z',
          statistics: {
            leads: 890,
            workflows: 3,
            campaigns: 6,
            revenue: 28000
          },
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          name: 'Marketing Agency',
          description: 'Agência com múltiplos clientes',
          status: 'active',
          mode: 'universe',
          modules: ['leads', 'workflows', 'email', 'social', 'analytics'],
          lastActivity: '2024-01-13T09:20:00Z',
          statistics: {
            leads: 2100,
            workflows: 15,
            campaigns: 25,
            revenue: 75000
          },
          createdAt: '2023-12-20T00:00:00Z',
          updatedAt: '2024-01-13T09:20:00Z'
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error refreshing projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar um novo projeto
  const createProject = async (projectData: Partial<Project>): Promise<Project> => {
    setIsLoading(true);
    try {
      // Em produção, isso seria uma chamada para a API
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(projectData)
      // });
      // const newProject = await response.json();
      
      // Mock data por enquanto
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name || 'Novo Projeto',
        description: projectData.description || '',
        status: 'active',
        mode: projectData.mode || 'normal',
        modules: projectData.mode === 'universe' 
          ? ['leads', 'workflows', 'email', 'social', 'analytics']
          : ['leads', 'email'],
        lastActivity: new Date().toISOString(),
        statistics: {
          leads: 0,
          workflows: 0,
          campaigns: 0,
          revenue: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar um projeto
  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
    setIsLoading(true);
    try {
      // Em produção, isso seria uma chamada para a API
      // const response = await fetch(`/api/projects/${projectId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      ));
      
      // Se o projeto ativo foi atualizado, atualizar também
      if (activeProject?.id === projectId) {
        setActiveProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deletar um projeto
  const deleteProject = async (projectId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Em produção, isso seria uma chamada para a API
      // const response = await fetch(`/api/projects/${projectId}`, {
      //   method: 'DELETE'
      // });
      
      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      // Se o projeto ativo foi deletado, limpar
      if (activeProject?.id === projectId) {
        setActiveProject(null);
        setProjectMode(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: ProjectContextType = {
    activeProject,
    setActiveProject,
    projectMode,
    setProjectMode,
    projects,
    setProjects,
    isLoading,
    setIsLoading,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// Hook para usar o contexto
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

// Hook para verificar se há um projeto ativo
export const useActiveProject = (): Project | null => {
  const { activeProject } = useProject();
  return activeProject;
};

// Hook para verificar o modo do projeto
export const useProjectMode = (): 'normal' | 'universe' | null => {
  const { projectMode } = useProject();
  return projectMode;
};

// Hook para navegar para um projeto
export const useProjectNavigation = () => {
  const { setActiveProject, setProjectMode } = useProject();

  const navigateToProject = (project: Project) => {
    setActiveProject(project);
    setProjectMode(project.mode);
    
    // Navegar para a página apropriada
    if (project.mode === 'universe') {
      window.location.href = `/universe/${project.id}`;
    } else {
      window.location.href = `/dashboard/${project.id}`;
    }
  };

  const navigateToUniverse = () => {
    setActiveProject(null);
    setProjectMode('universe');
    window.location.href = '/universe';
  };

  const navigateToPortal = () => {
    setActiveProject(null);
    setProjectMode(null);
    window.location.href = '/portal';
  };

  return {
    navigateToProject,
    navigateToUniverse,
    navigateToPortal
  };
};
