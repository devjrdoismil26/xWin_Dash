/**
 * Componente AdvancedAnimations - Sistema de Animações Avançadas
 *
 * @description
 * Módulo completo de animações avançadas com micro-interações contextuais.
 * Fornece hook personalizado `useAnimation`, componentes animados (`Animated`,
 * `PageTransition`) e componentes de micro-interações (`MagneticButton`,
 * `Parallax`, `MorphingShape`, `FloatingActionButton`, `TextReveal`,
 * `AnimatedCounter`). Suporta múltiplos tipos de animação, triggers e
 * respeita preferências de movimento reduzido para acessibilidade.
 *
 * @example
 * ```tsx
 * import { Animated, useAnimation, MagneticButton } from '@/shared/components/ui/AdvancedAnimations';
 *
 * const MyComponent = () => {
 *   const { ref, isPlaying, play } = useAnimation({
 *     type: 'fadeIn',
 *     duration: 500,
 *     trigger: 'load'
 *   });

 *
 *   return (
         *     <Animated} />
 *       <MagneticButton strength={ 0.3 }>Clique aqui</MagneticButton>
 *     </Animated>
 *);

 *};

 * ```
 *
 * @module components/ui/AdvancedAnimations
 * @since 1.0.0
 */
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from '@/lib/utils';
// import { useResponsive } from './ResponsiveSystem';

/**
 * Tipos de animação disponíveis
 *
 * @description
 * Enumeração de todos os tipos de animação suportados pelo sistema.
 *
 * @typedef {('fadeIn' | 'fadeOut' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'slideOutUp' | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight' | 'scaleIn' | 'scaleOut' | 'bounceIn' | 'bounceOut' | 'rotateIn' | 'rotateOut' | 'flipIn' | 'flipOut' | 'zoomIn' | 'zoomOut' | 'elastic' | 'rubber' | 'pulse' | 'heartbeat' | 'swing' | 'tada' | 'wobble' | 'jello' | 'float' | 'drift')} AnimationType
 * @property {'fadeIn'} fadeIn - Fade in (aparecer)
 * @property {'fadeOut'} fadeOut - Fade out (desaparecer)
 * @property {'slideInUp'} slideInUp - Deslizar para cima
 * @property {'slideInDown'} slideInDown - Deslizar para baixo
 * @property {'slideInLeft'} slideInLeft - Deslizar da esquerda
 * @property {'slideInRight'} slideInRight - Deslizar da direita
 * @property {'slideOutUp'} slideOutUp - Deslizar para fora (cima)
 * @property {'slideOutDown'} slideOutDown - Deslizar para fora (baixo)
 * @property {'slideOutLeft'} slideOutLeft - Deslizar para fora (esquerda)
 * @property {'slideOutRight'} slideOutRight - Deslizar para fora (direita)
 * @property {'scaleIn'} scaleIn - Escalar para dentro
 * @property {'scaleOut'} scaleOut - Escalar para fora
 * @property {'bounceIn'} bounceIn - Entrar com bounce
 * @property {'bounceOut'} bounceOut - Sair com bounce
 * @property {'rotateIn'} rotateIn - Rotacionar para dentro
 * @property {'rotateOut'} rotateOut - Rotacionar para fora
 * @property {'flipIn'} flipIn - Virar para dentro
 * @property {'flipOut'} flipOut - Virar para fora
 * @property {'zoomIn'} zoomIn - Zoom in
 * @property {'zoomOut'} zoomOut - Zoom out
 * @property {'elastic'} elastic - Efeito elástico
 * @property {'rubber'} rubber - Efeito de borracha
 * @property {'pulse'} pulse - Pulsar
 * @property {'heartbeat'} heartbeat - Batimento cardíaco
 * @property {'swing'} swing - Balançar
 * @property {'tada'} tada - Efeito "tada"
 * @property {'wobble'} wobble - Oscilar
 * @property {'jello'} jello - Efeito jello
 * @property {'float'} float - Flutuar
 * @property {'drift'} drift - Deriva
 */
export type AnimationType =
  | "fadeIn"
  | "fadeOut"
  | "slideInUp"
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  | "slideOutUp"
  | "slideOutDown"
  | "slideOutLeft"
  | "slideOutRight"
  | "scaleIn"
  | "scaleOut"
  | "bounceIn"
  | "bounceOut"
  | "rotateIn"
  | "rotateOut"
  | "flipIn"
  | "flipOut"
  | "zoomIn"
  | "zoomOut"
  | "elastic"
  | "rubber"
  | "pulse"
  | "heartbeat"
  | "swing"
  | "tada"
  | "wobble"
  | "jello"
  | "float"
  | "drift";

export type AnimationTrigger =
  | "hover"
  | "focus"
  | "click"
  | "load"
  | "scroll"
  | "manual";

export interface AnimationConfig {
  type: AnimationType;
  duration?: number;
  // ms
  delay?: number;
  // ms
  repeat?: number | "infinite";
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  timing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear" | string;
  trigger?: AnimationTrigger;
  playOnMount?: boolean;
  respectReducedMotion?: boolean; }

/**
 * Hook useAnimation - Gerenciamento de Animações
 *
 * @description
 * Hook personalizado para gerenciar animações com controle de estado, triggers
 * e suporte a Intersection Observer para animações baseadas em scroll.
 *
 * @hook
 * @param {AnimationConfig} config - Configuração da animação
 * @returns { ref: React.RefObject<HTMLElement>; isPlaying: boolean; isVisible: boolean; play??: (e: any) => void; stop??: (e: any) => void; reset??: (e: any) => void; shouldAnimate: boolean } Objeto com ref e funções de controle
 *
 * @example
 * ```tsx
 * const { ref, isPlaying, play } = useAnimation({
 *   type: 'fadeIn',
 *   duration: 500,
 *   trigger: 'scroll'
 * });

 * ```
 */
export const useAnimation = (config: AnimationConfig) => {
  const [isPlaying, setIsPlaying] = useState(config.playOnMount || false);

  const [isVisible, setIsVisible] = useState(false);

  // const { prefersReducedMotion } = useResponsive();

  const prefersReducedMotion = false; // Temporário
  const elementRef = useRef<HTMLElement>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const shouldAnimate = !config.respectReducedMotion || !prefersReducedMotion;

  // Scroll trigger with Intersection Observer
  useEffect(() => {
    if (config.trigger === "scroll" && elementRef.current && shouldAnimate) {
      observerRef.current = new IntersectionObserver(
        (entries: unknown) => {
          entries.forEach((entry: unknown) => {
            if (entry.isIntersecting) {
              setIsVisible(true);

              setIsPlaying(true);

            } );

        },
        { threshold: 0.1, rootMargin: "50px" },);

      observerRef.current.observe(elementRef.current);

    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();

      } ;

  }, [config.trigger, shouldAnimate]);

  // Auto-play on mount
  useEffect(() => {
    if (config.playOnMount && shouldAnimate) {
      const timer = setTimeout(() => {
        setIsPlaying(true);

      }, config.delay || 0);

      return () => clearTimeout(timer);

    } , [config.playOnMount, config.delay, shouldAnimate]);

  const play = () => {
    if (shouldAnimate) {
      setIsPlaying(true);

    } ;

  const stop = () => {
    setIsPlaying(false);};

  const reset = () => {
    setIsPlaying(false);

    setTimeout(() => setIsPlaying(true), 50);};

  return {
    ref: elementRef,
    isPlaying: shouldAnimate ? isPlaying : false,
    isVisible,
    play,
    stop,
    reset,
    shouldAnimate,};
};

// ===== ANIMATED COMPONENT =====
/**
 * Props do componente Animated
 *
 * @interface AnimatedProps
 * @property {React.ReactNode} children - Conteúdo a ser animado
 * @property {AnimationConfig} animation - Configuração da animação
 * @property {string} [className] - Classes CSS adicionais (opcional)
 * @property {keyof JSX.IntrinsicElements} [as] - Elemento HTML a renderizar (opcional, padrão: 'div')
 * @property {() => void} [onAnimationEnd] - Callback ao finalizar animação (opcional)
 * @property {() => void} [onAnimationStart] - Callback ao iniciar animação (opcional)
 */
interface AnimatedProps {
  children: ReactNode;
  animation: AnimationConfig;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  onAnimationEnd???: (e: any) => void;
  onAnimationStart???: (e: any) => void;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente Animated
 *
 * @description
 * Componente que aplica animações a seus filhos usando o hook useAnimation.
 * Suporta múltiplos tipos de animação, triggers e callbacks de eventos.
 *
 * @component
 * @param {AnimatedProps} props - Props do componente
 * @returns {JSX.Element} Componente animado
 */
export const Animated: React.FC<AnimatedProps> = ({ children,
  animation,
  className = "",
  as: Component = "div",
  onAnimationEnd,
  onAnimationStart,
   }) => {
  const { ref, isPlaying, shouldAnimate } = useAnimation(animation);

  const [hasStarted, setHasStarted] = useState(false);

  const getAnimationClasses = () => {
    if (!shouldAnimate) return "";

    const baseClass = `animate-${animation.type}`;
    const durationClass = animation.duration
      ? `animate-duration-${animation.duration}`
      : "";
    const delayClass = animation.delay
      ? `animate-delay-${animation.delay}`
      : "";
    const playingClass = isPlaying ? "animate-playing" : "animate-paused";

    return cn(baseClass, durationClass, delayClass, playingClass);};

  const handleAnimationStart = () => {
    if (!hasStarted) {
      setHasStarted(true);

      onAnimationStart?.();

    } ;

  const handleAnimationEnd = () => {
    onAnimationEnd?.();};

  const getEventHandlers = () => {
    const handlers: unknown = {} as any;

    if (animation.trigger === "hover") {
      handlers.onMouseEnter = () => setIsPlaying(true);

      handlers.onMouseLeave = () => setIsPlaying(false);

    }

    if (animation.trigger === "focus") {
      handlers.onFocus = () => setIsPlaying(true);

      handlers.onBlur = () => setIsPlaying(false);

    }

    if (animation.trigger === "click") {
      handlers.onClick = () => setIsPlaying(!isPlaying);

    }

    return handlers;};

  return (
            <Component
      ref={ ref }
      className={cn(getAnimationClasses(), className)} onAnimationStart={ handleAnimationStart }
      onAnimationEnd={ handleAnimationEnd }
      {...getEventHandlers()}
      style={animationDuration: animation.duration
          ? `${animation.duration} ms`
          : undefined,
        animationDelay: animation.delay ? `${animation.delay}ms` : undefined,
        animationIterationCount:
          animation.repeat === "infinite" ? "infinite" : animation.repeat,
        animationDirection: animation.direction,
        animationTimingFunction: animation.timing || "ease",
      } />
      {children}
    </Component>);};

// ===== PAGE TRANSITIONS =====
/**
 * Props do componente PageTransition
 *
 * @interface PageTransitionProps
 * @property {React.ReactNode} children - Conteúdo da página
 * @property {'fade' | 'slide' | 'scale' | 'rotate'} [type='fade'] - Tipo de transição (opcional, padrão: 'fade')
 * @property {'up' | 'down' | 'left' | 'right'} [direction='right'] - Direção da transição slide (opcional, padrão: 'right')
 * @property {number} [duration=300] - Duração da transição em ms (opcional, padrão: 300)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padrão: '')
 */
interface PageTransitionProps {
  children: ReactNode;
  type?: "fade" | "slide" | "scale" | "rotate";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  className?: string;
  style?: React.CSSProperties; }

/**
 * Componente PageTransition
 *
 * @description
 * Componente para transições suaves entre páginas ou seções. Suporta
 * múltiplos tipos de transição (fade, slide, scale, rotate) com direções
 * customizáveis.
 *
 * @component
 * @param {PageTransitionProps} props - Props do componente
 * @returns {JSX.Element} Componente de transição de página
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children,
  type = "fade",
  direction = "right",
  duration = 300,
  className = "",
   }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

  }, []);

  const getTransitionClasses = () => {
    if (type === "fade") {
      return isVisible ? "animate-fadeIn" : "opacity-0";
    }

    if (type === "slide") {
      const slideClass = `animate-slideIn${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
      return isVisible
        ? slideClass
        : `translate-${direction === "up" || direction === "down" ? "y" : "x"}-full opacity-0`;
    }

    if (type === "scale") {
      return isVisible ? "animate-scaleIn" : "scale-95 opacity-0";
    }

    if (type === "rotate") {
      return isVisible ? "animate-rotateIn" : "rotate-12 scale-95 opacity-0";
    }

    return "";};

  return (
        <>
      <div
      className={cn(
        "transition-all ease-out",
        getTransitionClasses(),
        className,
      )} style={transitionDuration: `${duration} ms` } >
      </div>{children}
    </div>);};

// ===== MICRO-INTERACTIONS =====

/**
 * Props do componente MagneticButton
 *
 * @interface MagneticButtonProps
 * @property {React.ReactNode} children - Conteúdo do botão
 * @property {number} [strength=0.3] - Força do efeito magnético (opcional, padrão: 0.3)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padrão: '')
 * @property {() => void} [onClick] - Handler de clique (opcional)
 */
interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties; }

/**
 * Componente MagneticButton
 *
 * @description
 * Botão com efeito magnético que segue o movimento do mouse, criando
 * uma interação visual interessante e moderna.
 *
 * @component
 * @param {MagneticButtonProps} props - Props do componente
 * @returns {JSX.Element} Botão magnético
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({ children,
  strength = 0.3,
  className = "",
  onClick,
   }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });};

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });};

  return (
            <button
      ref={ buttonRef }
      className={cn(
        "transform transition-transform duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        className,
      )} style={transform: `translate(${position.x} px, ${position.y}px)`,
      } onMouseMove={ handleMouseMove }
      onMouseLeave={ handleMouseLeave }
      onClick={ onClick } />
      {children}
    </button>);};

// Parallax Container
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  direction?: "vertical" | "horizontal";
  className?: string;
  style?: React.CSSProperties; }

export const Parallax: React.FC<ParallaxProps> = ({ children,
  speed = 0.5,
  direction = "vertical",
  className = "",
   }) => {
  const [offset, setOffset] = useState(0);

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();

      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      if (direction === "vertical") {
        setOffset(rate);

      } else {
        setOffset(rate * 0.5);

      } ;

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, [speed, direction]);

  return (
        <>
      <div
      ref={ elementRef }
      className={cn("will-change-transform", className)} style={transform:
          direction === "vertical"
            ? `translateY(${offset} px)`
            : `translateX(${offset}px)`,
      } >
      </div>{children}
    </div>);};

/**
 * Props do componente MorphingShape
 *
 * @interface MorphingShapeProps
 * @property {string[]} shapes - Array de dados de path SVG para morphing
 * @property {number} [duration] - Duração da transição em ms (opcional)
 * @property {boolean} [autoPlay] - Se deve iniciar automaticamente (opcional)
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface MorphingShapeProps {
  shapes: string[];
  // SVG path data
duration?: number;
  autoPlay?: boolean;
  className?: string;
  size?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

export const MorphingShape: React.FC<MorphingShapeProps> = ({ shapes,
  duration = 2000,
  autoPlay = true,
  className = "",
  size = 100,
   }) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || shapes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentShapeIndex((prev: unknown) => (prev + 1) % shapes.length);

    }, duration);

    return () => clearInterval(interval);

  }, [autoPlay, duration, shapes.length]);

  return (
        <>
      <svg
      width={ size }
      height={ size }
      viewBox="0 0 100 100"
      className={cn("transition-all duration-1000 ease-in-out", className) } />
      <path
        d={ shapes[currentShapeIndex] }
        fill="currentColor"
        className="transition-all duration-1000 ease-in-out"
      / />
    </svg>);};

// Floating Action Button with Trail
interface FloatingActionButtonProps {
  children: ReactNode;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
  style?: React.CSSProperties; }

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ children,
  onClick,
  position = "bottom-right",
  className = "",
   }) => { const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number  }>
  >([]);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-right":
        return "bottom-6 right-6";
      case "bottom-left":
        return "bottom-6 left-6";
      case "top-right":
        return "top-6 right-6";
      case "top-left":
        return "top-6 left-6";
      default:
        return "bottom-6 right-6";
    } ;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y};

    setRipples((prev: unknown) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev: unknown) =>
        (prev || []).filter((ripple: unknown) => ripple.id !== newRipple.id),);

    }, 600);

    onClick?.();};

  return (
            <button
      className={cn(
        "fixed z-50 w-14 h-14 rounded-full shadow-lg",
        "bg-blue-600 text-white hover:bg-blue-700",
        "transform transition-all duration-200",
        "hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-4 focus:ring-blue-300",
        "relative overflow-hidden",
        getPositionClasses(),
        className,
      )} onClick={ handleClick } />
      {/* Ripple effects */}
      {(ripples || []).map((ripple: unknown) => (
        <span
          key={ ripple.id }
          className="absolute bg-white opacity-30 rounded-full animate-ping"
          style={left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          } />
          ))}
        </span>

      {children}
    </button>);};

// Text reveal animation
interface TextRevealProps {
  children: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties; }

export const TextReveal: React.FC<TextRevealProps> = ({ children,
  delay = 0,
  speed = 50,
  className = "",
   }) => {
  const [visibleChars, setVisibleChars] = useState(0);

  const text = children;

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars((prev: unknown) => {
          if (prev >= text.length) {
            clearInterval(interval);

            return prev;
          }
          return prev + 1;
        });

      }, speed);

      return () => clearInterval(interval);

    }, delay);

    return () => clearTimeout(timer);

  }, [text.length, delay, speed]);

  return (
        <>
      <span className={className  }>
      </span>{text.split("").map((char: unknown, index: unknown) => (
        <span
          key={ index }
          className={cn(
            "transition-opacity duration-100",
            index < visibleChars ? "opacity-100" : "opacity-0",
          )  }>
        </span>{char}
        </span>
      ))}
    </span>);};

// Number counter animation
interface CounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

export const AnimatedCounter: React.FC<CounterProps> = ({ value,
  duration = 1000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
   }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      setCurrent(easeOutCubic * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);

      } ;

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);

      } ;

  }, [value, duration]);

  return (
        <>
      <span className={className  }>
      </span>{prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>);};

// Components are already exported individually above
