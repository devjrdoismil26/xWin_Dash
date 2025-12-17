/**
 * Página de Agendamento de Relatórios de Analytics
 *
 * @description
 * Página para agendar geração e envio de relatórios de analytics.
 * Permite criar, editar e gerenciar agendamentos de relatórios.
 *
 * @module modules/Analytics/pages/AnalyticsScheduler
 * @since 1.0.0
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';

/**
 * Componente AnalyticsScheduler
 *
 * @description
 * Renderiza página de agendamento de relatórios de analytics.
 * Interface simplificada em construção.
 *
 * @returns {JSX.Element} Página de agendamento de relatórios
 */
const AnalyticsScheduler: React.FC = () => (
  <AuthenticatedLayout />
    <Head title="Agendador de Relatórios" / />
    <PageLayout title="Agendar Relatórios" />
      <Card />
        <Card.Content className="p-6">Em breve</Card.Content></Card></PageLayout>
  </AuthenticatedLayout>);

export default AnalyticsScheduler;
