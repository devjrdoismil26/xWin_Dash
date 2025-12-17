/**
 * Componente TagInput - Campo de Entrada de Tags
 *
 * @description
 * Componente de entrada de tags que permite adicionar e remover tags
 * dinamicamente. Suporta valida??es, limites de tags, duplicatas e estados
 * de foco/desabilitado.
 *
 * Funcionalidades principais:
 * - Adi??o de tags via Enter ou v?rgula
 * - Remo??o de tags individualmente ou via Backspace
 * - Controle de duplicatas
 * - Limite m?ximo de tags
 * - Estados de foco e disabled
 * - Feedback visual com estados de hover e focus
 * - Acessibilidade (ARIA labels)
 *
 * @module components/ui/TagInput
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import TagInput from '@/shared/components/ui/TagInput';
 *
 * // TagInput b?sico
 * <TagInput
 *   value={ tags }
 *   onChange={ setTags }
 *   placeholder="Digite tags aqui..."
 * / />
 *
 * // TagInput com limite e sem duplicatas
 * <TagInput
 *   value={ tags }
 *   onChange={ setTags }
 *   maxTags={ 5 }
 *   allowDuplicates={ false }
 * / />
 *
 * // TagInput desabilitado
 * <TagInput
 *   value={ tags }
 *   onChange={ setTags }
 *   disabled
 * / />
 * ```
 */

import React, { useEffect, useRef, useState } from "react";
import { X } from 'lucide-react';
import PropTypes from "prop-types";

/**
 * Props do componente TagInput
 *
 * @description
 * Propriedades que podem ser passadas para o componente TagInput.
 * Estende todas as propriedades de div HTML padr?o.
 *
 * @interface TagInputProps
 * @extends React.HTMLAttributes<HTMLDivElement />
 * @property {string[]} [value=[]] - Array de tags atuais (opcional, padr?o: [])
 * @property {(tags: string[]) => void} onChange - Fun??o chamada ao alterar as tags
 * @property {string} [placeholder='Digite e pressione Enter...'] - Placeholder do input (opcional, padr?o: 'Digite e pressione Enter...')
 * @property {number} [maxTags] - N?mero m?ximo de tags permitidas (opcional)
 * @property {boolean} [allowDuplicates=true] - Se permite tags duplicadas (opcional, padr?o: true)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 * @property {boolean} [disabled=false] - Se o input est? desabilitado (opcional, padr?o: false)
 */
interface TagInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string[];
  onChange?: (e: any) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * Componente TagInput
 *
 * @description
 * Renderiza um campo de entrada de tags com suporte a adi??o/remo??o
 * din?mica, valida??es e estados customiz?veis.
 *
 * @component
 * @param {TagInputProps} props - Props do componente
 * @param {string[]} [props.value=[]] - Array de tags atuais
 * @param {(tags: string[]) => void} props.onChange - Fun??o ao alterar
 * @param {string} [props.placeholder='Digite e pressione Enter...'] - Placeholder
 * @param {number} [props.maxTags] - Limite m?ximo de tags
 * @param {boolean} [props.allowDuplicates=true] - Se permite duplicatas
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {boolean} [props.disabled=false] - Se est? desabilitado
 * @returns {JSX.Element} Componente de tag input
 */
const TagInput: React.FC<TagInputProps> = ({ value = [] as unknown[],
  onChange,
  placeholder = "Digite e pressione Enter...",
  maxTags,
  allowDuplicates = true,
  className = "",
  disabled = false,
  ...props
   }) => {
  const [inputValue, setInputValue] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<any>(null);

  const addTag = (tag: unknown) => {
    const trimmed = tag.trim();

    if (!trimmed) return;
    if (!allowDuplicates && value.includes(trimmed)) return;
    if (maxTags && value.length >= maxTags) return;
    onChange([...value, trimmed]);

    setInputValue("");};

  const removeTag = (indexToRemove: unknown) => {
    onChange((value || []).filter((_: unknown, index: unknown) => index !== indexToRemove));};

  const handleKeyDown = (e: unknown) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      addTag(inputValue);

    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);

    } ;

  const handleInputChange = (e: unknown) => setInputValue(e.target.value);

  const handleContainerClick = () => inputRef.current?.focus();

  useEffect(() => {
    if (disabled) setIsFocused(false);

  }, [disabled]);

  return (
        <>
      <div
      className={`flex flex-wrap items-center gap-1 p-2 border rounded-md bg-white cursor-text ${
        isFocused ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300"
      } ${disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400"} ${className}`}
      onClick={ handleContainerClick }
      { ...props }>
      </div>{(value || []).map((tag: unknown, index: unknown) => (
        <span
          key={ index }
          className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
           
        </span>{tag}
          <button
            type="button"
            onClick={(e: unknown) => {
              e.stopPropagation();

              removeTag(index);

            } className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label={`Remover ${tag}`}
  >
            <X className="w-3 h-3" /></button></span>
      ))}

      <input
        ref={ inputRef }
        type="text"
        value={ inputValue }
        onChange={ handleInputChange }
        onKeyDown={ handleKeyDown }
        onFocus={ () => setIsFocused(true) }
        onBlur={ () => setIsFocused(false) }
        placeholder={ value.length === 0 ? placeholder : "" }
        disabled={ disabled }
        className="flex-1 min-w-0 border-none outline-none bg-transparent placeholder-gray-400 disabled:cursor-not-allowed" />
    </div>);};

TagInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxTags: PropTypes.number,
  allowDuplicates: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,};

export default TagInput;
