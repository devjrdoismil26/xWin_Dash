import React, { useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
import Modal from '@/components/ui/Modal';
const BudgetAdjustmentModal = ({ isOpen, onClose, onSuccess, campaign }) => {
  const { data, setData, post, processing, errors, reset } = useForm({ budget: '' });
  useEffect(() => {
    if (isOpen && campaign) {
      reset({ budget: String(campaign.budget || '') });
    }
  }, [isOpen, campaign, reset]);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const budgetValue = parseFloat(String(data.budget));
      if (Number.isNaN(budgetValue) || budgetValue <= 0) {
        toast.error('Por favor, insira um valor de orçamento válido.');
        return;
      }
      post(route('api.adstool.campaigns.adjustBudget', campaign.id), {
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
    [data.budget, campaign, post, onSuccess, onClose],
  );
  const currentBudget = campaign?.budget
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(campaign.budget))
    : 'R$ 0,00';
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Ajustar Orçamento</h3>
            <p className="text-sm text-gray-600 mt-2">
              Campanha: <span className="font-medium">{campaign?.name}</span>
            </p>
            <p className="text-sm text-gray-600">Orçamento atual: <span className="font-medium">{currentBudget}</span></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <InputLabel htmlFor="budget">Novo orçamento</InputLabel>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={data.budget}
                onChange={(e) => setData('budget', e.target.value)}
                placeholder="0.00"
              />
              {errors?.budget && <InputError text={errors.budget} />}
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" loading={processing} disabled={processing} className="flex-1">
                Salvar
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </Modal>
  );
};
export default BudgetAdjustmentModal;
