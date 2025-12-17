/**
 * Página Principal do Módulo Analytics
 *
 * @description
 * Página principal do módulo Analytics com dashboard de visão geral dos dados.
 * Exibe dashboard completo com métricas, gráficos e insights de analytics.
 *
 * @module modules/Analytics/pages/AnalyticsIndexPage
 * @since 1.0.0
 */

import React from 'react';
import { AnalyticsDashboard } from '../components';
import { cn } from '@/lib/utils';

/**
 * Props do componente AnalyticsIndexPage
 *
 * @interface AnalyticsIndexPageProps
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface AnalyticsIndexPageProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AnalyticsIndexPage
 *
 * @description
 * Renderiza página principal de analytics com dashboard completo.
 * Exibe visão geral dos dados com métricas, gráficos e insights.
 *
 * @param {AnalyticsIndexPageProps} props - Props do componente
 * @returns {JSX.Element} Página principal de analytics
 */
export const AnalyticsIndexPage: React.FC<AnalyticsIndexPageProps> = ({ className    }) => { return (
        <>
      <div className={cn("analytics-index-page", className)  }>
      </div><AnalyticsDashboard / />
    </div>);};
