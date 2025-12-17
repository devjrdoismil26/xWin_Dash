/**
 * Componente GlobalLoader - Loader Global Modal
 *
 * @description
 * Componente que exibe um loader global com backdrop opcional, spinner
 * animado e texto. Ideal para indicar opera??es ass?ncronas que afetam
 * toda a aplica??o.
 *
 * @example
 * ```tsx
 * <GlobalLoader
 *   show={ isLoading }
 *   text="Salvando dados..."
 *   backdrop={ true }
 * / />
 * ```
 *
 * @module components/ui/GlobalLoader
 * @since 1.0.0
 */
import React from "react";
import { LoadingSpinner } from './LoadingStates';

/**
 * Props do componente GlobalLoader
 *
 * @description
 * Propriedades que podem ser passadas para o componente GlobalLoader.
 *
 * @interface GlobalLoaderProps
 * @property {boolean} [show] - Se o loader deve ser exibido (padr?o: true)
 * @property {string} [text] - Texto a ser exibido ao lado do spinner (padr?o: 'Carregando...')
 * @property {string} [className] - Classes CSS adicionais para customiza??o
 * @property {boolean} [backdrop] - Se deve exibir backdrop escuro atr?s do loader (padr?o: true)
 */
interface GlobalLoaderProps {
  /** Se o loader deve ser exibido (padr?o: true) */
show?: boolean;
  /** Texto a ser exibido ao lado do spinner (padr?o: 'Carregando...') */
text?: string;
  /** Classes CSS adicionais para customiza??o */
className?: string;
  /** Se deve exibir backdrop escuro atr?s do loader (padr?o: true) */
backdrop?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente GlobalLoader
 *
 * @description
 * Renderiza um loader global fixo na tela com spinner animado, texto opcional
 * e backdrop opcional. Se show for false, n?o renderiza nada.
 *
 * @component
 * @param {GlobalLoaderProps} props - Props do componente
 * @returns {JSX.Element | null} Modal de loader global estilizado ou null
 */
const GlobalLoader: React.FC<GlobalLoaderProps> = ({ show = true,
  text = "Carregando...",
  className = "",
  backdrop = true,
   }) => {
  if (!show) return null;

  return (
        <>
      <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className} `}
      role="status"
      aria-live="polite">
      </div>{backdrop && <div className="absolute inset-0 bg-black/40" />}
      <div className=" ">$2</div><div>
           
        </div><LoadingSpinner size="md" / />
        </div>
        {text && <span className="text-gray-700">{text}</span>}
      </div>);};

export default React.memo(GlobalLoader);
