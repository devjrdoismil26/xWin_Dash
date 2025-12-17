import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge'
import { Input } from '@/shared/components/ui/Input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/Dialog';
import { Label } from '@/shared/components/ui/Label';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { Plus, Search, FolderOpen, Zap, Users, Calendar, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: number;
  name: string;
  description: string;
  slug?: string;
  logo?: string;
  website?: string;
  industry?: string;
  timezone?: string;
  currency?: string;
  settings?: string;
  modules?: string[];
  is_active: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
  // Computed properties
  mode: 'normal' | 'universe';
  status: 'active' | 'inactive' | 'archived';
  members_count: number; }

interface ProjectSelectorProps {
  auth: unknown;
  projects?: Project[];
  currentProject?: Project;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ auth, 
  projects = [] as unknown[], 
  currentProject 
   }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Estados para criação de projeto
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    mode: 'normal' as 'normal' | 'universe',
    modules: [] as string[]
  });

  // Processar projetos para adicionar propriedades computadas
  const processedProjects = (projects || []).map(project => ({
    ...project,
    mode: project.modules?.includes('universe') ? 'universe' : 'normal',
    status: project.is_active ? 'active' : 'inactive',
    members_count: 1 // Por enquanto, só o owner
  }));

  // Filtrar projetos baseado na busca
  const filteredProjects = (processedProjects || []).filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())));

  // Função para selecionar projeto
  const selectProject = (project: Project) => {
    setLoading(true);

    router.post('/projects/select', { project_id: project.id }, {
      onSuccess: () => {
        router.visit('/dashboard');

      },
      onError: (errors: unknown) => {
        setError('Erro ao selecionar projeto');

        setLoading(false);

      } );};

  // Função para criar projeto
  const createProject = () => {
    if (!newProject.name.trim()) {
      setError('Nome do projeto é obrigatório');

      return;
    }

    setLoading(true);

    router.post('/projects', newProject, {
      onSuccess: (page: unknown) => {
        setIsCreatingProject(false);

        setNewProject({ name: '', description: '', mode: 'normal', modules: [] });

        setLoading(false);

      },
      onError: (errors: unknown) => {
        setError('Erro ao criar projeto');

        setLoading(false);

      } );};

  // Função para entrar no Modo Universe
  const enterUniverseMode = () => {
    router.visit('/projects/universe');};

  return (
        <>
      <PageTransition type="fade" duration={ 300 } />
      <AppLayout auth={ auth } />
        <Head title="Selecionar Projeto - xWin Dash" / />
        <div className="{/* Header */}">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-slate-900 dark:text-white" />
                    Meus Projetos
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2" />
                    Selecione um projeto para continuar ou crie um novo
                  </p></div><div className=" ">$2</div><Button
                    onClick={ enterUniverseMode }
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900" />
                    <Sparkles className="w-4 h-4 mr-2" />
                    Modo Universe
                  </Button>
                  
                  <Dialog open={isCreatingProject} onOpenChange={ setIsCreatingProject } />
                    <DialogTrigger asChild />
                      <Button className="bg-blue-600 hover:bg-blue-700" />
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Projeto
                      </Button></DialogTrigger><DialogContent className="sm:max-w-md" />
                      <DialogHeader />
                        <DialogTitle>Criar Novo Projeto</DialogTitle>
                        <DialogDescription />
                          Crie um novo projeto para organizar seu trabalho
                        </DialogDescription></DialogHeader><div className=" ">$2</div><div>
           
        </div><Label htmlFor="name">Nome do Projeto</Label>
                          <Input
                            id="name"
                            value={ newProject.name }
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, name: e.target.value })}
                            placeholder="Ex: Meu Projeto Incrível" /></div><div>
           
        </div><Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={ newProject.description }
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, description: e.target.value })}
                            placeholder="Descreva o objetivo do projeto..."
                            rows={ 3 } /></div><div>
           
        </div><Label htmlFor="mode">Modo do Projeto</Label>
                          <Select
                            value={ newProject.mode }
                            onValueChange={(value: 'normal' | 'universe') = />
                              setNewProject({ ...newProject, mode: value })
  }
  >
                            <SelectTrigger />
                              <SelectValue / /></SelectTrigger><SelectContent />
                              <SelectItem value="normal" />
                                <div className=" ">$2</div><FolderOpen className="w-4 h-4 mr-2" />
                                  Normal - Módulos tradicionais
                                </div></SelectItem><SelectItem value="universe" />
                                <div className=" ">$2</div><Sparkles className="w-4 h-4 mr-2" />
                                  Universe - Interface avançada
                                </div></SelectItem></SelectContent></Select></div>
                        
                        <div className=" ">$2</div><Button
                            variant="outline"
                            onClick={ () => setIsCreatingProject(false)  }>
                            Cancelar
                          </Button>
                          <Button
                            onClick={ createProject }
                            disabled={ loading }
                            className="bg-blue-600 hover:bg-blue-700" />
                            {loading ? <LoadingSpinner size="sm" /> : 'Criar Projeto'}
                          </Button></div></DialogContent></Dialog></div></div>

          {/* Content */}
          <div className="{/* Search */}">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={ searchTerm }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value) }
                  className="pl-10 bg-white dark:bg-slate-800" />
              </div>

            {/* Error State */}
            {error && (
              <div className=" ">$2</div><ErrorState
                  title="Erro"
                  message={ error }
                  onRetry={ () => setError(null) } />
              </div>
            )}

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className=" ">$2</div><div className="{searchTerm ? '🔍' : '📁'}">$2</div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" />
                  {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto criado'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6" />
                  {searchTerm 
                    ? 'Tente ajustar sua busca ou criar um novo projeto'
                    : 'Crie seu primeiro projeto para começar'
                  }
                </p>
                {!searchTerm && (
                  <Button
                    onClick={ () => setIsCreatingProject(true) }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                )}
              </div>
            ) : (
              <div className="{(filteredProjects || []).map((project: unknown) => (">$2</div>
                  <Card
                    key={ project.id }
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
                      currentProject?.id === project.id && "ring-2 ring-blue-500"
                    )} onClick={ () => selectProject(project)  }>
                    <Card.Header />
                      <div className=" ">$2</div><div className="{project.mode === 'universe' ? (">$2</div>
      <Sparkles className="w-5 h-5 text-purple-500" />
    </>
  ) : (
                            <FolderOpen className="w-5 h-5 text-blue-500" />
                          )}
                          <Card.Title className="text-lg">{project.name}</Card.Title></div><Badge
                          variant={ project.status === 'active' ? 'default' : 'secondary' }
                          className={cn(
                            project.mode === 'universe' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          ) } />
                          {project.mode === 'universe' ? 'Universe' : 'Normal'}
                        </Badge></div><Card.Description className="text-sm" />
                        {project.description || 'Sem descrição'}
                      </Card.Description>
                    </Card.Header>
                    
                    <Card.Content />
                      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-4 h-4 mr-1" />
                            {project.members_count} membros
                          </div>
                          <div className=" ">$2</div><Calendar className="w-4 h-4 mr-1" />
                            {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                          </div>
                        
                        {project.modules && project.modules.length > 0 && (
                          <div className="{project.modules.slice(0, 3).map((module: unknown) => (">$2</div>
                              <Badge key={module} variant="outline" className="text-xs" />
                                {module}
                              </Badge>
                            ))}
                            {project.modules.length > 3 && (
                              <Badge variant="outline" className="text-xs" />
                                +{project.modules.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className=" ">$2</div><Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" />
                            <Settings className="w-4 h-4 mr-1" />
                            Configurar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700" />
                            Abrir
                            <ArrowRight className="w-4 h-4 ml-1" /></Button></div>
                    </Card.Content>
      </Card>
    </>
  ))}
              </div>
            )}
          </div></AppLayout></PageTransition>);};

export default ProjectSelector;