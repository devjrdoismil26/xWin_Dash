/**
 * Página de Administração de Usuários
 *
 * @description
 * Página para administração de usuários do sistema.
 * Requer permissões de admin ou user_management para acesso.
 *
 * @module modules/Users/pages/AdminIndex
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import ProtectedRoute from './components/Routes/ProtectedRoute';

/**
 * Componente UsersAdminIndex
 *
 * @description
 * Renderiza página de administração de usuários com rota protegida.
 * Exibe ferramentas administrativas para gerenciamento de usuários.
 *
 * @returns {JSX.Element} Página de administração de usuários
 */
const UsersAdminIndex: React.FC = () => (
  <ProtectedRoute requiredPermissions={ ['admin', 'user_management'] } />
    <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>Administração de Usuários</Card.Title>
        </Card.Header>
        <Card.Content />
          <p>Ferramentas administrativas.</p>
        </Card.Content></Card></div>
  </ProtectedRoute>);

export default UsersAdminIndex;
