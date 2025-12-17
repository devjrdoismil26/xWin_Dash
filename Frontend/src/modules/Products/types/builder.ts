// ========================================
// PRODUCTS MODULE - BUILDER TYPES
// ========================================

export interface BuilderState {
  selectedElement: string | null;
  hoveredElement: string | null;
  clipboard: BuilderElement | null;
  history: BuilderHistory;
  preview: PreviewSettings;
  zoom: number;
  grid: GridSettings;
  snap: SnapSettings; }

export interface BuilderElement {
  id: string;
  type: ElementType;
  category: ElementCategory;
  name: string;
  description: string;
  icon: string;
  component: string;
  props: Record<string, any>;
  styles: ElementStyles;
  children: string[];
  parent: string | null;
  order: number;
  isVisible: boolean;
  isLocked: boolean;
  constraints: ElementConstraints; }

export interface ElementStyles {
  position: PositionStyles;
  layout: LayoutStyles;
  typography: TypographyStyles;
  colors: ColorStyles;
  spacing: SpacingStyles;
  borders: BorderStyles;
  effects: EffectStyles;
  animations: AnimationStyles;
  responsive: ResponsiveStyles; }

export interface PositionStyles {
  position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number; }

export interface LayoutStyles {
  display: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumnGap?: number;
  gridRowGap?: number; }

export interface TypographyStyles {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  fontStyle?: 'normal' | 'italic' | 'oblique'; }

export interface ColorStyles {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  opacity?: number; }

export interface SpacingStyles {
  margin?: SpacingValue;
  padding?: SpacingValue; }

export interface SpacingValue {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  all?: number; }

export interface BorderStyles {
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderColor?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number; }

export interface EffectStyles {
  boxShadow?: string;
  textShadow?: string;
  filter?: string;
  backdropFilter?: string;
  transform?: string; }

export interface AnimationStyles {
  transition?: string;
  animation?: string;
  animationDuration?: number;
  animationDelay?: number;
  animationIterationCount?: number | 'infinite';
  animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  animationFillMode?: 'none' | 'forwards' | 'backwards' | 'both'; }

export interface ResponsiveStyles {
  mobile: Partial<ElementStyles>;
  tablet: Partial<ElementStyles>;
  desktop: Partial<ElementStyles>; }

export interface ElementConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  resizable: boolean;
  draggable: boolean;
  rotatable: boolean; }

export interface BuilderHistory {
  past: BuilderAction[];
  present: BuilderState;
  future: BuilderAction[];
  maxHistorySize: number; }

export interface BuilderAction {
  id: string;
  type: ActionType;
  timestamp: Date;
  description: string;
  data: Record<string, any>;
  undo??: (e: any) => void;
  redo??: (e: any) => void; }

export interface PreviewSettings {
  device: DeviceType;
  orientation: 'portrait' | 'landscape';
  showGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  showElementInfo: boolean;
  [key: string]: unknown; }

export interface GridSettings {
  enabled: boolean;
  size: number;
  color: string;
  opacity: number;
  snapToGrid: boolean;
  [key: string]: unknown; }

export interface SnapSettings {
  enabled: boolean;
  tolerance: number;
  snapToElements: boolean;
  snapToGrid: boolean;
  snapToGuides: boolean;
  [key: string]: unknown; }

export enum ElementType {
  // Layout Elements
  CONTAINER = 'container',
  ROW = 'row',
  COLUMN = 'column',
  GRID = 'grid',
  FLEX = 'flex',
  
  // Content Elements
  TEXT = 'text',
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  IMAGE = 'image',
  VIDEO = 'video',
  ICON = 'icon',
  BUTTON = 'button',
  LINK = 'link',
  
  // Form Elements
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  FILE_UPLOAD = 'file_upload',
  FORM = 'form',
  
  // Navigation Elements
  NAVBAR = 'navbar',
  MENU = 'menu',
  BREADCRUMB = 'breadcrumb',
  PAGINATION = 'pagination',
  
  // Media Elements
  GALLERY = 'gallery',
  CAROUSEL = 'carousel',
  SLIDER = 'slider',
  LIGHTBOX = 'lightbox',
  
  // Interactive Elements
  MODAL = 'modal',
  TOOLTIP = 'tooltip',
  POPOVER = 'popover',
  ACCORDION = 'accordion',
  TABS = 'tabs',
  DROPDOWN = 'dropdown',
  
  // Data Elements
  TABLE = 'table',
  LIST = 'list',
  CARD = 'card',
  TIMELINE = 'timeline',
  
  // Marketing Elements
  HERO = 'hero',
  TESTIMONIAL = 'testimonial',
  PRICING = 'pricing',
  FAQ = 'faq',
  CTA = 'cta',
  COUNTER = 'counter',
  PROGRESS = 'progress',
  
  // Social Elements
  SOCIAL_LINKS = 'social_links',
  SHARE_BUTTONS = 'share_buttons',
  COMMENTS = 'comments',
  
  // E-commerce Elements
  PRODUCT_CARD = 'product_card',
  PRODUCT_GALLERY = 'product_gallery',
  ADD_TO_CART = 'add_to_cart',
  CHECKOUT_FORM = 'checkout_form',
  
  // Custom Elements
  CUSTOM_HTML = 'custom_html',
  CUSTOM_CSS = 'custom_css',
  CUSTOM_JS = 'custom_js',
  EMBED = 'embed'
}

export enum ElementCategory {
  LAYOUT = 'layout',
  CONTENT = 'content',
  FORM = 'form',
  NAVIGATION = 'navigation',
  MEDIA = 'media',
  INTERACTIVE = 'interactive',
  DATA = 'data',
  MARKETING = 'marketing',
  SOCIAL = 'social',
  ECOMMERCE = 'ecommerce',
  CUSTOM = 'custom'
}

export enum BuilderActionType {
  ADD_ELEMENT = 'add_element',
  REMOVE_ELEMENT = 'remove_element',
  UPDATE_ELEMENT = 'update_element',
  MOVE_ELEMENT = 'move_element',
  COPY_ELEMENT = 'copy_element',
  PASTE_ELEMENT = 'paste_element',
  DUPLICATE_ELEMENT = 'duplicate_element',
  GROUP_ELEMENTS = 'group_elements',
  UNGROUP_ELEMENTS = 'ungroup_elements',
  LOCK_ELEMENT = 'lock_element',
  UNLOCK_ELEMENT = 'unlock_element',
  SHOW_ELEMENT = 'show_element',
  HIDE_ELEMENT = 'hide_element',
  UPDATE_STYLES = 'update_styles',
  UPDATE_CONTENT = 'update_content',
  UPDATE_PROPERTIES = 'update_properties'
}

export enum BuilderDeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  LARGE_DESKTOP = 'large_desktop'
}

// ========================================
// TEMPLATE TYPES
// ========================================

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  thumbnail: string;
  preview: string[];
  elements: BuilderElement[];
  styles: GlobalStyles;
  seo: TemplateSEO;
  isPremium: boolean;
  isPublic: boolean;
  author: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  rating: number;
  reviews: TemplateReview[]; }

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId?: string;
  children: TemplateCategory[]; }

export interface TemplateSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string; }

export interface TemplateReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date; }

export interface GlobalStyles {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  borders: BorderScale;
  shadows: ShadowScale;
  animations: AnimationPreset[]; }

export interface ColorPalette {
  primary: ColorSwatch;
  secondary: ColorSwatch;
  accent: ColorSwatch;
  neutral: ColorSwatch;
  success: ColorSwatch;
  warning: ColorSwatch;
  error: ColorSwatch;
  info: ColorSwatch; }

export interface ColorSwatch {
  base: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string; }

export interface TypographyScale {
  fontFamilies: FontFamily[];
  fontSizes: FontSize[];
  fontWeights: FontWeight[];
  lineHeights: LineHeight[];
  letterSpacings: LetterSpacing[]; }

export interface FontFamily {
  name: string;
  value: string;
  fallback: string[];
  category: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting'; }

export interface FontSize {
  name: string;
  value: number;
  unit: 'px' | 'rem' | 'em'; }

export interface FontWeight {
  name: string;
  value: number | string; }

export interface LineHeight {
  name: string;
  value: number; }

export interface LetterSpacing {
  name: string;
  value: number;
  unit: 'px' | 'em'; }

export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number; }

export interface BorderScale {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number; }

export interface ShadowScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string; }

export interface AnimationPreset {
  name: string;
  duration: number;
  easing: string;
  keyframes: Keyframe[]; }

export interface Keyframe {
  offset: number;
  properties: Record<string, any>; }

// ========================================
// COMPONENT LIBRARY TYPES
// ========================================

export interface ComponentLibrary {
  categories: ComponentCategory[];
  components: ComponentDefinition[];
  searchIndex: SearchIndex; }

export interface ComponentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  parentId?: string;
  children: ComponentCategory[]; }

export interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  preview: string;
  element: BuilderElement;
  props: ComponentProps;
  examples: ComponentExample[];
  documentation: ComponentDocumentation;
  isPremium: boolean;
  isPublic: boolean;
  author: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  rating: number; }

export interface ComponentProps {
  [key: string]: ComponentProp; }

export interface ComponentProp {
  type: PropType;
  required: boolean;
  default?: string | number | boolean | unknown[] | Record<string, any>;
  description: string;
  options?: string[];
  validation?: PropValidation; }

export interface ComponentExample {
  name: string;
  description: string;
  props: Record<string, any>;
  preview: string; }

export interface ComponentDocumentation {
  overview: string;
  usage: string;
  props: string;
  examples: string;
  bestPractices: string;
  accessibility: string; }

export interface SearchIndex {
  [key: string]: string[]; }

export enum PropType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  FUNCTION = 'function',
  ELEMENT = 'element',
  NODE = 'node'
}

export interface PropValidation {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: unknown) => boolean; }

// ========================================
// EXPORT ALL TYPES
// ========================================

export type {
  BuilderState,
  BuilderElement,
  ElementStyles,
  PositionStyles,
  LayoutStyles,
  TypographyStyles,
  ColorStyles,
  SpacingStyles,
  BorderStyles,
  EffectStyles,
  AnimationStyles,
  ResponsiveStyles,
  ElementConstraints,
  BuilderHistory,
  BuilderAction,
  PreviewSettings,
  GridSettings,
  SnapSettings,
  ElementType,
  ElementCategory,
  ActionType,
  DeviceType,
  Template,
  TemplateCategory,
  TemplateSEO,
  TemplateReview,
  GlobalStyles,
  ColorPalette,
  ColorSwatch,
  TypographyScale,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  SpacingScale,
  BorderScale,
  ShadowScale,
  AnimationPreset,
  Keyframe,
  ComponentLibrary,
  ComponentCategory,
  ComponentDefinition,
  ComponentProps,
  ComponentProp,
  ComponentExample,
  ComponentDocumentation,
  SearchIndex,
  PropType,
  PropValidation};
