import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const TagInput = ({ value = [], onChange, placeholder = 'Digite e pressione Enter...', maxTags, allowDuplicates = true, className = '', disabled = false, ...props }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!allowDuplicates && value.includes(trimmed)) return;
    if (maxTags && value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleInputChange = (e) => setInputValue(e.target.value);
  const handleContainerClick = () => inputRef.current?.focus();

  useEffect(() => {
    if (disabled) setIsFocused(false);
  }, [disabled]);

  return (
    <div
      className={`flex flex-wrap items-center gap-1 p-2 border rounded-md bg-white cursor-text ${
        isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'
      } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'} ${className}`}
      onClick={handleContainerClick}
      {...props}
    >
      {value.map((tag, index) => (
        <span key={index} className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label={`Remover ${tag}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled}
        className="flex-1 min-w-0 border-none outline-none bg-transparent placeholder-gray-400 disabled:cursor-not-allowed"
      />
    </div>
  );
};

TagInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxTags: PropTypes.number,
  allowDuplicates: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default TagInput;
