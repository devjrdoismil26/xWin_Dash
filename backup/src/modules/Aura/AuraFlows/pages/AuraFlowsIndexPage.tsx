/**
 * Página principal do módulo AuraFlows
 * Sistema de fluxos de automação
 */
import React from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Play, Pause, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuraFlowsIndexPageProps {
  className?: string;
}

export const AuraFlowsIndexPage: React.FC<AuraFlowsIndexPageProps> = ({ className }) => {
  return (
    <div className={cn("aura-flows-index-page space-y-6", className)}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fluxos de Automação
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gerencie seus fluxos de automação e chatbots
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Fluxo
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Fluxos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  12
                </p>
              </div>
              <Badge variant="secondary">Ativos</Badge>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Execuções Hoje
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,234
                </p>
              </div>
              <Badge variant="success">+12%</Badge>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Sucesso
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  98.5%
                </p>
              </div>
              <Badge variant="success">Excelente</Badge>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tempo Médio
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  2.3s
                </p>
              </div>
              <Badge variant="warning">Otimizar</Badge>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Lista de Fluxos */}
      <Card>
        <Card.Header>
          <Card.Title>Fluxos Recentes</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Fluxo de Boas-vindas {item}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ativado há 2 horas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Ativo</Badge>
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
