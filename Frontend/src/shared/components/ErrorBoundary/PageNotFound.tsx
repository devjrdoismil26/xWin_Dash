/**
 * Componente PageNotFound - Página 404 de Erro
 *
 * @description
 * Componente que exibe uma página de erro 404 personalizada quando uma rota
 * não é encontrada. Fornece uma interface amigável com opções de navegação
 * para retornar ao dashboard ou à página inicial.
 *
 * Funcionalidades principais:
 * - Exibição de erro 404 com design amigável
 * - Mensagem clara sobre página não encontrada
 * - Botões de navegação para dashboard e página inicial
 * - Layout responsivo e acessível
 * - Integração com AuthenticatedLayout
 *
 * @module components/ErrorBoundary/PageNotFound
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import PageNotFound from '@/shared/components/ErrorBoundary/PageNotFound';
 *
 * // Uso em rotas não encontradas
 * <PageNotFound auth={auth} / />
 * ```
 */

import React from "react";
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/Button";

/**
 * Props do componente PageNotFound
 *
 * @description
 * Propriedades que podem ser passadas para o componente PageNotFound.
 *
 * @interface PageNotFoundProps
 * @property {object} [auth] - Dados de autenticação do usuário
 * @property {object} [auth.user] - Informações do usuário autenticado
 * @property {string} [auth.user.id] - ID do usuário
 * @property {string} [auth.user.name] - Nome do usuário
 * @property {string} [auth.user.email] - Email do usuário
 */
interface PageNotFoundProps {
  auth?: { user?: { id: string;
  name: string;
  email: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; } ;

}

/**
 * Componente PageNotFound
 *
 * @description
 * Renderiza uma página de erro 404 com mensagem amigável e opções de navegação.
 *
 * @component
 * @param {PageNotFoundProps} props - Props do componente
 * @param {object} [props.auth] - Dados de autenticação
 * @returns {JSX.Element} Componente de página 404
 */
const PageNotFound: React.FC<PageNotFoundProps> = ({ auth    }) => { return (
        <>
      <AuthenticatedLayout user={auth?.user } />
      <Head title="Página não encontrada" / />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h1 className="text-9xl font-bold text-gray-300">404</h1>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900" />
              Página não encontrada
            </h2>
            <p className="mt-2 text-sm text-gray-600" />
              A página que você está procurando não existe.
            </p></div><Card />
            <Card.Content className="p-6 text-center" />
              <div className=" ">$2</div><p className="text-gray-600" />
                  Você pode voltar ao dashboard ou tentar uma das opções abaixo.
                </p>

                <div className=" ">$2</div><Button asChild className="w-full" />
                    <Link href="/dashboard">Voltar ao Dashboard</Link></Button><Button variant="outline" asChild className="w-full" />
                    <Link href="/">Página Inicial</Link></Button></div>
            </Card.Content></Card></div>
    </AuthenticatedLayout>);};

export default PageNotFound;
