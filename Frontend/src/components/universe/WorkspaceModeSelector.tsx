import React, { useCallback, useMemo, useState } from 'react';
import { Brain, Wrench, Zap, Target, Sparkles, ArrowRight, Info } from 'lucide-react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type ModeId = 'manual' | 'universe';

interface WorkspaceModeProps {
  onModeSelect?: (mode: ModeId) => void;
}

const WorkspaceModeSelector: React.FC<WorkspaceModeProps> = ({ onModeSelect }) => {
  const [selectedMode, setSelectedMode] = useState<ModeId>('manual');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeSelection = useCallback(
    async (mode: ModeId) => {
      setSelectedMode(mode);
      setIsTransitioning(true);
      try {
        if (mode === 'universe') {
          toast.success('Iniciando XWIN Universe com IA...');
          router.visit(route('universe.dashboard'));
        } else {
          toast.success('Modo manual ativado');
          onModeSelect?.(mode);
        }
      } catch (_error) {
        toast.error('Erro ao ativar modo selecionado');
      } finally {
        setIsTransitioning(false);
      }
    },
    [onModeSelect],
  );

  const modes = useMemo(
    () => [
      {
        id: 'manual' as const,
        title: 'Modo Manual',
        subtitle: 'Controle total sobre cada módulo',
        description: 'Configure e gerencie cada funcionalidade individualmente com máximo controle.',
        gradient: 'from-slate-500 to-slate-700',
        features: ['Configuração manual de módulos', 'Controle granular de cada feature', 'Workflow tradicional'],
        pros: ['Controle total', 'Configuração detalhada'],
        recommended: 'Para usuários experientes',
        icon: Wrench,
      },
      {
        id: 'universe' as const,
        title: 'XWIN Universe',
        subtitle: 'Inteligência Artificial Avançada',
        description: 'Deixe a IA criar, otimizar e gerenciar seu workspace automaticamente.',
        gradient: 'from-purple-500 via-blue-500 to-cyan-500',
        features: ['IA cria configurações otimizadas', 'Auto-personalização baseada no uso', 'Otimização automática de workflows'],
        pros: ['Configuração instantânea', 'Otimização automática'],
        recommended: 'Recomendado para máxima produtividade',
        isNew: true,
        isPowerful: true,
        icon: Sparkles,
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Escolha seu modo de trabalho</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selecione entre configuração manual ou deixe a nossa IA otimizar tudo para você.
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-sm">
              Experimente o Universe para produtividade máxima
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            const isUniverse = mode.id === 'universe';
            return (
              <div
                key={mode.id}
                className={`relative border rounded-xl p-6 transition-all ${
                  isSelected ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-lg'
                } ${isUniverse ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' : ''}`}
                onClick={() => handleModeSelection(mode.id)}
              >
                {mode.isNew && (
                  <div className="absolute -top-3 -right-3">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" /> Novo
                    </Badge>
                  </div>
                )}
                {mode.isPowerful && (
                  <div className="absolute -top-3 -left-3">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Zap className="w-3 h-3 mr-1" /> Potente
                    </Badge>
                  </div>
                )}
                <Card className="bg-transparent border-none shadow-none" hover={false}>
                  <div className="text-center pb-6">
                    <Icon className="w-10 h-10 text-blue-600" />
                    <h2 className="text-2xl font-bold mb-2">{mode.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{mode.subtitle}</p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 text-center">{mode.description}</p>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Recursos
                      </h4>
                      <ul className="space-y-2">
                        {mode.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <h5 className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">Prós</h5>
                        <div className="flex flex-wrap gap-1">
                          {mode.pros.map((pro, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                              {pro}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-800 dark:text-blue-300 text-sm font-medium">{mode.recommended}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Button
                      className={`w-full font-semibold transition-all duration-200 ${
                        isUniverse
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                          : 'bg-slate-600 hover:bg-slate-700 text-white'
                      }`}
                      disabled={isTransitioning}
                    >
                      {isTransitioning && isSelected ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Iniciando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isUniverse ? 'Ativar IA Universe' : 'Usar Modo Manual'} <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 justify-center mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Por que usar o Universe?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              O Universe utiliza IA para configurar e otimizar automaticamente seu workspace.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>✨ Configuração automática</span>
              <span>🚀 Otimização contínua</span>
              <span>🧠 Aprendizado inteligente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceModeSelector;
