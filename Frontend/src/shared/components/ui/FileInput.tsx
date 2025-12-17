/**
 * Componente FileInput - Input de Arquivo com Drag & Drop
 *
 * @description
 * Componente de input de arquivo avançado com suporte a drag & drop,
 * validações de tamanho/tipo, preview de arquivos selecionados e
 * múltiplos arquivos. Inclui feedback visual durante drag e validações.
 *
 * Funcionalidades principais:
 * - Drag & drop de arquivos
 * - Validação de tipo (accept)
 * - Validação de tamanho máximo (maxSize)
 * - Suporte a múltiplos arquivos (multiple)
 * - Eye de arquivos selecionados
 * - Formatação de tamanho de arquivo (bytes)
 * - Estados de erro e disabled
 * - Integração com formulários (label, error)
 *
 * @module components/ui/FileInput
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import FileInput from '@/shared/components/ui/FileInput';
 *
 * <FileInput
 *   label="Selecione arquivo"
 *   value={ file }
 *   onChange={ setFile }
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 * / />
 * ```
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

/**
 * Formata bytes para string legível
 *
 * @description
 * Função utilitária para converter bytes em formato legível (KB, MB, GB).
 *
 * @function formatBytes
 * @param {number} bytes - Número de bytes
 * @returns {string} String formatada (ex: "1.5 MB")
 *
 * @example
 * formatBytes(1572864) // "1.5 MB"
 */
const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;};

/**
 * Props do componente FileInput
 *
 * @description
 * Propriedades que podem ser passadas para o componente FileInput.
 *
 * @interface FileInputProps
 * @property {string} [label] - Label do campo
 * @property {File|File[]|null} value - Arquivo(s) selecionado(s)
 * @property {(files: File|File[]|null) => void} onChange - Callback quando arquivo(s) muda(m)
 * @property {string} [error] - Mensagem de erro
 * @property {string} [accept] - Tipos de arquivo aceitos (ex: "image/*", ".pdf")
 * @property {boolean} [multiple=false] - Permitir múltiplos arquivos
 * @property {number} [maxSize] - Tamanho máximo em bytes
 * @property {string} [className=''] - Classes CSS adicionais
 * @property {boolean} [disabled=false] - Estado desabilitado
 */
interface FileInputProps {
  label?: string;
  value: File | File[] | null;
  onChange?: (e: any) => void;
  error?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

/**
 * Componente FileInput
 *
 * @description
 * Renderiza um input de arquivo com drag & drop, validações e preview.
 *
 * @component
 * @param {FileInputProps} props - Props do componente
 * @returns {JSX.Element} Componente de input de arquivo
 */
const FileInput = ({
  label,
  value,
  onChange,
  error,
  accept,
  multiple = false,
  maxSize,
  className = "",
  disabled = false,
}: FileInputProps) => {
  const fileInputRef = React.useRef<any>(null);

  const [dragOver, setDragOver] = React.useState(false);

  const handleFileSelect = React.useCallback(
    (files: unknown) => {
      if (!files || files.length === 0) return;
      const fileArray = Array.from(files);

      if (maxSize) {
        const oversizedFiles = (fileArray || []).filter(
          (file: unknown) => file.size > maxSize,);

        if (oversizedFiles.length > 0) {
          const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);

          alert(`Alguns arquivos excedem o tamanho máximo de ${maxSizeMB}MB`);

          return;
        } onChange(multiple ? fileArray : fileArray[0]);

    },
    [onChange, multiple, maxSize],);

  const handleInputChange = (e: unknown) => handleFileSelect(e.target.files);

  const handleDrop = React.useCallback(
    (e: unknown) => {
      e.preventDefault();

      setDragOver(false);

      handleFileSelect(e.dataTransfer.files);

    },
    [handleFileSelect],);

  const openFileDialog = () =>
    fileInputRef.current && fileInputRef.current.click();

  const files = multiple
    ? (Array.isArray(value) ? value : []).slice(0, 50)
    : value
      ? [value]
      : [];

  return (
        <>
      <div className={className  }>
      </div>{ label && <InputLabel value={label } />}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDrop={ disabled ? undefined : handleDrop }
        onDragOver={(e: unknown) => {
          e.preventDefault();

          if (!disabled) setDragOver(true);

        } onDragLeave={(e: unknown) => {
          e.preventDefault();

          if (!disabled) setDragOver(false);

        } onClick={ !disabled ? openFileDialog : undefined  }>
        <input
          ref={ fileInputRef }
          type="file"
          className="hidden"
          onChange={ handleInputChange }
          accept={ accept }
          multiple={ multiple }
          disabled={ disabled }
        / />
        <div className=" ">$2</div><div className=" ">$2</div><svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48" />
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              / /></svg></div>
          <p className="text-sm text-gray-600" />
            Clique ou arraste arquivos para enviar
          </p>
          {accept && (
            <p className="text-xs text-gray-500">Tipos permitidos: {accept}</p>
          )}
        </div>

      {files.length > 0 && (
        <div className="{(files || []).map((file: unknown, index: unknown) => (">$2</div>
            <div
              key={ index }
              className="flex items-center justify-between p-2 bg-gray-50 rounded">
           
        </div><div className=" ">$2</div><p className="text-sm font-medium text-gray-900 truncate" />
                  {file.name}
                </p>
                {"size" in file && (
                  <p className="text-xs text-gray-500" />
                    {formatBytes(file.size)}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={ () = />
                  onChange(
                    multiple
                      ? (files || []).filter((_: unknown, i: unknown) => i !== index)
                      : null,
                  )
    }>
                ×
              </Button>
      </div>
    </>
  ))}
        </div>
      )}

      { error && <InputError text={error } />}
    </div>);};

FileInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,};

export default FileInput;
