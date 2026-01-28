import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Filter, Plus, Trash2, Save, Target, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Switch from '@/components/ui/Switch';
const TYPE_OPTIONS = [
  { value: 'demographic', label: 'Demográfico' },
  { value: 'behavioral', label: 'Comportamental' },
  { value: 'engagement', label: 'Engajamento' },
  { value: 'custom', label: 'Customizado' },
];
const FIELD_LIBRARY = {
  demographic: [
    { value: 'age', label: 'Idade', type: 'number' },
    { value: 'gender', label: 'Gênero', type: 'select', options: ['masculino', 'feminino', 'outro'] },
    { value: 'location', label: 'Localização', type: 'text' },
  ],
  behavioral: [
    { value: 'last_visit', label: 'Última Visita', type: 'date' },
    { value: 'page_views', label: 'Visualizações', type: 'number' },
  ],
  engagement: [
    { value: 'email_opens', label: 'Aberturas de Email', type: 'number' },
    { value: 'email_clicks', label: 'Cliques em Email', type: 'number' },
  ],
  custom: [
    { value: 'tag', label: 'Tag', type: 'text' },
  ],
};
const OPERATORS_BY_TYPE = {
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
  date: [
    { value: 'before', label: 'antes de' },
    { value: 'after', label: 'depois de' },
    { value: 'equals', label: 'igual a' },
  ],
  select: [
    { value: 'equals', label: 'igual a' },
    { value: 'not_equals', label: 'diferente de' },
  ],
};
const AdvancedSegmentation = ({ segment = null, onSave, onCancel }) => {
  const isEditing = Boolean(segment);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: segment?.name || '',
    description: segment?.description || '',
    is_dynamic: segment?.is_dynamic ?? true,
    auto_update: segment?.auto_update ?? true,
    type: 'demographic',
    rules: [
      { id: Date.now(), logic: 'AND', type: 'demographic', field: 'age', operator: 'equals', value: '' },
    ],
  });
  const availableFields = useMemo(() => FIELD_LIBRARY, []);
  const validate = useCallback(() => {
    const next = {};
    if (!data.name.trim()) next.name = 'Nome do segmento é obrigatório.';
    if (!Array.isArray(data.rules) || data.rules.length === 0) next.rules = 'Adicione pelo menos uma regra.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [data]);
  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  };
  const addRule = () => {
    setData((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        { id: Date.now() + Math.random(), logic: 'AND', type: 'demographic', field: 'age', operator: 'equals', value: '' },
      ],
    }));
  };
  const removeRule = (id) => {
    setData((prev) => ({ ...prev, rules: prev.rules.filter((r) => r.id !== id) }));
  };
  const handleRuleChange = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      rules: prev.rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };
  const getOperatorsFor = (fieldType) => OPERATORS_BY_TYPE[fieldType] || OPERATORS_BY_TYPE.text;
  const renderRuleValue = (rule) => {
    const fieldDef = availableFields[rule.type]?.find((f) => f.value === rule.field);
    const t = fieldDef?.type || 'text';
    if (t === 'select' && Array.isArray(fieldDef?.options)) {
      return (
        <Select value={rule.value} onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}>
          <option value="">Selecione</option>
          {fieldDef.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
      );
    }
    if (t === 'number') {
      return (
        <Input
          type="number"
          value={rule.value}
          onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
          placeholder="Valor numérico"
        />
      );
    }
    if (t === 'date') {
      return (
        <Input
          type="date"
          value={rule.value}
          onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
        />
      );
    }
    return (
      <Input
        value={rule.value}
        onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
        placeholder="Valor"
      />
    );
  };
  const onSubmit = () => {
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
          <Card.Title className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>{isEditing ? 'Editar Segmento' : 'Novo Segmento Avançado'}</span>
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="name">Nome *</InputLabel>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Ativos Premium"
                className={errors.name ? 'border-red-500' : ''}
              />
              <InputError text={errors.name} />
            </div>
            <div>
              <InputLabel htmlFor="description">Descrição</InputLabel>
              <Input
                id="description"
                value={data.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva o segmento"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={data.is_dynamic} onCheckedChange={(v) => handleChange('is_dynamic', v)} />
                <span className="text-sm">Dinâmico</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={data.auto_update} onCheckedChange={(v) => handleChange('auto_update', v)} />
                <span className="text-sm">Auto-atualizar</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-600">Estimativa</div>
              <div className="text-lg font-semibold">—</div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Regras</span>
              </h3>
              <Button onClick={addRule} size="sm" variant="outline" className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Adicionar Regra
              </Button>
            </div>
            <div className="space-y-4">
              {data.rules.map((rule) => {
                const fields = availableFields[rule.type] || [];
                const currentField = fields.find((f) => f.value === rule.field) || fields[0] || { type: 'text' };
                const ops = getOperatorsFor(currentField.type);
                return (
                  <div key={rule.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <div>
                        <InputLabel>Tipo</InputLabel>
                        <Select value={rule.type} onChange={(e) => handleRuleChange(rule.id, 'type', e.target.value)}>
                          {TYPE_OPTIONS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <InputLabel>Campo</InputLabel>
                        <Select value={rule.field} onChange={(e) => handleRuleChange(rule.id, 'field', e.target.value)}>
                          {fields.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <InputLabel>Operador</InputLabel>
                        <Select value={rule.operator} onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value)}>
                          {ops.map((op) => (
                            <option key={op.value} value={op.value}>{op.label}</option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <InputLabel>Valor</InputLabel>
                        {renderRuleValue(rule)}
                      </div>
                      <div>
                        <Button variant="destructive" onClick={() => removeRule(rule.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-green-800 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                Estimativa de alcance
              </h4>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">—</div>
                <div className="text-sm text-green-600">baseado nas regras</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button onClick={onCancel} variant="outline" disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={onSubmit} disabled={loading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Segmento'}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
AdvancedSegmentation.propTypes = {
  segment: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};
export default AdvancedSegmentation;
