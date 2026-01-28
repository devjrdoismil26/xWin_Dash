/**
 * Cabeçalho do módulo AI
 * Componente reutilizável para diferentes páginas
 */
import React from 'react';
import { Brain, Settings, HelpCircle, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAI } from '../hooks';

interface AIHeaderProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  variant?: 'basic' | 'advanced' | 'revolutionary';
  onSettings?: () => void;
  onHelp?: () => void;
  onProfile?: () => void;
  className?: string;
}

const AIHeader: React.FC<AIHeaderProps> = ({
  title = 'AI Dashboard',
  subtitle = 'Gerencie suas gerações de IA',
  showStats = true,
  variant = 'basic',
  onSettings,
  onHelp,
  onProfile,
  className = ''
}) => {
  const { providers, generation } = useAI();
  const availableProviders = providers.getAvailableProviders();
  const stats = generation.getStats();

  const getVariantStyles = () => {
    switch (variant) {
      case 'advanced':
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'revolutionary':
        return 'bg-gradient-to-r from-purple-500 to-pink-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  return (
    <div className={`ai-header ${className}`}>
      {/* Main Header */}
      <div className={`${getVariantStyles()} text-white p-6 rounded-lg mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-white/80">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showStats && (
              <div className="flex items-center gap-4 text-white/80">
                <div className="text-center">
                  <div className="text-lg font-semibold">{stats.totalGenerations}</div>
                  <div className="text-xs">Gerações</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{availableProviders.length}</div>
                  <div className="text-xs">Provedores</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {onSettings && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSettings}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              
              {onHelp && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onHelp}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              )}
              
              {onProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onProfile}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <User className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {showStats && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Badge variant="success">
              {availableProviders.length} Provedores Ativos
            </Badge>
            <Badge variant="outline">
              {stats.totalGenerations} Gerações Totais
            </Badge>
            <Badge variant="outline">
              R$ {stats.totalCost.toFixed(2)} Gasto Total
            </Badge>
          </div>
          
          <div className="text-sm text-gray-500">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHeader;
