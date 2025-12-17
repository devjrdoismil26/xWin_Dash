/**
 * Componente Avatar - Avatar de Usuário
 *
 * @description
 * Componente que renderiza um avatar de usuário com suporte a imagem,
 * fallback de texto ou ícone padrão. Suporta múltiplos tamanhos e
 * personalização através de classes CSS.
 *
 * Funcionalidades principais:
 * - Exibição de imagem do usuário (quando disponível)
 * - Fallback com texto (iniciais ou nome)
 * - Fallback com ícone padrão (User do lucide-react)
 * - Múltiplos tamanhos configuráveis
 * - Estilo circular com bordas arredondadas
 * - Suporte completo a dark mode
 *
 * @module components/ui/Avatar
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Avatar from '@/shared/components/ui/Avatar';
 *
 * // Avatar com imagem
 * <Avatar src="/path/to/image.jpg" alt="User Name" / />
 *
 * // Avatar com fallback de texto
 * <Avatar fallback="JD" size="lg" / />
 *
 * // Avatar com ícone padrão
 * <Avatar size="md" / />
 * ```
 */

import React from "react";
import { User } from 'lucide-react';
import { getSizeClasses, ComponentSize } from './design-tokens';

/**
 * Props do componente Avatar
 *
 * @description
 * Propriedades que podem ser passadas para o componente Avatar.
 *
 * @interface AvatarProps
 * @property {string} [src] - URL da imagem do avatar (opcional)
 * @property {string} [alt=''] - Texto alternativo para a imagem (opcional, padrão: '')
 * @property {ComponentSize} [size='md'] - Tamanho do avatar (opcional, padrão: 'md')
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padrão: '')
 * @property {string} [fallback] - Texto de fallback quando não há imagem (opcional)
 */
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: ComponentSize;
  className?: string;
  fallback?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente Avatar
 *
 * @description
 * Renderiza um avatar de usuário com imagem, fallback de texto ou ícone.
 * Prioriza a exibição da imagem, depois o texto de fallback e por último
 * o ícone padrão.
 *
 * @component
 * @param {AvatarProps} props - Props do componente
 * @param {string} [props.src] - URL da imagem do avatar
 * @param {string} [props.alt=''] - Texto alternativo para a imagem
 * @param {ComponentSize} [props.size='md'] - Tamanho do avatar
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {string} [props.fallback] - Texto de fallback
 * @returns {JSX.Element} Componente de avatar
 */
const Avatar: React.FC<AvatarProps> = ({ src,
  alt = "",
  size = "md",
  className = "",
  fallback,
   }) => {
  const sizeClasses = getSizeClasses(size, "icon");

  const baseClasses = `inline-flex items-center justify-center rounded-full bg-gray-100 ${sizeClasses} ${className}`;

  if (src) {
    return (
              <img src={src} alt={alt} className={`${baseClasses} object-cover`} / />);

  }

  return (
        <>
      <div className={baseClasses  }>
      </div>{fallback ? (
        <span className="text-sm font-medium text-gray-600">{fallback}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>);};

export default Avatar;
