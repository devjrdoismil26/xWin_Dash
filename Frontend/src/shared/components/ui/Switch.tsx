/**
 * Componente Switch - Interruptor de Toggle
 *
 * @description
 * Componente de interruptor toggle com suporte a m?ltiplos tamanhos, labels,
 * descri??es e estados. Usado para alternar entre estados on/off em
 * formul?rios e configura??es.
 *
 * Funcionalidades principais:
 * - M?ltiplos tamanhos (sm, md, lg, xl)
 * - Labels e descri??es opcionais
 * - Estados disabled
 * - Suporte completo a dark mode
 * - Acessibilidade (ARIA, role="switch")
 * - Estados de foco com ring
 *
 * @module components/ui/Switch
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Switch from '@/shared/components/ui/Switch';
 *
 * // Switch b?sico
 * <Switch checked={isOn} onChange={setIsOn} / />
 *
 * // Switch com label e descri??o
 * <Switch
 *   checked={ enabled }
 *   onChange={ setEnabled }
 *   label="Notifica??es"
 *   description="Receber notifica??es por email"
 * / />
 *
 * // Switch desabilitado
 * <Switch checked={false} onChange={() => {} disabled />
 * ```
 */

import React from "react";

/**
 * Tamanhos dispon?veis para o switch
 *
 * @typedef {'sm' | 'md' | 'lg' | 'xl'} ComponentSize
 */
type ComponentSize = "sm" | "md" | "lg" | "xl";

/**
 * Props do componente Switch
 *
 * @description
 * Propriedades que podem ser passadas para o componente Switch.
 *
 * @interface SwitchProps
 * @property {boolean} checked - Estado atual do switch (ligado/desligado)
 * @property {(value: boolean) => void} onChange - Fun??o chamada ao alterar o estado
 * @property {boolean} [disabled=false] - Se o switch est? desabilitado (opcional, padr?o: false)
 * @property {ComponentSize} [size='md'] - Tamanho do switch (opcional, padr?o: 'md')
 * @property {string} [label] - Label do switch (opcional)
 * @property {string} [description] - Descri??o do switch (opcional)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface SwitchProps {
  checked: boolean;
  onChange?: (e: any) => void;
  onCheckedChange??: (e: any) => void;
  disabled?: boolean;
  size?: ComponentSize;
  label?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

/**
 * Componente Switch
 *
 * @description
 * Renderiza um interruptor toggle com suporte a m?ltiplos tamanhos, labels
 * e estados. Componente acess?vel com role="switch" e atributos ARIA.
 *
 * @component
 * @param {SwitchProps} props - Props do componente
 * @param {boolean} props.checked - Estado atual do switch
 * @param {(value: boolean) => void} props.onChange - Fun??o chamada ao alterar
 * @param {boolean} [props.disabled=false] - Se est? desabilitado
 * @param {ComponentSize} [props.size='md'] - Tamanho do switch
 * @param {string} [props.label] - Label do switch
 * @param {string} [props.description] - Descri??o do switch
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de switch
 */
const Switch: React.FC<SwitchProps> = ({ checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
  className = "",
   }) => {
  const sizeClasses = {
    sm: { switch: "h-4 w-7", thumb: "h-3 w-3", translate: "translate-x-3" },
    md: { switch: "h-6 w-11", thumb: "h-5 w-5", translate: "translate-x-5" },
    lg: { switch: "h-8 w-14", thumb: "h-7 w-7", translate: "translate-x-6" },
    xl: { switch: "h-10 w-18", thumb: "h-9 w-9", translate: "translate-x-8" },};

  const currentSize = sizeClasses[size];

  return (
        <>
      <div className={`flex items-center ${className} `}>
      </div><button
        type="button"
        role="switch"
        aria-checked={ checked }
        onClick={ () => !disabled && onChange(!checked) }
        disabled={ disabled }
        className={`
          relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${checked ? "bg-blue-600" : "bg-gray-200"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${currentSize.switch}
        `}
  >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
            checked ? currentSize.translate : "translate-x-0"
          } ${currentSize.thumb}`} />
           
        </span></button>

      {(label || description) && (
        <div className="{label && (">$2</div>
            <span
              className={`text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-900"} `}>
           
        </span>{label}
            </span>
          )}
          {description && (
            <p
              className={`text-sm ${disabled ? "text-gray-300" : "text-gray-500"} `} />
              {description}
            </p>
          )}
        </div>
      )}
    </div>);};

export { Switch };

export default Switch;
