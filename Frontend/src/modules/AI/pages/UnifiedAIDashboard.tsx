/**
 * P?gina UnifiedAIDashboard - Dashboard Unificado de IA
 * @module modules/AI/pages/UnifiedAIDashboard
 * @description
 * P?gina de dashboard unificado do m?dulo AI, integrando EnhancedAnalyticsDashboard
 * para fornecer vis?o geral completa de analytics e m?tricas de IA. Integra com
 * AuthenticatedLayout e PageLayout para fornecer estrutura consistente de p?gina.
 * @since 1.0.0
 */
import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import EnhancedAnalyticsDashboard from '@/modules/AI/components/EnhancedAnalyticsDashboard';

/**
 * Interface UnifiedAIDashboardProps - Props da p?gina UnifiedAIDashboard
 * @interface UnifiedAIDashboardProps
 * @property {object} [auth] - Objeto de autentica??o (opcional)
 * @property {object} [auth.user] - Dados do usu?rio autenticado (opcional)
 * @property {string} [auth.user.id] - ID do usu?rio
 * @property {string} [auth.user.name] - Nome do usu?rio
 * @property {string} [auth.user.email] - Email do usu?rio
 * @property {Record<string, any>} [data] - Dados adicionais para o dashboard (opcional)
 */
interface UnifiedAIDashboardProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

  data?: Record<string, any>;
}

/**
 * Componente UnifiedAIDashboard - P?gina de Dashboard Unificado de IA
 * @component
 * @description
 * Componente que renderiza p?gina de dashboard unificado do m?dulo AI,
 * exibindo analytics avan?ados e m?tricas de IA.
 * 
 * @param {UnifiedAIDashboardProps} props - Props da p?gina
 * @returns {JSX.Element} P?gina de dashboard unificado
 * 
 * @example
 * ```tsx
 * <UnifiedAIDashboard 
 *   auth={ user: { id: '1', name: 'John', email: 'john@example.com' } }
 *   data={ analytics: {...} }
 * / />
 * ```
 */
const UnifiedAIDashboard: React.FC<UnifiedAIDashboardProps> = ({ auth, data    }) => { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Dashboard Unificado de IA" / />
      <PageLayout title="Dashboard de IA" />
        <EnhancedAnalyticsDashboard data={data} / /></PageLayout></AuthenticatedLayout>);};

export default UnifiedAIDashboard;
