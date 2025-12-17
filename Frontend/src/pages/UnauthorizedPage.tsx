/**
 * FE-024: Página de Não Autorizado
 * @module pages/UnauthorizedPage
 * @description
 * Página exibida quando o usuário não tem permissões para acessar um recurso.
 */
import React from 'react';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';

const UnauthorizedPage: React.FC = () => {
  return (
            <div className=" ">$2</div><Card className="max-w-md w-full p-8 text-center" />
        <div className=" ">$2</div><div className=" ">$2</div><ShieldX className="w-8 h-8 text-red-600 dark:text-red-400" /></div><h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" />
            Acesso Negado
          </h1>
          <p className="text-gray-600 dark:text-gray-400" />
            Você não tem permissão para acessar este recurso.
          </p></div><div className=" ">$2</div><Button asChild className="w-full" />
            <Link to="/dashboard" />
              <Home className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Link></Button><Button variant="outline" asChild className="w-full" />
            <Link to="/" />
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link></Button></div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400" />
          Se você acredita que deveria ter acesso, entre em contato com o administrador.
        </p></Card></div>);};

export default UnauthorizedPage;
