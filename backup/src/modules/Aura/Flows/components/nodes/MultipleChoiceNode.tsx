import React from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
const MultipleChoiceNode = ({ config = {}, onChange }) => {
  const handleQuestionChange = (e) => {
    onChange?.({ ...config, question: e.target.value });
  };
  const handleOptionsChange = (e) => {
    const optionsText = e.target.value;
    const optionLines = optionsText.split('\n').filter(line => line.trim());
    // Converter para formato esperado pelo backend: array de objetos {value, next_node_id}
    const options = optionLines.map((line, index) => ({
      value: line.trim(),
      next_node_id: null, // Será definido via conexões visuais
      label: line.trim()
    }));
    onChange?.({ ...config, options, optionsText });
  };
  return (
    <Card title="Múltipla Escolha">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pergunta
          </label>
          <Textarea 
            value={config.question || ''} 
            onChange={handleQuestionChange}
            placeholder="Digite sua pergunta..."
            className="min-h-[80px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opções (uma por linha)
          </label>
          <Textarea 
            value={config.optionsText || (config.options || []).map(opt => opt.label || opt.value).join('\n')} 
            onChange={handleOptionsChange}
            placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
            className="min-h-[100px]"
          />
          {config.options && config.options.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {config.options.length} opções configuradas
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
export default MultipleChoiceNode;
