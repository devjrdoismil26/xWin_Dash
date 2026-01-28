/**
 * Touch Gestures System - xWin Dash
 * Sistema avançado de gestos para dispositivos touch
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// ===== GESTURE TYPES =====
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface GestureEvent {
  type: string;
  startPoint: TouchPoint;
  currentPoint: TouchPoint;
  deltaX: number;
  deltaY: number;
  distance: number;
  velocity: number;
  direction: 'left' | 'right' | 'up' | 'down';
  duration: number;
}

export interface SwipeGestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  onSwipeLeft?: (event: GestureEvent) => void;
  onSwipeRight?: (event: GestureEvent) => void;
  onSwipeUp?: (event: GestureEvent) => void;
  onSwipeDown?: (event: GestureEvent) => void;
}

export interface PinchGestureOptions {
  threshold?: number;
  onPinchStart?: (scale: number) => void;
  onPinch?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
}

export interface LongPressOptions {
  delay?: number;
  threshold?: number;
  onLongPress?: (event: GestureEvent) => void;
}

// ===== SWIPE HOOK =====
export const useSwipeGesture = (options: SwipeGestureOptions = {}) => {
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
      timestamp: Date.now(),
    };
    
    startPoint.current = point;
    lastPoint.current = point;
    setIsTracking(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isTracking || !startPoint.current) return;

    const touch = e.touches[0];
    lastPoint.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
  }, [isTracking]);

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
        type: 'swipe',
        startPoint: startPoint.current,
        currentPoint: lastPoint.current,
        deltaX,
        deltaY,
        distance,
        velocity,
        direction: Math.abs(deltaX) > Math.abs(deltaY) 
          ? (deltaX > 0 ? 'right' : 'left')
          : (deltaY > 0 ? 'down' : 'up'),
        duration,
      };

      // Trigger appropriate swipe handler
      switch (gestureEvent.direction) {
        case 'left':
          onSwipeLeft?.(gestureEvent);
          break;
        case 'right':
          onSwipeRight?.(gestureEvent);
          break;
        case 'up':
          onSwipeUp?.(gestureEvent);
          break;
        case 'down':
          onSwipeDown?.(gestureEvent);
          break;
      }
    }

    setIsTracking(false);
    startPoint.current = null;
    lastPoint.current = null;
  }, [isTracking, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isTracking,
  };
};

// ===== PINCH HOOK =====
export const usePinchGesture = (options: PinchGestureOptions = {}) => {
  const {
    threshold = 10,
    onPinchStart,
    onPinch,
    onPinchEnd,
  } = options;

  const [isPinching, setIsPinching] = useState(false);
  const [scale, setScale] = useState(1);
  const initialDistance = useRef<number>(0);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      initialDistance.current = distance;
      setIsPinching(true);
      onPinchStart?.(1);
    }
  }, [onPinchStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isPinching && e.touches.length === 2 && initialDistance.current > 0) {
      e.preventDefault();
      
      const distance = getDistance(e.touches[0], e.touches[1]);
      const newScale = distance / initialDistance.current;
      
      if (Math.abs(newScale - scale) > threshold / 100) {
        setScale(newScale);
        onPinch?.(newScale);
      }
    }
  }, [isPinching, scale, threshold, onPinch]);

  const handleTouchEnd = useCallback(() => {
    if (isPinching) {
      setIsPinching(false);
      onPinchEnd?.(scale);
      setScale(1);
      initialDistance.current = 0;
    }
  }, [isPinching, scale, onPinchEnd]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isPinching,
    scale,
  };
};

// ===== LONG PRESS HOOK =====
export const useLongPress = (options: LongPressOptions = {}) => {
  const {
    delay = 500,
    threshold = 10,
    onLongPress,
  } = options;

  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const startPoint = useRef<TouchPoint | null>(null);

  const start = useCallback((x: number, y: number) => {
    startPoint.current = { x, y, timestamp: Date.now() };
    setIsPressed(true);
    
    timerRef.current = setTimeout(() => {
      if (startPoint.current && onLongPress) {
        const gestureEvent: GestureEvent = {
          type: 'longpress',
          startPoint: startPoint.current,
          currentPoint: startPoint.current,
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          velocity: 0,
          direction: 'right',
          duration: delay,
        };
        onLongPress(gestureEvent);
      }
    }, delay);
  }, [delay, onLongPress]);

  const cancel = useCallback(() => {
    setIsPressed(false);
    startPoint.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const move = useCallback((x: number, y: number) => {
    if (startPoint.current) {
      const distance = Math.sqrt(
        (x - startPoint.current.x) ** 2 + (y - startPoint.current.y) ** 2
      );
      
      if (distance > threshold) {
        cancel();
      }
    }
  }, [threshold, cancel]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    start(touch.clientX, touch.clientY);
  }, [start]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    move(touch.clientX, touch.clientY);
  }, [move]);

  const handleTouchEnd = useCallback(() => {
    cancel();
  }, [cancel]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    start(e.clientX, e.clientY);
  }, [start]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    move(e.clientX, e.clientY);
  }, [move]);

  const handleMouseUp = useCallback(() => {
    cancel();
  }, [cancel]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    isPressed,
  };
};

// ===== GESTURE COMPONENTS =====

// Swipeable Container
interface SwipeableProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

export const Swipeable: React.FC<SwipeableProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = '',
}) => {
  const swipeHandlers = useSwipeGesture({
    threshold,
    onSwipeLeft: onSwipeLeft ? () => onSwipeLeft() : undefined,
    onSwipeRight: onSwipeRight ? () => onSwipeRight() : undefined,
    onSwipeUp: onSwipeUp ? () => onSwipeUp() : undefined,
    onSwipeDown: onSwipeDown ? () => onSwipeDown() : undefined,
  });

  return (
    <div
      className={cn('touch-manipulation', className)}
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchMove={swipeHandlers.onTouchMove}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      {children}
    </div>
  );
};

// Pinchable Container
interface PinchableProps {
  children: React.ReactNode;
  onScaleChange?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
  className?: string;
}

export const Pinchable: React.FC<PinchableProps> = ({
  children,
  onScaleChange,
  minScale = 0.5,
  maxScale = 3,
  className = '',
}) => {
  const [transform, setTransform] = useState('scale(1)');

  const pinchHandlers = usePinchGesture({
    onPinch: (scale) => {
      const constrainedScale = Math.min(Math.max(scale, minScale), maxScale);
      setTransform(`scale(${constrainedScale})`);
      onScaleChange?.(constrainedScale);
    },
    onPinchEnd: (scale) => {
      const constrainedScale = Math.min(Math.max(scale, minScale), maxScale);
      onScaleChange?.(constrainedScale);
    },
  });

  return (
    <div
      className={cn('touch-manipulation', className)}
      onTouchStart={pinchHandlers.onTouchStart}
      onTouchMove={pinchHandlers.onTouchMove}
      onTouchEnd={pinchHandlers.onTouchEnd}
    >
      <div style={{ transform, transformOrigin: 'center', transition: 'transform 0.1s' }}>
        {children}
      </div>
    </div>
  );
};

// Long Pressable
interface LongPressableProps {
  children: React.ReactNode;
  onLongPress: () => void;
  delay?: number;
  className?: string;
}

export const LongPressable: React.FC<LongPressableProps> = ({
  children,
  onLongPress,
  delay = 500,
  className = '',
}) => {
  const longPressHandlers = useLongPress({
    delay,
    onLongPress,
  });

  return (
    <div
      className={cn('touch-manipulation select-none', className)}
      onTouchStart={longPressHandlers.onTouchStart}
      onTouchMove={longPressHandlers.onTouchMove}
      onTouchEnd={longPressHandlers.onTouchEnd}
      onMouseDown={longPressHandlers.onMouseDown}
      onMouseMove={longPressHandlers.onMouseMove}
      onMouseUp={longPressHandlers.onMouseUp}
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu
    >
      {children}
    </div>
  );
};

// Drag and Drop Touch Support
interface TouchDraggableProps {
  children: React.ReactNode;
  onDragStart?: (e: GestureEvent) => void;
  onDrag?: (e: GestureEvent) => void;
  onDragEnd?: (e: GestureEvent) => void;
  className?: string;
}

export const TouchDraggable: React.FC<TouchDraggableProps> = ({
  children,
  onDragStart,
  onDrag,
  onDragEnd,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPoint = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    
    startPoint.current = point;
    setIsDragging(true);
    
    if (onDragStart) {
      const gestureEvent: GestureEvent = {
        type: 'dragstart',
        startPoint: point,
        currentPoint: point,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        velocity: 0,
        direction: 'right',
        duration: 0,
      };
      onDragStart(gestureEvent);
    }
  }, [onDragStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !startPoint.current) return;

    e.preventDefault();
    const touch = e.touches[0];
    const currentPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    
    const deltaX = currentPoint.x - startPoint.current.x;
    const deltaY = currentPoint.y - startPoint.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    if (onDrag) {
      const gestureEvent: GestureEvent = {
        type: 'drag',
        startPoint: startPoint.current,
        currentPoint,
        deltaX,
        deltaY,
        distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        velocity: 0,
        direction: Math.abs(deltaX) > Math.abs(deltaY) 
          ? (deltaX > 0 ? 'right' : 'left')
          : (deltaY > 0 ? 'down' : 'up'),
        duration: currentPoint.timestamp - startPoint.current.timestamp,
      };
      onDrag(gestureEvent);
    }
  }, [isDragging, onDrag]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !startPoint.current) return;

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    
    if (onDragEnd) {
      const gestureEvent: GestureEvent = {
        type: 'dragend',
        startPoint: startPoint.current,
        currentPoint: startPoint.current,
        deltaX: dragOffset.x,
        deltaY: dragOffset.y,
        distance: Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y),
        velocity: 0,
        direction: 'right',
        duration: Date.now() - startPoint.current.timestamp,
      };
      onDragEnd(gestureEvent);
    }
    
    startPoint.current = null;
  }, [isDragging, dragOffset, onDragEnd]);

  return (
    <div
      className={cn('touch-manipulation', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
      }}
    >
      {children}
    </div>
  );
};

// Components are already exported individually above
