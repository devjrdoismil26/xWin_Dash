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
  updatedAt: Date; }

export interface LandingPageContent {
  sections: PageSection[];
  components: PageComponent[];
  layout: PageLayout; }

export interface PageSection {
  id: string;
  type: SectionType;
  title: string;
  content: unknown;
  order: number;
  isVisible: boolean; }

export interface PageComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children?: PageComponent[]; }

export interface PageLayout {
  template: string;
  columns: number;
  spacing: number;
  backgroundColor: string; }

export interface LandingPageDesign {
  theme: string;
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  customCSS?: string; }

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string; }

export interface Typography {
  fontFamily: string;
  headingFont: string;
  bodyFont: string;
  fontSize: number; }

export interface Spacing {
  padding: number;
  margin: number;
  gap: number; }

export interface LandingPageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string; }

export interface LandingPageAnalytics {
  views: number;
  conversions: number;
  conversionRate: number;
  bounceRate: number;
  averageTime: number; }

export type LandingPageStatus = 'draft' | 'published' | 'archived';
export type SectionType = 'hero' | 'features' | 'pricing' | 'testimonials' | 'faq' | 'cta' | 'custom';
export type ComponentType = 'text' | 'image' | 'button' | 'form' | 'video' | 'custom';
