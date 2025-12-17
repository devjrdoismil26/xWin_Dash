/**
 * Ações de campanha de anúncios
 *
 * @description
 * Componente para agrupar ações disponíveis para uma campanha:
 * editar, pausar, retomar, ajustar orçamento, criar relatório e excluir.
 * Integra modais de confirmação e ajuste de orçamento.
 *
 * @module modules/ADStool/Campaigns/components/CampaignActions
 * @since 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import BudgetAdjustmentModal from './BudgetAdjustmentModal';
import ReportCreationModal from './ReportCreationModal';
import Button from '@/shared/components/ui/Button';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';
import { AdsCampaign } from '../../types/adsCampaignTypes';

/**
 * Props do componente CampaignActions
 *
 * @interface CampaignActionsProps
 * @property {AdsCampaign} campaign - Campanha para executar ações
 * @property {(campaign: AdsCampaign) => void} [onUpdate] - Callback quando campanha é atualizada
 * @property {(campaign: AdsCampaign) => void} [onDelete] - Callback quando campanha é excluída
 */
interface CampaignActionsProps {
  campaign: AdsCampaign;
  onUpdate??: (e: any) => void;
  onDelete??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente CampaignActions
 *
 * @description
 * Renderiza grupo de botões com ações para campanha: editar, pausar,
 * retomar, ajustar orçamento, criar relatório e excluir.
 * Gerencia modais de confirmação e ajuste de orçamento.
 *
 * @param {CampaignActionsProps} props - Props do componente
 * @returns {JSX.Element} Grupo de ações de campanha
 *
 * @example
 * ```tsx
 * <CampaignActions
 *   campaign={ campaign }
 *   onUpdate={ (c: unknown) => refreshCampaigns() }
 *   onDelete={ (c: unknown) => removeCampaign(c) }
 * />
 * ```
 */
const CampaignActions: React.FC<CampaignActionsProps> = ({ campaign, onUpdate, onDelete    }) => {
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
            <div className=" ">$2</div><Link href={ route('adstool.campaigns.edit', campaign.id) } />
        <Button variant="outline" size="sm">Editar</Button>
      </Link>
      {!isPaused && (
        <Button variant="warning" size="sm" onClick={ handlePauseCampaign }>Pausar</Button>
      )}
      {!isActive && (
        <Button variant="success" size="sm" onClick={ handleResumeCampaign }>Retomar</Button>
      )}
      <Button variant="outline" size="sm" onClick={ () => setIsBudgetModalOpen(true) }>Ajustar Orçamento</Button>
      <Button variant="outline" size="sm" onClick={ () => setIsReportModalOpen(true) }>Criar Relatório</Button>
      <Button variant="destructive" size="sm" onClick={() => setIsConfirmDeleteModalOpen(true)} loading={ processing }>Excluir</Button>
      <ConfirmationModal
        isOpen={ isConfirmDeleteModalOpen }
        onClose={ () => setIsConfirmDeleteModalOpen(false) }
        onConfirm={ handleDelete }
        title="Excluir Campanha"
        text={`Tem certeza que deseja excluir a campanha "${campaign?.name}"?`}
        confirmText="Excluir"
        type="destructive" />
      <BudgetAdjustmentModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} onSuccess={() => onUpdate?.(campaign)} campaign={ campaign } />
      <ReportCreationModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} onSuccess={() => {} campaign={ campaign } />
    </div>);};

export default CampaignActions;
