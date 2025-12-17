import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { Tag, FolderOpen, Plus, Settings } from 'lucide-react';
import { AuthUser, Stats } from '@/types/common';

interface CategorizationIndexProps {
  auth?: AuthUser;
  stats?: Stats;
}

const CategorizationIndex: React.FC<CategorizationIndexProps> = ({ 
  auth, 
  stats 
}) => {
  const [useAdvancedDashboard, setUseAdvancedDashboard] = useState(false);

  return (
    <AppLayout
      user={auth}
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Categorização', href: '/categorization', current: true }
      ]}
      actions={
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setUseAdvancedDashboard(false)}
            className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            ← Voltar ao Dashboard Básico
          </Button>
        </div>
      }
    >
      <Head title="Categorização Avançada - xWin Dash" />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Tag className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Tags</h3>
                <p className="text-gray-300">Gerenciar tags dos leads</p>
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <FolderOpen className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Categorias</h3>
                <p className="text-gray-300">Organizar por categorias</p>
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Configurações</h3>
                <p className="text-gray-300">Configurar categorização</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Ações Rápidas</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
          
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-gray-400 mb-4">
              Comece criando sua primeira categoria para organizar seus leads.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Categoria
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CategorizationIndex;
