/**
 * Componente Resizable - Elemento Redimension?vel
 *
 * @description
 * Componente que permite redimensionar elementos filhos em dire??o horizontal
 * ou vertical. Suporta limites m?nimo/m?ximo, callbacks de resize e estados
 * visuais durante o redimensionamento.
 *
 * Funcionalidades principais:
 * - Redimensionamento horizontal ou vertical
 * - Limites m?nimo e m?ximo configur?veis
 * - Callback ao redimensionar
 * - Handle visual para arrastar
 * - Estados durante o resize
 * - Acessibilidade (role="separator", aria-orientation)
 * - Cursor customizado durante resize
 *
 * @module components/ui/Resizable
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Resizable from '@/shared/components/ui/Resizable';
 *
 * // Resizable horizontal
 * <Resizable
 *   direction="horizontal"
 *   defaultSize={ 400 }
 *   minSize={ 200 }
 *   maxSize={ 800 }
 * />
 *   <div>Conte?do redimension?vel</div>
 * </Resizable>
 *
 * // Resizable vertical
 * <Resizable
 *   direction="vertical"
 *   defaultSize={ 300 }
 *   minSize={ 150 }
 *   maxSize={ 600 }
 * />
 *   <div>Conte?do redimension?vel</div>
 * </Resizable>
 * ```
 */

import React from "react";

/**
 * Dire??es dispon?veis para redimensionamento
 *
 * @typedef {'horizontal' | 'vertical'} ResizableDirection
 */
type ResizableDirection = "horizontal" | "vertical";

/**
 * Props do componente Resizable
 *
 * @description
 * Propriedades que podem ser passadas para o componente Resizable.
 * Estende todas as propriedades de div HTML padr?o.
 *
 * @interface ResizableProps
 * @extends React.HTMLAttributes<HTMLDivElement />
 * @property {React.ReactNode} children - Conte?do a ser redimensionado
 * @property {ResizableDirection} [direction='horizontal'] - Dire??o de redimensionamento (opcional, padr?o: 'horizontal')
 * @property {number} [defaultSize=300] - Tamanho padr?o em pixels (opcional, padr?o: 300)
 * @property {number} [minSize=200] - Tamanho m?nimo em pixels (opcional, padr?o: 200)
 * @property {number} [maxSize=800] - Tamanho m?ximo em pixels (opcional, padr?o: 800)
 * @property {(size: number) => void} [onResize] - Callback chamado ao redimensionar (opcional)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: ResizableDirection;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  onResize??: (e: any) => void;
  className?: string;
}

/**
 * Componente Resizable
 *
 * @description
 * Renderiza um container redimension?vel com handle visual para arrastar.
 * Gerencia estados de mouse (down, move, up) para controlar o redimensionamento.
 *
 * @component
 * @param {ResizableProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do a ser redimensionado
 * @param {ResizableDirection} [props.direction='horizontal'] - Dire??o de resize
 * @param {number} [props.defaultSize=300] - Tamanho padr?o
 * @param {number} [props.minSize=200] - Tamanho m?nimo
 * @param {number} [props.maxSize=800] - Tamanho m?ximo
 * @param {(size: number) => void} [props.onResize] - Callback ao redimensionar
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente resizable
 */
const Resizable: React.FC<ResizableProps> = ({ children,
  direction = "horizontal",
  defaultSize = 300,
  minSize = 200,
  maxSize = 800,
  onResize,
  className = "",
  ...props
   }) => {
  const [size, setSize] = React.useState(defaultSize);

  const [isResizing, setIsResizing] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const startPos = React.useRef(0);

  const startSize = React.useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);

    startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
    startSize.current = size;
    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("mouseup", handleMouseUp);};

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
    const delta = currentPos - startPos.current;
    const next = Math.min(
      Math.max(startSize.current + delta, minSize),
      maxSize,);

    setSize(next);

    onResize?.(next);};

  const handleMouseUp = () => {
    setIsResizing(false);

    document.removeEventListener("mousemove", handleMouseMove);

    document.removeEventListener("mouseup", handleMouseUp);};

  const containerStyle = {
    [direction === "horizontal" ? "width" : "height"]: `${size}px`,};

  const handleStyle =
    direction === "horizontal"
      ? { cursor: "col-resize", width: "4px", height: "100%" }
      : { cursor: "row-resize", width: "100%", height: "4px"};

  return (
        <>
      <div
      ref={ containerRef }
      className={`relative ${className} `}
      style={containerStyle} { ...props }>
      </div>{children}
      <div
        role="separator"
        aria-orientation={ direction === "horizontal" ? "vertical" : "horizontal"
         }
        onMouseDown={ handleMouseDown }
        className={`absolute bg-gray-300 hover:bg-blue-500 transition-colors ${direction === "horizontal" ? "right-0 top-0" : "bottom-0 left-0"} `}
        style={handleStyle  }>
          {isResizing && <div className="absolute inset-0 cursor-ew-resize" />}
    </div>);};

export default Resizable;
