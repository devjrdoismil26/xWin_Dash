/**
 * Página principal do módulo AI
 * Entry point para o dashboard principal
 */
import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import AIDashboard from '../components/AIDashboard';

interface AIIndexPageProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
  variant?: 'basic' | 'advanced' | 'revolutionary';
}

const AIIndexPage: React.FC<AIIndexPageProps> = ({ auth, variant = 'basic' }) => {
  return (
    <PageTransition type="fade" duration={500}>
      <AuthenticatedLayout user={auth?.user}>
        <Head title="AI Dashboard - xWin Dash" />
        <PageLayout>
          <AIDashboard variant={variant} />
        </PageLayout>
      </AuthenticatedLayout>
    </PageTransition>
  );
};

export default AIIndexPage;
