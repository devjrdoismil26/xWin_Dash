/**
 * Sistema Touch Gestures - Gestos de Toque Avançados
 *
 * @description
 * Sistema completo de gestos de toque para dispositivos móveis, incluindo
 * swipe (deslizar), pinch (pinçar), long press (pressionar longo), tap
 * (toque) e double tap (toque duplo). Fornece hooks personalizados para
 * cada tipo de gesto e suporte a callbacks customizados.
 *
 * Funcionalidades principais:
 * - useSwipeGesture: Detecção de swipe (left, right, up, down)
 * - usePinchGesture: Detecção de pinch (zoom)
 * - useLongPress: Detecção de long press
 * - useTap: Detecção de tap simples e duplo
 * - Thresholds e velocidades configuráveis
 * - Suporte a múltiplos pontos de toque
 * - Callbacks para cada fase do gesto (start, move, end)
 *
 * @module components/ui/TouchGestures
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useSwipeGesture, usePinchGesture } from '@/shared/components/ui/TouchGestures';
 *
 * const { handlers } = useSwipeGesture({
 * });

 *
 * <div {...handlers}>Conteúdo com gestos</div>
 * ```
 */

import React, { useRef, useCallback, useEffect, useState } from "react";
import { cn } from '@/lib/utils';

/**
 * Ponto de toque
 *
 * @description
 * Define as coordenadas e timestamp de um ponto de toque.
 *
 * @interface TouchPoint
 * @property {number} x - Coordenada X do toque
 * @property {number} y - Coordenada Y do toque
 * @property {number} timestamp - Timestamp do toque em milissegundos
 */
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number; }

export interface GestureEvent {
  type: string;
  startPoint: TouchPoint;
  currentPoint: TouchPoint;
  deltaX: number;
  deltaY: number;
  distance: number;
  velocity: number;
  direction: "left" | "right" | "up" | "down";
  duration: number; }

export interface SwipeGestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  onSwipeLeft??: (e: any) => void;
  onSwipeRight??: (e: any) => void;
  onSwipeUp??: (e: any) => void;
  onSwipeDown??: (e: any) => void; }

export interface PinchGestureOptions {
  threshold?: number;
  onPinchStart??: (e: any) => void;
  onPinch??: (e: any) => void;
  onPinchEnd??: (e: any) => void; }

export interface LongPressOptions {
  delay?: number;
  threshold?: number;
  onLongPress??: (e: any) => void; }

/**
 * Hook useSwipeGesture - Detecção de Swipe
 *
 * @description
 * Hook para detectar gestos de swipe (deslizar) em qualquer direção
 * (left, right, up, down) com thresholds e velocidades configuráveis.
 *
 * @hook
 * @param {SwipeGestureOptions} [options={}] - Opções do gesto de swipe
 * @param {number} [options.threshold=50] - Distância mínima em pixels para considerar swipe
 * @param {number} [options.velocityThreshold=0.3] - Velocidade mínima para considerar swipe
 * @param {(event: GestureEvent) => void} [options.onSwipeLeft] - Callback ao fazer swipe esquerda
 * @param {(event: GestureEvent) => void} [options.onSwipeRight] - Callback ao fazer swipe direita
 * @param {(event: GestureEvent) => void} [options.onSwipeUp] - Callback ao fazer swipe para cima
 * @param {(event: GestureEvent) => void} [options.onSwipeDown] - Callback ao fazer swipe para baixo
 * @returns {Object} Objeto com handlers e estado do gesto
 * @property {Object} handlers - Handlers de eventos touch (onTouchStart, onTouchMove, onTouchEnd)
 * @property {boolean} isTracking - Se está atualmente rastreando um gesto
 *
 * @example
 * ```tsx
 * const { handlers } = useSwipeGesture({
 *   threshold: 50,
 *   onSwipeLeft: () => navigate(-1),
 *   onSwipeRight: () => navigate(1)
 * });

 *
 * <div {...handlers}>Deslize aqui</div>
 * ```
 */
export const useSwipeGesture = (options: SwipeGestureOptions = {} as any) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  } = options;

  const [isTracking, setIsTracking] = useState(false);

  const startPoint = useRef<TouchPoint | null>(null);

  const lastPoint = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),};

    startPoint.current = point;
    lastPoint.current = point;
    setIsTracking(true);

  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isTracking || !startPoint.current) return;

      const touch = e.touches[0];
      lastPoint.current = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),};

    },
    [isTracking],);

  const handleTouchEnd = useCallback(() => {
    if (!isTracking || !startPoint.current || !lastPoint.current) {
      setIsTracking(false);

      return;
    }

    const deltaX = lastPoint.current.x - startPoint.current.x;
    const deltaY = lastPoint.current.y - startPoint.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const duration = lastPoint.current.timestamp - startPoint.current.timestamp;
    const velocity = distance / duration;

    if (distance >= threshold && velocity >= velocityThreshold) {
      const gestureEvent: GestureEvent = {
        type: "swipe",
        startPoint: startPoint.current,
        currentPoint: lastPoint.current,
        deltaX,
        deltaY,
        distance,
        velocity,
        direction:
          Math.abs(deltaX) > Math.abs(deltaY)
            ? deltaX > 0
              ? "right"
              : "left"
            : deltaY > 0
              ? "down"
              : "up",
        duration,};

      // Trigger appropriate swipe handler
      switch (gestureEvent.direction) {
        case "left":
          onSwipeLeft?.(gestureEvent);

          break;
        case "right":
          onSwipeRight?.(gestureEvent);

          break;
        case "up":
          onSwipeUp?.(gestureEvent);

          break;
        case "down":
          onSwipeDown?.(gestureEvent);

          break;
      } setIsTracking(false);

    startPoint.current = null;
    lastPoint.current = null;
  }, [
    isTracking,
    threshold,
    velocityThreshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  ]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isTracking,};
};

/**
 * Hook usePinchGesture - Detecção de Gestos de Pinçar
 *
 * @description
 * Hook para detectar gestos de pinch (pinçar) em elementos touch. Suporta
 * zoom in/out através do gesto de pinçar com dois dedos.
 *
 * @hook
 * @param {PinchGestureOptions} [options={}] - Opções de configuração do pinch
 * @param {number} [options.threshold=10] - Threshold mínimo de mudança de escala (em porcentagem)
 * @param {(scale: number) => void} [options.onPinchStart] - Callback ao iniciar pinch
 * @param {(scale: number) => void} [options.onPinch] - Callback durante o pinch
 * @param {(scale: number) => void} [options.onPinchEnd] - Callback ao terminar pinch
 * @returns {Object} Objeto com handlers e estado do pinch
 * @property {(e: TouchEvent) => void} onTouchStart - Handler de touch start
 * @property {(e: TouchEvent) => void} onTouchMove - Handler de touch move
 * @property {(e: TouchEvent) => void} onTouchEnd - Handler de touch end
 * @property {boolean} isPinching - Se está atualmente fazendo pinch
 * @property {number} scale - Escala atual do pinch
 *
 * @example
 * ```tsx
 * const { isPinching, scale, onTouchStart, onTouchMove, onTouchEnd } = usePinchGesture({
 *   onPinch: (scale: unknown) => setZoom(scale),
 *   onPinchEnd: (scale: unknown) => saveZoom(scale)
 * });

 *
 * <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={ onTouchEnd  }>
          *   Conteúdo pinchável
        </div>
 * </div>
 * ```
 */
export const usePinchGesture = (options: PinchGestureOptions = {} as any) => {
  const { threshold = 10, onPinchStart, onPinch, onPinchEnd } = options;

  const [isPinching, setIsPinching] = useState(false);

  const [scale, setScale] = useState(1);

  const initialDistance = useRef<number>(0);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);};

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const distance = getDistance(e.touches[0], e.touches[1]);

        initialDistance.current = distance;
        setIsPinching(true);

        onPinchStart?.(1);

      } ,
    [onPinchStart],);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isPinching && e.touches.length === 2 && initialDistance.current > 0) {
        e.preventDefault();

        const distance = getDistance(e.touches[0], e.touches[1]);

        const newScale = distance / initialDistance.current;

        if (Math.abs(newScale - scale) > threshold / 100) {
          setScale(newScale);

          onPinch?.(newScale);

        } },
    [isPinching, scale, threshold, onPinch],);

  const handleTouchEnd = useCallback(() => {
    if (isPinching) {
      setIsPinching(false);

      onPinchEnd?.(scale);

      setScale(1);

      initialDistance.current = 0;
    } , [isPinching, scale, onPinchEnd]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isPinching,
    scale,};
};

/**
 * Hook useLongPress - Detecção de Pressionamento Longo
 *
 * @description
 * Hook para detectar pressionamento longo em elementos. Suporta touch e mouse
 * events, com threshold para cancelar se o usuário mover durante o press.
 *
 * @hook
 * @param {LongPressOptions} [options={}] - Opções de configuração do long press
 * @param {number} [options.delay=500] - Delay em milissegundos antes de considerar long press
 * @param {number} [options.threshold=10] - Distância máxima em pixels para considerar válido (se mover mais, cancela)
 * @param {(event: GestureEvent) => void} [options.onLongPress] - Callback ao detectar long press
 * @returns {Object} Objeto com handlers e estado do long press
 * @property {(e: TouchEvent) => void} onTouchStart - Handler de touch start
 * @property {(e: TouchEvent) => void} onTouchMove - Handler de touch move
 * @property {(e: TouchEvent) => void} onTouchEnd - Handler de touch end
 * @property {(e: MouseEvent) => void} onMouseDown - Handler de mouse down
 * @property {(e: MouseEvent) => void} onMouseMove - Handler de mouse move
 * @property {(e: MouseEvent) => void} onMouseUp - Handler de mouse up
 * @property {boolean} isPressed - Se está atualmente pressionado
 *
 * @example
 * ```tsx
 * const { onTouchStart, onTouchEnd, onMouseDown, onMouseUp } = useLongPress({
 *   onLongPress: () => showContextMenu(),
 *   delay: 800
 * });

 *
 * <div onTouchStart={onTouchStart} onTouchEnd={ onTouchEnd  }>
          *   Mantenha pressionado
        </div>
 * </div>
 * ```
 */
export const useLongPress = (options: LongPressOptions = {} as any) => {
  const { delay = 500, threshold = 10, onLongPress } = options;

  const [isPressed, setIsPressed] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();

  const startPoint = useRef<TouchPoint | null>(null);

  const start = useCallback(
    (x: number, y: number) => {
      startPoint.current = { x, y, timestamp: Date.now()};

      setIsPressed(true);

      timerRef.current = setTimeout(() => {
        if (startPoint.current && onLongPress) {
          const gestureEvent: GestureEvent = {
            type: "longpress",
            startPoint: startPoint.current,
            currentPoint: startPoint.current,
            deltaX: 0,
            deltaY: 0,
            distance: 0,
            velocity: 0,
            direction: "right",
            duration: delay,};

          onLongPress(gestureEvent);

        } , delay);

    },
    [delay, onLongPress],);

  const cancel = useCallback(() => {
    setIsPressed(false);

    startPoint.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);

    } , []);

  const move = useCallback(
    (x: number, y: number) => {
      if (startPoint.current) {
        const distance = Math.sqrt(
          (x - startPoint.current.x) ** 2 + (y - startPoint.current.y) ** 2,);

        if (distance > threshold) {
          cancel();

        } },
    [threshold, cancel],);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      start(touch.clientX, touch.clientY);

    },
    [start],);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      move(touch.clientX, touch.clientY);

    },
    [move],);

  const handleTouchEnd = useCallback(() => {
    cancel();

  }, [cancel]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      start(e.clientX, e.clientY);

    },
    [start],);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      move(e.clientX, e.clientY);

    },
    [move],);

  const handleMouseUp = useCallback(() => {
    cancel();

  }, [cancel]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);

      } ;

  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    isPressed,};
};

// ===== GESTURE COMPONENTS =====

// Swipeable Container
interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft???: (e: any) => void;
  onSwipeRight???: (e: any) => void;
  onSwipeUp???: (e: any) => void;
  onSwipeDown???: (e: any) => void;
  threshold?: number;
  className?: string; }

export const Swipeable: React.FC<SwipeableProps> = ({ children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = "",
   }) => {
  const swipeHandlers = useSwipeGesture({
    threshold,
    onSwipeLeft: onSwipeLeft ? () => onSwipeLeft() : undefined,
    onSwipeRight: onSwipeRight ? () => onSwipeRight() : undefined,
    onSwipeUp: onSwipeUp ? () => onSwipeUp() : undefined,
    onSwipeDown: onSwipeDown ? () => onSwipeDown() : undefined,
  });

  return (
        <>
      <div
      className={cn("touch-manipulation", className)} onTouchStart={ swipeHandlers.onTouchStart }
      onTouchMove={ swipeHandlers.onTouchMove }
      onTouchEnd={ swipeHandlers.onTouchEnd  }>
      </div>{children}
    </div>);};

// Pinchable Container
interface PinchableProps {
  children: React.ReactNode;
  onScaleChange??: (e: any) => void;
  minScale?: number;
  maxScale?: number;
  className?: string; }

export const Pinchable: React.FC<PinchableProps> = ({ children,
  onScaleChange,
  minScale = 0.5,
  maxScale = 3,
  className = "",
   }) => {
  const [transform, setTransform] = useState("scale(1)");

  const pinchHandlers = usePinchGesture({
    onPinch: (scale: unknown) => {
      const constrainedScale = Math.min(Math.max(scale, minScale), maxScale);

      setTransform(`scale(${constrainedScale})`);

      onScaleChange?.(constrainedScale);

    },
    onPinchEnd: (scale: unknown) => {
      const constrainedScale = Math.min(Math.max(scale, minScale), maxScale);

      onScaleChange?.(constrainedScale);

    },
  });

  return (
        <>
      <div
      className={cn("touch-manipulation", className)} onTouchStart={ pinchHandlers.onTouchStart }
      onTouchMove={ pinchHandlers.onTouchMove }
      onTouchEnd={ pinchHandlers.onTouchEnd  }>
      </div><div
        style={transform,
          transformOrigin: "center",
          transition: "transform 0.1s",
        } >
           
        </div>{children}
      </div>);};

// Long Pressable
interface LongPressableProps {
  children: React.ReactNode;
  onLongPress??: (e: any) => void;
  delay?: number;
  className?: string; }

export const LongPressable: React.FC<LongPressableProps> = ({ children,
  onLongPress,
  delay = 500,
  className = "",
   }) => {
  const longPressHandlers = useLongPress({
    delay,
    onLongPress,
  });

  return (
            <div
      className={cn("touch-manipulation select-none", className)} onTouchStart={ longPressHandlers.onTouchStart }
      onTouchMove={ longPressHandlers.onTouchMove }
      onTouchEnd={ longPressHandlers.onTouchEnd }
      onMouseDown={ longPressHandlers.onMouseDown }
      onMouseMove={ longPressHandlers.onMouseMove }
      onMouseUp={ longPressHandlers.onMouseUp }
      onContextMenu={(e: unknown) => e.preventDefault()} // Prevent context menu
    >
      {children}
    </div>);};

// Drag and Drop Touch Support
interface TouchDraggableProps {
  children: React.ReactNode;
  onDragStart??: (e: any) => void;
  onDrag??: (e: any) => void;
  onDragEnd??: (e: any) => void;
  className?: string; }

export const TouchDraggable: React.FC<TouchDraggableProps> = ({ children,
  onDragStart,
  onDrag,
  onDragEnd,
  className = "",
   }) => {
  const [isDragging, setIsDragging] = useState(false);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const startPoint = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      const point: TouchPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),};

      startPoint.current = point;
      setIsDragging(true);

      if (onDragStart) {
        const gestureEvent: GestureEvent = {
          type: "dragstart",
          startPoint: point,
          currentPoint: point,
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          velocity: 0,
          direction: "right",
          duration: 0,};

        onDragStart(gestureEvent);

      } ,
    [onDragStart],);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !startPoint.current) return;

      e.preventDefault();

      const touch = e.touches[0];
      const currentPoint: TouchPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),};

      const deltaX = currentPoint.x - startPoint.current.x;
      const deltaY = currentPoint.y - startPoint.current.y;

      setDragOffset({ x: deltaX, y: deltaY });

      if (onDrag) {
        const gestureEvent: GestureEvent = {
          type: "drag",
          startPoint: startPoint.current,
          currentPoint,
          deltaX,
          deltaY,
          distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
          velocity: 0,
          direction:
            Math.abs(deltaX) > Math.abs(deltaY)
              ? deltaX > 0
                ? "right"
                : "left"
              : deltaY > 0
                ? "down"
                : "up",
          duration: currentPoint.timestamp - startPoint.current.timestamp,};

        onDrag(gestureEvent);

      } ,
    [isDragging, onDrag],);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !startPoint.current) return;

    setIsDragging(false);

    setDragOffset({ x: 0, y: 0 });

    if (onDragEnd) {
      const gestureEvent: GestureEvent = {
        type: "dragend",
        startPoint: startPoint.current,
        currentPoint: startPoint.current,
        deltaX: dragOffset.x,
        deltaY: dragOffset.y,
        distance: Math.sqrt(
          dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y,
        ),
        velocity: 0,
        direction: "right",
        duration: Date.now() - startPoint.current.timestamp,};

      onDragEnd(gestureEvent);

    }

    startPoint.current = null;
  }, [isDragging, dragOffset, onDragEnd]);

  return (
        <>
      <div
      className={cn("touch-manipulation", className)} onTouchStart={ handleTouchStart }
      onTouchMove={ handleTouchMove }
      onTouchEnd={ handleTouchEnd }
      style={transform: isDragging
          ? `translate(${dragOffset.x} px, ${dragOffset.y}px)`
          : "none",
        transition: isDragging ? "none" : "transform 0.2s ease",
      } >
      </div>{children}
    </div>);};

// Components are already exported individually above
