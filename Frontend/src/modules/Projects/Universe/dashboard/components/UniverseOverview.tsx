import React from 'react';
import { motion } from 'framer-motion';
import { ENHANCED_TRANSITIONS } from '@/components/ui/design-tokens';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface UniverseOverviewProps {
  onNavigate: (path: string) => void;
}

const UniverseOverview: React.FC<UniverseOverviewProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Projetos Ativos', value: '12', change: '+2', trend: 'up' },
    { label: 'Tarefas Completas', value: '89%', change: '+5%', trend: 'up' },
    { label: 'Orçamento Utilizado', value: '67%', change: '-3%', trend: 'down' },
    { label: 'Equipe Ativa', value: '24', change: '+1', trend: 'up' }
  ];

  const recentProjects = [
    { id: 1, name: 'Projeto Alpha', status: 'Em Progresso', progress: 75 },
    { id: 2, name: 'Projeto Beta', status: 'Revisão', progress: 90 },
    { id: 3, name: 'Projeto Gamma', status: 'Planejamento', progress: 25 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={ENHANCED_TRANSITIONS.smooth}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ENHANCED_TRANSITIONS.smooth, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={stat.trend === 'up' ? 'success' : 'warning'}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <Card>
        <Card.Header>
          <Card.Title>Projetos Recentes</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={ENHANCED_TRANSITIONS.smooth}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.progress}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate(`/projects/${project.id}`)}
                  >
                    Ver
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Ações Rápidas</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => onNavigate('/projects/create')}
            >
              <span className="text-2xl">🚀</span>
              <span>Novo Projeto</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => onNavigate('/projects/templates')}
            >
              <span className="text-2xl">📋</span>
              <span>Templates</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => onNavigate('/projects/analytics')}
            >
              <span className="text-2xl">📊</span>
              <span>Relatórios</span>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default UniverseOverview;