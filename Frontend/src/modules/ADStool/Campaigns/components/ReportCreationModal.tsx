import React, { useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Modal from '@/shared/components/ui/Modal';
import Select from '@/shared/components/ui/Select';
import { AdsCampaign } from '../../types/adsCampaignTypes';

interface ReportCreationModalProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  onSuccess??: (e: any) => void;
  campaign: AdsCampaign;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ReportCreationModal: React.FC<ReportCreationModalProps> = ({ isOpen, onClose, onSuccess, campaign    }) => {
  const { data, setData, post, processing, errors, reset } = useForm<{ report_type: string; start_date: string; end_date: string; format: string }>({
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

      reset();

      setData('report_type', 'performance');

      setData('start_date', thirtyDaysAgo.toISOString().split('T')[0]);

      setData('end_date', today.toISOString().split('T')[0]);

      setData('format', 'pdf');

    } , [isOpen, reset, setData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
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
    [data, campaign, post, onClose, onSuccess],);

  interface Option {
  value: string;
  label: string; }
  
  const reportTypeOptions: Option[] = [
    { value: 'performance', label: 'Relatório de Performance' },
    { value: 'detailed', label: 'Relatório Detalhado' },
    { value: 'summary', label: 'Resumo Executivo' },
    { value: 'comparison', label: 'Comparativo de Períodos' },
  ];
  const formatOptions: Option[] = [
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
  ];
  return (
        <>
      <Modal isOpen={isOpen} onClose={ onClose } />
      <Card className="w-full max-w-md" />
        <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold">Criar Relatório</h3>
            <p className="text-sm text-gray-600 mt-2" />
              Campanha: <span className="font-medium">{campaign?.name}</span></p></div>
          <form onSubmit={handleSubmit} className="space-y-4" />
            <div>
           
        </div><InputLabel htmlFor="report_type">Tipo de relatório</InputLabel>
              <Select
                id="report_type"
                value={ data.report_type }
                onChange={ (e: unknown) => setData('report_type', e.target.value) }
                required
              >
                {(reportTypeOptions || []).map((item: unknown) => (
                  <option key={item.value} value={ item.value } />
                    {item.label}
                  </option>
                ))}
              </Select></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="start_date">Início</InputLabel>
                <Input
                  id="start_date"
                  type="date"
                  value={ data.start_date }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('start_date', e.target.value) }
                  required /></div><div>
           
        </div><InputLabel htmlFor="end_date">Fim</InputLabel>
                <Input
                  id="end_date"
                  type="date"
                  value={ data.end_date }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setData('end_date', e.target.value) }
                  required /></div><div>
           
        </div><InputLabel htmlFor="format">Formato</InputLabel>
              <Select id="format" value={data.format} onChange={(e: unknown) => setData('format', e.target.value)} required>
                {(formatOptions || []).map((item: unknown) => (
                  <option key={item.value} value={ item.value } />
                    {item.label}
                  </option>
                ))}
              </Select></div><div className=" ">$2</div><Button type="submit" variant="primary" loading={processing} disabled={processing} className="flex-1" />
                {processing ? 'Criando...' : 'Criar Relatório'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="flex-1" />
                Cancelar
              </Button></div></form></div></Card></Modal>);};

export default ReportCreationModal;
