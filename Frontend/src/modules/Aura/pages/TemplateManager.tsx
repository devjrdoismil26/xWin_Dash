/**
 * @module TemplateManager
 * @description P?gina para gerenciar templates de mensagens do Aura.
 * 
 * Esta p?gina ? um wrapper simples que utiliza o componente TemplateEditor
 * para criar e editar templates. Pode ser usado para criar novos templates
 * ou editar templates existentes.
 * 
 * @example
 * ```tsx
 * // Rota Inertia.js
 * <TemplateManager / />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import TemplateEditor from '@/modules/Aura/components/TemplateEditor';

/**
 * Interface para as propriedades do componente TemplateManager
 * 
 * @interface TemplateManagerProps
 * @property {string} [initial] - ID ou dados iniciais do template (para edi??o)
 */
interface TemplateManagerProps {
  /** ID ou dados iniciais do template (para edi??o) */
initial?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente de p?gina para gerenciar templates
 * 
 * @param {TemplateManagerProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const TemplateManager: React.FC<TemplateManagerProps> = ({ initial = ''    }) => (
  <PageLayout title="Templates" />
    <TemplateEditor / />
  </PageLayout>);

export default TemplateManager;
