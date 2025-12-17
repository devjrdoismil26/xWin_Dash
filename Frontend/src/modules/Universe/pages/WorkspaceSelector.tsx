/**
 * Página de Seletor de Workspace do Universe - Projects
 *
 * @description
 * Página para seleção de workspace do Universe entre diferentes tipos disponíveis.
 * Permite escolher entre canvas visual, kanban, dashboard, AI lab e custom workspaces.
 *
 * @module modules/Projects/Universe/pages/WorkspaceSelector
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

/**
 * Props do componente WorkspaceSelector
 *
 * @interface WorkspaceSelectorProps
 * @property {any} [auth] - Dados de autenticação (opcional)
 */
interface WorkspaceSelectorProps {
  auth?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface Workspace {
  id: string;
  name: string;
  description: string;
  type: 'canvas' | 'kanban' | 'dashboard' | 'ai-lab' | 'custom';
  icon: string;
  color: string;
  isActive: boolean;
  lastUsed: string; }

/**
 * Componente WorkspaceSelector
 *
 * @description
 * Renderiza página de seletor de workspace do Universe.
 * Permite escolher e navegar entre diferentes tipos de workspace disponíveis.
 *
 * @param {WorkspaceSelectorProps} props - Props do componente
 * @returns {JSX.Element} Página de seletor de workspace
 */
const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ auth    }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  const workspaces: Workspace[] = [
    {
      id: 'canvas',
      name: 'Canvas Visual',
      description: 'Interface drag and drop para criar fluxos visuais',
      type: 'canvas',
      icon: '🎨',
      color: 'bg-blue-500',
      isActive: true,
      lastUsed: '2 minutos atrás'
    },
    {
      id: 'kanban',
      name: 'Kanban Board',
      description: 'Gerenciamento de tarefas e projetos',
      type: 'kanban',
      icon: '📋',
      color: 'bg-green-500',
      isActive: true,
      lastUsed: '15 minutos atrás'
    },
    {
      id: 'dashboard',
      name: 'Dashboard Analytics',
      description: 'Métricas e analytics em tempo real',
      type: 'dashboard',
      icon: '📊',
      color: 'bg-purple-500',
      isActive: true,
      lastUsed: '1 hora atrás'
    },
    {
      id: 'ai-lab',
      name: 'AI Laboratory',
      description: 'Laboratório de inteligência artificial',
      type: 'ai-lab',
      icon: '🤖',
      color: 'bg-red-500',
      isActive: false,
      lastUsed: '2 dias atrás'
    },
    {
      id: 'custom',
      name: 'Workspace Personalizado',
      description: 'Configure seu ambiente de trabalho',
      type: 'custom',
      icon: '⚙️',
      color: 'bg-gray-500',
      isActive: false,
      lastUsed: 'Nunca usado'
    }
  ];

  const getWorkspaceUrl = (workspaceId: string) => {
    const urlMap: { [key: string]: string } = {
      'canvas': '/projects/universe/canvas',
      'kanban': '/projects/universe/kanban',
      'dashboard': '/projects/universe/dashboard',
      'ai-lab': '/projects/universe/interface',
      'custom': '/projects/universe/workspace'};

    return urlMap[workspaceId] || '/projects/universe/workspace';};

  return (
            <div className=" ">$2</div><Head title="Seletor de Workspace - Universe" / />
      <div className="{/* Header */}">$2</div>
        <div className=" ">$2</div><h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" />
            🚀 Seletor de Workspace Universe
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400" />
            Escolha o ambiente de trabalho ideal para seu projeto
          </p>
        </div>

        {/* Workspaces Grid */}
        <div className="{(workspaces || []).map((workspace: unknown) => (">$2</div>
            <div
              key={ workspace.id }
              onClick={ () => setSelectedWorkspace(workspace.id) }
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedWorkspace === workspace.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              } `}
  >
              <div className=" ">$2</div><div className="text-4xl mb-3">{workspace.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" />
                  {workspace.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3" />
                  {workspace.description}
                </p>
                
                <div className=" ">$2</div><span className={`px-2 py-1 rounded-full ${
                    workspace.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                  } `}>
           
        </span>{workspace.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="{workspace.lastUsed}">$2</span>
                  </span></div></div>
          ))}
        </div>

        {/* Actions */}
        <div className=" ">$2</div><div className="{selectedWorkspace ? (">$2</div>
              <>
                <Link
                  href={ getWorkspaceUrl(selectedWorkspace) }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors text-center" />
                  🚀 Abrir Workspace
                </Link>
                
                <Link
                  href="/projects/universe/interface"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors text-center" />
                  🎨 Interface Principal
                </Link>
                
                <Link
                  href="/projects/universe"
                  className="backdrop-blur-xl bg-white/10 border-white/200 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors text-center" />
                  ← Voltar
                </Link>
      </>
    </>
  ) : (
              <div className="Selecione um workspace para continuar">$2</div>
    </div>
  )}
          </div>

        {/* Quick Access */}
        <div className=" ">$2</div><h2 className="text-xl font-semibold mb-4 text-center" />
            ⚡ Acesso Rápido
          </h2>
          
          <div className=" ">$2</div><Link
              href="/projects/universe/interface"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors" />
              🎨 Interface
            </Link>
            
            <Link
              href="/projects/universe/dashboard"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors" />
              📊 Dashboard
            </Link>
            
            <Link
              href="/projects/universe/kanban"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors" />
              📋 Kanban
            </Link>
            
            <Link
              href="/projects/universe/marketplace"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors" />
              🛒 Marketplace
            </Link></div></div>);};

export default WorkspaceSelector;
