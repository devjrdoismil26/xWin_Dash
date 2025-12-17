import React, { useState } from 'react';
import { Input, Select, Button } from '@/shared/components/ui';
import { LeadFormData } from '../types';

interface LeadFormModalProps {
  open: boolean;
  lead?: LeadFormData | null;
  onClose??: (e: any) => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ open, lead, onClose, onSubmit    }) => {
  const [formData, setFormData] = useState<LeadFormData>(
    lead || {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'new',
      origin: 'website',
      score: 0
    });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit(formData);

      onClose();

    } finally {
      setLoading(false);

    } ;

  if (!open) return null;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold text-gray-900" />
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h2></div><form onSubmit={handleSubmit} className="p-6 space-y-4" />
          <div className=" ">$2</div><Input
              label="Nome *"
              required
              value={ formData.name }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} />

            <Input
              label="Email *"
              type="email"
              required
              value={ formData.email }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })} />

            <Input
              label="Telefone"
              value={ formData.phone || '' }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })} />

            <Input
              label="Empresa"
              value={ formData.company || '' }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company: e.target.value })} />

            <Select
              label="Status"
              value={ formData.status }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'new', label: 'Novo' },
                { value: 'contacted', label: 'Contatado' },
                { value: 'qualified', label: 'Qualificado' },
                { value: 'converted', label: 'Convertido' },
                { value: 'lost', label: 'Perdido' }
              ]} />

            <Select
              label="Origem"
              value={ formData.origin }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, origin: e.target.value })}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'social', label: 'Redes Sociais' },
                { value: 'email', label: 'Email' },
                { value: 'referral', label: 'Indicação' },
                { value: 'other', label: 'Outro' }
              ]} />

            <Input
              label="Score"
              type="number"
              min="0"
              max="100"
              value={ formData.score || 0 }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })} /></div><div className=" ">$2</div><Button type="button" variant="secondary" onClick={onClose} disabled={ loading } />
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={ loading } />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button></div></form>
      </div>);};
