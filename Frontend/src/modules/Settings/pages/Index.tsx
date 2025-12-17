/**
 * Página Principal do Módulo Settings
 *
 * @description
 * Página principal do módulo Settings com acesso a todas as categorias de configurações.
 * Exibe categorias de configurações: gerais, IA, usuários e outras.
 *
 * @module modules/Settings/pages/Index
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

/**
 * Componente SettingsHomePage
 *
 * @description
 * Renderiza página principal de configurações com categorias.
 * Permite navegar para diferentes categorias de configurações.
 *
 * @returns {JSX.Element} Página principal de configurações
 */
const SettingsHomePage: React.FC = () => {
  const categories = [
    { id: 'general', name: 'Gerais', route: '/settings/general' },
    { id: 'ai', name: 'IA', route: '/settings/ai' },
    { id: 'users', name: 'Usuários', route: '/settings/users' },
  ];
  return (
            <div className=" ">$2</div><div className="{ (categories || []).map((c: unknown) => (">$2</div>
          <Card key={c.id } />
            <Card.Content />
              <div className=" ">$2</div><div className="font-medium">{c.name}</div>
                <Button size="sm" variant="outline">Abrir</Button></div></Card.Content>
      </Card>
    </>
  ))}
      </div>);};

export default SettingsHomePage;
