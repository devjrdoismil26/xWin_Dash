import React from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
const SegmentRuleBuilder = ({ rules = [], availableFields = [], operators = [], onChange }) => {
  const addRule = () => {
    if (!availableFields.length || !operators.length) return;
    const next = [
      ...rules,
      { id: Date.now(), field: availableFields[0].value, operator: operators[0].value, value: '' },
    ];
    onChange?.(next);
  };
  const removeRule = (index) => {
    const next = rules.filter((_, i) => i !== index);
    onChange?.(next);
  };
  const updateRule = (index, field, value) => {
    const next = rules.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    onChange?.(next);
  };
  return (
    <Card>
      <Card.Content>
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={rule.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <Select
                value={rule.field}
                onChange={(e) => updateRule(index, 'field', e.target.value)}
                options={availableFields.map((f) => ({ value: f.value, label: f.label }))}
              />
              <Select
                value={rule.operator}
                onChange={(e) => updateRule(index, 'operator', e.target.value)}
                options={operators.map((op) => ({ value: op.value, label: op.label }))}
              />
              <Input
                type="text"
                value={rule.value}
                onChange={(e) => updateRule(index, 'value', e.target.value)}
                placeholder="Valor"
              />
              <Button variant="destructive" onClick={() => removeRule(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div>
            <Button onClick={addRule} variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar Regra
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
SegmentRuleBuilder.propTypes = {
  rules: PropTypes.array,
  availableFields: PropTypes.array,
  operators: PropTypes.array,
  onChange: PropTypes.func,
};
export default SegmentRuleBuilder;
