import React from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
const SegmentRuleBuilder = ({ rules = [] as unknown[], availableFields = [] as unknown[], operators = [] as unknown[], onChange }) => {
  const addRule = () => {
    if (!availableFields.length || !operators.length) return;
    const next = [
      ...rules,
      { id: Date.now(), field: availableFields[0].value, operator: operators[0].value, value: '' },
    ];
    onChange?.(next);};

  const removeRule = (index: unknown) => {
    const next = (rules || []).filter((_: unknown, i: unknown) => i !== index);

    onChange?.(next);};

  const updateRule = (index: unknown, field: unknown, value: unknown) => {
    const next = (rules || []).map((r: unknown, i: unknown) => (i === index ? { ...r, [field]: value } : r));

    onChange?.(next);};

  return (
        <>
      <Card />
      <Card.Content />
        <div className="{(rules || []).map((rule: unknown, index: unknown) => (">$2</div>
            <div key={rule.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
           
        </div><Select
                value={ rule.field }
                onChange={ (e: unknown) => updateRule(index, 'field', e.target.value) }
                options={(availableFields || []).map((f: unknown) => ({ value: f.value, label: f.label }))} />
              <Select
                value={ rule.operator }
                onChange={ (e: unknown) => updateRule(index, 'operator', e.target.value) }
                options={(operators || []).map((op: unknown) => ({ value: op.value, label: op.label }))} />
              <Input
                type="text"
                value={ rule.value }
                onChange={ (e: unknown) => updateRule(index, 'value', e.target.value) }
                placeholder="Valor" />
              <Button variant="destructive" onClick={ () => removeRule(index)  }>
                <Trash2 className="w-4 h-4" /></Button></div>
          ))}
          <div>
           
        </div><Button onClick={addRule} variant="outline" className="flex items-center gap-2" />
              <Plus className="w-4 h-4" /> Adicionar Regra
            </Button></div></Card.Content>
    </Card>);};

SegmentRuleBuilder.propTypes = {
  rules: PropTypes.array,
  availableFields: PropTypes.array,
  operators: PropTypes.array,
  onChange: PropTypes.func,};

export default SegmentRuleBuilder;
