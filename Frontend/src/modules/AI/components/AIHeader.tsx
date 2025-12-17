/**
 * Cabeçalho do módulo AI
 * @module modules/AI/components/AIHeader
 * @description
 * Componente reutilizável de cabeçalho para diferentes páginas do módulo AI,
 * fornecendo título, subtítulo, estatísticas, badges de status de provedores,
 * botões de ações (configurações, ajuda, perfil) e suporte a múltiplas variantes
 * (basic, advanced, revolutionary).
 * @since 1.0.0
 */
import React from 'react';
import { Brain, Settings, HelpCircle, User } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { useAI } from '../hooks';

interface AIHeaderProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  variant?: 'basic' | 'advanced' | 'revolutionary';
  onSettings???: (e: any) => void;
  onHelp???: (e: any) => void;
  onProfile???: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const AIHeader: React.FC<AIHeaderProps> = ({ title = 'AI Dashboard',
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
    } ;

  return (
        <>
      <div className={`ai-header ${className} `}>
      </div>{/* Main Header */}
      <div className={`${getVariantStyles()} text-white p-6 rounded-lg mb-6`}>
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Brain className="w-8 h-8" /></div><div>
           
        </div><h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-white/80">{subtitle}</p></div><div className="{showStats && (">$2</div>
              <div className=" ">$2</div><div className=" ">$2</div><div className="text-lg font-semibold">{stats.totalGenerations}</div>
                  <div className="text-xs">Gerações</div>
                <div className=" ">$2</div><div className="text-lg font-semibold">{availableProviders.length}</div>
                  <div className="text-xs">Provedores</div>
    </div>
  )}
            
            <div className="{onSettings && (">$2</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={ onSettings }
                  className="text-white border-white/20 hover:bg-white/10" />
                  <Settings className="w-4 h-4" />
                </Button>
              )}
              
              {onHelp && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={ onHelp }
                  className="text-white border-white/20 hover:bg-white/10" />
                  <HelpCircle className="w-4 h-4" />
                </Button>
              )}
              
              {onProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={ onProfile }
                  className="text-white border-white/20 hover:bg-white/10" />
                  <User className="w-4 h-4" />
                </Button>
              )}
            </div>
        </div>

      {/* Status Bar */}
      {showStats && (
        <div className=" ">$2</div><div className=" ">$2</div><Badge variant="success" />
              {availableProviders.length} Provedores Ativos
            </Badge>
            <Badge variant="outline" />
              {stats.totalGenerations} Gerações Totais
            </Badge>
            <Badge variant="outline" />
              R$ {stats.totalCost.toFixed(2)} Gasto Total
            </Badge></div><div className="Última atualização: {new Date().toLocaleTimeString('pt-BR')}">$2</div>
    </div>
  )}
    </div>);};

export default AIHeader;
