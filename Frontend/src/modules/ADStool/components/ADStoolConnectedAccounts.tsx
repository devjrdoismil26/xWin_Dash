/**
 * Componente ADStoolConnectedAccounts - Contas Conectadas do ADStool
 *
 * @description
 * Componente que exibe uma lista de contas de an?ncios conectadas ao ADStool.
 * Mostra informa??es b?sicas de cada conta (nome, plataforma) e status de conex?o.
 * Renderiza em grid responsivo com cards para cada conta.
 *
 * Funcionalidades principais:
 * - Lista de contas conectadas em grid responsivo
 * - Exibi??o de nome e plataforma de cada conta
 * - Badge de status "Conectada"
 * - Suporte a m?ltiplas plataformas
 * - Layout responsivo (1 coluna mobile, 2 tablet, 3 desktop)
 * - Suporte completo a dark mode
 *
 * @module modules/ADStool/components/ADStoolConnectedAccounts
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import ADStoolConnectedAccounts from '@/modules/ADStool/components/ADStoolConnectedAccounts';
 *
 * <ADStoolConnectedAccounts
 *   connectedAccounts={[
 *     { id: '1', name: 'Conta Principal', platform: 'Google Ads' },
 *     { id: '2', name: 'Conta Facebook', platform: 'Facebook Ads' }
 *   ]}
 * / />
 * ```
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';

/**
 * Conta conectada
 *
 * @interface ConnectedAccount
 * @property {string} id - ID ?nico da conta
 * @property {string} name - Nome da conta
 * @property {string} platform - Plataforma da conta (Google Ads, Facebook Ads, etc.)
 */
interface ConnectedAccount {
  id: string;
  name: string;
  platform: string; }

/**
 * Props do componente ADStoolConnectedAccounts
 *
 * @description
 * Propriedades que podem ser passadas para o componente ADStoolConnectedAccounts.
 *
 * @interface ADStoolConnectedAccountsProps
 * @property {ConnectedAccount[]} connectedAccounts - Array de contas conectadas
 */
interface ADStoolConnectedAccountsProps {
  connectedAccounts: ConnectedAccount[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ADStoolConnectedAccounts
 *
 * @description
 * Renderiza uma lista de contas conectadas em grid responsivo. N?o renderiza
 * nada se n?o houver contas conectadas.
 *
 * @component
 * @param {ADStoolConnectedAccountsProps} props - Props do componente
 * @param {ConnectedAccount[]} props.connectedAccounts - Array de contas conectadas
 * @returns {JSX.Element | null} Componente de contas conectadas ou null se vazio
 */
const ADStoolConnectedAccounts: React.FC<ADStoolConnectedAccountsProps> = ({ connectedAccounts
   }) => {
  if (connectedAccounts.length === 0) {
    return null;
  }

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Contas Conectadas</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className="{(connectedAccounts || []).map((account: unknown) => (">$2</div>
            <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><CheckCircle className="w-5 h-5 text-blue-600" /></div><div>
           
        </div><p className="font-medium">{account.name}</p>
                  <Badge variant="outline">{account.platform}</Badge></div><Badge variant="success">Conectada</Badge>
      </div>
    </>
  ))}
        </div>
      </Card.Content>
    </Card>);};

export default ADStoolConnectedAccounts;
