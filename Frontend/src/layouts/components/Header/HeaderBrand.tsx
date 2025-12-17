/**
 * Componente de marca do header
 *
 * @description
 * Exibe o logo e nome da aplica??o no header. Inclui link para p?gina inicial.
 * Nome completo e tagline s?o ocultados em telas pequenas.
 *
 * @module layouts/components/Header/HeaderBrand
 * @since 1.0.0
 */

import React from "react";
import { Link } from '@inertiajs/react';

/**
 * Props do componente HeaderBrand
 *
 * @interface HeaderBrandProps
 * @property {string} [className] - Classes CSS adicionais
 */
interface HeaderBrandProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente HeaderBrand
 *
 * @description
 * Renderiza a marca da aplica??o (logo e nome) no header com link para p?gina inicial.
 * Responsivo: oculta texto em telas pequenas, mant?m apenas o logo.
 *
 * @param {HeaderBrandProps} props - Props do componente
 * @returns {JSX.Element} Marca do header
 *
 * @example
 * ```tsx
 * <HeaderBrand className="mr-4" />
 * ```
 */
const HeaderBrand: React.FC<HeaderBrandProps> = ({ className = ""    }) => {
  return (
        <>
      <div className={`shrink-0 flex items-center ${className} `}>
      </div><Link href="/" className="flex items-center space-x-3" />
        <div className=" ">$2</div><span className="text-white font-bold text-sm">xW</span></div><div className=" ">$2</div><h1 className="text-xl font-bold text-gray-900 dark:text-white" />
            xWin Dash
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400" />
            Business Platform
          </p></div></Link>
    </div>);};

export default HeaderBrand;
