/**
 * Estado vazio quando n?o h? projetos dispon?veis
 *
 * @description
 * Exibe bot?es para criar projeto e abrir modo Universe quando n?o h?
 * projetos dispon?veis para sele??o.
 *
 * @module layouts/components/ProjectSelector/EmptyProjectState
 * @since 1.0.0
 */

import React from "react";
import { PlusCircle } from 'lucide-react';
import Button from "@/shared/components/ui/Button";
import { cn } from '@/lib/utils';
import UniverseButton from "./UniverseButton";

/**
 * Props do componente EmptyProjectState
 *
 * @interface EmptyProjectStateProps
 * @property {'sm' | 'md' | 'lg'} size - Tamanho dos bot?es
 * @property {boolean} showUniverseMode - Se deve exibir o bot?o do modo Universe
 * @property {string} className - Classes CSS adicionais
 * @property {() => void} onOpenUniverseMode - Callback para abrir modo Universe
 */
interface EmptyProjectStateProps {
  size: "sm" | "md" | "lg";
  showUniverseMode: boolean;
  className: string;
  onOpenUniverseMode??: (e: any) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente EmptyProjectState
 *
 * @description
 * Renderiza estado vazio com op??es para criar projeto e abrir modo Universe.
 * Usado quando n?o h? projetos dispon?veis para sele??o.
 *
 * @param {EmptyProjectStateProps} props - Props do componente
 * @returns {JSX.Element} Estado vazio de projetos
 *
 * @example
 * ```tsx
 * <EmptyProjectState
 *   size="md"
 *   showUniverseMode={ true }
 *   className="mt-4"
 *   onOpenUniverseMode={ () => router.visit('/universe') }
 * />
 * ```
 */
const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ size,
  showUniverseMode,
  className,
  onOpenUniverseMode,
   }) => { return (
        <>
      <div className={cn("flex items-center gap-2", className)  }>
      </div><Button variant="outline" size={ size } />
        <PlusCircle className="w-4 h-4 mr-2" />
        Criar Projeto
      </Button>
      {showUniverseMode && (
        <UniverseButton size={size} onClick={onOpenUniverseMode} / />
      )}
    </div>);};

export default EmptyProjectState;
