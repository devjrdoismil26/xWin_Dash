/**
 * Página de detalhes do módulo Activity
 * Interface para visualizar detalhes de uma atividade específica
 */

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Activity, Calendar, User, Tag } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';

interface ActivityDetailPageProps {
  className?: string;
  auth?: any;
  activity?: any;
  loading?: boolean;
  error?: string;
}

export const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({ 
  className,
  auth,
  activity,
  loading = false,
  error
}) => {
  // Loading state
  if (loading) {
    return (
      <AuthenticatedLayout user={auth?.user}>
        <Head title="Carregando Atividade - xWin Dash" />
        <PageLayout>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </PageLayout>
      </AuthenticatedLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AuthenticatedLayout user={auth?.user}>
        <Head title="Erro na Atividade - xWin Dash" />
        <PageLayout>
          <ErrorState
            title="Erro ao carregar atividade"
            description={error}
            action={{
              label: "Tentar novamente",
              onClick: () => window.location.reload()
            }}
          />
        </PageLayout>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title={`Atividade ${activity?.id || ''} - xWin Dash`} />
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
                Detalhes da Atividade
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize os detalhes da atividade selecionada
              </p>
            </div>
          </div>

          {/* Activity Details */}
          {activity ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Activity className="h-6 w-6 text-blue-400" />
                      <h2 className="text-xl font-semibold text-white">
                        {activity.log_name || 'Atividade'}
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Descrição</h3>
                        <p className="text-white">{activity.description || 'Sem descrição'}</p>
                      </div>
                      
                      {activity.properties && Object.keys(activity.properties).length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Propriedades</h3>
                          <div className="bg-gray-800/50 rounded-lg p-3">
                            <pre className="text-sm text-gray-300">
                              {JSON.stringify(activity.properties, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      
                      {activity.causer_type && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {activity.causer_type}
                          </span>
                        </div>
                      )}
                      
                      {activity.subject_type && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {activity.subject_type}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <div className="p-6 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Nenhuma atividade selecionada
                </h3>
                <p className="text-gray-400">
                  Selecione uma atividade para visualizar seus detalhes.
                </p>
              </div>
            </Card>
          )}
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};

export default ActivityDetailPage;