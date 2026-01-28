
import { vi } from 'vitest';

declare global {
  interface Window {
    Echo?: any;
  }

  // Tipos para testes
  namespace Vi {
    interface MockedFunction<T extends (...args: any[]) => any> {
      (...args: Parameters<T>): ReturnType<T>;
      mockClear(): void;
      mockReset(): void;
      mockRestore(): void;
      mockImplementation(fn: T): this;
      mockReturnValue(value: ReturnType<T>): this;
      mockResolvedValue(value: Awaited<ReturnType<T>>): this;
      mockRejectedValue(value: any): this;
    }
  }

  // Tipos para componentes
  type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

  // Tipos para navegação
  interface MenuItem {
    id: string;
    label: string;
    name?: string;
    icon?: React.ReactNode;
    href?: string;
    route?: string;
    children?: MenuItem[];
    subItems?: MenuItem[];
    permissions?: string[];
    isPrimary?: boolean;
    color?: string;
    isNew?: boolean;
    isPro?: boolean;
    badge?: string;
    description?: string;
  }

  // Tipos para notificações
  interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
  }

  // Tipos para usuário
  interface User {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    permissions?: string[];
  }

  // Tipos para projetos
  interface Project {
    id: string | number;
    name: string;
    description: string;
    status: string;
    progress?: number;
    start_date?: string;
    end_date?: string;
    owner?: string;
    members?: string[];
    tags?: string[];
  }

  // Tipos para universos
  interface Universe {
    id: string | number;
    name: string;
    description: string;
    status: string;
    projectsCount: number;
    totalBudget: number;
    createdAt: string;
    owner: string;
    tags: string[];
  }

  // Tipos para campanhas de email
  interface EmailCampaign {
    id: string | number;
    name: string;
    subject: string;
    status: string;
    recipients: number;
    openRate: number;
    clickRate: number;
    unsubscribeRate: number;
    createdAt: string;
    scheduledFor?: string | null;
  }

  // Tipos para posts sociais
  interface SocialPost {
    id: string;
    content: string;
    platform: string;
    status: string;
    engagement: number;
    scheduledAt?: string;
    publishedAt?: string;
  }

  // Tipos para leads
  interface Lead {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    status: string;
    source: string;
    created_at: string;
  }

  // Tipos para layouts
  interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
  }

  // Tipos para botões
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    asChild?: boolean;
    children: React.ReactNode;
  }

  // Tipos para cards
  interface CardProps {
    children?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
  }

  // Tipos para tooltips
  interface TooltipProps {
    children: any;
    content: any;
    position?: string;
    placement?: string;
    delay?: number;
    className?: string;
    disabled?: boolean;
  }

  // Tipos para modais
  interface ModalProps {
    isOpen: any;
    onClose: any;
    title?: any;
    children?: any;
    size?: string;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    className?: string;
  }

  // Tipos para confirmação
  interface ConfirmationModalProps {
    isOpen: any;
    onClose: any;
    onConfirm: any;
    title?: string;
    message?: string;
    text?: string;
    type?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
  }

  // Tipos para render customizado de testes
  interface CustomRenderOptions {
    queryClient?: any;
    theme?: 'light' | 'dark' | 'system';
    withInertia?: boolean;
    withRouter?: boolean;
  }

  // Declaração do moment global
  const moment: any;
}

export {};
