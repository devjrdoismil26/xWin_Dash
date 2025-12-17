/**
 * Página Principal do Módulo AI
 *
 * @description
 * Página principal do módulo AI com dashboard de inteligência artificial.
 * Entry point para o dashboard principal com variantes: basic, advanced ou revolutionary.
 *
 * @module modules/AI/pages/AIIndexPage
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import AIDashboard from '../components/AIDashboard';

/**
 * Props do componente AIIndexPage
 *
 * @interface AIIndexPageProps
 * @property {Object} [auth] - Dados de autenticação (opcional)
 * @property {string} [variant] - Variante do dashboard: 'basic' | 'advanced' | 'revolutionary' (opcional, padrão: 'basic')
 */
interface AIIndexPageProps {
  auth?: { user?: { id: string;
  name: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };};

  variant?: 'basic' | 'advanced' | 'revolutionary';
}

/**
 * Componente AIIndexPage
 *
 * @description
 * Renderiza página principal de AI com dashboard completo.
 * Exibe dashboard de inteligência artificial com transições e layout autenticado.
 *
 * @param {AIIndexPageProps} props - Props do componente
 * @returns {JSX.Element} Página principal de AI
 */
const AIIndexPage: React.FC<AIIndexPageProps> = ({ auth, variant = 'basic'    }) => { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <AuthenticatedLayout user={ auth?.user } />
        <Head title="AI Dashboard - xWin Dash" / />
        <PageLayout />
          <AIDashboard variant={variant} / /></PageLayout></AuthenticatedLayout>
    </PageTransition>);};

export default AIIndexPage;
