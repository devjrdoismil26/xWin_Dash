import React, { useState } from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import { CustomFieldFormProps, LeadCustomField } from '../types';
import { toast } from 'sonner';
const CustomFieldForm: React.FC<CustomFieldFormProps> = ({ field = null, 
  onSave, 
  onCancel 
   }) => {
  const [form, setForm] = useState({
    name: field?.name || '',
    type: field?.type || 'text' as LeadCustomField['type'],
    required: field?.required || false,
    options: field?.options?.join(', ') || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telefone' },
    { value: 'date', label: 'Data' },
    { value: 'select', label: 'Seleção Única' },
    { value: 'multiselect', label: 'Seleção Múltipla' },
    { value: 'textarea', label: 'Texto Longo' }
  ];
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {} as any;
    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (['select', 'multiselect'].includes(form.type) && !form.options.trim()) {
      newErrors.options = 'Opções são obrigatórias para campos de seleção';
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');

      return;
    }
    try {
      const fieldData: Partial<LeadCustomField> = {
        name: form.name,
        type: form.type,
        required: form.required,
        options: ['select', 'multiselect'].includes(form.type) 
          ? form.options.split(',').map(opt => opt.trim()).filter(opt => opt)
          : undefined};

      onSave?.(fieldData as LeadCustomField);

      toast.success('Campo personalizado salvo com sucesso!');

    } catch (error) {
      toast.error('Erro ao salvar campo. Tente novamente.');

    } ;

  return (
        <>
      <form className="space-y-4" onSubmit={ handleSubmit } />
      <div>
           
        </div><Input
          label="Nome do Campo *"
          placeholder="Ex: Empresa, Cargo, etc."
          value={ form.name }
          onChange={(e: unknown) => setForm({ ...form, name: e.target.value })}
          error={ errors.name }
          required /></div><div>
           
        </div><InputLabel>Tipo do Campo</InputLabel>
        <Select
          options={ fieldTypes }
          value={ form.type }
          onChange={(value: unknown) => setForm({ ...form, type: value as LeadCustomField['type'] })} />
      </div>
      {['select', 'multiselect'].includes(form.type) && (
        <div>
           
        </div><Textarea
            label="Opções (separadas por vírgula) *"
            placeholder="Opção 1, Opção 2, Opção 3"
            rows={ 3 }
            value={ form.options }
            onChange={(e: unknown) => setForm({ ...form, options: e.target.value })}
            error={ errors.options }
            required />
        </div>
      )}
      <div className=" ">$2</div><input
          type="checkbox"
          id="required"
          checked={ form.required }
          onChange={(e: unknown) => setForm({ ...form, required: e.target.checked })}
          className="rounded border-gray-300" />
        <label htmlFor="required" className="ml-2 text-sm text-gray-700" />
          Campo obrigatório
        </label></div><div className=" ">$2</div><Button 
          type="button" 
          variant="outline" 
          onClick={ onCancel } />
          Cancelar
        </Button>
        <Button type="submit" />
          {field ? 'Atualizar Campo' : 'Criar Campo'}
        </Button></div></form>);};

export default CustomFieldForm;
