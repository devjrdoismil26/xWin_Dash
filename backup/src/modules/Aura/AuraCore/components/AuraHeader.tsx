/**
 * Cabeçalho do dashboard do AuraCore
 * Informações principais e controles
 */
import React from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, Settings, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuraHeaderProps {
  totalConnections?: number;
  totalFlows?: number;
  totalChats?: number;
  loading?: boolean;
  onRefresh?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export const AuraHeader: React.FC<AuraHeaderProps> = ({
  totalConnections = 0,
  totalFlows = 0,
  totalChats = 0,
  loading = false,
  onRefresh,
  onSettingsClick,
  className
}) => {
  return (
    <Card className={cn("aura-header", className)}>
      <Card.Content className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Aura Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema de automação e chat inteligente
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Estatísticas rápidas */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalConnections}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Conexões
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalFlows}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Fluxos Ativos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalChats}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Mensagens
                </div>
              </div>
            </div>

            {/* Status do sistema */}
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <Badge variant="success" className="text-xs">
                Sistema Operacional
              </Badge>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                <span>Atualizar</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onSettingsClick}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Tempo real ativo</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              v2.0.0
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
