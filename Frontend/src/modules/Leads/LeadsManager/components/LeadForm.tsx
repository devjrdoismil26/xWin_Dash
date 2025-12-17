import React, { useState, useEffect } from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import Badge from '@/shared/components/ui/Badge';
import { useLeads } from '@/modules/Leads/hooks/useLeads';
import { toast } from 'sonner';
import { LeadFormProps, LeadStatus, LeadOrigin } from '../types';
const LeadForm: React.FC<LeadFormProps> = ({ lead = null, onSave, onCancel    }) => {
  const { create, update, segments, tags, loading } = useLeads();

  const [form, setForm] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    whatsapp: lead?.whatsapp || '',
    project_id: lead?.project_id || null, // Will be set from user context or form selection
    status: lead?.status || 'new' as LeadStatus,
    origin: lead?.origin || '' as LeadOrigin,
    notes: lead?.notes || '',
    score: lead?.score || 0,
    assigned_to: lead?.assigned_to || null,
    tags: lead?.tags?.map(t => t.name) || [],
    custom_fields: lead?.custom_fields || {} );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'Novo' },
    { value: 'contacted', label: 'Contactado' },
    { value: 'qualified', label: 'Qualificado' },
    { value: 'proposal', label: 'Proposta' },
    { value: 'negotiation', label: 'Negociação' },
    { value: 'won', label: 'Ganho' },
    { value: 'lost', label: 'Perdido' }
  ];
  const originOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'website', label: 'Website' },
    { value: 'social_media', label: 'Redes Sociais' },
    { value: 'email_marketing', label: 'Email Marketing' },
    { value: 'referral', label: 'Indicação' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'event', label: 'Evento' },
    { value: 'partner', label: 'Parceiro' },
    { value: 'organic_search', label: 'Busca Orgânica' },
    { value: 'paid_ads', label: 'Anúncios Pagos' },
    { value: 'other', label: 'Outro' }
  ];
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {} as any;
    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }
    if (form.phone && !/^\+?[\d\s\-()]+$/.test(form.phone)) {
      newErrors.phone = 'Formato de telefone inválido';
    }
    if (form.score < 0 || form.score > 100) {
      newErrors.score = 'Score deve estar entre 0 e 100';
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');

      return;
    }
    setIsSubmitting(true);

    try {
      const formData = {
        ...form,
        score: parseInt(String(form.score)) || 0,};

      if (lead) {
        await update(lead.id, formData);

        toast.success('Lead atualizado com sucesso!');

      } else {
        await create(formData);

        toast.success('Lead criado com sucesso!');

      }
      onSave?.();

    } catch (error) {
      toast.error('Erro ao salvar lead. Tente novamente.');

    } finally {
      setIsSubmitting(false);

    } ;

  const handleTagsChange = (tagString: string) => {
    const tagArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);

    setForm({ ...form, tags: tagArray });};

  return (
            <form className="space-y-4" onSubmit={ handleSubmit } />
      {/* Informações Básicas */}
      <div className=" ">$2</div><div>
           
        </div><Input
            label="Nome *"
            placeholder="Nome completo"
            value={ form.name }
            onChange={(e: unknown) => setForm({ ...form, name: e.target.value })}
            error={ errors.name }
            required /></div><div>
           
        </div><Input
            label="Email *"
            type="email"
            placeholder="email@exemplo.com"
            value={ form.email }
            onChange={(e: unknown) => setForm({ ...form, email: e.target.value })}
            error={ errors.email }
            required />
        </div>
      {/* Contato */}
      <div className=" ">$2</div><div>
           
        </div><Input
            label="Telefone"
            placeholder="+55 11 99999-9999"
            value={ form.phone }
            onChange={(e: unknown) => setForm({ ...form, phone: e.target.value })}
            error={ errors.phone } /></div><div>
           
        </div><Input
            label="WhatsApp"
            placeholder="+55 11 99999-9999"
            value={ form.whatsapp }
            onChange={(e: unknown) => setForm({ ...form, whatsapp: e.target.value })} />
        </div>
      {/* Status e Score */}
      <div className=" ">$2</div><div>
           
        </div><InputLabel>Status</InputLabel>
          <Select
            options={ statusOptions }
            value={ form.status }
            onChange={(value: unknown) => setForm({ ...form, status: value as LeadStatus })} /></div><div>
           
        </div><InputLabel>Origem</InputLabel>
          <Select
            options={ originOptions }
            value={ form.origin }
            onChange={(value: unknown) => setForm({ ...form, origin: value as LeadOrigin })} /></div><div>
           
        </div><Input
            label="Score (0-100)"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={ form.score }
            onChange={(e: unknown) => setForm({ ...form, score: parseInt(e.target.value) || 0 })}
            error={ errors.score } />
        </div>
      {/* Tags */}
      <div>
           
        </div><Input
          label="Tags (separadas por vírgula)"
          placeholder="vip, newsletter, interessado"
          value={ form.tags.join(', ') }
          onChange={ (e: unknown) => handleTagsChange(e.target.value) }
          helperText="Exemplo: vip, newsletter, interessado" />
        {form.tags.length > 0 && (
          <div className="{(form.tags || []).map((tag: unknown, index: unknown) => (">$2</div>
              <div key={index} className="inline-flex items-center">
           
        </div><Badge variant="primary" className="pr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = (form.tags || []).filter((_: unknown, i: unknown) => i !== index);

                      setForm({ ...form, tags: newTags });

                    } className="ml-1 text-current hover:text-red-600"
                  >
                    ×
                  </button></Badge></div>
            ))}
          </div>
        )}
      </div>
      {/* Observações */}
      <div>
           
        </div><Textarea
          label="Observações"
          placeholder="Observações sobre o lead..."
          rows={ 3 }
          value={ form.notes }
          onChange={(e: unknown) => setForm({ ...form, notes: e.target.value })} />
      </div>
      {/* Botões */}
      <div className=" ">$2</div><Button 
          type="button" 
          variant="outline" 
          onClick={ onCancel }
          disabled={ isSubmitting } />
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={ isSubmitting || loading }
          loading={ isSubmitting }
          loadingText={ lead ? 'Atualizando...' : 'Criando...' } />
          {lead ? 'Atualizar Lead' : 'Criar Lead'}
        </Button></div></form>);};

export { LeadForm };

export default LeadForm;
