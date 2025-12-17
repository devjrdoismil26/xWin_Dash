/**
 * Componente ModelSelector - Seletor de Modelo de IA
 * @module modules/AI/Canvas/components/ModelSelector
 * @description
 * Componente seletor de modelo de IA para Canvas, fornecendo lista de modelos
 * dispon?veis (Gemini Pro, Gemini Pro Vision, GPT-4, GPT-3.5 Turbo) e permitindo
 * sele??o de modelo.
 * @since 1.0.0
 */
import React from 'react';
import PropTypes from 'prop-types';
import Select from '@/shared/components/ui/Select';

/**
 * Lista de modelos dispon?veis
 * @constant models
 * @type {Array<{value: string, label: string}>}
 */
const models = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];
/**
 * Interface ModelSelectorProps - Props do componente ModelSelector
 * @interface ModelSelectorProps
 * @property {string} selectedModel - Modelo atualmente selecionado
 * @property {function} onModelChange - Fun??o callback chamada ao alterar modelo
 * @property {(value: string) => void} onModelChange - Callback com ID do modelo selecionado
 */
interface ModelSelectorProps {
  selectedModel: string;
  onModelChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ModelSelector - Seletor de Modelo de IA
 * @component
 * @description
 * Componente que renderiza seletor de modelo de IA com lista de modelos
 * dispon?veis e label descritivo.
 * 
 * @param {ModelSelectorProps} props - Props do componente
 * @returns {JSX.Element} Seletor de modelo
 * 
 * @example
 * ```tsx
 * <ModelSelector 
 *   selectedModel="gpt-4"
 *   onModelChange={ (modelId: unknown) => setModel(modelId) }
 * />
 * ```
 */
const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange    }) => {
  return (
            <div className=" ">$2</div><label className="text-sm font-medium">Model:</label>
      <Select 
        value={ selectedModel }
        onChange={ (value: string | number) => onModelChange(value) }
        options={ models } />
    </div>);};

ModelSelector.propTypes = {
  selectedModel: PropTypes.string.isRequired,
  onModelChange: PropTypes.func.isRequired,};

export default ModelSelector;
