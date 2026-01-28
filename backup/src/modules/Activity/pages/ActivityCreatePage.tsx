/**
 * Página de criação do módulo Activity
 * Interface para criar novas atividades (se aplicável)
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Activity } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

interface ActivityCreatePageProps {
  className?: string;
  auth?: any;
}

export const ActivityCreatePage: React.FC<ActivityCreatePageProps> = ({ 
  className,
  auth 
}) => {
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Criar Atividade - xWin Dash" />
      <PageLayout>
        <div className={`space-y-6 ${className || ''}`}>
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Criar Atividade
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Crie uma nova atividade no sistema
              </p>
            </div>
          </div>

          {/* Content */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="p-6">
              <EmptyState
                icon={Activity}
                title="Funcionalidade em Desenvolvimento"
                description="A criação de atividades estará disponível em breve."
                action={{
                  label: "Voltar ao Dashboard",
                  onClick: () => window.history.back()
                }}
              />
            </div>
          </Card>
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};

export default ActivityCreatePage;