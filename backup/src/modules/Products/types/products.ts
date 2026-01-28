// ========================================
// PRODUCTS MODULE - CORE TYPES
// ========================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  status: ProductStatus;
  category: ProductCategory;
  tags: string[];
  images: ProductImage[];
  variations: ProductVariation[];
  dimensions: ProductDimensions;
  weight: number;
  sku: string;
  inventory: ProductInventory;
  seo: ProductSEO;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariation {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku: string;
  attributes: Record<string, string>;
  inventory: number;
  images: string[];
  status: ProductStatus;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  structuredData: Record<string, any>;
}

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export enum ProductCategory {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
  SERVICE = 'service',
  SUBSCRIPTION = 'subscription'
}

// ========================================
// LANDING PAGE TYPES
// ========================================

export interface LandingPage {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  content: LandingPageContent;
  design: LandingPageDesign;
  seo: LandingPageSEO;
  analytics: LandingPageAnalytics;
  status: LandingPageStatus;
  productId?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface LandingPageContent {
  sections: LandingPageSection[];
  globalStyles: GlobalStyles;
  customCSS: string;
  customJS: string;
}

export interface LandingPageSection {
  id: string;
  type: SectionType;
  content: Record<string, any>;
  styles: SectionStyles;
  order: number;
  isVisible: boolean;
}

export interface LandingPageDesign {
  theme: string;
  colorScheme: ColorScheme;
  typography: Typography;
  layout: LayoutSettings;
  animations: AnimationSettings;
}

export interface LandingPageSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  structuredData: Record<string, any>;
  metaTags: MetaTag[];
}

export interface LandingPageAnalytics {
  views: number;
  conversions: number;
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: number;
  traffic: TrafficData[];
  conversions: ConversionData[];
}

export enum LandingPageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum SectionType {
  HERO = 'hero',
  FEATURES = 'features',
  TESTIMONIALS = 'testimonials',
  PRICING = 'pricing',
  FAQ = 'faq',
  CTA = 'cta',
  CONTACT = 'contact',
  CUSTOM = 'custom'
}

// ========================================
// LEAD CAPTURE FORM TYPES
// ========================================

export interface LeadCaptureForm {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  analytics: FormAnalytics;
  status: FormStatus;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  validation: FieldValidation;
  options?: string[];
  order: number;
}

export interface FormSettings {
  submitText: string;
  successMessage: string;
  redirectUrl?: string;
  emailNotifications: boolean;
  autoResponder: boolean;
  spamProtection: boolean;
  doubleOptIn: boolean;
}

export interface FormStyling {
  theme: string;
  colorScheme: ColorScheme;
  typography: Typography;
  layout: FormLayout;
  customCSS: string;
}

export interface FormAnalytics {
  views: number;
  submissions: number;
  conversionRate: number;
  fieldAnalytics: FieldAnalytics[];
}

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  DATE = 'date',
  FILE = 'file'
}

// ========================================
// ANALYTICS & TESTING TYPES
// ========================================

export interface ABTest {
  id: string;
  name: string;
  description: string;
  type: ABTestType;
  status: ABTestStatus;
  variants: ABTestVariant[];
  metrics: ABTestMetrics;
  results: ABTestResults;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface ABTestVariant {
  id: string;
  name: string;
  traffic: number; // percentage
  content: Record<string, any>;
  isControl: boolean;
}

export interface ABTestMetrics {
  primary: string; // conversion, click, etc.
  secondary: string[];
  minimumDetectableEffect: number;
  statisticalSignificance: number;
}

export interface ABTestResults {
  totalVisitors: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  winner?: string;
  isSignificant: boolean;
}

export enum ABTestType {
  LANDING_PAGE = 'landing_page',
  FORM = 'form',
  CTA = 'cta',
  HEADLINE = 'headline',
  IMAGE = 'image'
}

export enum ABTestStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// ========================================
// AI & OPTIMIZATION TYPES
// ========================================

export interface AIOptimization {
  id: string;
  type: OptimizationType;
  target: string; // page or form id
  suggestions: OptimizationSuggestion[];
  status: OptimizationStatus;
  results: OptimizationResults;
  createdAt: Date;
  updatedAt: Date;
}

export interface OptimizationSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  implementation: string;
  expectedImprovement: number;
}

export interface OptimizationResults {
  beforeMetrics: PerformanceMetrics;
  afterMetrics: PerformanceMetrics;
  improvement: number;
  confidence: number;
}

export enum OptimizationType {
  CONVERSION = 'conversion',
  PERFORMANCE = 'performance',
  SEO = 'seo',
  UX = 'ux'
}

export enum OptimizationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum SuggestionType {
  HEADLINE = 'headline',
  CTA = 'cta',
  LAYOUT = 'layout',
  COLOR = 'color',
  IMAGE = 'image',
  COPY = 'copy'
}

export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum EffortLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// ========================================
// SHARED TYPES
// ========================================

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

export interface Typography {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface LayoutSettings {
  maxWidth: number;
  padding: number;
  margin: number;
  gridColumns: number;
  gap: number;
}

export interface AnimationSettings {
  enabled: boolean;
  duration: number;
  easing: string;
  delay: number;
}

export interface GlobalStyles {
  colors: ColorScheme;
  typography: Typography;
  spacing: SpacingSettings;
  borders: BorderSettings;
  shadows: ShadowSettings;
}

export interface SpacingSettings {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface BorderSettings {
  radius: number;
  width: number;
  style: string;
}

export interface ShadowSettings {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface SectionStyles {
  padding: SpacingSettings;
  margin: SpacingSettings;
  background: string;
  borderRadius: number;
  boxShadow: string;
}

export interface FormLayout {
  columns: number;
  spacing: number;
  alignment: 'left' | 'center' | 'right';
  width: number;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface MetaTag {
  name: string;
  content: string;
  property?: string;
}

export interface TrafficData {
  date: Date;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgTimeOnPage: number;
}

export interface ConversionData {
  date: Date;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

export interface FieldAnalytics {
  fieldId: string;
  fieldName: string;
  views: number;
  interactions: number;
  completionRate: number;
  avgTimeToComplete: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  conversionRate: number;
  bounceRate: number;
  engagement: number;
  score: number;
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface LandingPagesResponse {
  data: LandingPage[];
  meta: PaginationMeta;
}

export interface LeadCaptureFormsResponse {
  data: LeadCaptureForm[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
}

export interface ProductsStats {
  totalProducts: number;
  activeProducts: number;
  totalLandingPages: number;
  publishedLandingPages: number;
  totalForms: number;
  publishedForms: number;
  totalConversions: number;
  avgConversionRate: number;
  revenue: number;
}

// ========================================
// FORM DATA TYPES
// ========================================

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  tags: string[];
  images: File[];
  dimensions: ProductDimensions;
  weight: number;
  sku: string;
  inventory: ProductInventory;
  seo: ProductSEO;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface CreateLandingPageData {
  name: string;
  title: string;
  description: string;
  productId?: string;
  template?: string;
}

export interface UpdateLandingPageData extends Partial<CreateLandingPageData> {
  id: string;
  content?: LandingPageContent;
  design?: LandingPageDesign;
  seo?: LandingPageSEO;
}

export interface CreateFormData {
  name: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
}

export interface UpdateFormData extends Partial<CreateFormData> {
  id: string;
}

export interface CreateABTestData {
  name: string;
  description: string;
  type: ABTestType;
  target: string;
  variants: ABTestVariant[];
  metrics: ABTestMetrics;
}

export interface UpdateABTestData extends Partial<CreateABTestData> {
  id: string;
}

// ========================================
// FILTER & SEARCH TYPES
// ========================================

export interface ProductsFilter {
  status?: ProductStatus[];
  category?: ProductCategory[];
  priceRange?: [number, number];
  tags?: string[];
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface LandingPagesFilter {
  status?: LandingPageStatus[];
  productId?: string;
  search?: string;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'conversion_rate';
  sortOrder?: 'asc' | 'desc';
}

export interface FormsFilter {
  status?: FormStatus[];
  search?: string;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'conversion_rate';
  sortOrder?: 'asc' | 'desc';
}

// ========================================
// EXPORT ALL TYPES
// ========================================

export type {
  Product,
  ProductVariation,
  ProductImage,
  ProductDimensions,
  ProductInventory,
  ProductSEO,
  ProductStatus,
  ProductCategory,
  LandingPage,
  LandingPageContent,
  LandingPageSection,
  LandingPageDesign,
  LandingPageSEO,
  LandingPageAnalytics,
  LandingPageStatus,
  SectionType,
  LeadCaptureForm,
  FormField,
  FormSettings,
  FormStyling,
  FormAnalytics,
  FormStatus,
  FieldType,
  ABTest,
  ABTestVariant,
  ABTestMetrics,
  ABTestResults,
  ABTestType,
  ABTestStatus,
  AIOptimization,
  OptimizationSuggestion,
  OptimizationResults,
  OptimizationType,
  OptimizationStatus,
  SuggestionType,
  ImpactLevel,
  EffortLevel,
  ColorScheme,
  Typography,
  LayoutSettings,
  AnimationSettings,
  GlobalStyles,
  SpacingSettings,
  BorderSettings,
  ShadowSettings,
  SectionStyles,
  FormLayout,
  FieldValidation,
  MetaTag,
  TrafficData,
  ConversionData,
  FieldAnalytics,
  PerformanceMetrics,
  ProductsResponse,
  LandingPagesResponse,
  LeadCaptureFormsResponse,
  PaginationMeta,
  ProductsStats,
  CreateProductData,
  UpdateProductData,
  CreateLandingPageData,
  UpdateLandingPageData,
  CreateFormData,
  UpdateFormData,
  CreateABTestData,
  UpdateABTestData,
  ProductsFilter,
  LandingPagesFilter,
  FormsFilter
};
