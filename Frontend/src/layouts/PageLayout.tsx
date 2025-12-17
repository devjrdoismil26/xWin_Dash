/**
 * Layout flex?vel para p?ginas da aplica??o
 *
 * @description
 * Layout completo e altamente customiz?vel para p?ginas internas.
 * Suporta breadcrumbs, header com t?tulo/subt?tulo/a??es, diferentes variantes e tamanhos.
 *
 * @module layouts/PageLayout
 * @since 1.0.0
 */

import React, { useMemo } from "react";
import { cn } from '@/lib/utils';
import { ComponentSize } from '@/shared/components/ui/design-tokens';

/**
 * Props do componente PageLayout
 *
 * @interface PageLayoutProps
 * @property {string} [title] - T?tulo da p?gina exibido no header
 * @property {string} [subtitle] - Subt?tulo da p?gina exibido no header
 * @property {React.ReactNode} [actions] - A??es adicionais exibidas no header (bot?es, etc.)
 * @property {React.ReactNode} [breadcrumbs] - Breadcrumbs da p?gina
 * @property {boolean} [showHeader] - Se deve exibir o header (padr?o: true)
 * @property {boolean} [padded] - Se deve adicionar padding ao conte?do (padr?o: true)
 * @property {'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'} [maxWidth] - Largura m?xima do conte?do (padr?o: '7xl')
 * @property {boolean} [centered] - Se deve centralizar o conte?do (padr?o: true)
 * @property {ComponentSize} [size] - Tamanho do componente que afeta padding e espa?amento (padr?o: 'md')
 * @property {'default' | 'contained' | 'fluid'} [variant] - Variante visual do layout (padr?o: 'default')
 * @property {string} [className] - Classes CSS adicionais para o container principal
 * @property {string} [headerClassName] - Classes CSS adicionais para o header
 * @property {string} [contentClassName] - Classes CSS adicionais para o conte?do
 * @property {React.ReactNode} [children] - Conte?do da p?gina
 */
export interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  showHeader?: boolean;
  padded?: boolean;
  maxWidth?:
| "sm"
| "md"
| "lg"
| "xl"
| "2xl"
| "3xl"
| "4xl"
| "5xl"
| "6xl"
| "7xl"
| "full";
  centered?: boolean;
  size?: ComponentSize;
  variant?: "default" | "contained" | "fluid";
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode; }

const maxWidthClassesMap: Record<
  NonNullable<PageLayoutProps["maxWidth"]>,
  string
> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",};

const paddingBySize: Record<ComponentSize, string> = {
  sm: "p-3 md:p-4",
  md: "p-4 md:p-6 lg:p-8",
  lg: "p-6 md:p-8 lg:p-12",
  xl: "p-8 md:p-12 lg:p-16",};

/**
 * Componente PageLayout
 *
 * @description
 * Layout completo e flex?vel para p?ginas internas com suporte a breadcrumbs,
 * header customiz?vel, diferentes variantes e controle total sobre espa?amento e largura.
 *
 * @param {PageLayoutProps} props - Props do componente
 * @returns {JSX.Element} Layout de p?gina
 *
 * @example
 * ```tsx
 * <PageLayout
 *   title="Dashboard"
 *   subtitle="Vis?o geral do sistema"
 *   actions={ <Button>Criar</Button> }
 *   breadcrumbs={ <Breadcrumbs items={items } />}
 *   maxWidth="7xl"
 *   variant="default"
 * >
 *   <DashboardContent / />
 * </PageLayout>
 * ```
 */
const PageLayout: React.FC<PageLayoutProps> = ({ title,
  subtitle,
  actions,
  breadcrumbs,
  showHeader = true,
  padded = true,
  maxWidth = "7xl",
  centered = true,
  size = "md",
  variant = "default",
  className = "",
  headerClassName = "",
  contentClassName = "",
  children,
   }) => {
  const containerClasses = useMemo(() => {
    const baseClasses = "min-h-screen";

    switch (variant) {
      case "contained":
        return cn(baseClasses, "bg-gray-50 dark:bg-gray-900", className);

      case "fluid":
        return cn(baseClasses, "bg-white dark:bg-gray-800", className);

      default:
        return cn(baseClasses, "bg-gray-50 dark:bg-gray-900", className);

    } , [variant, className]);

  const contentClasses = useMemo(() => {
    const baseClasses = [
      "w-full",
      centered && "mx-auto",
      padded && paddingBySize[size],
      maxWidthClassesMap[maxWidth],
    ].filter(Boolean);

    return cn(...baseClasses, contentClassName);

  }, [maxWidth, centered, padded, size, contentClassName]);

  const headerClasses = useMemo(() => {
    const baseClasses = [
      "mb-6 pb-4",
      (title || subtitle || actions) &&
        "border-b border-gray-200 dark:border-gray-700",
    ].filter(Boolean);

    return cn(...baseClasses, headerClassName);

  }, [title, subtitle, actions, headerClassName]);

  return (
        <>
      <div className={containerClasses  }>
      </div>{/* Breadcrumbs */}
      { breadcrumbs && (
        <div className=" ">$2</div><div className={cn("mx-auto", maxWidthClassesMap[maxWidth])  }>
        </div>{breadcrumbs}
          </div>
      )}

      {/* Main Content */}
      <div className={contentClasses  }>
        </div>{/* Page Header */}
        { showHeader && (title || subtitle || actions) && (
          <header
            className={cn(
              headerClasses,
              "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6",
            ) } />
            <div className=" ">$2</div><div className="{title && (">$2</div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent" />
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl" />
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="{actions}">$2</div>
    </div>
  )}
            </div>
      </header>
    </>
  )}

        {/* Page Content */}
        <main className="flex-1" />
          {variant === "contained" ? (
            <div className="{children}">$2</div>
    </div>
  ) : (
            children
          )}
        </main>
      </div>);};

export default PageLayout;
