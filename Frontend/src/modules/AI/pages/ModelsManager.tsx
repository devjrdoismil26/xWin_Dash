/**
 * P?gina ModelsManager - Gerenciamento de Modelos de IA
 * @module modules/AI/pages/ModelsManager
 * @description
 * P?gina para gerenciar modelos de IA, usando componente ModelManager para
 * exibi??o e gerenciamento. Integra com PageLayout para fornecer estrutura
 * consistente de p?gina.
 * @since 1.0.0
 */
import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import ModelManager from '@/modules/AI/components/ModelManager';

/**
 * Interface ModelsManagerProps - Props da p?gina ModelsManager
 * @interface ModelsManagerProps
 * @property {string[]} [models=[]] - Lista inicial de modelos (opcional, padr?o: [])
 */
interface ModelsManagerProps {
  models?: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ModelsManager - P?gina de Gerenciamento de Modelos de IA
 * @component
 * @description
 * Componente que renderiza a p?gina de gerenciamento de modelos de IA,
 * exibindo interface de gerenciamento de modelos.
 * 
 * @param {ModelsManagerProps} props - Props da p?gina
 * @returns {JSX.Element} P?gina de gerenciamento de modelos
 * 
 * @example
 * ```tsx
 * <ModelsManager models={['gpt-4', 'gpt-3.5-turbo']} / />
 * ```
 */
const ModelsManager: React.FC<ModelsManagerProps> = ({ models = [] as unknown[]    }) => (
  <PageLayout title="Gerenciar Modelos" />
    <ModelManager models={models} / />
  </PageLayout>);

export default ModelsManager;
