/**
 * Componente Separator - Separador Visual
 *
 * @description
 * Componente de separador visual usado para dividir se??es ou elementos
 * em uma interface. Suporta orienta??o horizontal e vertical, com estilos
 * customiz?veis.
 *
 * Funcionalidades principais:
 * - Orienta??o horizontal ou vertical
 * - Estilos customiz?veis via className
 * - Suporte completo a dark mode
 * - Acessibilidade (role="separator")
 * - Integra??o com React.forwardRef
 *
 * @module components/ui/Separator
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { Separator } from '@/shared/components/ui/separator';
 *
 * // Separador horizontal
 * <div>
          *   
        </div><p>Conte?do acima</p>
 *   <Separator / />
 *   <p>Conte?do abaixo</p>
 * </div>
 *
 * // Separador vertical
 * <div className="*   ">$2</div><p>Conte?do esquerda</p>
 *   <Separator orientation="vertical" / />
 *   <p>Conte?do direita</p>
 * </div>
 * ```
 */

import React from "react";
import { cn } from '@/lib/utils';

/**
 * Orienta??es dispon?veis para o separator
 *
 * @typedef {'horizontal' | 'vertical'} SeparatorOrientation
 */
type SeparatorOrientation = "horizontal" | "vertical";

/**
 * Props do componente Separator
 *
 * @description
 * Propriedades que podem ser passadas para o componente Separator.
 *
 * @interface SeparatorProps
 * @extends React.HTMLAttributes<HTMLDivElement />
 * @property {SeparatorOrientation} [orientation='horizontal'] - Orienta??o do separador (opcional, padr?o: 'horizontal')
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation;
  className?: string;
}

/**
 * Componente Separator
 *
 * @description
 * Renderiza um separador visual com orienta??o horizontal ou vertical.
 * Usa React.forwardRef para permitir acesso direto ao elemento.
 *
 * @component
 * @param {SeparatorProps} props - Props do componente
 * @param {SeparatorOrientation} [props.orientation='horizontal'] - Orienta??o do separador
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de separador
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "horizontal", className = "", ...props }, ref) => {
    return (
              <div
        ref={ ref }
        role="separator"
        aria-orientation={ orientation }
        className={cn(
          "shrink-0 bg-gray-200 dark:bg-gray-700",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        )} { ...props } />);

        </div>
  },);

Separator.displayName = "Separator";

export { Separator };

export default Separator;
