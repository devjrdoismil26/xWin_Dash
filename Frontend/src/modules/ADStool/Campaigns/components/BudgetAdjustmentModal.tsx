/**
 * Modal para ajustar orçamento de campanha
 *
 * @description
 * Modal para atualizar o orçamento de uma campanha de anúncios existente.
 * Exibe orçamento atual e permite definir novo valor.
 *
 * @module modules/ADStool/Campaigns/components/BudgetAdjustmentModal
 * @since 1.0.0
 */

import React, { useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
import Modal from '@/shared/components/ui/Modal';
import { AdsCampaign } from '../../types/adsCampaignTypes';

/**
 * Props do componente BudgetAdjustmentModal
 *
 * @interface BudgetAdjustmentModalProps
 * @property {boolean} isOpen - Se o modal está aberto
 * @property {() => void} onClose - Callback para fechar o modal
 * @property {() => void} [onSuccess] - Callback quando orçamento é atualizado
 * @property {AdsCampaign} campaign - Campanha para ajustar orçamento
 */
interface BudgetAdjustmentModalProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  onSuccess???: (e: any) => void;
  campaign: AdsCampaign | null;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente BudgetAdjustmentModal
 *
 * @description
 * Modal com formulário para atualizar orçamento de campanha.
 * Valida valor antes de submeter e exibe feedback ao usuário.
 *
 * @param {BudgetAdjustmentModalProps} props - Props do componente
 * @returns {JSX.Element} Modal de ajuste de orçamento
 */
const BudgetAdjustmentModal: React.FC<BudgetAdjustmentModalProps> = ({ isOpen, onClose, onSuccess, campaign    }) => {
  const { data, setData, post, processing, errors, reset } = useForm<{ budget: string }>({ budget: '' });

  useEffect(() => {
    if (isOpen && campaign) {
      reset();

      setData('budget', String(campaign.budget || ''));

    } , [isOpen, campaign, reset, setData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const budgetValue = parseFloat(String(data.budget));

      if (Number.isNaN(budgetValue) || budgetValue <= 0) {
        toast.error('Por favor, insira um valor de orçamento válido.');

        return;
      }
      if (!campaign) return;
      post(route('api.adstool.campaigns.adjustBudget', { campaign: campaign.id }), {
        onSuccess: () => {
          toast.success('Orçamento ajustado com sucesso!');

          onSuccess?.();

          onClose?.();

        },
        onError: () => {
          toast.error('Erro ao ajustar orçamento.');

        },
      });

    },
    [data.budget, campaign, post, onSuccess, onClose],);

  const currentBudget = campaign?.budget
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(campaign.budget))
    : 'R$ 0,00';
  return (
        <>
      <Modal isOpen={isOpen} onClose={ onClose } />
      <Card className="w-full max-w-md" />
        <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold">Ajustar Orçamento</h3>
            <p className="text-sm text-gray-600 mt-2" />
              Campanha: <span className="font-medium">{campaign?.name}</span></p><p className="text-sm text-gray-600">Orçamento atual: <span className="font-medium">{currentBudget}</span></p></div>
          <form onSubmit={handleSubmit} className="space-y-4" />
            <div>
           
        </div><InputLabel htmlFor="budget">Novo orçamento</InputLabel>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={ data.budget }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('budget', e.target.value) }
                placeholder="0.00" />
              { errors?.budget && <InputError text={errors.budget } />}
            </div>
            <div className=" ">$2</div><Button type="submit" variant="primary" loading={processing} disabled={processing} className="flex-1" />
                Salvar
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="flex-1" />
                Cancelar
              </Button></div></form></div></Card></Modal>);};

export default BudgetAdjustmentModal;
