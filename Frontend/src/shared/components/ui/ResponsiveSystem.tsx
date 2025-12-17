/**
 * Sistema Avan?ado de Responsividade - xWin Dash
 *
 * @description
 * Sistema completo de responsividade mobile-first com suporte a breakpoints,
 * tipos de dispositivo, orienta??o, capacidades de toque/hover, prefer?ncias
 * de movimento reduzido e componentes responsivos (Grid, Container, Text,
 * Image, ShowOn, TouchFriendly).
 *
 * Funcionalidades principais:
 * - Breakpoints configur?veis (xs, sm, md, lg, xl, 2xl)
 * - Detec??o de tipo de dispositivo (mobile, tablet, desktop, tv)
 * - Detec??o de orienta??o (portrait, landscape)
 * - Detec??o de capacidades (touch, hover, reduced motion)
 * - Provider e hook useResponsive
 * - Componentes responsivos (Grid, Container, Text, Image)
 * - Renderiza??o condicional por dispositivo/breakpoint (ShowOn)
 * - Componentes touch-friendly
 * - Helpers para colunas, espa?amentos e tamanhos
 *
 * @module components/ui/ResponsiveSystem
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ResponsiveProvider, useResponsive, ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
 *
 * <ResponsiveProvider />
 *   <App / />
 * </ResponsiveProvider>
 *
 * const MyComponent = () => {
 *   const { breakpoint, deviceType, isTouchDevice } = useResponsive();

 *   return <div>Breakpoint: {breakpoint}</div>;
 *};

 * ```
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { cn } from '@/lib/utils';

// ===== BREAKPOINT TYPES =====
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type DeviceType = "mobile" | "tablet" | "desktop" | "tv";
export type Orientation = "portrait" | "landscape";

// ===== BREAKPOINT CONFIG =====
export const BREAKPOINTS = {
  xs: 0, // Mobile portrait
  sm: 640, // Mobile landscape / Small tablet
  md: 768, // Tablet portrait
  lg: 1024, // Tablet landscape / Small desktop
  xl: 1280, // Monitor
  "2xl": 1536, // Large desktop
} as const;

export const DEVICE_BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: Infinity },
  tv: { min: 1536, max: Infinity },
} as const;

// ===== RESPONSIVE CONTEXT =====
interface ResponsiveContextType {
  // Current state
  width: number;
  height: number;
  breakpoint: Breakpoint;
  deviceType: DeviceType;
  orientation: Orientation;
  // Utilities
  isAtLeast: (breakpoint: Breakpoint) => boolean;
  isAtMost: (breakpoint: Breakpoint) => boolean;
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean;
  isDevice: (device: DeviceType) => boolean;
  // Touch & interaction
  isTouchDevice: boolean;
  hasHover: boolean;
  prefersReducedMotion: boolean;
  // Layout helpers
  getColumns: (config: ResponsiveColumns) => number;
  getSpacing: (config: ResponsiveSpacing) => string;
  getSizes: (config: ResponsiveSizes) => string; }

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(
  undefined,);

// ===== RESPONSIVE PROVIDER =====
interface ResponsiveProviderProps {
  children: React.ReactNode; }

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children,
   }) => {
  const [width, setWidth] = useState(0);

  const [height, setHeight] = useState(0);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [hasHover, setHasHover] = useState(true);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Update dimensions
  const updateDimensions = useCallback(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);

      setHeight(window.innerHeight);

    } , []);

  // Detect device capabilities
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Touch detection
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          // @ts-expect-error - msMaxTouchPoints is a legacy IE property
          navigator.msMaxTouchPoints > 0,);};

    // Hover capability
    const checkHover = () => {
      setHasHover(window.matchMedia("(hover: hover)").matches);};

    // Reduced motion preference
    const checkReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,);};

    checkTouch();

    checkHover();

    checkReducedMotion();

    // Media query listeners
    const hoverQuery = window.matchMedia("(hover: hover)");

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const hoverListener = (e: MediaQueryListEvent) => setHasHover(e.matches);

    const motionListener = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

    hoverQuery.addEventListener("change", hoverListener);

    motionQuery.addEventListener("change", motionListener);

    return () => {
      hoverQuery.removeEventListener("change", hoverListener);

      motionQuery.removeEventListener("change", motionListener);};

  }, []);

  // Window resize listener
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    window.addEventListener("orientationchange", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);

      window.removeEventListener("orientationchange", updateDimensions);};

  }, [updateDimensions]);

  // Calculate current breakpoint
  const breakpoint: Breakpoint = React.useMemo(() => {
    if (width >= BREAKPOINTS["2xl"]) return "2xl";
    if (width >= BREAKPOINTS.xl) return "xl";
    if (width >= BREAKPOINTS.lg) return "lg";
    if (width >= BREAKPOINTS.md) return "md";
    if (width >= BREAKPOINTS.sm) return "sm";
    return "xs";
  }, [width]);

  // Calculate device type
  const deviceType: DeviceType = React.useMemo(() => {
    if (width >= DEVICE_BREAKPOINTS.tv.min) return "tv";
    if (width >= DEVICE_BREAKPOINTS.desktop.min) return "desktop";
    if (width >= DEVICE_BREAKPOINTS.tablet.min) return "tablet";
    return "mobile";
  }, [width]);

  // Calculate orientation
  const orientation: Orientation = React.useMemo(() => {
    return width > height ? "landscape" : "portrait";
  }, [width, height]);

  // Utility functions
  const isAtLeast = useCallback(
    (bp: Breakpoint) => {
      return width >= BREAKPOINTS[bp];
    },
    [width],);

  const isAtMost = useCallback(
    (bp: Breakpoint) => {
      return width <= BREAKPOINTS[bp];
    },
    [width],);

  const isBetween = useCallback(
    (min: Breakpoint, max: Breakpoint) => {
      return width >= BREAKPOINTS[min] && width <= BREAKPOINTS[max];
    },
    [width],);

  const isDevice = useCallback(
    (device: DeviceType) => {
      const config = DEVICE_BREAKPOINTS[device];
      return width >= config.min && width <= config.max;
    },
    [width],);

  // Layout helpers
  const getColumns = useCallback(
    (config: ResponsiveColumns) => {
      if (width >= BREAKPOINTS["2xl"] && config["2xl"]) return config["2xl"];
      if (width >= BREAKPOINTS.xl && config.xl) return config.xl;
      if (width >= BREAKPOINTS.lg && config.lg) return config.lg;
      if (width >= BREAKPOINTS.md && config.md) return config.md;
      if (width >= BREAKPOINTS.sm && config.sm) return config.sm;
      return config.xs || config.default || 1;
    },
    [width],);

  const getSpacing = useCallback(
    (config: ResponsiveSpacing) => {
      if (width >= BREAKPOINTS["2xl"] && config["2xl"]) return config["2xl"];
      if (width >= BREAKPOINTS.xl && config.xl) return config.xl;
      if (width >= BREAKPOINTS.lg && config.lg) return config.lg;
      if (width >= BREAKPOINTS.md && config.md) return config.md;
      if (width >= BREAKPOINTS.sm && config.sm) return config.sm;
      return config.xs || config.default || "1rem";
    },
    [width],);

  const getSizes = useCallback(
    (config: ResponsiveSizes) => {
      if (width >= BREAKPOINTS["2xl"] && config["2xl"]) return config["2xl"];
      if (width >= BREAKPOINTS.xl && config.xl) return config.xl;
      if (width >= BREAKPOINTS.lg && config.lg) return config.lg;
      if (width >= BREAKPOINTS.md && config.md) return config.md;
      if (width >= BREAKPOINTS.sm && config.sm) return config.sm;
      return config.xs || config.default || "auto";
    },
    [width],);

  const contextValue: ResponsiveContextType = {
    width,
    height,
    breakpoint,
    deviceType,
    orientation,
    isAtLeast,
    isAtMost,
    isBetween,
    isDevice,
    isTouchDevice,
    hasHover,
    prefersReducedMotion,
    getColumns,
    getSpacing,
    getSizes,};

  return (
            <ResponsiveContext.Provider value={ contextValue } />
      {children}
    </ResponsiveContext.Provider>);};

// ===== RESPONSIVE HOOK =====
export const useResponsive = () => {
  const context = useContext(ResponsiveContext);

  if (context === undefined) {
    throw new Error("useResponsive must be used within a ResponsiveProvider");

  }
  return context;};

// ===== RESPONSIVE COMPONENTS =====

// Responsive Grid
interface ResponsiveColumns {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
  default?: number; }

interface ResponsiveSpacing {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
  default?: string; }

interface ResponsiveSizes {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
  default?: string; }

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns: ResponsiveColumns;
  gap?: ResponsiveSpacing;
  className?: string; }

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns,
  gap = { default: "1rem" },
  className = "",
}) => {
  const { getColumns, getSpacing } = useResponsive();

  const cols = getColumns(columns);

  const gapSize = getSpacing(gap);

  return (
        <>
      <div
      className={cn("grid", className)} style={gridTemplateColumns: `repeat(${cols} , 1fr)`,
        gap: gapSize,
      } >
      </div>{children}
    </div>);};

// Responsive Container
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: ResponsiveSizes;
  padding?: ResponsiveSpacing;
  className?: string; }

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = {
    xs: "100%",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  padding = { xs: "1rem", md: "2rem" },
  className = "",
}) => {
  const { getSizes, getSpacing } = useResponsive();

  const width = getSizes(maxWidth);

  const paddingSize = getSpacing(padding);

  return (
        <>
      <div
      className={cn("mx-auto", className)} style={maxWidth: width,
        padding: paddingSize,
      } >
      </div>{children}
    </div>);};

// Responsive Text
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: ResponsiveSizes;
  weight?: ResponsiveSizes;
  className?: string;
  as?: keyof JSX.IntrinsicElements; }

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = { xs: "0.875rem", md: "1rem", lg: "1.125rem" },
  weight = { default: "400" },
  className = "",
  as: Component = "p",
}) => {
  const { getSizes } = useResponsive();

  const fontSize = getSizes(size);

  const fontWeight = getSizes(weight);

  return (
            <Component
      className={className} style={fontSize,
        fontWeight,
      } />
      {children}
    </Component>);};

// Device-specific rendering
interface ShowOnProps {
  children: React.ReactNode;
  breakpoint?: Breakpoint;
  device?: DeviceType;
  orientation?: Orientation;
  above?: Breakpoint;
  below?: Breakpoint; }

export const ShowOn: React.FC<ShowOnProps> = ({ children,
  breakpoint,
  device,
  orientation,
  above,
  below,
   }) => {
  const responsive = useResponsive();

  let shouldShow = true;

  if (breakpoint && responsive.breakpoint !== breakpoint) {
    shouldShow = false;
  }

  if (device && responsive.deviceType !== device) {
    shouldShow = false;
  }

  if (orientation && responsive.orientation !== orientation) {
    shouldShow = false;
  }

  if (above && !responsive.isAtLeast(above)) {
    shouldShow = false;
  }

  if (below && !responsive.isAtMost(below)) {
    shouldShow = false;
  }

  return shouldShow ? <>{children}</> : null;};

// Touch-friendly component wrapper
interface TouchFriendlyProps {
  children: React.ReactNode;
  minTouchTarget?: number;
  // 44px recommended
className?: string; }

export const TouchFriendly: React.FC<TouchFriendlyProps> = ({ children,
  minTouchTarget = 44,
  className = "",
   }) => {
  const { isTouchDevice } = useResponsive();

  if (!isTouchDevice) {
    return <>{children}</>;
  }

  return (
        <>
      <div
      className={cn("inline-block", className)} style={minWidth: `${minTouchTarget} px`,
        minHeight: `${minTouchTarget}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      } >
      </div>{children}
    </div>);};

// Responsive Image
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: ResponsiveSizes;
  className?: string;
  lazy?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = {
    xs: "100vw",
    sm: "50vw",
    md: "33vw",
    lg: "25vw",
  },
  className = "",
  lazy = true,
}) => {
  const { getSizes } = useResponsive();

  const imageSize = getSizes(sizes);

  return (
            <img
      src={ src }
      alt={ alt }
      className={cn("w-full h-auto", className)} style={maxWidth: imageSize } loading={ lazy ? "lazy" : "eager" }
    / />);};

// Components are already exported individually above

// Default export for compatibility
export default ResponsiveProvider;
