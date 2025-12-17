import React from 'react';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select, { SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import Switch from '@/shared/components/ui/Switch';
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
  options = [] as unknown[],
  placeholder,
  disabled = false,
  error
}) {
  const handleChange = (newValue: unknown) => {
    if (onChange) {
      onChange(newValue);

    } ;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
        <>
      <Select value={value} onValueChange={handleChange} disabled={ disabled } />
      <SelectTrigger />
              <SelectValue placeholder={placeholder || 'Selecione uma opção'} / /></SelectTrigger><SelectContent />
              {(options || []).map((option: unknown) => (
                <SelectItem key={option.value} value={ option.value } />
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>);

      case 'switch':
        return (
                  <Switch
            checked={ value || false }
            onCheckedChange={ handleChange }
            disabled={ disabled }
          / />);

      case 'textarea':
        return (
                  <textarea
            value={ value || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value) }
            placeholder={ placeholder }
            disabled={ disabled }
            className="w-full p-2 border border-gray-300 rounded-md resize-vertical"
            rows={ 3 } />);

      default:
        return (
                  <Input
            type={ type }
            value={ value || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value) }
            placeholder={ placeholder }
            disabled={ disabled } />);

    } ;

  return (
            <div className="{ label && ">$2</div><InputLabel value={label } />}
      {renderInput()}
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>);

});

export default PreferenceInput;
