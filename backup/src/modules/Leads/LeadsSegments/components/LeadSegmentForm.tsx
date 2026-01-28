import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/select';
import Textarea from '@/components/ui/Textarea';
import { LeadSegmentFormProps, LeadSegment, LeadSegmentRule } from '../types';
import { toast } from 'sonner';
const LeadSegmentForm: React.FC<LeadSegmentFormProps> = ({ 
  segment = null, 
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
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (form.rules.length === 0) {
      newErrors.rules = 'Pelo menos uma regra é obrigatória';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
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
        rules: form.rules
      };
      onSave?.(segmentData as LeadSegment);
      toast.success('Segmento salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar segmento. Tente novamente.');
    }
  };
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
    });
  };
  const updateRule = (index: number, field: keyof LeadSegmentRule, value: string | number) => {
    const newRules = [...form.rules];
    newRules[index] = {
      ...newRules[index],
      [field]: value
    };
    setForm({
      ...form,
      rules: newRules
    });
  };
  const removeRule = (index: number) => {
    setForm({
      ...form,
      rules: form.rules.filter((_, i) => i !== index)
    });
  };
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Informações Básicas */}
      <div className="space-y-4">
        <div>
          <Input
            label="Nome do Segmento *"
            placeholder="Ex: Leads VIP, Clientes Ativos"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />
        </div>
        <div>
          <Textarea
            label="Descrição"
            placeholder="Descreva o segmento..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>
      {/* Regras */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Regras do Segmento</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRule}
          >
            Adicionar Regra
          </Button>
        </div>
        {form.rules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma regra definida</p>
            <p className="text-sm">Clique em &quot;Adicionar Regra&quot; para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.rules.map((rule, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Regra {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRule(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <InputLabel>Campo</InputLabel>
                    <Select
                      options={fieldOptions}
                      value={rule.field}
                      onChange={(value) => updateRule(index, 'field', value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Operador</InputLabel>
                    <Select
                      options={operatorOptions}
                      value={rule.operator}
                      onChange={(value) => updateRule(index, 'operator', value)}
                    />
                  </div>
                  <div>
                    <Input
                      label="Valor"
                      placeholder="Valor da regra"
                      value={rule.value}
                      onChange={(e) => updateRule(index, 'value', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.rules && (
          <p className="text-sm text-red-600">{errors.rules}</p>
        )}
      </div>
      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {segment ? 'Atualizar Segmento' : 'Criar Segmento'}
        </Button>
      </div>
    </form>
  );
};
export default LeadSegmentForm;
