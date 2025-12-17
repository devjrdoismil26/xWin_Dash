/**
 * P?gina UsageDashboard - Dashboard de Uso de IA
 * @module modules/AI/pages/UsageDashboard
 * @description
 * P?gina de dashboard de uso de IA, exibindo m?tricas de uso atrav?s do componente
 * AIDashboard. Integra com PageLayout para fornecer estrutura consistente de p?gina.
 * @since 1.0.0
 */
import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import AIDashboard from '@/modules/AI/components/AIDashboard';

/**
 * Interface UsageDashboardProps - Props da p?gina UsageDashboard
 * @interface UsageDashboardProps
 * @property {Record<string, any>} [metrics={}] - M?tricas de uso de IA (opcional, padr?o: {})
 */
interface UsageDashboardProps {
  metrics?: Record<string, any>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente UsageDashboard - P?gina de Dashboard de Uso de IA
 * @component
 * @description
 * Componente que renderiza a p?gina de dashboard de uso de IA, exibindo
 * m?tricas de uso atrav?s do componente AIDashboard.
 * 
 * @param {UsageDashboardProps} props - Props da p?gina
 * @returns {JSX.Element} P?gina de dashboard de uso
 * 
 * @example
 * ```tsx
 * <UsageDashboard metrics={ totalGenerations: 100, totalCost: 50.00 } / />
 * ```
 */
const UsageDashboard: React.FC<UsageDashboardProps> = ({ metrics = {} as any }) => (
  <PageLayout title="Uso de IA" />
    <AIDashboard metrics={metrics} / />
  </PageLayout>);

export default UsageDashboard;
