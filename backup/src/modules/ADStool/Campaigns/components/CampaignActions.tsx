import React, { useState, useCallback } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import BudgetAdjustmentModal from './BudgetAdjustmentModal.tsx';
import ReportCreationModal from './ReportCreationModal.tsx';
import Button from '@/components/ui/Button';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
const CampaignActions = ({ campaign, onUpdate, onDelete }) => {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { post, delete: destroy, processing } = useForm({});
  const handleDelete = useCallback(() => {
    destroy(route('api.adstool.campaigns.destroy', campaign.id), {
      onSuccess: () => {
        toast.success('Campanha excluída com sucesso!');
        onDelete?.(campaign);
      },
      onError: () => {
        toast.error('Erro ao excluir campanha.');
      },
    });
  }, [destroy, campaign, onDelete]);
  const handlePauseCampaign = useCallback(() => {
    post(route('api.adstool.campaigns.pause', campaign.id), {
      onSuccess: () => {
        toast.success('Campanha pausada com sucesso!');
        onUpdate?.(campaign);
      },
      onError: () => {
        toast.error('Erro ao pausar campanha.');
      },
    });
  }, [post, campaign, onUpdate]);
  const handleResumeCampaign = useCallback(() => {
    post(route('api.adstool.campaigns.resume', campaign.id), {
      onSuccess: () => {
        toast.success('Campanha retomada com sucesso!');
        onUpdate?.(campaign);
      },
      onError: () => {
        toast.error('Erro ao retomar campanha.');
      },
    });
  }, [post, campaign, onUpdate]);
  const isPaused = campaign?.status === 'paused';
  const isActive = campaign?.status === 'active';
  return (
    <div className="flex gap-2 flex-wrap">
      <Link href={route('adstool.campaigns.edit', campaign.id)}>
        <Button variant="outline" size="sm">Editar</Button>
      </Link>
      {!isPaused && (
        <Button variant="warning" size="sm" onClick={handlePauseCampaign}>Pausar</Button>
      )}
      {!isActive && (
        <Button variant="success" size="sm" onClick={handleResumeCampaign}>Retomar</Button>
      )}
      <Button variant="outline" size="sm" onClick={() => setIsBudgetModalOpen(true)}>Ajustar Orçamento</Button>
      <Button variant="outline" size="sm" onClick={() => setIsReportModalOpen(true)}>Criar Relatório</Button>
      <Button variant="destructive" size="sm" onClick={() => setIsConfirmDeleteModalOpen(true)} loading={processing}>Excluir</Button>
      <ConfirmationModal
        open={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Campanha"
        text={`Tem certeza que deseja excluir a campanha "${campaign?.name}"?`}
        confirmText="Excluir"
        confirmVariant="destructive"
      />
      <BudgetAdjustmentModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} campaign={campaign} />
      <ReportCreationModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} campaign={campaign} />
    </div>
  );
};
export default CampaignActions;
