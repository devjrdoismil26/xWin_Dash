/**
 * Página de Analytics - Alternativa
 *
 * @description
 * Página alternativa de analytics exibindo KPIs principais.
 * Usa layout autenticado e exibe métricas principais em formato de KPIs.
 *
 * @module modules/Analytics/pages/Index
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import KPIsDisplay from '@/modules/Analytics/components/KPIsDisplay';

/**
 * Props do componente AnalyticsPage
 *
 * @interface AnalyticsPageProps
 * @property {any} [metrics] - Dados de métricas (opcional)
 */
interface AnalyticsPageProps {
  metrics?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AnalyticsPage
 *
 * @description
 * Renderiza página de analytics com layout autenticado e KPIs principais.
 * Exibe métricas principais usando componente KPIsDisplay.
 *
 * @param {AnalyticsPageProps} props - Props do componente
 * @returns {JSX.Element} Página de analytics
 */
const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ metrics = {} as any }) => (
  <AuthenticatedLayout />
    <Head title="Relatórios e Analytics" / />
    <PageLayout title="Relatórios e Analytics" />
      <KPIsDisplay metrics={metrics} / /></PageLayout></AuthenticatedLayout>);

export default AnalyticsPage;
