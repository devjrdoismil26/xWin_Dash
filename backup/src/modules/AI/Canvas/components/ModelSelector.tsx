import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@/components/ui/select';
const models = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];
const ModelSelector = ({ selectedModel, onModelChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Model:</label>
      <Select 
        value={selectedModel} 
        onChange={(value) => onModelChange(value)}
        options={models}
      />
    </div>
  );
};
ModelSelector.propTypes = {
  selectedModel: PropTypes.string.isRequired,
  onModelChange: PropTypes.func.isRequired,
};
export default ModelSelector;
