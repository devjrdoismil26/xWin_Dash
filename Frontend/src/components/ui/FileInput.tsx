import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import InputError from './InputError.jsx';
import InputLabel from './InputLabel.jsx';

const formatBytes = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const FileInput = ({ label, value, onChange, error, accept, multiple = false, maxSize, className = '', disabled = false }) => {
  const fileInputRef = React.useRef(null);
  const [dragOver, setDragOver] = React.useState(false);

  const handleFileSelect = React.useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      const fileArray = Array.from(files);

      if (maxSize) {
        const oversizedFiles = fileArray.filter((file) => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
          alert(`Alguns arquivos excedem o tamanho máximo de ${maxSizeMB}MB`);
          return;
        }
      }

      onChange(multiple ? fileArray : fileArray[0]);
    },
    [onChange, multiple, maxSize],
  );

  const handleInputChange = (e) => handleFileSelect(e.target.files);

  const handleDrop = React.useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const openFileDialog = () => fileInputRef.current && fileInputRef.current.click();

  const files = multiple ? (Array.isArray(value) ? value : []).slice(0, 50) : value ? [value] : [];

  return (
    <div className={className}>
      {label && <InputLabel value={label} />}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={disabled ? undefined : handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(false);
        }}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleInputChange} accept={accept} multiple={multiple} disabled={disabled} />
        <div className="space-y-2">
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Clique ou arraste arquivos para enviar</p>
          {accept && <p className="text-xs text-gray-500">Tipos permitidos: {accept}</p>}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                {'size' in file && <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>}
              </div>
              <Button type="button" variant="ghost" size="sm" className="ml-2" onClick={() => onChange(multiple ? files.filter((_, i) => i !== index) : null)}>
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && <InputError text={error} />}
    </div>
  );
};

FileInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default FileInput;
