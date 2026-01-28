import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Users, Save, Plus, Trash2, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
const DEFAULT_FIELDS = [
  { value: 'email', label: 'Email', type: 'text' },
  { value: 'name', label: 'Nome', type: 'text' },
  { value: 'age', label: 'Idade', type: 'number' },
  { value: 'location', label: 'Localização', type: 'text' },
];
const OPERATORS = {
  text: [
    { value: 'contains', label: 'contém' },
    { value: 'not_contains', label: 'não contém' },
    { value: 'equals', label: 'igual a' },
  ],
  number: [
    { value: 'equals', label: 'igual a' },
    { value: 'greater_than', label: 'maior que' },
    { value: 'less_than', label: 'menor que' },
  ],
};
const EmailSegmentForm = ({ segment = null, onSave, onCancel }) => {
  const isEditing = Boolean(segment);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: segment?.name || '',
    description: segment?.description || '',
    is_active: segment?.is_active ?? true,
    auto_update: segment?.auto_update ?? true,
    criteria: Array.isArray(segment?.criteria) && segment.criteria.length > 0
      ? segment.criteria
      : [{ field: 'email', operator: 'contains', value: '', logic: 'AND' }],
  });
  const validate = useCallback(() => {
    const next = {};
    if (!data.name.trim()) next.name = 'Nome do segmento é obrigatório.';
    if (!Array.isArray(data.criteria) || data.criteria.length === 0) next.criteria = 'Adicione pelo menos um critério.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [data]);
  const updateCriterion = (index, field, value) => {
    setData((prev) => {
      const next = [...prev.criteria];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, criteria: next };
    });
  };
  const addCriterion = () => {
    setData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, { field: 'email', operator: 'contains', value: '', logic: 'AND' }],
    }));
  };
  const removeCriterion = (index) => {
    setData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }));
  };
  const getOperatorsForField = (fieldName) => {
    const field = DEFAULT_FIELDS.find((f) => f.value === fieldName);
    return OPERATORS[field?.type || 'text'];
  };
  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    try {
      onSave?.(data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <Card.Title className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{isEditing ? 'Editar Segmento' : 'Novo Segmento'}</span>
            </Card.Title>
            <div className="flex space-x-2">
              <Button onClick={onCancel} variant="outline" disabled={loading}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{loading ? 'Salvando...' : 'Salvar Segmento'}</span>
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="name">Nome *</InputLabel>
              <Input id="name" value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Engajados" className={errors.name ? 'border-red-500' : ''} />
              <InputError text={errors.name} />
            </div>
            <div>
              <InputLabel htmlFor="description">Descrição</InputLabel>
              <Input id="description" value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} placeholder="Descrição do segmento..." />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Critérios</span>
            </h3>
            <Button type="button" onClick={addCriterion} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </div>
          <div className="space-y-4">
            {data.criteria.map((criterion, index) => (
              <div key={`criterion-${index}`} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <InputLabel>Lógica</InputLabel>
                    <Select value={criterion.logic} onChange={(e) => updateCriterion(index, 'logic', e.target.value)}>
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </Select>
                  </div>
                  <div>
                    <InputLabel>Campo</InputLabel>
                    <Select value={criterion.field} onChange={(e) => updateCriterion(index, 'field', e.target.value)}>
                      {DEFAULT_FIELDS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <InputLabel>Operador</InputLabel>
                    <Select value={criterion.operator} onChange={(e) => updateCriterion(index, 'operator', e.target.value)}>
                      {getOperatorsForField(criterion.field).map((op) => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <InputLabel>Valor</InputLabel>
                    <Input value={criterion.value} onChange={(e) => updateCriterion(index, 'value', e.target.value)} placeholder="Valor" />
                  </div>
                </div>
                <div className="mt-2">
                  <Button type="button" onClick={() => removeCriterion(index)} size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" /> Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
EmailSegmentForm.propTypes = {
  segment: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};
export default EmailSegmentForm;
