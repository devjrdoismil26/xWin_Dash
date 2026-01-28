// ========================================
// PRODUCTS MODULE - UNIFIED TYPES
// ========================================
// Arquivo principal de tipos unificado e alinhado com backend Laravel

// ===== CORE PRODUCT TYPES =====
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  status: ProductStatus;
  category: ProductCategory;
  type: ProductType; // 'physical' | 'digital'
  tags: string[];
  images: ProductImage[];
  variations: ProductVariation[];
  dimensions?: ProductDimensions;
  weight?: number;
  sku: string;
  inventory: ProductInventory;
  seo: ProductSEO;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  name: string;
  price: number;
  sku: string;
  attributes: Record<string, string>;
  inventory: number;
  images: string[];
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  caption: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in' | 'm';
}

export interface ProductInventory {
  quantity: number;
  reserved: number;
  available: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  warehouse_location?: string;
}

export interface ProductSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  slug: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived' | 'out_of_stock';
export type ProductCategory = 'physical' | 'digital' | 'service' | 'subscription' | 'bundle';
export type ProductType = 'physical' | 'digital';

// ===== LANDING PAGE TYPES =====
export interface LandingPage {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  content: LandingPageContent;
  design: LandingPageDesign;
  seo: LandingPageSEO;
  analytics: LandingPageAnalytics;
  status: LandingPageStatus;
  product_id?: number;
  project_id: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface LandingPageContent {
  sections: LandingPageSection[];
  global_styles: GlobalStyles;
  custom_css: string;
  custom_js: string;
}

export interface LandingPageSection {
  id: string;
  type: SectionType;
  content: Record<string, any>;
  styles: SectionStyles;
  order: number;
  is_visible: boolean;
}

export interface LandingPageDesign {
  theme: string;
  color_scheme: ColorScheme;
  typography: Typography;
  layout: LayoutSettings;
  animations: AnimationSettings;
}

export interface LandingPageSEO {
  title: string;
  description: string;
  keywords: string[];
  canonical_url: string;
  og_image: string;
  structured_data: Record<string, any>;
  meta_tags: MetaTag[];
}

export interface LandingPageAnalytics {
  views: number;
  conversions: number;
  conversion_rate: number;
  bounce_rate: number;
  avg_time_on_page: number;
  traffic: TrafficData[];
  conversions_data: ConversionData[];
}

export type LandingPageStatus = 'draft' | 'published' | 'archived';
export type SectionType = 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'cta' | 'contact' | 'custom';

// ===== LEAD CAPTURE FORM TYPES =====
export interface LeadCaptureForm {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  analytics: FormAnalytics;
  status: FormStatus;
  project_id: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
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
  submit_text: string;
  success_message: string;
  redirect_url?: string;
  email_notifications: boolean;
  auto_responder: boolean;
  spam_protection: boolean;
  double_opt_in: boolean;
}

export interface FormStyling {
  theme: string;
  color_scheme: ColorScheme;
  typography: Typography;
  layout: FormLayout;
  custom_css: string;
}

export interface FormAnalytics {
  views: number;
  submissions: number;
  conversion_rate: number;
  field_analytics: FieldAnalytics[];
}

export type FormStatus = 'draft' | 'published' | 'archived';
export type FieldType = 'text' | 'email' | 'phone' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'file';

// ===== LEAD TYPES =====
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  source: string;
  form_id?: number;
  landing_page_id?: number;
  product_id?: number;
  project_id: number;
  status: LeadStatus;
  score: number;
  tags: string[];
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

// ===== SHARED DESIGN TYPES =====
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

export interface Typography {
  font_family: string;
  font_size: number;
  font_weight: number;
  line_height: number;
  letter_spacing: number;
}

export interface LayoutSettings {
  max_width: number;
  padding: number;
  margin: number;
  grid_columns: number;
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
  border_radius: number;
  box_shadow: string;
}

export interface FormLayout {
  columns: number;
  spacing: number;
  alignment: 'left' | 'center' | 'right';
  width: number;
}

export interface FieldValidation {
  min_length?: number;
  max_length?: number;
  pattern?: string;
  custom_message?: string;
}

export interface MetaTag {
  name: string;
  content: string;
  property?: string;
}

export interface TrafficData {
  date: string;
  visitors: number;
  page_views: number;
  bounce_rate: number;
  avg_time_on_page: number;
}

export interface ConversionData {
  date: string;
  conversions: number;
  conversion_rate: number;
  revenue: number;
}

export interface FieldAnalytics {
  field_id: string;
  field_name: string;
  views: number;
  interactions: number;
  completion_rate: number;
  avg_time_to_complete: number;
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  validation_errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ===== FORM DATA TYPES =====
export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  currency: string;
  category: ProductCategory;
  type: ProductType;
  tags: string[];
  images: File[];
  dimensions?: ProductDimensions;
  weight?: number;
  sku: string;
  inventory: ProductInventory;
  seo: ProductSEO;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}

export interface CreateLandingPageData {
  name: string;
  title: string;
  description: string;
  product_id?: number;
  template?: string;
}

export interface UpdateLandingPageData extends Partial<CreateLandingPageData> {
  id: number;
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
  id: number;
}

// ===== FILTER TYPES =====
export interface ProductsFilter {
  search?: string;
  status?: ProductStatus[];
  category?: ProductCategory[];
  type?: ProductType[];
  tags?: string[];
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  project_id?: number;
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at' | 'inventory';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface LandingPagesFilter {
  status?: LandingPageStatus[];
  product_id?: number;
  search?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'conversion_rate';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface FormsFilter {
  status?: FormStatus[];
  search?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'conversion_rate';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface LeadsFilter {
  status?: LeadStatus[];
  source?: string[];
  product_id?: number;
  form_id?: number;
  landing_page_id?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: 'name' | 'email' | 'created_at' | 'score';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// ===== STATISTICS TYPES =====
export interface ProductsStats {
  total_products: number;
  active_products: number;
  inactive_products: number;
  draft_products: number;
  out_of_stock_products: number;
  physical_products: number;
  digital_products: number;
  products_by_category: Record<ProductCategory, number>;
  products_by_status: Record<ProductStatus, number>;
  total_inventory_value: number;
  low_stock_products: number;
  top_selling_products: Array<{
    id: number;
    name: string;
    sales_count: number;
    revenue: number;
  }>;
  recent_products: Product[];
}

export interface LandingPagesStats {
  total_landing_pages: number;
  published_landing_pages: number;
  draft_landing_pages: number;
  total_views: number;
  total_conversions: number;
  avg_conversion_rate: number;
  top_performing_pages: Array<{
    id: number;
    name: string;
    views: number;
    conversions: number;
    conversion_rate: number;
  }>;
}

export interface FormsStats {
  total_forms: number;
  published_forms: number;
  draft_forms: number;
  total_submissions: number;
  avg_conversion_rate: number;
  top_performing_forms: Array<{
    id: number;
    name: string;
    views: number;
    submissions: number;
    conversion_rate: number;
  }>;
}

export interface LeadsStats {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  converted_leads: number;
  lost_leads: number;
  avg_lead_score: number;
  leads_by_source: Record<string, number>;
  leads_by_status: Record<LeadStatus, number>;
  conversion_rate: number;
}

// ===== EXPORT ALL TYPES =====
export type {
  Product,
  ProductVariation,
  ProductImage,
  ProductDimensions,
  ProductInventory,
  ProductSEO,
  ProductStatus,
  ProductCategory,
  ProductType,
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
  Lead,
  LeadStatus,
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
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  CreateProductData,
  UpdateProductData,
  CreateLandingPageData,
  UpdateLandingPageData,
  CreateFormData,
  UpdateFormData,
  ProductsFilter,
  LandingPagesFilter,
  FormsFilter,
  LeadsFilter,
  ProductsStats,
  LandingPagesStats,
  FormsStats,
  LeadsStats
};