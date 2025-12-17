import React, { useState } from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import { LeadSegmentFormProps, LeadSegment, LeadSegmentRule } from '../types';
import { toast } from 'sonner';
const LeadSegmentForm: React.FC<LeadSegmentFormProps> = ({ segment = null, 
  onSave, 
  onCancel 
   }) => {
  const [form, setForm] = useState({
    name: segment?.name || '',
    description: segment?.description || '',
    rules: segment?.rules || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telefone' },
    { value: 'status', label: 'Status' },
    { value: 'origin', label: 'Origem' },
    { value: 'score', label: 'Score' },
    { value: 'tags', label: 'Tags' },
    { value: 'created_at', label: 'Data de Criação' }
  ];
  const operatorOptions = [
    { value: 'equals', label: 'Igual a' },
    { value: 'contains', label: 'Contém' },
    { value: 'starts_with', label: 'Começa com' },
    { value: 'ends_with', label: 'Termina com' },
    { value: 'greater_than', label: 'Maior que' },
    { value: 'less_than', label: 'Menor que' }
  ];
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {} as any;
    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (form.rules.length === 0) {
      newErrors.rules = 'Pelo menos uma regra é obrigatória';
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
      const segmentData: Partial<LeadSegment> = {
        name: form.name,
        description: form.description,
        rules: form.rules};

      onSave?.(segmentData as LeadSegment);

      toast.success('Segmento salvo com sucesso!');

    } catch (error) {
      toast.error('Erro ao salvar segmento. Tente novamente.');

    } ;

  const addRule = () => {
    setForm({
      ...form,
      rules: [
        ...form.rules,
        {
          field: 'name',
          operator: 'equals',
          value: ''
        }
      ]
    });};

  const updateRule = (index: number, field: keyof LeadSegmentRule, value: string | number) => {
    const newRules = [...form.rules];
    newRules[index] = {
      ...newRules[index],
      [field]: value};

    setForm({
      ...form,
      rules: newRules
    });};

  const removeRule = (index: number) => {
    setForm({
      ...form,
      rules: (form.rules || []).filter((_: unknown, i: unknown) => i !== index)
  });};

  return (
            <form className="space-y-6" onSubmit={ handleSubmit } />
      {/* Informações Básicas */}
      <div className=" ">$2</div><div>
           
        </div><Input
            label="Nome do Segmento *"
            placeholder="Ex: Leads VIP, Clientes Ativos"
            value={ form.name }
            onChange={(e: unknown) => setForm({ ...form, name: e.target.value })}
            error={ errors.name }
            required /></div><div>
           
        </div><Textarea
            label="Descrição"
            placeholder="Descreva o segmento..."
            rows={ 3 }
            value={ form.description }
            onChange={(e: unknown) => setForm({ ...form, description: e.target.value })} />
        </div>
      {/* Regras */}
      <div>
           
        </div><div className=" ">$2</div><h3 className="text-lg font-medium text-gray-900">Regras do Segmento</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={ addRule } />
            Adicionar Regra
          </Button>
        </div>
        {form.rules.length === 0 ? (
          <div className=" ">$2</div><p>Nenhuma regra definida</p>
            <p className="text-sm">Clique em &quot;Adicionar Regra&quot; para começar</p>
      </div>
    </>
  ) : (
          <div className="{(form.rules || []).map((rule: unknown, index: unknown) => (">$2</div>
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
           
        </div><div className=" ">$2</div><h4 className="font-medium text-gray-900">Regra {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={ () => removeRule(index) }
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button></div><div className=" ">$2</div><div>
           
        </div><InputLabel>Campo</InputLabel>
                    <Select
                      options={ fieldOptions }
                      value={ rule.field }
                      onChange={ (value: unknown) => updateRule(index, 'field', value) } /></div><div>
           
        </div><InputLabel>Operador</InputLabel>
                    <Select
                      options={ operatorOptions }
                      value={ rule.operator }
                      onChange={ (value: unknown) => updateRule(index, 'operator', value) } /></div><div>
           
        </div><Input
                      label="Valor"
                      placeholder="Valor da regra"
                      value={ rule.value }
                      onChange={ (e: unknown) => updateRule(index, 'value', e.target.value) } /></div></div>
            ))}
          </div>
        )}
        {errors.rules && (
          <p className="text-sm text-red-600">{errors.rules}</p>
        )}
      </div>
      {/* Botões */}
      <div className=" ">$2</div><Button 
          type="button" 
          variant="outline" 
          onClick={ onCancel } />
          Cancelar
        </Button>
        <Button type="submit" />
          {segment ? 'Atualizar Segmento' : 'Criar Segmento'}
        </Button></div></form>);};

export default LeadSegmentForm;
