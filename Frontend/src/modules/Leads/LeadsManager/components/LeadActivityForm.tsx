import React, { useState } from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import { LeadActivityFormProps, LeadActivity } from '../types';
import { toast } from 'sonner';
const LeadActivityForm: React.FC<LeadActivityFormProps> = ({ leadId, 
  onActivityAdded, 
  onCancel 
   }) => {
  const [form, setForm] = useState({
    type: 'note' as LeadActivity['type'],
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const activityTypes = [
    { value: 'note', label: 'Nota' },
    { value: 'call', label: 'Ligação' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Reunião' },
    { value: 'task', label: 'Tarefa' },
    { value: 'status_change', label: 'Mudança de Status' }
  ];
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {} as any;
    if (!form.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
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
      const activityData: Partial<LeadActivity> = {
        lead_id: leadId,
        type: form.type,
        description: form.description,
        user_id: null // Will be set from authentication context};

      // Simular criação da atividade
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newActivity: LeadActivity = {
        id: Date.now(), // Simular ID
        lead_id: leadId,
        type: form.type,
        description: form.description,
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()};

      onActivityAdded?.(newActivity);

      toast.success('Atividade adicionada com sucesso!');

      // Reset form
      setForm({
        type: 'note',
        description: ''
      });

    } catch (error) {
      toast.error('Erro ao adicionar atividade. Tente novamente.');

    } finally {
      setIsSubmitting(false);

    } ;

  const getActivityIcon = (type: LeadActivity['type']): string => {
    const icons = {
      note: '📝',
      call: '📞',
      email: '📧',
      meeting: '🤝',
      task: '✅',
      status_change: '🔄'};

    return icons[type] || '📝';};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><span className="text-2xl">{getActivityIcon(form.type)}</span>
        <h3 className="text-lg font-medium text-gray-900">Adicionar Atividade</h3></div><form className="space-y-4" onSubmit={ handleSubmit } />
        <div>
           
        </div><InputLabel>Tipo de Atividade</InputLabel>
          <Select
            options={ activityTypes }
            value={ form.type }
            onChange={(value: unknown) => setForm({ ...form, type: value as LeadActivity['type'] })} /></div><div>
           
        </div><Textarea
            label="Descrição *"
            placeholder="Descreva a atividade..."
            rows={ 4 }
            value={ form.description }
            onChange={(e: unknown) => setForm({ ...form, description: e.target.value })}
            error={ errors.description }
            required /></div><div className=" ">$2</div><Button 
            type="button" 
            variant="outline" 
            onClick={ onCancel }
            disabled={ isSubmitting } />
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={ isSubmitting }
            loading={ isSubmitting }
            loadingText="Adicionando..." />
            Adicionar Atividade
          </Button></div></form>
    </div>);};

export default LeadActivityForm;
