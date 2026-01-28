import React from 'react';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Switch from '@/components/ui/Switch';
/**
 * Preference Input component for user settings
 *
 * @param props
 * @param props.label - Label for the input
 * @param props.type - Type of input ('text', 'select', 'switch', 'textarea')
 * @param props.value - Current value
 * @param props.onChange - Change handler function
 * @param props.options - Options for select type fields
 * @param props.placeholder - Placeholder for the input
 * @param props.disabled - If the field is disabled
 * @param props.error - Error message
 */
const PreferenceInput = React.memo(function PreferenceInput({
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  error
}) {
  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select value={value} onValueChange={handleChange} disabled={disabled}>
            <Select.Trigger>
              <Select.Value placeholder={placeholder || 'Selecione uma opção'} />
            </Select.Trigger>
            <Select.Content>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        );
      case 'switch':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={handleChange}
            disabled={disabled}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full p-2 border border-gray-300 rounded-md resize-vertical"
            rows={3}
          />
        );
      default:
        return (
          <Input
            type={type}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
    }
  };
  return (
    <div className="space-y-2">
      {label && <InputLabel value={label} />}
      {renderInput()}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
});
export default PreferenceInput;
