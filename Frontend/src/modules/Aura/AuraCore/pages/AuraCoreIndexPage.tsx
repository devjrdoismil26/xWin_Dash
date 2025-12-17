/**
 * Página Principal do Módulo AuraCore
 *
 * @description
 * Página principal do módulo AuraCore com dashboard de visão geral do sistema.
 * Exibe dashboard completo com métricas, estatísticas e funcionalidades do Aura.
 *
 * @module modules/Aura/AuraCore/pages/AuraCoreIndexPage
 * @since 1.0.0
 */

import React from 'react';
import { AuraDashboard } from '../components';
import { cn } from '@/lib/utils';

/**
 * Props do componente AuraCoreIndexPage
 *
 * @interface AuraCoreIndexPageProps
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface AuraCoreIndexPageProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AuraCoreIndexPage
 *
 * @description
 * Renderiza página principal do AuraCore com dashboard completo.
 * Exibe visão geral do sistema Aura com métricas e estatísticas.
 *
 * @param {AuraCoreIndexPageProps} props - Props do componente
 * @returns {JSX.Element} Página principal do AuraCore
 */
export const AuraCoreIndexPage: React.FC<AuraCoreIndexPageProps> = ({ className    }) => { return (
        <>
      <div className={cn("aura-core-index-page", className)  }>
      </div><AuraDashboard / />
    </div>);};
