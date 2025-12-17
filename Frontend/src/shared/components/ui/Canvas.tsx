/**
 * Componente Canvas - Canvas Interativo
 *
 * @description
 * Componente de canvas interativo com suporte a grid, zoom, pan (arrastar)
 * e snap to grid. Inclui sub-componentes para toolbar, sidebar, status bar,
 * zoom controls e tool mode selector.
 *
 * Funcionalidades principais:
 * - Grid visual configurável
 * - Zoom com Ctrl+wheel (0.1x a 3x)
 * - Pan (arrastar) com mouse médio ou Ctrl+clique
 * - Snap to grid
 * - Sub-componentes modulares (CanvasToolbar, CanvasSidebar, CanvasStatusBar, ZoomControls, ToolModeSelector)
 * - Callbacks para mudanças de zoom e pan
 *
 * @module components/ui/Canvas
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Canvas, { CanvasToolbar, ZoomControls } from '@/shared/components/ui/Canvas';
 *
 * function MyComponent() {
 *   return (
         *     <Canvas
 *       showGrid
 *       gridSize={ 20 }
 *       zoom={ 1 }
 *       onZoomChange={ setZoom }
 *       onPanChange={ setPan }
 * />
 *       <CanvasToolbar position="top-right" />
 *         <ZoomControls zoom={zoom} onZoomChange={setZoom} / />
 *       </CanvasToolbar>
 *     </Canvas>
 *);

 * }
 * ```
 */

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props do componente Canvas
 *
 * @description
 * Propriedades que podem ser passadas para o componente Canvas.
 * Estende todas as propriedades de div HTML padrão.
 *
 * @interface CanvasProps
 * @extends React.HTMLAttributes<HTMLDivElement />
 * @property {React.ReactNode} children - Conteúdo do canvas
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padrão: '')
 * @property {boolean} [showGrid=true] - Se mostra o grid (opcional, padrão: true)
 * @property {number} [gridSize=20] - Tamanho do grid em pixels (opcional, padrão: 20)
 * @property {boolean} [snapToGrid=true] - Se deve alinhar elementos ao grid (opcional, padrão: true)
 * @property {number} [zoom=1] - Nível de zoom atual (opcional, padrão: 1)
 * @property {(zoom: number) => void} [onZoomChange] - Callback ao alterar zoom (opcional)
 * @property {(pan: { x: number; y: number }) => void} [onPanChange] - Callback ao alterar pan (opcional)
 */
interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  showGrid?: boolean;
  gridSize?: number;
  snapToGrid?: boolean;
  zoom?: number;
  onZoomChange??: (e: any) => void;
  onPanChange??: (e: any) => void;
}

/**
 * Componente Canvas
 *
 * @description
 * Renderiza um canvas interativo com grid, zoom e pan. Suporta interações
 * de mouse para arrastar (pan) e scroll com Ctrl para zoom.
 *
 * @component
 * @param {CanvasProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conteúdo do canvas
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {boolean} [props.showGrid=true] - Se mostra o grid
 * @param {number} [props.gridSize=20] - Tamanho do grid
 * @param {boolean} [props.snapToGrid=true] - Se alinha ao grid
 * @param {number} [props.zoom=1] - Nível de zoom
 * @param {(zoom: number) => void} [props.onZoomChange] - Callback ao alterar zoom
 * @param {(pan: { x: number; y: number }) => void} [props.onPanChange] - Callback ao alterar pan
 * @returns {JSX.Element} Componente de canvas
 */
const Canvas: React.FC<CanvasProps> = ({ children, 
  className = '',
  showGrid = true,
  gridSize = 20,
  snapToGrid = true,
  zoom = 1,
  onZoomChange,
  onPanChange,
  ...props 
   }) => {
  const [isDragging, setIsDragging] = useState(false);

  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [pan, setPan] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<any>(null);

  const handleMouseDown = useCallback((e: unknown) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
      setIsDragging(true);

      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });

      e.preventDefault();

    } , [pan]);

  const handleMouseMove = useCallback((e: unknown) => {
    if (isDragging) {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y};

      setPan(newPan);

      onPanChange?.(newPan);

    } , [isDragging, dragStart, onPanChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);

  }, []);

  const handleWheel = useCallback((e: unknown) => {
    if (e.ctrlKey) {
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(3, zoom + delta));

      onZoomChange?.(newZoom);

    } , [zoom, onZoomChange]);

  return (
        <>
      <div
      ref={ canvasRef }
      className={cn('canvas-container', className)} onMouseDown={ handleMouseDown }
      onMouseMove={ handleMouseMove }
      onMouseUp={ handleMouseUp }
      onMouseLeave={ handleMouseUp }
      onWheel={ handleWheel }
      style={cursor: isDragging ? 'grabbing' : 'grab' } { ...props }>
      </div>{/* Grid Background */}
      {showGrid && (
        <div
          className="canvas-grid"
          style={backgroundSize: `${gridSize} px ${gridSize}px`,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
          } />
          )}
        </div>

      {/* Canvas Content */}
      <div
        className="absolute inset-0"
        style={transform: `scale(${zoom} ) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0'
        } >
           
        </div>{children}
      </div>);};

/**
 * Props do componente CanvasToolbar
 *
 * @interface CanvasToolbarProps
 * @property {React.ReactNode} children - Conteúdo da toolbar
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padrão: '')
 * @property {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [position='top-left'] - Posição da toolbar (opcional, padrão: 'top-left')
 */
interface CanvasToolbarProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; }

/**
 * Componente CanvasToolbar - Barra de Ferramentas do Canvas
 *
 * @description
 * Componente auxiliar que renderiza uma barra de ferramentas flutuante
 * para o canvas em posições predefinidas.
 *
 * @component
 * @param {CanvasToolbarProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conteúdo da toolbar
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [props.position='top-left'] - Posição da toolbar
 * @returns {JSX.Element} Toolbar flutuante estilizada
 */
export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ children, 
  className = '',
  position = 'top-left',
  ...props 
   }) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',};

  return (
        <>
      <div
      className={cn(
        'canvas-toolbar',
        positionClasses[position],
        className
      )} { ...props }>
      </div>{children}
    </div>);};

// Sidebar para o canvas
export const CanvasSidebar = ({ 
  children, 
  className = '',
  position = 'left',
  width = 280,
  ...props 
}) => {
  const positionClasses = {
    left: 'left-0 top-0 h-full border-r',
    right: 'right-0 top-0 h-full border-l',
    top: 'top-0 left-0 w-full border-b',
    bottom: 'bottom-0 left-0 w-full border-t',};

  return (
        <>
      <div
      className={cn(
        'canvas-sidebar',
        positionClasses[position],
        className
      )} style={width: position === 'left' || position === 'right' ? width : 'auto',
        height: position === 'top' || position === 'bottom' ? width : 'auto'
      } { ...props }>
      </div>{children}
    </div>);};

// Status bar para o canvas
export const CanvasStatusBar = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
        <>
      <div
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex items-center justify-between',
        className
      )} { ...props }>
      </div>{children}
    </div>);};

// Zoom controls
export const ZoomControls = ({ 
  zoom, 
  onZoomChange, 
  className = '',
  ...props 
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(3, zoom + 0.1);

    onZoomChange?.(newZoom);};

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, zoom - 0.1);

    onZoomChange?.(newZoom);};

  const handleResetZoom = () => {
    onZoomChange?.(1);};

  return (
        <>
      <div className={cn('flex items-center gap-1 border rounded-lg p-1 bg-white', className)} { ...props }>
      </div><button
        onClick={ handleZoomOut }
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Zoom Out" />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" / /></svg></button>
      <span className="{Math.round(zoom * 100)}%">$2</span>
      </span>
      <button
        onClick={ handleZoomIn }
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Zoom In" />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" / /></svg></button>
      <button
        onClick={ handleResetZoom }
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Reset Zoom" />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" / /></svg></button>
    </div>);};

// Tool mode selector
export const ToolModeSelector = ({ 
  mode, 
  onModeChange, 
  className = '',
  ...props 
}) => {
  const modes = [
    { id: 'select', icon: '🖱️', label: 'Select' },
    { id: 'pan', icon: '✋', label: 'Pan' },
    { id: 'add', icon: '➕', label: 'Add' },
  ];

  return (
        <>
      <div className={cn('flex items-center gap-1 border rounded-lg p-1 bg-white', className)} { ...props }>
      </div>{(modes || []).map((toolMode: unknown) => (
        <button
          key={ toolMode.id }
          onClick={ () => onModeChange?.(toolMode.id) }
          className={cn(
            'p-1 rounded transition-colors',
            mode === toolMode.id 
              ? 'bg-primary-100 text-primary-700' 
              : 'hover:bg-gray-100'
          )} title={ toolMode.label  }>
          <span className="text-sm">{toolMode.icon}</span>
      </button>
    </>
  ))}
    </div>);};

export default Canvas;
