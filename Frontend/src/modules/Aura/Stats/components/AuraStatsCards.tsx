/**
 * @module AuraStatsCards
 * @description Componente para exibir cards de estatísticas do Aura.
 * 
 * Este componente exibe uma grade de cards com estatísticas principais do Aura,
 * incluindo conversas ativas, total de mensagens, conexões, taxa de conversão,
 * fluxos ativos e mensagens da última semana. Cada card pode exibir mudanças
 * percentuais comparadas com o período anterior.
 * 
 * @example
 * ```tsx
 * <AuraStatsCards
 *   stats={
 *     conversations: 150,
 *     messages: 5000,
 *     connections: 3,
 *     activeChats: 25
 *   } *   refreshTrigger={ refreshCount }
 * / />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { EmptyStates } from '@/shared/components/ui/EmptyState';
import auraService from '@/services/auraService';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { notify } from '@/lib/utils';

/**
 * Interface para as propriedades do componente StatCard
 * 
 * @interface StatCardProps
 * @property {string} title - Título do card de estatística
 * @property {number | string} value - Valor da estatística a ser exibido
 * @property { value: number; type: 'increase' | 'decrease' } [change] - Mudança percentual comparada com período anterior
 * @property {string} [icon] - Ícone emoji a ser exibido no card
 * @property {'blue' | 'green' | 'red' | 'yellow' | 'purple'} [color] - Cor do tema do card (padrão: 'blue')
 * @property {boolean} [isLoading] - Se o card está em estado de carregamento
 */
interface StatCardProps {
  /** Título do card de estatística */
title: string;
  /** Valor da estatística a ser exibido */
value: number | string;
  /** Mudança percentual comparada com período anterior */
change?: {
/** Valor percentual da mudança */
/** Tipo de mudança (aumento ou diminuição) */
type: 'increase' | 'decrease';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  /** Ícone emoji a ser exibido no card */
  icon?: string;
  /** Cor do tema do card (padrão: 'blue') */
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  /** Se o card está em estado de carregamento */
  isLoading?: boolean;
}

/**
 * Componente de card individual para exibir uma estatística
 * 
 * Componente memoizado para otimização de performance.
 * 
 * @param {StatCardProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const StatCard: React.FC<StatCardProps> = React.memo(function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue',
  isLoading = false
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',};

  return (
        <>
      <Card />
      <Card.Content className="p-6" />
        <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="{isLoading ? (">$2</div>
      <LoadingSpinner size="sm" / />
    </>
  ) : (
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              )}
            </div>
            {change && !isLoading && (
              <div className={`flex items-center space-x-1 mt-1 text-sm ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              } `}>
           
        </div><span>{change.type === 'increase' ? '↑' : '↓'}</span>
                <span>{Math.abs(change.value)}%</span>
                <span className="text-gray-500">vs. anterior</span>
      </div>
    </>
  )}
          </div>
          {icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color]} `}>
           
        </div><span className="text-xl">{icon}</span>
      </div>
    </>
  )}
        </div>
      </Card.Content>
    </Card>);

});

interface Stats {
  conversations: number;
  messages: number;
  connections: number;
  activeChats: number;
  totalFlows: number;
  messagesLastWeek: number;
  conversionsRate: number; }
interface AuraStatsCardsProps {
  stats?: Partial<Stats>;
  refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }
const AuraStatsCards: React.FC<AuraStatsCardsProps> = ({ stats: initialStats,
  refreshTrigger
   }) => {
  const [stats, setStats] = useState<Stats>({
    conversations: 0,
    messages: 0,
    connections: 0,
    activeChats: 0,
    totalFlows: 0,
    messagesLastWeek: 0,
    conversionsRate: 0,
    ...initialStats
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    if (initialStats) return; // Use initial data if provided
    setIsLoading(true);

    setError(null);

    try {
      const response = await auraService.stats.getOverview();

      setStats({
        conversations: (response as any).data?.total_chats || 0,
        messages: (response as any).data?.total_messages || 0,
        connections: (response as any).data?.total_connections || 0,
        activeChats: (response as any).data?.active_chats || 0,
        totalFlows: (response as any).data?.total_flows || 0,
        messagesLastWeek: (response as any).data?.messages_last_week || 0,
        conversionsRate: (response as any).data?.conversion_rate || 0,
      });

    } catch (err) {
      const errorMessage = 'Erro ao carregar estatísticas. Dados podem estar desatualizados.';
      setError(errorMessage);

      notify?.warning('Aviso', errorMessage);

    } finally {
      setIsLoading(false);

    } ;

  useEffect(() => {
    loadStats();

  }, [refreshTrigger]);

  if (error && stats.conversations === 0) {
    return (
              <div className=" ">$2</div><Card className="md:col-span-4" />
          <Card.Content className="p-6" />
            <EmptyStates.Error 
              title="Erro ao carregar estatísticas"
              description={ error }
              action={
                label: 'Tentar Novamente',
                onClick: loadStats
              } / />
          </Card.Content></Card></div>);

  }
  return (
            <div className=" ">$2</div><StatCard
        title="Conversas Ativas"
        value={ stats.activeChats }
        icon="💬"
        color="blue"
        isLoading={ isLoading }
        change={ value: 12, type: 'increase' } / />
      <StatCard
        title="Total de Mensagens"
        value={ stats.messages.toLocaleString() }
        icon="📨"
        color="green"
        isLoading={ isLoading }
        change={ value: 8, type: 'increase' } / />
      <StatCard
        title="Conexões Ativas"
        value={ stats.connections }
        icon="🔌"
        color="purple"
        isLoading={ isLoading }
      / />
      <StatCard
        title="Taxa de Conversão"
        value={`${stats.conversionsRate.toFixed(1)}%`}
        icon="📈"
        color="yellow"
        isLoading={ isLoading }
        change={ value: 3, type: 'increase' } / />
      <StatCard
        title="Total de Conversas"
        value={ stats.conversations }
        icon="💭"
        color="blue"
        isLoading={ isLoading }
      / />
      <StatCard
        title="Fluxos Ativos"
        value={ stats.totalFlows }
        icon="🔄"
        color="green"
        isLoading={ isLoading }
      / />
      <StatCard
        title="Mensagens (7 dias)"
        value={ stats.messagesLastWeek.toLocaleString() }
        icon="📊"
        color="purple"
        isLoading={ isLoading }
        change={ value: 15, type: 'increase' } / />
      <StatCard
        title="Tempo Médio Resposta"
        value="2.3min"
        icon="⏱️"
        color="red"
        isLoading={ isLoading }
        change={ value: 5, type: 'decrease' } / />
    </div>);};

export default AuraStatsCards;
