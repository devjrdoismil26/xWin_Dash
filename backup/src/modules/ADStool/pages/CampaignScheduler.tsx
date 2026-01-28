import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Target } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
interface CampaignSchedulerProps {
  auth: { user: any };
}
const CampaignScheduler: React.FC<CampaignSchedulerProps> = ({ auth }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleCreateCampaign = () => {
    setIsCreateModalOpen(true);
  };
  const handleEditCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
  };
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Agendamento de Campanhas" />
      <PageLayout
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="font-semibold text-xl text-gray-800">Agendamento de Campanhas</h2>
            </div>
            <Button onClick={handleCreateCampaign} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nova
            </Button>
          </div>
        }
      >
        <div className="py-6">
          <div className="max-w-7xl mx-auto">
            <div className="p-4">
              <p className="text-gray-600 mb-4">Use o calendário para visualizar e gerenciar campanhas.</p>
            </div>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar campanha</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => setIsCreateModalOpen(false)} variant="outline">
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default CampaignScheduler;
