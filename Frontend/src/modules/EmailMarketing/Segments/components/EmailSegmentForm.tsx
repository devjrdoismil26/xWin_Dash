import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Users, Save, Plus, Trash2, Filter } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
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
  ],};

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
    const next = {} as any;
    if (!data.name.trim()) next.name = 'Nome do segmento é obrigatório.';
    if (!Array.isArray(data.criteria) || (data as any).criteria.length === 0) next.criteria = 'Adicione pelo menos um critério.';
    setErrors(next);

    return Object.keys(next).length === 0;
  }, [data]);

  const updateCriterion = (index: unknown, field: unknown, value: unknown) => {
    setData((prev: unknown) => {
      const next = [...prev.criteria];
      next[index] = { ...next[index], [field]: value};

      return { ...prev, criteria: next};

    });};

  const addCriterion = () => {
    setData((prev: unknown) => ({
      ...prev,
      criteria: [...prev.criteria, { field: 'email', operator: 'contains', value: '', logic: 'AND' }],
    }));};

  const removeCriterion = (index: unknown) => {
    setData((prev: unknown) => ({
      ...prev,
      criteria: (prev.criteria || []).filter((_: unknown, i: unknown) => i !== index),
    }));};

  const getOperatorsForField = (fieldName: unknown) => {
    const field = DEFAULT_FIELDS.find((f: unknown) => f.value === fieldName);

    return OPERATORS[field?.type || 'text'];};

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);

    try {
      onSave?.(data);

    } finally {
      setLoading(false);

    } ;

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <div className=" ">$2</div><Card.Title className="flex items-center space-x-2" />
              <Users className="w-5 h-5" />
              <span>{isEditing ? 'Editar Segmento' : 'Novo Segmento'}</span>
            </Card.Title>
            <div className=" ">$2</div><Button onClick={onCancel} variant="outline" disabled={ loading }>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex items-center space-x-2" />
                <Save className="w-4 h-4" />
                <span>{loading ? 'Salvando...' : 'Salvar Segmento'}</span></Button></div>
        </Card.Header>
        <Card.Content className="space-y-6" />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="name">Nome *</InputLabel>
              <Input id="name" value={data.name} onChange={(e: unknown) => setData((p: unknown) => ({ ...p, name: e.target.value }))} placeholder="Ex: Engajados" className={errors.name ? 'border-red-500' : '' } />
              <InputError text={errors.name} / /></div><div>
           
        </div><InputLabel htmlFor="description">Descrição</InputLabel>
              <Input id="description" value={data.description} onChange={(e: unknown) => setData((p: unknown) => ({ ...p, description: e.target.value }))} placeholder="Descrição do segmento..." /></div><div className=" ">$2</div><h3 className="font-medium flex items-center space-x-2" />
              <Filter className="w-4 h-4" />
              <span>Critérios</span></h3><Button type="button" onClick={addCriterion} size="sm" />
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button></div><div className="{(data.criteria || []).map((criterion: unknown, index: unknown) => (">$2</div>
              <div key={`criterion-${index}`} className="border rounded-lg p-4 bg-gray-50">
           
        </div><div className=" ">$2</div><div>
           
        </div><InputLabel>Lógica</InputLabel>
                    <Select value={criterion.logic} onChange={ (e: unknown) => updateCriterion(index, 'logic', e.target.value)  }>
                      <option value="AND">AND</option>
                      <option value="OR">OR</option></Select></div>
                  <div>
           
        </div><InputLabel>Campo</InputLabel>
                    <Select value={criterion.field} onChange={ (e: unknown) => updateCriterion(index, 'field', e.target.value)  }>
                      {(DEFAULT_FIELDS || []).map((f: unknown) => (
                        <option key={f.value} value={ f.value }>{f.label}</option>
                      ))}
                    </Select></div><div>
           
        </div><InputLabel>Operador</InputLabel>
                    <Select value={criterion.operator} onChange={ (e: unknown) => updateCriterion(index, 'operator', e.target.value)  }>
                      {getOperatorsForField(criterion.field).map((op: unknown) => (
                        <option key={op.value} value={ op.value }>{op.label}</option>
                      ))}
                    </Select></div><div>
           
        </div><InputLabel>Valor</InputLabel>
                    <Input value={criterion.value} onChange={(e: unknown) => updateCriterion(index, 'value', e.target.value)} placeholder="Valor" /></div><div className=" ">$2</div><Button type="button" onClick={() => removeCriterion(index)} size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" /> Remover
                  </Button>
      </div>
    </>
  ))}
          </div>
        </Card.Content></Card></div>);};

EmailSegmentForm.propTypes = {
  segment: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,};

export default EmailSegmentForm;
