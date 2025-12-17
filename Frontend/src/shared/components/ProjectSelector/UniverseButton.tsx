/**
 * Componente UniverseButton - Bot?o do Universe
 *
 * @description
 * Componente de bot?o especial para acesso ao Universe (modo IA avan?ado).
 * Exibe um bot?o com gradiente, ?cones e badge "Novo" para destacar a funcionalidade.
 *
 * Funcionalidades principais:
 * - Gradiente visual (purple/blue)
 * - ?cones Brain e Sparkles
 * - Badge "Novo" destacado
 * - M?ltiplos tamanhos (sm, md, lg)
 * - Suporte completo a dark mode
 * - Transi??es suaves
 *
 * @module layouts/components/ProjectSelector/UniverseButton
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import UniverseButton from '@/layouts/components/ProjectSelector/UniverseButton';
 *
 * <UniverseButton
 *   size="md"
 *   onClick={ () => router.visit('/universe') }
 * />
 * ```
 */

import React from "react";
import { Brain, Sparkles } from 'lucide-react';
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";

/**
 * Tamanhos dispon?veis para o bot?o
 *
 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
 */
type ButtonSize = "sm" | "md" | "lg";

/**
 * Props do componente UniverseButton
 *
 * @description
 * Propriedades que podem ser passadas para o componente UniverseButton.
 *
 * @interface UniverseButtonProps
 * @property {ButtonSize} size - Tamanho do bot?o
 * @property {() => void} onClick - Fun??o chamada ao clicar no bot?o
 */
interface UniverseButtonProps {
  size: ButtonSize;
  onClick?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: any) => void; }

/**
 * Componente UniverseButton
 *
 * @description
 * Renderiza um bot?o especial com gradiente e ?cones para acesso ao Universe.
 * Inclui badge "Novo" para destacar a funcionalidade.
 *
 * @component
 * @param {UniverseButtonProps} props - Props do componente
 * @param {ButtonSize} props.size - Tamanho do bot?o
 * @param {() => void} props.onClick - Fun??o ao clicar
 * @returns {JSX.Element} Componente de bot?o Universe
 */
const UniverseButton: React.FC<UniverseButtonProps> = ({ size, onClick    }) => {
  return (
            <div className=" ">$2</div><Button
        variant="outline"
        size={ size }
        onClick={ onClick }
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 hover:shadow-lg transition-all duration-200" />
        <Brain className="w-4 h-4 mr-2 text-purple-600" />
        <span className="Universe">$2</span>
        </span>
        <Sparkles className="w-3 h-3 ml-1 text-yellow-500" /></Button><Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5" />
        Novo
      </Badge>
    </div>);};

export default UniverseButton;
