import React, { useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Modal from '@/components/ui/Modal';
import { Select } from '@/components/ui/select';
const ReportCreationModal = ({ isOpen, onClose, onSuccess, campaign }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    report_type: 'performance',
    start_date: '',
    end_date: '',
    format: 'pdf',
  });
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      reset({
        report_type: 'performance',
        start_date: thirtyDaysAgo.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        format: 'pdf',
      });
    }
  }, [isOpen, reset]);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      if (startDate > endDate) {
        toast.error('A data de início deve ser anterior à data de término.');
        return;
      }
      post(route('api.adstool.campaigns.createReport', campaign.id), {
        onSuccess: () => {
          toast.success('A criação do seu relatório foi iniciada! Você será notificado quando estiver pronto.');
          onSuccess?.();
          onClose?.();
        },
        onError: () => {
          toast.error('Erro ao criar relatório.');
        },
      });
    },
    [data, campaign, post, onClose, onSuccess],
  );
  const reportTypeOptions = [
    { value: 'performance', label: 'Relatório de Performance' },
    { value: 'detailed', label: 'Relatório Detalhado' },
    { value: 'summary', label: 'Resumo Executivo' },
    { value: 'comparison', label: 'Comparativo de Períodos' },
  ];
  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
  ];
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Criar Relatório</h3>
            <p className="text-sm text-gray-600 mt-2">
              Campanha: <span className="font-medium">{campaign?.name}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <InputLabel htmlFor="report_type">Tipo de relatório</InputLabel>
              <Select
                id="report_type"
                value={data.report_type}
                onChange={(e) => setData('report_type', e.target.value)}
                required
              >
                {reportTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="start_date">Início</InputLabel>
                <Input
                  id="start_date"
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                  required
                />
              </div>
              <div>
                <InputLabel htmlFor="end_date">Fim</InputLabel>
                <Input
                  id="end_date"
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData('end_date', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <InputLabel htmlFor="format">Formato</InputLabel>
              <Select id="format" value={data.format} onChange={(e) => setData('format', e.target.value)} required>
                {formatOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" loading={processing} disabled={processing} className="flex-1">
                {processing ? 'Criando...' : 'Criar Relatório'}
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
export default ReportCreationModal;
