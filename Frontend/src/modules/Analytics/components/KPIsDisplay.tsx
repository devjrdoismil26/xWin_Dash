/**
 * Componente KPIsDisplay - Exibição de KPIs
 * @module modules/Analytics/components/KPIsDisplay
 * @description
 * Componente para exibir KPIs (Key Performance Indicators) em grid responsivo,
 * incluindo leads, conversões, custo e CTR.
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';

/**
 * Interface KPIProps - Props do componente KPI
 * @interface KPIProps
 * @description
 * Interface que define as props do componente KPI.
 * @property {string} title - Título do KPI
 * @property {string | number} value - Valor do KPI
 * @property {string} [subtitle] - Subtítulo do KPI (opcional)
 */
interface KPIProps {
  title: string;
  value: string | number;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente KPI - KPI Individual
 * @component
 * @description
 * Componente para exibir um KPI individual em card.
 *
 * @param {KPIProps} props - Props do componente
 * @returns {JSX.Element} Card de KPI
 */
const KPI: React.FC<KPIProps> = ({ title, value, subtitle    }) => (
  <Card />
    <Card.Content className="p-4" />
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </Card.Content>
  </Card>);

/**
 * Interface KPIsDisplayProps - Props do componente KPIsDisplay
 * @interface KPIsDisplayProps
 * @description
 * Interface que define as props do componente KPIsDisplay.
 * @property {object} [metrics={}] - Métricas a exibir (opcional)
 * @property {number} [metrics.leads] - Número de leads (opcional)
 * @property {number} [metrics.conversions] - Número de conversões (opcional)
 * @property {number} [metrics.cost] - Custo (opcional)
 * @property {number} [metrics.ctr] - CTR (Click-Through Rate) em porcentagem (opcional)
 */
interface KPIsDisplayProps {
  metrics?: {
leads?: number;
  conversions?: number;
  cost?: number;
  ctr?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; };

}

/**
 * Componente KPIsDisplay - Exibição de KPIs
 * @component
 * @description
 * Componente para exibir KPIs (Key Performance Indicators) de analytics
 * em grid responsivo, incluindo leads, conversões, custo e CTR.
 *
 * @param {KPIsDisplayProps} props - Props do componente
 * @returns {JSX.Element} Grid de KPIs
 *
 * @example
 * ```tsx
 * <KPIsDisplay metrics={ leads: 1000, conversions: 50, cost: 5000, ctr: 5 } / />
 * ```
 */
const KPIsDisplay: React.FC<KPIsDisplayProps> = ({ metrics = {} as any }) => (
  <div className=" ">$2</div><KPI title="Leads" value={(metrics.leads || 0).toLocaleString('pt-BR')} / />
    <KPI title="Conversões" value={(metrics.conversions || 0).toLocaleString('pt-BR')} / />
    <KPI title="Custo" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.cost || 0)} / />
    <KPI title="CTR" value={`${metrics.ctr || 0}%`} / />
  </div>);

export default KPIsDisplay;
